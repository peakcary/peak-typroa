# Claude Code + NVM 兼容性解决方案

## 问题描述

在使用 NVM 管理多个 Node.js 版本时，Claude Code 会遇到以下问题：
1. Claude Code 只安装在特定的 Node.js 版本中，切换版本后无法使用
2. Claude Code 需要 Node.js >= 18，在低版本（如 v16）中会报错：`ReferenceError: ReadableStream is not defined`
3. 每次切换 Node 版本都需要重新安装 Claude Code

## 解决方案概述

创建一个智能包装脚本，能够：
- 自动检测当前 Node.js 版本是否兼容 Claude Code
- 如果不兼容，自动切换到兼容的版本
- 如果目标版本没有安装 Claude Code，自动安装
- 确保无论在哪个 Node.js 版本下，`claude` 命令都能正常工作

## 实施步骤

### 1. 创建智能包装脚本

创建目录并写入脚本：

```bash
mkdir -p ~/bin
```

创建文件 `~/bin/claude`：

```bash
#!/bin/bash

# Claude Code 智能包装脚本
# 自动选择兼容的 Node.js 版本运行 Claude Code

# 获取当前 Node 版本
current_node_version() {
    node -v 2>/dev/null | sed 's/v//'
}

# 检查 Node 版本是否兼容 Claude Code (需要 >= 18.0.0)
is_compatible_version() {
    local version=$1
    if [ -z "$version" ]; then
        return 1
    fi
    
    # 提取主版本号
    local major_version=$(echo $version | cut -d. -f1)
    
    # Claude Code 需要 Node >= 18
    if [ "$major_version" -ge 18 ]; then
        return 0
    else
        return 1
    fi
}

# 查找兼容的 Node 版本
find_compatible_node() {
    # 检查是否有 nvm
    if [ ! -f "$HOME/.nvm/nvm.sh" ]; then
        echo "Error: nvm not found. Please install nvm or use Node.js >= 18" >&2
        exit 1
    fi
    
    # 加载 nvm
    source "$HOME/.nvm/nvm.sh"
    
    # 按优先级顺序检查版本
    local preferred_versions=("22" "20" "18")
    
    for version in "${preferred_versions[@]}"; do
        if nvm ls "$version" >/dev/null 2>&1; then
            echo "$version"
            return 0
        fi
    done
    
    # 如果没找到首选版本，查找任何 >= 18 的版本
    local available_versions=$(nvm ls --no-colors 2>/dev/null | grep -E 'v[0-9]+\.[0-9]+\.[0-9]+' | sed 's/.*v\([0-9]*\)\..*/\1/' | sort -nu)
    
    for version in $available_versions; do
        if [ "$version" -ge 18 ]; then
            echo "$version"
            return 0
        fi
    done
    
    echo "Error: No compatible Node.js version found (需要 >= 18.0.0)" >&2
    echo "请安装 Node.js 18 或更高版本: nvm install 22" >&2
    exit 1
}

# 主逻辑
main() {
    local current_version=$(current_node_version)
    
    # 检查当前版本是否兼容
    if is_compatible_version "$current_version"; then
        # 使用当前版本的 Claude Code
        local claude_path="$HOME/.nvm/versions/node/v$current_version/bin/claude"
        if [ -f "$claude_path" ]; then
            exec "$claude_path" "$@"
        else
            # 当前版本没有 Claude Code，安装它
            echo "当前 Node.js v$current_version 没有安装 Claude Code，正在安装..." >&2
            npm install -g @anthropic-ai/claude-code
            exec "$claude_path" "$@"
        fi
    else
        # 当前版本不兼容，切换到兼容版本
        echo "当前 Node.js v$current_version 不兼容 Claude Code (需要 >= 18)" >&2
        
        local compatible_version=$(find_compatible_node)
        echo "切换到 Node.js v$compatible_version..." >&2
        
        # 加载 nvm 并切换版本
        source "$HOME/.nvm/nvm.sh"
        nvm use "$compatible_version" >/dev/null
        
        # 获取完整的 Node 版本号
        local full_version=$(nvm current)
        local claude_path="$HOME/.nvm/versions/node/$full_version/bin/claude"
        
        if [ ! -f "$claude_path" ]; then
            echo "在 Node.js $full_version 中安装 Claude Code..." >&2
            npm install -g @anthropic-ai/claude-code
        fi
        
        exec "$claude_path" "$@"
    fi
}

main "$@"
```

### 2. 设置执行权限

```bash
chmod +x ~/bin/claude
```

### 3. 配置 PATH 优先级

在 shell 配置文件中添加 `~/bin` 到 PATH 的最前面：

**对于 zsh（macOS 默认）：**
```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
```

**对于 bash：**
```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bash_profile
```

### 4. 重新加载配置

```bash
# 对于 zsh
source ~/.zshrc

# 对于 bash
source ~/.bash_profile
```

### 5. 安装兼容的 Node.js 版本

确保至少有一个 Node.js >= 18 的版本：

```bash
# 安装 Node.js 22（推荐）
nvm install 22

# 或者安装其他兼容版本
nvm install 20
nvm install 18
```

### 6. 在兼容版本中安装 Claude Code

```bash
nvm use 22
npm install -g @anthropic-ai/claude-code
```

## 验证安装

测试不同 Node.js 版本下的 Claude Code：

```bash
# 测试兼容版本
nvm use 22
claude --version  # 应该直接运行

# 测试不兼容版本
nvm use 16
claude --version  # 应该自动切换到兼容版本并运行
```

## 工作原理

1. **版本检测**：脚本检查当前 Node.js 版本是否 >= 18
2. **智能切换**：如果当前版本不兼容，自动切换到可用的兼容版本
3. **自动安装**：如果目标版本没有 Claude Code，自动安装
4. **透明使用**：用户无需关心版本切换，`claude` 命令始终可用

## 故障排除

### 问题：`which claude` 仍然指向旧路径

**解决方案**：
1. 检查 PATH 设置：`echo $PATH`
2. 确保 `~/bin` 在最前面
3. 重启终端或重新加载配置

### 问题：NVM 未找到

**解决方案**：
确保 NVM 正确安装并在 shell 配置文件中加载：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

### 问题：权限错误

**解决方案**：
```bash
chmod +x ~/bin/claude
```

## 卸载方法

如果需要回到原来的设置：

1. 删除智能脚本：`rm ~/bin/claude`
2. 从 shell 配置文件中移除 PATH 修改
3. 重新加载配置：`source ~/.zshrc`

## 优势

✅ **无缝体验**：无论使用哪个 Node.js 版本，Claude Code 都能正常工作  
✅ **自动管理**：自动处理版本兼容性和安装  
✅ **节省资源**：只需在一个版本中安装 Claude Code  
✅ **向后兼容**：不影响现有的 Node.js 项目和工作流  

## 注意事项

⚠️ 此方案需要至少安装一个 Node.js >= 18 的版本  
⚠️ 首次在新版本中运行可能需要等待自动安装  
⚠️ 如果删除了所有兼容的 Node.js 版本，需要重新安装  