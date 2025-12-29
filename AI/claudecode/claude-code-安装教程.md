# Claude Code 安装教程

## 什么是 Claude Code？

Claude Code 是 Anthropic 官方推出的命令行界面工具，让您可以直接在终端中与 Claude AI 交互，进行代码开发、文件操作、项目管理等任务。

## 系统要求

- **操作系统**: macOS, Linux, 或 Windows
- **Node.js**: 版本 18 或更高
- **网络连接**: 需要连接到 Anthropic API

## 安装步骤

### 方法一：使用 npm 安装（推荐）

```bash
# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 方法二：使用 yarn 安装

```bash
# 全局安装
yarn global add @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 方法三：使用 pnpm 安装

```bash
# 全局安装
pnpm add -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

## 配置 API 密钥

### 1. 获取 API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 登录或注册账户
3. 导航到 API Keys 页面
4. 点击 "Create Key" 创建新的 API 密钥
5. 复制生成的密钥（请妥善保存，密钥只显示一次）

### 2. 设置 API 密钥

#### 方法一：使用环境变量

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
export ANTHROPIC_API_KEY="your-api-key-here"

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

#### 方法二：使用配置命令

```bash
# 运行配置命令
claude auth

# 按提示输入您的 API 密钥
```

#### 方法三：创建配置文件

在用户主目录创建 `.clauderc` 文件：

```bash
# 创建配置文件
echo 'ANTHROPIC_API_KEY=your-api-key-here' > ~/.clauderc
```

## 验证安装

运行以下命令验证 Claude Code 是否正确安装和配置：

```bash
# 检查版本
claude --version

# 测试基本功能
claude "Hello, Claude!"

# 查看帮助信息
claude --help
```

## 基本使用

### 启动交互模式

```bash
# 进入交互式会话
claude

# 或者直接发送消息
claude "请帮我解释这个函数的作用"
```

### 常用命令

```bash
# 查看帮助
claude --help

# 查看版本
claude --version

# 设置配置
claude config

# 查看当前配置
claude config --show
```

## 高级配置

### 配置文件位置

- **macOS/Linux**: `~/.claude/config.json`
- **Windows**: `%USERPROFILE%\.claude\config.json`

### 自定义配置选项

在配置文件中可以设置：

```json
{
  "apiKey": "your-api-key",
  "model": "claude-3-sonnet-20240229",
  "maxTokens": 4096,
  "temperature": 0.7,
  "defaultPrompt": "您是一个有用的编程助手"
}
```

## 故障排除

### 常见问题

1. **安装失败**
   ```bash
   # 清除 npm 缓存
   npm cache clean --force

   # 重新安装
   npm install -g @anthropic-ai/claude-code
   ```

2. **API 密钥错误**
   ```bash
   # 检查环境变量
   echo $ANTHROPIC_API_KEY

   # 重新配置
   claude auth
   ```

3. **权限问题 (macOS/Linux)**
   ```bash
   # 使用 sudo 安装
   sudo npm install -g @anthropic-ai/claude-code
   ```

4. **网络连接问题**
   ```bash
   # 检查网络连接
   curl -I https://api.anthropic.com

   # 设置代理（如需要）
   npm config set proxy http://proxy-server:port
   ```

### 卸载

如果需要卸载 Claude Code：

```bash
# 使用 npm 卸载
npm uninstall -g @anthropic-ai/claude-code

# 删除配置文件
rm -rf ~/.claude
```

## 获取帮助

- **官方文档**: [Claude Code 文档](https://docs.anthropic.com/claude/docs/claude-code)
- **GitHub 仓库**: [claude-code](https://github.com/anthropics/claude-code)
- **问题反馈**: [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- **社区论坛**: [Anthropic Community](https://community.anthropic.com)

## 下一步

安装完成后，您可以：

1. 尝试基本的代码生成和解释功能
2. 探索文件操作和项目管理功能
3. 学习高级提示技巧
4. 集成到您的开发工作流中

祝您使用愉快！🎉