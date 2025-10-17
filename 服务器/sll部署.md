Nginx SSL证书配置完整教程

  目录

  1. #准备工作
  2. #方案一lets-encrypt免费证书
  3. #方案二腾讯云ssl证书
  4. #方案三阿里云ssl证书
  5. #方案四其他商业证书
  6. #安全加固配置
  7. #常见问题排查

---
  准备工作

  1. 环境要求

  - Ubuntu/Debian 服务器（CentOS类似）
  - Nginx已安装
  - 域名已解析到服务器IP
  - 开放80和443端口

  2. 检查端口和服务

  # 检查Nginx是否运行
  sudo systemctl status nginx

  # 检查端口是否开放
  sudo netstat -tlnp | grep -E ':(80|443)'

  # 检查防火墙
  sudo ufw status

  3. 验证域名解析

  # 检查域名解析
  nslookup your-domain.com
  dig your-domain.com

---
  方案一：Let's Encrypt免费证书

  适用场景

  - 个人网站、小型项目
  - 需要快速部署SSL
  - 预算有限
  - 证书自动续期

  配置步骤

  1. 安装Certbot

  # Ubuntu/Debian
  sudo apt update
  sudo apt install -y certbot python3-certbot-nginx

  # CentOS/RHEL
  sudo yum install -y certbot python3-certbot-nginx

  2. 配置Nginx域名

  # 编辑Nginx配置
  sudo nano /etc/nginx/sites-available/default

  # 确保有server_name配置
  server {
      listen 80;
      server_name your-domain.com www.your-domain.com;
      root /var/www/html;
  }

  # 测试配置
  sudo nginx -t

  # 重载Nginx
  sudo systemctl reload nginx

  3. 申请证书

  # 自动配置模式（推荐）
  sudo certbot --nginx -d your-domain.com -d www.your-domain.com

  # 仅申请证书模式
  sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

  # 无邮箱注册（不推荐）
  sudo certbot --nginx -d your-domain.com --register-unsafely-without-email --agree-tos --non-interactive
  --redirect

  4. 验证证书

  # 查看已安装证书
  sudo certbot certificates

  # 测试续期
  sudo certbot renew --dry-run

  5. 自动续期配置

  # 检查续期定时器
  sudo systemctl status certbot.timer

  # 如未启用，启用它
  sudo systemctl enable certbot.timer
  sudo systemctl start certbot.timer

---
  方案二：腾讯云SSL证书

  适用场景

  - 企业网站
  - 需要商业支持
  - 更长的证书有效期
  - 备案网站

  配置步骤

  1. 下载证书

  1. 登录腾讯云控制台 → SSL证书管理
  2. 找到已申请的证书，点击"下载"
  3. 选择 Nginx 版本下载
  4. 解压得到以下文件：

    - domain.com_bundle.crt - 证书文件
    - domain.com.key - 私钥文件

  2. 上传证书到服务器

  # 本地电脑执行（替换路径和IP）
  scp domain.com_bundle.crt root@your-server-ip:/tmp/
  scp domain.com.key root@your-server-ip:/tmp/

  3. 在服务器上配置证书

  # 创建证书目录
  sudo mkdir -p /etc/nginx/ssl
  sudo chmod 755 /etc/nginx/ssl

  # 移动证书文件
  sudo mv /tmp/domain.com_bundle.crt /etc/nginx/ssl/
  sudo mv /tmp/domain.com.key /etc/nginx/ssl/

  # 设置权限
  sudo chmod 644 /etc/nginx/ssl/domain.com_bundle.crt
  sudo chmod 600 /etc/nginx/ssl/domain.com.key

  4. 配置Nginx

  sudo nano /etc/nginx/sites-available/default

  添加以下配置：
  # HTTP跳转HTTPS
  server {
      listen 80;
      listen [::]:80;
      server_name your-domain.com www.your-domain.com;
      return 301 https://$host$request_uri;
  }

  # HTTPS配置
  server {
      listen 443 ssl http2;
      listen [::]:443 ssl http2;

      server_name your-domain.com www.your-domain.com;
    
      root /var/www/html;
      index index.html index.htm;
    
      # 腾讯云SSL证书
      ssl_certificate /etc/nginx/ssl/domain.com_bundle.crt;
      ssl_certificate_key /etc/nginx/ssl/domain.com.key;
    
      # SSL配置
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_ciphers HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers on;
      ssl_session_cache shared:SSL:10m;
      ssl_session_timeout 10m;
    
      location / {
          try_files $uri $uri/ =404;
      }
  }

  5. 测试并重启

  # 测试配置
  sudo nginx -t

  # 重载Nginx
  sudo systemctl reload nginx

  # 查看服务状态
  sudo systemctl status nginx

