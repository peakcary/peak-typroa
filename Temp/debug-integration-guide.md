# 调试图标集成指南

## 📋 集成步骤

### 1. 添加Vuex模块

在 `store/index.js` 中注册调试模块：

```javascript
// store/index.js
import { createStore } from 'vuex'
import debug from './modules/debug'

const store = createStore({
  modules: {
    debug,
    // 其他模块...
  }
})

export default store
```

### 2. 修改主应用文件

在 `main.js` 中初始化调试功能：

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import util from '@/assets/util'

const app = createApp(App)

// 初始化调试模块
if (util.isFeishuEnv()) {
  store.dispatch('debug/initDebug')
}

app.use(store)
app.mount('#app')
```

### 3. 在根组件中添加调试图标

修改 `App.vue` 或主布局组件：

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <!-- 主要内容 -->
    <router-view />
    
    <!-- 调试组件 - 全局显示 -->
    <DebugIcon v-if="shouldShowDebug" />
  </div>
</template>

<script>
import DebugIcon from '@/components/DebugIcon.vue'
import util from '@/assets/util'

export default {
  name: 'App',
  components: {
    DebugIcon
  },
  computed: {
    shouldShowDebug() {
      // 只在飞书环境或开发环境下显示
      return util.isFeishuEnv() || process.env.NODE_ENV === 'development'
    }
  }
}
</script>
```

### 4. 修改util请求工具

在 `assets/util.js` 中集成调试拦截器：

```javascript
// assets/util.js (在现有request方法中添加调试功能)
import debugInterceptor from '@/utils/debug-interceptor'

const util = {
  // 现有代码...
  
  request(options) {
    // 记录请求开始
    options = debugInterceptor.logRequestStart(options)
    
    return new Promise((resolve, reject) => {
      // 原有的请求逻辑...
      
      // 成功回调中添加调试记录
      const originalSuccess = options.success || (() => {})
      options.success = (result) => {
        // 记录成功请求
        debugInterceptor.logRequestSuccess(options, result)
        originalSuccess(result)
        resolve(result)
      }
      
      // 失败回调中添加调试记录
      const originalFail = options.fail || (() => {})
      options.fail = (error) => {
        // 记录失败请求
        debugInterceptor.logRequestError(options, error)
        originalFail(error)
        reject(error)
      }
      
      // 执行原有请求逻辑...
    })
  }
}
```

### 5. 样式集成（可选）

如果使用全局样式，可以在 `main.css` 中添加调试相关样式：

```css
/* main.css */
.debug-toast {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  z-index: 10000 !important;
  transition: opacity 0.3s !important;
  pointer-events: none !important;
}
```

---

## 🔧 具体集成代码

### store/index.js
```javascript
import { createStore } from 'vuex'
import debug from './modules/debug'

const store = createStore({
  state: {
    // 全局状态
  },
  
  modules: {
    debug
  }
})

// 初始化调试功能
import util from '@/assets/util'
if (util.isFeishuEnv()) {
  store.dispatch('debug/initDebug')
}

export default store
```

### assets/util.js 修改示例
```javascript
// 在现有util.js的request方法中添加以下代码

import debugInterceptor from '@/utils/debug-interceptor'

// 修改现有的request方法
request: function(options) {
  // 添加调试开始记录
  if (typeof options === 'object') {
    options = debugInterceptor.logRequestStart(options)
  }
  
  // 原有的请求处理逻辑...
  return new Promise((resolve, reject) => {
    
    // 在成功处理中添加调试日志
    const handleSuccess = (result) => {
      debugInterceptor.logRequestSuccess(options, result)
      resolve(result)
    }
    
    // 在失败处理中添加调试日志
    const handleError = (error) => {
      debugInterceptor.logRequestError(options, error)
      reject(error)
    }
    
    // 原有的AJAX逻辑，将success和error回调替换为上面的处理函数
    // ...
  })
}
```

