import Accordion from "accordion-js";


new Accordion(".accordion-container", {
    duration: 300,
    showMultiple: false,  
    collapse: true,   
});
  


document.querySelectorAll(".ac").forEach((item) => {
    const btn = item.querySelector(".ac-trigger");
    const open = item.querySelector(".icon-open");
    const close = item.querySelector(".icon-close");
  
    let isOpen = false;
  
    btn.addEventListener("click", () => {
      isOpen = !isOpen;
  
      if (isOpen) {
          close.style.display = "inline-block";
          open.style.display = "none";
      } else {
          open.style.display = "inline-block";
          close.style.display = "none";
      }
    });
  });
