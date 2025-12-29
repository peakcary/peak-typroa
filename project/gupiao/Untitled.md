🚀 deploy.sh 完整执行过程详解

  📊 整体流程图

  ┌─────────────────────────────────────────────────────────────┐
  │                   deploy.sh 执行流程                          │
  └─────────────────────────────────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第1步: 初始化 & 参数解析          │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第2步: 环境检查                   │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第3步: 后端部署                   │
          │  (虚拟环境、依赖、表创建)         │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第4步: 前端部署                   │
          │  (端口配置、依赖安装)             │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第5步: 配置文件生成               │
          │  (ports.env、.env)                │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第6步: 数据库验证                 │
          │  (表检查、模型同步)               │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第7步: 数据库优化部署             │
          │  (性能优化、索引创建)             │
          └───────────────────────────────────┘
                              ↓
          ┌───────────────────────────────────┐
          │  第8步: 总结提示                   │
          │  (输出访问地址、下一步指引)       │
          └───────────────────────────────────┘

---
  第1步: 初始化 & 参数解析

  代码结构

  #!/bin/bash

  echo "🚀 股票分析系统部署 v2.7.0"
  echo "========================="
  echo "⚡ 新功能: CSV原始数据表 + 数据库性能优化"

  # 颜色定义 - 用于彩色输出
  RED='\033[0;31m'          # 红色(错误)
  GREEN='\033[0;32m'        # 绿色(成功)
  YELLOW='\033[1;33m'       # 黄色(警告)
  BLUE='\033[0;34m'         # 蓝色(信息)
  NC='\033[0m'              # 无颜色

  # 日志函数
  log_success() { echo -e "${GREEN}[✅]${NC} $1"; }
  log_warn() { echo -e "${YELLOW}[⚠️]${NC} $1"; }
  log_error() { echo -e "${RED}[❌]${NC} $1"; }

  # 固定端口配置
  BACKEND_PORT=3007
  CLIENT_PORT=8005
  FRONTEND_PORT=8006

  echo "📊 端口配置: API($BACKEND_PORT) | 客户端($CLIENT_PORT) | 管理端($FRONTEND_PORT)"

  参数解析

  # 检查运行模式
  MIGRATION_MODE=false                  # 数据库迁移模式
  STOCK_CODE_UPGRADE=false              # 股票代码升级模式
  DATABASE_OPTIMIZATION=false           # 数据库优化模式
  PRODUCTION_MODE=false                 # 生产环境模式

  case "$1" in
      --migrate|-m)
          MIGRATION_MODE=true
          echo "🔄 迁移模式: 只更新数据库结构，跳过依赖安装"
          ;;
      --upgrade-stock-codes|-u)
          STOCK_CODE_UPGRADE=true
          echo "📊 股票代码升级: 添加原始代码和标准化代码字段"
          ;;
      --optimize-database|-o)
          DATABASE_OPTIMIZATION=true
          echo "⚡ 数据库优化模式: 部署高性能数据库架构"
          ;;
      --production|-p)
          PRODUCTION_MODE=true
          echo "🏭 生产环境模式: 配置生产环境设置"
          ;;
      --help|-h)
          # 显示帮助信息
          exit 0
          ;;
  esac

  执行示例 - 参数解析

  # 完整部署
  $ ./deploy.sh
  🚀 股票分析系统部署 v2.7.0
  =========================
  ⚡ 新功能: CSV原始数据表 + 数据库性能优化
  📊 端口配置: API(3007) | 客户端(8005) | 管理端(8006)

  # 仅数据库迁移
  $ ./deploy.sh --migrate
  🚀 股票分析系统部署 v2.7.0
  =========================
  🔄 迁移模式: 只更新数据库结构，跳过依赖安装
  📊 端口配置: API(3007) | 客户端(8005) | 管理端(8006)

  # 生产环境
  $ ./deploy.sh --production
  🏭 生产环境模式: 配置生产环境设置

