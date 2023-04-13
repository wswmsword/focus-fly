/** Object.prototype.toString.call 快捷方式 */
const objToStr = obj => Object.prototype.toString.call(obj);

/** document.activeElement 的快捷方式 */
const getActiveElement = () => document.activeElement;

/** document.querySelector 的快捷方式 */
const querySelector = str => document.querySelector(str);

/** 通过字符串查找节点，或者直接返回节点 */
const element = e => typeof e === "string" ? querySelector(e) : e;

/** 滴答 */
const tick = function(fn) {
  setTimeout(fn, 0);
};

/** 是否是 input 可 select 的元素 */
const isSelectableInput = function(node) {
  return (
    node.tagName &&
    node.tagName.toLowerCase() === 'input' &&
    typeof node.select === 'function'
  );
};

/** 聚焦，如果是 input，则聚焦后选中 */
const focus = function(e) {
  e.focus();
  if (isSelectableInput(e))
    e.select();
  return true;
};

/** 尝试聚焦，如果聚焦失效，则下个事件循环再次聚焦 */
const tryFocus = function(e) {
  if (e == null) tick(() => e && focus(e))
  else focus(e);
};

/** 是否按下了 enter */
const isEnterEvent = function(e) {
  return e.key === "Enter" || e.keyCode === 13;
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
const isTabForward = function(e) {
  return isTabEvent(e) && !e.shiftKey;
};

/** 是否是向后的 tab */
const isTabBackward = function(e) {
  return isTabEvent(e) && e.shiftKey;
};

/** 和封面相关的聚焦行为 */
const focusCover = function(enabledCover, target, container, enterKey, exitKey, onEscape, head, tail) {
  if (!enabledCover) return false; // 尚未打开封面选项
  /** 当前事件是否在封面内部 */
  const isInnerCover = target !== container;
  if (isInnerCover) { // 当前聚焦封面内部
    if (exitKey && exitKey(e)) { // 退出封面内部，进入封面
      return focus(container);
    }
    else if (isTabForward(e)) {
      return focus(head);
    }
    else if (isTabBackward(e)) {
      return focus(container);
    }
  } else { // 当前聚焦封面
    if (enterKey && enterKey(e)) { // 进入封面内部
      return focus(head);
    }
    else if (exitKey && exitKey(e)) { // 退出封面，聚焦触发器
      return onEscape();
    }
    else if (isTabForward(e)) { // 在封面按下 tab
      return focus(tail); // 聚焦 tail 后一个元素（未调用 e.preventDefault()）
    }
    else if (isEnterEvent(e)) { // 在封面按下 enter
      return focus(head);
    }
  }
  return false;
};

/** 手动聚焦下一个元素 */
const focusNextManually = (subNodes, container, activeIndex, isClamp, enabledCover, onEscape, isForward, isBackward, enterKey, exitKey) => e => {

  const focusedCover = focusCover(enabledCover, e.target, container, enterKey, exitKey, onEscape, subNodes[0], subNodes.slice(-1)[0]);
  if (focusedCover) return;

  if ((exitKey ?? isEscapeEvent)(e)) {
    onEscape();
    return;
  }

  if ((isForward ?? isTabForward)(e)) {
    const itemsLen = subNodes.length;
    const nextI = activeIndex + 1;
    activeIndex = isClamp ? Math.min(itemsLen - 1, nextI) : nextI;
    activeIndex %= itemsLen;
    e.preventDefault();
    focus(subNodes[activeIndex]);
  }
  else if ((isBackward ?? isTabBackward)(e)) {
    const itemsLen = subNodes.length;
    const nextI = activeIndex - 1;
    activeIndex = isClamp ? Math.max(0, nextI) : nextI;
    activeIndex = (activeIndex + itemsLen) % itemsLen;
    e.preventDefault();
    focus(subNodes[activeIndex]);
  }
};

/** 按下 tab，自动聚焦下个元素 */
const focusNextKey = (head, tail, container, isClamp, enabledCover, onEscape, enterKey, exitKey) => e => {
  const targ = e.target;

  const focusedCover = focusCover(enabledCover, targ, container, enterKey, exitKey, onEscape, head, tail);
  if (focusedCover) return;

  if ((exitKey ?? isEscapeEvent)(e)) { // 聚焦触发器
    onEscape();
    return;
  }

  if (isTabForward(e)) {
    if (targ === tail) {
      e.preventDefault();
      if (!isClamp) focus(head);
    }
  }
  else if (isTabBackward(e)) {
    if (targ === head) {
      e.preventDefault();
      if (!isClamp) focus(tail);
    }
  }
};

/** 在遮罩的后一个元素按下 shift-tab */
const handleCoverShiftTab = container => e => {
  if (isTabBackward(e)) {
    e.preventDefault();
    focus(container);
  }
};

/** 生成按下 esc 的行为 */
const genEscFocus = (disabledEsc, onEscape, trigger) => e => {
  if (disabledEsc) return;
  if (onEscape) onEscape(e);
  if (trigger == null) {
    console.warn("未指定触发器，将不会聚焦触发器，您可以在调用 focusBagel 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter，如果您使用了选项 enter，您也可以设置 enter.selector 而不指定选项 trigger 或者调用函数 enter。");
    return;
  }
  return focus(trigger);
};

/** 添加焦点需要的事件监听器 */
const addEventListeners = function(rootNode, handleFocus, exitSelector, onExit, trigger, coverShiftTab) {
  rootNode.addEventListener("keydown", handleFocus);

  // 跳出循环的触发器的点击事件
  if (exitSelector && onExit) {
    const exit = element(exitSelector);
    exit.addEventListener("click", e => {
      onExit(e);
      if (trigger == null) {
        console.warn("未指定触发器，将不会聚焦触发器，您可以在调用 focusBagel 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter，如果您使用了选项 enter，您也可以设置 enter.selector 而不指定选项 trigger 或者调用函数 enter。");
        return;
      }
      focus(trigger)
    });
  }

  if (coverShiftTab)
    coverShiftTab.addEventListener("keydown", handleCoverShiftTab(rootNode));
};

const focusBagel = (rootNode, subNodes, options = {}) => {

  const {
    /** move: 指定可以聚焦的元素，聚焦 subNodes 内的元素 */
    manual,
    /** move: 是否循环，设置后，尾元素的下个焦点是头元素，头元素的上个焦点是尾元素 */
    loop,
    /** move: 自定义前进焦点函数 */
    isForward,
    /** move: 自定义后退焦点函数 */
    isBackward,
    /** focus/blur: 触发器，如果使用 focusBagel.enter 则不用设置，如果使用 enter.selector 则不用设置 */
    trigger,
    /** focus: 触发触发器的配置 */
    enter = {},
    /** blur: 触发退出触发器的配置 */
    exit = {},
    /** blur: 按下 esc 的行为，如果未设置，则取 exit.on */
    onEscape,
    /** cover: 封面，触发触发器后首先聚焦封面，而不是子元素，可以在封面按下 enter 进入子元素
     * TODO: cover 配置选项，例如是否锁 tab（默认不锁）
     */
    cover = false,
    /** 延迟挂载非触发器元素的事件，可以是一个 promise，可以是一个接收所有事件监听器作为入参的普通函数 */
    delayListeners,
    /** TODO: 子元素锁 tab */
  } = options;

  const {
    selector: enterSelector,
    on: onEnter,
    key: enterKey,
  } = enter;
  const {
    selector: exitSelector,
    on: onExit,
    key: exitKey,
  } = exit;

  /** 封面选项是否为对象 */
  const isObjCover = objToStr(cover) === "[object Object]";
  const {
    shiftTabNode: coverShiftTab
  } = isObjCover ? cover : {};

  const promiseDelay = objToStr(delayListeners) === "[object Promise]";
  const commonDelay = objToStr(delayListeners) === "[object Function]";

  /** 是否已经打开封面选项 */
  const enabledCover = isObjCover || cover === true;

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  // 自定义前进或后退焦点函数，则设置 manual 为 true
  const _manual = !!(isForward || isBackward || manual);

  /** 按下 esc 的反馈，如果未设置，则取触发退出的函数 */
  const _onEscape = onEscape ?? onExit;
  const disabledEsc = _onEscape === false || _onEscape == null;

  /** 触发打开焦点的元素 */
  let _trigger = element(trigger || enterSelector);

  const onEscFocus = genEscFocus(disabledEsc, _onEscape, _trigger);

  const _rootNode = element(rootNode);
  const _subNodes = subNodes.map(item => {
    let _item = element(item);
    if (_item == null) console.warn(`没有找到元素 ${item}。`);
    return _item;
  }).filter(item => item != null);
  const head = _subNodes[0];
  const tail = _subNodes.slice(-1)[0];

  if (head == null || tail == null)
    throw("至少需要包含两个可以聚焦的元素。");

  /** 活动元素在 subNodes 中的编号，打开 manual 生效 */
  let activeIndex = 0;

  // 触发器点击事件
  if (enterSelector && onEnter) {
    _trigger.addEventListener("click", async e => {
      const focusNext = function() {
        if (enabledCover) tryFocus(_rootNode); // 如果打开封面，首先聚焦封面
        else tryFocus(head); // 如果未打开封面，聚焦内部聚焦列表
      };
      onEnter(e);
      if (promiseDelay) {
        await delayListeners;
        addEventListeners();
        focusNext();
      }
      else if (commonDelay) {
        delayListeners(() => {
          addEventListeners();
          focusNext();
        });
      }
      else focusNext();
    })
  }

  // 在焦点循环中触发聚焦
  const handleFocus = _manual ?
    focusNextManually(_subNodes, _rootNode, activeIndex, isClamp, enabledCover, onEscFocus, isForward, isBackward, enterKey, exitKey) :
    focusNextKey(head, tail, _rootNode, isClamp, enabledCover, onEscFocus, enterKey, exitKey);

  // 添加除 trigger 以外其它和焦点相关的事件监听器
  addEventListeners(_rootNode, handleFocus, exitSelector, onExit, _trigger, coverShiftTab);

  return {
    /** 进入循环，聚焦 */
    enter() {
      _trigger = _trigger || getActiveElement();
      focus(head);
    },
    /** 退出循环，聚焦触发元素 */
    exit() {
      if (_trigger == null) {
        console.warn("未指定触发器，将不会聚焦触发器，您可以在调用 focusBagel 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter。");
        return;
      }
      focus(_trigger);
    },
    i: () => activeIndex,
  };
};

export default focusBagel;