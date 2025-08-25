# Claude Code 多配置管理配置文档

## 概述

本文档提供了完整的 Claude Code 多配置管理解决方案，允许你轻松在不同的 API 密钥和端点之间切换。

## 配置步骤

### 1. 创建配置文件

创建 Claude Code 配置目录和设置文件：

```bash
# 创建配置目录（如果不存在）
mkdir -p ~/.config/claude-code

# 创建配置文件
cat > ~/.config/claude-code/settings.json << 'EOF'
{
  "profiles": {
    "mac": {
      "apiKey": "你的-mac-api-密钥",
      "baseUrl": "https://api.aicodemirror.com/api/claudecode"
    },
    "gac": {
      "apiKey": "你的-gac-api-密钥",
      "baseUrl": "https://gaccode.com/claudecode"
    },
    "cac": {
      "apiKey": "你的-cac-api-密钥",
      "baseUrl": "https://api.claudecode-cn.com/api/claudecode"
    }
  },
  "activeProfile": "mac"
}
EOF
```

**重要：** 将上面的示例密钥替换为你的真实 API 密钥。

### 2. 创建配置切换脚本

创建主要的配置切换脚本：

```bash
cat > ~/claude-switch << 'EOF'
#!/bin/bash

# Claude Code Profile Switcher
SETTINGS_FILE="$HOME/.config/claude-code/settings.json"

show_help() {
    echo "Claude Code Profile Switcher"
    echo ""
    echo "用法:"
    echo "  claude-switch [profile-name]    切换到指定配置"
    echo "  claude-switch list             列出所有配置"  
    echo "  claude-switch current          显示当前配置"
    echo "  claude-switch help             显示帮助"
    echo ""
    echo "示例:"
    echo "  claude-switch mac              切换到mac配置"
    echo "  claude-switch gac              切换到gac配置"
    echo "  claude-switch cac              切换到cac配置"
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
    active = data.get('activeProfile', 'mac')
    for profile in data.get('profiles', {}).keys():
        marker = '* ' if profile == active else '  '
        print(f'{marker}{profile}')
"
}

get_current_profile() {
    if [[ ! -f "$SETTINGS_FILE" ]]; then
        echo "mac"
        return
    fi
    
    python3 -c "
import json
with open('$SETTINGS_FILE') as f:
    data = json.load(f)
    print(data.get('activeProfile', 'mac'))
"
}

switch_profile() {
    local profile="$1"
    
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
    
    # 设置环境变量
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
    
    # 启动claude
    if [[ $# -gt 1 ]]; then
        claude "${@:2}"
    else
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
EOF
```

### 3. 设置脚本权限

```bash
# 使脚本可执行
chmod +x ~/claude-switch

# 创建全局可访问的软链接
sudo ln -sf ~/claude-switch /usr/local/bin/claude-switch
```

### 4. 创建简化的环境变量脚本（可选）

```bash
cat > ~/claude-profiles.sh << 'EOF'
#!/bin/bash

# 简化的环境变量配置脚本
# 使用方法: source claude-profiles.sh

claude_mac() {
    export ANTHROPIC_API_KEY="你的-mac-api-密钥"
    export ANTHROPIC_BASE_URL="https://api.aicodemirror.com/api/claudecode"
    echo "已切换到MAC配置"
}

claude_gac() {
    export ANTHROPIC_API_KEY="你的-gac-api-密钥"
    export ANTHROPIC_BASE_URL="https://gaccode.com/claudecode"
    echo "已切换到GAC配置"
}

claude_cac() {
    export ANTHROPIC_API_KEY="你的-cac-api-密钥" 
    export ANTHROPIC_BASE_URL="https://api.claudecode-cn.com/api/claudecode"
    echo "已切换到CAC配置"
}

# 显示当前配置
claude_current() {
    echo "当前API密钥: ${ANTHROPIC_API_KEY:0:20}..."
    echo "当前Base URL: $ANTHROPIC_BASE_URL"
}
EOF
```

## 使用方法

### 方法一：使用配置切换脚本（推荐）

```bash
# 列出所有配置
claude-switch list

# 查看当前配置
claude-switch current

# 切换到不同配置并启动claude
claude-switch mac    # 切换到mac配置
claude-switch gac    # 切换到gac配置
claude-switch cac    # 切换到cac配置

# 显示帮助
claude-switch help
```

### 方法二：使用环境变量函数

```bash
# 加载函数到当前shell
source ~/claude-profiles.sh

# 切换配置
claude_mac      # 切换到MAC配置
claude_gac      # 切换到GAC配置
claude_cac      # 切换到CAC配置
claude_current  # 查看当前配置

# 启动claude
claude
```

### 方法三：直接设置环境变量

```bash
# 临时切换
export ANTHROPIC_API_KEY="你的api密钥"
export ANTHROPIC_BASE_URL="https://你的端点.com"
claude

# 一条命令启动
ANTHROPIC_API_KEY="密钥" ANTHROPIC_BASE_URL="端点" claude
```

## 配置文件说明

配置文件位置：`~/.config/claude-code/settings.json`

结构说明：
```json
{
  "profiles": {
    "配置名称": {
      "apiKey": "API密钥",
      "baseUrl": "基础URL"
    }
  },
  "activeProfile": "当前激活的配置名称"
}
```

## 故障排除

### 常见问题

1. **JSON 语法错误**
   - 确保配置文件格式正确
   - 检查逗号和括号是否匹配
   - 确保所有字符串都用双引号包围

2. **权限问题**
   ```bash
   chmod +x ~/claude-switch
   ```

3. **Python 找不到**
   - 确保系统安装了 Python 3
   - 可能需要将 `python3` 改为 `python`

4. **配置不存在错误**
   - 确保 `activeProfile` 的值在 `profiles` 中存在
   - 使用 `claude-switch list` 查看可用配置

### 验证配置

```bash
# 验证JSON格式
python3 -m json.tool ~/.config/claude-code/settings.json

# 测试脚本
claude-switch list
claude-switch current
```

## 添加新配置

编辑 `~/.config/claude-code/settings.json`，在 `profiles` 中添加新的配置项：

```json
"新配置名": {
  "apiKey": "新的API密钥",
  "baseUrl": "新的基础URL"
}
```

## 安全建议

- 不要将包含真实 API 密钥的配置文件提交到版本控制系统
- 定期更换 API 密钥
- 为配置文件设置合适的权限：`chmod 600 ~/.config/claude-code/settings.json`

## 版本兼容性

本配置方案适用于：
- macOS / Linux
- 需要 Python 3
- 需要 bash shell
- Claude Code CLI 工具

---

**注意：** 请务必将示例中的 API 密钥替换为你的真实密钥！