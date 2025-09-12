# 轻量级飞书认证调试方案

## 💡 设计思路

**核心原则**: 最小改动，最大效果
- 只在 `feishu/auth.vue` 页面添加调试功能
- 复用现有接口请求逻辑，无需修改 `util.js`
- 使用 localStorage 持久化调试信息
- 跳转到首页后仍可查看调试记录

## 🏗️ 技术方案

### 1. 调试信息管理工具

```javascript
// utils/feishu-debug.js - 专门用于飞书认证调试
class FeishuDebug {
  constructor() {
    this.storageKey = 'feishu_auth_debug';
    this.maxLogs = 20;
  }
  
  // 记录API调用
  logApi(type, url, params, response, error = null) {
    if (!this.shouldLog()) return;
    
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type: type, // 'request' | 'response' | 'error'
      method: 'POST',
      url: url,
      params: this.sanitize(params),
      response: this.sanitize(response),
      error: error ? this.sanitize(error) : null,
      status: error ? 'error' : 'success'
    };
    
    this.saveLogs(log);
  }
  
  // 记录页面事件
  logEvent(event, data = {}) {
    if (!this.shouldLog()) return;
    
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type: 'event',
      event: event,
      data: this.sanitize(data),
      status: 'info'
    };
    
    this.saveLogs(log);
  }
  
  // 是否需要记录日志
  shouldLog() {
    return this.isFeishuEnv() && this.isDebugEnabled();
  }
  
  // 检查飞书环境
  isFeishuEnv() {
    return /micromessenger|feishu|lark/i.test(navigator.userAgent) ||
           window.location.search.includes('feishu=1');
  }
  
  // 检查是否启用调试
  isDebugEnabled() {
    return localStorage.getItem('feishu_debug_enabled') === 'true' ||
           window.location.search.includes('debug=1') ||
           process.env.NODE_ENV !== 'production';
  }
  
  // 数据脱敏
  sanitize(data) {
    if (!data) return data;
    
    const cloned = JSON.parse(JSON.stringify(data));
    this.maskSensitive(cloned);
    return cloned;
  }
  
  // 敏感信息掩码
  maskSensitive(obj) {
    if (typeof obj !== 'object') return;
    
    const sensitiveKeys = ['openID', 'userPin', 'mobile', 'code'];
    
    for (const key in obj) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        if (typeof obj[key] === 'string' && obj[key].length > 6) {
          obj[key] = obj[key].substring(0, 3) + '***' + obj[key].substring(obj[key].length - 3);
        }
      } else if (typeof obj[key] === 'object') {
        this.maskSensitive(obj[key]);
      }
    }
  }
  
  // 保存日志
  saveLogs(newLog) {
    try {
      let logs = this.getLogs();
      logs.unshift(newLog);
      
      // 限制数量
      if (logs.length > this.maxLogs) {
        logs = logs.slice(0, this.maxLogs);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify({
        version: '1.0',
        timestamp: new Date().toISOString(),
        logs: logs
      }));
    } catch (e) {
      console.warn('保存调试日志失败:', e);
    }
  }
  
  // 获取日志
  getLogs() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return data.logs || [];
      }
    } catch (e) {
      console.warn('读取调试日志失败:', e);
    }
    return [];
  }
  
  // 清空日志
  clearLogs() {
    localStorage.removeItem(this.storageKey);
  }
  
  // 获取统计信息
  getStats() {
    const logs = this.getLogs();
    return {
      total: logs.length,
      errors: logs.filter(log => log.status === 'error').length,
      apis: logs.filter(log => log.type === 'response' || log.type === 'error').length,
      events: logs.filter(log => log.type === 'event').length,
      lastUpdate: logs.length > 0 ? logs[0].timestamp : null
    };
  }
  
  // 导出日志
  export() {
    const data = {
      export_time: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      logs: this.getLogs()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feishu-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export default new FeishuDebug();
```

### 2. 简单调试面板组件

