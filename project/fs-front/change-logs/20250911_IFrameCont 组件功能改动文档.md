概述

  为 src/components/jsonSchema/IFrameCont/index.vue 组件添加了测试地址和全屏功能。

  改动详情

    1. 测试地址功能

  - 位置: getSchema 函数 (line 63-73)
  - 功能: 当组件没有配置 schemaUrl 时，自动使用测试地址
  - 测试地址: https://httpbin.org/html (可嵌入的测试页面)
  - 用途: 便于开发时测试 iframe 组件的渲染效果

    2. 全屏功能

  2.1 UI 组件

  - 位置: 模板中 (line 13-19)
  - 样式: 右下角浮动的圆形按钮
  - 图标: SVG 全屏图标
  - 交互: 鼠标悬停有放大和背景加深效果

  2.2 全屏逻辑

  - 位置: toggleFullscreen 函数 (line 75-102)
  - 功能:
    - 点击进入全屏：对整个容器进行全屏显示
    - 再次点击或按 ESC 键退出全屏
  - 兼容性: 支持所有主流浏览器的全屏 API

  2.3 全屏样式

  - 位置: CSS 样式 (line 158-197)
  - 效果: 全屏时 iframe 撑满整个屏幕 (100vw × 100vh)
  - 兼容性: 包含各浏览器前缀 (:fullscreen, :-webkit-full-screen, :-moz-full-screen, :-ms-fullscreen)

  技术实现要点

  全屏实现方案

  - 使用容器全屏而非直接对 iframe 全屏，避免黑屏问题
  - 通过 CSS 伪类选择器确保全屏状态下的正确样式
  - 兼容主流浏览器的全屏 API

  样式设计

  - 浮动按钮：半透明背景，不遮挡主要内容
  - 响应式设计：全屏时完全利用屏幕空间
  - 平滑过渡：按钮交互有动画效果

  使用说明

    1. 正常模式: 组件按原有方式显示 iframe 内容
    2. 测试模式: 无 schemaUrl 时自动加载测试页面
    3. 全屏模式: 点击右下角按钮进入全屏，ESC 键退出

  文件结构

  IFrameCont/index.vue
  ├── template: iframe + 全屏按钮
  ├── script: 全屏逻辑 + 测试地址逻辑
  └── style: 全屏样式 + 按钮样式