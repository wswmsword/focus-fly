# 🍩 focus-bagel

这是一个焦点控制项目。

网页程序里有很多需要控制焦点的场景，例如弹窗、菜单、折叠面板、抽屉等等，当焦点进入这些情境，通过 `tab`、*方向键*或其它*组合键*来移动焦点，我们期望焦点可以在某个范围中循环，或者卡在首尾两个元素之间。

下面的文档会使用到几个关键词，分别是**入口**、**封面**、**列表**和**出口**，引入项目之后可以运用这几个关键词，来描述如何进入焦点，进入后如何移动焦点，以及如何退出焦点。

一个常规流程是这样的，开始焦点在*入口*，焦点通过*入口*到达*列表*，在*列表*中焦点可以自由移动，前进或者后退聚焦*列表*的每一个单项，*列表*中有一个特殊项是*出口*，通过*出口*，焦点会从*列表*回到*入口*。也有一些情况，在从*入口*到*列表*之前首先到达*封面*，从*出口*回到*入口*前首先回到*封面*。还有一些情况不用指定*入口*和*出口*，*封面*独自担当这两个角色。

<details>
<summary>在开发无障碍组件的时候需要控制焦点。</summary>
例如开发一个模态对话框，对话框的背景应该对所有用户隐藏，对于鼠标用户，鼠标不能访问背景元素，对于键盘用户，键盘不能访问背景元素，对于使用辅助设备的用户，辅助设备也不能访问背景元素。这个仓库可以控制键盘焦点在对话框中循环，避免聚焦到背景元素上。
</details>

## 安装

> 开发中，等待发布至 npm。

## 使用

添加下面这两行代码后，焦点会在元素 `#firstTabbableNode` 和 `#lastTabbableNode` 之间陷入循环：
```javascript
import bagel from "focus-bagel";
bagel(["#firstTabbableNode", "#lastTabbableNode"]);
```

更多的选项请查看下面各参数的详细介绍。

### focusBagel(subNodes[, options])

调用函数 `focusBagel` 控制焦点，函数可以传递 2 个参数，`subNodes` 表示焦点*列表*，第二个入参 `options` 是可选的，用于设定若干选项，例如设定*入口*、*封面*、*列表*和*出口*相关的详细配置。

### focusBagel(rootNode, subNodes[, options])

调用函数 `focusBagel` 控制焦点，函数可以传递 3 个参数，`rootNode` 是 `subNodes` 的祖先元素，将会被用来监听键盘事件，如果不提供 `rootNode`，focus-bagel 将会通过 `subNodes` 找到最小公共祖先元素，第二个入参 `subNodes` 表示*列表*，第三个 `options` 是可选的，用于设定若干选项。

<details>
<summary>
查看一种使用范例。
</summary>

```javascript
import focusBagel from "focus-bagel"; // esm 方式引入
// const focusBagel = require("focus-bagel"); // cjs 方式引入

/** 循环焦点的根元素，对话框 */
const dialog = document.getElementById("dialog");
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

如果不提供这个参数，focus-bagel 会取得 `subNodes` 的最小公共祖先作为 `rootNode`。

### subNodes

**subNodes**，`(string | Element | HTMLElement)[]`，是一个数组，数组内的元素可以是 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

这个参数表示*列表*，默认情况下，数组 `subNodes` 只需要两个元素，一个元素是用于聚焦的头元素，一个元素是用于聚焦的尾元素，如果传入的数组长度大于 2，focus-bagel 将取头和尾两个元素。这两个元素被用于确定按下 `tab` 后的聚焦元素，识别到尾元素将跳转到头元素，按下 `shift-tab`，识别到头元素将跳转到尾元素。

设置 `options.manual` 为 true 后，`subNodes` 必须手动指定，这时按下 `tab` 后，聚焦规则将不是浏览器的默认行为，而是以 `subNodes` 中元素的顺序进行聚焦。当设置 `options.forward` 或 `options.backward` 后，`options.manual` 默认为 true。

### options

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| manual | boolean | N | false | 是否指定聚焦的元素，设置 true 则按顺序聚焦*列表*内每项元素 |
| loop | boolean | N | true | 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 |
| forward | isKey \| subNodesForward | N | null | 自定义*前进*焦点函数，设置后，`manual` 将默认为 true |
| backward | isKey \| subNodesForward | N | null | 自定义*后退*焦点函数，设置后，`manual` 将默认为 true |
| trigger | element | N | null | *入口*元素，用于退出*列表*时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `enter.selector` 后，不用设置 `trigger` |
| enter | enterSubNodes | N | null | *入口*相关配置，进入*列表* |
| exit | exitSubNodes | N | null | *出口*相关配置，退出*列表* |
| onEscape | false \| handleKeydown | N | null | 按下 `esc` 的行为，如果未设置，默认取 `options.exit.on` |
| cover | cover | N | null | *封面*相关配置 |
| delayToFocus | promiseDelay \| callbackDelay | N | null | 延迟聚焦，执行完 `options.enter.on` 后，等待执行 delayToFocus 完成后聚焦 |
| removeListenersEachExit | boolean | N | true | 每次退出*列表*后是否移除所有监听事件 |

### options.forward

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| key | isKey | N | null | 自定义在*列表*前进的组合键 |
| on | handleKeydown | N | null | 前进时被执行，前进时的行为 |

### options.backward

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| key | isKey | N | null | 自定义在*列表*后退的组合键 |
| on | handleKeydown | N | null | 后退时被执行，后退时的行为 |

### options.enter

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| node | element | N | null | *入口*元素，将用于监听点击事件，用于退出*列表*时聚焦使用 |
| key | iskey | N | null | 自定义进入*列表*组合键 |
| on | handleKeydown | N | null | 进入时被调用，进入*列表*前的行为，如果*列表*或*封面*在这里渲染，需要设置 `options.delayToFocus` 来延迟聚焦 |

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

### options.exit

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| node | element | N | null | *入口*元素，将用于监听点击事件，用于退出*列表*时聚焦使用 |
| key | iskey | N | null | 自定义进入*列表*组合键 |
| on | handleKeydown | N | null | 进入时被调用，进入*列表*前的行为 |

### options.cover

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| node | element | N | null | *封面*元素，如果不指定，默认将取 `rootNode` |
| next | element | N | null | 封面的后一个可 tab 的元素 |
| nextKey | element | N | null | 自定义聚焦封面后面元素的组合键 |
| nextKeyBack | element | N | null | 从后面元素返回到封面的组合键 |
| onNext | element | N | null | 聚焦后面可 tab 元素的行为 |
| onNextBack | element | N | null | 返回的行为 |
| prev | element | N | null | 封面的前一个可 tab 的元素 |
| prevKey | element | N | null | 自定义聚焦封面前面元素的组合键 |
| prevKeyBack | element | N | null | 聚焦前面元素之后返回到封面的组合键 |
| onPrev | element | N | null | 聚焦前面可 tab 元素的行为 |
| onPrevBack | element | N | null | 返回的行为 |
| enterKey | element | N | null | 自定义进入 subNodes 的组合键 |
| onEnter | element | N | null | 进入 subNodes 时的行为 |
| exitKey | element | N | null | 自定义退出封面的组合键 |
| onExit | element | N | null | 退出封面时的行为 |

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