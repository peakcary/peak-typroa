# 数据空间页面Tab改造说明

## 概述

本次改造为原有的 `dataSpaceMeta.vue` 页面添加了三个Tab切换功能，提供更好的用户体验和功能组织：

1. **管理模块** - 默认选中
2. **档案全周期** 
3. **数据空间** - 原有的数据空间展示功能

## 文件结构

### 新增文件

```
src/features/coordination/
├── dataSpaceMetaWithTabs.vue        # 主Tab容器组件
├── ManagementModule.vue             # 管理模块组件
├── ManagementTargetCard.vue         # 管理目标卡片组件  
├── LifecycleModule.vue              # 档案全周期组件
├── LifecycleCard.vue                # 档案全周期卡片组件
└── DataSpaceComponent.vue           # 数据空间组件(原逻辑)
```

### 修改文件

```
src/features/coordination/dataSpaceMeta.vue  # 简化为Tab容器的包装器
```

## 组件功能说明

### 1. dataSpaceMetaWithTabs.vue (主容器)
- **功能**: Tab切换的主容器
- **特性**:
  - 默认选中"管理模块"标签页
  - 使用 Element Plus 的 el-tabs 组件
  - 支持按需加载标签页内容
  - 美观的标签页样式，带有图标

### 2. ManagementModule.vue (管理模块)
- **功能**: 显示基础目标管理相关内容
- **特性**:
  - 筛选条件：生命周期模式选择 + 搜索框
  - 统计卡片：总数、激活状态、进行中等统计信息
  - 网格展示：使用 ManagementTargetCard 卡片展示
  - 详情对话框：支持查看目标详细信息
  - 数据来源：BASE_AIM_META 表

### 3. LifecycleModule.vue (档案全周期)
- **功能**: 显示档案全周期管理内容
- **特性**:
  - 筛选和搜索功能
  - 统计信息：档案总数、各域统计
  - 时间线对话框：可视化展示全周期阶段
  - 阶段进度：显示每个阶段的完成情况
  - 数据来源：POO_LIFE_CYCLE_DEFINE 表

### 4. DataSpaceComponent.vue (数据空间)
- **功能**: 保持原有数据空间展示功能
- **特性**:
  - 继承原 dataSpaceMeta.vue 的所有功能
  - 分组展示数据空间
  - 支持进入、配置、标题点击等操作
  - 数据来源：DATA_SPACE_META 表

## 卡片组件说明

### ManagementTargetCard.vue
- 管理目标信息展示
- 状态和模式标签
- 关联信息统计
- 操作菜单：查看详情、编辑、删除

### LifecycleCard.vue  
- 档案全周期信息展示
- 阶段进度条和指示器
- 时间线查看功能
- 脉动动画效果

## 样式设计

### Tab样式特点
- 现代化的标签页设计
- 悬停效果和激活状态
- 图标 + 文字的标签
- 响应式布局支持

### 卡片样式特点
- 统一的卡片设计语言
- 悬停动画效果
- 渐变背景图标
- 响应式网格布局

## 使用方式

在需要使用的地方引入：

```vue
<template>
  <DataSpaceMetaWithTabs />
</template>

<script>
import DataSpaceMetaWithTabs from '@/features/coordination/dataSpaceMetaWithTabs.vue'

export default {
  components: {
    DataSpaceMetaWithTabs
  }
}
</script>
```

## 注意事项

1. **性能优化**: 使用 `v-if` 实现按需加载，只有激活的标签页才会渲染内容
2. **状态管理**: 每个模块独立管理自己的状态
3. **响应式设计**: 所有组件都支持移动端适配
4. **可扩展性**: 可以轻松添加新的标签页模块

## 后续扩展建议

1. **添加更多标签页**: 如需要可以继续添加新的功能模块标签页
2. **标签页记忆**: 可以添加 localStorage 记忆用户最后访问的标签页
3. **权限控制**: 可以根据用户权限动态显示/隐藏某些标签页
4. **数据联动**: 不同标签页之间可以实现数据联动和通信

## 兼容性

- Vue 3.3.4+
- Element Plus 2.3.14+
- 现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+) 