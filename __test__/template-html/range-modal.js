export default `
<button id="open">打开一包糖</button>
<button id="walk1">走两步</button>
<div
  id="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  class="centre"
  role="dialog"
  tabindex="0">
  <h2 id="modal-title">吃一颗糖</h2>
  <ul>
    <li><a id="firstFocusA" href="#">椰蓉酥心糖</a></li>
    <li><a href="#">不二家棒棒糖</a></li>
    <li><a href="#">樱花软糖</a></li>
    <li><a href="#">大白兔奶糖</a></li>
    <li><a href="#">夹心巧克力</a></li>
  </ul>
  <div class="ctrls">
    <button id="close">Close</button>
    <button id="lastFocusBtn">OK</button>
  </div>
  <button id="walk3">走两步</button>
</div>
<button id="walk2">走两步</button>
`;