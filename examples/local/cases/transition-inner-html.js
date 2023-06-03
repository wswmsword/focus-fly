const dialogHtml5 = `
<div
  id="dialog_5"
  aria-modal="true"
  aria-labelledby="modal-title"
  class="dialog centre transition-out"
  role="dialog"
  tabindex="0">
  <h3 id="modal-title_5">吃一颗糖</h3>
  <ul>
    <li><a id="firstFocusA_5" href="#">椰蓉酥心糖</a></li>
    <li><a href="#">不二家棒棒糖</a></li>
    <li><a href="#">樱花软糖</a></li>
    <li><a href="#">大白兔奶糖</a></li>
    <li><a href="#">夹心巧克力</a></li>
  </ul>
  <div class="ctrls">
    <button id="close_5">Close</button>
    <button id="lastFocusBtn_5">OK</button>
  </div>
</div>
`;

const placeHolder5 = document.getElementById("place_holder_5");
let addedTransitionListener = false;
let exitTransition5 = false;

const bagel_5 = focusBagel("#dialog_5", ["#firstFocusA_5", "#lastFocusBtn_5"], {
  entry: {
    node: "#open_5",
    on() {
      exitTransition5 = false;
      placeHolder.innerHTML = dialogHtml5;
      const dialog = document.getElementById("dialog_5");
      setTimeout(() => {
        dialog.classList.remove("transition-out");
        dialog.classList.add("transition-in");
      }, 0);
    },
  },
  exit: {
    node: "#close_5",
    on() {
      exitTransition5 = false;
      const dialog = document.getElementById("dialog_5");
      dialog.classList.remove("transition-in");
      dialog.classList.add("transition-out");
      !addedTransitionListener && dialog.addEventListener("transitionend", () => {
        placeHolder.innerHTML = '';
      });
    },
  },
  // delayToFocus(fn) { // 传入函数
  //   setTimeout(fn, 1111);
  // },
  // delayToFocus: () => new Promise(resolve => setTimeout(resolve, 1111)), // 或者传入 promise
});