# ZAI-FE 前后端交互详细分析文档

## 项目概述

本文档详细分析 ZAI-FE 项目的前后端交互机制，包括接口调用、路由处理、认证授权、文件上传等核心功能的实现原理和使用方法。

## 系统架构概览

```
┌─────────────────┐    HTTP请求    ┌─────────────────┐    代理转发    ┌─────────────────┐
│                 │ ────────────► │                 │ ────────────► │                 │
│   Vue 3 前端    │               │  Express 中间层  │               │   后端 API      │
│  (localhost:5174)│              │  (localhost:8058)│               │(devnode.zizai.work)│
│                 │ ◄──────────── │                 │ ◄──────────── │                 │
└─────────────────┘    响应数据    └─────────────────┘    API数据     └─────────────────┘
        │                                  │
        ▼                                  ▼
  util.request()                   /api/* 路由处理
  axios 封装                       runUtil.request()
```

### 核心特点

1. **三层架构**：前端 Vue 应用 + Express 中间层 + 后端 API 服务
2. **代理模式**：Express 作为代理层，转发所有 API 请求
3. **统一认证**：JWT + Session 双重认证机制
4. **文件处理**：Multer 中间件处理多种文件上传
5. **SSR 支持**：服务端渲染 + 客户端单页应用

---

## 一、前端接口调用机制

### 1.1 核心工具类：util.request()

**位置**：`/client/src/assets/util.js:4`

#### 基本使用方法

```javascript
// 1. 简单调用
const result = await util.request('/api/user/getUserInfo');

// 2. 完整参数调用
const result = await util.request({
  url: '/api/user/login',
  method: 'POST',
  data: { username: 'test', password: '123456' },
  loading: true,
  success: (result) => console.log('成功', result),
  fail: (result) => console.log('失败', result),
  error: (err) => console.log('异常', err)
});

// 3. GET/POST 便捷方法
const userData = await util.get('/api/user/profile');
const loginResult = await util.post('/api/user/login', { username, password });
```

#### 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| url | String | 接口地址，支持相对路径 |
| method | String | HTTP方法，默认POST |
| data | Object | 请求数据 |
| loading | Boolean | 是否显示Loading状态 |
| success | Function | 成功回调（errno === 0） |
| fail | Function | 业务失败回调（errno !== 0） |
| error | Function | 网络异常回调 |

### 1.2 请求处理机制

#### 参数兼容性处理

```javascript
// 支持字符串参数（默认POST）
if (typeof option === 'string') {
  defaultOpt.url = option;
  option = defaultOpt;
} else {
  option = Object.assign(defaultOpt, option);
}
```

#### 跨域配置

```javascript
// 自动携带Cookie进行跨域请求
axios.defaults.withCredentials = true;
```

#### 服务端渲染支持

```javascript
// 支持Next.js等SSR框架
if (ctx) {
  option.headers = (ctx.req && ctx.req.headers) || ctx.headers;
}
```

### 1.3 错误处理机制

#### 三层错误处理结构

```javascript
// 1. 网络层错误
await axios(option).catch(function (err) {
  if (err && 'function' === typeof error) {
    error({ errno: -1, msg: '请求异常' });
  }
});

// 2. HTTP状态码错误
if (result && result.status === 200) {
  // 处理响应
} else {
  if ('function' === typeof error) {
    error({ errno: (result && result.status) || -1, msg: '请求异常' });
  }
}

// 3. 业务逻辑错误
if (result.errno === 0 && 'function' === typeof success) {
  success(result);
} else if (result.errno !== 0) {
  if (result.errno === 100000) {
    this.gotoLogin(1000); // 自动跳转登录
  } else {
    this.message('error', result.msg || '请求失败');
  }
}
```

#### 标准响应格式

```javascript
{
  "errno": 0,        // 错误码：0=成功，非0=失败
  "msg": "操作成功",  // 错误信息
  "data": {}         // 响应数据
}
```

### 1.4 登录状态管理

#### 登录检查

```javascript
// 检查登录状态
checkLogin(notRedirect) {
  if (!window.ZAI || !ZAI.user || !ZAI.user.isLogin || !ZAI.user.pin) {
    !notRedirect && this.gotoLogin();
    return false;
  }
  return true;
}
```

#### 自动跳转登录

```javascript
gotoLogin(timeout) {
  this.message('error', '您未登录，请登录后再试');
  const url = `/user/login?redirectUrl=${encodeURIComponent(window.location.href)}`;
  
  if (timeout) {
    setTimeout(() => window.location.href = url, timeout);
  } else {
    window.location.href = url;
  }
}
```

### 1.5 Loading 状态管理

