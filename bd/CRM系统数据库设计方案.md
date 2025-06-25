# CRM系统数据库设计方案

## 1. 数据库概述

数据库设计包括以下主要表：

1. 客户表（Customers）
2. 联系人表（Contacts）
3. 潜在客户表（Leads）
4. 销售机会表（Opportunities）
5. 活动表（Activities）
6. 用户表（Users）
7. 角色和权限表（Roles and Permissions）
8. 客户服务工单表（ServiceTickets）
9. 报告和分析表（Reports）
10. 系统日志表（Logs）

## 2. 主要表结构

### 2.1 客户表（Customers）

存储客户的基本信息。

| 字段名      | 数据类型     | 描述     |
| ----------- | ------------ | -------- |
| customer_id | SERIAL       | 主键     |
| name        | VARCHAR(255) | 客户名称 |
| industry    | VARCHAR(255) | 所属行业 |
| location    | VARCHAR(255) | 地理位置 |
| revenue     | DECIMAL      | 年收入   |
| created_at  | TIMESTAMP    | 创建时间 |
| updated_at  | TIMESTAMP    | 更新时间 |

### 2.2 联系人表（Contacts）

存储与客户相关的联系人信息。

| 字段名      | 数据类型     | 描述             |
| ----------- | ------------ | ---------------- |
| contact_id  | SERIAL       | 主键             |
| customer_id | INTEGER      | 外键，关联客户表 |
| first_name  | VARCHAR(255) | 名               |
| last_name   | VARCHAR(255) | 姓               |
| email       | VARCHAR(255) | 电子邮件         |
| phone       | VARCHAR(50)  | 电话号码         |
| position    | VARCHAR(255) | 职位             |
| created_at  | TIMESTAMP    | 创建时间         |
| updated_at  | TIMESTAMP    | 更新时间         |

### 2.3 潜在客户表（Leads）

存储潜在客户信息，用于销售跟进。

| 字段名     | 数据类型     | 描述                 |
| ---------- | ------------ | -------------------- |
| lead_id    | SERIAL       | 主键                 |
| source     | VARCHAR(255) | 来源                 |
| status     | VARCHAR(50)  | 状态（如新、跟进中） |
| contact_id | INTEGER      | 外键，关联联系人表   |
| created_at | TIMESTAMP    | 创建时间             |
| updated_at | TIMESTAMP    | 更新时间             |

### 2.4 销售机会表（Opportunities）

存储销售机会和跟进记录。

| 字段名         | 数据类型     | 描述                 |
| -------------- | ------------ | -------------------- |
| opportunity_id | SERIAL       | 主键                 |
| customer_id    | INTEGER      | 外键，关联客户表     |
| name           | VARCHAR(255) | 机会名称             |
| stage          | VARCHAR(50)  | 阶段（如初始、谈判） |
| value          | DECIMAL      | 预估价值             |
| close_date     | DATE         | 预计关闭日期         |
| created_at     | TIMESTAMP    | 创建时间             |
| updated_at     | TIMESTAMP    | 更新时间             |

### 2.5 活动表（Activities）

记录与客户或潜在客户的所有互动活动。

| 字段名        | 数据类型     | 描述                     |
| ------------- | ------------ | ------------------------ |
| activity_id   | SERIAL       | 主键                     |
| customer_id   | INTEGER      | 外键，关联客户表         |
| contact_id    | INTEGER      | 外键，关联联系人表       |
| type          | VARCHAR(50)  | 活动类型（如电话、会议） |
| subject       | VARCHAR(255) | 主题                     |
| description   | TEXT         | 描述                     |
| activity_date | TIMESTAMP    | 活动日期                 |
| created_at    | TIMESTAMP    | 创建时间                 |
| updated_at    | TIMESTAMP    | 更新时间                 |

### 2.6 用户表（Users）

存储CRM系统用户信息。

