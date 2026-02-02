很好！你已经成功安装了 everything-claude-code 插件。现在让我来介绍如何使用它。

  🚀 快速开始使用

  1. 查看可用的技能和命令

  # 查看插件中可用的所有组件
  /plugin list everything-claude-code@everything-claude-code

  # 或者直接使用具体命令
  /help

  2. 复制规则文件（必需）

  由于 Claude Code 插件系统限制，你需要手动复制规则文件：

  # 创建规则目录（如果不存在）
  mkdir -p ~/.claude/rules

  # 复制规则文件
  cp -r ~/.claude/plugins/everything-claude-code/rules/* ~/.claude/rules/

  3. 常用技能使用示例

  现在你可以使用各种技能了：

  📋 项目规划

  /plan "添加用户认证功能"
  /plan "重构API架构"

  🧪 测试驱动开发

  /tdd "实现用户注册功能"
  /tdd "修复登录页面的bug"

  🔍 代码审查

  /code-review "审查新添加的代码"
  /python-review "审查Python代码"
  /go-review "审查Go代码"

  📊 端到端测试

  /e2e "生成用户注册的端到端测试"

  🛠️ 构建修复

  /build-fix "修复构建错误"
  /go-build "修复Go构建错误"

  🧠 连续学习

  /learn                  # 从当前会话中提取模式
  /instinct-status        # 查看学习到的本能
  /instinct-export        # 导出本能分享给团队

  4. 使用具体技能

  这个插件包含了大量针对特定场景的技能：

  Backend 开发

  # 使用后端模式技能
  /backend-patterns

  # Django 相关
  /django-patterns
  /django-security
  /django-tdd

  # Spring Boot 相关
  /springboot-patterns
  /springboot-security
  /springboot-tdd

  # Node.js 相关
  /coding-standards

  数据库相关

  postgres-patterns
  clickhouse-io
  jpa-patterns

  测试相关

  tdd-workflow
  python-testing
  golang-testing

  5. 查看技能详情

  每个技能都有详细的文档：

  # 使用问号查看技能帮助
  /plan?

  # 查看具体技能文档
  /backend-patterns?

  6. 自动化钩子

  插件会自动启用一些钩子：
  - 记忆持久化：自动保存/加载上下文
  - 战略性压缩：智能上下文压缩建议
  - 会话评估：从会话中提取学习模式

  7. MCP 服务器配置

  插件还包含了一些 MCP 服务器配置：
  # 查看 MCP 配置
  cat ~/.claude/plugins/everything-claude-code/mcp-configs/mcp-servers.json

  🎯 实际使用场景

  1. 新功能开发：
    /plan "实现支付功能"
    /tdd "编写支付相关测试"
    /code-review "审查支付代码"
  2. 代码重构：
    /refactor-clean "清理死代码"
    /plan "重构用户模块"
  3. 问题排查：
    /build-fix "修复构建错误"
    /e2e "编写端到端测试"
  4. 代码质量：
    /code-review "全项目代码审查"
    /python-review "审查Python文件"

  现在你已经有了一个功能丰富的 Claude Code 开发环境，可以大大提升开发效率和质量！

















































1. 查看可用的技能

  # 查看插件提供的所有技能
  /plugin list everything-claude-code@everything-claude-code

  # 或者直接使用技能（试试看）
  /plan "创建一个待办事项应用"

  2. 常用技能示例

  现在你可以尝试使用以下技能：

  项目规划

  /plan "实现用户登录功能"
  /plan "添加支付模块"

  测试驱动开发

  /tdd "编写用户注册功能"
  /tdd "修复购物车bug"

  代码审查

  /code-review "审查新添加的代码"
  /python-review "审查Python代码"
  /go-review "审查Go代码"

  其他功能

  /build-fix "修复构建错误"
  /e2e "生成端到端测试"
  /learn "从当前会话学习模式"

  3. 技能会自动加载

  插件会自动加载：
  - 15+ 个智能代理（agents）
  - 30+ 个技能（skills）
  - 20+ 个命令（commands）
  - 自动钩子（hooks）用于记忆持久化等

  4. 规则已生效

  你已经有了以下规则：
  - security.md - 安全检查
  - coding-style.md - 编码风格
  - testing.md - 测试要求
  - git-workflow.md - Git工作流
  - agents.md - 代理使用指南
  - performance.md - 性能指南

  现在你就可以开始享受 enhanced Claude Code 开发体验了！试试输入 /plan 开始使用吧。