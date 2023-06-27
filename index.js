import { objToStr, isObj, isFun, getActiveElement, element, tick, isSelectableInput, isEnterEvent, isEscapeEvent, isTabForward, isTabBackward, findLowestCommonAncestorNode } from "./utils";
let isDemo = false;
/** 聚焦，如果是 input，则聚焦后选中 */
const focus = function(e) {
  e.focus();
  if (isSelectableInput(e))
    e.select();
  return true;
};

/** 尝试聚焦，如果聚焦失效，则下个 setTimeout 再次聚焦 */
const tickFocus = async function(e) {
  return new Promise(resolve => {
    if (e == null) tick(() => resolve(e && focus(e)));
    else resolve(focus(e));
  });
};

/** 手动聚焦下一个元素 */
const focusNextListItemBySequence = (subNodes, useActiveIndex, usePrevActive, isClamp, isNext, isPrev, onNext, onPrev, coverNode, onMove, trappedList) => e => {
  if (e.target === coverNode) return;
  if (!trappedList()) return;

  const [index_, setIndex] = useActiveIndex();
  const [, setPrev] = usePrevActive();
  const index = Math.max(0, index_);
  const itemsLen = subNodes.length;
  if ((isNext ?? isTabForward)(e)) {
    const incresedI = index + 1;
    let nextI = isClamp ? Math.min(itemsLen - 1, incresedI) : incresedI;
    nextI %= itemsLen;
    onNext?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    onMove?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    setIndex(nextI);
    setPrev(index);
    focus(subNodes[nextI]);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    e.preventDefault();
  }
  else if ((isPrev ?? isTabBackward)(e)) {
    const decresedI = index - 1;
    let nextI = isClamp ? Math.max(0, decresedI) : decresedI;
    nextI = (nextI + itemsLen) % itemsLen;
    onPrev?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    onMove?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    setIndex(nextI);
    setPrev(index);
    focus(subNodes[nextI]);
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    e.preventDefault();
  }
};

/** 按下 tab，以浏览器的行为聚焦下个元素 */
const focusNextListItemByRange = (list, isClamp, onNext, onPrev, rootNode, coverNode, trappedList) => e => {
  const head = list[0];
  const tail = list.at(-1);
  const current = e.target;
  if (current === coverNode) return;
  if (!trappedList()) return;

  if (isTabForward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    onNext?.({ e });
    if (current === tail) {
      e.preventDefault();
      if (!isClamp) focus(head);
    }
    if (current === rootNode) {
      e.preventDefault();
      focus(head)
    }
  }
  else if (isTabBackward(e)) {
    e.stopImmediatePropagation(); // 防止封面响应键盘事件
    onPrev?.({ e });
    if (current === head) {
      e.preventDefault();
      if (!isClamp) focus(tail);
    }
    if (current === rootNode) {
      e.preventDefault();
      focus(tail);
    }
  }
};

/** 获取关键节点 */
const getKeyNodes = function(root, list, cover, coverIsRoot) {
  const _list = list.map(item => element(item)).filter(item => item != null);
  const head = _list[0];
  const tail = _list.slice(-1)[0];
  const _root = element(root) ?? findLowestCommonAncestorNode(head, tail);
  const _cover = coverIsRoot ? _root : element(cover);

  return {
    rootNode: _root,
    subNodes: _list,
    head,
    tail,
    coverNode: _cover,
  };
};

/** 用于处理节点属性可以传递数组的情况，用于入口和出口 */
const nodesReducer = function(acc, cur) {
  const isAryNodes = Array.isArray(cur.node);
  const nodes = isAryNodes ? cur.node.map(n => ({
    ...cur,
    node: n,
  })) : cur;
  return acc.concat(nodes);
};

