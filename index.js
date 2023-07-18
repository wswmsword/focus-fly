import { objToStr, isObj, isFun, getActiveElement, element, tick, isSelectableInput, isEnterEvent, isEscapeEvent, isTabForward, isTabBackward, findLowestCommonAncestorNode } from "./utils";

/** 聚焦，如果是 input，则聚焦后选中 */
const focus = function(e) {
  e.focus();
  if (isSelectableInput(e))
    e.select();
};

/** 尝试聚焦，如果聚焦失效，则下个 setTimeout 再次聚焦 */
const tickFocus = function(e) {
  if (e == null) tick(() => e && focus(e));
  else focus(e);
};

/** 手动聚焦下一个元素 */
const focusNextListItemBySequence = (subNodes, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, coverNode, onMove, trappedList) => e => {
  if (e.target === coverNode) return;
  if (!trappedList()) return;

  const [index_, setIndex] = useActiveIndex();
  const index = Math.max(0, index_);
  const itemsLen = subNodes.length;
  if ((isNext ?? isTabForward)(e)) {
    const incresedI = index + 1;
    let nextI = isClamp ? Math.min(itemsLen - 1, incresedI) : incresedI;
    nextI %= itemsLen;
    onNext?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    onMove?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    setIndex(nextI);
    focus(subNodes[nextI]);
    e.preventDefault();
  }
  else if ((isPrev ?? isTabBackward)(e)) {
    const decresedI = index - 1;
    let nextI = isClamp ? Math.max(0, decresedI) : decresedI;
    nextI = (nextI + itemsLen) % itemsLen;
    onPrev?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    onMove?.({ e, prev: subNodes[index], cur: subNodes[nextI], prevI: index, curI: nextI });
    setIndex(nextI);
    focus(subNodes[nextI]);
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
const getKeyNodes = function(originRoot, originList, originCover, coverIsRoot) {
  const list = originList.map(item => element(item)).filter(item => item != null);
  const head = list[0];
  const tail = list.slice(-1)[0];
  const root = element(originRoot) ?? findLowestCommonAncestorNode(head, tail);
  const cover = coverIsRoot ? root : element(originCover);

  return {
    root,
    list,
    head,
    tail,
    cover,
  };
};

/** 用于处理节点属性可以传递数组的情况，用于入口和出口 */
const pickNodesAry = function(acc, cur) {
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
    .reduce(pickNodesAry, []);
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
const getDelayType = function(delay, processor) {
  const isFunctionDelay = isFun(delay);
  const delayRes = isFunctionDelay && delay(processor);
  const promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]" && typeof delayRes.then === "function";
  const callbackDelay = isFunctionDelay && !promiseDelay;
  const commonDelay = (delay === true) && !promiseDelay && !callbackDelay;
  return {
    promiseDelay,
    callbackDelay,
    commonDelay,
    delayRes,
  };
};

/** 延迟执行某些操作 */
const delayToProcess = function(delay, processor) {

  const { promiseDelay, callbackDelay, commonDelay, delayRes } = !!delay ? getDelayType(delay, processor) : {};
  if (promiseDelay) delayRes.then(processor);
  else if (callbackDelay) {}
  else if (commonDelay) processor();
  else return true;
};

/** 获取出口或者入口的目标 */
const getTarget = function(target, cover, list, root, enabledCover, activeIndex, defaultTarget, e) {
  // 空 target 走默认
  if (target == null || target === true) {
    if (enabledCover) return cover;
    else return defaultTarget;
  }
  // 函数 target 则传入节点执行
  else if (isFun(target)) {
    const gotTarget = target({ e, list, cover, root, last: list[activeIndex], lastI: activeIndex });
    if (gotTarget == null || gotTarget === true) {
      if (enabledCover) return cover;
      else return defaultTarget;
    }
    return gotTarget;
  }
  // 选择器字符串或者节点，则直接获取
  else return element(target);
};

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
  prevI = -1;
  curI = -1;
  _prev = null;
  _cur = null;
  get prev() {
    return this._prev || this.data[this.prevI] || null; // _prev 可能由于 dom 未加载而为 null，为 null 则通过 prevI 取值
  };
  get cur() {
    return this._cur || this.data[this.curI] || null;
  };
  set prev(v) {
    this._prev = v;
  };
  set cur(v) {
    this._cur = v;
  };
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
  };
  record(cur, curI) {
    if (curI === -1 && this.curI === curI) return; // curI 为 -1 后，不会再次更新新的 -1
    this.recordPrev(this.cur, this.curI);
    this.recordCur(cur, curI);
  };
  recordPrev(prev, prevI) {
    this.prevI = prevI < 0 ? -1 : prevI;
    this.prev = prev || null;
  };
  recordCur(cur, curI) {
    this.curI = curI < 0 ? -1 : curI;
    this.cur = cur || null;
  };
  recordSequenceByIdx(curI) {
    this.record(this.data[curI], curI);
  };
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
    /** 初始的列表中聚焦元素的序号 */
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
    /** 每次退出列表是否添加入口监听事件 */
    addEntryListenersEachExit = true,
    /** 手动添加和移除监听事件，入口、列表、出口的监听事件，`removeListenersEachExit` 和 `removeListenersEachEnter` 将失效 */
    manual,
    /** 用于抹平 Safari 不同于其它浏览器，点击后 button 之类的元素不会被聚焦的问题 */
    allowSafariToFocusAfterMousedown = true,
    /** 用于内部调试 */
    // demo = false,
  } = options;

  /** 入口们 */
  const entries = [].concat(entry) // 转为数组
    .filter(o => o != null) // 过滤空值
    .map(ele => isObj(ele) ? ele : { node: ele }) // 元素转为对象，并且默认元素的值被看作对象的 node 属性
    .map(entry => ({ // 对元素的属性进行默认处理
      ...entry,
      delay: entry.delay ?? delayToFocus,
      type: entry.type === undefined ? [entry.key == null ? '' : "keydown", entry.node == null ? '' : "click"].filter(t => t != '') : [].concat(entry.type),
      onExit: entry.onExit === true ? entry.on : entry.onExit, // 这个入口是开关吗
    }))
    .reduce(pickNodesAry, []); // 处理元素的 node 属性是数组的情况，将它分解成多个元素
  /** 是否是空入口 */
  const hasNoEntry = entries.length === 0;
  /** 带切换的入口，如果 entry.onExit 有值，代表这个入口同时也是出口，也就是开关 */
  const toggles = new Set(entries.map(e => isFun(e.onExit) ? e.node : null).filter(n => n != null).map(n => element(n)));
  /** 默认入口，默认情况下，会从出口回到这个入口 */
  let _trigger = element(trigger || entries[0]?.node);


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
  /** 退出封面，封面的出口们 */
  const exitsCover = [].concat(exitCover) // 转为数组
    .filter(e => e != null) // 过滤空值
    .map(e => isObj(e) ? e : { key: e }) // 元素转为对象，并且默认元素的值被看作对象的 key 属性
    .map(e => ({ // 对元素的属性进行默认处理
      ...e,
      target: e.target ?? _trigger,
    }));
  /** 是否使用默认的离开封面方法，也即 tab 和 shift-tab */
  const isDefaultExitCover = enabledCover && exitsCover.length === 0;


  /** 列表 */
  const list = new TabList();

  list.recordPrev(null, initialActive ?? -1);

  const {
    key: isNext,
    on: onNext,
  } = isObj(next) ? next : { key: next };

  const {
    key: isPrev,
    on: onPrev,
  } = isObj(prev) ? prev : { key: prev };

  /** 禁用左上角 esc 出口 */
  const disabledEsc = onEscape === false;

  /** 取消循环则设置头和尾焦点 */
  const isClamp = !(loop ?? true);

  /** 是否打开列表序列，按照序列的顺序进行焦点导航 */
  const enabledTabSequence = !!(isNext || isPrev || sequence); // 自定义前进或后退焦点函数，则设置 sequence 为 true

  /** 进入了列表 */
  let trappedList = false;
  /** 进入了封面 */
  let trappedCover = false;

  /** 是否已添加监听事件 */
  const listListeners = new ListenersCache();
  /** 是否已添加入口的监听事件 */
  const entryListeners = new ListenersCache();
  /** 按键转发，监听事件 */
  const keyForwards = new KeyForwardCache();

  if (!manual) { // 如果不是手动添加事件，则注册入口、列表相关（封面、列表、出口）的事件
    // 入口点击事件
    addEntryListeners();

    // 如果有入口不需要延迟，则立即加载列表的监听事件
    const hasImmediateEntry = (hasNoEntry ? [{}] : entries).some(({ delay }) => !delay);

    if (hasImmediateEntry) {

      const {
        root, list: newList, cover,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      list.update(newList);

      loadListRelatedListeners(root, list, cover);
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
        for (let i = 0; i < entries.length; ++ i) {
          const { on, type, node, target, delay } = entries[i];
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
        list: newList,
        cover,
        root,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);

      if (tempExit) {
        const { on, target: originTarget } = tempExit;
        const target = element(originTarget);
        return toExit(target, on);
      } else {
        const exits = getExits(exit, onEscape, enabledCover, cover, _trigger);
        for (let i = 0; i < exits.length; ++ i) {
          const { on, type, target } = exits[i];
          const invokeType = "invoke";
  
          if (type?.some(type => type == null || type === false || type === invokeType)) {
            return toExit(target, on);
          }
        }
      }

      function toExit(target, on) {

        if (list.isEmpty()) list.update(newList);

        return exitHandler({ fromInvoke: true }, on, target, false, cover, list.data, root);
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
        root,
        list: newList,
        cover,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      if (list.isEmpty()) list.update(newList);

      loadListRelatedListeners(root, list, cover);
    },
    /** 添加转发 */
    addForward(id, forward) {
      let opts = null;
      if (isFun(forward)) {
        const {
          root,
          list: listData, head, tail,
          cover,
        } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);

        opts = forward({ root, list: listData, head, tail, cover, curI: list.curI, prevI: list.prevI });
      }
      else opts = forward;

      const { node: origin_node, on, key, target: origin_target } = opts;
      const node = element(origin_node);
      const target = element(origin_target);
      keyForwards.push(id, node, e => {
        if (key?.(e, list.prevI, list.curI)) {
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
        list.recordSequenceByIdx(newI);
        const { prev, prevI, cur, curI } = list;
        onMove?.({ e: { fromI: true }, prev, prevI, cur, curI });
        focus(subNodes[curI]);
        return newI;
      }
      else return list.curI < 0 ? list.prevI : list.curI;
    },
  };

  return Return;

  /** 入口 handler */
  function entryHandler(e, onEnter, target, delay) {

    // 如果已经在列表或者封面，则不再触发入口；出口不需要该操作，因为不存在从出口退出到出口的子元素的情况，相反，存在入口进入到入口子元素的情况。
    if (trappedCover || trappedList) return;

    Promise.resolve(onEnter?.(e)).then(_ => {
      const isImmediate = !delay;
      if (isImmediate) findNodesToLoadListenersAndFocus();
      else delayToProcess(delay, findNodesToLoadListenersAndFocus);
    })

    /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
    function findNodesToLoadListenersAndFocus() {
      const {
        root,
        list: newList,
        cover,
      } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
      list.update(newList);

      if (!manual)
        loadListRelatedListeners(root, list, cover);
      if (target !== false)
        focusTarget(cover, list, root);
    }
    
    function focusTarget(cover, listInfo, rootNode) {
      const list = listInfo.data;
      const { prev, head, curI } = listInfo;
      const defaultTarget = prev || head;
      const gotTarget = getTarget(target, cover, list, rootNode, enabledCover, curI, defaultTarget, e);
      const targetIdx = list.indexOf(gotTarget);
      if (targetIdx > -1) {
        if (enabledTabSequence) { // onMove 仅支持打开 sequence 后
          listInfo.recordSequenceByIdx(targetIdx); // 只有在聚焦列表元素时才设置，否则会破坏原有 curI
          const { cur, curI } = listInfo;
          onMove?.({ e, prev: null, cur, prevI: -1, curI });
        }
        trappedList = true;
      }
      if (enabledCover && (gotTarget === cover || targetIdx > -1)) trappedCover = true;
      tickFocus(gotTarget);
    }
  }

  /** 出口 handler */
  function exitHandler(e, on, target, delay, cover, listData, root, ef) {

    if (!trappedList || 
      !(isFun(ef) ? ef({ e, prev: list.prev, cur: list.cur, prevI: list.prevI, curI: list.curI }) : true))
      return false;

    list.recordSequenceByIdx(-1);

    trappedList = false;

    e.preventDefault?.(); // 阻止默认行为，例如 tab 到下一个元素，例如 entry button 触发 click 事件

    const gotTarget = getTarget(target, cover, listData, root, enabledCover, list.curI, _trigger, e);

    if (gotTarget) return exitListWithTarget();
    else return exitListWithoutTarget();

    /** 退出列表，有 target */
    function exitListWithTarget() {

      Promise.resolve(on?.(e)).then(_ => {
        delay = delay ?? delayToBlur;
        const isImmediate = delayToProcess(delay, focusThenRemoveListeners);
        if (isImmediate) focusThenRemoveListeners();
      });

      function focusThenRemoveListeners() {
        focus(gotTarget);
        enabledTabSequence && onMove?.({ e, prev: list.prev, cur: null, prevI: list.prevI, curI: -1 });
        if (!manual) {
          if (gotTarget !== cover)
            removeListRelatedListeners();
          if (addEntryListenersEachExit)
            addEntryListeners();
        }
      }
    }

    /** 退出列表，无 target */
    function exitListWithoutTarget() {

      Promise.resolve(on?.(e)).then(_ => {

        if (gotTarget === false) { // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用

          const removeListenersWithoutFocus = focusThenRemoveListeners();
          removeListenersWithoutFocus();
          return ;
        }
        if (enabledCover) {

          enabledTabSequence && onMove?.({ e, prev: list.prev, cur: null, prevI: list.prevI, curI: -1 });
          focus(cover);
        } else {
  
          delay = delay ?? delayToBlur;
          const focusTriggerThenRemoveListeners = focusThenRemoveListeners(_trigger);
          const isImmediate = delayToProcess(delay, focusTriggerThenRemoveListeners);
          if (isImmediate) focusTriggerThenRemoveListeners();
        }
      });

      function focusThenRemoveListeners(focusTarget) {
        return _ => {
          focusTarget && focus(focusTarget);
          enabledTabSequence && onMove?.({ e, prev: list.prev, cur: null, prevI: list.prevI, curI: -1 });
          if (!manual) {
            removeListRelatedListeners();
            if (addEntryListenersEachExit)
              addEntryListeners();
          }
        }
      }
    }
  }

  /** 生成事件行为，添加事件监听器 */
  function loadListRelatedListeners(root, listInfo, cover) {

    const list = listInfo.data;
    const head = listInfo.head;
    const tail = listInfo.tail;

    if (!listListeners.isEmpty) return ; // 列表的监听事件没有移除之前，不需要再次添加列表监听事件

    if (root == null)
      throw new Error(`没有找到元素 ${rootNode}，您可以尝试 delayToFocus 选项，等待元素 ${rootNode} 渲染完毕后进行聚焦。`);
    if (head == null || tail == null)
      throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

    // 添加除 trigger 以外其它和焦点相关的事件监听器
    addListRelatedListeners();

    /** 添加焦点需要的事件监听器 */
    function addListRelatedListeners() {

      const useActiveIndex = () => [listInfo.curI, listInfo.recordSequenceByIdx.bind(listInfo)];

      const isTrappedList = () => hasNoEntry ? true : trappedList;

      // 在焦点循环中触发聚焦
      const keyListMoveHandler = enabledTabSequence ?
        focusNextListItemBySequence(list, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, cover, onMove, isTrappedList) :
        focusNextListItemByRange(list, isClamp, onNext, onPrev, root, cover, isTrappedList);

      /** 出口们，列表的出口们，list 的出口们 */
      const exits = getExits(exit, onEscape, enabledCover, cover, _trigger);
      const {
        keyExits, clickExits, focusExits, hasClickExits, hasFocusExits, hasKeyExits,
        clickExits_wild, focusExits_wild,
        outListExits,
      } = splitExits(exits, root);

      /** 非跟节点内的，是根节点之外的出口 */
      const clickListExitHandlers_wild = clickExits_wild.map(exit => [element(exit?.node), clickListExitHandler_wild(exit)]);
      const focusListExitHandlers_wild = focusExits_wild.map(exit => [element(exit?.node), focusListExitHandler_wild(exit)]);

      listListeners.push(root, "focusin", focusTrapListHandler);

      listListeners.push(root, "focusout", blurTrapListHandler);

      if (!root.contains(cover) && cover != null) {

        listListeners.push(cover, "focus", focusTrapCoverHandler);

        listListeners.push(cover, "blur", blurTrapCoverHandler);
      }

      listListeners.push(root, "keydown", e => {
        // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
        keyListMoveHandler(e);
        // 列表键盘出口
        if (hasKeyExits) keyListExitHandler(e);
      });

      if (enabledTabSequence || hasClickExits) {
        listListeners.push(root, "click", e => {
          // 点击聚焦列表单项，只在手动列表时监听点击，因为自动模式不需要记录 list.curI
          enabledTabSequence && clickListItemHandler(e);
          // 列表点击出口
          hasClickExits && clickListExitHandler(e);
        });
      }

      // 由于 click 事件在 focus 之后，这里用来判断是否通过点击进入列表，用于纠错未知进入列表的焦点定位
      listListeners.push(root, "mousedown", mousedownListItemHandler);

      if (hasFocusExits) {
        // 列表聚焦出口
        listListeners.push(root, "focusin", focusListExitHandler);
      }

      // 非列表内的出口
      focusListExitHandlers_wild.forEach(([node, handler]) => {
        listListeners.push(node, "focus", handler);
      });
      clickListExitHandlers_wild.forEach(([node, handler]) => {
        listListeners.push(node, "click", handler);
      });

      if (cover != null) {
        // 封面的事件
        listListeners.push(cover, "keydown", keyCoverHandler);
      }

      // flush
      listListeners.addListeners();



      let isMouseDown = false;
      /** 标记是否从封面进入列表，用于防止纠正列表焦点的误判，用于野生封面 */
      let isEnterFromCover = false;


      /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
       |          LIST HANDLERS          |
       +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

      function focusTrapListHandler(e) {

        // 进入封面（封面在列表中）
        if (enabledCover && e.target === cover) { // TODO: 保留确认，或是否需要添加 `&& trappedList` 条件
          trappedCover = true;
          return ;
        }

        // 纠正进入封面，从外部进入列表，如果没有通过封面，则重新聚焦封面
        if (enabledCover && isMouseDown === false && trappedCover === false) {
          tickFocus(cover);
          return ;
        }

        // 纠正外部聚焦进来的焦点
        if (correctionTarget !== false && enabledTabSequence && trappedList === false && isMouseDown === false) // 如果是内部的聚焦，无需纠正，防止嵌套情况的循环问题
        {
          const defaultLast = listInfo.prev || listInfo.head;
          const originGotCorrectionTarget = correctionTarget?.({ list, cover, root, last: listInfo.prev, lastI: listInfo.prevI }) ?? defaultLast;
          const gotCorrectionTarget = element(originGotCorrectionTarget);
          const targetIndex = list.findIndex(item => item === gotCorrectionTarget);
          if (targetIndex > -1) {
            listInfo.recordSequenceByIdx(targetIndex);
            onMove?.({ e, prev: null, cur: listInfo.cur, prevI: -1, curI: listInfo.curI });
          }
          trappedList = true;
          tickFocus(gotCorrectionTarget);
        }
      }

      function blurTrapListHandler(e) {
        // 用于保护可切换的入口能够被触发
        if (toggles.has(e.relatedTarget)) return;

        tick(() => { // 延迟后获取下一次聚焦的元素，否则当前聚焦元素是 body

          const active = getActiveElement();
          const isOutRootNode = !root.contains(active);
          const isActiveCover = active === cover;

          // 从封面退出
          if (e.target === cover && isOutRootNode) {
            trappedCover = false; // 退出封面
            return;
          }

          let isOutList = null;
          if (isActiveCover || isOutRootNode) {
            isOutList = outListExitHandler(e);
            listInfo.recordSequenceByIdx(-1);
          }
          if (isOutList === false) return; // 不符合 outlist 退出列表的条件

          if (isActiveCover) { // 聚焦在封面
            trappedList = false;
          } else if (isOutRootNode) { // 聚焦在非封面、非列表的区域
            trappedList = false;
            trappedCover = false;
          }
        });
      }

      function mousedownListItemHandler(e) {
        isMouseDown = true;
        tick(() => isMouseDown = false); // mousedown 没有出口，只能使用定时器，isMouseDown 主要在两个 focus 事件中使用，当触发 focus 时，此定时器还未执行，以此保证正确性

        let targetItem;
        if (!enabledTabSequence || // 未打开 sequence 属性 或者
          (enabledTabSequence && // 已打开 sequence 属性 并且
            (targetItem = list.find(item => item.contains(e.target))) // 点击的目标是列表中的元素
          )
        ) {
          trappedList = true;
          if (enabledCover) trappedCover = true;
          // 兼容 Safari（桌面端），具体问题查看：https://github.com/wswmsword/web-experiences/tree/main/browser/safari-button-focus
          if (allowSafariToFocusAfterMousedown && targetItem && window.safari !== undefined) {
            focus(targetItem); // Safari 不会聚焦按钮元素，这里强制使用 api 聚焦
            e.preventDefault(); // 阻止默认行为可以避免 targetItem 失焦
          }
        }
      }

      /** 点击聚焦列表某一单项 */
      function clickListItemHandler(e) {
        const targetIndex = list.findIndex(item => item.contains(e.target));
        if (targetIndex > -1) {
          const { prev: prevBeforeRecord, prevI: prevIBeforeRecord, curI: curIBeforeRecord } = listInfo;
          listInfo.recordSequenceByIdx(targetIndex);
          const { prev: prevAfterRecord, prevI: prevIAfterRecord, cur, curI } = listInfo;
          const prev = prevAfterRecord || prevBeforeRecord;
          const prevI = prevIAfterRecord < 0 ? prevIBeforeRecord : prevIAfterRecord;
          onClick?.({ e, prev, cur, prevI, curI });
          if (curIBeforeRecord < 0 // 从外部进入
            || prevI !== curI) // 列表内的移动
            onMove?.({ e, prev, cur, prevI, curI });
        }
      }

      /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
      |         COVER HANDLERS          |
      +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

      function focusTrapCoverHandler() { trappedCover = true; } // 捕获点击封面的情况

      function blurTrapCoverHandler() { // 捕获点击空白区域的情况
        if (isEnterFromCover) // 用于防止纠正列表焦点的误判，如果是进入列表，则 trappedCover 还应是 true
          isEnterFromCover = false;
        else
          trappedCover = false;
      }

      /** 封面的键盘事件响应 */
      function keyCoverHandler(e) {
        if (e.target !== cover) return;
        if (!(trappedCover && !trappedList)) return; // 继续执行，必须满足焦点在封面上，且不在列表中

        // 入口（封面），从封面进入列表
        if((coverEnterKey ?? isEnterEvent)(e) && !trappedList) {
          e.preventDefault();
          isEnterFromCover = true;
          trappedList = true;
          onEnterCover?.(e);
          if (enabledTabSequence) {
            listInfo.recordSequenceByIdx(Math.max(0, listInfo.prevI));
            focus(listInfo.cur);
            onMove?.({ e, prev: null, cur: listInfo.cur, prevI: -1, curI: listInfo.curI });
          } else
            focus(listInfo.data[0]);
          return;
        }

        // 出口（封面），从封面回到入口
        for (let i = 0; i < exitsCover.length; ++ i) {
          const { key, on, target: origin } = exitsCover[i];
          const target = element(origin);
          if (key?.(e, listInfo.prevI, listInfo.curI)) {
            exitCoverHandler(e, on, target);
            return;
          }
        }

        // 默认出口，默认行为，默认的行为的场景是包含子元素的长列表
        if (isDefaultExitCover &&
          isTabForward(e)) { // 虽然也是离开列表，但是这里不移除监听事件，因为移除后就不能再次进入封面
          focus(tail);
          return;
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
        for (let i = 0; i < outListExits.length; ++ i) {
          const { on, target: origin_target, delay } = outListExits[i];
          const target = element(origin_target);
          return exitHandler(e, on, target, delay, cover, list, root, outListExits[i].if);
        }
      }

      function exitHandlerWithCondition(e, exit, condition) {
        const { node: origin_node, on, target: origin_target, delay } = exit;
        const node = element(origin_node);
        const target = element(origin_target);

        if (condition(e, node, exit.key)) // 未设置点击目标
          return false;
        exitHandler(e, on, target, delay, cover, list, root, exit.if);
        return true;
      }

      function clickExitHandler(e, exit) {

        const cantClick = (e, node) => (node != null && !node.contains(e.target)) || node == null; // 点击目标不匹配 或者 未设置点击目标
        return exitHandlerWithCondition(e, exit, cantClick);
      }

      /** 点击列表的出口 */
      function clickListExitHandler(e) {
        for (let i = 0; i < clickExits.length; ++ i) {
          const isOK = clickExitHandler(e, clickExits[i]);
          if (isOK) break; // 只生效第一个满足条件的出口
        }
      }

      function focusExitHandler(e, exit) {

        const cantFocus = (e, node) => (node != null && e.target !== node) || node == null; // 聚焦目标不匹配 或者 未设置点击目标
        return exitHandlerWithCondition(e, exit, cantFocus);
      }

      /** 聚焦列表一个单项而退出 */
      function focusListExitHandler(e) {

        for (let i = 0; i < focusExits.length; ++ i) {
          const isOK = focusExitHandler(e, focusExits[i])
          if (isOK) break;
        }
      }

      function keyExitHandler(e, exit) {

        const cantKey = (e, node, key) => (node != null && e.target !== node) || (!key?.(e, listInfo.prevI, listInfo.curI)); // 聚焦目标不匹配 或者 未设置点击目标
        return exitHandlerWithCondition(e, exit, cantKey);
      }

      /** 触发键盘退出列表，退出列表焦点 */
      function keyListExitHandler(e) {
        if (e.target === cover) return; // 被封面触发直接返回

        if (disabledEsc && isEscapeEvent(e)) return;

        for (let i = 0; i < keyExits.length; ++ i) {
          const isOK = keyExitHandler(e, keyExits[i]);
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
    };
  }

  /** 添加入口事件 */
  function addEntryListeners() {

    if (!entryListeners.isEmpty) return;

    for (let i = 0; i < entries.length; ++ i) {
      const entry = entries[i];
      const { node: origin, on, key, type, target, delay, onExit } = entry;
      const ef = entry.if;
      const types = [].concat(type);
      const allTypes = ["keydown", "focus", "click"];
      const node = element(origin);

      types.forEach(type => {
        if (node && allTypes.includes(type)) {

          /** 是否是键盘事件 */
          const isKey = type === "keydown";
          /** 如果是键盘事件，则判断键位是否匹配，如果是非键盘事件，则直接返回 true */
          const ifKey = isKey ? e => key?.(e, list.prevI, list.curI) : _ => true;
          entryListeners.push(node, type, toggleHandler(ifKey, isKey)); // 保存事件信息
        }
      });
      
      function toggleHandler(ifKey, isKey) {
        return e => {
          if (
            (isFun(ef)
              ? ef({ e, prev: list.prev, cur: list.cur, prevI: list.prevI, curI: list.curI })
              : true) &&
            ifKey(e))
            toggleEntryAndExit(e, isKey);
        }
      }

      function toggleEntryAndExit(e, isKey) {

        /** 是否执行 */
        let processed = 0;
        if (trappedList) {
          if (isFun(onExit)) { // 若存在 onExit，则表示该入口同时是出口，是开关
            const { list, cover, root } = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot);
            exitHandler(e, onExit, target, false, cover, list, root);
            processed = !processed;
          }
        }
        else {
          entryHandler(e, on, target, delay);
          if (removeListenersEachEnter && !manual)
            entryListeners.removeListeners();
          processed = !processed;
        }

        // 如果是键盘事件，并且已执行，则阻止默认行为
        if (isKey && processed) e.preventDefault();
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