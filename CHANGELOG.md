# 更新日志

该文件记录项目的所有改动。

格式基于“[如何维护更新日志](https://keepachangelog.com/zh-CN/1.0.0/)”，
版本管理基于“[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)”。

## [Unreleased]

### Added

- 添加 Toast 范例
- 添加确认弹窗范例
- 元素作为开关的其他方式
- 列表内添加步长选项
- 支持嵌套
- 优化矫正的判断，替换 trappedList 的判断方式
- 修复非矫正的 onMove
- 添加根元素同时是入口的处理方式

```json
{
  "root": "",
  "cover": "",
  "entry": "",
  "exit": "",
  "list": ["#1", "#2", {
    "root": "",
    "cover": "",
    "entry": "",
    "exit": "",
    "list": "",
  }],
}
```

## [2.1.0] - 2023-09-10

### Added

- 属性 key 的字符串快捷方式。

### Fixed

- 修复 Safari 开关入口无效问题；
- 修复自定义列表导航时，<kbd>Tab</kbd> 仍然生效问题。

## [2.0.1] - 2023-08-04

### Fixed

- 类型文件中的 focusNoJustu 改为 focusFly。

## [2.0.0] - 2023-08-04

### Added

- 添加列表、入口和出口的 stopPropagation 与 preventDefault 选项；
- 支持向 exit.node 传入函数；
- 范围模式下，支持 onMove、onNext、onPrev、onClick；
- 范围模式下，支持焦点矫正；
- correctionTarget 入参添加属性 `e` 作为事件对象。

### Changed

- 键盘出口的优先级高于列表移动；
- 包名由“focus-no-jutsu”改为“focus-fly”。

### Fixed

- 修复出口目标处于列表中时，导致焦点矫正的问题；
- 修复在进入列表前调用 `focus.updateList` 后，无法进入列表的问题；
- 修复 correctionTarget 设为 false 后，从外部进入列表以及经过出口时的 onMove 失效问题。

## [1.1.0] - 2023-07-20

### Added

- 添加 addEntryListenersEachExit 选项，用于在离开列表时取消自动添加入口监听事件。

### Changed

- 移除 `async/await` 和 `for...of`，减小产包体积；
- 合并出口和列表元素的点击事件，提高性能；
- 整理 onMove 的参数，从入口进入时，prev 为 `null`，prevI 为 `-1`，从出口返回时，cur 为 `null`，curI 为 `-1`；
- 移除范围列表模式下的 onMove 调用；
- 范围列表模式中，焦点可以通过非入口进入列表循环。

### Fixed

- 修复出口为 `outlist` 类型时，`if` 属性无效；
- 修复在触发列表的矫正焦点时，重复执行 `onMove`；
- 修复在列表中点击时，不能连续重复对列表单项调用 `onMove` 的问题。

## [1.0.0] - 2023-06-30

完成基础功能。