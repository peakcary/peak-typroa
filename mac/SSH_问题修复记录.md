# SSH连接GitHub问题修复记录

## 问题描述

在执行 `git push origin main` 时出现SSH连接错误：

```
Connection closed by 20.205.243.166 port 22
fatal: Could not read from remote repository.
```

执行 `ssh -T git@github.com` 时出现：
```
kex_exchange_identification: read: Connection reset by peer
Connection reset by 20.205.243.166 port 22
```

## 问题分析

通过诊断发现以下问题：

1. **SSH配置错误**：
   - SSH配置中用户名设置为邮箱地址 `peakcary@163.com`，应该是 `git`
   - 使用443端口但主机名仍为 `github.com`，应该是 `ssh.github.com`

2. **Host Key缺失**：
   - GitHub SSH服务器的host key未添加到known_hosts文件

3. **网络环境**：
   - 标准SSH端口22可能被网络环境阻止
   - 需要使用GitHub提供的443端口作为替代

## 修复方案

### 1. 修改SSH配置文件

**文件位置**：`~/.ssh/config`

**修改前**：
```
Host github.com  
 HostName github.com  
User peakcary@163.com 
 IdentityFile ~/.ssh/id_rsa_github 
Port 443
```

**修改后**：
```
Host github.com  
 HostName ssh.github.com  
 User git
 IdentityFile ~/.ssh/id_rsa_github 
 Port 443
```

**关键修改**：
- `HostName`: `github.com` → `ssh.github.com`
- `User`: `peakcary@163.com` → `git`

### 2. 添加GitHub Host Key

执行命令添加GitHub的SSH host key：
```bash
ssh-keyscan -p 443 ssh.github.com >> ~/.ssh/known_hosts
```

## 修复结果

修复后测试连接：
```bash
ssh -T git@github.com
```

返回成功信息：
```
Hi peakcary! You've successfully authenticated, but GitHub does not provide shell access.
```

现在可以正常使用 `git push origin main` 进行代码推送。

## 技术说明

### 为什么使用443端口？

1. **防火墙友好**：443端口是HTTPS标准端口，通常不会被企业防火墙阻止
2. **GitHub官方支持**：GitHub官方提供 `ssh.github.com:443` 作为SSH over HTTPS的解决方案
3. **网络兼容性**：在限制性网络环境中提供更好的连接性

### SSH配置参数说明

- `Host`: 定义别名，当使用 `git@github.com` 时匹配此配置
- `HostName`: 实际连接的服务器地址
- `User`: SSH连接用户名，GitHub统一使用 `git`
- `IdentityFile`: 指定使用的私钥文件
- `Port`: 连接端口，443为HTTPS端口

## 预防措施

1. **定期检查SSH配置**：确保配置文件格式正确
2. **备份SSH密钥**：定期备份 `~/.ssh/` 目录下的密钥文件
3. **网络环境测试**：在新网络环境下先测试SSH连接再进行git操作

---

*修复时间*：2025-08-29  
*修复人*：Claude Code  
*状态*：已解决