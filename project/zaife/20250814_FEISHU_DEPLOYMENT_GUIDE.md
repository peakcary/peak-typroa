# 飞书应用部署指南

## 目录
1. [当前实现逻辑分析](#当前实现逻辑分析)
2. [飞书应用配置](#飞书应用配置)
3. [部署流程](#部署流程)
4. [测试指南](#测试指南)
5. [SDK使用说明](#sdk使用说明)
6. [故障排除](#故障排除)

---

## 当前实现逻辑分析

### 🔍 实现方式
**本项目采用纯后端API调用方式，未引入飞书前端SDK**

### 📋 核心架构
```
飞书应用 → 获取授权码(code) → 前端中转页面 → 后端API处理 → 返回结果
```

### 🔧 技术实现
- **前端**: 纯Vue.js实现，无飞书SDK依赖
- **后端**: Node.js + Express API接口处理
- **认证流程**: 基于OAuth 2.0授权码模式
- **数据传输**: RESTful API + JSON格式

### 📂 关键文件
```
├── routes/api.js                    # API路由配置
├── model/api.js                     # API处理逻辑 
├── client/src/pages/user/
│   ├── feishuAuth.vue               # 免登主页面
│   └── feishuAuthTest.vue           # 测试页面
├── client/src/common/feishuAuth.js  # 工具函数
└── client/src/router/index.js       # 路由配置
```

---

## 飞书应用配置

### 1. 创建飞书应用

#### 步骤一：登录飞书开放平台
1. 访问 [飞书开放平台](https://open.feishu.cn)
2. 使用企业账号登录
3. 进入"应用管理"

#### 步骤二：创建网页应用
```bash
应用类型: 网页应用 (Web App)
应用名称: 自在招聘
应用描述: 人才招聘匹配平台
应用图标: 上传应用Logo
```

#### 步骤三：配置应用信息
```javascript
// 基础配置
{
  "app_name": "自在招聘",
  "app_type": "web_app",
  "app_description": "智能人才招聘匹配平台",
  "home_url": "https://yourdomain.com",
  "desktop_redirect_url": "https://yourdomain.com/user/feishu-auth",
  "mobile_redirect_url": "https://yourdomain.com/user/feishu-auth"
}
```

### 2. 配置重定向URL

#### 开发环境
```
http://localhost:3000/user/feishu-auth
http://localhost:5173/user/feishu-auth
```

#### 测试环境  
```
https://test.yourdomain.com/user/feishu-auth
```

#### 生产环境
```
https://yourdomain.com/user/feishu-auth
```

### 3. 获取应用凭证
```javascript
// 应用凭证 (需要安全保存)
{
  "app_id": "cli_xxxxxxxxx",
  "app_secret": "xxxxxxxxxxxxxxxx",
  "verification_token": "xxxxxxxxxxxxxxxx",
  "encrypt_key": "xxxxxxxxxxxxxxxx"  // 可选
}
```

### 4. 配置应用权限

#### 必需权限
```javascript
// 用户权限
[
  "contact:user.base:readonly",     // 获取用户基本信息
  "contact:user.id:readonly"        // 获取用户ID
]

// 应用权限
[
  "im:message",                     // 发送消息 (可选)
  "calendar:calendar"               // 日历权限 (可选)
]
```

### 5. 配置事件订阅 (可选)
```javascript
// 事件订阅URL配置
{
  "event_subscribe_url": "https://yourdomain.com/api/isv/feishu/eventsubscribe",
  "event_callback_url": "https://yourdomain.com/api/isv/feishu/eventcallback"
}
```

---

## 部署流程

### 1. 环境准备

#### 服务器要求
```bash
# 系统要求
OS: Linux (推荐 Ubuntu 20.04+)
CPU: 2核心以上
内存: 4GB以上
存储: 20GB以上

# 软件环境
Node.js: 18+
npm/pnpm: 最新版本
PM2: 进程管理
Nginx: 反向代理 (推荐)
```

#### 环境变量配置
```bash
# .env 文件配置
NODE_ENV=production
PORT=3000

# 飞书应用配置
FEISHU_APP_ID=cli_xxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxx
FEISHU_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxx
FEISHU_ENCRYPT_KEY=xxxxxxxxxxxxxxxx

# 其他配置
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost/dbname
```

### 2. 代码部署

#### 方法一：自动部署 (推荐)
```bash
# 使用项目内置脚本
npm run zf    # 生产环境
npm run zfd   # 开发环境
```

#### 方法二：手动部署
```bash
# 1. 拉取代码
git clone https://github.com/your-repo/zai-fe.git
cd zai-fe

# 2. 安装依赖
pnpm install

# 3. 构建前端
cd client
npm run build
cd ..

# 4. 启动服务
pm2 start go.js --name zai-fe -i max

# 5. 配置开机自启
pm2 startup
pm2 save
```

### 3. Nginx配置

#### 基础配置
```nginx
# /etc/nginx/sites-available/zai-fe
server {
    listen 80;
    server_name yourdomain.com;
    
    # HTTP to HTTPS redirect
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL证书配置
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # 前端静态文件
    location / {
        try_files $uri $uri/ @backend;
    }
    
    # API接口代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 后端兜底
    location @backend {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 启动Nginx
```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo nginx -s reload

# 启动服务
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 测试指南

### 1. 本地开发测试

#### 启动开发环境
```bash
# 方法一：同时启动前后端
npm run dev

# 方法二：分别启动
npm run dev:frontend   # 前端开发服务器
npm run dev:backend    # 后端开发服务器
```

#### 访问测试页面
```bash
# 测试页面
http://localhost:5173/user/feishu-auth-test

# 实际功能页面 (需要飞书授权码)
http://localhost:5173/user/feishu-auth?code=xxx&redirectUrl=/user
```

### 2. 功能测试

#### 测试用例1：正常登录流程
```javascript
// 测试参数
{
  "code": "有效的飞书授权码",
  "redirectUrl": "/user",
  "rp": "邀请码(可选)"
}

// 期望结果
// 1. 页面显示loading状态
// 2. 自动获取用户信息
// 3. 登录成功后跳转到指定页面
```

#### 测试用例2：新用户绑定
```javascript
// 测试场景：飞书用户首次使用
// 期望流程：
// 1. 检测到用户不存在
// 2. 显示绑定手机号表单
// 3. 用户填写手机号和验证码
// 4. 绑定成功后完成登录
```

#### 测试用例3：错误处理
```javascript
// 测试各种错误场景
const errorCases = [
  { code: "", error: "缺少授权码" },
  { code: "invalid", error: "无效授权码" },
  { code: "expired", error: "授权码过期" }
];
```

### 3. API接口测试

#### 使用测试页面
```bash
# 访问API测试界面
http://localhost:5173/user/feishu-auth-test

# 测试接口
- /api/isv/feishu/getuserinfo
- /api/user/fsreglogin  
- /api/user/getreglogincode
```

#### 使用cURL测试
```bash
# 获取用户信息
curl -X POST http://localhost:3000/api/isv/feishu/getuserinfo \
  -H "Content-Type: application/json" \
  -d '{"code": "your_auth_code"}'

# 飞书免登
curl -X POST http://localhost:3000/api/user/fsreglogin \
  -H "Content-Type: application/json" \
  -d '{"openID": "user_open_id"}'
```

### 4. 性能测试

#### 页面加载性能
```javascript
// 在浏览器控制台执行
performance.mark('start');
// 访问页面
performance.mark('end');
performance.measure('page_load', 'start', 'end');
console.log(performance.getEntriesByName('page_load'));
```

#### API响应性能
```bash
# 使用Apache Bench测试
ab -n 100 -c 10 http://localhost:3000/api/isv/feishu/getuserinfo

# 使用wrk测试
wrk -t12 -c400 -d30s http://localhost:3000/api/user/fsreglogin
```

---

## SDK使用说明

### 🚫 当前实现：无SDK依赖

#### 优点
- ✅ 轻量级，无额外依赖
- ✅ 完全控制认证流程  
- ✅ 易于调试和维护
- ✅ 跨平台兼容性好

#### 缺点
- ❌ 需要手动处理授权流程
- ❌ 缺少飞书官方功能支持
- ❌ 需要自己实现错误处理

### 📦 可选：引入飞书H5-SDK

#### 安装SDK
```bash
# 方式一：CDN引入
<script src="https://lf-scm-cn.feishucdn.com/lark/op/h5-js-sdk-1.5.30.js"></script>

# 方式二：npm安装
npm install @larksuiteoapi/node-sdk
```

#### 使用SDK获取授权码
```javascript
// 前端使用SDK
import { h5sdk } from '@larksuiteoapi/node-sdk';

// 配置SDK
h5sdk.config({
  appId: 'your_app_id',
  onSuccess: function(res) {
    console.log('SDK配置成功', res);
  },
  onFail: function(err) {
    console.error('SDK配置失败', err);
  }
});

// 获取授权码
h5sdk.biz.util.getAuthCode({
  success: function(res) {
    const authCode = res.code;
    // 跳转到我们的免登页面
    window.location.href = `/user/feishu-auth?code=${authCode}`;
  },
  fail: function(err) {
    console.error('获取授权码失败', err);
  }
});
```

#### SDK集成方案 (可选升级)
```vue
<!-- 新的SDK集成组件 -->
<template>
  <div class="feishu-sdk-auth">
    <el-button @click="startAuth" type="primary">
      通过飞书登录
    </el-button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.initSDK();
  },
  methods: {
    initSDK() {
      // SDK初始化
      window.h5sdk.config({
        appId: process.env.FEISHU_APP_ID,
        onSuccess: () => {
          console.log('SDK初始化成功');
        }
      });
    },
    startAuth() {
      window.h5sdk.biz.util.getAuthCode({
        success: (res) => {
          this.$router.push(`/user/feishu-auth?code=${res.code}`);
        }
      });
    }
  }
}
</script>
```

---

## 故障排除

### 1. 常见问题

#### Q1: 页面一直显示"正在验证身份"
```bash
# 原因分析
1. 飞书授权码无效或过期
2. 后端API接口异常
3. 网络连接问题

# 解决方案
1. 检查URL中的code参数
2. 查看浏览器Network面板
3. 检查后端日志
```

#### Q2: 绑定手机号失败
```bash
# 原因分析  
1. 验证码错误或过期
2. 手机号已被其他用户绑定
3. API接口返回错误

# 解决方案
1. 重新获取验证码
2. 检查手机号是否正确
3. 查看API响应错误信息
```

#### Q3: 跳转地址不正确
```bash
# 原因分析
1. redirectUrl参数编码问题
2. 安全策略限制外部跳转
3. 路由配置错误

# 解决方案
1. 使用encodeURIComponent编码URL
2. 确保跳转地址为相对路径
3. 检查Vue Router配置
```

### 2. 调试工具

#### 浏览器调试
```javascript
// 开启调试模式
localStorage.setItem('feishu_debug', 'true');

// 查看性能数据
console.log(window.perfMonitor.marks);

// 检查本地存储
console.log(window.storage.get('sms_send_time'));
```

#### 服务器日志
```bash
# 查看应用日志
pm2 logs zai-fe

# 查看错误日志
tail -f /path/to/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log
```

### 3. 监控配置

#### 应用监控
```javascript
// 添加错误监控
window.addEventListener('error', (event) => {
  console.error('页面错误:', event.error);
  // 发送错误到监控服务
});

// API监控
const originalRequest = util.request;
util.request = function(options) {
  const start = Date.now();
  return originalRequest(options).finally(() => {
    const duration = Date.now() - start;
    console.log(`API ${options.url} 耗时: ${duration}ms`);
  });
};
```

#### 性能监控
```bash
# 使用PM2监控
pm2 monit

# 系统资源监控
htop
iostat -x 1
```

---

## 总结

本飞书免登功能采用轻量级实现方案，通过纯API调用方式完成用户认证，具有良好的可维护性和扩展性。部署简单，测试完善，适合生产环境使用。

### 关键特性
- 🚀 **快速集成**: 无SDK依赖，部署简单
- 🔒 **安全可靠**: 完善的错误处理和安全防护  
- 📱 **响应式设计**: 支持PC和移动端
- 🔧 **易于维护**: 代码结构清晰，文档完善
- 📊 **性能监控**: 内置性能分析工具

### 下一步计划
1. 根据实际使用情况优化性能
2. 添加更多飞书功能集成
3. 完善监控和日志系统
4. 考虑引入飞书SDK增强功能

---

**文档版本**: v1.0  
**最后更新**: 2025-08-14  
**维护人员**: 前端开发团队