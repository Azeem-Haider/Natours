const express = require('express');

const router = express.Router();
const viewController = require('../controllers/viewController');
const authcontroller = require('../controllers/authController');
const bookingsController = require('../controllers/bookingController');

//router.use(viewController.alerts);
router.get(
  '/',
  //bookingsController.createBookingCheckout,
  authcontroller.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authcontroller.isLoggedIn, viewController.getTour);
router.get('/login', authcontroller.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authcontroller.isLoggedIn, viewController.getSignUpForm);
router.get('/me', authcontroller.protect, viewController.getAccount);
router.get('/my-tours', authcontroller.protect, viewController.getMyBookings);
router.post('/submit-user-data', authcontroller.protect, viewController.updateUserData);

module.exports = router;