---
  第2步: 环境检查

  代码

  echo "🔍 检查环境..."

  # 检查必要的命令是否存在
  command -v node >/dev/null || { log_error "Node.js未安装"; exit 1; }
  command -v python3 >/dev/null || { log_error "Python3未安装"; exit 1; }
  command -v mysql >/dev/null || { log_error "MySQL未安装"; exit 1; }

  # MySQL服务检查和自动启动
  if ! mysqladmin ping -h127.0.0.1 --silent 2>/dev/null; then
      log_warn "启动MySQL服务..."
      brew services start mysql 2>/dev/null || { log_error "MySQL启动失败"; exit 1; }
      sleep 2  # 等待MySQL完全启动
  fi

  log_success "环境检查完成"

  执行步骤详解

  1️⃣ 检查 Node.js
     command -v node >/dev/null
     → 查找 node 命令
     → 如果不存在，输出: ❌ Node.js未安装
     → 直接退出脚本 (exit 1)

  2️⃣ 检查 Python3
     command -v python3 >/dev/null
     → 查找 python3 命令
     → 如果不存在，输出: ❌ Python3未安装
     → 直接退出脚本

  3️⃣ 检查 MySQL
     command -v mysql >/dev/null
     → 查找 mysql 命令
     → 如果不存在，输出: ❌ MySQL未安装
     → 直接退出脚本

  4️⃣ 检查 MySQL 服务是否运行
     mysqladmin ping -h127.0.0.1 --silent
     → 尝试连接到本地 MySQL
     → 成功: 继续
     → 失败: 尝试启动 MySQL

  5️⃣ 启动 MySQL (MacOS)
     brew services start mysql
     → 通过 Homebrew 启动 MySQL 服务
     → 等待 2 秒让服务完全启动
     → 如果启动失败，输出: ❌ MySQL启动失败，退出脚本

  执行示例

  🔍 检查环境...
  ✅ [✅] 环境检查完成

  # 如果MySQL未运行
  🔍 检查环境...
  [⚠️] 启动MySQL服务...
  (等待2秒...)
  ✅ [✅] 环境检查完成

---
  第3步: 后端部署

  代码结构

  echo "🔧 设置后端..."
  cd backend

  # ============ 虚拟环境设置 ============
  if [ ! -d "venv" ]; then
      if [ "$MIGRATION_MODE" = true ]; then
          log_error "迁移模式需要虚拟环境，请先运行完整部署"
          exit 1
      fi
      python3 -m venv venv  # 创建虚拟环境
  fi

  source venv/bin/activate  # 激活虚拟环境

  # ============ 依赖安装 ============
  if [ "$MIGRATION_MODE" = false ]; then
      # 完整部署: 检查关键包
      if python -c "import fastapi, sqlalchemy, uvicorn" 2>/dev/null; then
          log_success "后端依赖已存在，跳过安装"
      else
          pip install -r requirements.txt -q -i https://pypi.tuna.tsinghua.edu.cn/simple
          log_success "后端依赖完成"
      fi
  else
      # 迁移模式: 检查并升级
      if python -c "import fastapi, sqlalchemy, uvicorn" 2>/dev/null; then
          log_success "后端依赖检查完成"
      else
          pip install -r requirements.txt -q --upgrade -i https://pypi.tuna.tsinghua.edu.cn/simple
          log_success "后端依赖检查完成"
      fi
  fi

  虚拟环境设置步骤

  ┌──────────────────────────────────────────┐
  │ 虚拟环境设置 (backend/)                   │
  └──────────────────────────────────────────┘
           ↓
      检查是否存在 venv 目录
      ├─ 不存在 → python3 -m venv venv
      │          创建虚拟环境
      └─ 存在 → 跳过创建
           ↓
      source venv/bin/activate
      激活虚拟环境
      ├─ 路径变为: /path/to/stock-analysis-system/backend/venv/bin/python
      └─ pip 指向虚拟环境内的 pip

  依赖安装流程

  ┌──────────────────────────────────────────┐
  │ 依赖安装流程                              │
  └──────────────────────────────────────────┘
           ↓
      是否为迁移模式？
      ├─ 是 (MIGRATION_MODE=true)
      │  ├─ 检查关键包是否存在
      │  │  └─ import fastapi, sqlalchemy, uvicorn
      │  ├─ 存在 → 显示 "✅ 后端依赖检查完成"
      │  └─ 不存在 → pip install --upgrade (更新)
      │
      └─ 否 (完整部署)
         ├─ 检查关键包是否存在
         ├─ 存在 → 显示 "✅ 后端依赖已存在，跳过安装"
         └─ 不存在 → pip install requirements.txt (首次安装)

  表创建步骤

  # ============ 创建管理员用户表 ============
  echo "👤 创建管理员用户表..."
  if python -c "from app.models.admin_user import AdminUser" 2>/dev/null; then
      python create_admin_table.py 2>/dev/null || log_warn "管理员表可能已存在"
  else
      log_warn "管理员模块检查失败，跳过表创建"
  fi

  # ============ 创建TXT导入数据表 ============
  echo "📊 创建TXT导入数据表..."
  if python -c "from app.core.database import engine" 2>/dev/null; then
      python create_daily_trading_tables.py 2>/dev/null || log_warn "TXT导入表可能已存在"
  else
      log_warn "数据库连接检查失败，跳过表创建"
  fi

  # ============ 创建原始数据表（Plan 1新增）============
  echo "💾 创建原始数据表..."
  mysql -u root -pPp123456 stock_analysis_dev < ../scripts/database/create_raw_data_table.sql 2>/dev/null && \
      log_success "原始数据表创建完成" || \
      log_warn "原始数据表可能已存在"

  表创建详解

  创建表的执行链:
      ↓
  1. 管理员用户表 (admin_users)
     ├─ 导入 AdminUser 模型检查
     ├─ 成功 → 执行 create_admin_table.py
     │       └─ 创建表及初始数据
     └─ 失败 → 显示警告

  2. TXT导入表 (daily_trading 等)
     ├─ 检查数据库连接
     ├─ 成功 → 执行 create_daily_trading_tables.py
     │       └─ 创建 daily_trading, concept_daily_summary 等表
     └─ 失败 → 显示警告

  3. 原始数据表 (stock_concept_raw_data, raw_import_data 等) ⭐ Plan 1新增
     ├─ 执行 SQL 脚本 (create_raw_data_table.sql)
     ├─ 成功 → ✅ 原始数据表创建完成
     └─ 失败 → [⚠️] 原始数据表可能已存在

  执行示例 - 后端部署

  🔧 设置后端...
  ✅ [✅] 后端依赖已存在，跳过安装
  👤 创建管理员用户表...
  [⚠️] 管理员表可能已存在
  📊 创建TXT导入数据表...
  [⚠️] TXT导入表可能已存在
  💾 创建原始数据表...
  ✅ [✅] 原始数据表创建完成

