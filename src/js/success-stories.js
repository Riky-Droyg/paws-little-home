import axios from 'axios';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import 'css-star-rating/css/star-rating.css';

import Raty from 'raty-js';
import 'raty-js/src/raty.css';
import starOff from '/star-empty.svg';
import starOn from '/star.svg';
import starHalf from '/star-half.svg';
import cancelOn from 'raty-js/src/images/cancel-on.png?url';
import cancelOff from 'raty-js/src/images/cancel-off.png?url';

const feedbackApi = axios.create({
  baseURL: 'https://paw-hut.b.goit.study/api/feedbacks',
});

const LIMIT = 10;
const PREFETCH_BEFORE_END = 1;

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function pickItems(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.feedbacks)) return data.feedbacks;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function hasMoreFromResponse(data, items, page) {
  const totalPages =
    data?.totalPages ?? data?.pagination?.totalPages ?? data?.meta?.totalPages;

  if (Number.isFinite(totalPages)) return page < totalPages;

  const totalItems =
    data?.totalItems ??
    data?.total ??
    data?.pagination?.totalItems ??
    data?.meta?.totalItems;

  if (Number.isFinite(totalItems)) return page * LIMIT < totalItems;

  return items.length === LIMIT;
}

function slideTpl(item) {
  const name = esc(item?.author || 'Анонім');
  const text = esc(item?.description || 'Коментар відсутній');

  const scoreNum = Number(item?.rate);
  const score = Number.isFinite(scoreNum) ? scoreNum : 0;

  return `<div class="swiper-slide success-stories__slide">
    <div class="success-stories__wrapper">
        <div class="js-rating" data-score="${score}"></div>
        <p class="success-stories__slide-text">${text}</p>
    </div>
    <h3 class="success-stories__slide-title">${name}</h3>
</div>`;
}

const ratingMap = new WeakMap();

function initRatings(scope) {
  scope.querySelectorAll('.js-rating').forEach(el => {
    if (ratingMap.has(el)) return;

    const score = Number(el.dataset.score) || 0;

    const r = new Raty(el, {
      path: '',
      starOn,
      starOff,
      starHalf,
      cancelOn,
      cancelOff,
      half: true,
      halfShow: true,
      readOnly: true,
      score,
    });

    r.init();
    ratingMap.set(el, r);
  });
}

async function fetchPage(page) {
  const { data } = await feedbackApi.get('/', {
    params: { limit: LIMIT, page },
  });
  const items = pickItems(data);
  const hasMore = hasMoreFromResponse(data, items, page);
  return { items, hasMore };
}

async function initSuccessStories() {
  const root = document.querySelector('.success-stories');
  if (!root) return;

  const slidesEl = root.querySelector('.success-stories__slides');
  if (!slidesEl) return;

  let page = 1;
  let isLoading = false;
  let hasMore = true;

  const first = await fetchPage(page);
  hasMore = first.hasMore;

  if (!first.items.length) {
    root.classList.add('success-stories--empty');
    slidesEl.innerHTML = '';
    return;
  }

  slidesEl.innerHTML = first.items.map(slideTpl).join('');
  initRatings(slidesEl);

  async function loadNext(s) {
    if (!hasMore || isLoading) return;
    isLoading = true;

    try {
      page += 1;
      const next = await fetchPage(page);
      hasMore = next.hasMore;

      if (!next.items.length) {
        hasMore = false;
        return;
      }

      const pagEl = s.pagination?.el;
      if (pagEl) pagEl.classList.add('is-updating');

      s.appendSlide(next.items.map(slideTpl));
      s.update();

      initRatings(s.el);

      s.pagination.render();
      s.pagination.update();

      if (pagEl) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => pagEl.classList.remove('is-updating'));
        });
      }
    } catch (e) {
      page -= 1;
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  new Swiper('.success-stories__swiper', {
    direction: 'horizontal',
    loop: false,
    slidesPerView: 1,
    pagination: {
      el: '.success-stories__pagination',
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
    navigation: {
      nextEl: '.success-stories__btn--next',
      prevEl: '.success-stories__btn--prev',
      disabledClass: 'swiper-button-disabled',
    },
    slidesPerView: 1,
    spaceBetween: 32,
    breakpoints: {
      768: { slidesPerView: 2 },
    },
    on: {
      slideChange(s) {
        const total = s.slides.length;
        const idx = s.activeIndex;
        if (idx >= total - 1 - PREFETCH_BEFORE_END) loadNext(s);
      },
      async reachEnd(s) {
        await loadNext(s);
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSuccessStories().catch(console.error);
});
