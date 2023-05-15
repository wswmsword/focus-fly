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
const focusSubNodesManually = (subNodes, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, coverNode, trappedFrom) => e => {
  if (e.target === coverNode) return;

  const [index, setIndex] = useActiveIndex();
  const itemsLen = subNodes.length;
  if ((isNext ?? isTabForward)(e)) {
    const incresedI = index + 1;
    let nextI = isClamp ? Math.min(itemsLen - 1, incresedI) : incresedI;
    nextI %= itemsLen;
    onNext?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    trappedFrom.list(); // 标记从列表进入列表
    focus(subNodes[nextI]);
    setIndex(nextI);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    e.preventDefault();
  }
  else if ((isPrev ?? isTabBackward)(e)) {
    const decresedI = index - 1;
    let nextI = isClamp ? Math.max(0, decresedI) : decresedI;
    nextI = (nextI + itemsLen) % itemsLen;
    onPrev?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    trappedFrom.list(); // 标记从列表进入列表
    focus(subNodes[nextI]);
    setIndex(nextI);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    e.preventDefault();
  }
};

/** 按下 tab，以浏览器的行为聚焦下个元素 */
const focusSubNodes = (head, tail, isClamp, onNext, onPrev, coverNode, trappedFrom) => e => {
  const current = e.target;
  if (current === coverNode) return;

  if (isTabForward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    trappedFrom.list(); // 标记从列表进入列表
    onNext?.({ e });
    if (current === tail) {
      e.preventDefault();
      if (!isClamp) focus(head);
    }
  }
  else if (isTabBackward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    trappedFrom.list(); // 标记从列表进入列表
    onPrev?.({ e });
    if (current === head) {
      e.preventDefault();
      if (!isClamp) focus(tail);
    }
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
const getExits = function(exit, onEscape, enabledCover, cover, trigger, root) {

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
    /** 生效的节点是否在根元素内部（列表中） */
    const isInnerRoot = node => (node != null && root.contains(element(node))) || node == null;
  
    const [keyExits, clickExits, focusExits, keyExits_wild, clickExits_wild, focusExits_wild] = exits.reduce((acc, e) => {
      let [key, click, focus, key_wild, click_wild, focus_wild] = acc;
      if (isInnerRoot(e.node)) {
        if (e.type?.includes("keydown")) key = key.concat(e);
        if (e.type?.includes("click")) click = click.concat(e);
        if (e.type?.includes("focus")) focus = focus.concat(e);
      } else {
        if (e.type?.includes("keydown")) key_wild = key_wild.concat(e);
        if (e.type?.includes("click")) click_wild = click_wild.concat(e);
        if (e.type?.includes("focus")) focus_wild = focus_wild.concat(e);
      }
      return [key, click, focus, key_wild, click_wild, focus_wild];
    }, new Array(6).fill([]));

    const hasClickExits = clickExits.length > 0;
    const hasFocusExits = focusExits.length > 0;
    const hasKeyExits = keyExits.length > 0;
    
    return {
      keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
      keyExits_wild, clickExits_wild, focusExits_wild,
    };
  }
};

/** 获取聚焦或失焦时延迟的类型 */
const getDelayType = function(delay, target) {
  const isFunctionDelay = isFun(delay);
  const delayRes = isFunctionDelay && delay(() => {});
  const promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]";
  const callbackDelay = isFunctionDelay && !promiseDelay;
  const commonDelay = (target == null || delay === true) && !promiseDelay && callbackDelay;
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
  // 空 target 走默认
  if (target == null) {
    if (enabledCover) return cover;
    else return list[activeIndex];
  }
  // 函数 target 则执行
  else if (isFun(target))
    return target({ list, cover, root: rootNode, last: list[activeIndex], lastI: activeIndex });
  // 选择器字符串或者节点
  else return element(target);
}

