document.addEventListener('DOMContentLoaded', async () => {
  const list = document.querySelector('.feedbacks-list');
  if (!list) return;

  let swiperInstance; // збережемо екземпляр Swiper, щоб керувати ним

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

    // Ініціалізуємо Swiper БЕЗ navigation
    swiperInstance = new Swiper('.success-content', {
      slidesPerView: 1,
      spaceBetween: 32,
      loop: true,
      pagination: {
        el: document.querySelector('.success-swiper .swiper-navigation'),
        clickable: true,
      },
      // Прибираємо navigation повністю!
      // navigation: { ... } — видали цей блок
      breakpoints: {
        768: { slidesPerView: 2 },
        1440: { slidesPerView: 3 },
      },
    });

    // Тепер вручну додаємо обробники на наші кнопки
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
  } catch (error) {
    console.error('Помилка запиту:', error);
    list.innerHTML = '<li>Не вдалося завантажити відгуки.</li>';
  }
});
