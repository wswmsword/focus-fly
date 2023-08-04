const focusNoJutsu = require("focus-no-jutsu");
const scrollContent = document.getElementById("scroll_content");
const bagel = focusNoJutsu(
  scrollContent, // 根元素
  [...document.getElementsByClassName("scroll_item")], // 列表
  {
    sequence: true, // 打开序列模式
    entry: [{
      node: "#scroll_wrapper", // 从最外层回车进入列表
      type: "keydown",
      key: e => e.key === "Enter",
      if: ({ e: { target: { id } } }) => id === "scroll_wrapper",
    }, {
      node: "#scroll_type", // 从切换加载方式按钮按下“右方向键”和“Tab”进入列表
      type: "keydown",
      key: ({ key }) => ["ArrowRight", "Tab"].includes(key),
      stopPropagation: true,
    }, {
      node: "#scroll_top", // 从“回到顶部”按钮按下“左方向键”、“Tab”、回车和空格进入列表
      type: "keydown",
      key: ({ key }) => ["ArrowLeft", "Tab", "Enter", ' '].includes(key),
      stopPropagation: true, // 阻止冒泡
      target({ e: { key }, list }) {
        if (key === "Enter" || key === ' ') return list[0]; // 按下回车或空格，聚焦列表第一个元素
      },
      on({ key }) {
        if (key === "Enter" || key === ' ') scrollToTop(); // 点击，或者按下了回车或空格时，滚至顶部
      },
    }],
    exit: [{
      key: ({ key }) => key === "ArrowLeft", // 按下“左方向键”退出列表
      target: "#scroll_type", // 从列表退出到“切换加载方式的按钮”
    }, {
      key: ({ key }) => key === "ArrowRight", // 按下“右方向键”退出列表
      target: "#scroll_top", // 从列表退出到“回到顶部”按钮
    }, {
      node: ["#scroll_type", "#scroll_top"], // 点击“切换加载”和“回到顶部”，退出列表
      type: "click",
      target: false, // 退出后焦点保持原位
      on({ target }) {
        if (target.id === "scroll_top") scrollToTop();
      }
    }],
    stopPropagation: true, // 阻止列表的事件冒泡
    onEscape: true, // 按下 Esc 退出列表
    onMove: createOrRemoveItemFocus, // 在列表内移动时，调用 createOrRemoveItemFocus
    removeListenersEachExit: false, // 退出后不移除列表有关的事件
    correctionTarget({ e: { relatedTarget } }) {
      if (relatedTarget == null || !scrollContent.contains(relatedTarget))
        return "#scroll_wrapper"; // 焦点从外部进入列表时，焦点重新矫正到 #scroll_wrapper 上，其它情况，矫正到上一次聚焦的列表元素
    }
  }
);

bagel.addForward("next_wrapper", { // 转发
  node: "#scroll_wrapper",
  key: ({ key, shiftKey }) => (key === "Tab" && !shiftKey),
  target: "#scroll_code",
});

let lastItemFocus = null;
/** 创建或移除列表内单个元素的焦点管理 */
function createOrRemoveItemFocus({ cur }) {

  lastItemFocus?.removeListeners();
  if (cur && cur.id !== "scroll_more") {

    const itemFirst = cur.getElementsByClassName("item_top")[0];
    const itemLast = cur.getElementsByClassName("item_bottom")[0];
    lastItemFocus = focusNoJutsu([itemFirst, itemLast], {
      entry: {
        node: cur,
        type: "keydown",
        key: e => e.key === "Enter",
      },
      exit: {
        key: e => e.key === "Escape",
        stopPropagation: true,
      },
      delayToFocus: true,
      stopPropagation: true,
    });
  }
}

const scrollItems = document.getElementById("scroll_items");
let prevBottomStatus = false;
scrollContent.addEventListener("scroll", onScrollBottom); // 滚动至底部，加载

scroll_type.addEventListener("click", function() {
  const clickTypeNode = document.getElementsByClassName("to_click")[0];
  clickTypeNode.classList.toggle("hidden");
  document.getElementsByClassName("to_scroll")[0].classList.toggle("hidden");
  scroll_more.classList.toggle("hidden");

  if (Array.from(clickTypeNode.classList).includes("hidden")) {
    scrollContent.removeEventListener("scroll", onScrollBottom); // 移除滚动加载
    bagel.updateList([...document.getElementsByClassName("scroll_item"), document.getElementById("scroll_more")]);
  }
  else {
    scrollContent.addEventListener("scroll", onScrollBottom);  // 滚动至底部，加载
    bagel.updateList([...document.getElementsByClassName("scroll_item")]);
  }
});

// 点击触发“加载更多”
scroll_more.addEventListener("click", function(e) {
  const items = generateItems();
  scrollItems.appendChild(items);

  const newList = [...document.getElementsByClassName("scroll_item"), document.getElementById("scroll_more")];
  bagel.updateList(newList);
  e.stopPropagation();
});

scroll_top.addEventListener("click", function(e) {
  scrollToTop();
  e.stopPropagation();
});

function onScrollBottom() {
  const isBottom = Math.abs(scrollContent.scrollHeight - scrollContent.scrollTop - scrollContent.clientHeight) < 1;
  if (isBottom === true && isBottom !== prevBottomStatus) {
    const items = generateItems();
    scrollItems.appendChild(items);

    let newList = [...document.getElementsByClassName("scroll_item")];
    bagel.updateList(newList);
  }
  prevBottomStatus = isBottom;
}

/** 滚动至顶部 */
function scrollToTop() {
  scrollContent.scroll({ top: 0, behavior: "smooth" });
}

/** 生成列表的子元素 */
function generateItems() {
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < 9; ++ i) {
    const item = createTabElement("scroll_item", "商品");
    const top = createTabElement("item_top", "图片");
    const center = document.createElement("div");
    center.classList.add("item_center");
    const avator = createTabElement("item_avator", "店家");
    const avatorR = createTabElement("item_avator_right", "商品名称");
    center.append(avator, avatorR);
    const bottom = createTabElement("item_bottom", "加入购物车");
    item.append(top, center, bottom);
    fragment.appendChild(item);
  }
  return fragment;

  function createTabElement(className, label) {
    const e = document.createElement("div");
    e.classList.add(className);
    e.setAttribute("tabindex", 0);
    e.setAttribute("aria-label", label);
    e.setAttribute("role", "button");
    return e;
  }
}