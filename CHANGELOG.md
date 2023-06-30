# 更新日志

该文件记录项目的所有改动。

格式基于“[如何维护更新日志](https://keepachangelog.com/zh-CN/1.0.0/)”，
版本管理基于“[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)”。

## [Unreleased]

### Added

- 添加 Toast 范例
- 范围列表（tab range）的 onMove，设置 prev 和 active
- 元素作为开关的其他方式
- 列表内添加步长选项
- 支持嵌套

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

## [1.0.0]

完成基础功能。