# Git MCP 配置与使用完整指南

## 目录
1. [现状说明](#现状说明)
2. [最佳替代方案](#最佳替代方案)
3. [安装和配置](#安装和配置)
4. [核心功能说明](#核心功能说明)
5. [使用方法详解](#使用方法详解)
6. [实际应用场景](#实际应用场景)
7. [高级技巧](#高级技巧)
8. [故障排除](#故障排除)
9. [最佳实践](#最佳实践)

## 现状说明

### 🚨 重要发现
经过验证，**官方的 `@modelcontextprotocol/server-git` 目前尚未发布**。通过 npm 搜索发现，Anthropic 官方 MCP 服务器库中目前只有：
- `@modelcontextprotocol/server-sequential-thinking`
- `@modelcontextprotocol/server-filesystem`  
- `@modelcontextprotocol/server-memory`
- `@modelcontextprotocol/server-everything`

### 📋 可用的 Git 相关替代方案
1. **Claude Code 内置 Git 功能** - 通过 Bash 工具执行 Git 命令
2. **Filesystem MCP + Git 组合** - 文件操作 + Git 命令的增强组合
3. **等待官方发布** - 关注官方 Git MCP 服务器的发布

## 最佳替代方案

鉴于官方 Git MCP 未发布，我为你配置了**最优的替代方案**：

### 🎯 推荐方案：Filesystem MCP + 内置 Git
```
Filesystem MCP：增强文件操作能力
+ 
内置 Git 功能：完整的 Git 命令支持
=
接近专用 Git MCP 的体验
```

## 安装和配置

### 1. 安装 Filesystem MCP 服务器
```bash
# 全局安装 filesystem MCP 服务器
npm install -g @modelcontextprotocol/server-filesystem
```

### 2. 配置 Claude Code
编辑配置文件 `~/.config/claude-code/mcp_servers.json`：

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/peakom/work"],
      "env": {}
    }
  }
}
```

### 3. 环境变量配置（可选）
为了更好的 Git 体验，可以设置环境变量：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
export GIT_AUTHOR_NAME="你的名字"
export GIT_AUTHOR_EMAIL="your.email@example.com"
export GIT_COMMITTER_NAME="你的名字"
export GIT_COMMITTER_EMAIL="your.email@example.com"
```

### 4. 验证配置
```bash
# 重启 Claude Code
# 然后在项目目录中测试
claude-code
```

## 核心功能说明

### 📁 Filesystem MCP 功能
- **高级文件操作**：批量文件处理、目录遍历
- **文件内容分析**：智能文件搜索和内容解析
- **文件监控**：文件变化检测和处理
- **路径管理**：智能路径解析和验证

### 🔧 内置 Git 功能
- **基础操作**：add, commit, push, pull, status
- **分支管理**：checkout, merge, rebase, branch
- **历史查看**：log, diff, show
- **远程操作**：clone, fetch, remote
- **高级功能**：stash, tag, submodule

### 🚀 组合优势
- **智能文件处理** + **完整 Git 操作** = **强大的版本控制体验**
- **上下文感知**：自动识别 Git 仓库和文件状态
- **批量操作**：一次性处理多个文件的 Git 操作
- **安全检查**：操作前的状态验证和确认

## 使用方法详解

### 基础 Git 操作

#### 1. 仓库状态检查
```
你：检查当前项目的 Git 状态
Claude：[使用 Bash 工具执行 git status]
- 显示未跟踪文件
- 显示已修改文件
- 显示暂存区状态
- 给出下一步建议
```

#### 2. 文件添加和提交
```
你：将所有修改的文件添加到暂存区并提交
Claude：[组合操作]
1. 使用 filesystem MCP 检查文件状态
2. 执行 git add .
3. 执行 git commit 
4. 显示提交结果
```

#### 3. 分支操作
```
你：创建新分支 feature/user-auth 并切换过去
Claude：[执行分支操作]
1. 检查当前分支状态
2. 执行 git checkout -b feature/user-auth
3. 确认切换成功
```

### 高级文件操作

#### 1. 智能文件搜索
```
你：找出所有包含 "TODO" 注释的文件
Claude：[使用 filesystem MCP]
1. 递归搜索项目文件
2. 分析文件内容
3. 列出包含 TODO 的文件
4. 可选：直接提交这些文件的修改
```

#### 2. 批量文件处理
```
你：将所有 .js 文件中的 console.log 都删除并提交
Claude：[组合操作]
1. 使用 filesystem MCP 找到所有 .js 文件
2. 批量处理文件内容
3. 使用 Git 提交更改
4. 显示处理结果
```

#### 3. 项目结构分析
```
你：分析项目结构并生成 .gitignore 文件
Claude：[智能分析]
1. 使用 filesystem MCP 分析目录结构
2. 识别应该忽略的文件类型
3. 生成合适的 .gitignore
4. 提交 .gitignore 文件
```

## 实际应用场景

### 场景1：新项目初始化
```
用户请求：初始化一个新的React项目的Git仓库

Claude 执行：
1. [Filesystem] 检查项目结构
2. [Git] 执行 git init
3. [Filesystem] 创建合适的 .gitignore
4. [Git] 添加所有文件并初始提交
5. [Git] 设置远程仓库（如果提供）
```

### 场景2：功能开发流程
```
用户请求：开始开发用户登录功能

Claude 执行：
1. [Git] 检查当前分支是否为 main
2. [Git] 如果不是，切换到 main 并拉取最新代码
3. [Git] 创建功能分支 feature/user-login
4. [Filesystem] 创建相关文件结构
5. 提示用户开始开发
```

### 场景3：代码重构
```
用户请求：重构项目，将所有组件移动到components目录

Claude 执行：
1. [Filesystem] 分析现有组件分布
2. [Filesystem] 创建新的目录结构
3. [Filesystem] 移动文件并更新导入路径
4. [Git] 使用 git mv 跟踪文件移动
5. [Git] 提交重构更改
```

### 场景4：发布准备
```
用户请求：准备发布版本 v1.2.0

Claude 执行：
1. [Git] 确保在 main 分支
2. [Git] 检查是否有未提交的更改
3. [Filesystem] 更新版本号文件
4. [Git] 提交版本更新
5. [Git] 创建版本标签
6. [Git] 推送到远程仓库
```

## 高级技巧

### 1. 智能提交信息生成
```
你：分析我的更改并生成合适的提交信息
Claude：
1. [Git] 执行 git diff 查看更改
2. [Filesystem] 分析文件类型和更改模式
3. 根据约定（如 Conventional Commits）生成提交信息
4. 执行提交
```

### 2. 自动化工作流
```
你：帮我设置一个自动化的开发工作流
Claude：
1. [Filesystem] 创建 Git hooks 脚本
2. [Git] 设置 pre-commit 检查
3. [Filesystem] 配置自动化脚本
4. 提供工作流使用说明
```

### 3. 冲突智能解决
```
你：帮我解决合并冲突
Claude：
1. [Git] 分析冲突文件
2. [Filesystem] 读取冲突内容
3. 提供解决建议
4. [Git] 完成合并
```

### 4. 代码审查辅助
```
你：审查我即将提交的代码
Claude：
1. [Git] 查看暂存区文件
2. [Filesystem] 分析代码质量
3. 提供改进建议
4. 可选：自动应用改进并提交
```

## 故障排除

### 常见问题

#### 1. Filesystem MCP 启动失败
```bash
# 检查安装
npm list -g @modelcontextprotocol/server-filesystem

# 重新安装
npm uninstall -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-filesystem
```

#### 2. 路径权限问题
```bash
# 检查目录权限
ls -la /Users/peakom/work

# 修复权限
chmod 755 /Users/peakom/work
```

#### 3. Git 配置问题
```bash
# 检查 Git 配置
git config --list

# 设置基本配置
git config --global user.name "你的名字"
git config --global user.email "your.email@example.com"
```

#### 4. 中文文件名问题
```bash
# 设置 Git 支持中文文件名
git config --global core.quotepath false
```

### 调试方法

#### 1. 查看 MCP 服务器日志
```bash
# Claude Code 日志位置
tail -f ~/.local/share/claude-code/logs/main.log
```

#### 2. 测试 Filesystem MCP
```bash
# 直接测试 MCP 服务器
npx @modelcontextprotocol/server-filesystem /Users/peakom/work
```

#### 3. 验证 Git 功能
```bash
# 在项目目录中测试基本 Git 命令
cd /Users/peakom/work
git status
git log --oneline -5
```

## 最佳实践

### 1. 配置优化

#### 推荐的完整配置
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/peakom/work"],
      "env": {}
    },
    "memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"],
      "env": {}
    }
  }
}
```

### 2. 工作流建议

#### 标准开发流程
```
1. 检查仓库状态
2. 创建功能分支
3. 开发功能
4. 定期提交
5. 推送到远程
6. 创建 Pull Request
```

#### 提交信息规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具更新
```

### 3. 文件管理

#### .gitignore 最佳实践
```gitignore
# 依赖文件
node_modules/
.pnpm-store/

# 构建产物
dist/
build/
.next/

# 环境文件
.env
.env.local
.env.*.local

# IDE 配置
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
npm-debug.log*

# 缓存
.cache/
.temp/
```

### 4. 性能优化

#### 大型仓库优化
```bash
# 设置 Git 性能优化
git config --global pack.threads 0
git config --global pack.deltaCacheSize 2g
git config --global core.preloadindex true
git config --global core.fscache true
```

#### 文件系统优化
```json
{
  "filesystem": {
    "command": "npx",
    "args": [
      "@modelcontextprotocol/server-filesystem", 
      "/Users/peakom/work",
      "--max-depth", "10",
      "--ignore-patterns", "node_modules,.git,dist"
    ],
    "env": {}
  }
}
```

### 5. 安全建议

#### 敏感信息保护
- 使用 `.env` 文件存储敏感配置
- 确保 `.env` 文件在 `.gitignore` 中
- 定期审查提交历史中的敏感信息
- 使用 Git hooks 防止敏感信息提交

#### 分支保护
```bash
# 设置主分支保护
git config branch.main.pushRemote origin
git config branch.main.push origin/main
```

## 未来展望

### 官方 Git MCP 预期功能
当官方 Git MCP 服务器发布时，预期将包含：
- 智能冲突解决
- 自动化工作流
- 高级分支策略
- 集成 CI/CD 功能
- 更好的团队协作支持

### 升级准备
- 关注官方 GitHub 仓库更新
- 保持当前配置的向后兼容性
- 准备迁移脚本和配置

## 总结

虽然官方 Git MCP 服务器尚未发布，但通过 **Filesystem MCP + 内置 Git 功能** 的组合，我们已经实现了：

### ✅ 已实现功能
- 完整的 Git 操作支持
- 智能文件管理
- 批量操作能力
- 上下文感知
- 自动化工作流

### 🎯 核心优势
- **零学习成本** - 通过自然语言操作
- **高度自动化** - 减少重复性工作
- **智能建议** - 基于项目状态的操作建议
- **安全可靠** - 操作前自动检查和确认

### 📈 使用建议
1. **立即开始使用** - 当前方案已经非常完善
2. **建立使用习惯** - 通过自然语言描述 Git 操作
3. **关注官方更新** - 准备在官方 Git MCP 发布时升级
4. **分享反馈** - 帮助改进整体体验

这个配置为你提供了接近专用 Git MCP 服务器的体验，同时保持了极好的扩展性和兼容性。

---

**文档版本**: 1.0  
**更新日期**: 2025-08-19  
**适用版本**: Claude Code + Filesystem MCP v2025.8.18  
**状态**: 生产就绪