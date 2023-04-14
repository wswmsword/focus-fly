const dialogHtml = `
<div id="dialog_2" aria-modal="true" aria-labelledby="modal-title" class="dialog centre" role="dialog"
tabindex="0">
<h3 id="modal-title_2">吃一颗糖</h3>
<ul>
  <li><a id="firstFocusA_2" href="#">椰蓉酥心糖</a></li>
  <li><a href="#">不二家棒棒糖</a></li>
  <li><a href="#">樱花软糖</a></li>
  <li><a href="#">大白兔奶糖</a></li>
  <li><a href="#">夹心巧克力</a></li>
</ul>
<div class="ctrls">
  <button id="close_2">Close</button>
  <button id="lastFocusBtn_2">OK</button>
</div>
</div>
`;

const placeHolder = document.getElementById("place_holder");

const bagel_2 = focusBagel("#dialog_2", ["#firstFocusA_2", "#lastFocusBtn_2"], {
  enter: {
    selector: "#open_2",
    on() {
      placeHolder.innerHTML = dialogHtml;
    },
  },
  exit: {
    selector: "#close_2",
    on() {
      placeHolder.innerHTML = '';
    },
  },
  delayToFocus: () => new Promise(resolve => setTimeout(resolve, 1111)), // 传入 promise
  // delayToFocus(fn) { // 或者传入函数
  //   setTimeout(fn, 1111);
  // },
});