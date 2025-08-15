# 飞书免登集成指南

## 🎯 静态页面解决方案

### 📍 访问地址
```
http://localhost:8058/feishu-auth.html
```

## 🔧 飞书平台配置

### 1. 重定向URI设置
在飞书开放平台中，将**重定向URI**设置为：
```
http://your-domain.com/feishu-auth.html
```

### 2. 授权码传递方式

飞书的授权码传递通常有以下几种方式：

#### 方式一：URL参数（测试用）
```
http://your-domain.com/feishu-auth.html?code=AUTH_CODE&state=STATE
```

#### 方式二：POST表单数据
飞书服务器会向你的重定向URI发送POST请求，包含：
```json
{
  "code": "AUTH_CODE",
  "state": "STATE"
}
```

#### 方式三：JavaScript SDK回调
如果使用飞书JS SDK，会通过回调函数传递授权码。

## 🧪 测试方法

### 1. 基础功能测试
```
http://localhost:8058/feishu-auth.html
```
- 应显示授权码输入界面

### 2. 带参数测试
```
http://localhost:8058/feishu-auth.html?code=test123&redirectUrl=/user
```
- 应直接进入认证流程

### 3. 完整流程测试
```
http://localhost:8058/feishu-auth.html?code=REAL_AUTH_CODE
```
- 使用真实的飞书授权码测试

## 🔄 集成步骤

### 第一步：配置飞书应用
1. 登录飞书开放平台
2. 创建或编辑应用
3. 设置重定向URI为：`http://your-domain.com/feishu-auth.html`
4. 获取 App ID 和 App Secret

### 第二步：测试静态页面
1. 访问 `http://localhost:8058/feishu-auth.html`
2. 手动输入测试授权码
3. 验证API调用是否正常

### 第三步：真实环境测试
1. 在飞书应用中触发授权
2. 验证是否跳转到静态页面
3. 检查授权码是否正确传递

## 📝 后端API要求

确保以下API端点可用：

### 1. 获取用户信息
```
POST /api/isv/feishu/getuserinfo
Body: { "code": "AUTH_CODE" }
```

### 2. 免登接口
```
POST /api/user/fsreglogin  
Body: { "openID": "USER_OPEN_ID" }
```

### 3. 获取验证码
```
POST /api/user/getreglogincode
Body: { "mobile": "PHONE_NUMBER" }
```

## 🎉 优势

✅ **完全绕过Vue路由问题**  
✅ **独立部署，无依赖**  
✅ **可以直接在飞书中使用**  
✅ **支持所有飞书授权方式**  
✅ **完整的用户体验**  

## 🔧 自定义配置

如果需要修改页面样式或逻辑，可以直接编辑：
```
/Users/peakom/Documents/work/zai-fe/client/public/feishu-auth.html
```

## 📞 技术支持

如果遇到问题，请检查：
1. 飞书平台配置是否正确
2. 后端API是否正常响应
3. 浏览器控制台是否有错误信息
4. 网络请求是否成功