 我已经创建了两份详细文档来帮助你配置HTTPS回调地址：

  📄 创建的文档

  1. 完整配置指南： docs/deployment/HTTPS_CALLBACK_SETUP.md
  2. 证书配置说明： backend/certs/README.md

---
  🚀 快速配置方案（选择其一）

  方案A：本地开发测试（使用内网穿透）

  适用场景： 开发阶段测试真实微信支付

  # 1. 安装 ngrok
  brew install ngrok

  # 2. 启动后端服务
  cd /Users/peakom/work/stock-analysis-system
  ./start.sh

  # 3. 启动 ngrok 隧道（映射后端端口）
  ngrok http 3007

  # 4. 获取 ngrok 提供的 HTTPS 地址，例如：
  # https://abc123def456.ngrok.io

  # 5. 修改 backend/.env 配置
  WECHAT_NOTIFY_URL=https://abc123def456.ngrok.io/api/v1/payment/notify
  BASE_URL=https://abc123def456.ngrok.io
  PAYMENT_MOCK_MODE=false  # 改为false以测试真实支付

  优点： ✅ 快速、无需服务器、立即测试缺点： ❌ 每次重启URL会变（免费版）

---
  方案B：使用模拟支付（推荐开发阶段）

  适用场景： 功能开发和测试，无需真实支付

  # 修改 backend/.env
  PAYMENT_MOCK_MODE=true
  WECHAT_NOTIFY_URL=http://localhost:3007/api/v1/payment/notify

  # 使用模拟支付API测试完整流程
  curl -X POST http://localhost:3007/api/v1/mock/simulate-payment/{订单号} \
    -H "Authorization: Bearer $TOKEN"

  优点： ✅ 无需配置、快速测试缺点： ❌ 不能测试真实微信支付

---
  方案C：生产环境部署（完整配置）

  适用场景： 正式上线

  1. 准备工作

  # 准备以下资源：
  # ✅ 域名（例如：yourdomain.com）
  # ✅ 服务器（公网IP）
  # ✅ SSL证书（Let's Encrypt免费）

  2. 获取SSL证书（Let's Encrypt）

  # 安装 Certbot
  sudo apt install certbot

  # 获取证书
  sudo certbot certonly --standalone -d yourdomain.com

  # 证书位置：
  # /etc/letsencrypt/live/yourdomain.com/fullchain.pem
  # /etc/letsencrypt/live/yourdomain.com/privkey.pem

  3. 修改配置文件

  修改 nginx/nginx.prod.conf：
  # 第82行 - 修改域名
  server_name yourdomain.com www.yourdomain.com;

  # 第101-102行 - SSL证书路径
  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

  修改 backend/.env：
  # 域名和回调配置
  BASE_URL=https://yourdomain.com
  WECHAT_NOTIFY_URL=https://yourdomain.com/api/v1/payment/notify

  # 微信AppID（必须修改为真实值！）
  WECHAT_APPID=wx你的真实AppID

  # 支付模式
  PAYMENT_MOCK_MODE=false

  4. 部署服务

  cd /Users/peakom/work/stock-analysis-system

  # 使用 Docker Compose 部署
  docker-compose -f docker-compose.prod.yml up -d

  5. 在微信商户平台配置

  1. 登录：https://pay.weixin.qq.com/
  2. 产品中心 → 开发配置
  3. 设置回调URL：https://yourdomain.com/api/v1/payment/notify

---
  🔍 配置验证

  检查配置是否正确

  cd /Users/peakom/work/stock-analysis-system/backend
  python check_payment_config.py

  测试HTTPS访问

  curl -I https://yourdomain.com
  # 应该返回 200 OK

---
  📊 当前配置状态总结

  根据之前的分析，你的项目：

  ✅ 已正确配置

  - 商户号：1725935616
  - API密钥：32字符（正确）
  - 证书文件：存在且格式正确
  - 证书序列号：正确

  ⚠️ 需要配置

  - WECHAT_APPID：需要改为真实AppID（当前是示例值）
  - WECHAT_NOTIFY_URL：需要配置HTTPS地址（当前是localhost）
  - BASE_URL：需要配置HTTPS域名

---
  💡 我的建议

  如果是开发测试阶段：
  1. 使用方案B（模拟支付）进行功能开发 ✅
  2. 需要测试真实支付时，临时使用方案A（ngrok）

  如果准备正式上线：
  1. 购买域名并配置DNS解析
  2. 获取SSL证书（Let's Encrypt免费）
  3. 按照方案C完整配置
  4. 在微信商户平台配置回调地址

---
  📚 详细文档位置

  所有配置步骤、命令、常见问题的详细说明都在：

  - docs/deployment/HTTPS_CALLBACK_SETUP.md - HTTPS回调完整配置指南
  - backend/certs/README.md - 证书配置说明

  你可以查看这两份文档获取更详细的信息！

  有任何问题随时问我！ 😊