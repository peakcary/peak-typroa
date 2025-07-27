# ZAI-FE 项目架构与开发文档

## 项目概述

ZAI-FE 是一个基于 AI 能力测评的智能招聘平台前端项目，通过科学的能力评估取代传统的简历筛选，提高招聘的精准度和效率。平台主要包含人才端、企业端和管理后台三大模块。

## 技术架构

### 技术栈
- **前端框架**: Vue 3.4.27 + Vue Router 4.3.2
- **状态管理**: Pinia 2.2.4
- **UI 组件库**: Element Plus 2.8.8
- **构建工具**: Vite 4.5.3
- **CSS 预处理器**: Sass 1.77.4
- **原子化 CSS**: UnoCSS 0.65.0
- **图标**: Element Plus Icons + Iconify
- **开发语言**: JavaScript/TypeScript 混合

### 后端技术栈
- **运行环境**: Node.js 18+
- **Web 框架**: Express.js 4.19.2
- **模板引擎**: EJS 3.1.10
- **身份验证**: JWT (jsonwebtoken 9.0.2)
- **日志系统**: Log4js 6.9.1
- **文件上传**: Multer + Formidable
- **进程管理**: PM2

## 项目结构

```
zai-fe/
├── client/                    # 前端代码
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   ├── components/       # 公共组件
│   │   ├── router/           # 路由配置
│   │   ├── store/            # 状态管理
│   │   ├── assets/           # 静态资源
│   │   ├── common/           # 公共工具
│   │   └── global.css        # 全局样式
│   ├── public/               # 静态文件
│   ├── vite.config.js        # Vite 配置
│   └── uno.config.js         # UnoCSS 配置
├── routes/                   # 服务端路由
├── views/                    # 服务端模板
├── lib/                      # 服务端工具库
├── config/                   # 配置文件
├── model/                    # 数据模型
├── scripts/                  # 部署脚本
└── go.js                     # 服务端入口
```

## 核心业务架构

### 1. 用户角色体系

#### 人才用户 (Zaier)
- **核心功能**: 简历管理、AI测评、职位匹配、求职管理
- **能力评估**: 20分钟AI互动测评 + 100+能力因子深度扫描
- **匹配机制**: 基于能力数据的智能职位推荐
- **权益系统**: 自在币体系，用于支付测评费用

#### 企业用户 (Entity)
- **核心功能**: 职位发布、人才匹配、候选人管理、团队协作
- **认证体系**: 企业主体认证，支持多成员管理
- **权益系统**: 招聘通证模式，按权益消费
- **智能匹配**: 匹配度>70%的人才推荐

#### 管理员 (Admin)
- **平台管理**: 用户数据监控、系统配置
- **企业管理**: 企业认证审核、职位监管
- **人才管理**: 测评审核、能力认证
- **数据分析**: 运营数据统计和决策支持

### 2. 核心业务流程

#### 人才求职流程
```
用户注册 → 实名认证 → 简历提交 → 专业测评 → 智能匹配 → 求职成功
```

#### 企业招聘流程
```
企业认证 → 购买通证 → 发布职位 → 人才匹配 → 面试邀请 → 招聘完成
```

### 3. 测评体系架构

#### AI 测评引擎
- **互动测评**: 20分钟智能问答，实时能力评估
- **深度测评**: 100+能力因子全方位扫描
- **多维评估**: 专业能力、软技能、工作能力、人格特质

#### 能力数据模型
- **能力基因图谱**: 可视化能力分布
- **匹配度算法**: 多维度权重计算
- **动态调整**: 基于反馈持续优化

## 前端架构设计

### 1. 路由架构

采用 Vue Router 4 实现单页应用路由，支持：
- **嵌套路由**: 支持多层级页面结构
- **路由守卫**: JWT认证和角色权限控制
- **懒加载**: 页面组件按需加载
- **动态路由**: 支持参数化路径

