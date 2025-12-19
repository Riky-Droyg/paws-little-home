import axios from 'axios';
import { API_ENDPOINTS, refs } from './pets-list';
import iziToast from 'izitoast';
import { openModal } from './order-modal';
const MAX_LIMIT = 30;
const backdrop = document.querySelector('.backdrop');
const modalContent = document.querySelector('.js-modal-content');
const modalCloseBtn = document.querySelector('.js-close-btn');
refs.animalsList.addEventListener('click', handleModalDEtailsOpened);
modalCloseBtn.addEventListener('click', hideModal);
backdrop.addEventListener('click', event => {
  if (event.target === event.currentTarget) {
    hideModal();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    hideModal();
  } else {
    return;
  }
});
async function handleModalDEtailsOpened(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }
  const id = event.target.dataset.id;
  try {
    const animal = await getAnimalById(id);
    const modalMarkup = renderAnimal(animal);
    showModal();
    modalContent.innerHTML = modalMarkup;
    const modalConfirmBtn = document.querySelector('#modal-btn');
    modalConfirmBtn.addEventListener('click', () => {
      hideModal();
      openModal();
    });
  } catch (error) {
    throw error;
  }
}

async function getAnimalById(id) {
  try {
    let currentPage = 1;
    let totalPages = Infinity;
    while (currentPage <= totalPages) {
      const { data } = await axios.get(
        `https://paw-hut.b.goit.study${API_ENDPOINTS.ANIMALS}?page=${currentPage}&limit=${MAX_LIMIT}`
      );
      if (totalPages === Infinity) {
        totalPages = Math.ceil(data.totalItems / MAX_LIMIT);
      }
      const animal = data.animals.find(animal => animal._id === id);
      if (animal) {
        return animal;
      }
      currentPage += 1;
    }
    throw new Error('Animal not found in the list.');
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

function renderAnimal(animal) {
  const markup = `
    <img src="${animal.image}" alt="${animal.name}" class="modal__image">
    <div class="modal__animal-description">
    <p class="modal__specie">${animal.species}</p>
    <h3 class="modal__name">${animal.name}</h3>
    <div class="modal__info">
        <p class="modal__age">${animal.age}</p>
        <p class="modal__gender">${animal.gender}</p>
    </div>
    <h4 class="modal__heading">Опис:</h4>
    <p class="modal__details">${animal.description}</p>
<h4 class="modal__heading">Здоров’я:</h4>
<p class="modal__health-descr">${animal.healthStatus}</p>
<h4 class="modal__heading">Поведінка:</h4>
<p class="modal__behavior">${animal.behavior}</p>
<button type="button" class="modal__btn" id="modal-btn">Взяти додому</button>
</div>
`;
  return markup;
}
function showModal() {
  backdrop.classList.add('is-open');
}
function hideModal() {
  backdrop.classList.remove('is-open');
}