---
  方案三：阿里云SSL证书

  配置步骤（与腾讯云类似）

  1. 下载证书

  1. 登录阿里云控制台 → SSL证书
  2. 下载 Nginx/Tengine 版本
  3. 解压得到：

    - domain.pem - 证书文件
    - domain.key - 私钥文件

  2. 上传并配置

  # 上传证书
  sudo mkdir -p /etc/nginx/ssl
  scp domain.pem root@server:/etc/nginx/ssl/
  scp domain.key root@server:/etc/nginx/ssl/

  # 设置权限
  sudo chmod 644 /etc/nginx/ssl/domain.pem
  sudo chmod 600 /etc/nginx/ssl/domain.key

  3. Nginx配置

  server {
      listen 443 ssl http2;
      server_name your-domain.com;

      # 阿里云证书
      ssl_certificate /etc/nginx/ssl/domain.pem;
      ssl_certificate_key /etc/nginx/ssl/domain.key;
    
      # 其他配置同上...
  }

---
  方案四：其他商业证书

  支持的证书类型

  - GoDaddy
  - DigiCert
  - Comodo
  - GlobalSign
  - 等其他CA机构

  通用配置步骤

  1. 证书文件准备

  通常包含：
  - 证书文件：.crt、.pem、.cer
  - 私钥文件：.key
  - 证书链文件（可选）：ca-bundle.crt、chain.pem

  2. 合并证书链（如需要）

  # 如果证书和证书链是分开的
  cat domain.crt intermediate.crt root.crt > domain_fullchain.crt

  3. 转换证书格式（如需要）

  # PFX转PEM
  openssl pkcs12 -in cert.pfx -out cert.pem -nodes

  # CER转PEM
  openssl x509 -inform der -in cert.cer -out cert.pem

  # 提取私钥
  openssl pkcs12 -in cert.pfx -nocerts -out key.pem -nodes

  4. 配置Nginx

  server {
      listen 443 ssl http2;
      server_name your-domain.com;

      ssl_certificate /etc/nginx/ssl/domain_fullchain.crt;
      ssl_certificate_key /etc/nginx/ssl/domain.key;
    
      # 其他配置...
  }

---
  安全加固配置

  完整的安全Nginx配置

  server {
      listen 443 ssl http2;
      listen [::]:443 ssl http2;
      server_name your-domain.com;

      root /var/www/html;
      index index.html;
    
      # SSL证书
      ssl_certificate /etc/nginx/ssl/cert.crt;
      ssl_certificate_key /etc/nginx/ssl/cert.key;
    
      # SSL协议版本（禁用TLS 1.0和1.1）
      ssl_protocols TLSv1.2 TLSv1.3;
    
      # SSL加密套件
      ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-
  RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-R
  SA-AES256-GCM-SHA384';
      ssl_prefer_server_ciphers off;

      # SSL会话缓存
      ssl_session_cache shared:SSL:10m;
      ssl_session_timeout 1d;
      ssl_session_tickets off;
    
      # OCSP Stapling
      ssl_stapling on;
      ssl_stapling_verify on;
      resolver 8.8.8.8 8.8.4.4 valid=300s;
      resolver_timeout 5s;
    
      # 安全头
      add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
      location / {
          try_files $uri $uri/ =404;
      }
  }

