const menuBtn = document.getElementById("menu_btn");
const menuBody = document.getElementById("menu");

// 5～29 行为焦点管理和控制的部分，包含了触发入口和出口时的行为——切换菜单状态，toggleMenu
focusFly(menuBody, ["#hot_anchor", "#scroll_anchor"], { // L:5
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
}); // L:29

/** 切换菜单时的样式变化 */
function toggleMenu() {
  menuBtn.classList.toggle("opened");
  menuBody.classList.toggle("opened");
  menuBtn.ariaExpanded = menuBtn.classList.contains("opened") ? true : false;
}

// function toggleMenu() {
//   menuBtn.classList.toggle("opened");
//   menuBody.classList.toggle("opened");
//   menuBtn.ariaExpanded = menuBtn.classList.contains("opened") ? true : false;
// }



// focusNoJutsu(menuBody, ["#dialog_anchor", "#player_anchor"], {
//   onEscape: toggleMenu,
//   removeListenersEachEnter: true,
//   delayToFocus: true,
//   entry: {
//     node: menuBtn,
//     on: toggleMenu,
//   },
//   exit: [{
//     node: "#dialog_anchor",
//     type: "keydown",
//     key: e => e.key === "Tab" && e.shiftKey,
//     on: toggleMenu,
//   }, {
//     node: "#player_anchor",
//     type: "keydown",
//     key: e => e.key === "Tab" && !e.shiftKey,
//     on: toggleMenu,
//     target: "#nav_link",
//   }, {
//     type: "outlist",
//     on: toggleMenu,
//     target: ({ e }) => e?.relatedTarget?.id?.includes("h-") ? false : menuBtn,
//     if: ({ e }) => e.relatedTarget !== menuBtn,
//   }, {
//     node: menuBtn,
//     on: toggleMenu,
//     target: false,
//   }],
// });

// focusNoJutsu(menuBody, ["#dialog_anchor", "#player_anchor"], {
//   onEscape: toggleMenu,
//   entry: {
//     node: menuBtn,
//     on: toggleMenu,
//     onExit: true,
//   },
//   exit: [{
//     node: "#dialog_anchor",
//     type: "keydown",
//     key: e => e.key === "Tab" && e.shiftKey,
//     on: toggleMenu,
//   }, {
//     node: "#player_anchor",
//     type: "keydown",
//     key: e => e.key === "Tab" && !e.shiftKey,
//     on: toggleMenu,
//     target: "#nav_link",
//   }, {
//     type: "outlist",
//     if: () => false,
//   }],
// });