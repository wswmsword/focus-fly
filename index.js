import { objToStr, isObj, getActiveElement, element, tick, isSelectableInput, isEnterEvent, isEscapeEvent, isTabForward, isTabBackward, findLowestCommonAncestorNode } from "./utils";
let isDemo = false;
/** 聚焦，如果是 input，则聚焦后选中 */
const focus = function(e) {
  e.focus();
  if (isSelectableInput(e))
    e.select();
  return true;
};

/** 尝试聚焦，如果聚焦失效，则下个事件循环再次聚焦 */
const tickFocus = function(e) {
  if (e == null) tick(() => e && focus(e));
  else focus(e);
};

/** 手动聚焦下一个元素 */
const focusSubNodesManually = (subNodes, activeIndex, isClamp, handleEsc, isForward, isBackward, onForward, onBackward, coverNode) => e => {
  if (e.target === coverNode) return;
  else e.stopImmediatePropagation(); // 防止封面响应键盘事件
  e.stopImmediatePropagation(); // 防止封面响应键盘事件
  
  const handledEsc = handleEsc(e);
  if (handledEsc) return;

  if ((isForward ?? isTabForward)(e)) {
    onForward?.(e);
    const itemsLen = subNodes.length;
    const nextI = activeIndex + 1;
    activeIndex = isClamp ? Math.min(itemsLen - 1, nextI) : nextI;
    activeIndex %= itemsLen;
    e.preventDefault();
    focus(subNodes[activeIndex]);
  }
  else if ((isBackward ?? isTabBackward)(e)) {
    onBackward?.(e);
    const itemsLen = subNodes.length;
    const nextI = activeIndex - 1;
    activeIndex = isClamp ? Math.max(0, nextI) : nextI;
    activeIndex = (activeIndex + itemsLen) % itemsLen;
    e.preventDefault();
    focus(subNodes[activeIndex]);
  }
};

/** 按下 tab，以浏览器的行为聚焦下个元素 */
const focusSubNodes = (head, tail, isClamp, handleEsc, onForward, onBackward, coverNode) => e => {
  const targ = e.target;
  if (targ === coverNode) return;
  else e.stopImmediatePropagation(); // 防止封面响应键盘事件

  const handledEsc = handleEsc(e);
  if (handledEsc) return;

  if (isTabForward(e)) {
    onForward?.(e);
    if (targ === tail) {
      e.preventDefault();
      if (!isClamp) focus(head);
    }
  }
  else if (isTabBackward(e)) {
    onBackward?.(e);
    if (targ === head) {
      e.preventDefault();
      if (!isClamp) focus(tail);
    }
  }
};

/** 添加焦点需要的事件监听器 */
const addEventListeners = function(rootNode, subNodesHandler, coverNode, coverHandler, isDefaultExitCover, tail, tailHandler, clickRootTailHandler, clickRootExitHandler) {

  // 聚焦根节点的键盘事件，例如 tab 或其它自定义组合键
  rootNode.addEventListener("keydown", subNodesHandler);

  /** 点击退出列表 */
  rootNode.addEventListener("click", clickRootExitHandler);
 
  /** 封面的事件 */
  coverNode?.addEventListener("keydown", coverHandler);

  if (isDefaultExitCover) {

    /** 尾部元素聚焦后的事件，用于返回封面 */
    tail?.addEventListener("focus", tailHandler);

    /** subNodes 点击事件，用于配合 tail focus */
    rootNode.addEventListener("click", clickRootTailHandler);
  }

  return true;
};

/** 获取关键节点 */
const getNodes = function(rootNode, subNodes, coverNode) {
  const _subNodes = subNodes.map(item => element(item)).filter(item => item != null);
  const head = _subNodes[0];
  const tail = _subNodes.slice(-1)[0];
  const _rootNode = element(rootNode) ?? findLowestCommonAncestorNode(head, tail);
  const _coverNode = coverNode === true ? _rootNode : element(coverNode);

  return {
    rootNode: _rootNode,
    subNodes: _subNodes,
    head,
    tail,
    coverNode: _coverNode,
  };
};

