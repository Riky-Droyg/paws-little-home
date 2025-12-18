const modalMenuHeader = document.querySelector('.modal-menu');
const buttonHeaderBurger = document.querySelector('.header__burger');
const links = document.querySelectorAll('.modal-menu__nav a');
const header = document.querySelector('.header');

function isOpen() {
  return modalMenuHeader.classList.contains('modal-menu--open');
}

function openMenu() {
  modalMenuHeader.classList.add('modal-menu--open');
  buttonHeaderBurger.classList.add('is-open');
  buttonHeaderBurger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('no-scroll');

  header?.classList.remove('header__blur');
}

function closeMenu() {
  modalMenuHeader.classList.remove('modal-menu--open');
  buttonHeaderBurger.classList.remove('is-open');
  buttonHeaderBurger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');

  header?.classList.add('header__blur');
}

function toggleMenu() {
  isOpen() ? closeMenu() : openMenu();
}

buttonHeaderBurger.addEventListener('click', e => {
  e.stopPropagation();
  toggleMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isOpen()) closeMenu();
});

document.addEventListener('click', e => {
  if (!isOpen()) return;

  const clickedBurger = e.target.closest('.header__burger');
  const clickedInsidePanel = e.target.closest('.modal-menu__container');

  if (!clickedBurger && !clickedInsidePanel) closeMenu();
});

links.forEach(link => link.addEventListener('click', closeMenu));
