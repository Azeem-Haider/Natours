/* eslint-disable */
import '@babel/polyfill';
import { signup } from './signUp';
import { login, logout } from './login.js';
import { displayMap } from './mapBox.js';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
//dom elements
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookbtn = document.getElementById('book-tour');
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await signup(name, email, password, passwordConfirm);
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
if (userDataForm) {
  userDataForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'Data');
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ currentPassword, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
if (bookbtn) {
  bookbtn.addEventListener('click', (e) => {
    e.target.textContent = 'processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
