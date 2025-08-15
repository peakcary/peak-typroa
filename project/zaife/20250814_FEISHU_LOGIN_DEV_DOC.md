# 飞书免登功能开发文档

## 1. 功能概述

### 1.1 目标
为自在招聘系统集成飞书应用免登功能，实现飞书用户无缝登录体验。

### 1.2 核心流程
1. 用户从飞书应用跳转到系统
2. 系统自动获取用户 openID
3. 检查登录态，未登录则调用免登接口
4. 如果用户未注册，引导用户绑定手机号
5. 登录成功后跳转到目标页面

## 2. 技术架构

### 2.1 页面设计
- **路由**: `/user/feishu-auth`
- **组件**: `FeishuAuth.vue`
- **功能**: 中转登录页面，处理飞书免登逻辑

### 2.2 API接口
- **登录接口**: `/api/user/fsreglogin`
- **用户信息接口**: `/api/isv/feishu/getuserinfo`

### 2.3 参数设计

#### 2.3.1 `/api/user/fsreglogin` 参数
```javascript
// 首次登录
{
  openID: "string", // 飞书用户 openID (必填)
}

// 绑定手机号后登录
{
  openID: "string",      // 飞书用户 openID (必填)
  isBinding: 1,          // 绑定标识 (必填)
  mobile: "string",      // 手机号 (必填)
  code: "string",        // 验证码 (必填)
  referrerPin: "string"  // 邀请码 (可选)
}
```

#### 2.3.2 `/api/isv/feishu/getuserinfo` 参数
```javascript
{
  code: "string" // 飞书应用授权码
}
```

### 2.4 错误码定义
```javascript
// 自定义飞书相关错误码
const FEISHU_ERROR_CODES = {
  USER_NOT_EXISTS: 3001,    // 飞书用户不存在
  INVALID_OPEN_ID: 3002,    // openID无效
  BINDING_FAILED: 3003,     // 绑定失败
  AUTH_CODE_INVALID: 3004,  // 授权码无效
  NETWORK_ERROR: 3005       // 网络错误
}
```

## 3. 业务流程

### 3.1 完整流程图
```
飞书应用 -> 中转页面 -> 检查登录态
    |           |
    |           v
    |      已登录? -> 是 -> 跳转目标页面
    |           |
    |           否
    |           v
    |      获取openID -> 调用免登接口
    |           |
    |           v
    |      用户存在? -> 是 -> 登录成功 -> 跳转目标页面
    |           |
    |           否
    |           v
    |      显示绑定表单 -> 用户填写手机号+验证码
    |           |
    |           v
    |      调用绑定接口 -> 绑定成功 -> 跳转目标页面
```

### 3.2 状态管理
```javascript
const authStates = {
  LOADING: 'loading',           // 加载中
  CHECKING_LOGIN: 'checking',   // 检查登录态
  NEED_BINDING: 'needBinding',  // 需要绑定
  BINDING: 'binding',           // 绑定中
  SUCCESS: 'success',           // 成功
  ERROR: 'error'                // 错误
}
```

## 4. 安全考虑

### 4.1 参数校验
- openID 格式验证
- 手机号格式验证
- 验证码有效性检查

### 4.2 防护措施
- 防重复提交
- Session 劫持防护
- CSRF 防护

### 4.3 错误处理
- 网络异常重试机制
- 用户友好错误提示
- 日志记录

## 5. 用户体验设计

### 5.1 Loading 状态
- 骨架屏展示
- 进度指示器
- 状态文字提示

### 5.2 错误处理
- 友好错误页面
- 重试机制
- 客服联系方式

### 5.3 页面跳转
- 保持原始目标地址
- 平滑过渡动画
- 返回机制

## 6. 开发计划

### 6.1 Phase 1: 基础页面创建
- [ ] 创建 `FeishuAuth.vue` 组件
- [ ] 添加路由配置
- [ ] 基础页面结构

### 6.2 Phase 2: 核心逻辑实现
- [ ] 登录态检查
- [ ] openID 获取
- [ ] 免登接口调用
- [ ] 绑定逻辑实现

### 6.3 Phase 3: 体验优化
- [ ] Loading 状态设计
- [ ] 错误处理完善
- [ ] 动画效果
- [ ] 响应式适配

### 6.4 Phase 4: 测试与优化
- [ ] 功能测试
- [ ] 边界情况测试
- [ ] 性能优化
- [ ] 代码审查

## 7. 测试用例

### 7.1 正常流程测试
1. 已登录用户直接跳转
2. 未登录但已注册用户免登成功
3. 未注册用户绑定手机号成功

### 7.2 异常流程测试
1. 网络异常处理
2. openID 无效处理
3. 验证码错误处理
4. 手机号已被绑定处理

### 7.3 边界情况测试
1. 并发请求处理
2. 页面刷新处理
3. 浏览器兼容性
4. 移动端适配

## 8. 部署说明

### 8.1 环境要求
- Node.js 版本兼容
- 飞书应用配置完成
- 后端 API 接口就绪

### 8.2 配置项
```javascript
// 飞书相关配置
const feishuConfig = {
  appId: 'your_app_id',
  redirectUri: 'your_redirect_uri',
  scope: 'contact:user.base:readonly'
}
```

### 8.3 监控指标
- 登录成功率
- 绑定成功率
- 错误率统计
- 页面加载时间

---

**开发负责人**: [开发者姓名]  
**文档版本**: v1.0  
**最后更新**: 2025-08-14