#### 主要路由模块
```javascript
// 路由结构
/                    # 首页
/user/*             # 用户相关页面
/entity/*           # 企业相关页面  
/zaier/*            # 人才相关页面
/admin/*            # 管理后台页面
/ai/*               # AI助手页面
```

### 2. 状态管理架构

使用 Pinia 进行状态管理，主要 Store 模块：

#### Entity Store (/client/src/store/entity.js:11)
- 管理企业主体状态和本地缓存
- 支持多用户企业主体切换
- LocalStorage 持久化存储

#### Zaier Store (/client/src/store/zaier.js:11)
- 管理人才专业领域和求职状态
- 动态获取和缓存专业领域列表
- 求职状态实时同步

#### Exam Store (/client/src/store/exam.js:11)
- 管理测评考试状态和答案
- 支持答案的增量更新
- 测评数据结构化存储

### 3. 组件架构

#### 公共组件库 (/client/src/components/)
```
components/
├── Header/           # 头部导航组件
├── aside/            # 侧边栏组件集合
├── common/           # 通用业务组件
│   ├── City/         # 城市选择
│   ├── WorkType/     # 工作类型
│   ├── education/    # 学历选择
│   └── salary/       # 薪资选择
├── entity/           # 企业专用组件
├── zaier/            # 人才专用组件
└── animate/          # 动画组件
```

#### 组件设计原则
- **职责单一**: 每个组件专注特定功能
- **可复用**: 通过 props 和 slots 实现灵活配置
- **组合式**: 支持组件嵌套和组合
- **响应式**: 适配移动端和桌面端

## 后端架构设计

### 1. 服务端架构 (/go.js:1)

#### 中间件栈
```javascript
// 核心中间件
Express.js           # Web 框架
EJS                  # 模板引擎  
JWT 认证             # 身份验证
CORS                 # 跨域处理
Compression          # 响应压缩
Morgan               # 请求日志
Body Parser          # 请求解析
```

#### 路由系统 (/lib/routes.js)
- **API 路由**: 提供 RESTful API 接口
- **页面路由**: 服务端渲染页面
- **静态资源**: 前端构建产物服务

### 2. 认证授权系统

#### JWT 认证机制 (/go.js:85)
```javascript
// JWT 配置
secret: settings.sessionSecret
algorithms: ['HS256']
cookie: 'zai-token'
expires: 7天
```

#### 权限控制
- **用户权限**: 基于 JWT token 的用户身份验证
- **角色权限**: 管理员角色访问控制
- **路由守卫**: 前后端双重权限验证

### 3. 开发环境配置

#### 本地开发 (/config/settings.js:5)
```javascript
sitePort: 8058                    # 服务端口
apiHost: 'http://devnode.zizai.work/' # API 服务地址
sessionSecret: '...'               # JWT 密钥
sessionExpiresIn: 7 * 24 * 60 * 60 # 会话过期时间
```

#### 构建配置 (/client/vite.config.js:21)
- **开发服务器**: 端口 5174，支持 HMR
- **构建输出**: 输出到 `../public` 目录
- **代理配置**: 开发环境跨域代理
- **插件配置**: Vue、UnoCSS、Element Plus 自动导入

## 部署架构

### 1. 构建流程

#### 前端构建
```bash
cd client && vite build --emptyOutDir
```

#### 部署脚本 (/scripts/deploy.js)
- 前端资源构建和优化
- 静态资源处理和压缩
- 服务端代码准备

### 2. 生产环境

#### 进程管理
```bash
pm2 start go.js --name zf    # 生产环境
pm2 start go.js --name zfd   # 开发环境
```

#### 环境配置
- **生产环境**: 完整的错误处理和日志记录
- **开发环境**: 热重载和调试支持
- **负载均衡**: PM2 cluster 模式支持

## 开发规范

### 1. 代码组织

#### 文件命名
- **页面组件**: 使用 kebab-case，如 `work-detail.vue`
- **工具函数**: 使用 camelCase，如 `util.js`
- **Store 模块**: 使用 camelCase，如 `entity.js`