---
  常见问题排查

  1. 证书验证失败

  问题：浏览器显示证书无效

  解决方案：
  # 检查证书是否正确
  openssl x509 -in /etc/nginx/ssl/cert.crt -text -noout

  # 检查证书和私钥是否匹配
  openssl x509 -noout -modulus -in cert.crt | openssl md5
  openssl rsa -noout -modulus -in cert.key | openssl md5
  # 两个MD5值应该相同

  # 验证证书链
  openssl verify -CAfile ca-bundle.crt cert.crt

  2. Nginx启动失败

  问题：配置错误导致Nginx无法启动

  解决方案：
  # 测试配置文件
  sudo nginx -t

  # 查看错误日志
  sudo tail -f /var/log/nginx/error.log

  # 检查证书文件权限
  ls -l /etc/nginx/ssl/

  # 检查证书文件路径是否正确
  sudo cat /etc/nginx/sites-available/default | grep ssl_certificate

  3. HTTP无法跳转HTTPS

  问题：访问HTTP不会自动跳转到HTTPS

  解决方案：
  # 添加HTTP到HTTPS重定向
  server {
      listen 80;
      server_name your-domain.com;
      return 301 https://$host$request_uri;
  }

  4. 证书过期

  问题：证书已过期

  解决方案：
  # Let's Encrypt证书续期
  sudo certbot renew

  # 商业证书需要重新下载并替换
  # 按照上述步骤重新配置

  5. 端口被占用

  问题：443端口被其他服务占用

  解决方案：
  # 查看占用443端口的进程
  sudo lsof -i :443

  # 如果是其他服务，停止它
  sudo systemctl stop [service-name]

  6. 测试SSL配置

  # 测试SSL连接
  openssl s_client -connect your-domain.com:443 -servername your-domain.com

  # 查看证书详情
  echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -text

  # 在线测试（推荐）
  # 访问：https://www.ssllabs.com/ssltest/

---
  验证配置

  1. 浏览器验证

  - 访问 https://your-domain.com
  - 检查地址栏是否显示🔒安全锁
  - 点击锁图标查看证书详情

  2. 命令行验证

  # 检查HTTPS响应
  curl -I https://your-domain.com

  # 检查HTTP跳转
  curl -I http://your-domain.com

  # 查看证书信息
  echo | openssl s_client -connect your-domain.com:443 -servername your-domain.com 2>/dev/null | openssl x509
  -noout -issuer -subject -dates

  3. 在线工具验证

  - SSL Labs: https://www.ssllabs.com/ssltest/
  - SSL Checker: https://www.sslshopper.com/ssl-checker.html

---
  最佳实践

  1. 定期更新证书：在证书过期前续期
  2. 备份私钥：妥善保管私钥文件
  3. 监控证书：设置证书过期提醒
  4. 使用强加密：禁用TLS 1.0/1.1，使用TLS 1.2/1.3
  5. 启用HSTS：强制浏览器使用HTTPS
  6. 配置证书链：确保包含完整证书链
  7. 定期安全测试：使用SSL Labs等工具检测

---
  快速参考

  常用命令

  # 测试Nginx配置
  sudo nginx -t

  # 重载Nginx
  sudo systemctl reload nginx

  # 重启Nginx
  sudo systemctl restart nginx

  # 查看证书
  sudo certbot certificates

  # 续期Let's Encrypt证书
  sudo certbot renew

  # 查看SSL错误日志
  sudo tail -f /var/log/nginx/error.log

  证书文件位置

  - Let's Encrypt: /etc/letsencrypt/live/domain.com/
  - 自定义位置: /etc/nginx/ssl/

  配置文件位置

  - Ubuntu/Debian: /etc/nginx/sites-available/default
  - CentOS/RHEL: /etc/nginx/nginx.conf 或 /etc/nginx/conf.d/

---
  配置完成！ 🎉