const focusBagel = (...props) => {
  const offset = 0 - (props[0] instanceof Array);
  const rootNode = props[0 + offset];
  const subNodes = props[1 + offset];
  const options  = props[2 + offset] ?? {};
  const {
    /** move: 指定可以聚焦的元素，聚焦 subNodes 内的元素 */
    manual,
    /** move: 是否循环，设置后，尾元素的下个焦点是头元素，头元素的上个焦点是尾元素 */
    loop,
    /** move: 自定义前进焦点函数 */
    forward,
    /** move: 自定义后退焦点函数 */
    backward,
    /** focus/blur: 触发器，如果使用 focusBagel.enter 则不用设置，如果使用 enter.selector 则不用设置 */
    trigger,
    /** focus: 触发触发器的配置 */
    enter = {},
    /** blur: 触发退出触发器的配置 */
    exit = {},
    /** blur: 按下 esc 的行为，如果未设置，则取 exit.on */
    onEscape,
    /** cover: 封面，触发触发器后首先聚焦封面，而不是子元素，可以在封面按下 enter 进入子元素 */
    cover = false,
    /** 延迟挂载非触发器元素的事件，可以是一个返回 promise 的函数，可以是一个接收回调函数的函数 */
    delayToFocus,
    /** 每次触发 exit 是否移除事件 */
    removeListenersEachExit = true,
    /** 用于内部调试 */
    demo = false,
  } = options;
  isDemo = demo;

  const {
    /** 封面节点 */
    node: coverNode,
    enterKey: coverEnterKey,
    onEnter: onEnterCover,
    exit: exitCover,
  } = isObj(cover) ? cover : { node: !!cover ? (rootNode || true) : null };

  /** 是否已经打开封面选项 */
  const enabledCover = !!coverNode;

  /** 入口们 */
  const enters = [].concat(enter).filter(o => o != null);

  /** 默认入口 */
  let _trigger = element(trigger || enters[0].node);

  /** 退出封面，封面的出口们 */
  const exitsCover = [].concat(exitCover).filter(e => e != null).map(e => ({
    ...e,
    target: e.target ?? _trigger,
  }));

  /** 是否使用默认的离开封面方法，也即 tab 和 shift-tab */
  const isDefaultExitCover = enabledCover && exitCover.length === 0;

  // 无 node 则监听 rootNode keydown
  // 有 node 则监听 rootNode click，同时监听 rootNode keydown
  // 有 target 则聚焦 target，无但有封面，则聚焦封面，无封面则聚焦入口
  const escapeExit = objToStr(onEscape) === "[object Function]" ? {
    node: null,
    key: isEscapeEvent,
    on: onEscape,
    target: enabledCover ? coverNode : _trigger,
  } : null;
  const tempExits = [escapeExit].concat(exit).filter(o => o != null);
  const setKeyExit = tempExits.some(e => e.node == null); // 是否设置了不需要点击、直接按键盘的退出
  /** 出口们，列表的出口们，subNodes 的出口们 */
  const exits = setKeyExit ? tempExits : [{
    ...tempExits[0],
    key: tempExits[0].key ?? isEscapeEvent,
    node: null,
  }].concat(tempExits);

  /** 按下 esc 的反馈，如果未设置，则取触发退出的函数 */
  const _onEscape = onEscape ?? exits[0].on;
  const disabledEsc = _onEscape === false || _onEscape == null;

  const {
    key: isForward,
    on: onForward,
  } = isObj(forward) ? forward : { key: forward };

  const {
    key: isBackward,
    on: onBackward,
  } = isObj(backward) ? backward : { key: backward };

  const {
    rootNode: _rootNode,
    subNodes: _subNodes, head, tail,
    coverNode: _coverNode,
  } = getNodes(rootNode, subNodes, coverNode);

  const isFunctionDelay = objToStr(delayToFocus) === "[object Function]";
  const delayRes = isFunctionDelay && delayToFocus(() => {});
  const promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]";
  const callbackDelay = isFunctionDelay && !promiseDelay;
  const commonDelay = (
    (head == null || tail == null) ||
    (enabledCover && _coverNode == null)) &&
    !promiseDelay && !callbackDelay;
  const isDelay = promiseDelay || callbackDelay || commonDelay;

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  // 自定义前进或后退焦点函数，则设置 manual 为 true
  const _manual = !!(isForward || isBackward || manual);

  /** 活动元素在 subNodes 中的编号，打开 manual 生效 */
  let activeIndex = 0;

  /** 是否已添加监听事件 */
  let addedListeners = false;

  /** 是否通过 cover 进入的 subNodes */
  let trappedFromCover = false;

  // 入口点击事件
  for (let enter of enters) {
    const { node: origin, on, key, disableClick } = enter;
    const node = element(origin);
    if (!disableClick)
      node?.addEventListener("click", e => enterTriggerHandler(e, on));
    key && node?.addEventListener("keydown", e => {
      if (key(e)) {
        e.preventDefault();
        enterTriggerHandler(e, on);
      }
    });
  }

  // 不用延迟聚焦
  if (!isDelay)
    loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);

  return {
    /** 进入循环，聚焦 */
    enter() {
      _trigger = _trigger || getActiveElement();
      const head = element(subNodes[0]);
      if (head == null)
        console.warn(`没有找到元素 ${subNodes[0]}，如果元素需要等待渲染，您需要延迟调用 enter 等待渲染完毕。`);
      else focus(head);
    },
    /** 退出循环，聚焦触发元素 */
    exit() {
      if (_trigger == null)
        console.warn("未指定触发器，将不会聚焦触发器，您可以在调用 focusBagel 时传入选项 trigger 指定触发器，或者在触发触发器的时候调用函数 enter。");
      else focus(_trigger);
    },
    i: () => activeIndex,
  };

  async function enterTriggerHandler(e, onEnter) {
    onEnter?.(e);

    if (isDelay) {
      if (promiseDelay) {
        await delayToFocus(() => {});
        findNodesToLoadListenersAndFocus();
      }
      else if (callbackDelay) delayToFocus(findNodesToLoadListenersAndFocus);
      else if (commonDelay) findNodesToLoadListenersAndFocus();
    }
    else if (removeListenersEachExit && !addedListeners) {
      loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
      focusCoverOrHead(_rootNode, head);
    }
    else focusCoverOrHead(_rootNode, head);
  }

  /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
  function findNodesToLoadListenersAndFocus() {
    const {
      rootNode: _rootNode,
      subNodes: _subNodes, head, tail,
      coverNode: _coverNode,
    } = getNodes(rootNode, subNodes, coverNode);

    loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
    focusCoverOrHead(_coverNode, head);
  }

  function focusCoverOrHead(cover, head) {
    if (enabledCover) tickFocus(cover); // 如果打开封面，首先聚焦封面
    else tickFocus(head); // 如果未打开封面，聚焦内部聚焦列表
  }

  /** 生成事件行为，添加事件监听器 */
  function loadEventListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {

    if (_rootNode == null)
      throw new Error(`没有找到元素 ${rootNode}，您可以尝试 delayToFocus 选项，等待元素 ${rootNode} 渲染完毕后进行聚焦。`);
    if (_head == null || _tail == null)
      throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

    // 在焦点循环中触发聚焦
    const subNodesHandler = _manual ?
      focusSubNodesManually(_subNodes, activeIndex, isClamp, exitSubNodesHandler, isForward, isBackward, onForward, onBackward, _coverNode) :
      focusSubNodes(_head, _tail, isClamp, exitSubNodesHandler, onForward, onBackward, _coverNode);

    if (removeListenersEachExit || !addedListeners)
      // 添加除 trigger 以外其它和焦点相关的事件监听器
      addedListeners = addEventListeners(_rootNode, subNodesHandler, _coverNode, coverHandler, isDefaultExitCover, _tail, tailHandler, clickRootTailHandler, clickRootExitHandler);

    function clickRootExitHandler(e) {
      for (const exit of exits) {
        const affectedNode = element(exit.node);
        const focusTarget = element(exit.target);
        const on = exit.on;

        if (affectedNode == null) continue;
        if (affectedNode != null && e.target !== affectedNode) continue;
        if (focusTarget) {
          enabledCover && (trappedFromCover = false); // 标记离开列表
          removeListeners();
          (on ?? _onEscape)?.(e);
          return focusTarget && focus(focusTarget);
        } else {
          if (enabledCover) {
            trappedFromCover = false;
            (on ?? _onEscape)?.(e);
            return focus(_coverNode);
          } else {
            removeListeners();
            (on ?? _onEscape)?.(e);
            return _trigger && focus(_trigger);
          }
        }
      }

      return false;
    }

    /** 点击 rootNode 的事件，click 事件响应的顺序在 focus 之后 */
    function clickRootTailHandler(e) {
      const targ = e.target;
      if (getActiveElement() !== _coverNode)
        trappedFromCover = true;

      if (targ === _tail) { // 如果触发了 tail，首先响应 tail 的 focus 事件，封面被聚焦，这里将焦点重新设置到 tail
        focus(_tail);
        trappedFromCover = true;
      }
    }

    /** subNodes 最后一个元素的聚焦事件 */
    function tailHandler(e) {
      const prevFocus = e.relatedTarget; // 理想情况只在 tail 后面一个元素 shift-tab 时触发，可是还存在点击触发的情况，所以需要在点击时调整
      if (prevFocus !== _coverNode && !trappedFromCover) { // subNodes 里聚焦元素同样会聚焦到 tail，这里做区分，如果是从非 subNodes 的范围聚焦这个 tail，就重新聚焦到封面
        focus(_coverNode);
      }
    }

    /** 封面的键盘事件响应 */
    function coverHandler(e) {

      if (isDefaultExitCover) {
        if (isTabForward(e)) { // 虽然也是离开列表，但是这里移除监听事件，因为移除后就不能再次进入封面
          focus(_tail);
          return;
        }
        else if (isTabBackward(e)) { // 虽然也是离开列表，但是这里移除监听事件，因为移除后就不能再次进入封面
          focus(_coverNode);
          return;
        }
        else if (isEscapeEvent(e)) {
          exitCoverHandler(e, null, _trigger);
          return;
        }
      }

      for (let exit of exitsCover) {
        const { key, on, target } = exit;
        if (key(e)) exitCoverHandler(e, on, target);
      }

      if((coverEnterKey ?? isEnterEvent)(e)) {
        trappedFromCover = true;
        onEnterCover?.(e);
        focus(_head);
      }
    }

    /** 退出 subNodes 焦点 */
    function exitSubNodesHandler(e) {
      if (disabledEsc && isEscapeEvent(e)) return false;
      for (const exit of exits) {
        const exitKey = exit.key;
        const affectedNode = element(exit.node);
        const focusTarget = element(exit.target);
        const on = exit.on;
        if (affectedNode != null && e.target !== affectedNode) continue;
        if (exitKey?.(e)) {
          if (focusTarget) {
            if (exitKey(e)) {
              enabledCover && (trappedFromCover = false);
              e.preventDefault(); // 阻止 tab 等其它按键的默认行为
              removeListeners();
              (on ?? _onEscape)?.(e);
              return focusTarget && focus(focusTarget);
            }

          } else {
            if (enabledCover) {
              trappedFromCover = false;
              e.preventDefault(); // 阻止 tab 等其它按键的默认行为
              (on ?? _onEscape)?.(e);
              return focus(_coverNode);
            } else {
              removeListeners();
              e.preventDefault(); // 阻止 tab 等其它按键的默认行为
              (on ?? _onEscape)?.(e);
              return _trigger && focus(_trigger);
            }
          }
        }

      }
      return false;
    }

    /** 退出封面焦点的行为 */
    function exitCoverHandler(e, onExit, target) {
      removeListeners();
      onExit?.(e);
      return target && focus(target);
    }

    /** 移除监听事件 */
    function removeListeners() {
      addedListeners = false;
      if (removeListenersEachExit) {
        _rootNode.removeEventListener("keydown", subNodesHandler);
        _rootNode.removeEventListener("click", clickRootExitHandler);
        _coverNode?.removeEventListener("keydown", coverHandler);
        _tail?.removeEventListener("focus", tailHandler);
        _rootNode.removeEventListener("click", clickRootTailHandler);
      }
    }
  }
};

export default focusBagel;