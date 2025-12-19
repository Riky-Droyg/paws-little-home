import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


const refs = {
    orderModal: document.querySelector('.order-modal__backdrop'),
    closeModalBtn: document.querySelector('.order-modal__close-btn'),
    openModalBtn: document.querySelector('.order-modal__open-btn'), // додати клас звідки відкриватиметься модалка
    body: document.body,
    html: document.documentElement,
    form: document.querySelector('form'),
    inputName: document.querySelector("input[name='name']"),
    nameMsg: document.querySelector('#nameMsg'),
    inputPhone: document.querySelector("input[name='phone']"),
    phoneMsg: document.querySelector('#phoneMsg'),
    textareaComment: document.querySelector("textarea[name='comment']"),
    commentMsg: document.querySelector('#commentMsg'),
    submitBtn: document.querySelector('.send-form-btn'),
    animalId: "667ad1b8e4b01a2b3c4d5e55",
    loader: document.querySelector('.loader'),
};

console.log("refs", refs);
console.log("inputName", refs.inputName);
console.log("nameMsg", refs.nameMsg);

function openModal() {
  refs.orderModal.classList.add('is-open');
  refs.body.classList.add('no-scroll');
  refs.html.classList.add('no-scroll');
}

function closeModal() {
  refs.orderModal.classList.remove('is-open');
  refs.body.classList.remove('no-scroll');
  refs.html.classList.remove('no-scroll');
}

// open modal
refs.openModalBtn?.addEventListener('click', (e) => {
  e.preventDefault();
    openModal();
    refs.form.reset();
    updateSubmitBtn();
refs.nameMsg.textContent = '';
refs.phoneMsg.textContent = '';
refs.commentMsg.textContent = '';
refs.inputName.classList.remove('error');
refs.inputPhone.classList.remove('error');
refs.textareaComment.classList.remove('error');

});

// close modal - button x
refs.closeModalBtn?.addEventListener('click', closeModal);

// close modal - backdrop
refs.orderModal?.addEventListener('click', (e) => {
  if (e.target === refs.orderModal) closeModal();
});

// close modal - escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && refs.orderModal.classList.contains('is-open')) {
    closeModal();
  }
});

function showLoader() {
    refs.loader.classList.remove('hidden');
}

function hideLoader() {
    refs.loader.classList.add('hidden');
}

// checking length all fields
function updateSubmitBtn() {
    const nameOK = refs.inputName.value.trim().length >= 3;
    const phoneOK = isPhoneValid(refs.inputPhone.value);
    const commentOK = refs.textareaComment.value.trim().length >= 10;

    refs.submitBtn.disabled = !(nameOK && phoneOK && commentOK);
};

// checking length Name  
refs.inputName?.addEventListener('input', (e) => {
    const value = e.target.value.trim().length;
    refs.nameMsg.textContent = (value < 3 && value > 0) ? 'Мінімум 3 символи' : '';
    refs.nameMsg.classList.toggle('error', value < 3 && value > 0);
    updateSubmitBtn();
});


function normalizePhone(value) {
  // залишаємо тільки цифри
  const digits = value.replace(/\D/g, '');

  // 0961234568 → 380961234568
  if (digits.length === 10 && digits.startsWith('0')) {
    return '38' + digits;
  }

  // 380961234568 → ок
  if (digits.length === 12 && digits.startsWith('380')) {
    return digits;
  }

  return null; // невалідно
}

function isPhoneValid(value) {
  return normalizePhone(value) !== null;
};


// checking length Phone
refs.inputPhone.addEventListener('input', (e) => {
     const value = e.target.value;
  const cleaned = value.replace(/\D/g, '');
  e.target.value = cleaned;

    if (value !== cleaned) {
        refs.phoneMsg.textContent = 'Можна вводити тільки цифри';
        refs.phoneMsg.classList.add('error');
    } else if (cleaned.length > 0 && !isPhoneValid(cleaned)) {
        refs.phoneMsg.textContent = 'Неправильний номер (потрібно 10 або 12 цифр)';
        refs.phoneMsg.classList.add('error');
    } else {
        refs.phoneMsg.textContent = '';
        refs.phoneMsg.classList.remove('error');
    }   
    updateSubmitBtn();
});

// checking length Comment
refs.textareaComment?.addEventListener('input', (e) => {
    const value = e.target.value.trim().length;
    refs.commentMsg.textContent = (value < 10 && value > 0) ? 'Мінімум 10 символів' : '';
    refs.commentMsg.classList.toggle('error', value < 10 && value > 0);
    updateSubmitBtn();
});

// send form
refs.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (refs.submitBtn.disabled) return;

    const formData = {
        name: refs.inputName.value.trim(),
        phone: normalizePhone(refs.inputPhone.value),
        animalId: refs.animalId,
        comment: refs.textareaComment.value.trim(),
    }
    console.log("formData", formData);

    try {
        showLoader();
        const response = await axios.post('https://paw-hut.b.goit.study/api/orders', formData);
        
        hideLoader();

        const orderData = response.data;
        iziToast.success({
            title: 'OK',
            message: 'Форма успішно відправлена',
            position: 'center',
            timeout: 5000,
            backgroundColor:'#EEE9E3', 
            titleColor: '#22c55e',
            messageColor: '#02060A',
            progressBarColor: '#88765C',             
});
        console.log("orderData", orderData);
        refs.form.reset();
        updateSubmitBtn();
        closeModal();
    }
    catch (err) {
        hideLoader();
        iziToast.error({
            title: 'ПОМИЛКА!',
            message: err?.response?.data?.message || err.message || 'Не вдалося відправити форму',
            position: 'center',
            timeout: 5000,
            backgroundColor:'#EEE9E3', 
            titleColor: '#ae0000',
            messageColor: '#02060A',
            progressBarColor: '#88765C',     
        })
}
})

updateSubmitBtn();