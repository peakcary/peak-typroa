 2.1 核心数据表设计

  用户相关表

  -- 1. 用户表
  CREATE TABLE `users` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `openid` varchar(64) NOT NULL COMMENT '微信OpenID',
    `unionid` varchar(64) DEFAULT NULL COMMENT '微信UnionID',
    `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
    `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
    `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `gender` tinyint(1) DEFAULT 0 COMMENT '性别: 0未知 1男 2女',
    `birthday` date DEFAULT NULL COMMENT '生日',
    `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0未认证 1已认证 2审核中 3审核拒绝',
    `user_type` tinyint(2) DEFAULT 1 COMMENT '用户类型: 1校友 2教职工 3管理员',
    `student_id` varchar(20) DEFAULT NULL COMMENT '学号',
    `graduation_year` int(4) DEFAULT NULL COMMENT '毕业年份',
    `major` varchar(100) DEFAULT NULL COMMENT '专业',
    `department` varchar(100) DEFAULT NULL COMMENT '院系',
    `degree` varchar(20) DEFAULT NULL COMMENT '学历',
    `company` varchar(200) DEFAULT NULL COMMENT '工作单位',
    `position` varchar(100) DEFAULT NULL COMMENT '职位',
    `industry` varchar(100) DEFAULT NULL COMMENT '行业',
    `city` varchar(50) DEFAULT NULL COMMENT '所在城市',
    `province` varchar(50) DEFAULT NULL COMMENT '所在省份',
    `address` varchar(500) DEFAULT NULL COMMENT '详细地址',
    `bio` varchar(500) DEFAULT NULL COMMENT '个人简介',
    `is_verified` tinyint(1) DEFAULT 0 COMMENT '是否实名认证',
    `verify_time` datetime DEFAULT NULL COMMENT '认证时间',
    `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` varchar(50) DEFAULT NULL COMMENT '最后登录IP',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_openid` (`openid`),
    KEY `idx_phone` (`phone`),
    KEY `idx_student_id` (`student_id`),
    KEY `idx_real_name` (`real_name`),
    KEY `idx_graduation_year` (`graduation_year`),
    KEY `idx_department` (`department`),
    KEY `idx_status` (`status`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

  -- 2. 角色表
  CREATE TABLE `roles` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `role_name` varchar(50) NOT NULL COMMENT '角色名称',
    `role_code` varchar(50) NOT NULL COMMENT '角色编码',
    `description` varchar(200) DEFAULT NULL COMMENT '角色描述',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0禁用 1启用',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_code` (`role_code`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

  -- 3. 用户角色关联表
  CREATE TABLE `user_roles` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `role_id` bigint(20) NOT NULL COMMENT '角色ID',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_role_id` (`role_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

  -- 4. 权限表
  CREATE TABLE `permissions` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
    `parent_id` bigint(20) DEFAULT 0 COMMENT '父权限ID',
    `permission_name` varchar(50) NOT NULL COMMENT '权限名称',
    `permission_code` varchar(100) NOT NULL COMMENT '权限编码',
    `permission_type` tinyint(2) DEFAULT 1 COMMENT '权限类型: 1���单 2按钮 3API',
    `route_path` varchar(200) DEFAULT NULL COMMENT '路由路径',
    `icon` varchar(50) DEFAULT NULL COMMENT '图标',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_permission_code` (`permission_code`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

  -- 5. 角色权限关联表
  CREATE TABLE `role_permissions` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `role_id` bigint(20) NOT NULL COMMENT '角色ID',
    `permission_id` bigint(20) NOT NULL COMMENT '权限ID',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

  校友卡表

  -- 6. 校友卡表
  CREATE TABLE `alumni_cards` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '校友卡ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `card_no` varchar(20) NOT NULL COMMENT '卡号',
    `qr_code` varchar(500) NOT NULL COMMENT '二维码URL',
    `qr_code_expires_at` datetime NOT NULL COMMENT '二维码过期时间',
    `card_status` tinyint(2) DEFAULT 1 COMMENT '状态: 0失效 1有效 2挂失',
    `issue_date` datetime NOT NULL COMMENT '发卡日期',
    `expiry_date` datetime DEFAULT NULL COMMENT '到期日期',
    `level` tinyint(2) DEFAULT 1 COMMENT '卡等级: 1普通 2银卡 3金卡 4钻石卡',
    `points` int(11) DEFAULT 0 COMMENT '积分',
    `total_donation` decimal(10,2) DEFAULT 0.00 COMMENT '累计捐赠金额',
    `visit_count` int(11) DEFAULT 0 COMMENT '返校次数',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_card_no` (`card_no`),
    UNIQUE KEY `uk_user_id` (`user_id`),
    KEY `idx_qr_code_expires` (`qr_code_expires_at`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校友卡表';

  返校预约表

  -- 7. 返校预约表
  CREATE TABLE `return_visits` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '预约ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `visit_date` date NOT NULL COMMENT '预约日期',
    `visit_time` varchar(20) DEFAULT NULL COMMENT '预约时间段',
    `companion_count` int(11) DEFAULT 0 COMMENT '随行人数',
    `companion_names` varchar(500) DEFAULT NULL COMMENT '随行人员姓名(逗号分隔)',
    `visit_areas` varchar(500) DEFAULT NULL COMMENT '访问区域(JSON)',
    `visit_purpose` varchar(200) DEFAULT NULL COMMENT '来访目的',
    `vehicle_info` varchar(200) DEFAULT NULL COMMENT '车辆信息',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0待审核 1已通过 2已拒绝 3已取消 4已完成',
    `audit_user_id` bigint(20) DEFAULT NULL COMMENT '审核人ID',
    `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
    `audit_remark` varchar(500) DEFAULT NULL COMMENT '审核备注',
    `check_in_time` datetime DEFAULT NULL COMMENT '签到时间',
    `check_out_time` datetime DEFAULT NULL COMMENT '签离时间',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_visit_date` (`visit_date`),
    KEY `idx_status` (`status`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='返校预约表';

  -- 8. 访问区域表
  CREATE TABLE `visit_areas` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '区域ID',
    `area_name` varchar(100) NOT NULL COMMENT '区域名称',
    `area_code` varchar(50) NOT NULL COMMENT '区域编码',
    `area_type` tinyint(2) DEFAULT 1 COMMENT '类型: 1教学区 2生活区 3办公区 4景点',
    `max_capacity` int(11) DEFAULT NULL COMMENT '最大承载人数',
    `description` varchar(500) DEFAULT NULL COMMENT '区域描述',
    `status` tinyint(1) DEFAULT 1 COMMENT '状��',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_area_code` (`area_code`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='访问区域表';

  活动管理表

  -- 9. 活动表
  CREATE TABLE `events` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
    `title` varchar(200) NOT NULL COMMENT '活动标题',
    `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
    `event_type` tinyint(2) NOT NULL COMMENT '活动类型: 1返校日 2论坛 3沙龙 4讲座 5聚会',
    `description` text COMMENT '活动描述',
    `content` longtext COMMENT '活动详情富文本',
    `start_time` datetime NOT NULL COMMENT '开始时间',
    `end_time` datetime NOT NULL COMMENT '结束时间',
    `location` varchar(200) DEFAULT NULL COMMENT '活动地点',
    `max_participants` int(11) DEFAULT NULL COMMENT '最大参与人数',
    `current_participants` int(11) DEFAULT 0 COMMENT '当前参与人数',
    `registration_start` datetime DEFAULT NULL COMMENT '报名开始时间',
    `registration_end` datetime DEFAULT NULL COMMENT '报名结束时间',
    `registration_fee` decimal(10,2) DEFAULT 0.00 COMMENT '报名费用',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0草稿 1报名中 2报名截止 3进行中 4已结束 5已取消',
    `organizer_id` bigint(20) DEFAULT NULL COMMENT '发起人ID',
    `organizer_name` varchar(100) DEFAULT NULL COMMENT '发起人名称',
    `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `is_top` tinyint(1) DEFAULT 0 COMMENT '是否置顶',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `view_count` int(11) DEFAULT 0 COMMENT '浏览次数',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_event_type` (`event_type`),
    KEY `idx_start_time` (`start_time`),
    KEY `idx_status` (`status`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

  -- 10. 活动报名表
  CREATE TABLE `event_registrations` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '报名ID',
    `event_id` bigint(20) NOT NULL COMMENT '活动ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `registration_no` varchar(50) NOT NULL COMMENT '���名号',
    `real_name` varchar(50) NOT NULL COMMENT '真��姓名',
    `phone` varchar(20) NOT NULL COMMENT '手机号',
    `company` varchar(200) DEFAULT NULL COMMENT '公司',
    `position` varchar(100) DEFAULT NULL COMMENT '职位',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `payment_status` tinyint(2) DEFAULT 0 COMMENT '支付状态: 0未支付 1已支付 2已退款',
    `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
    `transaction_id` varchar(100) DEFAULT NULL COMMENT '微信交易号',
    `check_in_status` tinyint(1) DEFAULT 0 COMMENT '签到状态: 0未签到 1已签到',
    `check_in_time` datetime DEFAULT NULL COMMENT '签到时间',
    `cancel_time` datetime DEFAULT NULL COMMENT '取消时间',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_registration_no` (`registration_no`),
    KEY `idx_event_id` (`event_id`),
    KEY `idx_user_id` (`user_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动报名表';

  社群互动表

  -- 11. 校友群组表
  CREATE TABLE `groups` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '群组ID',
    `group_name` varchar(100) NOT NULL COMMENT '群组名称',
    `group_avatar` varchar(500) DEFAULT NULL COMMENT '群组头像',
    `group_type` tinyint(2) DEFAULT 1 COMMENT '群组类型: 1院系 2年级 3行业 4兴趣 5地区',
    `category` varchar(50) DEFAULT NULL COMMENT '分类(如:计算机学院、2008级、互联网等)',
    `description` varchar(500) DEFAULT NULL COMMENT '群组描述',
    `owner_id` bigint(20) NOT NULL COMMENT '群主ID',
    `max_members` int(11) DEFAULT 500 COMMENT '最大成员数',
    `current_members` int(11) DEFAULT 0 COMMENT '当前成员数',
    `join_type` tinyint(2) DEFAULT 1 COMMENT '加入方式: 1自由加入 2需要审核 3禁止加入',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0禁用 1启用',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_group_type` (`group_type`),
    KEY `idx_owner_id` (`owner_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校友群组表';

  -- 12. 群组成员表
  CREATE TABLE `group_members` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `group_id` bigint(20) NOT NULL COMMENT '群组ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `member_type` tinyint(2) DEFAULT 1 COMMENT '成员类型: 1普通成员 2管理员 3群主',
    `nickname` varchar(50) DEFAULT NULL COMMENT '群昵称',
    `join_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    `mute_until` datetime DEFAULT NULL COMMENT '禁言到期时间',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0退出 1正常',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_group_user` (`group_id`, `user_id`),
    KEY `idx_user_id` (`user_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群组成员表';

  -- 13. 群组消息表
  CREATE TABLE `group_messages` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `group_id` bigint(20) NOT NULL COMMENT '群组ID',
    `user_id` bigint(20) NOT NULL COMMENT '��送者ID',
    `message_type` tinyint(2) DEFAULT 1 COMMENT '消息类型: 1文本 2图片 3语音 4文件 5链接',
    `content` text COMMENT '消息内容',
    `media_url` varchar(500) DEFAULT NULL COMMENT '媒体文件URL',
    `reply_to` bigint(20) DEFAULT NULL COMMENT '回复的消息ID',
    `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_group_id` (`group_id`),
    KEY `idx_created_at` (`created_at`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群组消息表';

  捐赠系统表

  -- 14. 捐赠项目表
  CREATE TABLE `donation_projects` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
    `project_name` varchar(200) NOT NULL COMMENT '项目名称',
    `project_code` varchar(50) NOT NULL COMMENT '项目编码',
    `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
    `description` text COMMENT '项目简介',
    `content` longtext COMMENT '项目详情',
    `target_amount` decimal(12,2) DEFAULT NULL COMMENT '目标金额',
    `current_amount` decimal(12,2) DEFAULT 0.00 COMMENT '已筹集金额',
    `donor_count` int(11) DEFAULT 0 COMMENT '捐赠人数',
    `start_time` datetime DEFAULT NULL COMMENT '开始时间',
    `end_time` datetime DEFAULT NULL COMMENT '结束时间',
    `status` tinyint(2) DEFAULT 1 COMMENT '状态: 0禁用 1进行中 2已完成 3已关闭',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `is_hot` tinyint(1) DEFAULT 0 COMMENT '是否热门',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_project_code` (`project_code`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠项目表';

  -- 15. 捐赠记录表
  CREATE TABLE `donations` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '捐赠ID',
    `donation_no` varchar(50) NOT NULL COMMENT '捐赠单号',
    `project_id` bigint(20) NOT NULL COMMENT '项目ID',
    `user_id` bigint(20) NOT NULL COMMENT '捐赠人ID',
    `amount` decimal(10,2) NOT NULL COMMENT '捐赠金额',
    `payment_method` tinyint(2) DEFAULT 1 COMMENT '支付方式: 1微信支付 2支付宝 3银行转账',
    `payment_status` tinyint(2) DEFAULT 0 COMMENT '支付状态: 0待支付 1已支付 2已退款',
    `transaction_id` varchar(100) DEFAULT NULL COMMENT '第三方交易号',
    `is_anonymous` tinyint(1) DEFAULT 0 COMMENT '是否匿名',
    `donor_name` varchar(50) DEFAULT NULL COMMENT '捐赠人姓名',
    `donor_message` varchar(500) DEFAULT NULL COMMENT '捐赠寄语',
    `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
    `certificate_url` varchar(500) DEFAULT NULL COMMENT '捐赠证书URL',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_donation_no` (`donation_no`),
    KEY `idx_project_id` (`project_id`),
    KEY `idx_user_id` (`user_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠记录表';

  资讯内容表

  -- 16. 资讯文章表
  CREATE TABLE `articles` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '文章ID',
    `title` varchar(200) NOT NULL COMMENT '标题',
    `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
    `category_id` bigint(20) DEFAULT NULL COMMENT '分类ID',
    `category_name` varchar(50) DEFAULT NULL COMMENT '分类名称',
    `summary` varchar(500) DEFAULT NULL COMMENT '摘要',
    `content` longtext COMMENT '内容',
    `author_id` bigint(20) DEFAULT NULL COMMENT '作者ID',
    `author_name` varchar(50) DEFAULT NULL COMMENT '作者名称',
    `source` varchar(100) DEFAULT NULL COMMENT '来源',
    `view_count` int(11) DEFAULT 0 COMMENT '浏览次数',
    `like_count` int(11) DEFAULT 0 COMMENT '点赞次数',
    `comment_count` int(11) DEFAULT 0 COMMENT '评论次数',
    `share_count` int(11) DEFAULT 0 COMMENT '分享次数',
    `is_top` tinyint(1) DEFAULT 0 COMMENT '是否置顶',
    `is_hot` tinyint(1) DEFAULT 0 COMMENT '是否热门',
    `is_recommend` tinyint(1) DEFAULT 0 COMMENT '是否推荐',
    `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0草稿 1已发布 2已下架',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_publish_time` (`publish_time`),
    KEY `idx_status` (`status`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资讯文章表';

  -- 17. 文章分类表
  CREATE TABLE `article_categories` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `category_name` varchar(50) NOT NULL COMMENT '分类名称',
    `parent_id` bigint(20) DEFAULT 0 COMMENT '父分类ID',
    `icon` varchar(100) DEFAULT NULL COMMENT '图标',
    `description` varchar(200) DEFAULT NULL COMMENT '描述',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表';

  就业服务表

  -- 18. 职位表
  CREATE TABLE `jobs` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '职位ID',
    `company_id` bigint(20) DEFAULT NULL COMMENT '企业ID',
    `company_name` varchar(200) NOT NULL COMMENT '企业名称',
    `company_logo` varchar(500) DEFAULT NULL COMMENT '企业Logo',
    `job_title` varchar(100) NOT NULL COMMENT '职位名称',
    `job_category` varchar(50) DEFAULT NULL COMMENT '职位类别',
    `industry` varchar(50) DEFAULT NULL COMMENT '行业',
    `city` varchar(50) DEFAULT NULL COMMENT '工作城市',
    `salary_min` decimal(10,2) DEFAULT NULL COMMENT '最低薪资',
    `salary_max` decimal(10,2) DEFAULT NULL COMMENT '最高薪资',
    `experience_required` varchar(50) DEFAULT NULL COMMENT '经验要求',
    `education_required` varchar(50) DEFAULT NULL COMMENT '学历要求',
    `job_description` text COMMENT '职位描述',
    `job_requirements` text COMMENT '任职要求',
    `benefits` varchar(500) DEFAULT NULL COMMENT '福利待遇',
    `contact_person` varchar(50) DEFAULT NULL COMMENT '联系人',
    `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `contact_email` varchar(100) DEFAULT NULL COMMENT '联系邮箱',
    `view_count` int(11) DEFAULT 0 COMMENT '浏览次数',
    `application_count` int(11) DEFAULT 0 COMMENT '投递次数',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0草稿 1招聘中 2已暂停 3已结束',
    `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
    `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_company_id` (`company_id`),
    KEY `idx_city` (`city`),
    KEY `idx_job_category` (`job_category`),
    KEY `idx_status` (`status`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位表';

  -- 19. 简历投递表
  CREATE TABLE `job_applications` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '投递ID',
    `job_id` bigint(20) NOT NULL COMMENT '职位ID',
    `user_id` bigint(20) NOT NULL COMMENT '求职者ID',
    `resume_url` varchar(500) DEFAULT NULL COMMENT '简历URL',
    `application_status` tinyint(2) DEFAULT 0 COMMENT '状态: 0待查看 1已查看 2面试中 3已录用 4已拒绝',
    `remark` varchar(500) DEFAULT NULL COMMENT '备注',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_job_id` (`job_id`),
    KEY `idx_user_id` (`user_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历投递表';

  商家优惠表

  -- 20. 商家表
  CREATE TABLE `merchants` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商家ID',
    `merchant_name` varchar(200) NOT NULL COMMENT '商家名称',
    `merchant_logo` varchar(500) DEFAULT NULL COMMENT '商家Logo',
    `merchant_type` varchar(50) DEFAULT NULL COMMENT '商家类型',
    `industry` varchar(50) DEFAULT NULL COMMENT '行业',
    `province` varchar(50) DEFAULT NULL COMMENT '省份',
    `city` varchar(50) DEFAULT NULL COMMENT '城市',
    `address` varchar(500) DEFAULT NULL COMMENT '详细地址',
    `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
    `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
    `contact_person` varchar(50) DEFAULT NULL COMMENT '联系人',
    `contact_phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
    `business_hours` varchar(100) DEFAULT NULL COMMENT '营业时间',
    `description` text COMMENT '商家描述',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0待审核 1已通过 2已拒绝 3已停用',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_city` (`city`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

  -- 21. 优惠券表
  CREATE TABLE `coupons` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '优惠券ID',
    `merchant_id` bigint(20) NOT NULL COMMENT '商家ID',
    `coupon_name` varchar(200) NOT NULL COMMENT '优惠券名称',
    `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
    `coupon_type` tinyint(2) DEFAULT 1 COMMENT '类型: 1折扣券 2代金券 3兑换券',
    `discount_value` decimal(10,2) DEFAULT NULL COMMENT '优惠金额/折扣值',
    `min_amount` decimal(10,2) DEFAULT 0.00 COMMENT '最低消费金额',
    `total_quantity` int(11) DEFAULT NULL COMMENT '发行总量',
    `claimed_quantity` int(11) DEFAULT 0 COMMENT '已领取数量',
    `used_quantity` int(11) DEFAULT 0 COMMENT '已使用数量',
    `description` text COMMENT '使用说明',
    `start_time` datetime DEFAULT NULL COMMENT '有效期开始',
    `end_time` datetime DEFAULT NULL COMMENT '有效期结束',
    `status` tinyint(2) DEFAULT 1 COMMENT '状态: 0草稿 1进行中 2已结束 3已下架',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_merchant_id` (`merchant_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

  -- 22. 用户优惠券表
  CREATE TABLE `user_coupons` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `coupon_id` bigint(20) NOT NULL COMMENT '优惠券ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `merchant_id` bigint(20) NOT NULL COMMENT '商家ID',
    `coupon_code` varchar(50) NOT NULL COMMENT '券码',
    `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0未使用 1已使用 2已过期',
    `used_time` datetime DEFAULT NULL COMMENT '使用时间',
    `verify_code` varchar(20) DEFAULT NULL COMMENT '核销码',
    `expire_time` datetime NOT NULL COMMENT '过���时间',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_coupon_code` (`coupon_code`),
    KEY `idx_user_id` (`user_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

  系统日志表

  -- 23. 操作日志表
  CREATE TABLE `operation_logs` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` bigint(20) DEFAULT NULL COMMENT '操作用户ID',
    `username` varchar(50) DEFAULT NULL COMMENT '用户名',
    `module` varchar(50) DEFAULT NULL COMMENT '模块',
    `operation` varchar(100) DEFAULT NULL COMMENT '操作类型',
    `method` varchar(200) DEFAULT NULL COMMENT '请求方法',
    `request_url` varchar(500) DEFAULT NULL COMMENT '请求URL',
    `request_params` text COMMENT '请求参数',
    `response_data` text COMMENT '响应数据',
    `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
    `location` varchar(100) DEFAULT NULL COMMENT 'IP归属地',
    `user_agent` varchar(500) DEFAULT NULL COMMENT 'User-Agent',
    `execute_time` int(11) DEFAULT NULL COMMENT '执行时间(ms)',
    `status` tinyint(2) DEFAULT 1 COMMENT '状态: 0失败 1成功',
    `error_msg` varchar(500) DEFAULT NULL COMMENT '错误信息',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_module` (`module`),
    KEY `idx_created_at` (`created_at`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

  2.2 数据库ER图（文本版）

  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │    users     │         │    roles     │         │permissions  │
  │  (用户表)    │         │  (角色表)    │         │  (权限表)    │
  ├──────────────┤         ├──────────────┤         ├──────────────┤
  │ id (PK)      │    ┌──→│ id (PK)      │    ┌──→│ id (PK)      │
  │ openid       │    │   │ role_name    │    │   │ permission_  │
  │ nickname     │    │   │ role_code    │    │   │   name       │
  │ real_name    │    │   │ description  │    │   │ permission_  │
  │ status       │    │   └──────────────┘    │   │   code       │
  │ ...          │    │         │              │   └──────────────┘
  └──────────────┘    │         │              │          │
         │            │         │              │          │
         │            │         │              │          │
         ▼            │         ▼              │          ▼
  ┌──────────────┐    │  ┌──────────────┐     │  ┌──────────────┐
  │alumni_cards  │    │  │user_roles    │     │  │role_         │
  │  (校友卡)    │    │  │(用户角色)    │     │  │permissions   │
  ├──────────────┤    │  ├──────────────┤     │  └──────────────┘
  │ id (PK)      │    │  │ user_id (FK) │     │
  │ user_id (FK) │    │  │ role_id (FK) │     │
  │ card_no      │    │  └──────────────┘     │
  │ qr_code      │    │                       │
  │ ...          │    │                       │
  └──────��───────┘    │                       │
                      │                       │
         ┌────────────┴───────────┐          │
         ▼                        ▼          ▼
  ┌──────────────┐         ┌──────────────┐ ┌──────────────┐
  │return_visits │         │    events    │ │   groups     │
  │  (返校预约)   │         │   (活动)     │ │  (社群)      │
  ├──────────────┤         ├──────────────┤ ├──────────────┤
  │ id (PK)      │         │ id (PK)      │ │ id (PK)      │
  │ user_id (FK) │         │ organizer_id │ │ owner_id (FK)│
  │ visit_date   │    ┌──→ │ (FK)         │ │ group_name   │
  │ status       │    │    │ ...          │ │ ...          │
  │ ...          │    │    └──────────────┘ └──────────────┘
  └──────────────┘    │           │                  │
                      │           │                  │
                      │           ▼                  ▼
                      │  ┌──────────────┐   ┌──────────────┐
                      │  │event_registr.│   │group_members │
                      │  │(活动报名)    │   │(群组成员)    │
                      │  ├──────────────┤   ├──────────────┤
                      │  │ event_id(FK) │   │ group_id (FK)│
                      │  │ user_id (FK) │   │ user_id (FK) │
                      │  │ ...          │   │ ...          │
                      │  └──────────────┘   └──────────────┘
                      │
                      ▼
           ┌────────────────────┐
           │  donation_projects │
           │   (捐赠项目)       │
           ├────────────────────┤
           │ id (PK)            │
           │ project_code       │
           │ ...                │
           └────────────────────┘
                    │
                    ▼
           ┌────────────────────┐
           │    donations       │
           │   (捐赠记录)       │
           ├────────────────────┤
           │ project_id (FK)    │
           │ user_id (FK)       │
           │ ...                │
           └────────────────────┘