---
  第4步: 前端部署

  端口配置修复

  echo "🎨 设置前端..."

  # 修复客户端端口
  if [ -f "client/package.json" ]; then
      sed -i.bak "s/--port [0-9]*/--port $CLIENT_PORT/g" client/package.json
  fi

  # 修复管理端端口
  if [ -f "frontend/package.json" ]; then
      sed -i.bak "s/--port [0-9]*/--port $FRONTEND_PORT/g" frontend/package.json
  fi

  端口配置详解

  sed -i.bak "s/--port [0-9]*/--port $CLIENT_PORT/g" client/package.json

  含义:
    sed            → 流编辑器
    -i.bak         → 原地编辑，备份原文件为 .bak
    s/旧/新/g      → 替换所有匹配项
    --port [0-9]*  → 查找 --port 后跟的数字
    --port $CLIENT_PORT → 替换为新的端口

  示例:
    修改前: "dev": "vite --port 8005"
    修改后: "dev": "vite --port 8005"
    (保持一致)

  依赖安装

  if [ "$MIGRATION_MODE" = false ]; then
      # 完整部署: 安装客户端依赖
      if [ -f "client/package.json" ] && [ ! -d "client/node_modules" ]; then
          echo "📦 安装客户端依赖..."
          cd client && npm install --silent --no-audit --no-fund 2>/dev/null && cd .. || log_warn
  "客户端依赖安装可能有问题"
      fi

      # 完整部署: 安装管理端依赖
      if [ -f "frontend/package.json" ] && [ ! -d "frontend/node_modules" ]; then
          echo "📦 安装管理端依赖..."
          cd frontend && npm install --silent --no-audit --no-fund 2>/dev/null && cd .. || log_warn
  "管理端依赖安装可能有问题"
      fi

      log_success "前端依赖完成"
  else
      log_success "迁移模式: 跳过前端依赖安装"
  fi

  npm 安装流程

  前端依赖安装流程:
      ↓
  1. 检查是否需要安装客户端依赖
     ├─ client/package.json 存在？
     ├─ client/node_modules 不存在？
     └─ 两个条件都满足 → 进行安装
          ↓
     npm install --silent --no-audit --no-fund
     ├─ --silent: 静默模式，不输出详细信息
     ├─ --no-audit: 跳过安全审计 (加快速度)
     └─ --no-fund: 不显示赞助信息

  2. 检查是否需要安装管理端依赖
     ├─ frontend/package.json 存在？
     ├─ frontend/node_modules 不存在？
     └─ 两个条件都满足 → 进行安装

  3. 迁移模式 (MIGRATION_MODE=true)
     └─ 跳过 npm install，直接显示 "✅ 迁移模式: 跳过前端依赖安装"

  执行示例 - 前端部署

  # 完整部署
  🎨 设置前端...
  📦 安装客户端依赖...
  (等待 npm install 完成...)
  📦 安装管理端依赖...
  (等待 npm install 完成...)
  ✅ [✅] 前端依赖完成

  # 迁移模式 (依赖已存在)
  🎨 设置前端...
  ✅ [✅] 迁移模式: 跳过前端依赖安装