/** 获取分割的出口 */
const splitExits = function(exits, root) {
  /** 生效的节点是否在根元素内部（列表中） */
  const isInnerRoot = node => (node != null && root.contains(element(node))) || node == null;

  const [keyExits, clickExits, focusExits, clickExits_wild, focusExits_wild, outListExits] = exits.reduce((acc, e) => {
    let [key, click, focus, click_wild, focus_wild, outList] = acc;
    const includeType = type => e.type?.includes(type);
    if (isInnerRoot(e.node)) {
      if (includeType("keydown")) key = key.concat(e);
      if (includeType("click")) click = click.concat(e);
      if (includeType("focus")) focus = focus.concat(e);
      if (includeType("outlist")) outList = outList.concat(e);
    } else {
      if (includeType("click")) click_wild = click_wild.concat(e);
      if (includeType("focus")) focus_wild = focus_wild.concat(e);
      if (includeType("outlist")) outList = outList.concat(e);
    }
    return [key, click, focus, click_wild, focus_wild, outList];
  }, new Array(6).fill([]));

  const hasClickExits = clickExits.length > 0;
  const hasFocusExits = focusExits.length > 0;
  const hasKeyExits = keyExits.length > 0;
  
  return {
    keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
    clickExits_wild, focusExits_wild,
    outListExits,
  };
}

/** 获取（生成）出口 */
const getExits = function(exit, onEscape, enabledCover, cover, trigger) {

  let tempExits = [].concat(exit).filter(o => o != null)
    .map(ele => isObj(ele) ? ele : { node: ele })
    .map(e => ({
      ...e,
      // undefined 表示用户没有主动设置
      type: e.type === undefined ? [e.key == null ? '' : "keydown", e.node == null ? '' : "click"].filter(t => t !== '') : [].concat(e.type),
    }))
    .reduce(nodesReducer, []);
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

  return exits;
};

/** 获取聚焦或失焦时延迟的类型 */
const getDelayType = function(delay) {
  const isFunctionDelay = isFun(delay);
  const delayRes = isFunctionDelay && delay(() => {});
  const promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]";
  const callbackDelay = isFunctionDelay && !promiseDelay;
  const commonDelay = (delay === true) && !promiseDelay && !callbackDelay;
  return {
    promiseDelay,
    callbackDelay,
    commonDelay,
  };
};

/** 延迟执行某些操作 */
const delayToProcess = async function(delay, processor) {

  const { promiseDelay, callbackDelay, commonDelay } = !!delay ? getDelayType(delay) : {};
  if (promiseDelay) {
    await delay(() => {});
    processor();
  }
  else if (callbackDelay) delay(processor);
  else if (commonDelay) processor();
  else return true;
};

/** 获取入口目标 */
const getEntryTarget = function(target, cover, list, rootNode, enabledCover, activeIndex = 0) {
  // 空 target 走默认
  if (target == null) {
    if (enabledCover) return cover;
    else return list[activeIndex === -1 ? 0 : activeIndex];
  }
  // 函数 target 则传入节点执行
  else if (isFun(target))
    return target({ list, cover, root: rootNode, last: list[activeIndex], lastI: activeIndex });
  // 选择器字符串或者节点，则直接获取
  else return element(target);
}

/** 保存的监听事件信息，方便监听和移除监听 */
class ListenersCache {
  cache = [];
  isEmpty = true;
  push(node, type, handler) {
    this.isEmpty = false;
    this.cache.push({
      node,
      type,
      handler,
    });
  }
  clean() {
    this.cache = [];
    this.isEmpty = true;
  }
  addListeners() {
    this.cache.forEach(l => l.node?.addEventListener(l.type, l.handler));
  }
  removeListeners() {
    this.cache.forEach(l => l.node?.removeEventListener(l.type, l.handler));
    this.clean();
  }
}

/** 按键转发的缓存 */
class KeyForwardCache {
  cache = new Map();
  has(id) {
    return this.cache.has(id);
  }
  push(id, node, handler) {
    if (this.has(id)) return;
    node.addEventListener("keydown", handler);
    this.cache.set(id, {
      node,
      handler,
    })
  }
  remove(id) {
    const ids = [].concat(id);
    ids.forEach(id => this.cache.get(id).node.removeEventListener("keydown", this.cache.get(id).handler));
  }
}

