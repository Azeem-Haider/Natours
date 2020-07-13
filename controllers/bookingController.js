const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingsModel');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsyc = require('../utils/catchAsyc');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsyc(async (req, res, next) => {
  //get currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  //create session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${
      req.user._id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [tour.imageCover],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //response
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createBookingCheckout = catchAsyc(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ user, tour, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
exports.createbooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
