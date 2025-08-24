# Git中文文件名显示问题解决方案

## 问题描述
在使用Git时，中文文件名在`git status`、`git log`等命令中显示为编码形式（如：`\344\270\255\346\226\207.txt`），而不是正常的中文字符。

## 解决方案

### 方法一：全局设置（推荐）
```bash
git config --global core.quotepath false
```

### 方法二：仅对当前仓库设置
```bash
git config core.quotepath false
```

## 设置说明
- `core.quotepath false`：关闭Git对路径名的引用转义
- `--global`：应用于所有Git仓库
- 不加`--global`：仅应用于当前仓库

## 验证设置
设置完成后，可以通过以下命令验证：
```bash
git status
```

中文文件名应该能够正常显示。

## 其他相关设置（可选）
如果还有其他编码问题，可以考虑设置：
```bash
# 设置Git输出编码
git config --global core.editor "vim"
git config --global gui.encoding utf-8
git config --global i18n.commitencoding utf-8
git config --global i18n.logoutputencoding utf-8
```