```vue
<!-- components/FeishuDebugPanel.vue -->
<template>
  <div v-if="shouldShow" class="feishu-debug">
    <!-- 浮动图标 -->
    <div 
      class="debug-icon" 
      @click="togglePanel"
      :class="{ 'has-error': stats.errors > 0 }"
    >
      🐛
      <span v-if="stats.total > 0" class="badge">{{ stats.total }}</span>
    </div>
    
    <!-- 调试面板 -->
    <div v-if="showPanel" class="debug-panel">
      <div class="panel-header">
        <h4>🔍 飞书认证调试</h4>
        <div>
          <button @click="exportLogs" title="导出">📋</button>
          <button @click="clearLogs" title="清空">🗑️</button>
          <button @click="closePanel" title="关闭">×</button>
        </div>
      </div>
      
      <div class="panel-stats">
        总计: {{ stats.total }} | 错误: {{ stats.errors }} | 更新: {{ stats.lastUpdate }}
      </div>
      
      <div class="panel-content">
        <div v-if="logs.length === 0" class="empty">暂无调试记录</div>
        
        <div 
          v-for="log in logs" 
          :key="log.id"
          class="log-item"
          :class="{ error: log.status === 'error', event: log.type === 'event' }"
          @click="toggleDetails(log.id)"
        >
          <div class="log-summary">
            <span class="time">{{ log.timestamp }}</span>
            <span class="type">{{ getLogTypeLabel(log) }}</span>
            <span class="status" :class="log.status">
              {{ log.status === 'error' ? '❌' : log.type === 'event' ? 'ℹ️' : '✅' }}
            </span>
          </div>
          
          <div v-if="expandedLogs.has(log.id)" class="log-details">
            <div v-if="log.url" class="detail-section">
              <strong>接口:</strong> {{ log.url }}
            </div>
            
            <div v-if="log.params" class="detail-section">
              <strong>参数:</strong>
              <pre>{{ JSON.stringify(log.params, null, 2) }}</pre>
            </div>
            
            <div v-if="log.response" class="detail-section">
              <strong>响应:</strong>
              <pre>{{ JSON.stringify(log.response, null, 2) }}</pre>
            </div>
            
            <div v-if="log.error" class="detail-section">
              <strong>错误:</strong>
              <pre class="error-text">{{ JSON.stringify(log.error, null, 2) }}</pre>
            </div>
            
            <div v-if="log.event" class="detail-section">
              <strong>事件:</strong> {{ log.event }}
              <pre v-if="log.data">{{ JSON.stringify(log.data, null, 2) }}</pre>
            </div>
            
            <button @click.stop="copyLog(log)" class="copy-btn">📋 复制</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeishuDebug from '@/utils/feishu-debug'

export default {
  name: 'FeishuDebugPanel',
  
  data() {
    return {
      showPanel: false,
      expandedLogs: new Set(),
      refreshTimer: null
    }
  },
  
  computed: {
    shouldShow() {
      return FeishuDebug.shouldLog()
    },
    
    logs() {
      return FeishuDebug.getLogs()
    },
    
    stats() {
      return FeishuDebug.getStats()
    }
  },
  
  mounted() {
    // 定时刷新统计信息
    this.refreshTimer = setInterval(() => {
      this.$forceUpdate()
    }, 1000)
  },
  
  beforeDestroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  
  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    
    closePanel() {
      this.showPanel = false
    },
    
    toggleDetails(logId) {
      if (this.expandedLogs.has(logId)) {
        this.expandedLogs.delete(logId)
      } else {
        this.expandedLogs.add(logId)
      }
    },
    
    getLogTypeLabel(log) {
      if (log.type === 'event') return `事件: ${log.event}`
      if (log.url) return log.url.split('/').pop()
      return log.type
    },
    
    copyLog(log) {
      const text = JSON.stringify(log, null, 2)
      this.copyToClipboard(text)
      this.showToast('已复制到剪贴板')
    },
    
    copyToClipboard(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    },
    
    showToast(message) {
      // 简单toast提示
      const toast = document.createElement('div')
      toast.textContent = message
      toast.style.cssText = `
        position: fixed; top: 50px; right: 20px; z-index: 10001;
        background: rgba(0,0,0,0.8); color: white; padding: 8px 16px;
        border-radius: 4px; font-size: 14px;
      `
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 2000)
    },
    
    clearLogs() {
      if (confirm('确定清空所有调试记录？')) {
        FeishuDebug.clearLogs()
        this.expandedLogs.clear()
      }
    },
    
    exportLogs() {
      FeishuDebug.export()
      this.showToast('日志已导出')
    }
  }
}
</script>

<style scoped>
.feishu-debug {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.debug-icon {
  width: 50px;
  height: 50px;
  background: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  font-size: 20px;
}

.debug-icon:hover {
  transform: scale(1.1);
}

.debug-icon.has-error {
  background: #dc3545;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #28a745;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 16px;
  text-align: center;
}

.debug-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  border: 1px solid #ddd;
  overflow: hidden;
}

.panel-header {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.panel-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  border-radius: 4px;
}

.panel-header button:hover {
  background: #e9ecef;
}

.panel-stats {
  padding: 8px 16px;
  background: #f1f3f4;
  font-size: 12px;
  color: #666;
  border-bottom: 1px solid #ddd;
}

.panel-content {
  max-height: 350px;
  overflow-y: auto;
}

.empty {
  padding: 40px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.log-item {
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.log-item:hover {
  background: #f8f9fa;
}

.log-item.error {
  border-left: 3px solid #dc3545;
}

.log-item.event {
  border-left: 3px solid #17a2b8;
}

.log-summary {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.time {
  color: #666;
  font-family: monospace;
  min-width: 80px;
}

.type {
  flex: 1;
  color: #333;
}

.status.error { color: #dc3545; }
.status.success { color: #28a745; }
.status.info { color: #17a2b8; }

.log-details {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.detail-section {
  margin-bottom: 8px;
}

.detail-section strong {
  color: #333;
  font-size: 12px;
}

pre {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  margin: 4px 0;
  font-size: 11px;
  max-height: 100px;
  overflow: auto;
}

.error-text {
  color: #dc3545;
}

.copy-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.copy-btn:hover {
  background: #0056b3;
}

@media (max-width: 480px) {
  .debug-panel {
    width: calc(100vw - 40px);
    right: -10px;
  }
}
</style>
```

