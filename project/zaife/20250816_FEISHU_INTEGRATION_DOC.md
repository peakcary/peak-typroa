# 飞书免登录集成开发文档

## 项目概述
自在招聘平台飞书免登录功能开发，实现用户通过飞书应用无感登录。

## 当前状态
✅ **SDK加载**: 在飞书应用中已成功加载  
❌ **授权码获取**: `tt.requestAuthCode()` 尚未成功调用  
❌ **用户登录**: 完整流程待验证  

---

## 核心文件改动

### 1. `/views/head.html` - SDK引入
**改动**: 引入飞书JSAPI SDK
```html
<script src="https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.42.js" type="text/javascript"></script>
<script>
// SDK检测和调试代码
console.log('开始检测飞书SDK');
// ... 详细检测逻辑
</script>
```

### 2. `/client/src/pages/feishu/auth.vue` - 主要认证逻辑
**新增功能**:
- 详细的SDK状态检测
- JSAPI授权码获取
- 环境判断（飞书 vs 浏览器）
- 完整的错误处理和调试信息

**关键方法**:
```javascript
// SDK检测
async waitForFeishuSDK()

// 通过JSAPI获取授权码  
async getAuthCodeFromJSAPI()

// 获取用户OpenID
async getOpenID()
```

### 3. `/client/src/common/feishuAuth.js` - 工具函数
**功能**: 错误码映射、参数验证、工具类等

---

## 技术实现逻辑

### 1. SDK加载策略
```
浏览器环境 → SDK无法加载 → 提示用户在飞书中打开
飞书环境 → SDK正常加载 → 继续认证流程
```

### 2. 授权码获取流程
```
检查URL参数code → 存在则使用
↓ (不存在)
检查飞书环境 → 非飞书环境则报错
↓ (飞书环境)
检查SDK状态 → SDK未就绪则报错  
↓ (SDK就绪)
调用tt.requestAuthCode() → 获取授权码
↓
使用授权码获取OpenID → 完成登录
```

### 3. 调试信息设计
页面显示详细调试信息:
- SDK状态 (已加载/未加载)
- 授权码状态 (已获取/未获取) 
- OpenID状态 (已获取/未获取)
- 用户代理信息
- 错误详情和API响应

---

## 当前问题诊断

### 问题现象
- SDK已加载 ✅
- 授权码未获取 ❌  
- Code来源显示"未知"

### 可能原因
1. `getOpenID()` 方法未被调用
2. `tt.requestAuthCode()` 调用失败
3. 飞书应用权限配置问题
4. AppID配置问题

### 下次排查步骤
1. **检查控制台日志**:
   ```
   "=== getOpenID 方法开始执行 ==="
   "是否在飞书环境: true"  
   "开始通过JSAPI获取授权码"
   ```

2. **手动测试SDK**:
   ```javascript
   window.tt.requestAuthCode({
     success: (res) => console.log('测试成功:', res),
     fail: (err) => console.error('测试失败:', err)
   });
   ```

3. **检查飞书应用配置**:
   - 重定向URL设置
   - AppID权限配置
   - JSAPI权限列表

---

## 可删除的文件

### 测试和调试文件
以下文件仅用于开发调试，发布时可考虑删除:

1. `/client/public/debug-feishu.html` - 飞书调试页面
2. `/client/public/test-feishu-simple.html` - 简单测试页面  
3. `/client/src/pages/feishu/debug.vue` - 调试组件
4. `/client/src/pages/feishu/test.vue` - 测试组件

### 建议保留
- `/client/src/pages/feishu/auth.vue` - 核心认证页面 ⚠️
- `/client/src/common/feishuAuth.js` - 工具函数 ⚠️
- `/views/head.html` - SDK引入 ⚠️

---

## 部署检查清单

### 发布前确认
- [ ] 移除不必要的调试文件
- [ ] 确认飞书AppID配置正确
- [ ] 确认重定向URL配置正确  
- [ ] 测试在飞书应用中的访问

### 环境变量检查
```javascript
// 检查这些配置是否正确
appId: 'cli_a80e6f280e3b500c'  // 从URL参数获取
redirectUrl: 当前页面URL
```

---

## 继续开发提示

下次沟通时，请提供:
1. **飞书应用控制台的完整日志**
2. **手动测试SDK的结果** 
3. **飞书应用的配置截图**
4. **当前错误的详细截图**

这样可以快速定位 `tt.requestAuthCode()` 未成功调用的根本原因。

---

## 技术栈和依赖

### 前端
- Vue 3.4.27
- Element Plus 2.8.8
- Vite 4.5.3

### 飞书SDK
- h5-js-sdk-1.5.42.js
- 来源: `https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.42.js`

### 关键API接口
- `/api/isv/feishu/getuserinfo` - 通过code获取用户OpenID
- `/api/user/fsreglogin` - 飞书用户登录/注册

---

## 错误码参考

```javascript
FEISHU_ERROR_CODES = {
  3001: '账号未注册 - 需要绑定手机号',
  3002: '授权失败 - openID无效', 
  3003: '绑定失败 - 验证码错误',
  3004: '授权码无效 - 需重新获取',
  3005: '网络错误 - 连接异常',
  3006: '手机号已绑定 - 使用其他手机号',
  3007: '验证码错误 - 重新获取验证码'
}
```

---

## 后续优化方向
1. 简化调试信息（生产环境）
2. 添加更多错误场景处理
3. 完善用户体验提示
4. 考虑添加重试机制
5. 性能优化和代码精简

---

**文档版本**: v1.0  
**更新时间**: 2025-08-15  
**维护人**: Claude Assistant  