---
  第5步: 配置文件生成

  代码

  echo "⚙️ 生成配置..."

  # ============ 生成端口配置 ============
  cat > ports.env << EOF
  BACKEND_PORT=$BACKEND_PORT
  CLIENT_PORT=$CLIENT_PORT
  FRONTEND_PORT=$FRONTEND_PORT
  EOF

  # ============ 生成生产环境配置 ============
  if [ "$PRODUCTION_MODE" = true ]; then
      echo "🏭 配置生产环境..."

      # 创建后端 .env 文件
      cat > backend/.env << EOF
  SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:Pp123456@localhost:3306/stock_analysis_dev
  SECRET_KEY=your-secret-key-change-in-production-$(date +%s)
  ENVIRONMENT=production
  DEBUG=False
  ALLOWED_HOSTS=*
  CORS_ORIGINS=http://47.92.236.28:8005,http://47.92.236.28:8006
  EOF

      # 更新前端API地址为服务器IP
      if [ -f "frontend/src/config/api.ts" ]; then
          sed -i.bak 's/localhost/47.92.236.28/g' frontend/src/config/api.ts
      fi
    
      if [ -f "client/src/config/api.ts" ]; then
          sed -i.bak 's/localhost/47.92.236.28/g' client/src/config/api.ts
      fi
    
      log_success "生产环境配置完成"
  fi

  mkdir -p logs
  log_success "配置完成"

  生成的文件

  ports.env - 端口配置文件
  BACKEND_PORT=3007
  CLIENT_PORT=8005
  FRONTEND_PORT=8006

  backend/.env - 后端环境变量 (仅生产模式)
  SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:Pp123456@localhost:3306/stock_analysis_dev
  SECRET_KEY=your-secret-key-change-in-production-1729189456
  ENVIRONMENT=production
  DEBUG=False
  ALLOWED_HOSTS=*
  CORS_ORIGINS=http://47.92.236.28:8005,http://47.92.236.28:8006

  执行示例

  ⚙️ 生成配置...
  ✅ [✅] 配置完成

  # 生产模式
  ⚙️ 生成配置...
  🏭 配置生产环境...
  ✅ [✅] 生产环境配置完成
  ✅ [✅] 配置完成