```javascript
// 开始Loading
startLoading(text, timeout) {
  this.loading = ElLoading.service({
    lock: true,
    text: text || '请求中...',
    background: 'rgba(0, 0, 0, 0.3)',
  });
  
  // 超时自动关闭
  +timeout && setTimeout(() => {
    this.closeLoading(this.loading);
  }, +timeout);
  
  return this.loading;
}

// 关闭Loading
closeLoading(loading) {
  loading || (loading = this.loading);
  loading && loading.close && loading.close();
}
```

### 1.6 消息提示机制

```javascript
// 防重复提示机制
message: (() => {
  const messages = {};
  return function (type, msg, opts = {}) {
    const now = +new Date();
    const mType = messages[type];
    
    // 3秒内相同消息不重复显示
    if (mType && mType.msg === msg && mType.time + 3000 > now) {
      return;
    }
    
    messages[type] = { msg, time: now };
    return ElMessage[type]({ message: msg, ...opts });
  };
})()
```

---

## 二、后端路由系统详细分析

### 2.1 路由加载机制

#### 动态路由发现

**位置**：`/lib/routes.js:6`

```javascript
// 主入口：加载所有路由文件
function loadRoutes(app, routesPath) {
  var routeArr = [];
  readRoutes(routeArr, routesPath);  // 递归扫描路由文件
  
  if (routeArr.length) {
    routeArr.forEach(function (route) {
      runRoutes(app, route);  // 注册每个路由
    });
  }
}

// 递归读取路由文件
function readRoutes(routeArr, routesPath) {
  try {
    let files = fs.readdirSync(routesPath);
    
    files.forEach(function (file) {
      var filePath = path.normalize(routesPath + file);
      var stat = fs.statSync(filePath);
      
      if (stat.isFile() && /\.js$/.test(filePath)) {
        routeArr.push(filePath);  // 收集.js文件
      } else if (stat.isDirectory()) {
        readRoutes(routeArr, filePath + '/');  // 递归子目录
      }
    });
  } catch (ex) {
    log('load routes fail: ' + JSON.stringify(ex));
  }
}
```

#### 路由注册机制

```javascript
function runRoutes(app, route) {
  route = require(route);  // 动态加载路由模块
  const { routes: routeList } = route || {};
  
  Array.isArray(routeList) && routeList.forEach((routes) => {
    for (var k in routes) {
      let ks = k.trim().split(' ');
      let method = ks.length > 1 ? ks[0] : 'get';  // 解析HTTP方法
      let dir = ks.length > 1 ? ks[1] : ks[0];     // 解析路径
      let fn = routes[k];                          // 获取处理函数
      
      try {
        app[method](dir, typeof fn === 'function' ? fn : route[fn]);
      } catch (ex) {
        log('load route fail: ' + JSON.stringify(ex));
      }
    }
  });
}
```

### 2.2 setRoutes 函数详解

**位置**：`/lib/routes.js:102`

```javascript
function setRoutes(exp, model, dir, routes) {
  var rs = {};
  
  // 参数重载支持
  if (Array.isArray(dir)) {
    routes = dir;
    dir = '';
  }
  
  routes.forEach((r, i) => {
    r = r.trim().replace(/\s\s+/g, ' ').split(' ');
    let method = r.length > 1 && r[0].toLowerCase() === 'get' ? 'get' : 'all';
    let fn = r.length < 2 ? r[0] : r[1];
    
    if (fn) {
      // 构建完整路由路径
      let action = method + ' /' + (dir ? dir.replace(/^\/+|\/+$/g, '') + '/' : '') + fn;
      action = action.replace(/\/\/+/g, '/').replace(/[\s\/]+$/, '');
      
      if (action === 'get' || action === 'post') action += ' /';
      
      rs[action] = fn;
      
      // 创建异步路由处理器
      exp[action] = async (req, res) => {
        let result = await model[fn](req, res);
        result !== undefined && res.send(result);
      };
    }
  });
  
  return rs;
}
```

#### 路由配置示例

```javascript
// API路由配置 (/routes/api.js)
exports.routes = [
  setRoutes(exports, api, '', [
    // 支付回调
    'get /api/pay/alipaypcasyncnotify',
    'post /api/pay/alipaypcasyncnotify',
    
    // 文件上传
    'post /api/file/uploadimage',
    'post /api/entity/uploadlogo',
    
    // 通用接口
    'get /file/*',
    'post /api/*',
  ]),
];

// 页面路由配置 (/routes/page.js)
exports.routes = setRoutes(exports, page, '', [
  'get /',      // 首页
  'get /:x',    // 动态参数
  'get *'       // 兜底路由
]);
```

