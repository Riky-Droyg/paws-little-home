import axios from 'axios';

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
    list.innerHTML = '<li>Не вдалося завантажити відгуки.</li>';
  }
});

/* =======================
   SERVER
======================= */
async function fetchFeedbacks() {
  const response = await axios.get(
    'https://paw-hut.b.goit.study/api/feedbacks',
    {
      params: { limit: 5 },
    }
  );

  return response.data.feedbacks;
}

/* =======================
   RENDER
======================= */
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

//#region swiper
function initSwiper() {
  return new Swiper('.success-content', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    pagination: {
      el: document.querySelector('.success-swiper .swiper-navigation'),
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1440: { slidesPerView: 3 },
    },
  });
}
//#endregion

//#region buttons
function initSwiperButtons(swiperInstance) {
  const prevButton = document.querySelector('.custom-swiper-prev');
  const nextButton = document.querySelector('.custom-swiper-next');

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      swiperInstance.slidePrev();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      swiperInstance.slideNext();
    });
  }
}
//#endregion
