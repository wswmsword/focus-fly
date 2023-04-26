type handleKeydown = (e: KeyboardEvent) => any;

type element = string | Element | HTMLElement;

type isKey = (e: KeyboardEvent) => boolean;

type subNodesForward = {
  /** 自定义前进 subNodes 的组合键 */
  key?: isKey;

  /** 前进时的行为 */
  on?: handleKeydown;
};

type subNodesBackward = {
  /** 自定义后退 subNodes 的组合键 */
  key?: isKey;

  /** 后退时的行为 */
  on?: handleKeydown;
};

type enterSubNodes = {
  /** 触发器，将用于监听点击事件，用于退出焦点循环时聚焦使用 */
  node?: element;

  /** 自定义进入 subNodes 组合键 */
  key?: iskey;

  /** 点击触发器后的行为 */
  on?: handleKeydown;

  /** 是否关闭点击事件 */
  disableClick?: boolean;
}

type exitSubNodes = {

  /** 退出循环焦点的触发器，用于监听点击事件 */
  node?: element;

  /** 自定义退出 subNodes 组合键 */
  key?: iskey;

  /** 点击退出循环焦点的触发器后的行为 */
  on?: handleKeydown;

  /** 退出至哪个元素？ */
  target?: element;
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

type promiseDelay = () => Promise<unknown>;

type callbackDelay = (fn: () => any) => any;

interface Options {

  /** 是否指定聚焦的元素，设置 true 则按顺序聚焦 `subNodes` */
  manual?: boolean;

  /** 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 */
  loop?: boolean;

  /** 自定义*前进*焦点函数，设置后，`manual` 将默认为 true */
  forward?: isKey | subNodesForward;

  /** 自定义*后退*焦点函数，设置后，`manual` 将默认为 true */
  backward?: isKey | subNodesBackward;

  /** 触发器，用于退出焦点循环时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `enter.selector` 后，不用设置 `trigger` */
  trigger?: element;

  /** 进入 subNodes */
  enter?: enterSubNodes | enterSubNodes[];

  /** 退出 subNodes */
  exit?: exitSubNodes | exitSubNodes[];

  /** 按下 `esc` 的行为，如果未设置，默认取 `exit.on` */
  onEscape?: false | handleKeydown;

  /** 封面相关 */
  cover?: cover;

  /** 延迟聚焦，触发 trigger 后等待执行 delayToFocus 完成后聚焦 */
  delayToFocus?: promiseDelay | callbackDelay;

  /** 每次退出至 trigger 是否移除事件 */
  removeListenersEachExit?: boolean;
}

interface Return {

  /** 进入循环，聚焦 */
  enter(): void;

  /** 退出循环，聚焦触发元素 */
  exit(): void;

  /** 当前焦点的编号 */
  i(): number;
}

declare const focusBagel: (rootNode: element, subNodes: element[], options?: Options) => Return;

export default focusBagel;

// export function focusBagel(rootNode: element, subNodes: element[], options?: Options): Return;
// export function focusBagel(subNodes: element[], options?: Options): Return;