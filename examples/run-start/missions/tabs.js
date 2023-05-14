
const tabs = document.getElementById("tab_list");

const tabList = ["#tab_1", "#tab_2", "#tab_3", "#tab_4", "#tab_5"];
const tabsBagel = focusBagel(tabs, tabList, {
  onClick: onFocus,
  next: {
    key: e => e.key === "ArrowRight",
    on: onFocus
  },
  prev: {
    key: e => e.key === "ArrowLeft",
    on: onFocus
  },
  exit: [{
    key: e => e.key === "Tab" && !e.shiftKey,
    target: "#tags_code",
  }, {
    key: e => e.key === "Tab" && e.shiftKey,
    target: "#dialog_code",
  }],
  enter: [{
    node: "#dialog_code",
    key: e => e.key === "Tab" && !e.shiftKey,
    type: "keydown",
  }, {
    node: "#tags_code",
    key: e => e.key === "Tab" && e.shiftKey,
    type: "keydown",
  }],
  removeListenersEachExit: false,
});

function onFocus({ prev, cur, prevI, curI }) {
  if (curI === prevI) return;
  prev.setAttribute("aria-selected", "false");
  cur.setAttribute("aria-selected", "true");
  const prevPanel = document.getElementById("tabpanel_" + (prevI + 1));
  const curPanel = document.getElementById("tabpanel_" + (curI + 1));
  prevPanel.classList.add('is-hidden');
  curPanel.classList.remove('is-hidden');
}