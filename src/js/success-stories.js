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
      // Переконуємося, що рейтинг - це число (напр. 4.5)
      const rating = parseFloat(item.rating);
      return `
        <li class="swiper-slide">
          <div class="star-rating-container" data-score="${rating}"></div>
          <p class="swiper-slide-feedbacks">${item.description}</p>
          <p class="swiper-slide-author">${item.author}</p>
        </li>
      `;
    })
    .join('');

  list.innerHTML = items;

  // Тільки ТУТ запускаємо зірки
  initRatyStars();
}

function initRatyStars() {
  $('.star-rating-container').each(function () {
    const score = $(this).data('score');

    $(this).raty({
      readOnly: true,
      halfShow: true,
      score: score,
      number: 5, // Явно вказуємо 5 зірок
      starType: 'img',
      // Використовуємо стабільні прямі посилання на активи
      starOn:
        'https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png',
      starOff:
        'https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png',
      starHalf:
        'https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png',
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
      1440: { slidesPerView: 2 }, //не міняємо
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

  // оновлення після ініціалізації
  updateButtonsState();

  // оновлення при кожній зміні
  swiperInstance.on('slideChange', updateButtonsState);
}
//#endregion