---
  第6步: 数据库验证

  代码

  echo "🔍 验证数据库表..."
  cd backend
  source venv/bin/activate

  # ============ Python 脚本验证数据库 ============
  python -c "
  from app.core.database import engine
  from sqlalchemy import text

  tables_to_check = [
      'admin_users',
      'daily_trading',
      'concept_daily_summary',
      'stock_concept_ranking',
      'concept_high_record',
      'txt_import_record',
      'stock_concept_raw_data'
  ]

  print('📋 检查数据表:')
  model_sync_needed = False
  with engine.connect() as conn:
      for table in tables_to_check:
          try:
              result = conn.execute(text(f'SHOW TABLES LIKE \"{table}\"'))
              if result.fetchone():
                  print(f'  ✅ {table}')

                  # 特别检查 daily_trading 表的字段结构
                  if table == 'daily_trading':
                      field_result = conn.execute(text('''
                          SELECT COLUMN_NAME
                          FROM information_schema.COLUMNS
                          WHERE TABLE_NAME = 'daily_trading'
                          AND COLUMN_NAME IN ('original_stock_code', 'normalized_stock_code')
                      '''))
                      existing_fields = [row[0] for row in field_result.fetchall()]
                      if len(existing_fields) >= 2:
                          print(f'    ✅ 股票代码字段已升级 ({len(existing_fields)}/2)')
                          try:
                              from app.models.daily_trading import DailyTrading
                              if not hasattr(DailyTrading, 'original_stock_code'):
                                  print(f'    ⚠️  模型定义需要同步')
                                  model_sync_needed = True
                              else:
                                  print(f'    ✅ 模型定义已同步')
                          except Exception:
                              print(f'    ⚠️  模型定义检查失败')
                              model_sync_needed = True
                      else:
                          print(f'    ⚠️  股票代码字段需要升级 ({len(existing_fields)}/2)')
              else:
                  print(f'  ❌ {table} - 缺失')
          except Exception as e:
              print(f'  ⚠️  {table} - 检查失败: {str(e)[:30]}...')

  if model_sync_needed:
      print('🔄 需要同步模型定义')
      import sys
      sys.exit(1)
  "

  # ============ 模型同步 ============
  if [ $? -ne 0 ]; then
      echo "🔧 自动同步模型定义..."
      if [ -f "../scripts/database/sync_model_definitions.py" ]; then
          python ../scripts/database/sync_model_definitions.py
          if [ $? -eq 0 ]; then
              log_success "模型定义同步完成"
          else
              log_warn "模型定义同步失败，TXT导入可能有问题"
          fi
      else
          log_warn "模型同步脚本不存在，跳过同步"
      fi
  fi

  cd ..
  log_success "数据库验证完成"

  验证流程详解

  ┌──────────────────────────────────────────┐
  │ 数据库验证流程                            │
  └──────────────────────────────────────────┘
           ↓
  1️⃣ 激活虚拟环境
     source venv/bin/activate

  2️⃣ 检查表是否存在
     ├─ admin_users          (✅/❌/⚠️)
     ├─ daily_trading        (✅/❌/⚠️)
     ├─ concept_daily_summary
     ├─ stock_concept_ranking
     ├─ concept_high_record
     ├─ txt_import_record
     └─ stock_concept_raw_data

  3️⃣ 如果表存在，检查字段结构
     仅对 daily_trading 表:
     ├─ 检查是否有 original_stock_code 字段
     ├─ 检查是否有 normalized_stock_code 字段
     ├─ 如果都存在:
     │  └─ 检查 Python 模型定义是否同步
     │     ├─ 同步 → ✅ 模型定义已同步
     │     └─ 不同步 → ⚠️ 模型定义需要同步
     └─ 如果不完整:
        └─ ⚠️ 股票代码字段需要升级

  4️⃣ 如果需要同步模型
     ├─ 执行 sync_model_definitions.py
     ├─ 成功 → ✅ 模型定义同步完成
     ├─ 失败 → ⚠️ 模型定义同步失败
     └─ 脚本不存在 → ⚠️ 模型同步脚本不存在

  执行示例

  🔍 验证数据库表...
  📋 检查数据表:
    ✅ admin_users
    ✅ daily_trading
      ✅ 股票代码字段已升级 (2/2)
      ✅ 模型定义已同步
    ✅ concept_daily_summary
    ✅ stock_concept_ranking
    ✅ concept_high_record
    ✅ txt_import_record
    ✅ stock_concept_raw_data
  ✅ [✅] 数据库验证完成

