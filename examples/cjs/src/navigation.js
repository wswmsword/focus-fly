const fFocus = require("focus-fly");

const menuBtn = document.getElementById("menu_btn");
const menuBody = document.getElementById("menu");

// 5～29 行为焦点管理和控制的部分，包含了触发入口和出口时的行为——切换菜单状态，toggleMenu
fFocus(menuBody, ["#hot_anchor", "#scroll_anchor"], { // L:5
  onEscape: toggleMenu,
  entry: {
    node: menuBtn,
    on: toggleMenu,
    onExit: true,
    target: ({ list }) => list[0],
  },
  exit: [{
    node: ({ head }) => head,
    type: "keydown",
    key: "Shift-Tab",
    on: toggleMenu,
  }, {
    node: ({ tail }) => tail,
    type: "keydown",
    key: "Tab",
    on: toggleMenu,
    target: "#nav_link",
  }, {
    type: "outlist",
    on: toggleMenu,
    target: ({ e }) => e?.relatedTarget?.id?.includes("h-") ? false : menuBtn,
  }],
}); // L:29

/** 切换菜单时的样式变化 */
function toggleMenu() {
  menuBtn.classList.toggle("opened");
  menuBody.classList.toggle("opened");
  menuBtn.ariaExpanded = menuBtn.classList.contains("opened") ? true : false;
}