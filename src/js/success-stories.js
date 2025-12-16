import axios from 'axios';

import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';
import 'swiper/css';

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('.feedbacks-list');
  if (!list) return;

  try {
    const feedbacks = await fetchFeedbacks();
    renderFeedbacks(list, feedbacks);

    const swiperInstance = initSwiper();
    initSwiperButtons(swiperInstance);
  } catch (error) {
    console.error('Помилка запиту:', error);
    list.innerHTML = '<li>Недоступні данні</li>';
  }
});

//#region server
async function fetchFeedbacks() {
  const response = await axios.get(
    'https://paw-hut.b.goit.study/api/feedbacks',
    {
      params: { limit: 7 },
    }
  );

  return response.data.feedbacks;
}
//#endregion

//#region render
function renderFeedbacks(list, feedbacks) {
  const items = feedbacks
    .map(item => {
      const rating = parseFloat(item.rate);
      return `
        <li class="swiper-slide success-swiper-slide">
          <div class="star-rating-container" data-score="${item.rate}"></div>
          <p class="swiper-slide-feedbacks">${item.description}</p>
          <p class="swiper-slide-author">${item.author}</p>
        </li>
      `;
    })
    .join('');

  list.innerHTML = items;

  initRatyStars();
}

function initRatyStars() {
  $('.star-rating-container').each(function () {
    const score = parseFloat($(this).attr('data-score'));

    $(this).raty({
      readOnly: true,
      halfShow: true,
      score: score,
      starType: 'i', // використовувати теги <i>
      starOn: 'fa-solid fa-star', // повна зірка
      starOff: 'fa-regular fa-star', // порожня зірка
      starHalf: 'fa-solid fa-star-half-stroke', // половинка
    });
  });
}
//#endregion

//#region swiper
function initSwiper() {
  return new Swiper('.success-content', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: false, // циклічність
    pagination: {
      el: document.querySelector('.success-swiper .swiper-navigation'),
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1440: { slidesPerView: 2 },
    },
  });
}
//#endregion

//#region buttons
function initSwiperButtons(swiperInstance) {
  const prevButton = document.querySelector('.custom-swiper-prev');
  const nextButton = document.querySelector('.custom-swiper-next');

  if (!prevButton || !nextButton) return;

  const updateButtonsState = () => {
    prevButton.disabled = swiperInstance.isBeginning;
    nextButton.disabled = swiperInstance.isEnd;

    prevButton.classList.toggle('is-disabled', swiperInstance.isBeginning);
    nextButton.classList.toggle('is-disabled', swiperInstance.isEnd);
  };

  //подія
  prevButton.addEventListener('click', () => {
    swiperInstance.slidePrev();
  });
  //подія
  nextButton.addEventListener('click', () => {
    swiperInstance.slideNext();
  });

  // оновлення після ініціалізації
  updateButtonsState();

  // оновлення при кожній зміні
  swiperInstance.on('slideChange', updateButtonsState);
}
//#endregion
