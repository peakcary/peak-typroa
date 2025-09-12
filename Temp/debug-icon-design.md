# 飞书环境调试图标设计方案

## 📋 需求分析

**目标**: 在飞书环境下添加浮动调试图标，可以跟踪接口请求状态，帮助快速排查线上问题。

**使用场景**: 
- 飞书认证页面调试接口调用
- 跳转到首页后继续查看认证过程的接口记录
- 线上问题快速定位和数据收集

---

## 🎯 功能设计

### 显示条件
- ✅ 只在飞书环境下显示 (`util.isFeishuEnv()`)
- ✅ 全局持久化，页面跳转后继续显示
- ✅ 支持手动开关（双击图标隐藏/显示）

### 核心功能
1. **接口请求记录**
   - 记录所有API请求和响应
   - 显示请求时间、URL、参数、响应数据
   - 支持状态筛选（成功/失败/全部）

2. **实时状态显示**
   - 图标上显示未读请求数量
   - 失败请求红色提示
   - 最近请求状态指示

3. **调试面板功能**
   - 请求列表展示
   - 详细数据查看
   - 一键复制数据
   - 清空历史记录
   - 导出调试日志

---

## 🎨 UI设计

### 调试图标
```
位置: 固定在右下角
样式: 圆形浮动按钮
颜色: 半透明蓝色 (#007bff with 0.8 opacity)
尺寸: 50px × 50px
图标: 🐛 或调试符号
状态指示: 右上角红点显示未读数量
```

### 调试面板
```
位置: 图标上方弹出
尺寸: 400px × 500px (可调整)
样式: 现代化卡片设计，阴影效果
内容: 
  - 顶部: 标题 + 清空按钮 + 关闭按钮
  - 筛选: 全部/成功/失败/认证相关
  - 列表: 请求记录（时间、接口、状态）
  - 详情: 点击展开显示完整数据
```

---

## 🏗️ 技术实现

### 1. 全局状态管理
```javascript
// store/debug.js
export default {
  namespaced: true,
  state: {
    isVisible: false,
    requestLogs: [],
    unreadCount: 0,
    filter: 'all' // all, success, error, auth
  },
  
  mutations: {
    TOGGLE_VISIBILITY(state) {
      state.isVisible = !state.isVisible;
    },
    
    ADD_REQUEST_LOG(state, log) {
      state.requestLogs.unshift({
        id: Date.now(),
        timestamp: new Date(),
        ...log
      });
      state.unreadCount++;
      
      // 保留最近100条记录
      if (state.requestLogs.length > 100) {
        state.requestLogs = state.requestLogs.slice(0, 100);
      }
    },
    
    CLEAR_LOGS(state) {
      state.requestLogs = [];
      state.unreadCount = 0;
    },
    
    MARK_AS_READ(state) {
      state.unreadCount = 0;
    }
  }
}
```

### 2. 请求拦截器
```javascript
// utils/request-interceptor.js
import store from '@/store';

export function interceptRequest(config, response, error = null) {
  if (!util.isFeishuEnv()) return;
  
  const log = {
    method: config.method.toUpperCase(),
    url: config.url,
    params: config.data || config.params,
    response: response,
    error: error,
    status: error ? 'error' : 'success',
    statusCode: response?.errno || (error ? -1 : 0),
    duration: Date.now() - config._startTime // 需要在请求开始时记录
  };
  
  // 标记认证相关请求
  if (config.url.includes('/feishu/') || 
      config.url.includes('/fsreglogin') ||
      config.url.includes('/getreglogincode')) {
    log.category = 'auth';
  }
  
  store.commit('debug/ADD_REQUEST_LOG', log);
}
```

### 3. 调试组件
```vue
<!-- components/DebugIcon.vue -->
<template>
  <div v-if="showInFeishu" class="debug-container">
    <!-- 浮动图标 -->
    <div 
      class="debug-icon"
      @click="togglePanel"
      @dblclick="hideIcon"
    >
      🐛
      <div v-if="unreadCount > 0" class="badge">{{ unreadCount }}</div>
    </div>
    
    <!-- 调试面板 -->
    <div v-if="isVisible" class="debug-panel">
      <div class="panel-header">
        <h4>调试面板</h4>
        <div class="panel-actions">
          <button @click="clearLogs">清空</button>
          <button @click="exportLogs">导出</button>
          <button @click="closePanel">×</button>
        </div>
      </div>
      
      <div class="panel-filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="{ active: currentFilter === filter.value }"
        >
          {{ filter.label }}
        </button>
      </div>
      
      <div class="panel-content">
        <div 
          v-for="log in filteredLogs" 
          :key="log.id"
          class="log-item"
          :class="{ error: log.status === 'error' }"
          @click="toggleLogDetails(log.id)"
        >
          <div class="log-summary">
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span class="log-method">{{ log.method }}</span>
            <span class="log-url">{{ log.url }}</span>
            <span class="log-status" :class="log.status">
              {{ log.statusCode }}
            </span>
          </div>
          
          <div v-if="expandedLogs.includes(log.id)" class="log-details">
            <div class="log-section">
              <h5>请求参数:</h5>
              <pre>{{ JSON.stringify(log.params, null, 2) }}</pre>
            </div>
            <div class="log-section">
              <h5>响应数据:</h5>
              <pre>{{ JSON.stringify(log.response, null, 2) }}</pre>
            </div>
            <div class="log-actions">
              <button @click.stop="copyLog(log)">复制</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## 🔧 集成方案

### 1. 全局组件注册
```javascript
// main.js
import DebugIcon from '@/components/DebugIcon.vue';
import util from '@/assets/util';

