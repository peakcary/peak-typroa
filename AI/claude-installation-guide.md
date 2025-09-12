# Claude CLI 安装配置指南

## 概述
Claude CLI 是 Anthropic 官方提供的命令行工具，支持多种操作系统。本文档详细介绍了在不同系统上的安装和配置方法。

## 系统要求
- Node.js 18+ 或 Python 3.8+
- 网络连接
- Anthropic API 密钥

## 安装方法

### 1. macOS 系统

#### 使用 Homebrew（推荐）
```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Claude CLI
brew install anthropic/claude/claude
```

#### 使用 npm
```bash
# 确保已安装 Node.js
npm install -g @anthropic-ai/claude-cli
```

#### 手动安装
```bash
# 下载最新版本
curl -L https://github.com/anthropics/claude-cli/releases/latest/download/claude-macos -o claude
chmod +x claude
sudo mv claude /usr/local/bin/
```

### 2. Windows 系统

#### 使用 PowerShell（推荐）
```powershell
# 使用 Scoop 包管理器
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop bucket add anthropic https://github.com/anthropics/scoop-bucket
scoop install claude
```

#### 使用 npm
```cmd
# 确保已安装 Node.js
npm install -g @anthropic-ai/claude-cli
```

#### 手动安装
1. 下载 Windows 版本：https://github.com/anthropics/claude-cli/releases/latest/download/claude-windows.exe
2. 将文件重命名为 `claude.exe`
3. 添加到系统 PATH 环境变量

### 3. Linux 系统

#### Ubuntu/Debian
```bash
# 使用 apt
curl -fsSL https://cli.anthropic.com/install.sh | sudo bash

# 或使用 snap
sudo snap install claude --classic
```

#### CentOS/RHEL/Fedora
```bash
# 使用 yum/dnf
sudo yum install -y curl
curl -fsSL https://cli.anthropic.com/install.sh | sudo bash

# Fedora 使用 dnf
sudo dnf install -y curl
curl -fsSL https://cli.anthropic.com/install.sh | sudo bash
```

#### Arch Linux
```bash
# 使用 AUR
yay -S claude-cli

# 或使用 pacman（如果在官方仓库）
sudo pacman -S claude-cli
```

#### 通用 Linux 安装
```bash
# 下载二进制文件
wget https://github.com/anthropics/claude-cli/releases/latest/download/claude-linux
chmod +x claude-linux
sudo mv claude-linux /usr/local/bin/claude
```

### 4. Docker 环境

#### Dockerfile 示例
```dockerfile
FROM node:18-alpine

# 安装 Claude CLI
RUN npm install -g @anthropic-ai/claude-cli

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 设置环境变量
ENV ANTHROPIC_API_KEY=your_api_key_here

CMD ["claude"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  claude:
    image: node:18-alpine
    volumes:
      - .:/app
    working_dir: /app
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    command: |
      sh -c "
        npm install -g @anthropic-ai/claude-cli &&
        claude
      "
```

## 配置设置

### 1. API 密钥配置

Claude CLI 支持多种配置方式，按优先级从高到低排列：

#### 方法一：命令行参数（最高优先级）
```bash
claude --api-key="your_api_key" --base-url="https://api.anthropic.com"
```

#### 方法二：环境变量
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc (Linux/macOS)
export ANTHROPIC_API_KEY="your_api_key_here"
export ANTHROPIC_BASE_URL="https://api.anthropic.com"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="your_api_key_here"
$env:ANTHROPIC_BASE_URL="https://api.anthropic.com"

# Windows CMD
set ANTHROPIC_API_KEY=your_api_key_here
set ANTHROPIC_BASE_URL=https://api.anthropic.com

# 重新加载配置 (Linux/macOS)
source ~/.bashrc
```

#### 方法三：settings.json 配置文件（推荐）
```bash
# 创建配置目录
mkdir -p ~/.claude

