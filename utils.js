/** Object.prototype.toString.call 快捷方式 */
export const objToStr = obj => Object.prototype.toString.call(obj);

/** 参数是否是对象 */
export const isObj = obj => objToStr(obj) === "[object Object]";

/** document.activeElement 的快捷方式 */
export const getActiveElement = () => document.activeElement;

/** document.querySelector 的快捷方式 */
export const querySelector = str => document.querySelector(str);

/** 通过字符串查找节点，或者直接返回节点 */
export const element = e => typeof e === "string" ? querySelector(e) : e;

/** 滴答 */
export const tick = function(fn) {
  setTimeout(fn, 0);
};

/** 是否是 input 可 select 的元素 */
export const isSelectableInput = function(node) {
  return (
    node.tagName &&
    node.tagName.toLowerCase() === 'input' &&
    typeof node.select === 'function'
  );
};

/** 是否按下了 enter */
export const isEnterEvent = function(e) {
  return e.key === "Enter" || e.keyCode === 13;
};

/** 按键是否是 esc */
export const isEscapeEvent = function (e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
};

/** 按键是否是 tab */
export const isTabEvent = function(e) {
  return e.key === 'Tab' || e.keyCode === 9;
};

/** 是否是向前的 tab */
export const isTabForward = function(e) {
  return isTabEvent(e) && !e.shiftKey;
};

/** 是否是向后的 tab */
export const isTabBackward = function(e) {
  return isTabEvent(e) && e.shiftKey;
};

/** 找到两个元素的最小公共祖先元素 */
export const findLowestCommonAncestorNode = function(x, y) {
  if (x == null || y == null) return null;
  if (x.contains(y)) return x;
  if (y.contains(x)) return y;

  const range = new Range();
  range.setStartBefore(x);
  range.setEndAfter(y);
  if (range.collapsed) {
     range.setStartBefore(y);
     range.setEndAfter(x);
  }
  return range.commonAncestorContainer;
};