---
  第7步: 数据库优化部署

  代码

  if [ "$MIGRATION_MODE" = false ] || [ "$DATABASE_OPTIMIZATION" = true ]; then
      echo ""
      echo "⚡ 部署数据库性能优化..."

      # ============ 获取数据库密码 ============
      echo "🔐 请输入MySQL root密码 (用于数据库优化部署):"
      read -s DB_PASSWORD  # 静默读取密码
      if [ -z "$DB_PASSWORD" ]; then
          DB_PASSWORD="Pp123456"  # 使用默认密码
          echo "使用默认密码"
      fi
    
      # ============ 构建数据库连接URL ============
      DB_URL="mysql+pymysql://root:$DB_PASSWORD@localhost:3306/stock_analysis_dev"
      echo "🔗 数据库连接: mysql://localhost:3306/stock_analysis_dev"
    
      # ============ 执行数据库优化脚本 ============
      if [ -f "./scripts/database/deploy_optimization.sh" ]; then
          echo "🚀 执行数据库优化部署..."
          chmod +x ./scripts/database/deploy_optimization.sh
    
          if ./scripts/database/deploy_optimization.sh --db-url "$DB_URL" --force --skip-backup 2>/dev/null; then
              log_success "数据库优化部署完成"
              echo "📊 性能提升: 查询速度提升50-200倍"
              echo "⚡ 优化功能已启用"
          else
              log_warn "数据库优化部署失败，可能需要手动配置"
              echo "💡 手动部署命令:"
              echo "   ./scripts/database/deploy_optimization.sh --db-url
  \"mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/stock_analysis_dev\""
          fi
      else
          log_warn "数据库优化脚本不存在，跳过优化部署"
      fi
  fi

  优化部署流程

  ┌──────────────────────────────────────────┐
  │ 数据库优化部署条件                        │
  └──────────────────────────────────────────┘
           ↓
  是否为非迁移模式 或 仅优化模式？
  ├─ 是 → 执行优化部署
  └─ 否 → 跳过优化
      (MIGRATION_MODE=true 且 DATABASE_OPTIMIZATION=false)
           ↓
  1️⃣ 提示输入数据库密码
     read -s DB_PASSWORD
     ├─ 用户输入 → 使用用户输入的密码
     └─ 直接回车 → 使用默认密码 (Pp123456)

  2️⃣ 构建数据库连接 URL
     mysql+pymysql://root:PASSWORD@localhost:3306/stock_analysis_dev

  3️⃣ 执行优化脚本
     ./scripts/database/deploy_optimization.sh \
       --db-url "$DB_URL" \
       --force \
       --skip-backup

     参数说明:
     ├─ --db-url: 数据库连接字符串
     ├─ --force: 强制执行，不询问确认
     └─ --skip-backup: 跳过备份步骤

  4️⃣ 检查执行结果
     ├─ 成功 ($? -eq 0)
     │  └─ ✅ 数据库优化部署完成
     │     📊 性能提升: 查询速度提升50-200倍
     └─ 失败
        ├─ ⚠️ 数据库优化部署失败
        └─ 提示手动命令进行配置

  执行示例

  ⚡ 部署数据库性能优化...
  🔐 请输入MySQL root密码 (用于数据库优化部署):
  (隐藏输入密码...)
  🔗 数据库连接: mysql://localhost:3306/stock_analysis_dev
  🚀 执行数据库优化部署...
  ✅ [✅] 数据库优化部署完成
  📊 性能提升: 查询速度提升50-200倍
  ⚡ 优化功能已启用

  # 跳过优化 (迁移模式)
  # 不显示优化部分

---
  第8步: 总结提示

  根据部署模式输出不同的总结

  echo ""
  if [ "$MIGRATION_MODE" = true ]; then
      # 数据库迁移模式总结
      echo "🎉 数据库迁移完成！"
      echo ""
      echo "📊 新增功能:"
      echo "  ✅ TXT热度数据导入"
      echo "  ✅ 概念每日汇总计算"
      echo "  ✅ 个股概念排名分析"
      echo "  ✅ 概念创新高检测"
      echo "  ✅ 管理员认证系统"
      echo ""
      echo "🚀 下一步："
      echo "  1. ./start.sh    - 启动服务"
      echo "  2. 访问管理端    - http://localhost:8006"
      echo "  3. 登录账号      - admin / admin123"
      echo "  4. 导入TXT数据   - 进入'数据导入'页面"

  elif [ "$STOCK_CODE_UPGRADE" = true ]; then
      # 股票代码升级总结
      echo "🎉 股票代码字段升级完成！"
      # ... 详细信息

  elif [ "$DATABASE_OPTIMIZATION" = true ]; then
      # 数据库优化总结
      echo "🎉 数据库优化部署完成！"
      # ... 详细信息

  else
      # 完整部署总结
      echo "🎉 完整部署成功！(包含数据库优化 v2.6.4)"
      echo ""
      echo "📊 服务地址:"
      echo "  🔗 API:     http://localhost:3007"
      echo "  📱 客户端:   http://localhost:8005"
      echo "  🖥️ 管理端:   http://localhost:8006"
      echo ""
      echo "👤 管理员账号: admin / admin123"
      echo ""
      echo "⚡ 数据库优化状态: 已启用"
      echo "📊 查询性能提升: 50-200倍"
      echo ""
      echo "🚀 启动方式:"
      echo "  ./start.sh  - 启动所有服务"
      echo "  ./status.sh - 检查运行状态"
      echo "  ./stop.sh   - 停止所有服务"
      echo ""
      echo "📋 下一步: ./start.sh"
  fi

  执行示例 - 完整部署

  🎉 完整部署成功！(包含数据库优化 v2.6.4)

  📊 服务地址:
    🔗 API:     http://localhost:3007
    📱 客户端:   http://localhost:8005
    🖥️ 管理端:   http://localhost:8006

  👤 管理员账号: admin / admin123

  ⚡ 数据库优化状态: 已启用
  📊 查询性能提升: 50-200倍

  🚀 启动方式:
    ./start.sh  - 启动所有服务
    ./status.sh - 检查运行状态
    ./stop.sh   - 停止所有服务

  📋 下一步: ./start.sh

