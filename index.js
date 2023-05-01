import { objToStr, isObj, isFun, getActiveElement, element, tick, isSelectableInput, isEnterEvent, isEscapeEvent, isTabForward, isTabBackward, findLowestCommonAncestorNode } from "./utils";
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
const focusSubNodesManually = (subNodes, useActiveIndex, isClamp, isForward, isBackward, onForward, onBackward, coverNode) => e => {
  if (e.target === coverNode) return;

  const [index, setIndex] = useActiveIndex();
  const itemsLen = subNodes.length;
  if ((isForward ?? isTabForward)(e)) {
    const incresedI = index + 1;
    let nextI = isClamp ? Math.min(itemsLen - 1, incresedI) : incresedI;
    nextI %= itemsLen;
    onForward?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    e.preventDefault();
    focus(subNodes[nextI]);
    setIndex(nextI);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
  }
  else if ((isBackward ?? isTabBackward)(e)) {
    const decresedI = index - 1;
    let nextI = isClamp ? Math.max(0, decresedI) : decresedI;
    nextI = (nextI + itemsLen) % itemsLen;
    onBackward?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    e.preventDefault();
    focus(subNodes[nextI]);
    setIndex(nextI);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
  }
};

/** 按下 tab，以浏览器的行为聚焦下个元素 */
const focusSubNodes = (head, tail, isClamp, onForward, onBackward, coverNode) => e => {
  const current = e.target;
  if (current === coverNode) return;

  if (isTabForward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    onForward?.({ e });
    if (current === tail) {
      e.preventDefault();
      if (!isClamp) focus(head);
    }
  }
  else if (isTabBackward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    onBackward?.({ e });
    if (current === head) {
      e.preventDefault();
      if (!isClamp) focus(tail);
    }
  }
};

