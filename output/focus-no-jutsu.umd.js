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

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
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
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    return true;
  };

  /** 尝试聚焦，如果聚焦失效，则下个 setTimeout 再次聚焦 */
  var tickFocus = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              if (e == null) tick(function () {
                return resolve(e && focus(e));
              });else resolve(focus(e));
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function tickFocus(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  /** 手动聚焦下一个元素 */
  var focusNextListItemBySequence = function focusNextListItemBySequence(subNodes, useActiveIndex, usePrevActive, isClamp, isNext, isPrev, onNext, onPrev, coverNode, onMove, trappedList) {
    return function (e) {
      if (e.target === coverNode) return;
      if (!trappedList()) return;
      var _useActiveIndex = useActiveIndex(),
        index_ = _useActiveIndex[0],
        setIndex = _useActiveIndex[1];
      var _usePrevActive = usePrevActive(),
        setPrev = _usePrevActive[1];
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
        setPrev(index);
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
        setPrev(index);
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
  var getKeyNodes = function getKeyNodes(root, list, cover, coverIsRoot) {
    var _element;
    var _list = list.map(function (item) {
      return element(item);
    }).filter(function (item) {
      return item != null;
    });
    var head = _list[0];
    var tail = _list.slice(-1)[0];
    var _root = (_element = element(root)) !== null && _element !== void 0 ? _element : findLowestCommonAncestorNode(head, tail);
    var _cover = coverIsRoot ? _root : element(cover);
    return {
      rootNode: _root,
      subNodes: _list,
      head: head,
      tail: tail,
      coverNode: _cover
    };
  };

  /** 用于处理节点属性可以传递数组的情况，用于入口和出口 */
  var nodesReducer = function nodesReducer(acc, cur) {
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
    }).reduce(nodesReducer, []);
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
  var getDelayType = function getDelayType(delay) {
    var isFunctionDelay = isFun(delay);
    var delayRes = isFunctionDelay && delay(function () {});
    var promiseDelay = isFunctionDelay && objToStr(delayRes) === "[object Promise]";
    var callbackDelay = isFunctionDelay && !promiseDelay;
    var commonDelay = delay === true && !promiseDelay && !callbackDelay;
    return {
      promiseDelay: promiseDelay,
      callbackDelay: callbackDelay,
      commonDelay: commonDelay
    };
  };

  /** 延迟执行某些操作 */
  var delayToProcess = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(delay, processor) {
      var _ref3, promiseDelay, callbackDelay, commonDelay;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _ref3 = !!delay ? getDelayType(delay) : {}, promiseDelay = _ref3.promiseDelay, callbackDelay = _ref3.callbackDelay, commonDelay = _ref3.commonDelay;
            if (!promiseDelay) {
              _context2.next = 7;
              break;
            }
            _context2.next = 4;
            return delay(function () {});
          case 4:
            processor();
            _context2.next = 16;
            break;
          case 7:
            if (!callbackDelay) {
              _context2.next = 11;
              break;
            }
            delay(processor);
            _context2.next = 16;
            break;
          case 11:
            if (!commonDelay) {
              _context2.next = 15;
              break;
            }
            processor();
            _context2.next = 16;
            break;
          case 15:
            return _context2.abrupt("return", true);
          case 16:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function delayToProcess(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  }();

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
    return TabList;
  }();
  var focusNoJutsu = function focusNoJutsu() {
    var _ref4, _entries$;
    var offset = 0 - ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Array);
    var rootNode = 0 + offset < 0 || arguments.length <= 0 + offset ? undefined : arguments[0 + offset];
    var subNodes = 1 + offset < 0 || arguments.length <= 1 + offset ? undefined : arguments[1 + offset];
    var options = (_ref4 = 2 + offset < 0 || arguments.length <= 2 + offset ? undefined : arguments[2 + offset]) !== null && _ref4 !== void 0 ? _ref4 : {};
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
      manual = options.manual,
      _options$allowSafariT = options.allowSafariToFocusAfterMousedown,
      allowSafariToFocusAfterMousedown = _options$allowSafariT === void 0 ? true : _options$allowSafariT;
      options.demo;
    var _ref5 = isObj(cover) ? cover : {},
      coverNode = _ref5.node,
      coverEnterKey = _ref5.enterKey,
      onEnterCover = _ref5.onEnter,
      exitCover = _ref5.exit;

    /** 是否已经打开封面选项 */
    var enabledCover = cover != null && cover !== false && coverNode !== false;

    /** 封面即根元素 */
    var coverIsRoot = enabledCover && (cover === true || coverNode === true || coverNode == null);

    /** 列表 */
    var list = new TabList();

    /** 入口们 */
    var entries = [].concat(entry).filter(function (o) {
      return o != null;
    }).map(function (ele) {
      return isObj(ele) ? ele : {
        node: ele
      };
    }).map(function (entry) {
      var _entry$delay;
      return _extends({}, entry, {
        delay: (_entry$delay = entry.delay) !== null && _entry$delay !== void 0 ? _entry$delay : delayToFocus,
        type: entry.type === undefined ? [entry.key == null ? '' : "keydown", entry.node == null ? '' : "click"].filter(function (t) {
          return t != '';
        }) : [].concat(entry.type),
        onExit: entry.onExit === true ? entry.on : entry.onExit
      });
    }).reduce(nodesReducer, []);
    /** 是否是空入口 */
    var hasNoEntry = entries.length === 0;
    /** 带切换的入口 */
    var toggles = new Set(entries.map(function (e) {
      return isFun(e.onExit) ? e.node : null;
    }).filter(function (n) {
      return n != null;
    }).map(function (n) {
      return element(n);
    }));

    /** 默认入口 */
    var _trigger = element(trigger || ((_entries$ = entries[0]) === null || _entries$ === void 0 ? void 0 : _entries$.node));

    /** 退出封面，封面的出口们 */
    var exitsCover = [].concat(exitCover).filter(function (e) {
      return e != null;
    }).map(function (e) {
      return isObj(e) ? e : {
        key: e
      };
    }).map(function (e) {
      var _e$target;
      return _extends({}, e, {
        target: (_e$target = e.target) !== null && _e$target !== void 0 ? _e$target : _trigger
      });
    });

    /** 是否使用默认的离开封面方法，也即 tab 和 shift-tab */
    var isDefaultExitCover = enabledCover && exitsCover.length === 0;

    /** 禁用左上角 esc 出口 */
    var disabledEsc = onEscape === false;
    var _ref6 = isObj(next) ? next : {
        key: next
      },
      isNext = _ref6.key,
      onNext = _ref6.on;
    var _ref7 = isObj(prev) ? prev : {
        key: prev
      },
      isPrev = _ref7.key,
      onPrev = _ref7.on;

    /** 取消循环则设置头和尾焦点 */
    var isClamp = !(loop !== null && loop !== void 0 ? loop : true);

    // 自定义前进或后退焦点函数，则设置 sequence 为 true
    var enabledTabSequence = !!(isNext || isPrev || sequence);

    /** 活动元素在列表中的编号，打开 sequence 生效 */
    var activeIndex = initialActive !== null && initialActive !== void 0 ? initialActive : -1;
    var prevActive = -1;

    /** 是否已添加监听事件 */
    var listListeners = new ListenersCache();
    var trappedList = false;
    var trappedCover = false;

    /** 是否已添加入口的监听事件 */
    var entryListeners = new ListenersCache();

    /** 按键转发 */
    var keyForwards = new KeyForwardCache();
    if (!manual) {
      // 如果不是手动添加事件，则注册入口、列表相关（封面、列表、出口）的事件
      // 入口点击事件
      _addEntryListeners();

      // 如果有入口不需要延迟，则立即加载列表的监听事件
      var hasImmediateEntry = (hasNoEntry ? [{}] : entries).some(function (_ref8) {
        var delay = _ref8.delay;
        return !delay;
      });
      if (hasImmediateEntry) {
        var _getKeyNodes = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
          _rootNode = _getKeyNodes.rootNode,
          _subNodes = _getKeyNodes.subNodes,
          head = _getKeyNodes.head,
          tail = _getKeyNodes.tail,
          _coverNode = _getKeyNodes.coverNode;
        list.update(_subNodes);
        loadListRelatedListeners(_rootNode, list.data, head, tail, _coverNode);
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
            var entry = _step.value;
            var on = entry.on,
              type = entry.type,
              node = entry.node,
              target = entry.target,
              delay = entry.delay;
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
          for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
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
          _list = _getKeyNodes2.subNodes,
          cover = _getKeyNodes2.coverNode,
          root = _getKeyNodes2.rootNode;
        if (tempExit) {
          var on = tempExit.on,
            originTarget = tempExit.target;
          var target = element(originTarget);
          return toExit(target, on);
        } else {
          var exits = getExits(_exit, onEscape, enabledCover, cover, _trigger);
          var _loop2 = function _loop2() {
            var exit = _step2.value;
            var on = exit.on,
              type = exit.type,
              target = exit.target;
            var invokeType = "invoke";
            if (type !== null && type !== void 0 && type.some(function (type) {
              return type == null || type === false || type === invokeType;
            })) {
              return {
                v: toExit(target, on)
              };
            }
          };
          for (var _iterator2 = _createForOfIteratorHelperLoose(exits), _step2; !(_step2 = _iterator2()).done;) {
            var _ret2 = _loop2();
            if (typeof _ret2 === "object") return _ret2.v;
          }
        }
        function toExit(target, on) {
          if (list.isEmpty()) list.update(_list);
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
          _rootNode = _getKeyNodes3.rootNode,
          _subNodes = _getKeyNodes3.subNodes,
          _coverNode = _getKeyNodes3.coverNode;
        if (list.isEmpty()) list.update(_subNodes);
        loadListRelatedListeners(_rootNode, list.data, list.head, list.tail, _coverNode);
      },
      /** 添加转发 */addForward: function addForward(id, forward) {
        var opts = null;
        if (isFun(forward)) {
          var _getKeyNodes4 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
            root = _getKeyNodes4.rootNode,
            _list2 = _getKeyNodes4.subNodes,
            _head2 = _getKeyNodes4.head,
            _tail2 = _getKeyNodes4.tail,
            _cover2 = _getKeyNodes4.coverNode;
          opts = forward({
            root: root,
            list: _list2,
            head: _head2,
            tail: _tail2,
            cover: _cover2,
            curI: activeIndex,
            prevI: prevActive
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
          if (key !== null && key !== void 0 && key(e, activeIndex)) {
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
          prevActive = activeIndex;
          activeIndex = newI;
          onMove === null || onMove === void 0 ? void 0 : onMove({
            e: {
              fromI: true
            },
            prev: list.data[prevActive],
            cur: list.data[activeIndex],
            prevI: prevActive,
            curI: activeIndex
          });
          focus(subNodes[activeIndex]);
          return newI;
        } else return activeIndex;
      }
    };
    return Return;

    /** 入口 handler */
    function entryHandler(_x4, _x5, _x6, _x7) {
      return _entryHandler.apply(this, arguments);
    }
    /** 出口 handler */
    function _entryHandler() {
      _entryHandler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(e, onEnter, target, delay) {
        var isImmediate, findNodesToLoadListenersAndFocus, focusTarget;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              focusTarget = function _focusTarget(cover, list, rootNode) {
                var gotTarget = getTarget(target, cover, list, rootNode, enabledCover, activeIndex, list[activeIndex === -1 ? 0 : activeIndex], e);
                var targetIdx = list.indexOf(gotTarget);
                if (targetIdx > -1) {
                  prevActive = activeIndex;
                  activeIndex = targetIdx; // 只有在聚焦列表元素时才设置，否则会破坏原有 activeIndex
                  onMove === null || onMove === void 0 ? void 0 : onMove({
                    e: e,
                    prev: list[prevActive],
                    cur: gotTarget,
                    prevI: prevActive,
                    curI: activeIndex
                  });
                  trappedList = true;
                }
                if (enabledCover && (gotTarget === cover || targetIdx > -1)) trappedCover = true;
                tickFocus(gotTarget);
              };
              findNodesToLoadListenersAndFocus = function _findNodesToLoadListe() {
                var _getKeyNodes6 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
                  _rootNode = _getKeyNodes6.rootNode,
                  _subNodes = _getKeyNodes6.subNodes,
                  head = _getKeyNodes6.head,
                  tail = _getKeyNodes6.tail,
                  _coverNode = _getKeyNodes6.coverNode;
                list.update(_subNodes);
                if (!manual) loadListRelatedListeners(_rootNode, list.data, head, tail, _coverNode);
                if (target !== false) focusTarget(_coverNode, _subNodes, _rootNode);
              };
              if (!(trappedCover || trappedList)) {
                _context5.next = 4;
                break;
              }
              return _context5.abrupt("return");
            case 4:
              _context5.next = 6;
              return onEnter === null || onEnter === void 0 ? void 0 : onEnter(e);
            case 6:
              isImmediate = !delay;
              if (isImmediate) findNodesToLoadListenersAndFocus();else delayToProcess(delay, findNodesToLoadListenersAndFocus);

              /** 寻找节点，加载事件监听器，聚焦 subNodes 或 coverNode */
            case 8:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return _entryHandler.apply(this, arguments);
    }
    function exitHandler(e, on, target, delay, cover, list, root, ef) {
      var _e$preventDefault;
      if (!trappedList || !(isFun(ef) ? ef({
        e: e,
        prev: list[prevActive],
        cur: list[activeIndex],
        prevI: prevActive,
        curI: activeIndex
      }) : true)) return false;
      trappedList = false;
      (_e$preventDefault = e.preventDefault) === null || _e$preventDefault === void 0 ? void 0 : _e$preventDefault.call(e); // 阻止默认行为，例如 tab 到下一个元素，例如 entry button 触发 click 事件

      var gotTarget = getTarget(target, cover, list, root, enabledCover, activeIndex, _trigger, e);
      if (gotTarget) return exitListWithTarget();else return exitListWithoutTarget();

      /** 退出列表，有 target */
      function exitListWithTarget() {
        return _exitListWithTarget.apply(this, arguments);
      }
      /** 退出列表，无 target */
      function _exitListWithTarget() {
        _exitListWithTarget = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var _delay;
          var isImmediate, focusThenRemoveListeners;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                focusThenRemoveListeners = function _focusThenRemoveListe() {
                  focus(gotTarget);
                  onMove === null || onMove === void 0 ? void 0 : onMove({
                    e: e,
                    prev: list[activeIndex],
                    cur: gotTarget,
                    prevI: activeIndex,
                    curI: -1
                  });
                  if (!manual) {
                    if (gotTarget !== cover) removeListRelatedListeners();
                    _addEntryListeners();
                  }
                };
                _context3.next = 3;
                return on === null || on === void 0 ? void 0 : on(e);
              case 3:
                delay = (_delay = delay) !== null && _delay !== void 0 ? _delay : delayToBlur;
                _context3.next = 6;
                return delayToProcess(delay, focusThenRemoveListeners);
              case 6:
                isImmediate = _context3.sent;
                if (isImmediate) focusThenRemoveListeners();
              case 8:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return _exitListWithTarget.apply(this, arguments);
      }
      function exitListWithoutTarget() {
        return _exitListWithoutTarget.apply(this, arguments);
      }
      function _exitListWithoutTarget() {
        _exitListWithoutTarget = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          var _delay2, focusThenRemoveListeners, isImmediate;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                if (!(gotTarget === false)) {
                  _context4.next = 6;
                  break;
                }
                _context4.next = 3;
                return on === null || on === void 0 ? void 0 : on(e);
              case 3:
                onMove === null || onMove === void 0 ? void 0 : onMove({
                  e: e,
                  prev: list[activeIndex],
                  cur: null,
                  prevI: activeIndex,
                  curI: -1
                });
                if (!manual) {
                  removeListRelatedListeners();
                  _addEntryListeners();
                }
                return _context4.abrupt("return");
              case 6:
                if (!enabledCover) {
                  _context4.next = 13;
                  break;
                }
                _context4.next = 9;
                return on === null || on === void 0 ? void 0 : on(e);
              case 9:
                onMove === null || onMove === void 0 ? void 0 : onMove({
                  e: e,
                  prev: list[activeIndex],
                  cur: null,
                  prevI: activeIndex,
                  curI: -1
                });
                focus(cover);
                _context4.next = 21;
                break;
              case 13:
                focusThenRemoveListeners = function focusThenRemoveListeners() {
                  _trigger && focus(_trigger);
                  onMove === null || onMove === void 0 ? void 0 : onMove({
                    e: e,
                    prev: list[activeIndex],
                    cur: null,
                    prevI: activeIndex,
                    curI: -1
                  });
                  if (!manual) {
                    removeListRelatedListeners();
                    _addEntryListeners();
                  }
                };
                _context4.next = 16;
                return on === null || on === void 0 ? void 0 : on(e);
              case 16:
                delay = (_delay2 = delay) !== null && _delay2 !== void 0 ? _delay2 : delayToBlur;
                _context4.next = 19;
                return delayToProcess(delay, focusThenRemoveListeners);
              case 19:
                isImmediate = _context4.sent;
                if (isImmediate) focusThenRemoveListeners();
              case 21:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }));
        return _exitListWithoutTarget.apply(this, arguments);
      }
    }

    /** 生成事件行为，添加事件监听器 */
    function loadListRelatedListeners(_rootNode, _subNodes, _head, _tail, _coverNode) {
      if (!listListeners.isEmpty) return;
      if (_rootNode == null) throw new Error("\u6CA1\u6709\u627E\u5230\u5143\u7D20 " + rootNode + "\uFF0C\u60A8\u53EF\u4EE5\u5C1D\u8BD5 delayToFocus \u9009\u9879\uFF0C\u7B49\u5F85\u5143\u7D20 " + rootNode + " \u6E32\u67D3\u5B8C\u6BD5\u540E\u8FDB\u884C\u805A\u7126\u3002");
      if (_head == null || _tail == null) throw new Error("至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");
      var useActiveIndex = function useActiveIndex() {
        return [activeIndex, function (newVal) {
          return activeIndex = newVal;
        }];
      };
      var usePrevActive = function usePrevActive() {
        return [, function (prev) {
          return prevActive = prev;
        }];
      };
      var isTrappedList = function isTrappedList() {
        return hasNoEntry ? true : trappedList;
      };

      // 在焦点循环中触发聚焦
      var keyListMoveHandler = enabledTabSequence ? focusNextListItemBySequence(_subNodes, useActiveIndex, usePrevActive, isClamp, isNext, isPrev, onNext, onPrev, _coverNode, onMove, isTrappedList) : focusNextListItemByRange(_subNodes, isClamp, onNext, onPrev, _rootNode, _coverNode, isTrappedList);

      /** 出口们，列表的出口们，subNodes 的出口们 */
      var exits = getExits(_exit, onEscape, enabledCover, _coverNode, _trigger);
      var _splitExits = splitExits(exits, _rootNode),
        keyExits = _splitExits.keyExits,
        clickExits = _splitExits.clickExits,
        focusExits = _splitExits.focusExits,
        hasClickExits = _splitExits.hasClickExits,
        hasFocusExits = _splitExits.hasFocusExits,
        hasKeyExits = _splitExits.hasKeyExits,
        clickExits_wild = _splitExits.clickExits_wild,
        focusExits_wild = _splitExits.focusExits_wild,
        outListExits = _splitExits.outListExits;

      /** 非跟节点内的，是跟节点之外的出口 */
      var clickListExitHandlers_wild = clickExits_wild.map(function (exit) {
        return [element(exit === null || exit === void 0 ? void 0 : exit.node), clickListExitHandler_wild(exit)];
      });
      var focusListExitHandlers_wild = focusExits_wild.map(function (exit) {
        return [element(exit === null || exit === void 0 ? void 0 : exit.node), focusListExitHandler_wild(exit)];
      });

      // 添加除 trigger 以外其它和焦点相关的事件监听器
      addListRelatedListeners();
      var isMouseDown = false;
      /** 标记是否从封面进入列表，用于防止纠正列表焦点的误判，用于野生封面 */
      var isEnterFromCover = false;

      /*~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~+
       |          LIST HANDLERS          |
       +~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~*/

      function focusTrapListHandler(e) {
        var focusTarget = e.target;

        // 进入封面（封面在列表中）
        if (enabledCover && focusTarget === _coverNode) {
          trappedCover = true;
          return;
        }

        // 纠正进入封面，从外部进入列表，如果没有通过封面，则重新聚焦封面
        if (enabledCover && isMouseDown === false && trappedCover === false) {
          tickFocus(_coverNode);
          return;
        }

        // 纠正外部聚焦进来的焦点
        if (correctionTarget !== false && enabledTabSequence && trappedList === false && isMouseDown === false)
          // 如果是内部的聚焦，无需纠正，防止嵌套情况的循环问题
          {
            var _correctionTarget;
            var originGotCorrectionTarget = (_correctionTarget = correctionTarget === null || correctionTarget === void 0 ? void 0 : correctionTarget({
              list: _subNodes,
              cover: _coverNode,
              root: _rootNode,
              last: _subNodes[activeIndex],
              lastI: activeIndex
            })) !== null && _correctionTarget !== void 0 ? _correctionTarget : activeIndex === -1 ? _subNodes[0] : _subNodes[activeIndex];
            var gotCorrectionTarget = element(originGotCorrectionTarget);
            var targetIndex = _subNodes.findIndex(function (item) {
              return item === gotCorrectionTarget;
            });
            if (targetIndex > -1) {
              prevActive = activeIndex;
              activeIndex = targetIndex;
              onMove === null || onMove === void 0 ? void 0 : onMove({
                e: e,
                prev: _subNodes[prevActive],
                cur: _subNodes[activeIndex],
                prevI: prevActive,
                curI: activeIndex
              });
            }
            tickFocus(gotCorrectionTarget);
          }
        trappedList = true;
      }
      function blurTrapListHandler(e) {
        // 用于保护可切换的入口能够被触发
        if (toggles.has(e.relatedTarget)) return;
        setTimeout(function () {
          // 延迟后获取下一次聚焦的元素，否则当前聚焦元素是 body

          var active = getActiveElement();
          var isOutRootNode = !_rootNode.contains(active);
          var isActiveCover = active === _coverNode;

          // 从封面退出
          if (e.target === _coverNode && isOutRootNode) {
            trappedCover = false; // 退出封面
            return;
          }
          var isOutList = null;
          if (isActiveCover || isOutRootNode) isOutList = outListExitHandler(e);
          if (isOutList === false) return; // 不符合退出列表的条件

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
        setTimeout(function () {
          isMouseDown = false; // mousedown 没有出口，只能使用定时器，isMouseDown 主要在两个 focus 事件中使用，当触发 focus 时，此定时器还未执行，以此保证正确性
        });

        var targetItem;
        if (!enabledTabSequence || enabledTabSequence && (targetItem = _subNodes.find(function (item) {
          return item.contains(e.target);
        }))) {
          trappedList = true;
          if (enabledCover) trappedCover = true;
          if (allowSafariToFocusAfterMousedown && targetItem && window.safari !== undefined) {
            // 兼容 Safari（桌面端），具体问题查看：https://github.com/wswmsword/web-experiences/tree/main/browser/safari-button-focus
            focus(targetItem); // Safari 不会聚焦按钮元素，这里强制使用 api 聚焦
            e.preventDefault(); // 阻止默认行为可以避免 targetItem 失焦
          }
        }
      }

      /** 点击聚焦列表某一单项 */
      function clickListItemHandler(e) {
        var target = e.target;
        var targetIndex = _subNodes.findIndex(function (e) {
          return e.contains(target);
        });
        if (targetIndex > -1) {
          prevActive = activeIndex;
          activeIndex = targetIndex;
          onClick === null || onClick === void 0 ? void 0 : onClick({
            e: e,
            prev: _subNodes[prevActive],
            cur: _subNodes[activeIndex],
            prevI: prevActive,
            curI: activeIndex
          });
          if (prevActive !== activeIndex || trappedList === false) onMove === null || onMove === void 0 ? void 0 : onMove({
            e: e,
            prev: _subNodes[prevActive],
            cur: _subNodes[activeIndex],
            prevI: prevActive,
            curI: activeIndex
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
        if (isEnterFromCover) {
          // 用于防止纠正列表焦点的误判，如果是进入列表，则 trappedCover 还应是 true
          isEnterFromCover = false;
          return;
        }
        trappedCover = false;
      }

      /** 封面的键盘事件响应 */
      function keyCoverHandler(e) {
        if (e.target !== _coverNode) return;
        if (!(trappedCover && !trappedList)) return; // 继续执行，必须满足焦点在封面上，且不在列表中

        // 入口
        if ((coverEnterKey !== null && coverEnterKey !== void 0 ? coverEnterKey : isEnterEvent)(e) && !trappedList) {
          e.preventDefault();
          isEnterFromCover = true;
          trappedList = true;
          onEnterCover === null || onEnterCover === void 0 ? void 0 : onEnterCover(e);
          activeIndex = activeIndex === -1 ? 0 : activeIndex;
          focus(_subNodes[activeIndex]);
          onMove === null || onMove === void 0 ? void 0 : onMove({
            e: e,
            prev: null,
            cur: _subNodes[activeIndex],
            prevI: null,
            curI: activeIndex
          });
          return;
        }

        // 出口
        for (var _iterator3 = _createForOfIteratorHelperLoose(exitsCover), _step3; !(_step3 = _iterator3()).done;) {
          var exit = _step3.value;
          var key = exit.key,
            on = exit.on,
            origin = exit.target;
          var target = element(origin);
          if (key !== null && key !== void 0 && key(e, activeIndex)) {
            exitCoverHandler(e, on, target);
            return;
          }
        }

        // 默认出口
        if (isDefaultExitCover && isTabForward(e)) {
          // 虽然也是离开列表，但是这里不移除监听事件，因为移除后就不能再次进入封面
          focus(_tail);
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
        for (var _iterator4 = _createForOfIteratorHelperLoose(outListExits), _step4; !(_step4 = _iterator4()).done;) {
          var exit = _step4.value;
          var on = exit.on,
            origin_target = exit.target,
            delay = exit.delay;
          var target = element(origin_target);
          return exitHandler(e, on, target, delay, _coverNode, _subNodes, _rootNode, exit["if"]);
        }
      }
      function clickExitHandler(e, exit) {
        var origin_node = exit.node,
          on = exit.on,
          origin_target = exit.target,
          delay = exit.delay;
        var node = element(origin_node);
        var target = element(origin_target);
        if (node != null && !node.contains(e.target) || node == null) return false;
        exitHandler(e, on, target, delay, _coverNode, _subNodes, _rootNode, exit["if"]);
        return true;
      }

      /** 点击列表的出口 */
      function clickListExitHandler(e) {
        for (var _iterator5 = _createForOfIteratorHelperLoose(clickExits), _step5; !(_step5 = _iterator5()).done;) {
          var exit = _step5.value;
          var isOK = clickExitHandler(e, exit);
          if (isOK) break;
        }
      }
      function focusExitHandler(e, exit) {
        var origin_node = exit.node,
          on = exit.on,
          origin_target = exit.target,
          delay = exit.delay;
        var node = element(origin_node);
        var target = element(origin_target);
        if (node != null && e.target !== node || node == null) return false;
        exitHandler(e, on, target, delay, _coverNode, _subNodes, _rootNode, exit["if"]);
        return true;
      }

      /** 聚焦列表一个单项而退出 */
      function focusListExitHandler(e) {
        for (var _iterator6 = _createForOfIteratorHelperLoose(focusExits), _step6; !(_step6 = _iterator6()).done;) {
          var exit = _step6.value;
          var isOK = focusExitHandler(e, exit);
          if (isOK) break;
        }
      }
      function keyExitHandler(e, exit) {
        var key = exit.key,
          origin_node = exit.node,
          target = exit.target,
          on = exit.on,
          delay = exit.delay;
        var node = element(origin_node);
        if (node != null && e.target !== node) return false;
        if (key !== null && key !== void 0 && key(e, activeIndex)) {
          exitHandler(e, on, target, delay, _coverNode, _subNodes, _rootNode, exit["if"]);
          return true;
        }
      }

      /** 触发键盘退出列表，退出列表焦点 */
      function keyListExitHandler(e) {
        if (e.target === _coverNode) return; // 被封面触发直接返回

        if (disabledEsc && isEscapeEvent(e)) return;
        for (var _iterator7 = _createForOfIteratorHelperLoose(keyExits), _step7; !(_step7 = _iterator7()).done;) {
          var exit = _step7.value;
          var isOK = keyExitHandler(e, exit);
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

      /** 添加焦点需要的事件监听器 */
      function addListRelatedListeners() {
        listListeners.push(_rootNode, "focusin", focusTrapListHandler);
        listListeners.push(_rootNode, "focusout", blurTrapListHandler);
        if (!_rootNode.contains(_coverNode) && _coverNode != null) {
          listListeners.push(_coverNode, "focus", focusTrapCoverHandler);
          listListeners.push(_coverNode, "blur", blurTrapCoverHandler);
        }
        listListeners.push(_rootNode, "keydown", function (e) {
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
        focusListExitHandlers_wild.forEach(function (_ref9) {
          var node = _ref9[0],
            handler = _ref9[1];
          listListeners.push(node, "focus", handler);
        });
        clickListExitHandlers_wild.forEach(function (_ref10) {
          var node = _ref10[0],
            handler = _ref10[1];
          listListeners.push(node, "click", handler);
        });
        if (_coverNode != null) {
          // 封面的事件
          listListeners.push(_coverNode, "keydown", keyCoverHandler);
        }

        // flush
        listListeners.addListeners();
      }
    }

    /** 添加入口事件 */
    function _addEntryListeners() {
      if (!entryListeners.isEmpty) return;
      var _loop3 = function _loop3() {
        var entry = _step8.value;
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
            var handler = type === "keydown" ? entryKeyHandler : entryNotKeyHandler;
            entryListeners.push(node, type, handler); // 保存事件信息
          }
        });

        function entryKeyHandler(e) {
          if (key !== null && key !== void 0 && key(e, activeIndex) && (isFun(ef) ? ef({
            e: e,
            prev: list.data[prevActive],
            cur: list.data[activeIndex],
            prevI: prevActive,
            curI: activeIndex
          }) : true)) toggleEntryAndExit(e, true);
        }
        function entryNotKeyHandler(e) {
          if (!(isFun(ef) ? ef({
            e: e,
            prev: list.data[prevActive],
            cur: list.data[activeIndex],
            prevI: prevActive,
            curI: activeIndex
          }) : true)) return;
          toggleEntryAndExit(e);
        }
        function toggleEntryAndExit(e, isKey) {
          if (trappedList) {
            if (isFun(onExit)) {
              var _getKeyNodes5 = getKeyNodes(rootNode, subNodes, coverNode, coverIsRoot),
                _list3 = _getKeyNodes5.subNodes,
                _cover3 = _getKeyNodes5.coverNode,
                root = _getKeyNodes5.rootNode;
              isKey && e.preventDefault();
              exitHandler(e, onExit, target, false, _cover3, _list3, root);
            }
          } else {
            isKey && e.preventDefault();
            entryHandler(e, on, target, delay);
            if (removeListenersEachEnter && !manual) entryListeners.removeListeners();
          }
        }
      };
      for (var _iterator8 = _createForOfIteratorHelperLoose(entries), _step8; !(_step8 = _iterator8()).done;) {
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
