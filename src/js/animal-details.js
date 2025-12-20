import axios from 'axios'
import { API_ENDPOINTS, refs } from './pets-list'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css';
import { openModal } from './order-modal'
import { btnTop } from './scroll-btn';

const MAX_LIMIT = 30

const modalRefs = {
  backdrop: document.querySelector('.backdrop'),
  modalContent: document.querySelector('.js-modal-content'),
  closeBtn: document.querySelector('.js-close-btn'),
  body: document.body,
  html: document.documentElement,
}
function onEscKeydown(e) {
  if (e.key === 'Escape') hideDetailsModal();
}
function showDetailsModal(markup = '') {
  if (!modalRefs.backdrop || !modalRefs.modalContent) return
  document.addEventListener('keydown', onEscKeydown);
  modalRefs.backdrop.classList.add('is-open')
  modalRefs.body.classList.add('no-scroll')
  modalRefs.html.classList.add('no-scroll')
  btnTop.classList.add('is-hidden');
  modalRefs.modalContent.innerHTML = markup
}

function hideDetailsModal() {
  if (!modalRefs.backdrop || !modalRefs.modalContent) return
  modalRefs.backdrop.classList.remove('is-open')
  modalRefs.body.classList.remove('no-scroll')
  modalRefs.html.classList.remove('no-scroll')
  modalRefs.modalContent.innerHTML = ''
  document.removeEventListener('keydown', onEscKeydown)
  btnTop.classList.remove('is-hidden')
}

refs.animalsList?.addEventListener('click', handleModalDetailsOpened)

modalRefs.closeBtn?.addEventListener('click', hideDetailsModal)

modalRefs.backdrop?.addEventListener('click', e => {
  if (e.target === modalRefs.backdrop) hideDetailsModal()
})

async function handleModalDetailsOpened(event) {
  const btn = event.target.closest('button[data-id]')
  if (!btn) return
  btnTop.classList.add('is-hidden');
document.addEventListener('keydown', onEscKeydown);
  const id = btn.dataset.id

  try {
    const animal = await getAnimalById(id)
    showDetailsModal(renderAnimal(animal))

    const modalConfirmBtn = modalRefs.modalContent.querySelector('#modal-btn')
    modalConfirmBtn?.addEventListener(
      'click',
      () => {
        hideDetailsModal()
        openModal()
      },
      { once: true }
    )
  } catch (error) {
    throw error
  }
}

async function getAnimalById(id) {
  try {
    let currentPage = 1
    let totalPages = Infinity

    while (currentPage <= totalPages) {
      const { data } = await axios.get(
        `https://paw-hut.b.goit.study${API_ENDPOINTS.ANIMALS}?page=${currentPage}&limit=${MAX_LIMIT}`
      )

      if (totalPages === Infinity) {
        totalPages = Math.ceil(data.totalItems / MAX_LIMIT)
      }

      const animal = data.animals.find(a => a._id === id)
      if (animal) return animal

      currentPage += 1
    }

    throw new Error('Animal not found in the list.')
  } catch (error) {
    iziToast.error({
      title: '❌',
      titleColor: '#fafafb',
      message: `Sorry something went wrong`,
      messageColor: '#fafafb',
      backgroundColor: '#ef4040',
      position: 'topRight',
    })
    throw error
  }
}

function renderAnimal(animal) {
  return `
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
  `
}
