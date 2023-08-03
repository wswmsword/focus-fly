import focusNoJutsu from "focus-no-jutsu";

const menuBtn = document.getElementById("menu_btn");
const menuBody = document.getElementById("menu");

// 5～28 行为焦点管理和控制的部分，包含了触发入口和出口时的行为——切换菜单状态，toggleMenu
focusNoJutsu(menuBody, ["#hot_anchor", "#scroll_anchor"], { // L:5
  onEscape: toggleMenu,
  entry: {
    node: menuBtn,
    on: toggleMenu,
    onExit: true,
  },
  exit: [{
    node: ({ head }) => head,
    type: "keydown",
    key: e => e.key === "Tab" && e.shiftKey,
    on: toggleMenu,
  }, {
    node: ({ tail }) => tail,
    type: "keydown",
    key: e => e.key === "Tab" && !e.shiftKey,
    on: toggleMenu,
    target: "#nav_link",
  }, {
    type: "outlist",
    on: toggleMenu,
    target: ({ e }) => e?.relatedTarget?.id?.includes("h-") ? false : menuBtn,
  }],
}); // L:28

/** 切换菜单时的样式变化 */
function toggleMenu() {
  menuBtn.classList.toggle("opened");
  menuBody.classList.toggle("opened");
  menuBtn.ariaExpanded = menuBtn.classList.contains("opened") ? true : false;
}