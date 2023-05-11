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
const tickFocus = async function(e) {
  return new Promise(resolve => {
    if (e == null) tick(() => resolve(e && focus(e)));
    else resolve(focus(e));
  })
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
const addEventListeners = function(rootNode, keyListMoveHandler, coverNode, keyCoverHandler, isDefaultExitCover, tail, focusListTailHandler, clickListExitHandler, hasClickExits, clickListItemHandler, hasFocusExits, focusListExitHandler, hasKeyExits, keyListExitHandler, focusTrapListHandler, blurTrapListHandler, focusTrapCoverHandler, blurTrapCoverHandler) {

  rootNode.addEventListener("focusin", focusTrapListHandler);

  rootNode.addEventListener("focusout", blurTrapListHandler);

  if (rootNode !== coverNode && coverNode != null) {

    coverNode.addEventListener("focus", focusTrapCoverHandler);

    coverNode.addEventListener("blur", blurTrapCoverHandler);
  }

  // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
  rootNode.addEventListener("keydown", keyListMoveHandler);

  /** 点击聚焦列表单项 */
  rootNode.addEventListener("click", clickListItemHandler);

  /** 列表点击出口 */
  hasClickExits && rootNode.addEventListener("click", clickListExitHandler);

  /** 列表聚焦出口 */
  hasFocusExits && rootNode.addEventListener("focusin", focusListExitHandler);

  /** 列表键盘出口 */
  hasKeyExits && rootNode.addEventListener("keydown", keyListExitHandler);
 
  /** 封面的事件 */
  coverNode?.addEventListener("keydown", keyCoverHandler);

  if (isDefaultExitCover) {

    /** 尾部元素聚焦后的事件，用于返回封面 */
    tail?.addEventListener("focus", focusListTailHandler);
  }
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
};

/** 获取聚焦或失焦时延迟的类型 */
const getDelayType = function(delay, target) {
  const isFunctionDelay = isFun(delay);
  const delayRes = isFunctionDelay && delay(() => {});
  const promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]";
  const callbackDelay = isFunctionDelay && !promiseDelay;
  const commonDelay = target == null && !promiseDelay && callbackDelay;
  const isDelay = promiseDelay || callbackDelay || commonDelay;
  return {
    promiseDelay,
    callbackDelay,
    commonDelay,
    isDelay,
  };
};

/** 延迟执行某些操作 */
const delayToProcess = async function(promiseDelay, callbackDelay, commonDelay, delay, processor) {
  if (promiseDelay) {
    await delay(() => {});
    processor();
  }
  else if (callbackDelay) delay(processor);
  else if (commonDelay) processor();
};

