type handleKeydown = (e: KeyboardEvent) => any;

type handleEnter = (e: KeyboardEvent | MouseEvent | FocusEvent | { fromInvoke: boolean }) => any;

type handleExit = handleEnter;

type handleClick = (obj: { e: MouseEvent, prev: HTMLElement, cur: HTMLElement, prevI: number, curI: number }) => any;

type handleNextOrPrev = (obj: { e: KeyboardEvent, prev: HTMLElement, cur: HTMLElement, prevI: number, curI: number }) => any;

type handleMoveListItem = (obj: { e: Event | { fromInvoke: boolean }, prev: HTMLElement, cur: HTMLElement, prevI: number, curI: number }) => any;

type element = string | Element | HTMLElement;

type isKey = (e: KeyboardEvent) => boolean;

type entryTargetOpts = {
  list: element[],
  cover: element,
  root: element,
  last: element,
  lastI: number,
}

type getTarget = (opts: entryTargetOpts) => element;

type listForward = {
  /** 自定义前进 subNodes 的组合键 */
  key?: isKey;

  /** 前进时的行为 */
  on?: handleNextOrPrev;
};

type listBackward = {
  /** 自定义后退 subNodes 的组合键 */
  key?: isKey;

  /** 后退时的行为 */
  on?: handleNextOrPrev;
};

type enterType = "keydown" | "focus" | "click" | "invoke";
type exitType = enterType | "outlist";

type entry = {
  /** 触发器，将用于监听点击事件，用于退出焦点循环时聚焦使用 */
  node?: element;

  /** 自定义进入 subNodes 组合键 */
  key?: iskey;

  /** 点击触发器后的行为 */
  on?: handleEnter;

  /** 入口的事件类型 */
  type?: enterType[];

  /** 进入到哪个元素？ */
  target?: element | getTarget;

  /** 延迟聚焦，触发 node 后等待执行 delay 完成后聚焦 */
  delay?: false | promiseDelay | callbackDelay;
}

type exit = {

  /** 退出循环焦点的触发器，用于监听点击事件 */
  node?: element;

  /** 自定义退出 subNodes 组合键 */
  key?: iskey;

  /** 点击退出循环焦点的触发器后的行为 */
  on?: handleExit;

  /** 出口的事件类型 */
  type?: exitType[];

  /** 退出至哪个元素？ */
  target?: element;

  /** 延迟失焦，触发 node 后等待执行 delay 完成后失焦 */
  delay?: false | promiseDelay | callbackDelay;
};

type exitCover = {

  /** 自定义退出封面的组合键 */
  key?: isKey;

  /** 退出封面时的行为 */
  on?: handleKeydown;

  /** 退出到哪个元素？ */
  target?: element;
}

type cover = {

  /** 封面元素 */
  node?: element;

  /** 退出封面 */
  exit?: exitCover | exitCover[];

  /** 自定义进入 subNodes 的组合键 */
  enterKey?: isKey;

  /** 进入 subNodes 时的行为 */
  onEnter?: handleKeydown;
};

// /** 转发 */
// type forward = {

//   /** 中转元素 */
//   node?: element;

//   /** 中转键位 */
//   key?: isKey;

//   /** 转发目标 */
//   target?: element;

//   /** 中转时的行为 */
//   on?: handleKeydown;
// };

type promiseDelay = () => Promise<unknown>;

type callbackDelay = (fn: () => any) => any;

interface Options {

  /** tab 序列，指定之后焦点的路径就是列表，否则列表是一个范围 */
  sequence?: boolean;

  /** 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 */
  loop?: boolean;

  /** 自定义*前进*焦点函数，设置后，`sequence` 将默认为 true */
  next?: isKey | listForward;

  /** 自定义*后退*焦点函数，设置后，`sequence` 将默认为 true */
  prev?: isKey | listBackward;

  /** 显式设置入口，用于退出焦点循环时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `entry.node` 后，不用设置 `trigger` */
  trigger?: element;

  /** 入口，进入 list */
  entry?: entry | entry[];

  /** 出口，退出 list */
  exit?: exit | exit[];

  /** 按下 `esc` 的行为，如果未设置，默认取 `exit.on` */
  onEscape?: boolean | handleKeydown;

  /** 点击列表单项的响应，行为 */
  onClick?: handleClick;

  /** 移动的时候触发 */
  onMove?: handleMoveListItem;

  /** 封面相关 */
  cover?: boolean | cover;

  // /** 转发 */
  // forward?: forward;

  /** 延迟聚焦，触发 trigger 后等待执行 delayToFocus 完成后聚焦，延迟聚焦的目的是确认被聚焦的元素已被渲染 */
  delayToFocus?: boolean | promiseDelay | callbackDelay;

  /** 延迟失焦，触发出口后等待执行 delayToBlur 完成后失焦，延迟失焦的目的是等待失焦后再次被聚焦的元素已被渲染 */
  delayToBlur?: promiseDelay | callbackDelay;

  /** 每次退出列表回到入口是否移除列表事件 */
  removeListenersEachExit?: boolean;

  /** 每次进入列表是否移除入口事件 */
  removeListenersEachEnter?: boolean;

  /** 矫正焦点，矫正从非入口进入列表的焦点 */
  disableListCorrection?: boolean;

  /** 手动添加监听事件，入口、列表、出口的监听事件 */
  manual?: boolean;
}

interface Return {

  /** 进入循环，聚焦 */
  enter(): void;

  /** 退出循环，聚焦触发元素 */
  exit(): void;

  /** 移除所有的监听事件 */
  removeListeners(): void;

  /** 添加入口的监听事件 */
  addEntryListeners(): void;

  /** 添加列表相关（封面、列表、出口）的监听事件 */
  addListRelatedListeners(): void;

  /** 当前焦点的编号 */
  i(): number;
}

declare function focusBagel(root: element, list: element[], options?: Options): Return;
declare function focusBagel(list: element[], options?: Options): Return;

export default focusBagel;