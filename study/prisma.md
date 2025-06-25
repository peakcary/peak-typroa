要在 **NestJS** 中使用 **Prisma** 和 **PostgreSQL** 创建一个项目，我们将完成以下几个步骤：



​	1.	**初始化 NestJS 项目**

​	2.	**安装 Prisma 和 PostgreSQL 客户端**

​	3.	**配置 Prisma 和数据库连接**

​	4.	**定义 Prisma Schema 和数据模型**

​	5.	**运行 Prisma Migration 和数据库同步**

​	6.	**创建模块和服务来操作数据**

​	7.	**测试 CRUD 操作**

**1. 初始化 NestJS 项目**



首先，我们需要安装 NestJS CLI 并创建一个新的项目。





**1. 初始化 NestJS 项目**

# 全局安装 NestJS CLI
npm install -g @nestjs/cli

# 创建新的 Nest 项目
nest new nest-prisma-postgres
cd nest-prisma-postgres