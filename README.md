# focus-loop

设置范围，循环焦点。

网页程序里有很多需要控制焦点的场景，例如弹窗、菜单、折叠面板、抽屉等等，当焦点进入这类场景根元素的时候，通过 `tab`、*方向键*或其它*组合键*来移动焦点，会期望焦点可以在根元素中循环，或者卡在首尾两个可聚焦元素之间。

在开发无障碍组件的时候需要控制焦点。例如开发一个模态对话框，对话框的背景应该对所有用户隐藏，对于鼠标用户，鼠标不能访问背景元素，对于键盘用户，键盘不能访问背景元素，对于使用辅助设备的用户，辅助设备也不能访问背景元素。这个仓库可以控制键盘焦点在对话框中循环，避免聚焦到背景元素上。

## 使用

### focusLoop(rootNode, subNodes[, options])

调用 `focusLoop` 函数创建循环焦点，函数可以传递 3 个参数，`rootNode` 作为根元素监听键盘事件，`subNodes` 作为子元素数组，用于检查头元素和尾元素进行循环聚焦，第三个 `options` 是可选的，用于设定若干选项。

<details>
<summary>
查看一种使用范例。
</summary>

```javascript
import focusLoop from "focus-loop";

const dialog = document.getElementById("root");
focusLoop(dialog, ["#head", "#tail"], {
  enter: {
    selector: "#open",
    on() {
      dialog.classList.add("opened");
      dialog.classList.remove("closed");
    },
  },
  exit: {
    selector: "#close",
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

**rootNode**，`string | HTMLElement`，可以是一个 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是一个 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

`rootNode` 将被用于监听键盘（keydown）事件，默认会监听按键 `tab` 来控制循环焦点。如果需要监听 `esc`，希望按下 `esc` 后聚焦触发元素，请设置 `options.exit` 或者 `options.onEscape`，同时设置 `trigger` 或者 `options.enter`，`options.exit` 和 `options.onEscape` 被用来执行按下 `esc` 后的行为，`trigger` 和 `options.enter` 用来聚焦触发器（触发元素）。

### subNodes

**subNodes**，`(string | HTMLElement)[]`，是一个数组，数组内的元素可以是 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

默认情况下，数组 `subNode` 只需要两个元素，一个元素是用于聚焦的头元素，一个元素是用于聚焦的尾元素，如果传入的数组长度大于 2，将取头和尾两个元素。这两个元素被用于确定按下 `tab` 后的聚焦元素，识别到尾元素将跳转到头元素，按下 `tab+shift`，识别到头元素将跳转到尾元素。

设置 `options.manual` 为 true 后，`subNodes` 必须手动指定，这时按下 `tab` 后，聚焦规则将不是浏览器的默认行为，而是以 `subNodes` 中元素的顺序进行聚焦。当设置 `options.isBackward` 或 `options.isForward` 后，`options.manual` 默认为 true。

### options

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| manual | boolean | N | false | 是否指定聚焦的元素，设置 true 则按顺序聚焦 `subNodes` |
| loop | boolean | N | true | 是否循环聚焦，设置为 false，焦点将停止在第一个和最后一个元素 |
| isForward | (e: KeyboardEvent) => boolean | N | null | 自定义*前进*焦点函数，设置后，`manual` 将默认为 true |
| isBackward | (e: KeyboardEvent) => boolean | N | null | 自定义*后退*焦点函数，设置后，`manual` 将默认为 true |
| trigger | string \| HTMLElement | N | null | 触发器，用于退出焦点循环时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `enter.selector` 后，不用设置 `trigger` |
| enter.selector | string \| HTMLElement | N | null | 触发器，将用于监听点击事件，用于退出焦点循环时聚焦使用 |
| enter.on | (e: KeyboardEvent) => any | N | null | 点击触发器后的行为 |
| exit.selector | string \| HTMLElement | N | null | 退出循环焦点的触发器，用于监听点击事件 |
| exit.on | (e: KeyboardEvent) => any | N | null | 点击退出循环焦点的触发器后的行为 |
| onEscape | (e: KeyboardEvent) => any | N | exit.on | 按下 esc 的行为，如果未设置，默认取 exit.on |

## CHANGELOG

查看[更新日志](./CHANGELOG.md)。

## 版本规则

查看[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)。

## 协议

查看 [MIT License](./LICENSE)。

## 其它

相关链接：
- [https://www.toptal.com/developers/keycode](https://www.toptal.com/developers/keycode)