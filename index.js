
const getActiveElement = () => document.activeElement;
const querySelector = str => document.querySelector(str);

const element = e => typeof e === "string" ? querySelector(e) : e;

/** 滴答 */
const tick = function(fn) {
  setTimeout(fn, 0);
};

const tryFocus = function(e) {
  e.focus();
  const curActiveE = getActiveElement();
  if (curActiveE !== e) tick(e.focus);
};

/** 按键是否是 esc */
const isEscapeEvent = function (e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
};

/** 按键是否是 tab */
const isTabEvent = function(e) {
  return e.key === 'Tab' || e.keyCode === 9;
};

/** 是否是向前的 tab */
const isKeyForward = function(e) {
  return isTabEvent(e) && !e.shiftKey;
};

/** 是否是向后的 tab */
const isKeyBackward = function(e) {
  return isTabEvent(e) && e.shiftKey;
};

/** 触发键盘事件，进入下一个焦点 */
const nextKeyFocus = function(head, tail, every, border, activeIndex, onEscape) {
  return e => {
    const targ = e.target;
    if (isEscapeEvent(e)) {
      onEscape();

    }
    else if (isKeyForward(e)) {
      if (every) {
        const itemsLen = items.length;
        const nextI = activeIndex + 1;
        activeIndex = border ? Math.min(itemsLen, nextI) : nextI;
        activeIndex %= itemsLen;
        items[activeIndex].focus();
      } else {
        if (targ === tail) {
          e.preventDefault();
          if (!border) head.focus();
        }
      }
    }
    else if (isKeyBackward(e)) {
      if (every) {
        const itemsLen = items.length;
        const nextI = activeIndex - 1;
        activeIndex = border ? Math.max(0, nextI) : nextI;
        activeIndex = (activeIndex + itemsLen) % itemsLen;
        items[activeIndex].focus();
      } else {
        if (targ === head) {
          e.preventDefault();
          if (!border) tail.focus();
        }
      }
    }
  }
};

const focusLoop = (container, items, options = {}) => {

  const {
    every,
    /** 是否设置边界，最后一个元素的下一个元素不是第一个元素，第一个元素的上一个元素不是最后一个元素 */
    border,
    customForwardKey,
    customBackwardKey,
    trigger,
    enter = {},
    exit = {},
    onEscape,
  } = options;

  const {
    selector: enterSelector,
    on: onEnter,
  } = enter;
  const {
    selector: exitSelector,
    on: onExit,
  } = exit;

  /** 按下 esc 的反馈，如果未设置，则取触发退出的函数 */
  const _onEscape = onEscape || onExit;
  const disabledEsc = onEscape === false;

  /** 触发打开焦点的元素 */
  let _trigger = element(trigger || enterSelector);

  const _container = element(container);
  const _items = items.map(item => {
    let _item = element(item);
    if (_item == null) console.warn(`没有找到元素 ${item}。`);
    return _item;
  }).filter(item => item != null);
  const head = _items[0];
  const tail = _items.slice(-1)[0];

  if (head == null || tail == null)
    throw("至少需要包含两个可以聚焦的元素。");

  /** 活动元素在 items 中的编号，打开 every 生效 */
  let activeIndex = 0;

  _container.addEventListener("keydown", nextKeyFocus(head, tail, every, border, activeIndex, function(e) {
    if (disabledEsc) return;
    if (_onEscape) _onEscape(e);
    if (_trigger == null) {
      throw("未指定触发器，将不会聚焦触发器，您可以在调用 focusLoop 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter，如果您使用了选项 enter，您也可以设置 enter.selector 而不指定选项 trigger 或者调用函数 enter。");
    }
    tryFocus(_trigger);
  }));

  if (enterSelector && onEnter) {
    _trigger.addEventListener("click", e => {
      onEnter(e);
      tryFocus(head);
    })
  }

  if (exitSelector && onExit) {
    const exit = querySelector(exitSelector);
    exit.addEventListener("click", e => {
      onExit(e);
      if (_trigger == null) {
        throw("未指定触发器，将不会聚焦触发器，您可以在调用 focusLoop 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter，如果您使用了选项 enter，您也可以设置 enter.selector 而不指定选项 trigger 或者调用函数 enter。");
      }
      tryFocus(_trigger);
    });
  }

  return {
    /** 进入循环，聚焦 */
    enter() {
      _trigger = _trigger || getActiveElement();
      head.focus();
    },
    /** 退出循环，聚焦触发元素 */
    exit() {
      if (_trigger == null) {
        throw("未指定触发器，将不会聚焦触发器，您可以在调用 focusLoop 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter。");
      }
      _trigger.focus();
    },
    activeIndex,
  };
};

export default focusLoop;