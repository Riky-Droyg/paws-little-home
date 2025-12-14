import axios from 'axios';
import swiper from 'swiper';

/* #region  global variables */
let ITEMS_PER_PAGE = 0;

axios.defaults.baseURL = 'https://paw-hut.b.goit.study';
export const API_ENDPOINTS = {
  FEEDBACKS: '/api/feedbacks',
};

const BREAKPOINTS = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};

/* #endregion */

document.addEventListener('DOMContentLoaded', initHomepage);
