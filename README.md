# 🍩 focus-bagel

这是一个焦点控制项目。引入这个项目，描述如何进入焦点，进入后如何移动焦点，以及如何退出焦点。

<!-- ```
enter-trigger -> cover-container -> sub-items -> exit-trigger
``` -->

网页程序里有很多需要控制焦点的场景，例如弹窗、菜单、折叠面板、抽屉等等，当焦点进入这类场景根元素的时候，通过 `tab`、*方向键*或其它*组合键*来移动焦点，会期望焦点可以在根元素这个范围中循环，或者卡在首尾两个可聚焦元素之间。

<details>
<summary>在开发无障碍组件的时候需要控制焦点。</summary>
例如开发一个模态对话框，对话框的背景应该对所有用户隐藏，对于鼠标用户，鼠标不能访问背景元素，对于键盘用户，键盘不能访问背景元素，对于使用辅助设备的用户，辅助设备也不能访问背景元素。这个仓库可以控制键盘焦点在对话框中循环，避免聚焦到背景元素上。
</details>

## 安装

> 开发中，等待发布至 npm。

## 使用

添加两行代码之后，焦点就陷入了循环：
```javascript
import focusBagel from "focus-bagel";
focusBagel("#dialog", ["#firstTabbableElement", "#lastTabbableElement"]);
```

上面的代码块表示，元素 `#dialog` 会监听按键 `tab`，当焦点在元素 `#lastTabbableElement` 时按下 `tab`，`#firstTabbableElement` 会被聚焦，当焦点在 `#firstTabbableElement` 时按下 `shift-tab`，`#lastTabbableElement` 会被聚焦。

更多的选项请查看下面各参数的详细介绍。

### focusBagel(rootNode, subNodes[, options])

调用 `focusBagel` 函数创建循环焦点，函数可以传递 3 个参数，`rootNode` 作为根元素监听键盘事件，`subNodes` 作为子元素数组，用于检查头元素和尾元素进行循环聚焦，第三个 `options` 是可选的，用于设定若干选项。

<details>
<summary>
查看一种使用范例。
</summary>

```javascript
import focusBagel from "focus-bagel"; // esm 方式引入
// const focusBagel = require("focus-bagel"); // cjs 方式引入

/** 循环焦点的根元素，对话框 */
const dialog = document.getElementById("root");
focusBagel(dialog, ["#head", "#tail"], {
  enter: {
    /** 触发器的选择器字符串，例如“打开”按钮 */
    selector: "#open",
    /** 点击 #open 后的行为 */
    on() {
      dialog.classList.add("opened");
      dialog.classList.remove("closed");
    },
  },
  exit: {
    /** 退出循环焦点的触发器，例如“返回”按钮 */
    selector: "#close",
    /** 点击 #close 后的行为 */
    on() {
      dialog.classList.add("closed");
      dialog.classList.remove("opened");
    },
  }
});
```

您也可以进入[范例文件夹](./examples/run-start/)，通过运行范例文件夹，进行本地预览：

```bash
npm i
npm run start
```

</details>

### rootNode

**rootNode**，`string | Element | HTMLElement`，可以是一个 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是一个 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

`rootNode` 将被用于监听键盘（keydown）事件，默认会监听按键 `tab` 来控制循环焦点。如果需要监听 `esc`，希望按下 `esc` 后聚焦触发元素，请设置 `options.exit` 或者 `options.onEscape`，同时设置 `trigger` 或者 `options.enter`，`options.exit` 和 `options.onEscape` 被用来执行按下 `esc` 后的行为，`trigger` 和 `options.enter` 用来聚焦触发器（触发元素）。

### subNodes

**subNodes**，`(string | Element | HTMLElement)[]`，是一个数组，数组内的元素可以是 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

默认情况下，数组 `subNode` 只需要两个元素，一个元素是用于聚焦的头元素，一个元素是用于聚焦的尾元素，如果传入的数组长度大于 2，将取头和尾两个元素。这两个元素被用于确定按下 `tab` 后的聚焦元素，识别到尾元素将跳转到头元素，按下 `shift-tab`，识别到头元素将跳转到尾元素。

