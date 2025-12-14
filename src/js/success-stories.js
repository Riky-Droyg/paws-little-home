//HTTP запит
import axios from 'axios';
import swiper from 'swiper';

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('.feedbacks-list');
  if (!list) return;

  try {
    const response = await fetch(
      'https://paw-hut.b.goit.study/api/feedbacks?limit=5'
    );

    if (!response.ok) {
      throw new Error(`Помилка: ${response.status}`);
    }

    const data = await response.json();
    const feedbacks = data.feedbacks;

    const items = feedbacks
      .map(item => {
        const rating = parseFloat(item.rating) || 0; // поле з бекенду, наприклад 4.5
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

    // Ініціалізуємо Swiper
    new Swiper('.success-content', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1440: { slidesPerView: 3 },
      },
    });
  } catch (error) {
    console.error('Помилка запиту:', error);
    list.innerHTML = '<li>Не вдалося завантажити відгуки.</li>';
  }
});
