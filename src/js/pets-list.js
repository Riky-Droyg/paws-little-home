import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

/* #region  global variables */
let ITEMS_PER_PAGE = 8;
axios.defaults.baseURL = 'https://paw-hut.b.goit.study';

export const API_ENDPOINTS = {
  CATEGORIES: '/api/categories',
  ANIMALS: '/api/animals',
};

const BREAKPOINTS = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};

export const refs = {
  categoriesList: document.querySelector('.js-categories'),
  animalsList: document.querySelector('.js-animals-list'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.js-more-btn'),
  sectionPetsList: document.querySelector('#pets-list'),
};

const container = document.getElementById('tui-pagination-container');
let currentCategory = '';
let currentPage = 0;
let totalPages = 0;
let paginationInstance = null;
let lastMode = isPaginationMode();

/* #endregion */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
function setLoadingState(isLoading) {
  refs.sectionPetsList.classList.toggle('is-loading', isLoading);
}
function isPaginationMode() {
  return window.innerWidth >= BREAKPOINTS.tablet;
}

function setItemsPerPage() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.desktop) {
    ITEMS_PER_PAGE = 9;
  } else {
    ITEMS_PER_PAGE = 8;
  }
}
function createPaginationOptions(totalItems) {
  return {
    totalItems,
    itemsPerPage: ITEMS_PER_PAGE,
    visiblePages: 4,
    page: currentPage,
    centerAlign: true,
    template: {
      page: '<button type="button" class="tui-page-btn">{{page}}</button>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<button type="button" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}"></span>' +
        '</button>',
      disabledMoveButton:
        '<button type="button" class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</button>',
      moreButton:
        '<button type="button" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</button>',
    },
  };
}

