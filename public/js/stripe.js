/* eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H0c2kJs7b80fR8MAAHsAqM9CwAzcs3MwvWJUlj41AtjAhxGWOTn06Tad2VsfmwQQFJeMK3ehrXbGzhfSEhTzmLH00FfRCo4xb'
);
//
export const bookTour = async (tourid) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourid}`);
    console.log(session);
    //charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