| 字段名        | 数据类型     | 描述             |
| ------------- | ------------ | ---------------- |
| user_id       | SERIAL       | 主键             |
| username      | VARCHAR(255) | 用户名           |
| email         | VARCHAR(255) | 电子邮件         |
| password_hash | VARCHAR(255) | 密码哈希         |
| role_id       | INTEGER      | 外键，关联角色表 |
| created_at    | TIMESTAMP    | 创建时间         |
| updated_at    | TIMESTAMP    | 更新时间         |

### 2.7 角色和权限表（Roles and Permissions）

管理系统角色和权限。

#### 角色表（Roles）

| 字段名     | 数据类型     | 描述     |
| ---------- | ------------ | -------- |
| role_id    | SERIAL       | 主键     |
| role_name  | VARCHAR(255) | 角色名称 |
| created_at | TIMESTAMP    | 创建时间 |
| updated_at | TIMESTAMP    | 更新时间 |

#### 权限表（Permissions）

| 字段名          | 数据类型     | 描述     |
| --------------- | ------------ | -------- |
| permission_id   | SERIAL       | 主键     |
| permission_name | VARCHAR(255) | 权限名称 |
| created_at      | TIMESTAMP    | 创建时间 |
| updated_at      | TIMESTAMP    | 更新时间 |

#### 角色权限关联表（RolePermissions）

| 字段名        | 数据类型  | 描述             |
| ------------- | --------- | ---------------- |
| role_id       | INTEGER   | 外键，关联角色表 |
| permission_id | INTEGER   | 外键，关联权限表 |
| created_at    | TIMESTAMP | 创建时间         |
| updated_at    | TIMESTAMP | 更新时间         |

### 2.8 客户服务工单表（ServiceTickets）

记录客户服务请求和问题。

| 字段名      | 数据类型     | 描述                   |
| ----------- | ------------ | ---------------------- |
| ticket_id   | SERIAL       | 主键                   |
| customer_id | INTEGER      | 外键，关联客户表       |
| subject     | VARCHAR(255) | 工单主题               |
| description | TEXT         | 工单描述               |
| status      | VARCHAR(50)  | 状态（如打开、处理中） |
| priority    | VARCHAR(50)  | 优先级                 |
| created_at  | TIMESTAMP    | 创建时间               |
| updated_at  | TIMESTAMP    | 更新时间               |

### 2.9 报告和分析表（Reports）

存储系统生成的各类报告。

| 字段名       | 数据类型     | 描述     |
| ------------ | ------------ | -------- |
| report_id    | SERIAL       | 主键     |
| report_type  | VARCHAR(255) | 报告类型 |
| data         | JSONB        | 报告数据 |
| generated_at | TIMESTAMP    | 生成时间 |
| created_at   | TIMESTAMP    | 创建时间 |
| updated_at   | TIMESTAMP    | 更新时间 |

### 2.10 系统日志表（Logs）

记录系统操作和用户活动日志。

| 字段名      | 数据类型     | 描述             |
| ----------- | ------------ | ---------------- |
| log_id      | SERIAL       | 主键             |
| user_id     | INTEGER      | 外键，关联用户表 |
| action      | VARCHAR(255) | 操作类型         |
| description | TEXT         | 操作描述         |
| created_at  | TIMESTAMP    | 创建时间         |

## 3. 索引与优化

- **主键索引**：每个表的主键字段上创建索引。
- **外键索引**：在外键字段上创建索引，以提高查询效率。
- **全文索引**：在需要搜索文本的字段上（如客户名称、描述等）创建全文索引。
- **分区表**：对于大表（如Logs），可以考虑使用分区来优化性能。

## 4. 数据库备份与恢复

- **备份策略**：每日增量备份、每周全量备份。
- **恢复策略**：定期测试备份数据的可恢复性，确保灾难恢复能力。

## 5. 数据安全

- **数据加密**：对敏感数据（如密码、财务信息）进行加密存储。
- **访问控制**：严格控制数据库访问权限，采用最小权限原则。
- **审计日志**：记录所有数据库操作日志，以便审计和监控。