/** 添加焦点需要的事件监听器 */
const addEventListeners = function(rootNode, keyListMoveHandler, coverNode, keyCoverHandler, isDefaultExitCover, tail, focusListTailHandler, clickListTailHandler, clickListExitHandler, hasClickExits, clickListItemHandler, hasFocusExits, focusListExitHandler, hasKeyExits, keyListExitHandler) {

  // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
  rootNode.addEventListener("keydown", keyListMoveHandler);

  /** 列表点击出口 */
  hasClickExits && rootNode.addEventListener("click", clickListExitHandler);

  /** 列表聚焦出口 */
  hasFocusExits && rootNode.addEventListener("focusin", focusListExitHandler);

  /** 列表键盘出口 */
  hasKeyExits && rootNode.addEventListener("keydown", keyListExitHandler);

  /** 点击聚焦列表单项 */
  rootNode.addEventListener("click", clickListItemHandler);
 
  /** 封面的事件 */
  coverNode?.addEventListener("keydown", keyCoverHandler);

  if (isDefaultExitCover) {

    /** 尾部元素聚焦后的事件，用于返回封面 */
    tail?.addEventListener("focus", focusListTailHandler);

    /** subNodes 点击事件，用于配合 tail focus */
    rootNode.addEventListener("click", clickListTailHandler);
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

/** 获取（生成）出口 */
const getExits = function(exit, onEscape, enabledCover, cover, trigger) {
  let tempExits = [].concat(exit).filter(o => o != null).map(e => ({
    ...e,
    // undefined 表示用户没有主动设置
    type: e.type === undefined ? [e.key == null ? '' : "keydown", e.node == null ? '' : "click"].filter(t => t !== '') : [].concat(e.type),
  }));
  let _onEscape = isFun(onEscape) ? onEscape : onEscape === true ? tempExits[0]?.on ?? (() => {}) : onEscape;
  /** 按下 esc 的出口 */
  const escapeExit = isFun(_onEscape) ? {
    node: null,
    key: isEscapeEvent,
    on: _onEscape,
    target: enabledCover ? cover : trigger,
    type: ["keydown"],
  } : null;
  const exits = [escapeExit].concat(tempExits).filter(e => e != null);

  return {
    exits,
    ...splitExits(),
  }

  function splitExits() {
    const keyExits = exits.filter(e => e.type?.includes("keydown"));
    const clickExits = exits.filter(e => e.type?.includes("click"));
    const focusExits = exits.filter(e => e.type?.includes("focus"));
  
    const hasClickExits = clickExits.length > 0;
    const hasFocusExits = focusExits.length > 0;
    const hasKeyExits = keyExits.length > 0;
    
    return { keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits };
  }
}

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
    enter,
    /** blur: 触发退出触发器的配置 */
    exit,
    /** blur: 按下 esc 的行为，如果未设置，则取 exit.on */
    onEscape,
    /** 列表单项聚焦之后的行为 */
    onClick,
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
    node: coverNode = rootNode || true,
    enterKey: coverEnterKey,
    onEnter: onEnterCover,
    exit: exitCover,
  } = isObj(cover) ? cover : cover === true ? {} : { node: !!cover ? rootNode : null };

  /** 是否已经打开封面选项 */
  const enabledCover = !!coverNode;

  /** 入口们 */
  const enters = [].concat(enter).filter(o => o != null).map(enter => ({
    ...enter,
    type: enter.type === undefined ? [enter.key == null ? '' : "keydown", enter.node == null ? '' : "click"].filter(t => t != '') : [].concat(enter.type),
  }));

  /** 默认入口 */
  let _trigger = element(trigger || enters[0]?.node);

  /** 退出封面，封面的出口们 */
  const exitsCover = [].concat(exitCover).filter(e => e != null).map(e => ({
    ...e,
    target: e.target ?? _trigger,
  }));

  /** 是否使用默认的离开封面方法，也即 tab 和 shift-tab */
  const isDefaultExitCover = enabledCover && exitsCover.length === 0;

  /** 禁用左上角 esc 出口 */
  const disabledEsc = onEscape === false;

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

  const isFunctionDelay = isFun(delayToFocus);
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

  /** 是否通过 cover 进入的 subNodes，用于区分是如何聚焦到列表尾元素的，是从内部访问，还是从外部通过 shift-tab 访问 */
  let trappedFromCover = false;

  // 入口点击事件
  for (let enter of enters) {
    const { node: origin, on, key, type } = enter;
    const types = [].concat(type);
    const allTypes = ["keydown", "focus", "click"];
    const node = element(origin);

    types.forEach(type => {
      allTypes.includes(type) && node?.addEventListener(type, type === "keydown" ? keyHandler : notKeyHandler);
    });

    function keyHandler(e) {
      if (key?.(e)) {
        e.preventDefault();
        enterTriggerHandler(e, on);
      }
    }

    function notKeyHandler(e) {
      enterTriggerHandler(e, on)
    }
  }

  // 用于 return.exit
  let exitListWithTarget_outer = null;
  let exitListWithoutTarget_outer = null;
  let exits_outer = null;

  // 不用延迟聚焦
  if (!isDelay)
    loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);

  return {
    /** 调用形式的入口 */
    enter() {
      _trigger = _trigger || getActiveElement();

      for (let enter of enters) {
        const { on, type, node } = enter;
        const invokeType = "invoke";

        if (type?.some(type => type == null || type === false || type === invokeType) || node == null)
          enterTriggerHandler({ fromInvoke: true }, on);
      }
    },
    /** 调用形式的出口 */
    exit() {
      for (const exit of exits_outer) {
        let { on, type, target } = exit;
        target = element(target);
        const invokeType = "invoke";

        if (type?.some(type => type == null || type === false || type === invokeType)) {
          if (target) {
            return exitListWithTarget_outer?.({ fromInvoke: true }, on, target);
          } else {
            return exitListWithoutTarget_outer?.({ fromInvoke: true }, on, target);
          }
        }
      }
    },
    i: () => activeIndex,
  };

  async function enterTriggerHandler(e, onEnter) {
    await onEnter?.(e);

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
      focusCoverOrList(_rootNode, head);
    }
    else focusCoverOrList(_rootNode, head);


    /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
    function findNodesToLoadListenersAndFocus() {
      const {
        rootNode: _rootNode,
        subNodes: _subNodes, head, tail,
        coverNode: _coverNode,
      } = getNodes(rootNode, subNodes, coverNode);

      loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
      focusCoverOrList(_coverNode, head);
    }

    function focusCoverOrList(cover, head) {
      if (enabledCover) tickFocus(cover); // 如果打开封面，首先聚焦封面
      else tickFocus(_subNodes[activeIndex]); // 如果未打开封面，聚焦内部聚焦列表
    }
  }

  /** 生成事件行为，添加事件监听器 */
  function loadEventListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {

    if (_rootNode == null)
      throw new Error(`没有找到元素 ${rootNode}，您可以尝试 delayToFocus 选项，等待元素 ${rootNode} 渲染完毕后进行聚焦。`);
    if (_head == null || _tail == null)
      throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

    const useActiveIndex = () => [activeIndex, newVal => activeIndex = newVal];

    // 在焦点循环中触发聚焦
    const keyListMoveHandler = _manual ?
      focusSubNodesManually(_subNodes, useActiveIndex, isClamp, isForward, isBackward, onForward, onBackward, _coverNode) :
      focusSubNodes(_head, _tail, isClamp, onForward, onBackward, _coverNode);
  
    /** 出口们，列表的出口们，subNodes 的出口们 */
    const {
      exits, keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
    } = getExits(exit, onEscape, enabledCover, _coverNode, _trigger);

    if (removeListenersEachExit || !addedListeners) {
      // 添加除 trigger 以外其它和焦点相关的事件监听器
      addEventListeners(_rootNode, keyListMoveHandler, _coverNode, keyCoverHandler, isDefaultExitCover, _tail, focusListTailHandler, clickListTailHandler, clickListExitHandler, hasClickExits, clickListItemHandler, hasFocusExits, focusListExitHandler, hasKeyExits, keyListExitHandler);
      addedListeners = true;
    }

    // 用以 return.exit
    exitListWithTarget_outer = exitListWithTarget;
    exitListWithoutTarget_outer = exitListWithoutTarget;
    exits_outer = exits;
    
    /** 聚焦列表一个单项而退出 */
    function focusListExitHandler(e) {
      const current = e.target;

      for (const exit of focusExits) {
        let { node, on, target } = exit;
        node = element(node);
        target = element(target);
  
        if (node == null) continue;
        if (node != null && current !== node) continue;
        if (target) {
          return exitListWithTarget(e, on, target);
        } else {
          return exitListWithoutTarget(e, on, target);
        }
      }

    }

    /** 点击聚焦列表某一单项 */
    function clickListItemHandler(e) {
      const target = e.target;
      const targetIndex = _subNodes.findIndex(e => e.contains(target));
      if (targetIndex > -1) {
        onClick?.({ e, prev: _subNodes[activeIndex], cur: _subNodes[targetIndex], prevI: activeIndex, curI: targetIndex });
        activeIndex = targetIndex;
        _subNodes[activeIndex].focus(); // 兼容 Safari
      }

    }

    /** 点击列表的出口 */
    function clickListExitHandler(e) {
      for (const exit of clickExits) {
        let { node, on, target } = exit;
        node = element(node);
        target = element(target);
  
        if (node == null) continue;
        if (node != null && e.target !== node) continue;
        if (target) {
          return exitListWithTarget(e, on, target);
        } else {
          return exitListWithoutTarget(e, on, target);
        }
      }
  
      return false;

    }

    /** 点击 rootNode 的事件，click 事件响应的顺序在 focus 之后 */
    function clickListTailHandler(e) {
      const targ = e.target;
      if (getActiveElement() !== _coverNode)
        trappedFromCover = true;
  
      if (targ === _tail) { // 如果触发了 tail，首先响应 tail 的 focus 事件，封面被聚焦，这里将焦点重新设置到 tail
        focus(_tail);
        trappedFromCover = true;
      }
    }

    /** subNodes 最后一个元素的聚焦事件 */
    function focusListTailHandler(e) {
      const prevFocus = e.relatedTarget; // 理想情况只在 tail 后面一个元素 shift-tab 时触发，可是还存在点击触发的情况，所以需要在点击时调整
      if (prevFocus !== _coverNode && !trappedFromCover) { // subNodes 里聚焦元素同样会聚焦到 tail，这里做区分，如果是从非 subNodes 的范围聚焦这个 tail，就重新聚焦到封面
        focus(_coverNode);
      }

    }

    /** 封面的键盘事件响应 */
    function keyCoverHandler(e) {
      if (e.target !== _coverNode) return;

      // 入口
      if((coverEnterKey ?? isEnterEvent)(e)) {
        e.preventDefault();
        trappedFromCover = true;
        onEnterCover?.(e);
        focus(_subNodes[activeIndex]);
        return;
      }

      // 出口
      for (let exit of exitsCover) {
        let { key, on, target } = exit;
        target = element(target);
        if (key?.(e)) {
          exitCoverHandler(e, on, target);
          return;
        }
      }

      // 默认出口
      if (isDefaultExitCover) {
        if (isTabForward(e)) { // 虽然也是离开列表，但是这里不移除监听事件，因为移除后就不能再次进入封面
          focus(_tail);
          return;
        }
        else if (isTabBackward(e)) { // 虽然也是离开列表，但是这里不移除监听事件，因为移除后就不能再次进入封面
          focus(_coverNode);
          return;
        }
        else if (isEscapeEvent(e)) {
          exitCoverHandler(e, null, _trigger);
          return;
        }
      }

      /** 退出封面焦点的行为 */
      function exitCoverHandler(e, onExit, target) {
        removeListeners();
        onExit?.(e);
        return target && focus(target);
      }
    }

    /** 触发键盘退出列表，退出 subNodes 焦点 */
    function keyListExitHandler(e) {
      if (e.target === _coverNode) return; // 被封面触发直接返回

      if (disabledEsc && isEscapeEvent(e)) return;

      for (const exit of keyExits) {
        let { key, node, target, on } = exit;
        node = element(node);
        target = element(target);
        if (node != null && e.target !== node) continue;
        if (key?.(e)) {
          if (target) {
            if (key(e)) {
              const exited = exitListWithTarget(e, on, target);
              exited && e.stopImmediatePropagation(); // 列表和封面可能是同一个元素，避免封面响应键盘事件，这里已经执行成功了
              return exited;
            }
  
          } else {
            const exited = exitListWithoutTarget(e, on, target);
            exited && e.stopImmediatePropagation(); // 列表和封面可能是同一个元素，避免封面响应键盘事件，这里已经执行成功了
            return exited;
          }
        }
  
      }
      return false;

    }

    /** 退出列表，有 target */
    function exitListWithTarget(e, on, target) {
      enabledCover && target !== _coverNode &&  (trappedFromCover = false);
      e.preventDefault(); // 阻止 tab 等其它按键的默认行为
      target !== _coverNode && removeListeners();
      on?.(e);
      return focus(target);
    }

    /** 退出列表，无 target */
    function exitListWithoutTarget(e, on, target) {
      if (target === false) { // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用
        enabledCover && (trappedFromCover = false); // 标记离开列表
        removeListeners();
        on?.(e);
        e.preventDefault(); // 阻止默认行为，例如 tab 到下一个元素，enter button 触发 click 事件
        return true;
      }
      if (enabledCover) {
        trappedFromCover = false;
        on?.(e);
        e.preventDefault();
        return focus(_coverNode);
      } else {
        removeListeners();
        on?.(e);
        e.preventDefault();
        return _trigger && focus(_trigger);
      }
    }

    /** 移除监听事件 */
    function removeListeners() {
      addedListeners = false;
      if (removeListenersEachExit) {
        _rootNode.removeEventListener("keydown", keyListMoveHandler);
        _rootNode.removeEventListener("click", clickListExitHandler);
        _rootNode.removeEventListener("focusin", focusListExitHandler);
        _rootNode.removeEventListener("keydown", keyListExitHandler);
        _rootNode.removeEventListener("click", clickListItemHandler);
        _coverNode?.removeEventListener("keydown", keyCoverHandler);
        _tail?.removeEventListener("focus", focusListTailHandler);
        _rootNode.removeEventListener("click", clickListTailHandler);
      }
    }
  }
};

export default focusBagel;