### 2.3 中间件系统

#### JWT 认证中间件

**位置**：`/go.js:85`

```javascript
const jwtAuthMiddleware = expressjwt({
  secret: settings.sessionSecret,
  algorithms: ['HS256'],
  getToken: (req) =>
    req.cookies[settings.sessionCookieName] ?? 
    req.headers[settings.sessionCookieName] ?? 
    req.query[settings.sessionCookieName],
}).unless({
  path: [
    '/api/user/login',
    '/api/user/reg',
    '/api/user/getforgetpwcode',
    // ... 其他白名单路径
  ],
});

app.use('*', jwtAuthMiddleware, function (req, res, next) {
  req.session.user = req.auth;  // 将JWT用户信息存入session
  next();
});
```

#### 全局错误处理

```javascript
app.use((err, req, res, next) => {
  let errStack = err.stack;
  
  // JWT错误处理
  if (err.name === 'UnauthorizedError') {
    next();  // 跳过JWT错误，由业务逻辑处理
    return;
  }
  
  // 文件大小错误
  if (err.name === 'PayloadTooLargeError') {
    return res.status(err.statusCode || 500).json({
      error: 'Payload too large',
      message: 'Request body exceeds size limit'
    });
  }
  
  // 其他系统错误
  if (err instanceof Error) {
    log.fatal('ERROR=SYS', errStack);
    res.status(err.statusCode || 500);
    return;
  }
  
  next();
});
```

---

## 三、API 处理器实现机制

### 3.1 通用 API 处理器

**位置**：`/model/api.js:382`

```javascript
exports['/api/*'] = async (req, res) => {
  const apiUrl = req.url.replace(/^\/api\//, '');
  
  // 特殊处理：登出
  if (apiUrl === 'user/logout') {
    req.session.user = null;
    res.clearCookie(sessionCookieName);
    return runUtil.createResult(0, { isLogin: 0 });
  }
  
  // 构建请求参数
  const now = Date.now();
  const params = {
    method: req.method || 'POST',
    url: getApiUrl(apiUrl),  // 构建后端API地址
  };
  
  // 添加安全认证头
  if (requestSecret !== undefined) {
    params.headers = {
      rt: now,
      rs: md5([now, requestSecret].join(''))
    };
  }
  
  // OpenAPI支持
  if (apiUrl.startsWith('v3/')) {
    params.headers = Object.assign(params.headers || {}, { 
      'zai-api-key': req.headers['zai-api-key'] 
    });
  }
  
  // 转发请求
  const result = await runUtil.request(params, req);
  
  // 处理特殊业务逻辑
  const resultData = result && result.errno === 0 && result.data;
  if (resultData) {
    // 登录成功设置session
    if (apiUrl === 'user/login' && resultData.isLogin) {
      req.session.user = Object.assign({}, resultData);
    }
    // 注册成功设置session
    else if (apiUrl === 'user/reg') {
      req.session.user = Object.assign({}, resultData, { isLogin: 1 });
    }
    // 其他用户信息更新...
  }
  
  // JWT令牌管理
  if (result && result.errno === 0) {
    if (req.session?.user?.isLogin) {
      // 刷新JWT令牌
      if (!API_NO_NEED_REFRESH_EXPIRE_TIME.includes(apiUrl)) {
        const token = generateToken(req.session.user);
        res.cookie(sessionCookieName, token, {
          maxAge: sessionExpiresIn * 1000,
          httpOnly: true,
        });
        res.setHeader('zai-token', token);
      }
    } else {
      res.clearCookie(sessionCookieName);
    }
  }
  
  return result;
};
```

### 3.2 请求转发机制

**位置**：`/lib/run.js:660`

```javascript
request: function (options, req) {
  req || (req = {});
  var user = RUN.getUser(req);
  
  // 构建客户端参数
  var clientParams = {
    clientReq: req,
    clientUser: user,
    clientIp: RUN.getClientIp(req),
  };
  
  var params = {
    method: 'GET',
    json: true,
    body: (req.body && RUN.extend({}, req.body, clientParams)) || null,
    query: (req.query && RUN.extend({}, req.query, clientParams)) || null,
    gzip: true,
    timeout: 5 * 60 * 1000,
  };
  
  // 参数处理
  if (typeof options === 'string') {
    params.url = options;
  } else if (typeof options === 'object') {
    let isPost = options.method === 'POST';
    if (options.data) {
      RUN.extend(params[isPost ? 'body' : 'qs'], options.data);
    }
    RUN.extend(params, options);
    if (isPost) {
      delete params.query;
    }
  }
  
  // Promise包装
  return new Promise(function (resolve, reject) {
    try {
      request(params, function (err, resp, body) {
        var result;
        if (err) {
          console.log('request-error: ' + err);
          result = RUN.createResult(1002);
        } else {
          result = body;
        }
        resolve(result);
      });
    } catch (ex) {
      console.log('request-catch-error: ' + JSON.stringify(ex));
      resolve(RUN.createResult(1002));
    }
  });
}
```

