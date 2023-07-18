# Focus-no-Jutsu

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu) [![B level Genjutsu](https://img.shields.io/badge/Genjutsu-B-%23fbadcc)](https://naruto.fandom.com/wiki/Genjutsu)

使用 focus-no-jutsu 管理和控制焦点，实现一个[键盘可访问的用户界面](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)，为用户带来流畅的键盘体验。

> 键盘可访问的用户界面，会在用户丧失或暂时丧失使用鼠标能力的时候，依然保有用户使用键盘的能力。对于有能力同时使用鼠标和键盘的用户，他们可以自由地切换访问界面的设备。您可以任意选择鼠标和键盘来访问这个[使用 *focus-no-jutsu* 的范例网站](https://wswmsword.github.io/examples/focus-no-jutsu)。

网页程序里有很多需要管理和控制焦点的场景，例如弹窗、菜单、选项卡、抽屉等等，前往[“其它”](#其它)一节查看开发弹窗时需要考虑焦点的哪些方面。焦点往往在多个元素之间相互关联，并且要有符合预期的移动轨迹。进行业务或组件开发的时候，如果不考虑焦点的影响，处处关联的焦点可能让程序变得混乱，如果遗漏处理某些情况，反应到用户界面上，也会出现不符预期的意外行为，最终会让应用的体验感非常脆弱。

也许你希望能集中管理相互关联的焦点，同时希望能控制焦点导航的路径，不妨试试 focus-no-jutsu，focus-no-jutsu 集中管理焦点、控制焦点路径。

下面的文档会使用到几个关键词，分别是**入口**、**封面**、**列表**和**出口**，引入项目之后可以运用这几个关键词，来描述“焦点如何通过入口进入列表，进入列表后如何移动焦点，以及如何让焦点通过出口退出列表”。

> **Note** <img src="./images/NARUTO01_0054-0055.jpg" alt="漫画里的“影分身之术”" width="180" align="right">
>
> Focus-no-Jutsu 意为“聚焦术”。no-Jutsu 的发音为 /ˈnɔˌjutsu/，是日语里“の術”的发音，意为“……之术”，比如动漫《火影忍者》主角常用的忍术“[多重影分身之术](https://naruto.fandom.com/wiki/Multiple_Shadow_Clone_Technique)”，日语为“多重影分身*の術*”，读音为“Tajū Kage Bunshin *no Jutsu*”。

<details>
<summary>在开发无障碍组件的时候需要控制焦点。</summary>

例如开发一个模态对话框，对话框的背景应该对所有用户隐藏，对于鼠标用户，鼠标不能访问背景元素，对于键盘用户，键盘不能访问背景元素，对于使用辅助设备的用户，辅助设备也不能访问背景元素。

focus-no-jutsu 可以控制从“打开”按钮开始、到对话框内导航、到“关闭”按钮结束，这个流程中焦点的路径，通过确定的焦点路径，避免聚焦到背景元素上。
</details>

## 安装

npm 安装：
```bash
npm install focus-no-jutsu
```

yarn 安装：
```bash
yarn add focus-no-jutsu
```

## 使用

focus-no-jutsu 支持 ESM 和 CJS 导入，如果直接用于浏览器标签引入，可以[在本项目的 `output/` 文件夹内下载 UMD 文件](https://github.com/wswmsword/focus-no-jutsu/tree/main/output)。

添加下面这两行代码后，焦点会在元素 `#firstTabbableNode` 和 `#lastTabbableNode` 之间陷入循环：

```javascript
import focus from "focus-no-jutsu"; // ESM 导入方式
// const focus = require("focus-no-jutsu"); // CJS 导入方式
focus(["#firstTabbableNode", "#lastTabbableNode"]);
```

这是最简洁的调用，以这种方式调用，焦点可以通过键盘（<kbd>Tab</kbd>）进入列表，但是无法通过键盘退出列表，下面对调用参数稍加修改，让焦点在入口、列表和出口间流动：

```javascript
focus(["#firstTabbableNode", "#lastTabbableNode"], {
  entry: "#entryBtn",
  exit: "#lastTabbableNode",
  onEscape: true
});
```

上面的代码执行后，在浏览器中将会有这样的行为：点击 `#entryBtn`，`#firstTabbableNode` 成为焦点，按住 <kbd>Tab</kbd>，焦点在 `#firstTabbableNode` 和 `#lastTabbableNode` 之间循环，点击 `#lastTabbableNode` 或者按下 <kbd>Esc</kbd>，`#entryBtn` 成为焦点。查看[一个在线范例](https://wswmsword.github.io/examples/focus-no-jutsu#h-hot)。

继续阅读查看调用传递入参的详细介绍。

### focusNoJutsu(list[, options])

调用函数 `focusNoJutsu` 管理焦点，函数可以传递 2 个参数，`list` 表示焦点列表，第二个入参 `options` 是可选的，用于设定若干选项，例如设定入口、封面、列表和出口相关的详细配置。

### focusNoJutsu(root, list[, options])

调用函数 `focusNoJutsu` 管理焦点，函数可以传递 3 个参数，`root` 是 `list` 的祖先元素，将会被用来监听键盘（keydown）之类的事件，如果不提供 `root`，focus-no-jutsu 将会通过 `list` 找到最小公共祖先元素，第二个入参 `list` 表示列表，第三个 `options` 是可选的，用于设定若干选项。

<details>
<summary>
查看一种使用范例，范例演示了上面提到的“管理‘关闭’按钮和 <kbd>Esc</kbd>”。
</summary>

```javascript
import focus from "focus-no-jutsu"; // esm 方式引入
// const focus = require("focus-no-jutsu"); // cjs 方式引入

const dialog = document.getElementById("dialog");

// 循环焦点的根元素，对话框
focus(dialog, ["#head", "#tail"], { // 根元素 root 是 #dialog，根元素用来监听诸如 keydown 之类的事件，列表 list 的范围是从 #head 到 #tail，焦点如果进入列表，就会在这个范围循环
  // 入口配置
  entry: {
    // 入口的选择器字符串，例如“打开”按钮
    node: "#open",
    // 点击 #open 后的行为
    on: onEntry,
  },
  // 出口配置
  exit: {
    // 退出列表的出口元素，例如“关闭”按钮
    node: "#close",
    // 点击 #close 后的行为
    on: onExit,
  },
  // 按下 Esc 的行为
  onEscape: true,
});

/** 设置触发入口的行为 */
function onEntry() {
  dialog.classList.add("opened");
  dialog.classList.remove("closed");
}

/** 设置触发出口的行为 */
function onExit() {
  dialog.classList.add("closed");
  dialog.classList.remove("opened");
}
```

您也可以进入[范例文件夹](./examples/cjs/src/dialog.js)，通过运行范例文件夹，进行本地预览：

```bash
cd examples/cjs
npm i
npm run start
```

</details>

### root

**root**，`string | Element`，可以是一个 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是一个 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

根元素 `root` 将被用于监听键盘（keydown）事件，默认会监听按键 <kbd>Tab</kbd> 来控制焦点循环聚焦，如果开启了 `options.onEscape`，也会监听 <kbd>Esc</kbd>。

如果不提供这个参数，focus-no-jutsu 会取得列表 `list` 的最小公共祖先作为根元素 `root`。

### list

**list**，`(string | Element)[]`，是一个数组，数组内的元素可以是 [Element](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 对象，也可以是 [DOMString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。

这个参数表示列表，文档里提到的“列表”都是指这里的 list，默认情况下，数组 `list` 只需要两个元素，一个可聚焦的头元素，一个可聚焦的尾元素，如果传入的数组长度大于 2，将只取头和尾。这两个元素被用于确定按下 <kbd>Tab</kbd> 后的聚焦元素，识别到尾元素将跳转到头元素，按下 <kbd>Shift-Tab</kbd>，识别到头元素将跳转到尾元素。

设置 `options.sequence` 为 true 后，`list` 可以是一个长度大于 2 的序列，这时按下 <kbd>Tab</kbd> 后，将以 `list` 中元素的顺序进行聚焦。在设置 `options.next` 或 `options.prev` 后，原来的 <kbd>Tab</kbd> 被自定义导航键取代，同时 `options.sequence` 被默认设为 true。

通过入口进入列表，如果有封面，则入口进入封面，封面再进入列表。通过出口退出列表，回到入口，如果有封面，出口会退出列表，回到封面，再通过封面回到入口。

### options

下面的选项，除了 `trigger`、`entry`、`exit` 和 `cover`，其它选项基本都和列表相关。下面的每一个选项都是可选的。

| Name | Type | Default | Desc |
|:--|:--|:--|:--|
| sequence | boolean | false | 是否指定焦点导航的序列，设置 true 则按顺序聚焦列表内每项元素 |
| loop | boolean | true | 是否循环聚焦，设置为 false，锁住焦点，焦点将停止在第一个和最后一个元素 |
| next | isKey \| listForward | null | 自定义*前进*焦点函数，设置后，`sequence` 将默认为 true |
| prev | isKey \| listBackward | null | 自定义*后退*焦点函数，设置后，`sequence` 将默认为 true |
| trigger | element | null | 入口元素，用于退出列表时聚焦使用，如果在其它地方设置，可以忽略，例如设置 `entry.node` 后，不用设置 `trigger` |
| entry | element \| element[] \| entry \| entry[] | null | 入口相关配置，进入列表，可以直接设置为一个元素，也可以设置数组，表示多个入口 |
| exit | element \| element[] \| exit \| exit[] | null | 出口相关配置，退出列表，回到入口，如果存在封面，则是回到封面，可以直接设置为一个元素，也可以设置数组，表示多个出口 |
| onEscape | false \| handleKeydown | null | 按下 <kbd>Esc</kbd> 的行为，如果未设置，默认取第一个 `options.exit.on` |
| onClick | handleClick | null | 点击列表里的某一项后的行为 |
| onMove | handleMoveListItem | null | 移动的时候触发，包括进入列表时，移动列表时，以及退出列表时 |
| cover | boolean \| cover | false | 封面相关配置，设置为 true，则是默认封面，默认把根元素 root 作为封面，当焦点在封面上，默认 <kbd>Enter</kbd> 进入列表，默认 <kbd>Tab</kbd> 聚焦列表的后一个元素 |
| initialActive | number | -1 | 默认的初始的焦点在列表中的位置，可能会被用于修改当前和上一个聚焦元素的样式时使用 |
| correctionTarget | boolean \| getTarget | true | 焦点矫正，默认从非入口的空白区域进入列表，也将聚焦上一次退出前焦点在列表中的位置，设置为 false 则不进行矫正 |
| delayToFocus | boolean \| promiseDelay \| callbackDelay | null | 延迟聚焦，执行完 `options.entry.on` 后，等待执行 delayToFocus 完成后聚焦，延迟聚焦的本意是等待列表渲染完成后再聚焦，延迟聚焦意味延迟添加列表相关的事件，也即在触发入口前，没有列表相关的事件，如果设为 true，则会在触发入口后立刻添加列表相关的事件 |
| delayToBlur | promiseDelay \| callbackDelay | null | 延迟失列表的焦，触发出口后等待执行 `delayToBlur` 完成后失焦，和 `delayToFocus` 类似 |
| removeListenersEachExit | boolean | true | 每次退出列表回到入口是否移除列表事件 |
| removeListenersEachEnter | boolean | false | 每次进入列表后是否移除入口事件 |
| addEntryListenersEachExit | boolean | true | 每次退出列表是否添加入口监听事件 |
| manual | boolean | false | 手动添加监听事件，入口、列表、出口的监听事件，通过调用的返回值手动添加各事件 |
| allowSafariToFocusAfterMousedown | boolean | true | 用于抹平 Safari 不同于其它浏览器，点击后 button 之类的元素不会被聚焦的问题，设置为 true，Safari 中 将会在列表的 mousedown 事件里执行 `focus()` |

### options.next

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| key | isKey | N | null | 自定义在列表前进的组合键，设置组合键并返回 true 代表应用这个组合键 |
| on | handleNextOrPrev | N | null | 前进时被执行，前进时的行为 |

### options.prev

| Name | Type | isRequired | Default | Desc |
|:--|:--|:--|:--|:--|
| key | isKey | N | null | 自定义在列表后退的组合键，设置组合键并返回 true |
| on | handleNextOrPrev | N | null | 后退时被执行，后退时的行为 |

<details>
<summary>
查看自定义按键聚焦的范例。
</summary>

下面的代码演示了使用 `→`、`↓` 和 `ctrl-n` 完成前进焦点，使用 `←`、`↑` 和 `ctrl-p` 完成后退焦点：
```javascript
import focus from "focus-no-jutsu";

const dialog = document.getElementById("dialog");

const isForward = e => (
  (e.ctrlKey && e.key === "n") ||
  e.key === "ArrowRight" ||
  e.key === "ArrowDown");

const isBackward = e => (
  (e.ctrlKey && e.key === "p") ||
  e.key === "ArrowTop" ||
  e.key === "ArrowLeft");

focus(dialog, ["#head", "#second", "#tail"], {
  entry: {
    node: "#open",
    on() {
      dialog.classList.add("openedDialog");
      dialog.classList.remove("closedDialog");
    },
  },
  exit: {
    node: "#close",
    on() {
      dialog.classList.remove("openedDialog");
      dialog.classList.add("closedDialog");
    },
  },
  next: isForward, // <----- 自定义*前进*焦点的配置项
  prev: isBackward, // <---- 自定义*后退*焦点的配置项
});
```

</details>

### options.entry

这些选项和入口相关，描述了如何通过入口进入封面或列表。下面的选项可以在一个对象里，也可以在由这个对象组成的数组里。下面的每一个选项都是可选的。

如果已经通过入口进入列表，则在退出列表前，不能再次触发入口进入列表。通过直接点击列表，也被算作进入列表。

| Name | Type | Default | Desc |
|:--|:--|:--|:--|
| node | element \| element[] | null | 入口元素，将用于监听点击事件，用于退出列表时聚焦使用 |
| key | iskey | null | 自定义进入列表组合键 |
| on | handleKeydown | null | 进入时被调用，进入列表前的行为，如果列表或封面在这里才开始渲染，需要设置 `options.delayToFocus` 来延迟聚焦，否则不能聚焦不存在的元素 |
| type | enterType \| enterType[] | null | 入口的监听方式，如果 `options.entry` 设置了 `node` 选项，则默认为 `"click"`，如果还设置了 `key` 选项，则默认为 `["click", "keydown"]`，另外还支持 `"focus"` 类型用于聚焦触发入口，`"invoke"` 类型用于返回值 `Return.enter` 触发入口 |
| target | boolean \| element \| getTarget | null | 进入到哪个元素？设置为 false 将不改变焦点 |
| delay | false \| promiseDelay \| callbackDelay | null | 延迟聚焦，触发 node 后等待执行 delay 完成后聚焦，如果没有设置，将取 `options.delayToFocus` |
| if | ef | null | 触发入口的条件，如果不符合条件，将不被认为是进入了列表 |
| onExit | true \| handleExit | null | 指定当前入口同时也是出口，作为出口的行为，设为 true，则行为取 `options.entry.on`，该选项类似表明这个元素是个开关 |

### options.exit

这些选项和*出口*相关，描述了焦点如何从列表回到封面或入口。

和入口类似，在下次进入列表前，不能够重复触发出口退出列表。通过点击非列表的空白区域，也被算作退出列表。

| Name | Type | Default | Desc |
|:--|:--|:--|:--|
| node | element \| element[] | null | 出口元素，将用于监听点击事件，用于退出列表时聚焦使用 |
| key | iskey | null | 自定义退出列表组合键 |
| on | handleKeydown | null | 退出时被调用，退出列表前的行为，如果有封面就退出至封面，如果没有就退出至入口，设置该选项后，按键按下 <kbd>esc</kbd> 同样生效 |
| type | exitType \| exitType[] | ["keydown", "click"] | 出口的事件类型，和 `options.entry.type` 类似，但是多了 `"outlist"` 类型，用于聚焦空白区域、非列表区域时触发出口，这常用于弹窗的半透明蒙版 |
| target | boolean \| element \| getTarget | null | 退出至哪个元素？设置为 false 将不改变焦点 |
| delay | false \| promiseDelay \| callbackDelay | null | 延迟失焦，触发 node 后等待执行 delay 完成后失焦，如果没有设置，将取 `options.delayToBlur` |
| if | ef | null | 触发出口的条件，如果不符合条件，将不被认为是退出了列表 |

### options.cover

这些选项和封面有关，每个选项都是可选且默认值为空。

如果存在封面，焦点将通过入口进入封面，焦点又通过封面进入列表，焦点通过出口退出至封面，最后焦点通过封面退出至入口。也就是说，在进入列表的阶段时，封面在入口和列表之间，在退出列表的阶段，封面在出口和入口之间。

| Name | Type | Desc |
|:--|:--|:--|
| node | element | 封面元素，如果不指定，默认将取根元素 `root` |
| exit | isKey \| exitCover \| exitCover[] | 退出封面，可以直接设置退出封面的组合键，如果不设置，<kbd>Tab</kbd> 将作为默认退出封面的按键，并且退出至列表的后一个元素 |
| enterKey | isKey | 自定义进入列表的组合键，如果不设置，默认为 <kbd>Enter</kbd> |
| onEnter | handleKeydown | 进入列表时的行为 |

`options.cover.exit` 是一个有若干选项的对象，也可以是一个包含这类对象的数组。下面是 `options.cover.exit` 的所有选项，每一个选项都是可选的，且默认值为空：

| Name | Type | Desc |
|:--|:--|:--|
| key | isKey | 自定义退出封面的组合键 |
| on | handleKeydown | 退出封面时的行为 |
| target | element | 退出到哪个元素？ |

### Return

下面是调用函数 focusNoJutsu 后返回的属性。

| Name | Type | Desc |
|:--|:--|:--|
| enter | (entry: ReturnEntry) => Promise\<void\> | 进入列表，如果自己管理入口元素的点击监听器，可以使用该方法 |
| exit | (exit: ReturnExit) => Promise\<void\> | 退出列表，如果自己管理退出入口元素的点击监听器，可以使用该方法 |
| removeListeners | () => void | 移除所有的监听事件 |
| addEntryListeners | () => void | 添加入口的监听事件 |
| removeEntryListeners | () => void | 移除入口事件 |
| addListRelatedListeners | () => void | 添加列表相关（封面、列表、出口）的监听事件 |
| removeListRelatedListeners | () => void | 移除列表相关的事件 |
| addForward | (id: string, forward: forward \| getForward) => void | 添加转发，转发用于不涉及入口、列表、出口、封面的焦点转移 |
| removeForward | (id: string) => void | 移除转发 |
| updateList | (newList: element[]) => void | 更新列表 |
| i | (newI?: number) => number | 获取和设置当前焦点的编号，设置新的编号之后，会聚焦对应编号的焦点，并触发 `options.onMove` |

<details>
<summary>
查看使用 enter 和 exit 的一个范例。
</summary>

```javascript
import focusNoJutsu from "focus-no-jutsu";

const dialog = document.getElementById("dialog");
const openBtn = document.getElementById("#open");
const closeBtn = document.getElementById("#close");

const focus = focusNoJutsu(dialog, ["#head", "#tail"]);

openBtn.addEventListener("click", e => {
  dialog.classList.add("openedDialog");
  dialog.classList.remove("closedDialog");
  focus.enter(); // 聚焦 #head
})

closeBtn.addEventListener("click", e => {
  dialog.classList.remove("openedDialog");
  dialog.classList.add("closedDialog");
  focus.exit(); // 聚焦 #dialog
})
```

</details>

查看[使用 `addForward` 的一个范例](https://github.com/wswmsword/focus-no-jutsu/blob/main/examples/cjs/src/player.js)，这个范例中，`#grid_wrapper` 是一个中转节点，通过按下 <kbd>Tab</kbd> 和反向 <kbd>Tab</kbd>，焦点中转到 `#more_from`。

## 范例与项目开发

查看和运行范例：

```bash
cd examples/cjs # 进入使用 cjs 模块的范例文件夹
npm i # 安装依赖
npm run start # 本地运行
```

进行项目开发：

```bash
npm i
npm run start
```

运行之后，修改根目录的 index.js（focus-no-jutsu 主文件）和 `examples/run-start` 下的文件，即可在浏览器看到实时修改结果。开发后，提交时请编写相应的单元测试。

## 单元测试

```bash
npm i
npm run test
```

## 常见问题

<details>
<summary>macOS 的 Safari 浏览器中，“entry.onExit” 无效，不能实现切换（开关）的功能。</summary>

`entry.onExit` 利用了 `relatedTarget`，至少对于 `<button>` 元素，Safari 不能正常获取。为了让入口在 Safari 上支持切换出口，可以添加下面这样的 `outlist` 类型的出口：

```javascript
focusNoJutsu("#container", ["#start", "#end"], {
  onEscape: toggle,
  entry: {
    node: "#btn",
    on: toggle,
    onExit: true, // 令 #btn 支持作为出口
  },
  exit: [
    {
      type: "outlist",
      if: () => false, // 强制不执行（跳过） outlist 类型的出口
    },
    // 其它出口
    // {
    //   node: ...
    //   key: ...
    //   on: ...
    // }
  ],
});

function toggle() {
  // ...
}
```

不过像这样添加后，`outlist` 就不能正常使用了，点击空白区域将不会触发 `outlist` 退出列表焦点。
</details>


<details>
<summary>有些情况，通过 onMove、onNext、onPrev、entry.on 等钩子回调，不能完成样式修改。</summary>

focus-no-jutsu 的主要任务是管理和控制**焦点**，如果有钩子不能满足需求，可以考虑在业务开发中自行监听事件，处理样式的变化。
</details>

## 原理

查看[原理](./HOW-IT-WORKS.md)。

## CHANGELOG

查看[更新日志](./CHANGELOG.md)。

## 版本规则

查看[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)。

## 协议

查看 [MIT License](./LICENSE)。

## 支持和赞助

请随意 Issue、PR 和 Star，通过[爱发电](https://afdian.net/a/george-chen)进行赞助。

## 其它

假设准备开发一个弹窗，进行焦点管理，需要有下面的流程、考虑下面几种情况：
- 在“打开”按钮上按下 <kbd>Enter</kbd>，弹窗内第一个元素获得焦点；
- 在弹窗的内部按住 <kbd>Tab</kbd>，焦点（中幻术）不能逃出弹窗；
- 点击弹窗的空白区域，按下反向 <kbd>Tab</kbd>，弹窗内的最后一个元素获得焦点；
- 在“关闭”按钮上按下 <kbd>Enter</kbd>，“打开”按钮获得焦点；
- 按下 <kbd>Esc</kbd>，或者点击弹窗背后的半透明蒙层，“打开”按钮获得焦点；
- 管理弹窗、半透明蒙版、“打开”按钮、“关闭”按钮的点击和键盘事件。

相关链接：
- [Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [接受 #NoMouse 挑战！](https://github.com/wswmsword/my-logs/blob/main/%E7%BF%BB%E8%AF%91/nomouse.md)
- [JavaScript Key Code Event Key](https://www.toptal.com/developers/keycode)