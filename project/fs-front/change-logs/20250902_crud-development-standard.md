# 标准CRUD操作开发模式文档

基于 Vue 3 + Element Plus 的标准增删改查操作开发模式，适用于列表页面的常见操作。

## 1. 依赖导入

### 必需的 API 导入
```javascript
import {
  baseDataList,
  baseDataGet,
  baseDataSave,
  baseDataDelete,
  dataComboData,
} from "@/apis/common/index"
import { getFilterIns, LookupExpr } from "@/utils/filter_util"
import { get } from "@/axios/fetch.ts"
import { EventMessage } from "@/utils/eventMessage"
```

### 必需的组件导入
```javascript
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Edit, Delete, Folder, Document } from '@element-plus/icons-vue'
```

## 2. 响应式数据定义

```javascript
const cardList = ref([])           // 列表数据
const loading = ref(false)         // 加载状态
const selectedCard = ref(null)     // 选中的项目
```

## 3. API 调用标准

### 3.1 列表查询 (READ)
```javascript
const loadCardList = async () => {
  loading.value = true
  try {
    const { type, data } = await baseDataList({
      formType: "YOUR_FORM_TYPE", // 替换为实际的formType
      filter: getFilterIns()
        .ascSort("disOrder")
        .getFilterObject(),
    })
    if (type === "success") {
      cardList.value = data || []
    } else {
      cardList.value = []
    }
  } catch (error) {
    console.error('加载列表失败:', error)
    cardList.value = []
  } finally {
    loading.value = false
  }
}
```

### 3.2 新增操作 (CREATE)
```javascript
const handleAdd = async () => {
  try {
    const { type, data } = await get(
      "/erp/front/bean-token/common/createAction?formType=YOUR_FORM_TYPE"
    )
    if (type === "success") {
      EventMessage.sendMessage({
        ...(data.postData || {}),
        vue_target: "YOUR_VUE_TARGET", // 替换为实际的目标标识
      })
    }
  } catch (error) {
    console.error('新增失败:', error)
  }
}
```

### 3.3 编辑操作 (UPDATE)
```javascript
const handleEdit = async (item) => {
  try {
    const { type, data } = await get(
      `/erp/front/bean-token/common/modifyAction?formType=YOUR_FORM_TYPE&id=${item.id}`
    )
    if (type === "success") {
      EventMessage.sendMessage({
        ...(data.postData || {}),
        vue_target: "YOUR_VUE_TARGET",
      })
    }
  } catch (error) {
    console.error('编辑失败:', error)
  }
}
```

### 3.4 删除操作 (DELETE)
```javascript
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${item.name}」吗？`, // 根据实际字段调整
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const { type } = await baseDataDelete("YOUR_FORM_TYPE", {
      ids: [item.id],
    })
    
    if (type === "success") {
      ElMessage.success('删除成功')
      await loadCardList() // 重新加载列表
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}
```

### 3.5 详情获取
```javascript
const handleCardClick = async (item) => {
  selectedCard.value = item
  
  // 获取详细信息
  try {
    const { data } = await baseDataGet({
      formType: "YOUR_FORM_TYPE",
      id: item.id,
    })
    if (data) {
      selectedCard.value = { ...item, ...data }
    }
  } catch (error) {
    console.error('获取详情失败:', error)
  }
}
```

## 4. 事件监听处理

### EventMessage 事件监听
```javascript
onMounted(() => {
  window.addEventListener("to-sdp-sub-app", handleEventMessage)
  loadCardList() // 页面加载时获取数据
})

onUnmounted(() => {
  window.removeEventListener("to-sdp-sub-app", handleEventMessage, false)
})

// 处理EventMessage返回的数据
const handleEventMessage = async (event) => {
  const { detail } = event
  if (detail.vue_target === "YOUR_VUE_TARGET") {
    // 表单提交成功后重新加载列表
    await loadCardList()
  }
}
```

## 5. 模板结构

### 5.1 列表容器
```vue
<div class="card-list-container" v-loading="loading">
  <div 
    v-for="item in cardList" 
    :key="item.id"
    class="card-item"
    :class="{ active: selectedCard?.id === item.id }"
    @click="handleCardClick(item)"
  >
    <div class="card-content">
      <div class="card-title">{{ item.name }}</div>
      <div class="card-description">{{ item.description }}</div>
    </div>
    <div class="card-actions">
      <el-button 
        type="text" 
        size="small" 
        @click.stop="handleEdit(item)"
      >
        <el-icon><Edit /></el-icon>
      </el-button>
      <el-button 
        type="text" 
        size="small" 
        @click.stop="handleDelete(item)"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</div>
```

### 5.2 详情展示区域
```vue
<div class="detail-section">
  <div v-if="selectedCard" class="detail-content">
    <div class="detail-header">
      <h3 class="detail-title">{{ selectedCard.name }}</h3>
    </div>
    <div class="detail-body">
      <!-- 根据实际需求调整字段 -->
      <div class="detail-item">
        <label class="detail-label">名称:</label>
        <span class="detail-value">{{ selectedCard.name || '--' }}</span>
      </div>
      <div class="detail-item">
        <label class="detail-label">应用模式:</label>
        <span class="detail-value">{{ selectedCard.applyModeName || '--' }}</span>
      </div>
      <!-- 可以根据需求添加更多字段 -->
    </div>
  </div>
  <div v-else class="detail-placeholder">
    <el-empty description="请选择左侧的项目查看详情" :image-size="60" />
  </div>
</div>
```

## 6. 参数配置清单

使用此模式时需要替换的参数：

| 参数 | 说明 | 示例 |
|------|------|------|
| `YOUR_FORM_TYPE` | 表单类型，用于API调用 | `ABS_META`, `BASE_AIM_META` |
| `YOUR_VUE_TARGET` | Vue事件目标标识 | `absSetting`, `userManagement` |
| 详情字段 | 根据实际业务调整显示字段 | `name`, `applyModeName`, `status` |
| 删除确认文本 | 根据业务场景调整确认提示 | `确定要删除「${item.name}」吗？` |

## 7. 使用步骤

1. 复制模板代码到新页面
2. 替换所有 `YOUR_FORM_TYPE` 为实际的表单类型
3. 替换所有 `YOUR_VUE_TARGET` 为实际的事件目标
4. 根据业务需求调整详情显示字段
5. 调整删除确认提示文本
6. 根据需要调整列表显示字段和样式

## 8. 注意事项

- 确保 `vue_target` 在整个应用中唯一
- 删除操作需要用户确认，避免误删
- 所有API调用都需要错误处理
- 列表操作后需要重新加载数据
- EventMessage 事件监听需要在组件卸载时清理

## 9. 错误处理

- API 调用失败时在控制台输出错误信息
- 删除失败时显示用户友好的错误提示
- 网络错误或服务器错误统一处理
- 用户取消删除操作不显示错误信息

此标准模式确保了代码的一致性和可维护性，可以快速复用到其他类似的CRUD页面开发中。