### 3.3 用户信息处理

#### 用户信息获取

```javascript
// 获取原始用户信息
getUser: function (req) {
  return (req && req.session && req.session.user) || null;
}

// 获取脱敏用户信息
getOutUser: function ({ req, user }) {
  let outUser = user || (req.session && req.session.user) || null;
  
  if (outUser) {
    outUser = Object.assign({}, outUser);
    
    // 姓名脱敏
    if (outUser.name) {
      outUser.name = outUser.name.length > 2
        ? outUser.name.substr(0, 1) + '*' + outUser.name.substr(-1)
        : outUser.name.substr(-1);
    }
    
    // 身份证脱敏
    if (outUser.idNo) {
      outUser.idNo = outUser.idNo.replace(/^(\d{2})\d{14}(\d{2})$/, '$1**************$2');
    }
    
    // 手机号脱敏
    if (outUser.mobile) {
      outUser.mobile = outUser.mobile.toString().substr(0, 3) + 
                      '****' + 
                      outUser.mobile.toString().substr(7);
    }
    
    // 邮箱脱敏
    if (outUser.email) {
      outUser.email = outUser.email.substr(0, 1) + 
                     '***@***' + 
                     outUser.email.substr(outUser.email.replace(/[0-9a-z]\.[a-z]+$/i, '').length);
    }
  }
  
  return outUser;
}
```

---

## 四、认证授权完整流程

### 4.1 JWT 令牌管理

#### 令牌生成

**位置**：`/lib/jwt.js:11`

```javascript
function generateToken(user, expiresIn = sessionExpiresIn) {
  // 只存储必要的用户信息
  return jwt.sign(
    _.pick(user, [
      'pin',      // 用户唯一标识
      'un',       // 用户名
      'uname',    // 昵称
      'name',     // 真实姓名
      'hasReal',  // 是否实名认证
      'isLogin',  // 登录状态
      'isEntity', // 是否企业用户
      'isAdmin',  // 是否管理员
    ]),
    sessionSecret,
    { expiresIn }  // 默认7天过期
  );
}
```

#### 令牌验证和刷新

```javascript
// JWT中间件自动验证
const jwtAuthMiddleware = expressjwt({
  secret: settings.sessionSecret,
  algorithms: ['HS256'],
  getToken: (req) => 
    req.cookies[settings.sessionCookieName] ??  // 优先从Cookie获取
    req.headers[settings.sessionCookieName] ??  // 其次从Header获取
    req.query[settings.sessionCookieName]       // 最后从Query获取
});

// 令牌自动刷新
if (req.session?.user?.isLogin) {
  if (!API_NO_NEED_REFRESH_EXPIRE_TIME.includes(apiUrl)) {
    const token = generateToken(req.session.user);
    res.cookie(sessionCookieName, token, {
      maxAge: sessionExpiresIn * 1000,
      httpOnly: true,
    });
    res.setHeader('zai-token', token);
  }
}
```

### 4.2 前端路由权限控制

**位置**：`/client/src/router/index.js:601`

```javascript
router.beforeEach((to, from, next) => {
  const requiredRole = to.meta?.requiredRole;
  
  if (requiredRole) {
    const user = window.ZAI.user;
    
    if (user) {
      // 管理员权限检查
      if (requiredRole === 'admin' && !user.isAdmin) {
        next({ name: '404' });
      } else {
        next();
      }
    } else {
      // 未登录跳转登录页
      next({ name: 'login' });
    }
  } else {
    next();
  }
});
```

### 4.3 服务端页面权限控制

**位置**：`/lib/pageRender.js:42`

```javascript
// 页面登录检查
if (needLoginPage) {
  const typeNeed = typeof needLoginPage;
  let needLogin;
  
  if ('boolean' === typeNeed) {
    needLogin = needLoginPage;
  } else if ('function' === typeNeed) {
    needLogin = needLoginPage(path);
  } else if ('object' === typeNeed && 'function' === typeof needLoginPage.test) {
    needLogin = needLoginPage.test(path);
  }
  
  // 未登录重定向
  if (needLogin && (!user || !user.isLogin || !user.pin)) {
    return res.redirect('/user/login?redirectUrl=' + encodeURIComponent(url));
  }
}
```

