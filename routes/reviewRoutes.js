const express = require('express');
const authController = require('../controllers/authController');
const reviewControler = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewControler.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewControler.setTourUserIds,
    reviewControler.createReview
  );
router
  .route('/:id')
  .get(reviewControler.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewControler.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewControler.deleteReview
  );
module.exports = router;