# 创建 settings.json 文件
cat > ~/.claude/settings.json << 'EOF'
{
  "anthropic_api_key": "your_api_key_here",
  "anthropic_base_url": "https://api.anthropic.com",
  "default_model": "claude-3-sonnet-20241022",
  "max_tokens": 4096,
  "temperature": 0.7,
  "timeout": 30000,
  "retry_attempts": 3,
  "editor": "code",
  "theme": "auto",
  "output_style": "markdown",
  "status_line": {
    "enabled": true,
    "format": "{{model}} | {{tokens}}/{{max_tokens}}"
  },
  "hooks": {
    "pre_tool_use": null,
    "post_tool_use": null,
    "user_prompt_submit": null
  },
  "auto_save": true,
  "history_size": 1000
}
EOF
```

#### 方法四：交互式配置
```bash
claude auth login
claude config set
```

### 配置方式对比分析

| 特性 | 环境变量 | settings.json | 命令行参数 |
|------|----------|---------------|------------|
| **优先级** | 中 | 低 | 高 |
| **作用范围** | 系统全局 | Claude CLI 专用 | 单次命令 |
| **持久性** | 需手动设置 | 自动保存 | 临时使用 |
| **安全性** | 进程可见 | 文件权限保护 | 命令历史可见 |
| **配置项丰富度** | 基础 API 设置 | 完整功能配置 | 基础参数 |
| **便携性** | 依赖系统 | 跟随配置文件 | 无持久化 |
| **团队共享** | 难以标准化 | 可版本控制 | 不适用 |
| **CI/CD 友好** | 非常适合 | 需要文件部署 | 适合 |

### 推荐使用场景

#### 使用环境变量的场景：
- **CI/CD 流水线**：GitHub Actions、Jenkins 等
- **容器化部署**：Docker、Kubernetes 环境
- **多工具共享**：其他工具也需要相同的 API 配置
- **临时测试**：快速切换不同的 API 端点

```bash
# CI/CD 示例
name: Deploy
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  ANTHROPIC_BASE_URL: "https://api.anthropic.com"
```

#### 使用 settings.json 的场景：
- **个人开发环境**：本地开发的主要配置方式
- **复杂配置需求**：需要设置钩子、主题、编辑器等
- **团队标准化**：可以共享配置模板
- **多项目管理**：不同项目使用不同配置

```json
// 团队共享的配置模板
{
  "anthropic_base_url": "https://your-company-proxy.com/anthropic",
  "default_model": "claude-3-sonnet-20241022",
  "hooks": {
    "pre_tool_use": "./scripts/pre-check.sh"
  },
  "editor": "code",
  "output_style": "compact"
}
```

#### 使用命令行参数的场景：
- **临时覆盖**：偶尔需要使用不同配置
- **脚本自动化**：在脚本中动态指定参数
- **调试测试**：快速测试不同的 API 端点

```bash
# 临时使用不同的模型
claude --model="claude-3-opus-20241022" "帮我写个函数"

# 脚本中动态配置
claude --api-key="$TEMP_KEY" --base-url="$TEST_ENDPOINT" "$PROMPT"
```

### 2. 全局配置文件

创建 `~/.claude/CLAUDE.md` 文件来设置全局指令：
```markdown
# 我的 Claude 配置

## 代码风格
- 使用中文注释
- 遵循项目现有代码规范
- 优先使用 TypeScript

## 输出偏好
- 简洁明了的回答
- 提供代码示例
- 包含错误处理
```

### 3. 项目特定配置

在项目根目录创建 `CLAUDE.md`：
```markdown
# 项目配置

## 技术栈
- React + TypeScript
- Node.js + Express
- MongoDB

## 开发规范
- 使用 ESLint 和 Prettier
- 编写单元测试
- 遵循 Git 提交规范
```

## 验证安装

```bash
# 检查版本
claude --version

# 查看帮助
claude --help

# 测试连接
claude auth test
```

## 常见问题

### 权限问题
```bash
# macOS/Linux 权限修复
sudo chown -R $(whoami) /usr/local/bin/claude
chmod +x /usr/local/bin/claude
```

### 网络连接问题
```bash
# 设置代理（如果需要）
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
```

### Node.js 版本问题
```bash
# 使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## 卸载方法

### macOS
```bash
# Homebrew 安装的
brew uninstall claude

# npm 安装的
npm uninstall -g @anthropic-ai/claude-cli

# 手动安装的
sudo rm /usr/local/bin/claude
```

### Windows
```bash
# Scoop 安装的
scoop uninstall claude

# npm 安装的
npm uninstall -g @anthropic-ai/claude-cli
```

### Linux
```bash
# 包管理器安装的
sudo apt remove claude  # Ubuntu/Debian
sudo yum remove claude   # CentOS/RHEL

# 手动安装的
sudo rm /usr/local/bin/claude
```

## 更新方法

```bash
# Homebrew
brew upgrade claude

# npm
npm update -g @anthropic-ai/claude-cli

# 手动更新
claude update
```

## 高级配置

### 自定义钩子
在 `~/.claude/hooks/` 目录创建钩子脚本：
```bash
#!/bin/bash
# pre-commit.sh
echo "正在运行预提交检查..."
npm run lint && npm run test
```

### 插件管理
```bash
# 安装插件
claude plugin install <plugin-name>

# 列出插件
claude plugin list

# 卸载插件
claude plugin uninstall <plugin-name>
```

## 支持与反馈
- 官方文档：https://docs.anthropic.com/claude-cli
- GitHub 仓库：https://github.com/anthropics/claude-cli
- 问题反馈：https://github.com/anthropics/claude-cli/issues

---
*最后更新：2025年1月*