#### 页面权限配置

**位置**：`/model/page.js:15`

```javascript
// 需要登录的页面正则表达式
needLoginPage: /(?<!(^\/|\/reg\/*|\/login\/*|\/forget\/*|\/authresult\/*|\/logout\/*|\/help*|\/help\/.*|\/404\/*|\/ai\/*|\/zaier\/work\/*|\/home\/.*))$/i
```

### 4.4 完整登录流程

```
1. 用户访问登录页面 (/user/login)
   ↓
2. 提交用户名密码到 /api/user/login
   ↓
3. Express中间层转发到后端API验证
   ↓
4. 验证成功后设置session (req.session.user = userData)
   ↓
5. 生成JWT令牌并设置Cookie
   ↓
6. 前端接收登录成功响应，更新全局用户状态
   ↓
7. 跳转到目标页面或首页
```

---

## 五、特殊接口处理机制

### 5.1 文件上传处理

#### Multer 配置

**位置**：`/model/api.js:11`

```javascript
// 图片上传配置
const multerUpload = multer({
  storage: multer.memoryStorage(),  // 内存存储
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB限制
  },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只能上传 JPEG/PNG 格式的图片'));
    }
  }
});

// AI测评音频上传配置
const aiAnswerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['audio/amr'];
    cb(null, allowedMimeTypes.includes(file.mimetype));
  }
});

// 简历PDF上传配置
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['application/pdf'];
    cb(null, allowedMimeTypes.includes(file.mimetype));
  }
});
```

#### 文件上传处理流程

```javascript
// 通用文件上传API
async function uploadApi(req, res) {
  const uploadFile = multerUpload.single('file');
  
  uploadFile(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({errno: 1007, msg: '文件大小不能超过 5MB'});
      }
      return res.status(400).send({errno: 1006, msg: '只能上传 JPEG/PNG 格式的图片'});
    }
    
    const now = Date.now();
    const apiUrl = req.url.replace(/^\/api\//, '');
    req.body.file = req.file;  // 将文件数据传递给后端
    
    const params = {
      method: 'POST',
      url: getApiUrl(apiUrl),
    };
    
    // 添加安全认证头
    if (requestSecret !== undefined) {
      params.headers = {
        rt: now,
        rs: md5([now, requestSecret].join(''))
      };
    }
    
    res.status(200).send(await runUtil.request(params, req));
  });
}

// 批量绑定上传接口
[
  '/api/file/uploadimage',
  '/api/entity/uploadlogo',
  '/api/entity/uploadhrsl',
  '/api/entity/uploadworkcert',
  '/api/entity/uploadconfirmation',
].forEach((api) => {
  exports[api] = uploadApi;
});
```

### 5.2 AI测评音频处理

#### PC端音频上传

```javascript
exports['/api/zaier/interview/exam_ques/answer'] = async function (req, res) {
  const uploadFile = aiAnswerUpload.array('answer', 4);  // 支持多文件
  
  uploadFile(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({ errno: 1007, msg: '文件大小不能超过 5MB' });
      }
      return res.status(400).send({ errno: 1006, msg: '只能上传 audio/amr 格式的音频' });
    }
    
    const apiUrl = req.url.replace(/^\/api\//, '');
    req.body.answer = req.files;  // 多文件数组
    
    res.status(200).send(await runUtil.request({
      method: 'POST',
      url: getApiUrl(apiUrl),
    }, req));
  });
};
```

#### 移动端音频处理

```javascript
exports['/api/zaier/interview/exam_ques/answer_m'] = async function (req, res) {
  // 解析特殊参数
  let extraParams = req.query['zaier-ai-exam'];
  if (!extraParams) {
    return res.status(400).send({ errno: 1000, msg: '参数不正确' });
  }
  
  try {
    extraParams = JSON.parse(extraParams);
  } catch (e) {
    return res.status(400).send({ errno: 1000, msg: '参数不正确' });
  }
  
  const { aiExamId, questionId, duration, sliceSize = [], format = 'wav', splitAMR = false } = extraParams;
  
  const answerData = req.body;
  req.body = {
    aiExamId,
    questionId,
    duration,
    format,
    answer: []
  };
  
  // AMR格式特殊处理
  if (format === 'amr' && splitAMR) {
    splitAmrFile(Buffer.from(answerData), sliceSize.length).forEach(e => {
      req.body.answer.push({
        buffer: { data: Buffer.from(e) }
      });
    });
  } else {
    // 按sliceSize切割音频数据
    let start = 0;
    for (const size of sliceSize) {
      req.body.answer.push({
        buffer: { data: Buffer.from(answerData).slice(start, start + size) }
      });
      start += size;
    }
  }
  
  const apiUrl = req.url.replace(/answer_m$/, 'answer');
  res.status(200).send(await runUtil.request({
    method: 'POST',
    url: getApiUrl(apiUrl),
  }, req));
};
```

