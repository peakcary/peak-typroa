# Sequential Thinking MCP 服务器配置与使用指南

## 目录
1. [简介](#简介)
2. [前置要求](#前置要求)
3. [安装步骤](#安装步骤)
4. [配置方法](#配置方法)
5. [使用指南](#使用指南)
6. [功能特性](#功能特性)
7. [实际应用场景](#实际应用场景)
8. [故障排除](#故障排除)
9. [最佳实践](#最佳实践)

## 简介

Sequential Thinking MCP 服务器是一个专为复杂推理任务设计的 Model Context Protocol (MCP) 服务器。它提供增强的逻辑推理能力，能够将复杂问题分解为多个步骤，并进行系统性的分析和验证。

### 主要优势
- **逐步推理**：将复杂问题拆解为可管理的小步骤
- **验证机制**：每个推理步骤都经过验证
- **清晰思路**：展示完整的思考过程
- **决策支持**：提供系统性的方案对比和分析

## 前置要求

### 系统要求
- macOS、Linux 或 Windows
- Node.js 16+ 
- npm 或 yarn
- Claude Code CLI 已安装

### 检查环境
```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 Claude Code 是否已安装
claude-code --version
```

## 安装步骤

### 1. 安装 Sequential Thinking MCP 服务器

使用 npm 全局安装：
```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
```

或使用 yarn：
```bash
yarn global add @modelcontextprotocol/server-sequential-thinking
```

### 2. 验证安装
```bash
npx @modelcontextprotocol/server-sequential-thinking --help
```

预期输出：
```
Sequential Thinking MCP Server running on stdio
```

## 配置方法

### 1. 定位 Claude Code 配置目录

Claude Code 配置文件通常位于：
- **macOS**: `~/.config/claude-code/`
- **Linux**: `~/.config/claude-code/`
- **Windows**: `%APPDATA%\claude-code\`

### 2. 创建配置目录（如果不存在）
```bash
mkdir -p ~/.config/claude-code
```

### 3. 创建 MCP 服务器配置文件

在配置目录中创建或编辑 `mcp_servers.json` 文件：

```bash
nano ~/.config/claude-code/mcp_servers.json
```

### 4. 添加配置内容

#### 基础配置
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    }
  }
}
```

#### 高级配置（带参数）
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-sequential-thinking"],
      "env": {
        "THINKING_DEPTH": "3",
        "VERIFICATION_LEVEL": "high"
      }
    }
  }
}
```

#### 多服务器配置示例
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

### 5. 验证配置文件
```bash
# 检查 JSON 语法是否正确
cat ~/.config/claude-code/mcp_servers.json | jq .
```

### 6. 重启 Claude Code
```bash
# 退出当前会话
exit

# 重新启动 Claude Code
claude-code
```

## 使用指南

### 基本使用方法

Sequential Thinking 工具在以下情况下会自动激活：

1. **复杂问题分析**
2. **多步骤任务**
3. **需要深度推理的场景**
4. **系统设计和架构规划**

### 使用示例

#### 1. 算法设计
```
用户输入：设计一个高效的分布式锁算法

系统响应：
[自动调用 sequential-thinking 工具]
步骤1：分析分布式锁的基本需求
步骤2：评估现有算法的优缺点
步骤3：设计新的算法方案
步骤4：验证算法正确性
步骤5：分析性能特征
```

#### 2. 系统架构设计
```
用户输入：设计一个支持千万用户的社交媒体平台架构

系统响应：
[自动调用 sequential-thinking 工具]
步骤1：需求分析和用户画像
步骤2：技术栈选型
步骤3：微服务架构设计
步骤4：数据库设计
步骤5：缓存策略
步骤6：扩展性和可用性考虑
```

#### 3. 代码调试
```
用户输入：这段多线程代码出现竞态条件，帮我分析

系统响应：
[自动调用 sequential-thinking 工具]
步骤1：代码流程分析
步骤2：识别共享资源
步骤3：定位竞态条件
步骤4：分析可能的解决方案
步骤5：推荐最佳修复方法
```

### 手动调用

虽然通常自动激活，但也可以明确请求使用：

```
请用逐步推理的方式帮我分析这个问题：如何优化数据库查询性能？
```

## 功能特性

### 1. 逐步分解
- 将复杂问题分解为可管理的子问题
- 每个步骤都有明确的目标和输出
- 步骤间保持逻辑连贯性

### 2. 验证机制
- 每个推理步骤都经过内部验证
- 发现错误时会自动回溯和修正
- 提供置信度评估

### 3. 思维可视化
- 清晰展示推理过程
- 显示决策依据和考虑因素
- 便于理解和学习

### 4. 上下文保持
- 在整个推理过程中保持上下文
- 后续步骤可以引用前面的结论
- 支持递归和迭代思考

## 实际应用场景

### 开发场景

#### 1. 系统设计
```
场景：设计电商平台的订单系统
应用：
- 需求分析
- 数据模型设计
- API 设计
- 状态机设计
- 异常处理策略
```

#### 2. 性能优化
```
场景：Web 应用响应慢
应用：
- 性能瓶颈识别
- 优化方案制定
- 效果预估
- 实施计划
```

#### 3. 架构重构
```
场景：单体应用拆分为微服务
应用：
- 业务边界划分
- 服务依赖分析
- 数据迁移策略
- 渐进式重构计划
```

### 学习场景

#### 1. 技术学习
```
场景：学习新的编程语言或框架
应用：
- 学习路径规划
- 概念关联分析
- 实践项目设计
- 难点突破策略
```

#### 2. 问题解决
```
场景：解决复杂的技术问题
应用：
- 问题根因分析
- 解决方案对比
- 风险评估
- 实施步骤
```

## 故障排除

### 常见问题

#### 1. MCP 服务器启动失败
```bash
# 检查安装
npm list -g @modelcontextprotocol/server-sequential-thinking

# 重新安装
npm uninstall -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-sequential-thinking
```

#### 2. 配置文件语法错误
```bash
# 验证 JSON 语法
cat ~/.config/claude-code/mcp_servers.json | jq .

# 如果出错，检查：
# - 缺少逗号
# - 多余的逗号
# - 引号不匹配
# - 括号不匹配
```

#### 3. 工具不生效
- 确保已重启 Claude Code
- 检查配置文件路径是否正确
- 验证服务器是否正常运行

#### 4. 权限问题
```bash
# macOS/Linux
chmod +x ~/.config/claude-code/mcp_servers.json

# 检查目录权限
ls -la ~/.config/claude-code/
```

### 调试方法

#### 1. 查看日志
```bash
# 查看 Claude Code 日志
tail -f ~/.local/share/claude-code/logs/main.log
```

#### 2. 测试服务器
```bash
# 直接测试 MCP 服务器
npx @modelcontextprotocol/server-sequential-thinking
```

#### 3. 验证配置
```bash
# 使用 jq 美化 JSON
cat ~/.config/claude-code/mcp_servers.json | jq '.'
```

## 最佳实践

### 1. 配置优化
- 使用绝对路径避免路径问题
- 定期备份配置文件
- 为不同项目使用不同的配置

### 2. 使用技巧
- 明确描述问题，获得更好的分析
- 对于特别复杂的问题，可以先做初步分解
- 结合其他 MCP 服务器使用，提高效率

### 3. 问题描述
```
好的问题描述：
"设计一个支持高并发的消息队列系统，需要考虑可靠性、性能和扩展性"

不好的问题描述：
"怎么做消息队列？"
```

### 4. 维护更新
```bash
# 定期更新 MCP 服务器
npm update -g @modelcontextprotocol/server-sequential-thinking

# 检查版本
npm list -g @modelcontextprotocol/server-sequential-thinking
```

### 5. 性能优化
- 避免过于复杂的单次查询
- 合理使用环境变量控制行为
- 定期清理不需要的配置

## 结语

Sequential Thinking MCP 服务器是一个强大的推理增强工具，能够显著提升处理复杂问题的能力。通过本指南的详细配置和使用说明，你应该能够：

1. 成功安装和配置服务器
2. 理解其工作原理和使用场景
3. 在实际工作中有效应用
4. 解决常见的配置和使用问题

建议在使用过程中：
- 从简单问题开始熟悉工具
- 逐步尝试更复杂的应用场景
- 结合其他工具形成完整的工作流
- 定期更新和维护配置

如有问题，可以参考故障排除部分或查阅官方文档。

---

**文档版本**: 1.0  
**更新日期**: 2025-08-19  
**适用版本**: @modelcontextprotocol/server-sequential-thinking@latest