/** 获取入口目标 */
const getEntryTarget = function(target, cover, list, rootNode, enabledCover, activeIndex = 0) {
  if (target == null) {
    if (enabledCover) return cover;
    else return list[activeIndex];
  } else if (isFun(target))
    return target({ list, cover, root: rootNode, last: list[activeIndex], lastI: activeIndex });
  else return element(target);
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
    /** 延迟失焦，触发出口后等待执行 delayToBlur 完成后失焦 */
    delayToBlur,
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

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  // 自定义前进或后退焦点函数，则设置 manual 为 true
  const _manual = !!(isForward || isBackward || manual);

  /** 活动元素在 subNodes 中的编号，打开 manual 生效 */
  let activeIndex = 0;

  /** 是否已添加监听事件 */
  let addedListeners = false;

  let trappedList = false;
  let trappedCover = false;

  // 入口点击事件
  for (let enter of enters) {
    const { node: origin, on, key, type, target, delay } = enter;
    const types = [].concat(type);
    const allTypes = ["keydown", "focus", "click"];
    const node = element(origin);

    types.forEach(type => {
      allTypes.includes(type) && node?.addEventListener(type, type === "keydown" ? keyHandler : notKeyHandler);
    });

    function keyHandler(e) {
      if (key?.(e)) {
        e.preventDefault();
        enterTriggerHandler(e, on, target, delay);
      }
    }

    function notKeyHandler(e) {
      enterTriggerHandler(e, on, target, delay);
    }
  }

  // 用于 return.exit
  let exitListWithTarget_outer = null;
  let exitListWithoutTarget_outer = null;
  let exits_outer = null;

  // 遍历入口，如果有入口不需要延迟，则立即加载列表的监听事件
  for (let { target, delay } of (enters.length > 0 ? enters : [{}])) {
    delay = delay ?? delayToFocus;
    const { isDelay } = getDelayType(delay, getEntryTarget(target, _coverNode, _subNodes, _rootNode, enabledCover));
    if (!isDelay) {
      loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
      break;
    }
  }

  return {
    /** 调用形式的入口 */
    enter() {
      _trigger = _trigger || getActiveElement();

      for (let enter of enters) {
        const { on, type, node, target, delay } = enter;
        const invokeType = "invoke";

        if (type?.some(type => type == null || type === false || type === invokeType) || node == null)
          enterTriggerHandler({ fromInvoke: true }, on, target, delay);
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

  async function enterTriggerHandler(e, onEnter, target, delay) {

    // 如果已经在列表或者封面，则不再触发入口；出口不需要该操作，因为不存在从出口退出到出口的子元素的情况，相反，存在入口进入到入口子元素的情况。
    if (trappedCover || trappedList) return;

    await onEnter?.(e);

    delay = delay ?? delayToFocus;
    const {
      promiseDelay, callbackDelay, commonDelay, isDelay,
    } = !!delay
      ? getDelayType(delay, getEntryTarget(target, _coverNode, _subNodes, _rootNode, enabledCover, activeIndex))
      : {};


    if (isDelay)
      delayToProcess(promiseDelay, callbackDelay, commonDelay, delay, findNodesToLoadListenersAndFocus);
    else {
      !addedListeners && loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
      focusTarget(_coverNode, _subNodes, _rootNode);
    }

    /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
    function findNodesToLoadListenersAndFocus() {
      const {
        rootNode: _rootNode,
        subNodes: _subNodes, head, tail,
        coverNode: _coverNode,
      } = getNodes(rootNode, subNodes, coverNode);

      loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
      focusTarget(_coverNode, _subNodes, _rootNode);
    }
    
    function focusTarget(cover, list, rootNode) {
      const gotTarget = getEntryTarget(target, cover, list, rootNode, enabledCover, activeIndex);
      tickFocus(gotTarget);
    }
  }

  /** 生成事件行为，添加事件监听器 */
  function loadEventListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {
    if (addedListeners) return ;

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

    // 添加除 trigger 以外其它和焦点相关的事件监听器
    addEventListeners(_rootNode, keyListMoveHandler, _coverNode, keyCoverHandler, isDefaultExitCover, _tail, focusListTailHandler, clickListExitHandler, hasClickExits, clickListItemHandler, hasFocusExits, focusListExitHandler, hasKeyExits, keyListExitHandler, focusTrapListHandler, blurTrapListHandler, focusTrapCoverHandler, blurTrapCoverHandler);
    addedListeners = true;

    // 用以 return.exit
    exitListWithTarget_outer = exitListWithTarget;
    exitListWithoutTarget_outer = exitListWithoutTarget;
    exits_outer = exits;

    function focusTrapListHandler() { trappedList = true; }

    function blurTrapListHandler() { trappedList = false; }

    function focusTrapCoverHandler() { trappedCover = true; }

    function blurTrapCoverHandler() { trappedCover = false; }
    
    /** 聚焦列表一个单项而退出 */
    function focusListExitHandler(e) {
      const current = e.target;

      for (const exit of focusExits) {
        let { node, on, target, delay } = exit;
        node = element(node);
        target = element(target);
  
        if (node == null) continue;
        if (node != null && current !== node) continue;
        if (target) {
          return exitListWithTarget(e, on, target, delay);
        } else {
          return exitListWithoutTarget(e, on, target, delay);
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
      }

    }

    /** 点击列表的出口 */
    function clickListExitHandler(e) {
      for (const exit of clickExits) {
        let { node, on, target, delay } = exit;
        node = element(node);
        target = element(target);
  
        if (node == null) continue;
        if (node != null && e.target !== node) continue;
        if (target) {
          return exitListWithTarget(e, on, target, delay);
        } else {
          return exitListWithoutTarget(e, on, target, delay);
        }
      }
    }

    /** subNodes 最后一个元素的聚焦事件 */
    function focusListTailHandler(e) {
      const prevFocus = e.relatedTarget; // 理想情况只在 tail 后面一个元素 shift-tab 时触发，可是还存在点击触发的情况，所以需要在点击时调整

      if (!(prevFocus === _coverNode || _rootNode.contains(prevFocus)))
        focus(_coverNode) // 如果从列表以外的区域进入，则聚焦封面
    }

    /** 封面的键盘事件响应 */
    function keyCoverHandler(e) {
      if (e.target !== _coverNode) return;

      // 入口
      if((coverEnterKey ?? isEnterEvent)(e)) {
        e.preventDefault();
        onEnterCover?.(e);
        focus(_subNodes[activeIndex]);
        return;
      }

      // 出口
      for (let exit of exitsCover) {
        const { key, on, target: origin } = exit;
        const target = element(origin);
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
      }

      /** 退出封面焦点的行为 */
      function exitCoverHandler(e, onExit, target) {
        onExit?.(e);
        target && focus(target);
        removeListeners();
      }
    }

    /** 触发键盘退出列表，退出 subNodes 焦点 */
    function keyListExitHandler(e) {
      if (e.target === _coverNode) return; // 被封面触发直接返回

      if (disabledEsc && isEscapeEvent(e)) return;

      for (const exit of keyExits) {
        let { key, node, target, on, delay } = exit;
        node = element(node);
        target = element(target);
        if (node != null && e.target !== node) continue;
        if (key?.(e)) {
          if (target) {
            if (key(e)) {
              const exited = exitListWithTarget(e, on, target, delay);
              exited && e.stopImmediatePropagation(); // 列表和封面可能是同一个元素，避免封面响应键盘事件，这里已经执行成功了
              return exited;
            }
  
          } else {
            const exited = exitListWithoutTarget(e, on, target, delay);
            exited && e.stopImmediatePropagation(); // 列表和封面可能是同一个元素，避免封面响应键盘事件，这里已经执行成功了
            return exited;
          }
        }
  
      }
      return false;

    }

    /** 退出列表，有 target */
    async function exitListWithTarget(e, on, target, delay) {
      e.preventDefault(); // 阻止 tab 等其它按键的默认行为

      delay = delay ?? delayToBlur;
      const {
        promiseDelay, callbackDelay, commonDelay, isDelay,
      } = !!delay ? getDelayType(delay, target) : {};
      if (isDelay)
        delayToProcess(promiseDelay, callbackDelay, commonDelay, delay, focusThenRemoveListeners);
      else focusThenRemoveListeners();

      await on?.(e);

      function focusThenRemoveListeners() {
        focus(target);
        target !== _coverNode && removeListeners();
      }
    }

    /** 退出列表，无 target */
    async function exitListWithoutTarget(e, on, target, delay) {
      e.preventDefault(); // 阻止默认行为，例如 tab 到下一个元素，例如 enter button 触发 click 事件
      if (target === false) { // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用
        await on?.(e);
        removeListeners();
        return ;
      }
      if (enabledCover) {
        await on?.(e);
        focus(_coverNode);
      } else {
        await on?.(e);

        const { promiseDelay, callbackDelay, commonDelay, isDelay } = getDelayType(delay, target);
        if (isDelay)
          delayToProcess(promiseDelay, callbackDelay, commonDelay, delay, focusThenRemoveListeners);
        else focusThenRemoveListeners();

        function focusThenRemoveListeners() {
          _trigger && focus(_trigger);
          removeListeners();
        }
      }
    }

    /** 移除监听事件 */
    function removeListeners() {
      if (removeListenersEachExit) {
        addedListeners = false;
        _rootNode.removeEventListener("focusin", focusTrapListHandler);
        _rootNode.removeEventListener("focusout", blurTrapListHandler);
        _coverNode?.removeEventListener("focus", focusTrapCoverHandler);
        _coverNode?.removeEventListener("blur", blurTrapCoverHandler);

        _rootNode.removeEventListener("keydown", keyListMoveHandler);
        _rootNode.removeEventListener("click", clickListItemHandler);

        _rootNode.removeEventListener("click", clickListExitHandler);
        _rootNode.removeEventListener("focusin", focusListExitHandler);
        _rootNode.removeEventListener("keydown", keyListExitHandler);
        _coverNode?.removeEventListener("keydown", keyCoverHandler);
        _tail?.removeEventListener("focus", focusListTailHandler);
      }
    }
  }
};

export default focusBagel;