#### AMR音频切割算法

```javascript
// AMR-NB帧大小映射表
const AMR_NB_FRAME_SIZES = [12, 13, 15, 17, 19, 20, 26, 31, 5];
const AMR_HEADER = new Uint8Array([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A]);

function splitAmrFile(arrayBuffer, splitCount) {
  const frames = [];
  let offset = 6;  // 跳过文件头
  
  // 解析AMR帧
  while (offset < arrayBuffer.byteLength) {
    const frameHeader = new Uint8Array(arrayBuffer, offset, 1)[0];
    const frameType = (frameHeader & 0xF8) >> 3;
    
    if (frameType >= AMR_NB_FRAME_SIZES.length) {
      console.error(`Invalid frame type: ${frameType}`);
      continue;
    }
    
    const frameSize = AMR_NB_FRAME_SIZES[frameType];
    frames.push(arrayBuffer.slice(offset, offset + frameSize));
    offset += frameSize;
  }
  
  // 按splitCount分割
  const splitIndex = Math.floor(frames.length / splitCount);
  const ret = [];
  for (let i = 0; i < splitCount; i++) {
    let start = splitIndex * i;
    let end = splitIndex * (i + 1);
    ret.push(buildAmrFile(AMR_HEADER, frames.slice(start, end)));
  }
  
  return ret;
}

function buildAmrFile(header, frames) {
  const totalSize = header.byteLength + frames.reduce((sum, f) => sum + f.byteLength, 0);
  const result = new Uint8Array(totalSize);
  
  result.set(header, 0);
  let offset = header.byteLength;
  
  frames.forEach(frame => {
    result.set(new Uint8Array(frame), offset);
    offset += frame.byteLength;
  });
  
  return result.buffer;
}
```

### 5.3 流式响应处理

#### AI助手聊天接口

```javascript
exports['/api/bot/chat'] = async (req, res) => {
  const apiUrl = req.url.replace(/^\/api\//, '');
  
  const clientParams = {
    clientUser: runUtil.getUser(req),
    clientIp: runUtil.getClientIp(req)
  };
  
  // 设置流式响应
  res.header('Transfer-Encoding', 'chunked');
  
  // 使用axios流式代理
  axios({
    method: 'POST',
    url: getApiUrl(apiUrl),
    responseType: 'stream',
    data: runUtil.extend({}, req.body, clientParams)
  })
  .then((response) => {
    // 流式转发数据
    response.data.on('data', (chunk) => {
      res.write(chunk);
    });
    
    response.data.on('end', () => {
      res.end();
    });
  })
  .catch((e) => {
    res.status(400).send({ errno: 1001, msg: '请求失败' });
  });
};
```

### 5.4 文件服务接口

```javascript
exports['/file/*'] = async function apiAction(req, res) {
  const now = Date.now();
  const params = {
    method: 'POST',
    url: getApiUrl(req.path),
  };
  
  // 添加安全认证头
  if (requestSecret !== undefined) {
    params.headers = {
      rt: now,
      rs: md5([now, requestSecret].join('')),
    };
  }
  
  const result = await runUtil.request(params, req);
  
  // 处理文件数据
  const data = result && result.errno === 0 && result.data;
  if (!data || !data.file) {
    return res.status(400).send('Invalid file content');
  }
  
  let file = data.file;
  if (!Buffer.isBuffer(file)) {
    try {
      file = Buffer.from(file);
    } catch (e) {
      return res.status(400).send('Invalid file content');
    }
  }
  
  const mimetype = data.mimetype || 'application/octet-stream';
  res.set('Content-Type', mimetype);
  res.end(file);
};
```

---

## 六、页面渲染机制

### 6.1 服务端渲染流程

**位置**：`/lib/pageRender.js:5`

