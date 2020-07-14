const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingsModel');
const catchAsyc = require('../utils/catchAsyc');
const AppError = require('../utils/appError');

exports.getOverview = catchAsyc(async (req, res, next) => {
  //Get tour data from collection
  // if (res.locals.user) {
  //   const bookings = await Booking.find({ user: res.locals.user._id });
  //   const tourids = bookings.map((el) => el.tour);
  //   const tours = await Tour.find({ _id: { $nin: tourids } });
  //   return res.status(200).render('overview', {
  //     title: 'All Tours',
  //     tours,
  //   });
  // }
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsyc(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no Tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginForm = catchAsyc(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'login',
  });
});
exports.getSignUpForm = catchAsyc(async (req, res, next) => {
  res.status(200).render('signUp', {
    title: 'sign up',
  });
});
exports.getAccount = catchAsyc(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'your account',
  });
});
exports.updateUserData = catchAsyc(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'your account',
    user: updateUser,
  });
});
exports.getMyBookings = catchAsyc(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('bookings');
  const tours = user.bookings.map((el) => el.tour);
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
