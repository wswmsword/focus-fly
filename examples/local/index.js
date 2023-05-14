
/**
 * 1. 默认弹窗（无动画，无需 innerHtml，无需 display）
 * 2. 触发后需要 innerHtml 的弹窗
 * 3. 触发后需要 display 的弹窗
 * 4. 动画弹窗
 * 5. 触发后需要 innerHtml 的动画弹窗
 * 6. 有封面的列表
 */

const dialog = document.getElementById("dialog");

// const isForward = e => {
//   if (e.ctrlKey && e.key === "n") return true;
// };

// const isBackward = e => {
//   if (e.ctrlKey && e.key === "p") return true;
// }


const bagel = focusBagel(dialog, ["#firstFocusA", "#lastFocusBtn"], {
  loop: false,
  enter: {
    node: "#open",
    on() {
      dialog.classList.add("openedDialog");
      dialog.classList.remove("closedDialog");
    },
  },
  exit: {
    node: "#close",
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