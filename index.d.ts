type handleKeydown = (e: KeyboardEvent) => any;

type element = string | Element | HTMLElement;

interface Options {

  /** 是否指定聚焦的元素，设置 true 则按顺序聚焦 `subNodes` */
  manual?: boolean;

  /** 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 */
  loop?: boolean;

  /** 自定义*前进*焦点函数，设置后，`manual` 将默认为 true */
  isForward?: (e: KeyboardEvent) => boolean;

  /** 自定义*后退*焦点函数，设置后，`manual` 将默认为 true */
  isBackward?: (e: KeyboardEvent) => boolean;

  /** 触发器，用于退出焦点循环时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `enter.selector` 后，不用设置 `trigger` */
  trigger?: element;

  enter?: {

      /** 触发器，将用于监听点击事件，用于退出焦点循环时聚焦使用 */
      selector?: element;

      /** 点击触发器后的行为 */
      on?: handleKeydown;
  };

  exit?: {

      /** 退出循环焦点的触发器，用于监听点击事件 */
      selector?: element;

      /** 点击退出循环焦点的触发器后的行为 */
      on?: handleKeydown;
  };

  /** 按下 `esc` 的行为，如果未设置，默认取 `exit.on` */
  onEscape?: false | handleKeydown;
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