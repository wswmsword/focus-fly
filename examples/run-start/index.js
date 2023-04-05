
const dialog = document.getElementById("dialog");

// const isForward = e => {
//   if (e.ctrlKey && e.key === "n") return true;
// };

// const isBackward = e => {
//   if (e.ctrlKey && e.key === "p") return true;
// }


const loop = focusLoop(dialog, ["#firstFocusA", "#lastFocusBtn"], {
  loop: false,
  enter: {
    selector: "#open",
    on() {
      dialog.classList.add("openedDialog");
      dialog.classList.remove("closedDialog");
    },
  },
  exit: {
    selector: "#close",
    on() {
      dialog.classList.remove("openedDialog");
      dialog.classList.add("closedDialog");
    },
  },
  // isForward,
  // isBackward,
});

// document.querySelector("#open").addEventListener("click", e => {
//   dialog.classList.add("openedDialog");
//   dialog.classList.remove("closedDialog");
//   loop.enter();
// })