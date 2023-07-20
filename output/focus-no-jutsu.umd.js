/* 这是一条 banner？没错，这是一条 banner。这是 1.0.0 版本的 focus-no-jutsu。 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global.focusNoJutsu;
    var exports = global.focusNoJutsu = factory();
    exports.noConflict = function () { global.focusNoJutsu = current; return exports; };
  })());
})(this, (function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /** Object.prototype.toString.call 快捷方式 */
  var objToStr = function objToStr(obj) {
    return Object.prototype.toString.call(obj);
  };

  /** 参数是否是对象 */
  var isObj = function isObj(obj) {
    return objToStr(obj) === "[object Object]";
  };

  /** 是否为函数 */
  var isFun = function isFun(fun) {
    return objToStr(fun) === "[object Function]";
  };

  /** document.activeElement 的快捷方式 */
  var getActiveElement = function getActiveElement() {
    return document.activeElement;
  };

  /** document.querySelector 的快捷方式 */
  var querySelector = function querySelector(str) {
    return document.querySelector(str);
  };

  /** 通过字符串查找节点，或者直接返回节点 */
  var element = function element(e) {
    return typeof e === "string" ? querySelector(e) : e;
  };

  /** 滴答 */
  var tick = function tick(fn) {
    setTimeout(fn, 0);
  };

  /** 是否是 input 可 select 的元素 */
  var isSelectableInput = function isSelectableInput(node) {
    return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
  };

  /** 是否按下了 enter */
  var isEnterEvent = function isEnterEvent(e) {
    return e.key === "Enter" || e.keyCode === 13;
  };

  /** 按键是否是 esc */
  var isEscapeEvent = function isEscapeEvent(e) {
    return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
  };

  /** 按键是否是 tab */
  var isTabEvent = function isTabEvent(e) {
    return e.key === 'Tab' || e.keyCode === 9;
  };

  /** 是否是向前的 tab */
  var isTabForward = function isTabForward(e) {
    return isTabEvent(e) && !e.shiftKey;
  };

  /** 是否是向后的 tab */
  var isTabBackward = function isTabBackward(e) {
    return isTabEvent(e) && e.shiftKey;
  };

  /** 找到两个元素的最小公共祖先元素 */
  var findLowestCommonAncestorNode = function findLowestCommonAncestorNode(x, y) {
    if (x == null || y == null) return null;
    if (x.contains(y)) return x;
    if (y.contains(x)) return y;
    var range = new Range();
    range.setStartBefore(x);
    range.setEndAfter(y);
    if (range.collapsed) {
      range.setStartBefore(y);
      range.setEndAfter(x);
    }
    return range.commonAncestorContainer;
  };

  /** 聚焦，如果是 input，则聚焦后选中 */
  var focus = function focus(e) {
    e.focus();
    if (isSelectableInput(e)) e.select();
  };

  /** 尝试聚焦，如果聚焦失效，则下个 setTimeout 再次聚焦 */
  var tickFocus = function tickFocus(e) {
    if (e == null) tick(function () {
      return e && focus(e);
    });else focus(e);
  };

  /** 手动聚焦下一个元素 */
  var focusNextListItemBySequence = function focusNextListItemBySequence(subNodes, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, coverNode, onMove, trappedList) {
    return function (e) {
      if (e.target === coverNode) return;
      if (!trappedList()) return;
      var _useActiveIndex = useActiveIndex(),
        index_ = _useActiveIndex[0],
        setIndex = _useActiveIndex[1];
      var index = Math.max(0, index_);
      var itemsLen = subNodes.length;
      if ((isNext !== null && isNext !== void 0 ? isNext : isTabForward)(e)) {
        var incresedI = index + 1;
        var nextI = isClamp ? Math.min(itemsLen - 1, incresedI) : incresedI;
        nextI %= itemsLen;
        onNext === null || onNext === void 0 ? void 0 : onNext({
          e: e,
          prev: subNodes[index],
          cur: subNodes[nextI],
          prevI: index,
          curI: nextI
        });
        onMove === null || onMove === void 0 ? void 0 : onMove({
          e: e,
          prev: subNodes[index],
          cur: subNodes[nextI],
          prevI: index,
          curI: nextI
        });
        setIndex(nextI);
        focus(subNodes[nextI]);
        e.preventDefault();
      } else if ((isPrev !== null && isPrev !== void 0 ? isPrev : isTabBackward)(e)) {
        var decresedI = index - 1;
        var _nextI = isClamp ? Math.max(0, decresedI) : decresedI;
        _nextI = (_nextI + itemsLen) % itemsLen;
        onPrev === null || onPrev === void 0 ? void 0 : onPrev({
          e: e,
          prev: subNodes[index],
          cur: subNodes[_nextI],
          prevI: index,
          curI: _nextI
        });
        onMove === null || onMove === void 0 ? void 0 : onMove({
          e: e,
          prev: subNodes[index],
          cur: subNodes[_nextI],
          prevI: index,
          curI: _nextI
        });
        setIndex(_nextI);
        focus(subNodes[_nextI]);
        e.preventDefault();
      }
    };
  };

  /** 按下 tab，以浏览器的行为聚焦下个元素 */
  var focusNextListItemByRange = function focusNextListItemByRange(list, isClamp, onNext, onPrev, rootNode, coverNode, trappedList) {
    return function (e) {
      var head = list[0];
      var tail = list.at(-1);
      var current = e.target;
      if (current === coverNode) return;
      if (!trappedList()) return;
      if (isTabForward(e)) {
        onNext === null || onNext === void 0 ? void 0 : onNext({
          e: e
        });
        if (current === tail) {
          e.preventDefault();
          if (!isClamp) focus(head);
        }
        if (current === rootNode) {
          e.preventDefault();
          focus(head);
        }
      } else if (isTabBackward(e)) {
        onPrev === null || onPrev === void 0 ? void 0 : onPrev({
          e: e
        });
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
  };

  /** 获取关键节点 */
  var getKeyNodes = function getKeyNodes(originRoot, originList, originCover, coverIsRoot) {
    var _element;
    var list = originList.map(function (item) {
      return element(item);
    }).filter(function (item) {
      return item != null;
    });
    var head = list[0];
    var tail = list.slice(-1)[0];
    var root = (_element = element(originRoot)) !== null && _element !== void 0 ? _element : findLowestCommonAncestorNode(head, tail);
    var cover = coverIsRoot ? root : element(originCover);
    return {
      root: root,
      list: list,
      head: head,
      tail: tail,
      cover: cover
    };
  };

  /** 用于处理节点属性可以传递数组的情况，用于入口和出口 */
  var pickNodesAry = function pickNodesAry(acc, cur) {
    var isAryNodes = Array.isArray(cur.node);
    var nodes = isAryNodes ? cur.node.map(function (n) {
      return _extends({}, cur, {
        node: n
      });
    }) : cur;
    return acc.concat(nodes);
  };

  /** 获取分割的出口 */
  var splitExits = function splitExits(exits, root) {
    /** 生效的节点是否在根元素内部（列表中） */
    var isInnerRoot = function isInnerRoot(node) {
      return node != null && root.contains(element(node)) || node == null;
    };
    var _exits$reduce = exits.reduce(function (acc, e) {
        var key = acc[0],
          click = acc[1],
          focus = acc[2],
          click_wild = acc[3],
          focus_wild = acc[4],
          outList = acc[5];
        var includeType = function includeType(type) {
          var _e$type;
          return (_e$type = e.type) === null || _e$type === void 0 ? void 0 : _e$type.includes(type);
        };
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
      }, new Array(6).fill([])),
      keyExits = _exits$reduce[0],
      clickExits = _exits$reduce[1],
      focusExits = _exits$reduce[2],
      clickExits_wild = _exits$reduce[3],
      focusExits_wild = _exits$reduce[4],
      outListExits = _exits$reduce[5];
    var hasClickExits = clickExits.length > 0;
    var hasFocusExits = focusExits.length > 0;
    var hasKeyExits = keyExits.length > 0;
    return {
      keyExits: keyExits,
      clickExits: clickExits,
      focusExits: focusExits,
      hasClickExits: hasClickExits,
      hasFocusExits: hasFocusExits,
      hasKeyExits: hasKeyExits,
      clickExits_wild: clickExits_wild,
      focusExits_wild: focusExits_wild,
      outListExits: outListExits
    };
  };

  /** 获取（生成）出口 */
  var getExits = function getExits(exit, onEscape, enabledCover, cover, trigger) {
    var _tempExits$0$on, _tempExits$;
    var tempExits = [].concat(exit).filter(function (o) {
      return o != null;
    }).map(function (ele) {
      return isObj(ele) ? ele : {
        node: ele
      };
    }).map(function (e) {
      return _extends({}, e, {
        // undefined 表示用户没有主动设置
        type: e.type === undefined ? [e.key == null ? '' : "keydown", e.node == null ? '' : "click"].filter(function (t) {
          return t !== '';
        }) : [].concat(e.type)
      });
    }).reduce(pickNodesAry, []);
    var _onEscape = isFun(onEscape) ? onEscape : onEscape === true ? (_tempExits$0$on = (_tempExits$ = tempExits[0]) === null || _tempExits$ === void 0 ? void 0 : _tempExits$.on) !== null && _tempExits$0$on !== void 0 ? _tempExits$0$on : function () {} : onEscape;
    /** 按下 esc 的出口 */
    var escapeExit = isFun(_onEscape) ? {
      node: null,
      key: isEscapeEvent,
      on: _onEscape,
      target: enabledCover ? cover : trigger,
      type: ["keydown"]
    } : null;
    var exits = [escapeExit].concat(tempExits).filter(function (e) {
      return e != null;
    });
    return exits;
  };

  /** 获取聚焦或失焦时延迟的类型 */
  var getDelayType = function getDelayType(delay, processor) {
    var isFunctionDelay = isFun(delay);
    var delayRes = isFunctionDelay && delay(processor);
    var promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]" && typeof delayRes.then === "function";
    var callbackDelay = isFunctionDelay && !promiseDelay;
    var commonDelay = delay === true && !promiseDelay && !callbackDelay;
    return {
      promiseDelay: promiseDelay,
      callbackDelay: callbackDelay,
      commonDelay: commonDelay,
      delayRes: delayRes
    };
  };

  /** 延迟执行某些操作 */
  var delayToProcess = function delayToProcess(delay, processor) {
    var _ref = !!delay ? getDelayType(delay, processor) : {},
      promiseDelay = _ref.promiseDelay,
      callbackDelay = _ref.callbackDelay,
      commonDelay = _ref.commonDelay,
      delayRes = _ref.delayRes;
    if (promiseDelay) delayRes.then(processor);else if (callbackDelay) ; else if (commonDelay) processor();else return true;
  };

  /** 获取出口或者入口的目标 */
  var getTarget = function getTarget(target, cover, list, root, enabledCover, activeIndex, defaultTarget, e) {
    // 空 target 走默认
    if (target == null || target === true) {
      if (enabledCover) return cover;else return defaultTarget;
    }
    // 函数 target 则传入节点执行
    else if (isFun(target)) {
      var gotTarget = target({
        e: e,
        list: list,
        cover: cover,
        root: root,
        last: list[activeIndex],
        lastI: activeIndex
      });
      if (gotTarget == null || gotTarget === true) {
        if (enabledCover) return cover;else return defaultTarget;
      }
      return gotTarget;
    }
    // 选择器字符串或者节点，则直接获取
    else return element(target);
  };

  /** 保存的监听事件信息，方便监听和移除监听 */
  var ListenersCache = /*#__PURE__*/function () {
    function ListenersCache() {
      this.cache = [];
      this.isEmpty = true;
    }
    var _proto = ListenersCache.prototype;
    _proto.push = function push(node, type, handler) {
      this.isEmpty = false;
      this.cache.push({
        node: node,
        type: type,
        handler: handler
      });
    };
    _proto.clean = function clean() {
      this.cache = [];
      this.isEmpty = true;
    };
    _proto.addListeners = function addListeners() {
      this.cache.forEach(function (l) {
        var _l$node;
        return (_l$node = l.node) === null || _l$node === void 0 ? void 0 : _l$node.addEventListener(l.type, l.handler);
      });
    };
    _proto.removeListeners = function removeListeners() {
      this.cache.forEach(function (l) {
        var _l$node2;
        return (_l$node2 = l.node) === null || _l$node2 === void 0 ? void 0 : _l$node2.removeEventListener(l.type, l.handler);
      });
      this.clean();
    };
    return ListenersCache;
  }();
  /** 按键转发的缓存 */
  var KeyForwardCache = /*#__PURE__*/function () {
    function KeyForwardCache() {
      this.cache = new Map();
    }
    var _proto2 = KeyForwardCache.prototype;
    _proto2.has = function has(id) {
      return this.cache.has(id);
    };
    _proto2.push = function push(id, node, handler) {
      if (this.has(id)) return;
      node.addEventListener("keydown", handler);
      this.cache.set(id, {
        node: node,
        handler: handler
      });
    };
    _proto2.remove = function remove(id) {
      var _this = this;
      var ids = [].concat(id);
      ids.forEach(function (id) {
        return _this.cache.get(id).node.removeEventListener("keydown", _this.cache.get(id).handler);
      });
    };
    return KeyForwardCache;
  }();
  /** 保存列表数据 */
  var TabList = /*#__PURE__*/function () {
    function TabList() {
      this.data = [];
      this.head = null;
      this.tail = null;
      this.prevI = -1;
      this.curI = -1;
      this._prev = null;
      this._cur = null;
    }
    var _proto3 = TabList.prototype;
    _proto3.update = function update(list) {
      this.data.splice(0, this.data.length);
      Array.prototype.push.apply(this.data, list);
      this.head = list[0];
      this.tail = list.at(-1);
    };
    _proto3.isEmpty = function isEmpty() {
      return this.data.length === 0;
    };
    _proto3.has = function has(i) {
      return !!this.data[i];
    };
    _proto3.record = function record(cur, curI) {
      if (this.curI === curI // this.curI 和 curI 必须不同
      || this.curI < 0 && curI < 0)
        // curI 为 -1 后，不会再次更新新的 -1
        return;
      this.recordPrev(this.cur, this.curI);
      this.recordCur(cur, curI);
    };
    _proto3.recordPrev = function recordPrev(prev, prevI) {
      this.prevI = prevI < 0 ? -1 : prevI;
      this.prev = prev || null;
    };
    _proto3.recordCur = function recordCur(cur, curI) {
      this.curI = curI < 0 ? -1 : curI;
      this.cur = cur || null;
    };
    _proto3.recordSequenceByIdx = function recordSequenceByIdx(curI) {
      this.record(this.data[curI], curI);
    };
    _createClass(TabList, [{
      key: "prev",
      get: function get() {
        return this._prev || this.data[this.prevI] || null; // _prev 可能由于 dom 未加载而为 null，为 null 则通过 prevI 取值
      },
      set: function set(v) {
        this._prev = v;
      }
    }, {
      key: "cur",
      get: function get() {
        return this._cur || this.data[this.curI] || null;
      },
      set: function set(v) {
        this._cur = v;
      }
    }]);
    return TabList;
  }();
  var focusNoJutsu = function focusNoJutsu() {
    var _ref2, _entries$;
    var offset = 0 - ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Array);
    var rootNode = 0 + offset < 0 || arguments.length <= 0 + offset ? undefined : arguments[0 + offset];
    var subNodes = 1 + offset < 0 || arguments.length <= 1 + offset ? undefined : arguments[1 + offset];
    var options = (_ref2 = 2 + offset < 0 || arguments.length <= 2 + offset ? undefined : arguments[2 + offset]) !== null && _ref2 !== void 0 ? _ref2 : {};
    if (!(Array.isArray(subNodes) && subNodes.length > 1)) throw new Error("请至少传入一个数组，数组至少包含两个可聚焦元素，用来表示列表的头和尾。");
    var sequence = options.sequence,
      loop = options.loop,
      next = options.next,
      prev = options.prev,
      trigger = options.trigger,
      entry = options.entry,
      _exit = options.exit,
      onEscape = options.onEscape,
      onClick = options.onClick,
      onMove = options.onMove,
      cover = options.cover,
      initialActive = options.initialActive,
      correctionTarget = options.correctionTarget,
      delayToFocus = options.delayToFocus,
      delayToBlur = options.delayToBlur,
      _options$removeListen = options.removeListenersEachExit,
      removeListenersEachExit = _options$removeListen === void 0 ? true : _options$removeListen,
      removeListenersEachEnter = options.removeListenersEachEnter,
      _options$addEntryList = options.addEntryListenersEachExit,
      addEntryListenersEachExit = _options$addEntryList === void 0 ? true : _options$addEntryList,
      manual = options.manual,
      _options$allowSafariT = options.allowSafariToFocusAfterMousedown,
      allowSafariToFocusAfterMousedown = _options$allowSafariT === void 0 ? true : _options$allowSafariT;

    /** 入口们 */
    var entries = [].concat(entry) // 转为数组
    .filter(function (o) {
      return o != null;
    }) // 过滤空值
    .map(function (ele) {
      return isObj(ele) ? ele : {
        node: ele
      };
    }) // 元素转为对象，并且默认元素的值被看作对象的 node 属性
    .map(function (entry) {
      var _entry$delay;
      return _extends({}, entry, {
        delay: (_entry$delay = entry.delay) !== null && _entry$delay !== void 0 ? _entry$delay : delayToFocus,
        type: entry.type === undefined ? [entry.key == null ? '' : "keydown", entry.node == null ? '' : "click"].filter(function (t) {
          return t != '';
        }) : [].concat(entry.type),
        onExit: entry.onExit === true ? entry.on : entry.onExit // 这个入口是开关吗
      });
    }).reduce(pickNodesAry, []); // 处理元素的 node 属性是数组的情况，将它分解成多个元素
    /** 是否是空入口 */
    var hasNoEntry = entries.length === 0;
    /** 带切换的入口，如果 entry.onExit 有值，代表这个入口同时也是出口，也就是开关 */
    var toggles = new Set(entries.map(function (e) {
      return isFun(e.onExit) ? e.node : null;
    }).filter(function (n) {
      return n != null;
    }).map(function (n) {
      return element(n);
    }));
    /** 默认入口，默认情况下，会从出口回到这个入口 */
    var _trigger = element(trigger || ((_entries$ = entries[0]) === null || _entries$ === void 0 ? void 0 : _entries$.node));
    var _ref3 = isObj(cover) ? cover : {},
      coverNode = _ref3.node,
      coverEnterKey = _ref3.enterKey,
      onEnterCover = _ref3.onEnter,
      exitCover = _ref3.exit;
    /** 是否已经打开封面选项 */
    var enabledCover = cover != null && cover !== false && coverNode !== false;
    /** 封面即根元素 */
    var coverIsRoot = enabledCover && (cover === true || coverNode === true || coverNode == null);
    /** 退出封面，封面的出口们 */
    var exitsCover = [].concat(exitCover) // 转为数组
    .filter(function (e) {
      return e != null;
    }) // 过滤空值
    .map(function (e) {
      return isObj(e) ? e : {
        key: e
      };
    }) // 元素转为对象，并且默认元素的值被看作对象的 key 属性
    .map(function (e) {
      var _e$target;
      return _extends({}, e, {
        target: (_e$target = e.target) !== null && _e$target !== void 0 ? _e$target : _trigger
      });
    });
    /** 是否使用默认的离开封面方法，也即 tab 和 shift-tab */
    var isDefaultExitCover = enabledCover && exitsCover.length === 0;

    /** 列表 */
    var list = new TabList();
    list.recordPrev(null, initialActive !== null && initialActive !== void 0 ? initialActive : -1);
    var _ref4 = isObj(next) ? next : {
        key: next
      },
      isNext = _ref4.key,
      onNext = _ref4.on;
    var _ref5 = isObj(prev) ? prev : {
        key: prev
      },
      isPrev = _ref5.key,
      onPrev = _ref5.on;

    /** 禁用左上角 esc 出口 */
    var disabledEsc = onEscape === false;

    /** 取消循环则设置头和尾焦点 */
    var isClamp = !(loop !== null && loop !== void 0 ? loop : true);

    /** 是否打开列表序列，按照序列的顺序进行焦点导航 */
    var enabledTabSequence = !!(isNext || isPrev || sequence); // 自定义前进或后退焦点函数，则设置 sequence 为 true

    /** 进入了列表 */
    var trappedList = false;
    /** 进入了封面 */
    var trappedCover = false;

    /** 是否已添加监听事件 */
    var listListeners = new ListenersCache();
    /** 是否已添加入口的监听事件 */
    var entryListeners = new ListenersCache();
    /** 按键转发，监听事件 */
    var keyForwards = new KeyForwardCache();
    if (!manual) {
      // 如果不是手动添加事件，则注册入口、列表相关（封面、列表、出口）的事件
      // 入口点击事件
      _addEntryListeners();

      // 如果有入口不需要延迟，则立即加载列表的监听事件
      var hasImmediateEntry = (hasNoEntry ? [{}] : entries).some(function (_ref6) {
        var delay = _ref6.delay;
        return !delay;
      });
      if (hasImmediateEntry) {
        var _getKeyNodes = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
          root = _getKeyNodes.root,
          newList = _getKeyNodes.list,
          _cover = _getKeyNodes.cover;
        list.update(newList);
        loadListRelatedListeners(root, list, _cover);
      }
    }
    var Return = {
      /** 调用形式的入口 */enter: function enter(entry) {
        _trigger = _trigger || getActiveElement();
        if (entry) {
          var on = entry.on,
            target = entry.target,
            delay = entry.delay;
          return entryHandler({
            fromInvoke: true
          }, on, target, delay);
        } else {
          var _loop = function _loop() {
            var _entries$i = entries[i],
              on = _entries$i.on,
              type = _entries$i.type,
              node = _entries$i.node,
              target = _entries$i.target,
              delay = _entries$i.delay;
            var invokeType = "invoke";
            if (type !== null && type !== void 0 && type.some(function (type) {
              return type == null || type === false || type === invokeType;
            }) || node == null) {
              return {
                v: entryHandler({
                  fromInvoke: true
                }, on, target, delay)
              };
            }
          };
          for (var i = 0; i < entries.length; ++i) {
            var _ret = _loop();
            if (typeof _ret === "object") return _ret.v;
          }
          return entryHandler({
            fromInvoke: true
          });
        }
      },
      /** 调用形式的出口 */exit: function exit(tempExit) {
        var _getKeyNodes2 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
          newList = _getKeyNodes2.list,
          cover = _getKeyNodes2.cover,
          root = _getKeyNodes2.root;
        if (tempExit) {
          var on = tempExit.on,
            originTarget = tempExit.target;
          var target = element(originTarget);
          return toExit(target, on);
        } else {
          var exits = getExits(_exit, onEscape, enabledCover, cover, _trigger);
          var _loop2 = function _loop2() {
            var _exits$i = exits[i],
              on = _exits$i.on,
              type = _exits$i.type,
              target = _exits$i.target;
            var invokeType = "invoke";
            if (type !== null && type !== void 0 && type.some(function (type) {
              return type == null || type === false || type === invokeType;
            })) {
              return {
                v: toExit(target, on)
              };
            }
          };
          for (var i = 0; i < exits.length; ++i) {
            var _ret2 = _loop2();
            if (typeof _ret2 === "object") return _ret2.v;
          }
        }
        function toExit(target, on) {
          if (list.isEmpty()) list.update(newList);
          return exitHandler({
            fromInvoke: true
          }, on, target, false, cover, list.data, root);
        }
      },
      /** 移除所有的监听事件 */removeListeners: function removeListeners() {
        listListeners.removeListeners();
        entryListeners.removeListeners();
      },
      /** 移除列表相关的事件 */removeListRelatedListeners: function removeListRelatedListeners() {
        listListeners.removeListeners();
      },
      /** 移除入口事件 */removeEntryListeners: function removeEntryListeners() {
        entryListeners.removeListeners();
      },
      /** 添加入口的监听事件 */addEntryListeners: function addEntryListeners() {
        _addEntryListeners();
      },
      /** 添加列表相关（封面、列表、出口）的监听事件 */addListRelatedListeners: function addListRelatedListeners() {
        var _getKeyNodes3 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
          root = _getKeyNodes3.root,
          newList = _getKeyNodes3.list,
          cover = _getKeyNodes3.cover;
        if (list.isEmpty()) list.update(newList);
        loadListRelatedListeners(root, list, cover);
      },
      /** 添加转发 */addForward: function addForward(id, forward) {
        var opts = null;
        if (isFun(forward)) {
          var _getKeyNodes4 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
            _root = _getKeyNodes4.root,
            listData = _getKeyNodes4.list,
            head = _getKeyNodes4.head,
            tail = _getKeyNodes4.tail,
            _cover2 = _getKeyNodes4.cover;
          opts = forward({
            root: _root,
            list: listData,
            head: head,
            tail: tail,
            cover: _cover2,
            curI: list.curI,
            prevI: list.prevI
          });
        } else opts = forward;
        var _opts = opts,
          origin_node = _opts.node,
          on = _opts.on,
          key = _opts.key,
          origin_target = _opts.target;
        var node = element(origin_node);
        var target = element(origin_target);
        keyForwards.push(id, node, function (e) {
          if (key !== null && key !== void 0 && key(e, list.prevI, list.curI)) {
            e.preventDefault();
            on === null || on === void 0 ? void 0 : on();
            tickFocus(target);
          }
        });
      },
      /** 移除转发 */removeForward: function removeForward(id) {
        keyForwards.remove(id);
      },
      /** 更新列表 */updateList: function updateList(newList) {
        var _newList = newList.map(function (item) {
          return element(item);
        }).filter(function (item) {
          return item != null;
        });
        list.update(_newList);
      },
      /** 当前聚焦的列表单项序号 */i: function i(newI) {
        if (list.has(newI) && trappedList) {
          list.recordSequenceByIdx(newI);
          var _prev = list.prev,
            prevI = list.prevI,
            cur = list.cur,
            curI = list.curI;
          onMove === null || onMove === void 0 ? void 0 : onMove({
            e: {
              fromI: true
            },
            prev: _prev,
            prevI: prevI,
            cur: cur,
            curI: curI
          });
          focus(subNodes[curI]);
          return newI;
        } else return list.curI < 0 ? list.prevI : list.curI;
      }
    };
    return Return;

    /** 入口 handler */
    function entryHandler(e, onEnter, target, delay) {
      // 如果已经在列表或者封面，则不再触发入口；出口不需要该操作，因为不存在从出口退出到出口的子元素的情况，相反，存在入口进入到入口子元素的情况。
      if (trappedCover || trappedList) return;
      Promise.resolve(onEnter === null || onEnter === void 0 ? void 0 : onEnter(e)).then(function (_) {
        var isImmediate = !delay;
        if (isImmediate) findNodesToLoadListenersAndFocus();else delayToProcess(delay, findNodesToLoadListenersAndFocus);
      });

      /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
      function findNodesToLoadListenersAndFocus() {
        var _getKeyNodes5 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
          root = _getKeyNodes5.root,
          newList = _getKeyNodes5.list,
          cover = _getKeyNodes5.cover;
        list.update(newList);
        if (!manual) loadListRelatedListeners(root, list, cover);
        if (target !== false) focusTarget(cover, list, root);
      }
      function focusTarget(cover, listInfo, rootNode) {
        var list = listInfo.data;
        var prev = listInfo.prev,
          head = listInfo.head,
          curI = listInfo.curI;
        var defaultTarget = prev || head;
        var gotTarget = getTarget(target, cover, list, rootNode, enabledCover, curI, defaultTarget, e);
        var targetIdx = list.indexOf(gotTarget);
        if (targetIdx > -1) {
          if (enabledTabSequence) {
            // onMove 仅支持打开 sequence 后
            listInfo.recordSequenceByIdx(targetIdx); // 只有在聚焦列表元素时才设置，否则会破坏原有 curI
            var cur = listInfo.cur,
              _curI = listInfo.curI;
            onMove === null || onMove === void 0 ? void 0 : onMove({
              e: e,
              prev: null,
              cur: cur,
              prevI: -1,
              curI: _curI
            });
          }
          trappedList = true;
        }
        if (enabledCover && (gotTarget === cover || targetIdx > -1)) trappedCover = true;
        tickFocus(gotTarget);
      }
    }

    /** 出口 handler */
    function exitHandler(e, on, target, delay, cover, listData, root, ef) {
      var _e$preventDefault;
      if (!trappedList || !(isFun(ef) ? ef({
        e: e,
        prev: list.prev,
        cur: list.cur,
        prevI: list.prevI,
        curI: list.curI
      }) : true)) return false;
      list.recordSequenceByIdx(-1);
      trappedList = false;
      (_e$preventDefault = e.preventDefault) === null || _e$preventDefault === void 0 ? void 0 : _e$preventDefault.call(e); // 阻止默认行为，例如 tab 到下一个元素，例如 entry button 触发 click 事件

      var gotTarget = getTarget(target, cover, listData, root, enabledCover, list.curI, _trigger, e);
      if (gotTarget) return exitListWithTarget();else return exitListWithoutTarget();

      /** 退出列表，有 target */
      function exitListWithTarget() {
        Promise.resolve(on === null || on === void 0 ? void 0 : on(e)).then(function (_) {
          var _delay;
          delay = (_delay = delay) !== null && _delay !== void 0 ? _delay : delayToBlur;
          var isImmediate = delayToProcess(delay, focusThenRemoveListeners);
          if (isImmediate) focusThenRemoveListeners();
        });
        function focusThenRemoveListeners() {
          focus(gotTarget);
          enabledTabSequence && (onMove === null || onMove === void 0 ? void 0 : onMove({
            e: e,
            prev: list.prev,
            cur: null,
            prevI: list.prevI,
            curI: -1
          }));
          if (!manual) {
            if (gotTarget !== cover) removeListRelatedListeners();
            if (addEntryListenersEachExit) _addEntryListeners();
          }
        }
      }

      /** 退出列表，无 target */
      function exitListWithoutTarget() {
        Promise.resolve(on === null || on === void 0 ? void 0 : on(e)).then(function (_) {
          if (gotTarget === false) {
            // 如果显式设为 false，则直接退出，不聚焦，会在一个列表退出另一个列表移动的场景使用

            var removeListenersWithoutFocus = focusThenRemoveListeners();
            removeListenersWithoutFocus();
            return;
          }
          if (enabledCover) {
            enabledTabSequence && (onMove === null || onMove === void 0 ? void 0 : onMove({
              e: e,
              prev: list.prev,
              cur: null,
              prevI: list.prevI,
              curI: -1
            }));
            focus(cover);
          } else {
            var _delay2;
            delay = (_delay2 = delay) !== null && _delay2 !== void 0 ? _delay2 : delayToBlur;
            var focusTriggerThenRemoveListeners = focusThenRemoveListeners(_trigger);
            var isImmediate = delayToProcess(delay, focusTriggerThenRemoveListeners);
            if (isImmediate) focusTriggerThenRemoveListeners();
          }
        });
        function focusThenRemoveListeners(focusTarget) {
          return function (_) {
            focusTarget && focus(focusTarget);
            enabledTabSequence && (onMove === null || onMove === void 0 ? void 0 : onMove({
              e: e,
              prev: list.prev,
              cur: null,
              prevI: list.prevI,
              curI: -1
            }));
            if (!manual) {
              removeListRelatedListeners();
              if (addEntryListenersEachExit) _addEntryListeners();
            }
          };
        }
      }
    }

    /** 生成事件行为，添加事件监听器 */
    function loadListRelatedListeners(root, listInfo, cover) {
      var list = listInfo.data;
      var head = listInfo.head;
      var tail = listInfo.tail;
      if (!listListeners.isEmpty) return; // 列表的监听事件没有移除之前，不需要再次添加列表监听事件

      if (root == null) throw new Error("\u6CA1\u6709\u627E\u5230\u5143\u7D20 " + rootNode + "\uFF0C\u60A8\u53EF\u4EE5\u5C1D\u8BD5 delayToFocus \u9009\u9879\uFF0C\u7B49\u5F85\u5143\u7D20 " + rootNode + " \u6E32\u67D3\u5B8C\u6BD5\u540E\u8FDB\u884C\u805A\u7126\u3002");
      if (head == null || tail == null) throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");

      // 添加除 trigger 以外其它和焦点相关的事件监听器
      addListRelatedListeners();

      /** 添加焦点需要的事件监听器 */
      function addListRelatedListeners() {
        var useActiveIndex = function useActiveIndex() {
          return [listInfo.curI, listInfo.recordSequenceByIdx.bind(listInfo)];
        };
        var isTrappedList = function isTrappedList() {
          return hasNoEntry ? true : trappedList;
        };

        // 在焦点循环中触发聚焦
        var keyListMoveHandler = enabledTabSequence ? focusNextListItemBySequence(list, useActiveIndex, isClamp, isNext, isPrev, onNext, onPrev, cover, onMove, isTrappedList) : focusNextListItemByRange(list, isClamp, onNext, onPrev, root, cover, isTrappedList);

        /** 出口们，列表的出口们，list 的出口们 */
        var exits = getExits(_exit, onEscape, enabledCover, cover, _trigger);
        var _splitExits = splitExits(exits, root),
          keyExits = _splitExits.keyExits,
          clickExits = _splitExits.clickExits,
          focusExits = _splitExits.focusExits,
          hasClickExits = _splitExits.hasClickExits,
          hasFocusExits = _splitExits.hasFocusExits,
          hasKeyExits = _splitExits.hasKeyExits,
          clickExits_wild = _splitExits.clickExits_wild,
          focusExits_wild = _splitExits.focusExits_wild,
          outListExits = _splitExits.outListExits;

        /** 非跟节点内的，是根节点之外的出口 */
        var clickListExitHandlers_wild = clickExits_wild.map(function (exit) {
          return [element(exit === null || exit === void 0 ? void 0 : exit.node), clickListExitHandler_wild(exit)];
        });
        var focusListExitHandlers_wild = focusExits_wild.map(function (exit) {
          return [element(exit === null || exit === void 0 ? void 0 : exit.node), focusListExitHandler_wild(exit)];
        });
        listListeners.push(root, "focusin", focusTrapListHandler);
        listListeners.push(root, "focusout", blurTrapListHandler);
        if (!root.contains(cover) && cover != null) {
          listListeners.push(cover, "focus", focusTrapCoverHandler);
          listListeners.push(cover, "blur", blurTrapCoverHandler);
        }
        listListeners.push(root, "keydown", function (e) {
          // 列表中移动，监听移动的键盘事件，例如 tab 或其它自定义组合键
          keyListMoveHandler(e);
          // 列表键盘出口
          if (hasKeyExits) keyListExitHandler(e);
        });
        if (enabledTabSequence || hasClickExits) {
          listListeners.push(root, "click", function (e) {
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
        focusListExitHandlers_wild.forEach(function (_ref7) {
          var node = _ref7[0],
            handler = _ref7[1];
          listListeners.push(node, "focus", handler);
        });
        clickListExitHandlers_wild.forEach(function (_ref8) {
          var node = _ref8[0],
            handler = _ref8[1];
          listListeners.push(node, "click", handler);
        });
        if (cover != null) {
          // 封面的事件
          listListeners.push(cover, "keydown", keyCoverHandler);
        }

        // flush
        listListeners.addListeners();
        var isMouseDown = false;
        /** 标记是否从封面进入列表，用于防止纠正列表焦点的误判，用于野生封面 */
        var isEnterFromCover = false;

        /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
         |          LIST HANDLERS          |
         +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

        function focusTrapListHandler(e) {
          // 进入封面（封面在列表中）
          if (enabledCover && e.target === cover) {
            // TODO: 保留确认，或是否需要添加 `&& trappedList` 条件
            trappedCover = true;
            return;
          }

          // 纠正进入封面，从外部进入列表，如果没有通过封面，则重新聚焦封面
          if (enabledCover && isMouseDown === false && trappedCover === false) {
            tickFocus(cover);
            return;
          }

          // 纠正外部聚焦进来的焦点
          if (correctionTarget !== false && enabledTabSequence && trappedList === false && isMouseDown === false)
            // 如果是内部的聚焦，无需纠正，防止嵌套情况的循环问题
            {
              var _correctionTarget;
              var defaultLast = listInfo.prev || listInfo.head;
              var originGotCorrectionTarget = (_correctionTarget = correctionTarget === null || correctionTarget === void 0 ? void 0 : correctionTarget({
                list: list,
                cover: cover,
                root: root,
                last: listInfo.prev,
                lastI: listInfo.prevI
              })) !== null && _correctionTarget !== void 0 ? _correctionTarget : defaultLast;
              var gotCorrectionTarget = element(originGotCorrectionTarget);
              var targetIndex = list.findIndex(function (item) {
                return item === gotCorrectionTarget;
              });
              if (targetIndex > -1) {
                listInfo.recordSequenceByIdx(targetIndex);
                onMove === null || onMove === void 0 ? void 0 : onMove({
                  e: e,
                  prev: null,
                  cur: listInfo.cur,
                  prevI: -1,
                  curI: listInfo.curI
                });
              }
              trappedList = true; // 在下一次 触发 focusin 调用 focusTrapListHandler 之前，设为 true。通过 api 调用的 focus，触发的 focusin 事件会被“同步”调用
              tickFocus(gotCorrectionTarget);
            }
          trappedList = true; // 无论列表的类型是序列还是范围，被聚焦后都被定义为“已陷入列表”（这里主要用于范围列表模式）
        }

        function blurTrapListHandler(e) {
          // 用于保护可切换的入口能够被触发
          if (toggles.has(e.relatedTarget)) return;
          tick(function () {
            // 延迟后获取下一次聚焦的元素，否则当前聚焦元素是 body

            var active = getActiveElement();
            var isOutRootNode = !root.contains(active);
            var isActiveCover = active === cover;

            // 从封面退出
            if (e.target === cover && isOutRootNode) {
              trappedCover = false; // 退出封面
              return;
            }
            var isOutList = null;
            if (isActiveCover || isOutRootNode) {
              isOutList = outListExitHandler(e);
              listInfo.recordSequenceByIdx(-1);
            }
            if (isOutList === false) return; // 不符合 outlist 退出列表的条件

            if (isActiveCover) {
              // 聚焦在封面
              trappedList = false;
            } else if (isOutRootNode) {
              // 聚焦在非封面、非列表的区域
              trappedList = false;
              trappedCover = false;
            }
          });
        }
        function mousedownListItemHandler(e) {
          isMouseDown = true;
          tick(function () {
            return isMouseDown = false;
          }); // mousedown 没有出口，只能使用定时器，isMouseDown 主要在两个 focus 事件中使用，当触发 focus 时，此定时器还未执行，以此保证正确性

          var targetItem;
          if (!enabledTabSequence ||
          // 未打开 sequence 属性 或者
          enabledTabSequence && (
          // 已打开 sequence 属性 并且
          targetItem = list.find(function (item) {
            return item.contains(e.target);
          })) // 点击的目标是列表中的元素
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
          var targetIndex = list.findIndex(function (item) {
            return item.contains(e.target);
          });
          if (targetIndex > -1) {
            var prevBeforeRecord = listInfo.prev,
              prevIBeforeRecord = listInfo.prevI,
              curIBeforeRecord = listInfo.curI;
            listInfo.recordSequenceByIdx(targetIndex);
            var _prev2 = listInfo.prev,
              prevI = listInfo.prevI,
              cur = listInfo.cur,
              curI = listInfo.curI;
            if (curIBeforeRecord < 0) {
              // 从外部进入
              if (prevIBeforeRecord !== targetIndex) {
                // 上一次进入 和 本次进入 的元素不同
                _prev2 = prevBeforeRecord;
                prevI = prevIBeforeRecord;
              }
            }
            onClick === null || onClick === void 0 ? void 0 : onClick({
              e: e,
              prev: _prev2,
              cur: cur,
              prevI: prevI,
              curI: curI
            });
            if (curIBeforeRecord !== curI)
              // 从外部进入 或者 列表内的移动
              onMove === null || onMove === void 0 ? void 0 : onMove({
                e: e,
                prev: _prev2,
                cur: cur,
                prevI: prevI,
                curI: curI
              });
          }
        }

        /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
        |         COVER HANDLERS          |
        +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

        function focusTrapCoverHandler() {
          trappedCover = true;
        } // 捕获点击封面的情况

        function blurTrapCoverHandler() {
          // 捕获点击空白区域的情况
          if (isEnterFromCover)
            // 用于防止纠正列表焦点的误判，如果是进入列表，则 trappedCover 还应是 true
            isEnterFromCover = false;else trappedCover = false;
        }

        /** 封面的键盘事件响应 */
        function keyCoverHandler(e) {
          if (e.target !== cover) return;
          if (!(trappedCover && !trappedList)) return; // 继续执行，必须满足焦点在封面上，且不在列表中

          // 入口（封面），从封面进入列表
          if ((coverEnterKey !== null && coverEnterKey !== void 0 ? coverEnterKey : isEnterEvent)(e) && !trappedList) {
            e.preventDefault();
            isEnterFromCover = true;
            trappedList = true;
            onEnterCover === null || onEnterCover === void 0 ? void 0 : onEnterCover(e);
            if (enabledTabSequence) {
              listInfo.recordSequenceByIdx(Math.max(0, listInfo.prevI));
              focus(listInfo.cur);
              onMove === null || onMove === void 0 ? void 0 : onMove({
                e: e,
                prev: null,
                cur: listInfo.cur,
                prevI: -1,
                curI: listInfo.curI
              });
            } else focus(listInfo.data[0]);
            return;
          }

          // 出口（封面），从封面回到入口
          for (var i = 0; i < exitsCover.length; ++i) {
            var _exitsCover$i = exitsCover[i],
              key = _exitsCover$i.key,
              on = _exitsCover$i.on,
              origin = _exitsCover$i.target;
            var target = element(origin);
            if (key !== null && key !== void 0 && key(e, listInfo.prevI, listInfo.curI)) {
              exitCoverHandler(e, on, target);
              return;
            }
          }

          // 默认出口，默认行为，默认的行为的场景是包含子元素的长列表
          if (isDefaultExitCover && isTabForward(e)) {
            // 虽然也是离开列表，但是这里不移除监听事件，因为移除后就不能再次进入封面
            focus(tail);
            return;
          }

          /** 退出封面焦点的行为 */
          function exitCoverHandler(e, onExit, target) {
            onExit === null || onExit === void 0 ? void 0 : onExit(e);
            target && focus(target);
            removeListRelatedListeners();
          }
        }

        /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
        |            + START +            |
        |          EXIT HANDLERS          |
        +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

        function outListExitHandler(e) {
          for (var i = 0; i < outListExits.length; ++i) {
            var _outListExits$i = outListExits[i],
              on = _outListExits$i.on,
              origin_target = _outListExits$i.target,
              delay = _outListExits$i.delay;
            var target = element(origin_target);
            return exitHandler(e, on, target, delay, cover, list, root, outListExits[i]["if"]);
          }
        }
        function exitHandlerWithCondition(e, exit, condition) {
          var origin_node = exit.node,
            on = exit.on,
            origin_target = exit.target,
            delay = exit.delay;
          var node = element(origin_node);
          var target = element(origin_target);
          if (condition(e, node, exit.key))
            // 未设置点击目标
            return false;
          exitHandler(e, on, target, delay, cover, list, root, exit["if"]);
          return true;
        }
        function clickExitHandler(e, exit) {
          var cantClick = function cantClick(e, node) {
            return node != null && !node.contains(e.target) || node == null;
          }; // 点击目标不匹配 或者 未设置点击目标
          return exitHandlerWithCondition(e, exit, cantClick);
        }

        /** 点击列表的出口 */
        function clickListExitHandler(e) {
          for (var i = 0; i < clickExits.length; ++i) {
            var isOK = clickExitHandler(e, clickExits[i]);
            if (isOK) break; // 只生效第一个满足条件的出口
          }
        }

        function focusExitHandler(e, exit) {
          var cantFocus = function cantFocus(e, node) {
            return node != null && e.target !== node || node == null;
          }; // 聚焦目标不匹配 或者 未设置点击目标
          return exitHandlerWithCondition(e, exit, cantFocus);
        }

        /** 聚焦列表一个单项而退出 */
        function focusListExitHandler(e) {
          for (var i = 0; i < focusExits.length; ++i) {
            var isOK = focusExitHandler(e, focusExits[i]);
            if (isOK) break;
          }
        }
        function keyExitHandler(e, exit) {
          var cantKey = function cantKey(e, node, key) {
            return node != null && e.target !== node || !(key !== null && key !== void 0 && key(e, listInfo.prevI, listInfo.curI));
          }; // 聚焦目标不匹配 或者 未设置点击目标
          return exitHandlerWithCondition(e, exit, cantKey);
        }

        /** 触发键盘退出列表，退出列表焦点 */
        function keyListExitHandler(e) {
          if (e.target === cover) return; // 被封面触发直接返回

          if (disabledEsc && isEscapeEvent(e)) return;
          for (var i = 0; i < keyExits.length; ++i) {
            var isOK = keyExitHandler(e, keyExits[i]);
            if (isOK) break;
          }
        }
        function clickListExitHandler_wild(exit) {
          return function (e) {
            clickExitHandler(e, exit);
          };
        }
        function focusListExitHandler_wild(exit) {
          return function (e) {
            focusExitHandler(e, exit);
          };
        }

        /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
        |             - END -             |
        |          EXIT HANDLERS          |
        +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/
      }
    }

    /** 添加入口事件 */
    function _addEntryListeners() {
      if (!entryListeners.isEmpty) return;
      var _loop3 = function _loop3() {
        var entry = entries[i];
        var origin = entry.node,
          on = entry.on,
          key = entry.key,
          type = entry.type,
          target = entry.target,
          delay = entry.delay,
          onExit = entry.onExit;
        var ef = entry["if"];
        var types = [].concat(type);
        var allTypes = ["keydown", "focus", "click"];
        var node = element(origin);
        types.forEach(function (type) {
          if (node && allTypes.includes(type)) {
            /** 是否是键盘事件 */
            var isKey = type === "keydown";
            /** 如果是键盘事件，则判断键位是否匹配，如果是非键盘事件，则直接返回 true */
            var ifKey = isKey ? function (e) {
              return key === null || key === void 0 ? void 0 : key(e, list.prevI, list.curI);
            } : function (_) {
              return true;
            };
            entryListeners.push(node, type, toggleHandler(ifKey, isKey)); // 保存事件信息
          }
        });

        function toggleHandler(ifKey, isKey) {
          return function (e) {
            if ((isFun(ef) ? ef({
              e: e,
              prev: list.prev,
              cur: list.cur,
              prevI: list.prevI,
              curI: list.curI
            }) : true) && ifKey(e)) toggleEntryAndExit(e, isKey);
          };
        }
        function toggleEntryAndExit(e, isKey) {
          /** 是否执行 */
          var processed = 0;
          if (trappedList) {
            if (isFun(onExit)) {
              // 若存在 onExit，则表示该入口同时是出口，是开关
              var _getKeyNodes6 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
                _list = _getKeyNodes6.list,
                _cover3 = _getKeyNodes6.cover,
                _root2 = _getKeyNodes6.root;
              exitHandler(e, onExit, target, false, _cover3, _list, _root2);
              processed = !processed;
            }
          } else {
            entryHandler(e, on, target, delay);
            if (removeListenersEachEnter && !manual) entryListeners.removeListeners();
            processed = !processed;
          }

          // 如果是键盘事件，并且已执行，则阻止默认行为
          if (isKey && processed) e.preventDefault();
        }
      };
      for (var i = 0; i < entries.length; ++i) {
        _loop3();
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

  return focusNoJutsu;

}));
//# sourceMappingURL=focus-no-jutsu.umd.js.map