// 只在飞书环境下注册调试组件
if (util.isFeishuEnv()) {
  Vue.component('DebugIcon', DebugIcon);
}
```

### 2. 布局文件集成
```vue
<!-- App.vue 或 Layout.vue -->
<template>
  <div id="app">
    <!-- 主要内容 -->
    <router-view />
    
    <!-- 调试组件 - 全局显示 -->
    <DebugIcon v-if="isFeishuEnv" />
  </div>
</template>

<script>
import util from '@/assets/util';

export default {
  data() {
    return {
      isFeishuEnv: util.isFeishuEnv()
    }
  }
}
</script>
```

### 3. 请求工具修改
```javascript
// assets/util.js - request方法修改
request(options) {
  const startTime = Date.now();
  options._startTime = startTime;
  
  return new Promise((resolve, reject) => {
    // 原有请求逻辑...
    
    // 成功回调
    const onSuccess = (result) => {
      // 记录调试信息
      if (util.isFeishuEnv()) {
        this.logRequest(options, result);
      }
      resolve(result);
    };
    
    // 失败回调
    const onError = (error) => {
      // 记录调试信息
      if (util.isFeishuEnv()) {
        this.logRequest(options, null, error);
      }
      reject(error);
    };
    
    // 执行请求...
  });
},

logRequest(config, response, error = null) {
  // 调用拦截器记录日志
  import('@/utils/request-interceptor').then(({ interceptRequest }) => {
    interceptRequest(config, response, error);
  });
}
```

---

## 📱 交互流程

### 正常使用流程
```
1. 用户在飞书中访问认证页面
2. 右下角自动显示调试图标 🐛
3. 页面发起接口请求时，图标显示未读数量
4. 点击图标打开调试面板
5. 查看接口请求详情
6. 即使跳转到首页，图标和历史记录依然保留
```

### 问题排查流程
```
1. 发现异常行为（如未绑定用户跳转首页）
2. 点击调试图标查看接口记录
3. 筛选认证相关接口
4. 查看 /api/user/fsreglogin 的请求和响应
5. 复制异常数据发送给开发团队
6. 一键导出完整调试日志
```

---

## 🔒 安全考虑

### 数据保护
- 敏感字段脱敏显示（如手机号显示为 138****8888）
- 密码字段完全隐藏
- 用户openID只显示前后4位

### 环境限制
```javascript
// 严格的环境检测
const shouldShowDebug = () => {
  return util.isFeishuEnv() && 
         (process.env.NODE_ENV !== 'production' || 
          window.location.hostname.includes('test') ||
          localStorage.getItem('enable_debug') === 'true');
}
```

---

## 🎨 样式设计

### CSS实现
```css
.debug-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.debug-icon {
  width: 50px;
  height: 50px;
  background: rgba(0, 123, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.debug-icon:hover {
  transform: scale(1.1);
  background: rgba(0, 123, 255, 0.9);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
}

.debug-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #e9ecef;
}
```

---

## 📊 功能优先级

### MVP版本（必须实现）
- [x] 飞书环境检测和图标显示
- [x] 接口请求记录
- [x] 基础调试面板
- [x] 数据查看和复制

### 增强版本（可选实现）  
- [ ] 数据筛选和搜索
- [ ] 导出功能
- [ ] 敏感数据脱敏
- [ ] 性能统计
- [ ] 自定义快捷键

---

## 🚀 实施建议

### 分阶段实现
1. **第一阶段**: 创建基础调试组件和状态管理
2. **第二阶段**: 修改util.request集成调试功能
3. **第三阶段**: 完善UI交互和数据展示
4. **第四阶段**: 添加高级功能和优化

### 测试验证
- 在飞书环境下测试图标显示
- 验证接口请求记录功能
- 测试页面跳转后数据持久化
- 确认非飞书环境下不显示

这个方案可以有效帮助排查线上问题，特别是你提到的"未绑定用户跳转首页"的问题，通过查看接口返回数据可以快速定位根本原因。