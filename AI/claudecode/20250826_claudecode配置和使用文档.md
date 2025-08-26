Claude Code 配置与使用文档

  概述

  本文档详细介绍如何配置和使用 Claude Code 的多配置切换功能，支持在不同 API 提供商之间快速切换，并设置默认配置。

  1. 基础配置

  1.1 安装 Claude Code

  npm install -g @anthropic-ai/claude-code

  1.2 配置文件结构

  Claude Code 的配置文件位于 ~/.config/claude-code/settings.json：

  {
    "profiles": {
      "mac": {
        "apiKey": "sk-ant-api03-xxxxxxxx",
        "baseUrl": "https://api.aicodemirror.com/api/claudecode"
      },
      "gac": {
        "apiKey": "sk-ant-oat01-xxxxxxxx",
        "baseUrl": "https://gaccode.com/claudecode"
      },
      "cac": {
        "apiKey": "sk-ant-api03-xxxxxxxx",
        "baseUrl": "https://api.claudecode-cn.com/api/claudecode"
      },
      "aac": {
        "apiKey": "sk-dRO7xxxxxxxx",
        "baseUrl": "https://api.csmindai.com"
      }
    },
    "activeProfile": "gac"
  }

  2. Shell 环境配置

  2.1 在 ~/.zshrc 中添加配置

  在 ~/.zshrc 文件末尾添加以下内容：

  # Claude Code Environment Variables (默认配置)
  export ANTHROPIC_BASE_URL="https://gaccode.com/claudecode"
  export ANTHROPIC_API_KEY="sk-ant-oat01-xxxxxxxx"
  export ANTHROPIC_AUTH_TOKEN=""
  # End Claude Code Environment Variables

  # Claude Code 别名配置
  alias claude='/Users/用户名/.nvm/versions/node/v20.18.0/bin/claude'

  注意事项：
  - 将 用户名 替换为实际的用户名
  - 根据实际的 Node.js 版本调整路径
  - API Key 和 Base URL 应该对应默认要使用的配置

  2.2 NVM 用户特殊配置

  如果使用 NVM 管理 Node.js 版本，建议：

  1. 在当前使用的 Node.js 版本下全局安装 Claude Code
  2. 添加别名指向具体的安装路径，避免切换 Node.js 版本时找不到 claude 命令

  3. Claude Switch 脚本安装

  3.1 创建脚本文件

  创建 /usr/local/bin/claude-switch 文件：

  #!/bin/bash

  # Claude Code Profile Switcher
  SETTINGS_FILE="$HOME/.config/claude-code/settings.json"

  show_help() {
      echo "Claude Code Profile Switcher"
      echo ""
      echo "用法:"
      echo "  claude-switch [profile-name]    切换到指定配置"
      echo "  claude-switch [profile-name] --set-default  切换配置并设为默认"
      echo "  claude-switch list             列出所有配置"
      echo "  claude-switch current          显示当前配置"
      echo "  claude-switch help             显示帮助"
      echo ""
      echo "示例:"
      echo "  claude-switch gac              切换到gac配置(仅当前会话)"
      echo "  claude-switch gac --set-default 切换到gac配置并设为默认"
  }

  list_profiles() {
      if [[ ! -f "$SETTINGS_FILE" ]]; then
          echo "配置文件不存在: $SETTINGS_FILE"
          return 1
      fi

      echo "可用的配置文件:"
      python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      active = data.get('activeProfile', 'default')
      for profile in data.get('profiles', {}).keys():
          marker = '* ' if profile == active else '  '
          print(f'{marker}{profile}')
  "
  }

  get_current_profile() {
      if [[ ! -f "$SETTINGS_FILE" ]]; then
          echo "default"
          return
      fi

      python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print(data.get('activeProfile', 'default'))
  "
  }

  update_zshrc_default() {
      local profile="$1"
      local zshrc_file="$HOME/.zshrc"

      # 获取配置信息
      local api_key=$(python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print(data['profiles']['$profile']['apiKey'])
  ")

      local base_url=$(python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print(data['profiles']['$profile']['baseUrl'])
  ")

      # 更新.zshrc中的环境变量
      if [[ -f "$zshrc_file" ]]; then
          # 使用sed替换环境变量
          sed -i '' "s|^export ANTHROPIC_BASE_URL=.*|export ANTHROPIC_BASE_URL=\"$base_url\"|" "$zshrc_file"
          sed -i '' "s|^export ANTHROPIC_API_KEY=.*|export ANTHROPIC_API_KEY=\"$api_key\"|" "$zshrc_file"
    
          echo "已更新 ~/.zshrc 中的默认配置"
          echo "请运行 'source ~/.zshrc' 或重启终端来应用更改"
      else
          echo "警告: 未找到 ~/.zshrc 文件"
      fi
  }

  switch_profile() {
      local profile="$1"
      local set_default="$2"

      if [[ ! -f "$SETTINGS_FILE" ]]; then
          echo "配置文件不存在: $SETTINGS_FILE"
          return 1
      fi
    
      # 检查配置是否存在
      local exists=$(python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print('$profile' in data.get('profiles', {}))
  ")

      if [[ "$exists" != "True" ]]; then
          echo "配置 '$profile' 不存在"
          echo ""
          list_profiles
          return 1
      fi
    
      # 更新活动配置
      python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
  data['activeProfile'] = '$profile'
  with open('$SETTINGS_FILE', 'w') as f:
      json.dump(data, f, indent=2)
  "

      # 如果指定了--set-default，更新.zshrc
      if [[ "$set_default" == "--set-default" ]]; then
          update_zshrc_default "$profile"
      fi
    
      # 设置当前会话环境变量
      local api_key=$(python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print(data['profiles']['$profile']['apiKey'])
  ")

      local base_url=$(python3 -c "
  import json
  with open('$SETTINGS_FILE') as f:
      data = json.load(f)
      print(data['profiles']['$profile']['baseUrl'])
  ")

      export ANTHROPIC_API_KEY="$api_key"
      export ANTHROPIC_BASE_URL="$base_url"
    
      echo "已切换到配置: $profile"
      echo "API Base URL: $base_url"
    
      # 如果没有其他参数，启动claude
      if [[ $# -eq 1 ]] || [[ $# -eq 2 && "$set_default" == "--set-default" ]]; then
          claude
      fi
  }

  case "$1" in
      "list"|"ls")
          list_profiles
          ;;
      "current")
          echo "当前配置: $(get_current_profile)"
          ;;
      "help"|"--help"|"-h"|"")
          show_help
          ;;
      *)
          switch_profile "$@"
          ;;
  esac

  3.2 设置脚本权限

  chmod +x /usr/local/bin/claude-switch

  4. 使用方法

  4.1 基本命令

  # 查看所有可用配置
  claude-switch list

  # 查看当前配置
  claude-switch current

  # 临时切换配置（仅当前会话生效）
  claude-switch gac

  # 永久切换配置（更新默认配置）
  claude-switch mac --set-default

  # 查看帮助
  claude-switch help

  4.2 配置切换说明

  临时切换

  - 使用 claude-switch [profile-name]
  - 只影响当前终端会话
  - 重新打开终端后会恢复默认配置

  永久切换

  - 使用 claude-switch [profile-name] --set-default
  - 会同时更新 settings.json 和 ~/.zshrc
  - 成为新的默认配置，重新打开终端仍然生效
  - 需要运行 source ~/.zshrc 或重启终端来应用更改

  5. 新电脑配置步骤

  5.1 按顺序执行以下步骤

  1. 安装 Node.js 和 NVM（如果使用 NVM）
  2. 安装 Claude Code
    npm install -g @anthropic-ai/claude-code
  3. 创建配置文件
    mkdir -p ~/.config/claude-code

  3. 创建 ~/.config/claude-code/settings.json，内容参考上面的配置文件结构。
  4. 配置 Shell 环境

  4. 在 ~/.zshrc（或 ~/.bashrc）中添加：
  # Claude Code Environment Variables
  export ANTHROPIC_BASE_URL="你的默认API地址"
  export ANTHROPIC_API_KEY="你的默认API密钥"
  export ANTHROPIC_AUTH_TOKEN=""
  # End Claude Code Environment Variables

  # Claude Code 别名（根据实际路径调整）
  alias claude='/path/to/your/claude/installation'
  5. 创建 claude-switch 脚本

  5. 将上面的脚本内容保存到 /usr/local/bin/claude-switch 并设置执行权限。
  6. 重新加载 Shell 配置
    source ~/.zshrc

  5.2 验证配置

  # 检查默认配置
  claude --version

  # 检查配置切换
  claude-switch list
  claude-switch current

  # 测试切换功能
  claude-switch gac --set-default

  6. 故障排除

  6.1 常见问题

  问题1：claude 命令找不到
  - 检查 NODE_PATH 和 alias 配置
  - 确认 Claude Code 已正确安装

  问题2：API 密钥无效
  - 检查 API 密钥是否正确
  - 确认 Base URL 是否可访问

  问题3：配置切换不生效
  - 运行 source ~/.zshrc 重新加载配置
  - 重启终端
  - 检查 settings.json 格式是否正确

  6.2 调试命令

  # 检查环境变量
  echo $ANTHROPIC_API_KEY
  echo $ANTHROPIC_BASE_URL

  # 检查配置文件
  cat ~/.config/claude-code/settings.json

  # 检查 claude-switch 权限
  ls -la /usr/local/bin/claude-switch

  7. 安全注意事项

  - 不要将包含 API 密钥的配置文件提交到版本控制系统
  - 定期更换 API 密钥
  - 妥善保管配置文件的访问权限

  # 设置配置文件权限（仅当前用户可读写）
  chmod 600 ~/.config/claude-code/settings.json

  8. 高级配置

  8.1 添加新的 API 提供商

  在 settings.json 的 profiles 部分添加新配置：

  "new_provider": {
    "apiKey": "your-api-key",
    "baseUrl": "https://your-api-endpoint.com"
  }

  8.2 自定义别名

  可以在 shell 配置中添加更多便捷别名：

  alias cs='claude-switch'
  alias csl='claude-switch list'
  alias csc='claude-switch current'

  这样就可以使用更短的命令如 cs gac --set-default。