---
  📊 完整执行时间轴

  ┌─────────────────────────────────────────────────────────────┐
  │           deploy.sh 完整执行时间轴 (参考时间)               │
  └─────────────────────────────────────────────────────────────┘

  0s    | ↓ 开始执行
        | 初始化 & 参数解析

  3s    | ✅ 环境检查完成
        | - Node.js: ✅
        | - Python3: ✅
        | - MySQL: ✅ (启动)
        | - MySQL 服务: ✅

  5s    | ↓ 后端部署
        | - 虚拟环境: 创建/激活

  8s    | 安装依赖 (第一次): ~30-60s
        | 或 (已存在): <1s

  10s   | ✅ 创建表
        | - 管理员表: ✅
        | - TXT导入表: ✅
        | - 原始数据表: ✅

  12s   | ↓ 前端部署
        | - 端口配置修复: <1s
        | - 客户端依赖: ~30-60s (第一次) 或 <1s
        | - 管理端依赖: ~30-60s (第一次) 或 <1s

  15s   | ✅ 配置生成
        | - ports.env: ✅
        | - backend/.env: ✅

  18s   | ↓ 数据库验证
        | 激活虚拟环境 & 验证表

  22s   | ✅ 数据库验证完成
        | 所有表检查通过

  25s   | ↓ 数据库优化
        | 输入密码 (等待用户)
        | 执行优化脚本: ~30-60s

  60s   | ✅ 优化部署完成

  62s   | ✅ 总体完成
        | 输出最终提示信息

  ┌─────────────────────────────────────────────────────────────┐
  │ 总耗时:
  │ - 第一次完整部署: 60-120s (取决于网络和磁盘速度)
  │ - 后续迁移: 30-50s (跳过依赖安装)
  │ - 仅优化: 30-60s
  └─────────────────────────────────────────────────────────────┘

---
  🔧 deploy.sh 的核心机制

  1. 幂等性设计 (Idempotent)

  # ✅ 支持重复执行
  ./deploy.sh
  ./deploy.sh  # 再次执行不会出错

  原因:
  ├─ 虚拟环境: 已存在时跳过创建
  ├─ 依赖: 已存在时跳过安装
  ├─ 表: 已存在时显示警告但继续
  └─ 配置: 每次都覆盖生成 (安全)

  2. 错误处理

  # 三层错误处理
  1️⃣ 硬退出错误
     command -v node || { log_error "Node.js未安装"; exit 1; }
     → 找不到则直接退出，不继续

  2️⃣ 警告并继续
     python create_admin_table.py 2>/dev/null || log_warn "管理员表可能已存在"
     → 报警告但继续执行下一步

  3️⃣ 条件判断继续
     if [ $? -eq 0 ]; then
         # 成功逻辑
     else
         # 失败逻辑
     fi

  3. 模式切换机制

  # 不同模式执行不同的逻辑分支
  if [ "$MIGRATION_MODE" = false ]; then
      # 完整部署 (包含所有优化)
      npm install  # 安装前端依赖
      optimize()   # 执行优化
  else
      # 迁移模式 (最小化)
      # 跳过前端依赖安装
      # 可选执行优化
  fi

---
  📋 deploy.sh 常见问题

  Q1: 第一次部署需要多久？

  A: 60-120 秒（取决于网络）
     - npm install: 30-60s
     - pip install: 10-30s
     - 其他: 10-30s

  Q2: 如何加快部署？

  # 已经部署过，只需迁移数据库
  ./deploy.sh --migrate

  # 只部署优化
  ./deploy.sh --optimize-database

  Q3: MySQL 连接失败怎么办？

  # 手动启动 MySQL
  brew services start mysql

  # 检查连接
  mysqladmin ping

  # 重新运行部署
  ./deploy.sh

  Q4: npm install 失败？

  # 手动安装
  cd frontend && npm install
  cd ../client && npm install
  cd ..

  # 重新部署
  ./deploy.sh --migrate