```javascript
module.exports = async function (req, res, config) {
  config || (config = {});
  const { page, needLoginPage, subtitle, layout } = config;
  
  // 获取JWT用户信息
  const user = runUtil.getOutUser({ req }) || {};
  
  // 获取用户详细信息（仅HTML请求）
  if (user.isLogin) {
    const { accept, 'content-type': contentType } = req.headers;
    if (accept && accept.includes('text/html') || contentType && contentType.includes('text/html')) {
      let userInfo = (await syncData.getUserInfo(req)) || {};
      userInfo = runUtil.getOutUser({ user: userInfo });
      Object.assign(user, userInfo);
    }
  }
  
  // 获取站点信息
  const site = (await syncData.getSiteInfo(req)) || { beian: {} };
  const topHost = req.headers.host.split('.').slice(-2).join('.');
  site.topHost = topHost;
  site.beianInfo = site.beian[topHost] || site.beian[site.name];
  
  // 构建页面配置
  const url = req.url;
  const path = req.path;
  const search = runUtil.getQuery(url);
  
  Object.assign(config, {
    runUtil,
    site,
    path,
    search,
  });
  
  // 登录检查
  if (needLoginPage) {
    let needLogin = false;
    
    if (typeof needLoginPage === 'boolean') {
      needLogin = needLoginPage;
    } else if (typeof needLoginPage === 'function') {
      needLogin = needLoginPage(path);
    } else if (typeof needLoginPage === 'object' && typeof needLoginPage.test === 'function') {
      needLogin = needLoginPage.test(path);
    }
    
    if (needLogin && (!user || !user.isLogin || !user.pin)) {
      return res.redirect('/user/login?redirectUrl=' + encodeURIComponent(url));
    }
  }
  
  // 获取用户详细信息
  if (user.isLogin) {
    const isAdminPage = /^\/admin/.test(path);
    const outUser = {};
    
    // 过滤用户信息字段
    for (let k in user) {
      if (k && [
        'isLogin', 'pin', 'un', 'uname', 'name', 'idNo', 'mobile', 'email',
        'loginType', 'hasReal', 'isAdmin', 'admin', 'isPartner',
        'hasResume', 'hasAiExam', 'hasSomeFieldExam', 'hasSomeWork'
      ].includes(k)) {
        // 管理员信息仅在管理页面显示
        if (k !== 'admin' || isAdminPage) {
          outUser[k === 'loginType' ? 'lt' : k] = k === 'loginType' 
            ? (/p$/i.test(user[k]) ? 1 : 2) 
            : user[k];
        }
      }
    }
    
    // 获取企业信息
    const eList = (await syncData.getEntityList(req)) || [];
    if (eList.length) {
      user.isEntity = 1;
      outUser.isEntity = 1;
    }
    
    Object.assign(config, { user, outUser });
  }
  
  // 特殊页面处理
  if (/^\/ai\//.test(path)) {
    config.title = '';
    config.subtitle = '';
    config.site = '';
    config.uniqTitle = '求职助手';
  }
  
  // 页面渲染
  res.render(page, config);
};
```

### 6.2 同步数据获取

**位置**：`/common/syncData.js`

```javascript
// 获取站点信息
exports.getSiteInfo = async function (req) {
  const result = await runUtil.request({
    url: getApiUrl('site/getinfo'),
    method: 'POST'
  }, req);
  
  return result && result.errno === 0 ? result.data : {};
};

// 获取用户信息
exports.getUserInfo = async function (req) {
  const result = await runUtil.request({
    url: getApiUrl('user/getinfo'),
    method: 'POST'
  }, req);
  
  return result && result.errno === 0 ? result.data : {};
};

// 获取企业列表
exports.getEntityList = async function (req) {
  const result = await runUtil.request({
    url: getApiUrl('entity/getlist'),
    method: 'POST'
  }, req);
  
  return result && result.errno === 0 ? result.data : [];
};
```

---

## 七、开发调试指南

### 7.1 开发环境配置

#### 环境配置文件

**位置**：`/config/settings.js:5`

```javascript
const config = {
  sitePort: 8058,                           // 前端服务端口
  apiHost: 'http://devnode.zizai.work/',    // 后端API地址
  sessionSecret: 'eio3q$32T&()dae!dsdafWRWd^G*&da2',  // JWT密钥
  sessionExpiresIn: 7 * 24 * 60 * 60,       // 会话过期时间（7天）
  sessionCookieName: 'zai-token',           // Cookie名称
};
```

#### 开发服务器启动

```bash
# 前端开发服务器（热重载）
npm run dev:frontend     # Vite dev server (localhost:5174)

# 后端开发服务器（自动重启）
npm run dev:backend      # Nodemon (localhost:8058)

# 同时启动前后端
npm run dev

# 前端构建监听模式
npm run dev_build:frontend
npm run dev2:backend
npm run dev2
```

### 7.2 调试技巧

#### 前端调试

```javascript
// 1. 网络请求调试
const result = await util.request({
  url: '/api/user/getinfo',
  success: (res) => console.log('成功:', res),
  fail: (res) => console.log('失败:', res),
  error: (err) => console.log('异常:', err)
});

// 2. 全局用户信息
console.log('当前用户:', window.ZAI.user);

// 3. 登录状态检查
if (!util.checkLogin(true)) {
  console.log('用户未登录');
}
```

