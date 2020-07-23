const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
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
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${
    //   req.user._id
    // }&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
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
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = await User.find({ email: session.customer_email });
  const price = session.line_items[0].amount / 100;

  await Booking.create({ user, tour, price });
};
exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
  res.status(200).json({ received: true });
};
// exports.createBookingCheckout = catchAsyc(async (req, res, next) => {
//   const { tour, user, price } = req.query;
//   if (!tour && !user && !price) return next();
//   await Booking.create({ user, tour, price });
//   res.redirect(req.originalUrl.split('?')[0]);
// });
exports.createbooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
