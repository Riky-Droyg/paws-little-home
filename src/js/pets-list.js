import axios from 'axios';
import iziToast from 'izitoast';

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
let currentCategory = '';
let currentPage = 0;
let totalPages = 0;
export const refs = {
  categoriesList: document.querySelector('.js-categories'),
  animalsList: document.querySelector('.js-animals-list'),
  loader: document.querySelector('.loader'),
  loadMoreBtn: document.querySelector('.js-more-btn'),
};
/* #endregion */
document.addEventListener('DOMContentLoaded', initHomepage);
window.addEventListener('resize', handleResize);
refs.categoriesList.addEventListener('click', handleAnimalsFilteredByCategory);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClicked);
function setItemsPerPage() {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.desktop) {
    ITEMS_PER_PAGE = 9;
  } else {
    ITEMS_PER_PAGE = 8;
  }
}
let lastItemsPerPage = ITEMS_PER_PAGE;
async function handleResize() {
  setItemsPerPage();
  if (ITEMS_PER_PAGE !== lastItemsPerPage) {
    lastItemsPerPage = ITEMS_PER_PAGE;
    currentPage = 1;
    await loadAnimals(currentCategory, currentPage);
    currentPage += 1;
  }
}
async function loadAnimals(category, page) {
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
        renderAnimals(animals); 
        checkAndToggleLoadMoreBtn();
    } catch (error) {
      hideLoadMoreBtn();
        throw error; 
    } finally {
        hideLoader();
    }
}
/* #region  handler-functions */
async function initHomepage() {
  currentCategory = 'Всі';
  currentPage = 1;
  setItemsPerPage();
  lastItemsPerPage = ITEMS_PER_PAGE;
  clearAnimals();
  showLoader();
  hideLoadMoreBtn();
  try {
    const categories = await getCategories();
    renderCategories(categories);
    const { animals, totalItems } = await getAnimals(currentPage);
    totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    renderAnimals(animals);
    updateCategoryButtons('Всі');
    currentPage += 1;
    checkAndToggleLoadMoreBtn();
  } catch (error) {
    throw error;
  } finally {
    hideLoader();
  }
}
async function handleAnimalsFilteredByCategory(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }
    setItemsPerPage();
  lastItemsPerPage = ITEMS_PER_PAGE;
    currentPage = 1;
    clearAnimals();
    hideLoadMoreBtn();
  const category = event.target.textContent.trim();
  currentCategory = category;
  try {
      await loadAnimals(currentCategory, currentPage); 
      updateCategoryButtons(category);
      currentPage +=1;
  }
  catch(error) {
    throw error;
  }
  finally {
    hideLoader();
  }
  }
async function handleLoadMoreBtnClicked() {
   hideLoadMoreBtn();
  setItemsPerPage();
try {
  await loadAnimals(currentCategory, currentPage);
  currentPage+=1;
}
catch(error) {
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
  refs.animalsList.insertAdjacentHTML('beforeend', markup);
}
function clearAnimals() {
  refs.animalsList.innerHTML = '';
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