#### 后端调试

```javascript
// 1. 请求日志
console.log('Request URL:', req.url);
console.log('Request Body:', req.body);
console.log('User Session:', req.session.user);

// 2. API转发调试
const params = {
  method: 'POST',
  url: getApiUrl(apiUrl),
};
console.log('Forward to:', params.url);

const result = await runUtil.request(params, req);
console.log('API Result:', result);
```

### 7.3 常见问题解决

#### 1. 跨域问题

```javascript
// 开发环境代理配置 (vite.config.js)
server: {
  cors: true,
  port: 5174,
  proxy: {
    '/api': {
      target: 'http://localhost:8058',
      changeOrigin: true
    }
  }
}

// 请求配置
axios.defaults.withCredentials = true;
```

#### 2. JWT令牌问题

```javascript
// 检查令牌是否存在
const token = document.cookie.match(/zai-token=([^;]+)/);
console.log('JWT Token:', token ? token[1] : 'Not found');

// 手动清除令牌（退出登录）
document.cookie = 'zai-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
```

#### 3. 文件上传问题

```javascript
// 前端文件上传
const formData = new FormData();
formData.append('file', file);

const result = await util.request({
  url: '/api/file/uploadimage',
  method: 'POST',
  data: formData
});

// 检查文件大小和格式
if (file.size > 5 * 1024 * 1024) {
  console.error('文件大小超过5MB');
}

if (!['image/jpeg', 'image/png'].includes(file.type)) {
  console.error('文件格式不支持');
}
```

#### 4. 路由匹配问题

```javascript
// 检查路由配置
console.log('Current route:', this.$route);
console.log('Route params:', this.$route.params);
console.log('Route query:', this.$route.query);

// 检查路由权限
const requiredRole = this.$route.meta?.requiredRole;
console.log('Required role:', requiredRole);
console.log('User role:', window.ZAI.user?.isAdmin ? 'admin' : 'user');
```

### 7.4 性能优化建议

#### 前端优化

```javascript
// 1. 防重复请求
const requestCache = new Map();
const cacheKey = `${url}_${JSON.stringify(data)}`;

if (requestCache.has(cacheKey)) {
  return requestCache.get(cacheKey);
}

const promise = util.request({ url, data });
requestCache.set(cacheKey, promise);

// 2. 请求去抖
const debouncedRequest = _.debounce(util.request, 300);

// 3. 图片懒加载
const img = new Image();
img.onload = () => {
  // 图片加载完成
};
img.src = imageUrl;
```

#### 后端优化

```javascript
// 1. 请求缓存
const cache = new Map();
const cacheKey = `${apiUrl}_${JSON.stringify(req.body)}`;

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

// 2. 响应压缩
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));

// 3. 静态资源缓存
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

---

## 八、部署配置

### 8.1 构建流程

```bash
# 前端构建
cd client && vite build --emptyOutDir

# 部署脚本
npm run deploy     # 构建并部署
npm run release    # 发布版本
```

### 8.2 生产环境配置

```javascript
// PM2 进程管理
npm run start      # 启动生产服务
npm run restart    # 重启服务
npm run stop       # 停止服务
npm run delete     # 删除服务

// 环境变量
NODE_ENV=production
PORT=8058
```

### 8.3 监控和日志

```javascript
// 日志配置
const log4js = require('log4js');
log4js.configure({
  appenders: {
    file: { type: 'file', filename: 'logs/app.log' },
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' }
  }
});

// 性能监控
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
```

---

## 总结

ZAI-FE 项目采用了现代化的前后端分离架构，通过 Express 中间层实现了统一的认证、代理和文件处理功能。系统具有以下特点：

### 核心优势

1. **统一认证**：JWT + Session 双重机制，安全可靠
2. **代理转发**：Express 中间层统一处理 API 转发
3. **文件处理**：Multer 支持多种文件类型上传
4. **权限控制**：前后端双重权限验证
5. **开发体验**：热重载、自动重启、统一错误处理

### 技术亮点

1. **动态路由**：自动发现和注册路由文件
2. **流式响应**：支持 AI 聊天等实时交互
3. **音频处理**：AMR 格式切割和处理
4. **SSR 支持**：服务端渲染 + 单页应用
5. **异常处理**：完善的错误处理和日志记录

这个架构设计为大型 Web 应用提供了良好的可扩展性和维护性，是一个相对完整的全栈开发解决方案。

---

*文档最后更新时间: 2024-07-26*