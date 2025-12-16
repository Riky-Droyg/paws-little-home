import axios from 'axios';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

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
      params: { limit: 5 },
    }
  );

  return response.data.feedbacks;
}
//#endregion

//#region render
function renderFeedbacks(list, feedbacks) {
  const items = feedbacks
    .map(item => {
      const rating = parseFloat(item.rating) || 0;
      const starPercentage = (rating / 5) * 100;

      return `
        <li class="swiper-slide">
          <div class="star-rating" data-rating="${rating}">
            <div class="stars-outer">
              <div class="stars-inner" style="width: ${starPercentage}%"></div>
            </div>
          </div>

          <p class="swiper-slide-feedbacks">${item.description}</p>
          <p class="swiper-slide-author">${item.author}</p>
        </li>
      `;
    })
    .join('');

  list.innerHTML = items;
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

  prevButton.addEventListener('click', () => {
    swiperInstance.slidePrev();
  });

  nextButton.addEventListener('click', () => {
    swiperInstance.slideNext();
  });

  // 👉 оновлюємо стан одразу після ініціалізації
  updateButtonsState();

  // 👉 оновлюємо при кожній зміні слайду
  swiperInstance.on('slideChange', updateButtonsState);
}

//#endregion