### 飞书认证页面特殊集成
```vue
<!-- pages/feishu/auth.vue -->
<template>
  <div class="feishu-auth-container">
    <!-- 原有内容 -->
    
    <!-- 调试图标 - 仅在此页面显示更多信息 -->
    <DebugIcon v-if="isFeishuEnv" :show-auth-details="true" />
  </div>
</template>

<script>
import DebugIcon from '@/components/DebugIcon.vue'
import util from '@/assets/util'

export default {
  components: {
    DebugIcon
  },
  
  data() {
    return {
      isFeishuEnv: util.isFeishuEnv()
    }
  },
  
  mounted() {
    // 在认证页面添加特殊的调试信息
    if (this.isFeishuEnv && this.$store.state.debug) {
      this.$store.commit('debug/ADD_REQUEST_LOG', {
        method: 'INFO',
        url: '/page/feishu/auth',
        params: { 
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        },
        response: { message: '进入飞书认证页面' },
        status: 'success',
        category: 'auth',
        duration: 0
      })
    }
  }
}
</script>
```

---

## 🚀 快速集成脚本

创建 `scripts/setup-debug.js` 快速集成脚本：

```javascript
// scripts/setup-debug.js
const fs = require('fs')
const path = require('path')

// 检查并创建必要的文件和目录
function setupDebugFeature() {
  const srcPath = path.join(__dirname, '../client/src')
  
  // 1. 检查store目录
  const storeDir = path.join(srcPath, 'store/modules')
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true })
    console.log('✅ 创建store/modules目录')
  }
  
  // 2. 检查components目录
  const componentsDir = path.join(srcPath, 'components')
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true })
    console.log('✅ 创建components目录')
  }
  
  // 3. 检查utils目录
  const utilsDir = path.join(srcPath, 'utils')
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true })
    console.log('✅ 创建utils目录')
  }
  
  console.log('🎉 调试功能目录结构已准备完成!')
  console.log('📝 请按照集成指南完成剩余步骤:')
  console.log('   1. 复制组件文件到对应目录')
  console.log('   2. 修改store/index.js注册debug模块') 
  console.log('   3. 修改App.vue添加DebugIcon组件')
  console.log('   4. 修改assets/util.js集成拦截器')
}

setupDebugFeature()
```

运行集成脚本：
```bash
node scripts/setup-debug.js
```

---

## 🔍 使用方法

### 基础使用
1. 在飞书中打开应用
2. 右下角会自动显示调试图标 🐛
3. 点击图标查看API请求记录
4. 即使页面跳转，调试图标仍然保留

### 高级使用
1. **筛选日志**: 点击"认证"、"成功"、"失败"等筛选按钮
2. **查看详情**: 点击具体的请求记录展开详细信息
3. **复制数据**: 点击"复制"按钮将请求数据复制到剪贴板
4. **导出日志**: 点击导出按钮下载完整的调试日志
5. **清空记录**: 点击清空按钮删除所有调试记录

### 问题排查
当遇到"未绑定用户跳转首页"问题时：
1. 点击调试图标
2. 筛选"认证"相关请求
3. 查看 `/api/user/fsreglogin` 的请求和响应
4. 检查 `isLogin` 字段的值
5. 复制异常数据发送给开发团队

---

## ⚙️ 配置选项

### 环境控制
```javascript
// 可以通过以下方式控制调试功能显示
localStorage.setItem('debug_enabled', 'true')  // 强制启用
localStorage.setItem('debug_enabled', 'false') // 强制禁用

// URL参数控制
https://your-app.com/feishu/auth?debug=true  // 启用调试
```

### 自定义配置
```javascript
// 在main.js中自定义配置
if (util.isFeishuEnv()) {
  store.dispatch('debug/initDebug')
  
  // 设置最大日志数量
  store.commit('debug/SET_MAX_LOGS', 50)
}
```

---

## 🔒 安全注意事项

1. **生产环境**: 确保只在飞书环境下显示
2. **数据脱敏**: 敏感字段已自动脱敏处理
3. **存储限制**: localStorage只保存最近20条记录
4. **权限控制**: 可通过配置控制哪些用户可以看到调试信息

---

## 📱 移动端适配

调试组件已适配移动端，在小屏幕设备上会自动调整布局：
- 面板宽度自适应屏幕
- 日志列表垂直排列
- 触摸友好的按钮大小

---

这个集成方案可以帮助你快速定位线上问题，特别是飞书认证相关的接口调用问题。通过实时查看API请求和响应，可以快速判断是前端逻辑问题还是后端数据问题。