/** 保存列表数据 */
class TabList {
  data = [];
  head = null;
  tail = null;
  update(list) {
    this.data.splice(0, this.data.length);
    Array.prototype.push.apply(this.data, list);
    this.head = list[0];
    this.tail = list.at(-1);
  };
  isEmpty() {
    return this.data.length === 0;
  };
  has(i) {
    return !!this.data[i];
  }
}

const focusNoJutsu = (...props) => {
  const offset = 0 - (props[0] instanceof Array);
  const rootNode = props[0 + offset];
  const subNodes = props[1 + offset];
  const options  = props[2 + offset] ?? {};

  if (!(Array.isArray(subNodes) && subNodes.length > 1))
    throw new Error("请至少传入一个数组，数组至少包含两个可聚焦元素，用来表示列表的头和尾。");

  const {
    /** move: tab 序列，指定可以聚焦的元素，聚焦 list 内的元素 */
    sequence,
    /** move: 是否循环，设置后，尾元素的下个焦点是头元素，头元素的上个焦点是尾元素 */
    loop,
    /** move: 自定义前进焦点函数 */
    next,
    /** move: 自定义后退焦点函数 */
    prev,
    /** focus/blur: 触发器，如果使用 focusNoJutsu.enter 则不用设置，如果使用 entry.selector 则不用设置 */
    trigger,
    /** focus: 触发触发器的配置 */
    entry,
    /** blur: 触发退出触发器的配置 */
    exit,
    /** blur: 按下 esc 的行为，如果未设置，则取 exit.on */
    onEscape,
    /** 点击列表单项的响应，行为 */
    onClick,
    /** 移动的时候触发 */
    onMove,
    /** cover: 封面，默认情况，触发入口后首先聚焦封面，而不是子元素 */
    cover,
    /** 初始的 activeIndex */
    initialActive,
    /** 矫正列表的焦点 */
    correctionTarget,
    /** 延迟挂载非触发器元素的事件，可以是一个返回 promise 的函数，可以是一个接收回调函数的函数 */
    delayToFocus,
    /** 延迟失焦，触发出口后等待执行 delayToBlur 完成后失焦 */
    delayToBlur,
    /** 每次退出列表回到入口是否移除列表事件 */
    removeListenersEachExit = true,
    /** 每次进入列表是否移除入口事件 */
    removeListenersEachEnter,
    /** 手动添加和移除监听事件，入口、列表、出口的监听事件，`removeListenersEachExit` 和 `removeListenersEachEnter` 将失效 */
    manual,
    /** 用于抹平 Safari 不同于其它浏览器，点击后 button 之类的元素不会被聚焦的问题 */
    allowSafariToFocusAfterMousedown = true,
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
  } = isObj(cover) ? cover : {};

  /** 是否已经打开封面选项 */
  const enabledCover = cover != null && cover !== false && coverNode !== false;

  /** 封面即根元素 */
  const coverIsRoot = enabledCover && (cover === true || coverNode === true || coverNode == null);

  /** 列表 */
  const list = new TabList();

  /** 入口们 */
  const entries = [].concat(entry).filter(o => o != null)
    .map(ele => isObj(ele) ? ele : { node: ele })
    .map(entry => ({
      ...entry,
      delay: entry.delay ?? delayToFocus,
      type: entry.type === undefined ? [entry.key == null ? '' : "keydown", entry.node == null ? '' : "click"].filter(t => t != '') : [].concat(entry.type),
    }))
    .reduce(nodesReducer, []);
  /** 是否是空入口 */
  const hasNoEntry = entries.length === 0;

  /** 默认入口 */
  let _trigger = element(trigger || entries[0]?.node);

  /** 退出封面，封面的出口们 */
  const exitsCover = [].concat(exitCover).filter(e => e != null)
    .map(e => isObj(e) ? e : { key: e })
    .map(e => ({
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

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  // 自定义前进或后退焦点函数，则设置 sequence 为 true
  const enabledTabSequence = !!(isNext || isPrev || sequence);

  /** 活动元素在列表中的编号，打开 sequence 生效 */
  let activeIndex = initialActive ?? -1;
  let prevActive = -1;

  /** 是否已添加监听事件 */
  const listListeners = new ListenersCache();

  let trappedList = false;
  let trappedCover = false;

  /** 是否已添加入口的监听事件 */
  const entryListeners = new ListenersCache();

  /** 按键转发 */
  const keyForwards = new KeyForwardCache();

  if (!manual) { // 如果不是手动添加事件，则注册入口、列表相关（封面、列表、出口）的事件
    // 入口点击事件
    addEntryListeners();

    // 如果有入口不需要延迟，则立即加载列表的监听事件
    const hasImmediateEntry = (hasNoEntry ? [{}] : entries).some(({ delay }) => !delay);

    if (hasImmediateEntry) {

      const {
        rootNode: _rootNode,
        subNodes: _subNodes, head, tail,
        coverNode: _coverNode,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      list.update(_subNodes);

      loadListRelatedListeners(_rootNode, list.data, head, tail, _coverNode);
    }
  }

  const Return = {
    /** 调用形式的入口 */
    enter(entry) {
      _trigger = _trigger || getActiveElement();

      if (entry) {
        const { on, target, delay } = entry;
        return entryHandler({ fromInvoke: true }, on, target, delay);
      } else {
        for (const entry of entries) {
          const { on, type, node, target, delay } = entry;
          const invokeType = "invoke";

          if (type?.some(type => type == null || type === false || type === invokeType) || node == null) {
            return entryHandler({ fromInvoke: true }, on, target, delay);
          }
        }
        return entryHandler({ fromInvoke: true });
      }
    },
    /** 调用形式的出口 */
    exit(tempExit) {

      const {
        subNodes: _list,
        coverNode: cover,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);

      if (tempExit) {
        const { on, target: originTarget } = tempExit;
        const target = element(originTarget);
        return toExit(target, on);
      } else {
        const exits = getExits(exit, onEscape, enabledCover, cover, _trigger);
        for (const exit of exits) {
          const { on, type, target: originTarget } = exit;
          const target = element(originTarget);
          const invokeType = "invoke";
  
          if (type?.some(type => type == null || type === false || type === invokeType)) {
            return toExit(target, on);
          }
        }
      }

      function toExit(target, on) {

        if (list.isEmpty()) list.update(_list);

        return exitHandler({ fromInvoke: true }, on, target, false, cover, list.data);
      }
    },
    /** 移除所有的监听事件 */
    removeListeners() {
      listListeners.removeListeners();
      entryListeners.removeListeners();
    },
    /** 移除列表相关的事件 */
    removeListRelatedListeners() {
      listListeners.removeListeners();
    },
    /** 移除入口事件 */
    removeEntryListeners() {
      entryListeners.removeListeners();
    },
    /** 添加入口的监听事件 */
    addEntryListeners() {
      addEntryListeners();
    },
    /** 添加列表相关（封面、列表、出口）的监听事件 */
    addListRelatedListeners() {

      const {
        rootNode: _rootNode,
        subNodes: _subNodes,
        coverNode: _coverNode,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      if (list.isEmpty()) list.update(_subNodes);

      loadListRelatedListeners(_rootNode, list.data, list.head, list.tail, _coverNode);
    },
    /** 添加转发 */
    addForward(id, forward) {
      let opts = null;
      if (isFun(forward)) {
        const {
          rootNode: root,
          subNodes: list, head, tail,
          coverNode: cover,
        } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);

        opts = forward({ root, list, head, tail, cover, curI: activeIndex, prevI: prevActive });
      }
      else opts = forward;

      const { node: origin_node, on, key, target: origin_target } = opts;
      const node = element(origin_node);
      const target = element(origin_target);
      keyForwards.push(id, node, e => {
        if (key?.(e, activeIndex)) {
          e.preventDefault();
          on?.();
          tickFocus(target);
        }
      });
    },
    /** 移除转发 */
    removeForward(id) {
      keyForwards.remove(id);
    },
    /** 更新列表 */
    updateList(newList) {
      const _newList = newList.map(item => element(item)).filter(item => item != null);
      list.update(_newList);
    },
    /** 当前聚焦的列表单项序号 */
    i(newI) {
      if (list.has(newI) && trappedList) {
        prevActive = activeIndex;
        activeIndex = newI;
        onMove?.({ e: { fromI: true }, prev: list.data[prevActive], cur: list.data[activeIndex], prevI: prevActive, curI: activeIndex });
        focus(subNodes[activeIndex]);
        return newI;
      }
      else return activeIndex;
    },
  };

  return Return;

  /** 入口 handler */
  async function entryHandler(e, onEnter, target, delay) {

    // 如果已经在列表或者封面，则不再触发入口；出口不需要该操作，因为不存在从出口退出到出口的子元素的情况，相反，存在入口进入到入口子元素的情况。
    if (trappedCover || trappedList) return;

    await onEnter?.(e);

    const isImmediate = !delay;
    if (isImmediate) findNodesToLoadListenersAndFocus();
    else delayToProcess(delay, findNodesToLoadListenersAndFocus);

    /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
    function findNodesToLoadListenersAndFocus() {
      const {
        rootNode: _rootNode,
        subNodes: _subNodes, head, tail,
        coverNode: _coverNode,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      list.update(_subNodes);

      if (!manual)
        loadListRelatedListeners(_rootNode, list.data, head, tail, _coverNode);
      if (target !== false)
        focusTarget(_coverNode, _subNodes, _rootNode);
    }
    
    function focusTarget(cover, list, rootNode) {
      const gotTarget = getEntryTarget(target, cover, list, rootNode, enabledCover, activeIndex);
      const targetIdx = list.indexOf(gotTarget);
      if (targetIdx > -1) {
        prevActive = activeIndex;
        activeIndex = targetIdx; // 只有在聚焦列表元素时才设置，否则会破坏原有 activeIndex
        onMove?.({ e, prev: list[prevActive], cur: gotTarget, prevI: prevActive, curI: activeIndex });
        trappedList = true;
      }
      if (enabledCover && (gotTarget === cover || targetIdx > -1)) trappedCover = true;
      tickFocus(gotTarget);
    }
  }

  /** 出口 handler */
  async function exitHandler(e, on, target, delay, cover, list) {

    if (!trappedList) return;

    trappedList = false;

    e.preventDefault?.(); // 阻止默认行为，例如 tab 到下一个元素，例如 entry button 触发 click 事件

    if (target) return exitListWithTarget();
    else return exitListWithoutTarget();

    /** 退出列表，有 target */
    async function exitListWithTarget() {

      await on?.(e);

      delay = delay ?? delayToBlur;
      const isImmediate = await delayToProcess(delay, focusThenRemoveListeners);
      if (isImmediate) focusThenRemoveListeners();

      function focusThenRemoveListeners() {
        focus(target);
        onMove?.({ e, prev: list[activeIndex], cur: target, prevI: activeIndex, curI: -1 });
        if (!manual) {
          if (target !== cover)
            removeListRelatedListeners();
          addEntryListeners();
        }
      }
    }

    /** 退出列表，无 target */
    async function exitListWithoutTarget() {

      if (target === false) { // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用
        await on?.(e);
        onMove?.({ e, prev: list[activeIndex], cur: null, prevI: activeIndex, curI: -1 });
        if (!manual) {
          removeListRelatedListeners();
          addEntryListeners();
        }
        return ;
      }
      if (enabledCover) {
        await on?.(e);
        onMove?.({ e, prev: list[activeIndex], cur: null, prevI: activeIndex, curI: -1 });
        focus(cover);
      } else {
        await on?.(e);

        delay = delay ?? delayToBlur;
        const isImmediate = await delayToProcess(delay, focusThenRemoveListeners);
        if (isImmediate) focusThenRemoveListeners();

        function focusThenRemoveListeners() {
          _trigger && focus(_trigger);
          onMove?.({ e, prev: list[activeIndex], cur: null, prevI: activeIndex, curI: -1 });
          if (!manual) {
            removeListRelatedListeners();
            addEntryListeners();
          }
        }
      }
    }
  }

  /** 生成事件行为，添加事件监听器 */
  function loadListRelatedListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {

    if (!listListeners.isEmpty) return ;

    if (_rootNode == null)
      throw new Error(`没有找到元素 ${rootNode}，您可以尝试 delayToFocus 选项，等待元素 ${rootNode} 渲染完毕后进行聚焦。`);
    if (_head == null || _tail == null)
      throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

    const useActiveIndex = () => [activeIndex, newVal => activeIndex = newVal];
    const usePrevActive = () => [, prev => prevActive = prev];

    const isTrappedList = () => hasNoEntry ? true : trappedList;

    // 在焦点循环中触发聚焦
    const keyListMoveHandler = enabledTabSequence ?
      focusNextListItemBySequence(_subNodes, useActiveIndex, usePrevActive, isClamp, isNext, isPrev, onNext, onPrev, _coverNode, onMove, isTrappedList) :
      focusNextListItemByRange(_subNodes, isClamp, onNext, onPrev, _rootNode, _coverNode, isTrappedList);

    /** 出口们，列表的出口们，subNodes 的出口们 */
    const exits = getExits(exit, onEscape, enabledCover, _coverNode, _trigger);
    const {
      keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
      clickExits_wild, focusExits_wild,
      outListExits,
    } = splitExits(exits, _rootNode);

    /** 非跟节点内的，是跟节点之外的出口 */
    const clickListExitHandlers_wild = clickExits_wild.map(exit => [element(exit?.node), clickListExitHandler_wild(exit)]);
    const focusListExitHandlers_wild = focusExits_wild.map(exit => [element(exit?.node), focusListExitHandler_wild(exit)]);

    // 添加除 trigger 以外其它和焦点相关的事件监听器
    addListRelatedListeners();

    let isMouseDown = false;
    /** 标记是否从封面进入列表，用于防止纠正列表焦点的误判，用于野生封面 */
    let isEnterFromCover = false;

    /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
     |          LIST HANDLERS          |
     +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

    function focusTrapListHandler(e) {

      const focusTarget = e.target;

      // 进入封面（封面在列表中）
      if (enabledCover && focusTarget === _coverNode) {
        trappedCover = true;
        return ;
      }

      // 纠正进入封面，从外部进入列表，如果没有通过封面，则重新聚焦封面
      if (enabledCover && isMouseDown === false && trappedCover === false) {
        tickFocus(_coverNode);
        return ;
      }

      // 纠正外部聚焦进来的焦点
      if (correctionTarget !== false && enabledTabSequence && trappedList === false && isMouseDown === false) // 如果是内部的聚焦，无需纠正，防止嵌套情况的循环问题
      {
        const originGotCorrectionTarget = correctionTarget?.({ list: _subNodes, cover: _coverNode, root: _rootNode, last: _subNodes[activeIndex], lastI: activeIndex }) ?? (activeIndex === -1 ? _subNodes[0] : _subNodes[activeIndex]);
        const gotCorrectionTarget = element(originGotCorrectionTarget);
        const targetIndex = _subNodes.findIndex(item => item === gotCorrectionTarget);
        if (targetIndex > -1) {
          prevActive = activeIndex;
          activeIndex = targetIndex;
          onMove?.({ e, prev: _subNodes[prevActive], cur: _subNodes[activeIndex], prevI: prevActive, curI: activeIndex });
          trappedList = true;
        }
        tickFocus(gotCorrectionTarget);
      }
    }

    function blurTrapListHandler(e) {

      setTimeout(() => { // 延迟后获取下一次聚焦的元素，否则当前聚焦元素是 body

        const active = getActiveElement();
        const isOutRootNode = !_rootNode.contains(active);
        const isActiveCover = active === _coverNode;

        // 从封面退出
        if (e.target === _coverNode && isOutRootNode) {
          trappedCover = false; // 退出封面
          return;
        }
        if (isOutRootNode && !isActiveCover) // 聚焦在 rootNode 之外，并且没有聚焦在封面上
          outListExitHandler(e);
        if (isActiveCover || isOutRootNode) { // 聚焦在 rootNode 之外，或者聚焦在封面上
          onMove?.({ e, prev: _subNodes[activeIndex], cur: null, prevI: activeIndex, curI: -1 });
          trappedList = false;
          if (!isActiveCover) trappedCover = false; // 退出封面
        }
      });
    }

    function mousedownListItemHandler(e) {
      isMouseDown = true;
      setTimeout(() => {
        isMouseDown = false; // mousedown 没有出口，只能使用定时器，isMouseDown 主要在两个 focus 事件中使用，当触发 focus 时，此定时器还未执行，以此保证正确性
      });

      let targetItem;
      if (!enabledTabSequence ||
        (enabledTabSequence && (targetItem = _subNodes.find(item => item.contains(e.target))))) {
        trappedList = true;
        if (enabledCover) trappedCover = true;
        if (allowSafariToFocusAfterMousedown && targetItem && window.safari !== undefined) { // 兼容 Safari（桌面端），具体问题查看：https://github.com/wswmsword/web-experiences/tree/main/browser/safari-button-focus
          focus(targetItem); // Safari 不会聚焦按钮元素，这里强制使用 api 聚焦
          e.preventDefault(); // 阻止默认行为可以避免 targetItem 失焦
        }
      }
    }

    /** 点击聚焦列表某一单项 */
    function clickListItemHandler(e) {
      const target = e.target;
      const targetIndex = _subNodes.findIndex(e => e.contains(target));
      if (targetIndex > -1) {
        prevActive = activeIndex;
        activeIndex = targetIndex;

        onClick?.({ e, prev: _subNodes[prevActive], cur: _subNodes[activeIndex], prevI: prevActive, curI: activeIndex });
        if (prevActive !== activeIndex || trappedList === false)
          onMove?.({ e, prev: _subNodes[prevActive], cur: _subNodes[activeIndex], prevI: prevActive, curI: activeIndex });
      }
    }

    /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
     |         COVER HANDLERS          |
     +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

    function focusTrapCoverHandler() { trappedCover = true; }

    function blurTrapCoverHandler() {
      if (isEnterFromCover) { // 用于防止纠正列表焦点的误判，如果是进入列表，则 trappedCover 还应是 true
        isEnterFromCover = false;
        return;
      }
      trappedCover = false;
    }

    /** 封面的键盘事件响应 */
    function keyCoverHandler(e) {
      if (e.target !== _coverNode) return;

      // 入口
      if((coverEnterKey ?? isEnterEvent)(e) && !trappedList) {
        e.preventDefault();
        isEnterFromCover = true;
        trappedList = true
        onEnterCover?.(e);
        activeIndex = activeIndex === -1 ? 0 : activeIndex;
        focus(_subNodes[activeIndex]);
        onMove?.({ e, prev: null, cur: _subNodes[activeIndex], prevI: null, curI: activeIndex });
        return;
      }

      // 出口
      for (let exit of exitsCover) {
        const { key, on, target: origin } = exit;
        const target = element(origin);
        if (key?.(e, activeIndex)) {
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
      }

      /** 退出封面焦点的行为 */
      function exitCoverHandler(e, onExit, target) {
        onExit?.(e);
        target && focus(target);
        removeListRelatedListeners();
      }
    }

    /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
     |            + START +            |
     |          EXIT HANDLERS          |
     +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

    function outListExitHandler(e) {
      for (const exit of outListExits) {
        const { on, target: origin_target, delay } = exit;
        const target = element(origin_target);
        exitHandler(e, on, target, delay, _coverNode, _subNodes);
        break;
      }
    }

    function clickExitHandler(e, exit) {
      const { node: origin_node, on, target: origin_target, delay } = exit;
      const node = element(origin_node);
      const target = element(origin_target);

      if (
        (node != null && !node.contains(e.target)) ||
        node == null) return false;
      exitHandler(e, on, target, delay, _coverNode, _subNodes);
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
      exitHandler(e, on, target, delay, _coverNode, _subNodes);
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
      if (key?.(e, activeIndex)) {
        exitHandler(e, on, target, delay, _coverNode, _subNodes);
        e.stopImmediatePropagation(); // 列表和封面可能是同一个元素，避免封面响应键盘事件，这里已经执行成功了
        return true;
      }
    }

    /** 触发键盘退出列表，退出列表焦点 */
    function keyListExitHandler(e) {
      if (e.target === _coverNode) return; // 被封面触发直接返回

      if (disabledEsc && isEscapeEvent(e)) return;

      for (const exit of keyExits) {
        const isOK = keyExitHandler(e, exit);
        if (isOK) break;
      }
    }

    function clickListExitHandler_wild(exit) {
      return function(e) { clickExitHandler(e, exit); }
    }

    function focusListExitHandler_wild(exit) {
      return function(e) { focusExitHandler(e, exit); }
    }

    /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
     |             - END -             |
     |          EXIT HANDLERS          |
     +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

    /** 添加焦点需要的事件监听器 */
    function addListRelatedListeners() {

      listListeners.push(_rootNode, "focusin", focusTrapListHandler);

      listListeners.push(_rootNode, "focusout", blurTrapListHandler);

      if (!_rootNode.contains(_coverNode) && _coverNode != null) {

        listListeners.push(_coverNode, "focus", focusTrapCoverHandler);

        listListeners.push(_coverNode, "blur", blurTrapCoverHandler);
      }

      listListeners.push(_rootNode, "keydown", e => {
        // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
        keyListMoveHandler(e);
        // 列表键盘出口
        if (hasKeyExits) keyListExitHandler(e);
      });

      if (enabledTabSequence) {
        // 点击聚焦列表单项，只在手动列表时监听点击，因为自动模式不需要记录 activeIndex
        listListeners.push(_rootNode, "click", clickListItemHandler);
      }

      // 由于 click 事件在 focus 之后，这里用来判断是否通过点击进入列表，用于纠错未知进入列表的焦点定位
      listListeners.push(_rootNode, "mousedown", mousedownListItemHandler);

      if (hasClickExits) {
        // 列表点击出口
        listListeners.push(_rootNode, "click", clickListExitHandler);
      }

      if (hasFocusExits) {
        // 列表聚焦出口
        listListeners.push(_rootNode, "focusin", focusListExitHandler);
      }

      // 非列表内的出口
      focusListExitHandlers_wild.forEach(([node, handler]) => {
        listListeners.push(node, "focus", handler);
      });
      clickListExitHandlers_wild.forEach(([node, handler]) => {
        listListeners.push(node, "click", handler);
      });

      // 封面的事件
      listListeners.push(_coverNode, "keydown", keyCoverHandler);

      // flush
      listListeners.addListeners();
    };
  }

  /** 添加入口事件 */
  function addEntryListeners() {

    if (!entryListeners.isEmpty) return;

    for (let entry of entries) {
      const { node: origin, on, key, type, target, delay } = entry;
      const types = [].concat(type);
      const allTypes = ["keydown", "focus", "click"];
      const node = element(origin);

      types.forEach(type => {
        if (node && allTypes.includes(type)) {
          const handler = type === "keydown"
            ? entryKeyHandler
            : entryNotKeyHandler;
          entryListeners.push(node, type, handler); // 保存事件信息
        }
      });

      function entryKeyHandler(e) {
        if (key?.(e, activeIndex)) {
          e.preventDefault();
          entryHandler(e, on, target, delay);
          if (removeListenersEachEnter && !manual)
            entryListeners.removeListeners();
        }
      }
    
      function entryNotKeyHandler(e) {
        entryHandler(e, on, target, delay);
        if (removeListenersEachEnter && !manual)
          entryListeners.removeListeners();
      }
    }

    // flush
    entryListeners.addListeners();
  }

  /** 移除监听事件 */
  function removeListRelatedListeners() {

    // 如果是默认的，没有定义出口的封面，则不移除事件
    if (isDefaultExitCover) return;

    if (removeListenersEachExit && !manual) {
      listListeners.removeListeners();
    }
  }
};

export default focusNoJutsu;