function destroyPagination() {
  if (!paginationInstance) return;

  paginationInstance.off();
  container.innerHTML = '';
  paginationInstance = null;
}
function initPagination(totalItems) {
  if (paginationInstance) {
    destroyPagination();
  }
  paginationInstance = new Pagination(
    container,
    createPaginationOptions(totalItems)
  );
  paginationInstance.on('afterMove', async event => {
    currentPage = event.page;
    await loadAnimals(currentCategory, currentPage);
    refs.sectionPetsList.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
}
function togglePagination(totalItems) {
  if (isPaginationMode()) {
    hideLoadMoreBtn();
    container.classList.remove('is-hidden');
    initPagination(totalItems);
  } else {
    destroyPagination();
    container.classList.add('is-hidden');

    currentPage = 2;
    checkAndToggleLoadMoreBtn();
  }
}

/* #region  handler-functions */
async function initHomepage() {
  hideLoadMoreBtn();
  clearAnimals();
  currentCategory = 'Всі';
  currentPage = 1;
  setItemsPerPage();
  lastMode = isPaginationMode();
  try {
    const categories = await getCategories();
    renderCategories(categories);
    const totalItems = await loadAnimals(currentCategory, currentPage);
    updateCategoryButtons('Всі');
    togglePagination(totalItems);
  } catch (error) {
    throw error;
}
}
async function handleResize() {
  const prevMode = lastMode;
  const prevItemsPerPage = ITEMS_PER_PAGE;
  setItemsPerPage();
  const currentMode = isPaginationMode();
  if (prevMode !== currentMode || prevItemsPerPage !== ITEMS_PER_PAGE) {
    clearAnimals();
    currentPage = 1;
    const totalItems = await loadAnimals(currentCategory, currentPage);
    togglePagination(totalItems);
    lastMode = currentMode;
  }
}
async function handleAnimalsFilteredByCategory(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }
  setItemsPerPage();
  currentPage = 1;
  const category = event.target.textContent.trim();
  currentCategory = category;
  hideLoadMoreBtn();
  destroyPagination();
  clearAnimals();
  try {
    const totalItems = await loadAnimals(currentCategory, currentPage);
    updateCategoryButtons(category);
    togglePagination(totalItems);
    refs.animalsList.scrollIntoView({
      behavior: 'smooth',
    });
  } catch (error) {
    throw error;
}
}
async function handleLoadMoreBtnClicked() {
  if (isPaginationMode()) return;
  refs.loadMoreBtn.classList.remove('load-more-btn:active');
  setItemsPerPage();
  try {
    await loadAnimals(currentCategory, currentPage);
    // window.scrollBy({
    //   behavior: 'smooth'
    // });
    currentPage += 1;
  } catch (error) {
    throw error;
  }
}
/* #endregion */

/* #region  API requests */
async function getCategories() {
  try {
    const { data } = await axios.get(API_ENDPOINTS.CATEGORIES);
    return data;
  } catch (error) {
    iziToast.error({
      title: '❌',
      titleColor: '#fafafb',
      message: `Sorry something went wrong`,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      position: 'topRight',
    });
    throw error;
  }
}
async function getAnimals(page = 1) {
  try {
    const { data } = await axios.get(
      `${API_ENDPOINTS.ANIMALS}?page=${page}&limit=${ITEMS_PER_PAGE}`
    );
    return data;
  } catch (error) {
    iziToast.error({
      title: '❌',
      titleColor: '#fafafb',
      message: `Sorry something went wrong`,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      position: 'topRight',
    });
    throw error;
  }
}
async function getAnimalsByCategory(category, page = 1) {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CATEGORIES}`);
    const categories = response.data;
    const targetCategory = categories.find(cat => cat.name === category);
    if (!targetCategory) {
      iziToast.error({
        title: '❌',
        titleColor: '#fafafb',
        message: 'Category was not found',
        messageColor: '#fafafb',
        backgroundColor: '#ef4040',
        position: 'topRight',
      });
      return { animals: [], totalItems: 0 };
    }
    const categoryId = targetCategory._id;
    const { data } = await axios.get(
      `${API_ENDPOINTS.ANIMALS}?page=${page}&limit=${ITEMS_PER_PAGE}&categoryId=${categoryId}`
    );
    return data;
  } catch (error) {
    iziToast.error({
      title: '❌',
      titleColor: '#fafafb',
      message: `Sorry something went wrong`,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      position: 'topRight',
    });
    throw error;
  }
}
/* #endregion */
async function loadAnimals(category, page) {
  setLoadingState(true);
  showLoader();
  try {
    let data;
    const targetCategory = category || currentCategory;
    if (targetCategory === 'Всі') {
      data = await getAnimals(page);
    } else {
      data = await getAnimalsByCategory(targetCategory, page);
    }
    const { animals, totalItems } = data;
    totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const animalsMarkup = renderAnimals(animals);
    if (isPaginationMode()) {
      refs.animalsList.innerHTML = animalsMarkup;
    } else {
      refs.animalsList.insertAdjacentHTML('beforeend', animalsMarkup);
    }
    await new Promise(requestAnimationFrame);
    return totalItems;
  } catch (error) {
    hideLoadMoreBtn();
    throw error;
  } finally {
    hideLoader();
    setLoadingState(false);
  }
}
/* #region  renderfunctions */
function renderCategories(categories) {
  const allCategories = ['Всі', ...categories];
  const markup = allCategories
    .map(
      category => `<li class="pets-list__category">
   <button class="pets-list__category-btn" type="button">${
     category.name || 'Всі'
   }</button>
 </li>`
    )
    .join('');
  refs.categoriesList.innerHTML = markup;
}
function updateCategoryButtons(activeCategoryName) {
  const buttons = document.querySelectorAll('.pets-list__category-btn');
  buttons.forEach(btn => {
    btn.classList.remove('pets-list__category-btn--active');
    if (btn.textContent === activeCategoryName) {
      btn.classList.add('pets-list__category-btn--active');
    }
  });
}
function renderAnimals(animals) {
  const markup = animals
    .map(({ _id, name, image, species, age, gender, behavior, categories }) => {
      const categoriesMarkup = categories
        .map(
          category =>
            `<li class="pets-list__card--category">${category.name}</li>`
        )
        .join('');
      return `
            <li class="pets-list__card">
            <img class = "pets-list__card--image" src="${image}" alt="${name}" "lazy-loading">
        <p class="pets-list__card--specie">${species}</p>
        <h3 class="pets-list__card--name">${name}</h3>
        <ul class="pets-list__card--categories-list">
        ${categoriesMarkup}
        </ul>
        <div class = "pets-list__card--info">
        <p class="pets-list__card--age">${age}</p>
        <p class="pets-list__card--gender">${gender}</p>
        </div>
        <p class="pets-list__card--behavior">${behavior}</p>
        <button type="button" class="pets-list__card--btn js-card-btn" data-id="${_id}">Дізнатись більше</button>
        </li>`;
    })
    .join('');
  return markup;
}

function clearAnimals() {
  refs.animalsList.innerHTML = '';
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function showLoader() {
  refs.loader.classList.remove('is-hidden');
}
function hideLoader() {
  refs.loader.classList.add('is-hidden');
}
function checkAndToggleLoadMoreBtn() {
  if (currentPage < totalPages) {
    showLoadMoreBtn();
  } else {
    hideLoadMoreBtn();
  }
}
/* #endregion */

document.addEventListener('DOMContentLoaded', initHomepage);
window.addEventListener('resize', debounce(handleResize, 300));
refs.categoriesList.addEventListener('click', handleAnimalsFilteredByCategory);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClicked);