#### 代码风格
- **Vue 3 Composition API**: 优先使用组合式 API
- **TypeScript 支持**: 部分文件使用 TypeScript
- **ESLint 配置**: 遵循 Standard 代码规范

### 2. 状态管理规范

#### Store 设计模式
```javascript
// 标准 Pinia Store 结构
export const useXxxStore = defineStore('xxx', {
  state: () => ({
    // 响应式状态
  }),
  actions: {
    // 同步和异步操作
  }
});
```

#### 缓存策略
- **LocalStorage**: 用户偏好和长期状态
- **SessionStorage**: 临时会话数据
- **内存缓存**: 运行时数据缓存

### 3. API 调用规范

#### 请求工具 (/client/src/assets/util.js)
- 统一的请求封装和错误处理
- 自动 JWT token 注入
- 响应数据标准化处理

#### 接口约定
```javascript
// 标准 API 响应格式
{
  "errno": 0,        // 错误码，0表示成功
  "errmsg": "",      // 错误信息
  "data": {}         // 响应数据
}
```

## 性能优化

### 1. 前端优化

#### 代码分割
- **路由级**: 页面组件懒加载
- **组件级**: 大型组件按需加载
- **第三方库**: 独立 chunk 处理

#### 资源优化
- **图片优化**: 支持 WebP 格式
- **字体优化**: 子集字体加载
- **CSS 优化**: 原子化 CSS 减少体积

### 2. 服务端优化

#### 缓存策略
- **静态资源**: 长期缓存 + CDN
- **API 响应**: 适当的缓存策略
- **页面缓存**: 模板渲染缓存

#### 性能监控
- **请求日志**: Morgan 中间件记录
- **错误监控**: 统一错误处理和上报
- **性能指标**: 关键接口性能跟踪

## 业务扩展指南

### 1. 新增页面

#### 步骤
1. 在 `/client/src/pages/` 创建页面组件
2. 在 `/client/src/router/index.js` 添加路由配置
3. 如需要，添加对应的 Store 模块
4. 更新导航菜单和权限控制

#### 示例
```javascript
// 1. 创建页面组件
// pages/example/index.vue

// 2. 添加路由
{
  path: '/example',
  name: 'example',
  component: () => import('../pages/example/index.vue'),
  meta: { requiredRole: 'user' }
}
```

### 2. 新增 API

#### 前端接口调用
```javascript
// 使用统一的请求工具
const result = await util.request({
  url: '/api/example/action',
  method: 'POST',
  data: { ... }
});
```

#### 后端路由添加
在 `/routes/api.js` 或创建新的路由文件，按照现有模式添加接口。

### 3. 状态管理扩展

#### 新增 Store
```javascript
// stores/example.js
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({
    data: null
  }),
  actions: {
    async fetchData() {
      // 异步操作
    }
  }
});
```

## 常见问题与解决方案

### 1. 开发环境问题

#### 端口冲突
- 前端默认端口: 5174 (可在 vite.config.js 修改)
- 后端默认端口: 8058 (可在 config/settings.js 修改)

#### 跨域问题
开发环境已配置代理，如遇跨域问题检查 Vite 配置中的 proxy 设置。

### 2. 构建部署问题

#### 静态资源路径
构建后的静态资源会输出到 `/public` 目录，确保服务端正确配置静态文件服务。

#### 环境变量
检查 `process.env.NODE_ENV` 设置，确保生产环境和开发环境配置正确。

### 3. 状态管理问题

#### 数据持久化
重要的用户状态（如当前企业、专业领域）使用 LocalStorage 持久化，注意清理策略。

#### 状态同步
跨页面状态变更需要及时更新 Store，避免数据不一致。

## 联系方式

如有问题或建议，请联系开发团队或查阅项目相关文档。

---

*文档最后更新时间: 2024-07-26*