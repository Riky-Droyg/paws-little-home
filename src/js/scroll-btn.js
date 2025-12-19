const btnTop = document.querySelector("#scrollToTop");
const btnBottom = document.querySelector("#scrollToBottom");

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY; 
  const windowHeight = window.innerHeight; 
  const fullHeight = document.documentElement.scrollHeight; 
  if (scrollTop > 100) {
    btnTop.classList.remove("is-hidden");
  } else {
    btnTop.classList.add("is-hidden");
  }
  if (scrollTop + windowHeight < fullHeight - 100) {
    btnBottom.classList.remove("is-hidden");
  } else {
    btnBottom.classList.add("is-hidden");
  }
}
);
btnTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
btnBottom.addEventListener("click", () => {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
});