### 3. 在 feishu/auth.vue 中的集成方案

```vue
<!-- 在现有 feishu/auth.vue 中添加 -->
<template>
  <div class="feishu-auth-container">
    <!-- 现有内容 -->
    
    <!-- 调试面板 -->
    <FeishuDebugPanel />
  </div>
</template>

<script>
// 现有import
import FeishuDebugPanel from '@/components/FeishuDebugPanel.vue'
import FeishuDebug from '@/utils/feishu-debug'

export default {
  components: {
    // 现有组件
    FeishuDebugPanel
  },
  
  // 在现有methods中添加调试相关方法
  methods: {
    // 包装现有的util.request调用
    async debugRequest(url, options = {}) {
      const startTime = Date.now()
      
      // 记录请求开始
      FeishuDebug.logApi('request', url, options.data || options.params)
      
      try {
        const result = await util.request({
          url,
          ...options
        })
        
        // 记录成功响应
        FeishuDebug.logApi('response', url, options.data || options.params, result)
        
        return result
      } catch (error) {
        // 记录错误
        FeishuDebug.logApi('error', url, options.data || options.params, null, {
          message: error.message,
          status: error.status
        })
        throw error
      }
    },
    
    // 现有方法中替换util.request调用
    async getOpenID() {
      // 记录页面事件
      FeishuDebug.logEvent('getOpenID_start', { 
        hasCode: !!this.code,
        isFeishuEnv: this.isFeishuEnv 
      })
      
      // 如果没有code，尝试通过SDK获取
      if (!this.code) {
        if (!this.isFeishuEnv) {
          throw new Error('非飞书环境，无法通过SDK获取授权码');
        }
        
        if (!window.tt || !window.tt.requestAccess) {
          throw new Error('飞书SDK未就绪');
        }
        
        await this.getAuthCodeFromJSAPI();
      }
      
      if (!this.code) {
        throw new Error('无法获取到有效的授权码');
      }
      
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API调用超时，请检查网络或联系管理员'));
          }, 30000);
        });
        
        // 使用调试版本的请求
        const apiPromise = this.debugRequest('/api/isv/feishu/getuserinfo', {
          method: 'POST',
          data: { code: this.code },
          fail: () => {},
          error: () => {}
        });
        
        const result = await Promise.race([apiPromise, timeoutPromise]);
      
        if (result && result.errno === 0 && result.data) {
          this.openID = result.data.openID || result.data.open_id;
          this.userPin = result.data.userPin;
          
          FeishuDebug.logEvent('getOpenID_success', { 
            hasOpenID: !!this.openID,
            hasUserPin: !!this.userPin
          })
        } else {
          this.openID = '';
          this.userPin = '';
          
          FeishuDebug.logEvent('getOpenID_empty', { 
            result: result
          })
        }
      } catch (error) {
        FeishuDebug.logEvent('getOpenID_error', { 
          error: error.message
        })
        throw error;
      }
    },
    
    // 类似地修改其他API调用方法...
  }
}
</script>
```

## 🚀 使用方案

### 启用调试
```javascript
// 方式1: localStorage启用
localStorage.setItem('feishu_debug_enabled', 'true')

// 方式2: URL参数启用  
https://your-app.com/feishu/auth?debug=1

// 方式3: 开发环境自动启用
```

### 查看调试信息
1. 在认证页面右下角会出现 🐛 图标
2. 点击图标查看详细的接口调用记录
3. 跳转到首页后图标依然存在，可以查看之前的调试记录

## 💡 优势

1. **改动最小**: 只需要添加2个文件 + 修改1个页面
2. **针对性强**: 专门针对飞书认证问题
3. **持久化**: 使用localStorage，页面刷新/跳转后数据不丢失
4. **易于使用**: 一键导出调试日志，方便问题排查

这个方案如何？还有什么需要调整的地方吗？