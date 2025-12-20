

export const btnTop = document.querySelector("#scrollToTop");
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY; 
  if (scrollTop > 100) {
    btnTop.classList.remove("is-hidden");
  } else {
    btnTop.classList.add("is-hidden");
  }
}
);
btnTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});