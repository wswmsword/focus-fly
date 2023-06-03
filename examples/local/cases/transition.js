const dialog4 = document.getElementById("dialog_4");
const first4 = document.getElementById("firstFocusA_4");
const last4 = document.getElementById("lastFocusBtn_4");
const open4 = document.getElementById("open_4");
const close4 = document.getElementById("close_4");

let exitTransition = false;

const bagel_4 = focusBagel(dialog4, [first4, last4], {
  entry: {
    node: open4,
    on() {
      exitTransition = false;
      dialog4.classList.add("openedDialog");
      dialog4.classList.remove("closedDialog");
      setTimeout(() => {
        dialog4.classList.remove("transition-out");
        dialog4.classList.add("transition-in");
      }, 0);
    },
  },
  exit: {
    node: close4,
    on() {
      exitTransition = true;
      dialog4.classList.remove("transition-in");
      dialog4.classList.add("transition-out");
    },
  },
});

dialog4.addEventListener("transitionend", () => {
  if (exitTransition) {
    dialog4.classList.remove("openedDialog");
    dialog4.classList.add("closedDialog");
  }
});