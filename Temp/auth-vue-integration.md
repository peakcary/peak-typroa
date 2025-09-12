# auth.vue 调试功能集成方案

## 🎯 目标
监控 `client/src/pages/feishu/auth.vue` 页面的所有接口请求和返回，包括：
- `/api/isv/feishu/getappid` - 获取应用ID
- `/api/isv/feishu/getuserinfo` - 获取用户信息  
- `/api/user/fsreglogin` - 自动登录/绑定
- `/api/user/getreglogincode` - 发送验证码

## 📝 集成代码

### 1. 在 auth.vue 中添加调试功能

```vue
<template>
  <div class="feishu-auth-container">
    <!-- 现有内容保持不变 -->
    
    <!-- 添加调试面板 -->
    <FeishuDebugPanel v-if="showDebugPanel" />
  </div>
</template>

<script>
// 现有imports...
import FeishuDebug from '@/utils/feishu-debug'
import FeishuDebugPanel from '@/components/FeishuDebugPanel.vue'

export default {
  name: 'FeishuAuthSimple',
  
  components: {
    // 现有组件...
    FeishuDebugPanel
  },
  
  data() {
    return {
      // 现有data...
      
      // 添加调试相关
      showDebugPanel: FeishuDebug.shouldLog()
    }
  },
  
  async created() {
    // 记录页面创建事件
    FeishuDebug.logEvent('page_created', {
      authState: this.authState,
      isFeishuEnv: this.isFeishuEnv
    })
    
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const urlCode = urlParams.get('code')
      if (urlCode) {
        this.code = urlCode
        FeishuDebug.logEvent('code_from_url', { code: '***' + urlCode.slice(-4) })
      }
      
      const rp = urlParams.get('rp')
      if (rp) {
        // 邀请码功能已暂时禁用的相关代码...
        FeishuDebug.logEvent('referrer_pin_found', { rp: '***' })
      }
      
      try {
        await this.waitForFeishuSDK()
        FeishuDebug.logEvent('sdk_ready')
      } catch (error) {
        FeishuDebug.logEvent('sdk_error', { error: error.message })
        if (!this.isFeishuEnv) {
          this.handleError('环境异常', '请在飞书中打开此页面')
          return
        }
      }
      
      await this.startAuthFlow()
    } catch (error) {
      FeishuDebug.logEvent('init_error', { error: error.message })
      this.handleError('初始化失败', '页面初始化异常，请刷新重试')
    }
  },
  
  methods: {
    // 包装util.request，自动记录调试信息
    async debugRequest(url, options = {}) {
      // 记录请求开始
      const requestId = FeishuDebug.logApiRequest(url, options)
      
      try {
        const result = await util.request({
          url,
          ...options
        })
        
        // 记录成功响应
        FeishuDebug.logApiResponse(requestId, result)
        return result
        
      } catch (error) {
        // 记录失败响应
        FeishuDebug.logApiResponse(requestId, null, error)
        throw error
      }
    },
    
    // 修改现有方法，集成调试功能
    async waitForFeishuSDK() {
      FeishuDebug.logStep('wait_sdk_start')
      
      const { loadFeishuSDK } = await import('../../utils/feishu')
      const result = await loadFeishuSDK()
      
      FeishuDebug.logStep('wait_sdk_complete', { success: true })
      return result
    },
    
    async startAuthFlow() {
      FeishuDebug.logStep('auth_flow_start')
      
      try {
        this.authState = AUTH_STATES.CHECKING
        FeishuDebug.logStateChange('loading', 'checking')
        
        this.loadingText = '检查登录状态...'
        
        this.loadingText = '获取用户信息...'
        await this.getOpenID()
        
        await this.attemptLogin()
        
      } catch (error) {
        FeishuDebug.logStep('auth_flow_error', { error: error.message })
        
        if (error.message && error.message.includes('非飞书环境')) {
          this.handleError('环境异常', '请在飞书中打开此页面')
        } else if (error.message && error.message.includes('网络')) {
          this.handleError('网络异常', '请检查网络连接后重试')
        } else {
          this.authState = AUTH_STATES.NEED_BINDING
          FeishuDebug.logStateChange('checking', 'need_binding', { reason: 'auth_flow_error' })
        }
      }
    },
    
    async getOpenID() {
      FeishuDebug.logStep('get_openid_start', { hasCode: !!this.code })
      
      if (!this.code) {
        if (!this.isFeishuEnv) {
          throw new Error('非飞书环境，无法通过SDK获取授权码')
        }
        
        if (!window.tt || !window.tt.requestAccess) {
          throw new Error('飞书SDK未就绪')
        }
        
        await this.getAuthCodeFromJSAPI()
      }
      
      if (!this.code) {
        throw new Error('无法获取到有效的授权码')
      }
      
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API调用超时，请检查网络或联系管理员'))
          }, 30000)
        })
        
        // 使用调试版本的请求
        const apiPromise = this.debugRequest('/api/isv/feishu/getuserinfo', {
          method: 'POST',
          data: { code: this.code },
          fail: () => {},
          error: () => {}
        })
        
        const result = await Promise.race([apiPromise, timeoutPromise])
      
        if (result && result.errno === 0 && result.data) {
          this.openID = result.data.openID || result.data.open_id
          this.userPin = result.data.userPin
          
          FeishuDebug.logStep('get_openid_success', { 
            hasOpenID: !!this.openID,
            hasUserPin: !!this.userPin,
            errno: result.errno
          })
        } else {
          this.openID = ''
          this.userPin = ''
          
          FeishuDebug.logStep('get_openid_empty', { 
            errno: result?.errno,
            hasData: !!result?.data
          })
        }
      } catch (error) {
        FeishuDebug.logStep('get_openid_error', { error: error.message })
        throw error
      }
    },
    
    async getAuthCodeFromJSAPI() {
      FeishuDebug.logStep('get_auth_code_start')
      
      try {
        // 使用调试版本的请求获取appId
        const appIdResult = await this.debugRequest('/api/isv/feishu/getappid', {
          method: 'GET',
          fail: () => {},
          error: () => {}
        })
        
        if (!appIdResult || appIdResult.errno !== 0 || !appIdResult.data?.appId) {
          throw new Error('获取appId失败: ' + (appIdResult?.msg || '接口返回异常'))
        }
        
        FeishuDebug.logStep('get_appid_success', { 
          errno: appIdResult.errno,
          hasAppId: !!appIdResult.data?.appId
        })
        
        const { getFeishuAuthCode } = await import('../../utils/feishu')
        const code = await getFeishuAuthCode(appIdResult.data.appId)
        
        this.code = code
        FeishuDebug.logStep('get_auth_code_success', { hasCode: !!code })
        
        return code
        
      } catch (error) {
        FeishuDebug.logStep('get_auth_code_error', { error: error.message })
        throw new Error('获取飞书授权码失败: ' + error.message)
      }
    },
    
    async attemptLogin() {
      FeishuDebug.logStep('attempt_login_start', { hasOpenID: !!this.openID })
      
      if (this.openID) {
        this.loadingText = '检测到飞书身份，正在自动登录...'
        await this.attemptAutoLogin()
      } else {
        this.authState = AUTH_STATES.NEED_BINDING
        FeishuDebug.logStateChange('checking', 'need_binding', { reason: 'no_openid' })
      }
    },
    
    async attemptAutoLogin() {
      FeishuDebug.logStep('auto_login_start', { openID: this.openID ? '***' + this.openID.slice(-4) : null })
      
      try {
        const requestData = { 
          openID: this.openID
        }
        
        // 使用调试版本的请求
        const result = await this.debugRequest('/api/user/fsreglogin', {
          method: 'POST',
          data: requestData,
          fail: () => {},
          error: () => {}
        })
        
        if (result && result.errno === 0) {
          if (result.data && result.data.isLogin == 1) {
            this.authState = AUTH_STATES.SUCCESS
            FeishuDebug.logStateChange('checking', 'success')
            FeishuDebug.logStep('auto_login_success', { 
              isLogin: result.data.isLogin,
              errno: result.errno
            })
            
            this.loadingText = '自动登录成功，正在跳转...'
            
            setTimeout(() => {
              FeishuDebug.logEvent('redirect_to_home')
              window.location.href = '/'
            }, 1000)
          } else {
            this.authState = AUTH_STATES.NEED_BINDING
            FeishuDebug.logStateChange('checking', 'need_binding', { 
              reason: 'isLogin_not_1',
              isLogin: result.data?.isLogin
            })
          }
        } else {
          this.authState = AUTH_STATES.NEED_BINDING
          FeishuDebug.logStateChange('checking', 'need_binding', { 
            reason: 'errno_not_0',
            errno: result?.errno
          })
        }
      } catch (error) {
        this.authState = AUTH_STATES.NEED_BINDING
        FeishuDebug.logStateChange('checking', 'need_binding', { 
          reason: 'auto_login_error',
          error: error.message
        })
      }
    },
    
    async sendVerificationCode() {
      if (!this.canSendCode) {
        return
      }
      
      FeishuDebug.logStep('send_sms_start', { mobile: this.maskMobile(this.bindingForm.mobile) })
      
      try {
        this.isSendingCode = true
        this.countdown = 60
        
        // 使用调试版本的请求
        const result = await this.debugRequest('/api/user/getreglogincode', {
          method: 'POST',
          data: { 
            mobile: this.bindingForm.mobile 
          }
        })
        
        if (result && result.errno === 0) {
          this.startCountdown()
          FeishuDebug.logStep('send_sms_success', { errno: result.errno })
        } else {
          this.isSendingCode = false
          FeishuDebug.logStep('send_sms_failed', { 
            errno: result?.errno,
            msg: result?.msg
          })
          this.handleError('发送验证码失败', result?.msg || '请稍后重试')
        }
        
      } catch (error) {
        this.isSendingCode = false
        FeishuDebug.logStep('send_sms_error', { error: error.message })
        this.handleError('发送验证码失败', error.message || '网络错误，请稍后重试')
      }
    },
    
    async handleBinding() {
      if (!this.canSubmit) {
        return
      }
      
      FeishuDebug.logStep('binding_start', {
        mobile: this.maskMobile(this.bindingForm.mobile),
        hasCode: !!this.bindingForm.code,
        hasOpenID: !!this.openID
      })
      
      try {
        this.authState = AUTH_STATES.BINDING
        FeishuDebug.logStateChange('need_binding', 'binding')
        
        const bindingData = {
          openID: this.openID,
          isBinding: "1",
          mobile: this.bindingForm.mobile,
          code: this.bindingForm.code,
          referrerPin: this.bindingForm.referrerPin || ''
        }
        
        // 使用调试版本的请求
        const result = await this.debugRequest('/api/user/fsreglogin', {
          method: 'POST',
          data: bindingData
        })
        
        if (result && result.errno === 0) {
          if (result.data && result.data.isLogin == 1) {
            this.authState = AUTH_STATES.SUCCESS
            FeishuDebug.logStateChange('binding', 'success')
            FeishuDebug.logStep('binding_success', {
              isLogin: result.data.isLogin,
              errno: result.errno
            })
            
            this.loadingText = '绑定成功，正在跳转...'
            
            setTimeout(() => {
              FeishuDebug.logEvent('redirect_to_home_after_binding')
              window.location.href = '/'
            }, 1000)
          } else {
            this.authState = AUTH_STATES.NEED_BINDING
            FeishuDebug.logStep('binding_failed', { 
              isLogin: result.data?.isLogin,
              reason: 'isLogin_not_1'
            })
            this.handleError('绑定失败', '绑定成功但登录状态异常，请重试')
          }
        } else {
          this.authState = AUTH_STATES.NEED_BINDING
          FeishuDebug.logStep('binding_failed', { 
            errno: result?.errno,
            msg: result?.msg,
            reason: 'errno_not_0'
          })
          this.handleError('绑定失败', result?.msg || '请稍后重试')
        }
        
      } catch (error) {
        FeishuDebug.logStep('binding_error', { error: error.message })
        this.handleError('绑定失败', error.message || '网络错误，请稍后重试')
      }
    },
    
    handleError(title, message) {
      this.authState = AUTH_STATES.ERROR
      this.errorTitle = title
      this.errorMessage = message
      
      FeishuDebug.logStateChange(this.authState, 'error', {
        title: title,
        message: message
      })
    },
    
    handleRetry() {
      FeishuDebug.logEvent('user_retry')
      this.authState = AUTH_STATES.LOADING
      this.loadingText = '正在重新验证...'
      this.startAuthFlow()
    },
    
    // 辅助方法：手机号掩码
    maskMobile(mobile) {
      if (!mobile || mobile.length < 7) return mobile
      return mobile.substring(0, 3) + '****' + mobile.substring(mobile.length - 4)
    }
    
    // 现有其他方法保持不变...
  }
}
</script>
```

## 🔍 调试功能说明

### 自动记录的信息
1. **页面生命周期**：页面创建、SDK准备、认证流程开始
2. **所有API调用**：请求参数、响应数据、错误信息
3. **状态变更**：每次authState变化都会被记录
4. **关键步骤**：获取openID、自动登录、绑定等每个步骤
5. **用户操作**：重试、发送验证码、提交绑定等

### 数据脱敏
- `openID`: 显示为 `ou_***abc123`
- `mobile`: 显示为 `138****1234`
- `code`: 显示为 `***`
- 其他敏感字段自动掩码处理

### 调试面板功能
- 📊 实时统计信息
- 📋 一键导出完整日志
- 🔍 按类型筛选记录
- 📱 响应式设计，移动端友好

这样集成后，你就可以完整地监控 `auth.vue` 页面的所有接口请求和返回了！