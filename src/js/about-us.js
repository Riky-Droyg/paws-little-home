import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const aboutSwiper = new Swiper('.about-swiper', {
  modules: [Navigation, Pagination],
  direction: 'horizontal',
  loop: false,

  slidesPerView: 1,

  pagination: {
    el: '.about-swiper-pagination',
    dynamicBullets: true,
    clickable: true,
  },

  navigation: {
    nextEl: '.about-swiper-button-next',
    prevEl: '.about-swiper-button-prev',
    disabledClass: 'swiper-button-disabled',
  },

  breakpoints: {
    768: {
      pagination: {
        el: '.about-swiper-pagination',
        dynamicBullets: false,
      },
    },
    1440: {
      pagination: {
        el: '.about-swiper-pagination',
        dynamicBullets: false,
      },
    },
  },

  on: {
    init(swiper) {
      swiper.el.style.visibility = 'visible';
      fixPagination(swiper);
    },
    slideChange(swiper) {
      fixPagination(swiper);
    },
    resize(swiper) {
      fixPagination(swiper);
    },
  },
});

function fixPagination(swiper) {
  const el = swiper.pagination.el;

  el.style.transform = 'none';
  el.style.left = 'auto';
  el.style.position = 'static';
}
