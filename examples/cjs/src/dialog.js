const focusBagel = require("focus-fly");

const dialog = document.getElementById("dialog");
const mask = document.getElementById("dialog_mask");
const entry = document.getElementById("open");
// 6～18 行为焦点管理的部分，管理了焦点的入口、出口，以及焦点在列表内移动的范围
focusBagel(dialog, ["#firstFocusBtn", "#close"], { // L:6
  loop: false,
  entry: {
    node: entry,
    on: openDialog,
    target: ({ list }) => list[0],
  },
  exit: {
    node: ["#close", "#firstFocusBtn", "#confirm"],
    on: closeDialog,
    type: ["click", "outlist"]
  },
  onEscape: true,
}); // L:19

// 下面的两个函数和焦点无关，和样式或其它逻辑有关，这些代码在实际开发中，可以和上面的焦点部分分开，或者可以像本例中，把这些代码集成到焦点管理中

/** 打开弹窗，设置打开样式，设置 ARIA */
function openDialog() {
  dialog.classList.add("openedDialog");
  dialog.classList.remove("closedDialog");
  mask.classList.remove("closed_mask");
  entry.ariaExpanded = true;
}

/** 关闭弹窗，设置关闭样式，设置 ARIA */
function closeDialog() {
  dialog.classList.remove("openedDialog");
  dialog.classList.add("closedDialog");
  mask.classList.add("closed_mask");
  entry.ariaExpanded = false;
}