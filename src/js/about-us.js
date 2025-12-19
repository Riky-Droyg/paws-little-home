// import mobile1 from '../img/about-us/webp/mobile/mobile-slide-1-min.webp';
import mobile1x2 from '../img/about-us/webp/mobile/mobile-slide-1@2x-min.webp';
import mobile2 from '../img/about-us/webp/mobile/mobile-slide-2-min.webp';
import mobile2x2 from '../img/about-us/webp/mobile/mobile-slide-2@2x-min.webp';
import mobile3 from '../img/about-us/webp/mobile/mobile-slide-3-min.webp';
import mobile3x2 from '../img/about-us/webp/mobile/mobile-slide-3@2x-min.webp';
import mobile4 from '../img/about-us/webp/mobile/mobile-slide-4-min.webp';
import mobile4x2 from '../img/about-us/webp/mobile/mobile-slide-4@2x-min.webp';
import mobile5 from '../img/about-us/webp/mobile/mobile-slide-5-min.webp';
import mobile5x2 from '../img/about-us/webp/mobile/mobile-slide-5@2x-min.webp';

import tablet1 from '../img/about-us/webp/tablet/tablet-slide-1-min.webp';
import tablet1x2 from '../img/about-us/webp/tablet/tablet-slide-1@2x-min.webp';
import tablet2 from '../img/about-us/webp/tablet/tablet-slide-2-min.webp';
import tablet2x2 from '../img/about-us/webp/tablet/tablet-slide-2@2x-min.webp';
import tablet3 from '../img/about-us/webp/tablet/tablet-slide-3-min.webp';
import tablet3x2 from '../img/about-us/webp/tablet/tablet-slide-3@2x-min.webp';
import tablet4 from '../img/about-us/webp/tablet/tablet-slide-4-min.webp';
import tablet4x2 from '../img/about-us/webp/tablet/tablet-slide-4@2x-min.webp';
import tablet5 from '../img/about-us/webp/tablet/tablet-slide-5-min.webp';
import tablet5x2 from '../img/about-us/webp/tablet/tablet-slide-5@2x-min.webp';

import desktop1 from '../img/about-us/webp/desktop/desktop-slide-1-min.webp';
import desktop1x2 from '../img/about-us/webp/desktop/desktop-slide-1@2x-min.webp';
import desktop2 from '../img/about-us/webp/desktop/desktop-slide-2-min.webp';
import desktop2x2 from '../img/about-us/webp/desktop/desktop-slide-2@2x-min.webp';
import desktop3 from '../img/about-us/webp/desktop/desktop-slide-3-min.webp';
import desktop3x2 from '../img/about-us/webp/desktop/desktop-slide-3@2x-min.webp';
import desktop4 from '../img/about-us/webp/desktop/desktop-slide-4-min.webp';
import desktop4x2 from '../img/about-us/webp/desktop/desktop-slide-4@2x-min.webp';
import desktop5 from '../img/about-us/webp/desktop/desktop-slide-5-min.webp';
import desktop5x2 from '../img/about-us/webp/desktop/desktop-slide-5@2x-min.webp';

import arrowLeft from '../img/SVG-sprite/arrow-left.svg';
import arrowRight from '../img/SVG-sprite/arrow-right.svg';

// const slides = [
//   {
//     mob: `${mobile1} 1x, ${mobile1x2} 2x`,
//     tab: `${tablet1} 1x, ${tablet1x2} 2x`,
//     desk: `${desktop1} 1x, ${desktop1x2} 2x`,
//   },
//   {
//     mob: `${mobile2} 1x, ${mobile2x2} 2x`,
//     tab: `${tablet2} 1x, ${tablet2x2} 2x`,
//     desk: `${desktop2} 1x, ${desktop2x2} 2x`,
//   },
//   {
//     mob: `${mobile3} 1x, ${mobile3x2} 2x`,
//     tab: `${tablet3} 1x, ${tablet3x2} 2x`,
//     desk: `${desktop3} 1x, ${desktop3x2} 2x`,
//   },
//   {
//     mob: `${mobile4} 1x, ${mobile4x2} 2x`,
//     tab: `${tablet4} 1x, ${tablet4x2} 2x`,
//     desk: `${desktop4} 1x, ${desktop4x2} 2x`,
//   },
//   {
//     mob: `${mobile5} 1x, ${mobile5x2} 2x`,
//     tab: `${tablet5} 1x, ${tablet5x2} 2x`,
//     desk: `${desktop5} 1x, ${desktop5x2} 2x`,
//   },
// ];

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// const swiperSlides = document.querySelectorAll(
//   '.about-swiper .about-swiper-slide'
// );

// swiperSlides.forEach((slide, index) => {
//   const picture = slide.querySelector('picture');
//   picture.querySelector('.img-desktop').srcset = slides[index].desk;
//   picture.querySelector('.img-tablet').srcset = slides[index].tab;
//   picture.querySelector('.img-mobile').srcset = slides[index].mob;
// });

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

// const btnPrev = document.querySelector('.about-swiper-button-prev img');
// const btnNext = document.querySelector('.about-swiper-button-next img');
// btnPrev.src = arrowLeft;
// btnNext.src = arrowRight;