/** 记录焦点是如何进入列表的 */
class TrappedFrom {
  constructor() {
    this.clean();
  }
  entry() {
    this._entry = true;
  }
  cover() {
    this._cover = true;
  }
  click() {
    this._click = true;
  }
  list() {
    this._list = true;
  }
  clean() {
    this._entry = false;
    this._cover = false;
    this._click = false;
    this._list = false;
  }
  internal() {
    return this._entry || this._cover || this._click || this._list;
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
    next,
    /** move: 自定义后退焦点函数 */
    prev,
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
    /** 每次退出列表回到入口是否移除列表事件 */
    removeListenersEachExit = true,
    /** 每次进入列表是否移除入口事件 */
    removeListenersEachEnter,
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
    key: isNext,
    on: onNext,
  } = isObj(next) ? next : { key: next };

  const {
    key: isPrev,
    on: onPrev,
  } = isObj(prev) ? prev : { key: prev };

  const {
    rootNode: _rootNode,
    subNodes: _subNodes, head, tail,
    coverNode: _coverNode,
  } = getNodes(rootNode, subNodes, coverNode);

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  // 自定义前进或后退焦点函数，则设置 manual 为 true
  const _manual = !!(isNext || isPrev || manual);

  /** 活动元素在 subNodes 中的编号，打开 manual 生效 */
  let activeIndex = 0;

  /** 是否已添加监听事件 */
  let addedListeners = false;

  let trappedList = false;
  let trappedCover = false;

  /** 记录焦点是如何进入列表的，用来纠正从未知渠道进入列表之后的焦点错误问题 */
  const trappedFrom = new TrappedFrom();