设置 `options.manual` 为 true 后，`subNodes` 必须手动指定，这时按下 `tab` 后，聚焦规则将不是浏览器的默认行为，而是以 `subNodes` 中元素的顺序进行聚焦。当设置 `options.isBackward` 或 `options.isForward` 后，`options.manual` 默认为 true。

### options

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| manual | boolean | N | false | 是否指定聚焦的元素，设置 true 则按顺序聚焦 `subNodes` |
| loop | boolean | N | true | 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 |
| isForward | (e: KeyboardEvent) => boolean | N | null | 自定义*前进*焦点函数，设置后，`manual` 将默认为 true |
| isBackward | (e: KeyboardEvent) => boolean | N | null | 自定义*后退*焦点函数，设置后，`manual` 将默认为 true |
| trigger | string \| Element \| HTMLElement | N | null | 触发器，用于退出焦点循环时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `enter.selector` 后，不用设置 `trigger` |
| enter.selector | string \| Element \| HTMLElement | N | null | 触发器，将用于监听点击事件，用于退出焦点循环时聚焦使用 |
| enter.on | (e: KeyboardEvent) => any | N | null | 点击触发器后的行为 |
| exit.selector | string \| Element \| HTMLElement | N | null | 退出循环焦点的触发器，用于监听点击事件 |
| exit.on | (e: KeyboardEvent) => any | N | null | 点击退出循环焦点的触发器后的行为 |
| onEscape | ((e: KeyboardEvent) => any) | N | exit.on | 按下 `esc` 的行为，如果未设置，默认取 `exit.on` |

<details>
<summary>
查看自定义按键聚焦的范例。
</summary>

下面的代码演示了使用 `→`、`↓` 和 `ctrl-n` 完成前进焦点，使用 `←`、`↑` 和 `ctrl-p` 完成后退焦点：
```javascript
import focusBagel from "focus-bagel";

const dialog = document.getElementById("dialog");

const isForward = e => (
  (e.ctrlKey && e.key === "n") ||
  e.key === "ArrowRight" ||
  e.key === "ArrowDown");

const isBackward = e => (
  (e.ctrlKey && e.key === "p") ||
  e.key === "ArrowTop" ||
  e.key === "ArrowLeft");

focusBagel(dialog, ["#head", "#second", "#tail"], {
  enter: {
    selector: "#open",
    on() {
      dialog.classList.add("openedDialog");
      dialog.classList.remove("closedDialog");
    },
  },
  exit: {
    selector: "#close",
    on() {
      dialog.classList.remove("openedDialog");
      dialog.classList.add("closedDialog");
    },
  },
  isForward, // <----- 自定义*前进*焦点的配置项
  isBackward, // <---- 自定义*后退*焦点的配置项
});
```

</details>

### Return

下面是调用 focusBagel 后返回的属性。

| Name | Type | Desc |
|:--|:--|:--|
| enter | () => void | 聚焦 `subNodes` 的头元素，如果自己管理触发器的点击监听器，可以使用该方法 |
| exit | () => void | 聚焦触发元素，例如 `trigger`，如果自己管理退出触发器的点击监听器，可以使用该方法 |
| i | () => number | 获取当前焦点的编号 |

<details>
<summary>
查看使用返回属性的一个范例。
</summary>

```javascript
import focusBagel from "focus-bagel";

const dialog = document.getElementById("dialog");
const openBtn = document.getElementById("#open");
const closeBtn = document.getElementById("#close");

const focusBagel = focusBagel(dialog, ["#head", "#tail"]);

openBtn.addEventListener("click", e => {
  dialog.classList.add("openedDialog");
  dialog.classList.remove("closedDialog");
  focusBagel.enter(); // 聚焦 #head
})

closeBtn.addEventListener("click", e => {
  dialog.classList.remove("openedDialog");
  dialog.classList.add("closedDialog");
  focusBagel.exit(); // 聚焦 #dialog
})
```

</details>

## 单元测试

```bash
npm install
npm run test
```

## CHANGELOG

查看[更新日志](./CHANGELOG.md)。

## 版本规则

查看[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)。

## 协议

查看 [MIT License](./LICENSE)。

## 其它

相关链接：
- [https://www.toptal.com/developers/keycode](https://www.toptal.com/developers/keycode)