  let addedEntryListeners = false;
  // 入口点击事件
  addEntryListeners();
  /** 是否已添加入口的监听事件 */

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
      loadEventListeners(_rootNode, _subNodes, head, tail, _coverNode);
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
      if (cover !== rootNode && rootNode.contains(gotTarget)) trappedFrom.entry(); // 标记
      tickFocus(gotTarget);
    }
  }

  /** 生成事件行为，添加事件监听器 */
  function loadEventListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {

    if (addedListeners) return ;
    addedListeners = true;

    if (_rootNode == null)
      throw new Error(`没有找到元素 ${rootNode}，您可以尝试 delayToFocus 选项，等待元素 ${rootNode} 渲染完毕后进行聚焦。`);
    if (_head == null || _tail == null)
      throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

    const useActiveIndex = () => [activeIndex, newVal => activeIndex = newVal];

    // 在焦点循环中触发聚焦
    const keyListMoveHandler = _manual ?
      focusSubNodesManually(_subNodes, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, _coverNode, trappedFrom) :
      focusSubNodes(_head, _tail, isClamp, onNext, onPrev, _coverNode, trappedFrom);
  
    /** 出口们，列表的出口们，subNodes 的出口们 */
    const {
      exits, keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
      keyExits_wild, clickExits_wild, focusExits_wild,
    } = getExits(exit, onEscape, enabledCover, _coverNode, _trigger, _rootNode);

    /** 非跟节点内的，是跟节点之外的出口 */
    const keyListExitHandlers_wild = keyExits_wild.map(exit => [element(exit?.node), keyListExitHandler_wild(exit)]);
    const clickListExitHandlers_wild = clickExits_wild.map(exit => [element(exit?.node), clickListExitHandler_wild(exit)]);
    const focusListExitHandlers_wild = focusExits_wild.map(exit => [element(exit?.node), focusListExitHandler_wild(exit)]);

    // 添加除 trigger 以外其它和焦点相关的事件监听器
    addListListeners();

    // 用以 return.exit
    exitListWithTarget_outer = exitListWithTarget;
    exitListWithoutTarget_outer = exitListWithoutTarget;
    exits_outer = exits;

    let isTrappedFromMousedown = -1;

    function focusTrapListHandler(e) {

      if (e.target === _coverNode) return;

      if (_manual && !trappedFrom.internal()) {
        tickFocus(_subNodes[activeIndex]);
      }
      trappedFrom.clean();
      trappedList = true;
    }

    function blurTrapListHandler(e) {
      trappedList = false;
    }

    function focusTrapCoverHandler() { trappedCover = true; }

    function blurTrapCoverHandler() { trappedCover = false; }

    function mousedownListItemHandler(e) {
      const target = e.target;
      const targetIndex = _subNodes.findIndex(e => e.contains(target));
      if (targetIndex > -1) {
        isTrappedFromMousedown = targetIndex;
        trappedFrom.click();
      }
    }

    /** 点击聚焦列表某一单项 */
    function clickListItemHandler(e) {
      const targetIndex = isTrappedFromMousedown;
      if (isTrappedFromMousedown > -1) {
        onClick?.({ e, prev: _subNodes[activeIndex], cur: _subNodes[targetIndex], prevI: activeIndex, curI: targetIndex });
        activeIndex = targetIndex;
        isTrappedFromMousedown = -1;
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
        trappedFrom.cover(); // 标记从封面进入列表
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
        removeListListeners();
      }
    }

    /**************** E **** X **** I ***** T ***************/

    function clickExitHandler(e, exit) {
      const { node: origin_node, on, target: origin_target, delay } = exit;
      const node = element(origin_node);
      const target = element(origin_target);

      if (
        (node != null && !node.contains(e.target)) ||
        node == null) return false;
      if (target) exitListWithTarget(e, on, target, delay);
      else exitListWithoutTarget(e, on, target, delay);
      return true;
    }

    /** 点击列表的出口 */
    function clickListExitHandler(e) {
      for (const exit of clickExits) {
        const isOK = clickExitHandler(e, exit);
        if (isOK) break;
      }
    }

    function focusExitHandler(e, exit) {
      const { node: origin_node, on, target: origin_target, delay } = exit;
      const node = element(origin_node);
      const target = element(origin_target);

      if (
        (node != null && e.target !== node) ||
        node == null) return false;
      if (target) exitListWithTarget(e, on, target, delay);
      else exitListWithoutTarget(e, on, target, delay);
      return true;
    }

    /** 聚焦列表一个单项而退出 */
    function focusListExitHandler(e) {

      for (const exit of focusExits) {
        const isOK = focusExitHandler(e, exit)
        if (isOK) break;
      }
    }

    function keyExitHandler(e, exit) {
      let { key, node: origin_node, target: origin_target, on, delay } = exit;
      const node = element(origin_node);
      const target = element(origin_target);
      if (node != null && e.target !== node) return false;
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

    /** 触发键盘退出列表，退出 subNodes 焦点 */
    function keyListExitHandler(e) {
      if (e.target === _coverNode) return; // 被封面触发直接返回

      if (disabledEsc && isEscapeEvent(e)) return;

      for (const exit of keyExits) {
        const isOK = keyExitHandler(e, exit);
        if (isOK) break;
      }
    }

    /** 退出列表，有 target */
    async function exitListWithTarget(e, on, target, delay) {
      e.preventDefault(); // 阻止 tab 等其它按键的默认行为

      delay = delay ?? delayToBlur;
      const {
        promiseDelay, callbackDelay, commonDelay, isDelay,
      } = !!delay ? getDelayType(delay, target) : {};

      await on?.(e);

      if (isDelay)
        delayToProcess(promiseDelay, callbackDelay, commonDelay, delay, focusThenRemoveListeners);
      else focusThenRemoveListeners();


      function focusThenRemoveListeners() {
        focus(target);
        target !== _coverNode && removeListListeners();
        addEntryListeners();
      }
    }

    /** 退出列表，无 target */
    async function exitListWithoutTarget(e, on, target, delay) {
      e.preventDefault(); // 阻止默认行为，例如 tab 到下一个元素，例如 enter button 触发 click 事件
      if (target === false) { // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用
        await on?.(e);
        removeListListeners();
        addEntryListeners();
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
          removeListListeners();
          addEntryListeners();
        }
      }
    }

    function clickListExitHandler_wild(exit) {
      return function(e) { clickExitHandler(e, exit); }
    }

    function focusListExitHandler_wild(exit) {
      return function(e) { focusExitHandler(e, exit); }
    }

    function keyListExitHandler_wild(exit) {
      return function(e) {
        if (e.target === _coverNode) return; // 被封面触发直接返回
        if (disabledEsc && isEscapeEvent(e)) return;
        keyExitHandler(e, exit);
      }
    }

    /********************************************************/

    /** 添加焦点需要的事件监听器 */
    function addListListeners() {

      _rootNode.addEventListener("focusin", focusTrapListHandler);

      _rootNode.addEventListener("focusout", blurTrapListHandler);

      if (_rootNode !== _coverNode && _coverNode != null) {

        _coverNode.addEventListener("focus", focusTrapCoverHandler);

        _coverNode.addEventListener("blur", blurTrapCoverHandler);
      }

      // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
      _rootNode.addEventListener("keydown", keyListMoveHandler);

      /** 点击聚焦列表单项，只在手动列表时监听点击，因为自动模式不需要记录 activeIndex */
      _manual && _rootNode.addEventListener("click", clickListItemHandler);

      /** 由于 click 事件在 focus 之后，这里用来判断是否通过点击进入列表，用于纠错未知进入列表的焦点定位 */
      _manual && _rootNode.addEventListener("mousedown", mousedownListItemHandler);

      /** 列表点击出口 */
      hasClickExits && _rootNode.addEventListener("click", clickListExitHandler);

      /** 列表聚焦出口 */
      hasFocusExits && _rootNode.addEventListener("focusin", focusListExitHandler);

      /** 列表键盘出口 */
      hasKeyExits && _rootNode.addEventListener("keydown", keyListExitHandler);

      
      /** 非列表内的出口 */
      focusListExitHandlers_wild.forEach(([node, handler]) =>
        node?.addEventListener?.("focus", handler));
      clickListExitHandlers_wild.forEach(([node, handler]) =>
        node?.addEventListener?.("click", handler));
      keyListExitHandlers_wild.forEach(([node, handler]) =>
        node?.addEventListener?.("click", handler));

      /** 封面的事件 */
      _coverNode?.addEventListener("keydown", keyCoverHandler);

      if (isDefaultExitCover) {

        /** 尾部元素聚焦后的事件，用于返回封面 */
        _tail?.addEventListener("focus", focusListTailHandler);
      }
    };

    /** 移除监听事件 */
    function removeListListeners() {
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

        focusListExitHandlers_wild.forEach(([node, handler]) =>
          node?.removeEventListener?.("focus", handler));
        clickListExitHandlers_wild.forEach(([node, handler]) =>
          node?.removeEventListener?.("click", handler));
        keyListExitHandlers_wild.forEach(([node, handler]) =>
          node?.removeEventListener?.("click", handler));

        _coverNode?.removeEventListener("keydown", keyCoverHandler);
        _tail?.removeEventListener("focus", focusListTailHandler);
      }
    }
  }

  /** 添加入口事件 */
  function addEntryListeners() {

    if (addedEntryListeners) return;
    addedEntryListeners = true;

    const added = [];
    for (let enter of enters) {
      const { node: origin, on, key, type, target, delay } = enter;
      const types = [].concat(type);
      const allTypes = ["keydown", "focus", "click"];
      const node = element(origin);
  
      types.forEach(type => {
        if (node && allTypes.includes(type)) {
          const handler = type === "keydown" ? keyHandler : notKeyHandler;
          node.addEventListener(type, handler);
          added.push({
            node,
            type,
            handler,
          })
        }
      });
  
      function keyHandler(e) {
        if (key?.(e)) {
          e.preventDefault();
          enterTriggerHandler(e, on, target, delay);
          removeEntryListeners();
        }
      }
  
      function notKeyHandler(e) {
        enterTriggerHandler(e, on, target, delay);
        removeEntryListeners();
      }
    }

    function removeEntryListeners() {
      if (!removeListenersEachEnter) return;
      addedEntryListeners = false;
      added.forEach(l => l.node.removeEventListener(l.type, l.handler));
    }
  };
};

export default focusBagel;