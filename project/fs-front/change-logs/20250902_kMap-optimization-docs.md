# kMap.vue 组件优化文档

## 概述
基于参考组件 `/Users/peakom/workbd/web-front/src/components/json_schema_echart/world_echart.tsx`，完善了 kMap.vue 组件，实现了世界地图上的车辆分布可视化功能。

## 主要功能实现

### 1. 基础架构改造

**原始代码问题：**
- 空白的template，只显示"bbb"文字
- 未实现任何图表功能
- 缺少必要的props定义

**改进后：**
```vue
<template>
  <div class="kmap-container" ref="chartContainer"></div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watch, ref, nextTick } from "vue";
import * as echarts from "echarts";
import worldJson from "./world.json";
</script>
```

### 2. Props接口设计

```javascript
props: {
  chatHeight: {
    type: [String, Number],
    default: "400px",
  },
  id: {
    type: String,
    default: "kmap",
  },
  chatoption: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    default: () => [/* 默认车辆数据 */]
  }
}
```

### 3. 世界地图注册与配置

```javascript
// 注册世界地图
echarts.registerMap("world", worldJson);

// 地图配置
geo: {
  map: "world",
  roam: true,
  aspectScale: Math.cos((chRoughLatitude * Math.PI) / 180),
  label: {
    show: false,
  },
}
```

### 4. 坐标转换逻辑

**亚洲居中的地图投影：**
```javascript
const translationLngDo = (lng) => {
  if (lng > -30) {
    lng = lng - 180;
  } else {
    lng = lng + 180;
  }
  return lng;
};

const translationLng = (data) => {
  const retList = [];
  let lng = translationLngDo(data[0]);
  retList.push(lng);
  for (let idx = 1; idx < data.length; idx++) {
    retList.push(data[idx]);
  }
  return retList;
};
```

### 5. 数据转换与航线绘制

```javascript
const convertData = function (data) {
  return data.map((item) => {
    return [
      {
        coord: [translationLngDo(item[0]), item[1]], // 起点坐标
      },
      {
        coord: [translationLngDo(item[2]), item[3]], // 终点坐标
      },
    ];
  });
};
```

## 核心优化：相同坐标点聚合

### 问题描述
多个数据点具有相同坐标时，ECharts默认只显示最后一个点的tooltip信息，导致信息丢失。

### 解决方案

**数据聚合函数：**
```javascript
const groupDataByCoordinates = (data) => {
  const grouped = {};
  
  data.forEach((item) => {
    const startCoord = `${translationLngDo(item[0])},${item[1]}`;
    
    if (!grouped[startCoord]) {
      grouped[startCoord] = {
        coord: [translationLngDo(item[0]), item[1]],
        items: []
      };
    }
    
    grouped[startCoord].items.push(item);
  });
  
  return Object.values(grouped);
};
```

**聚合后的数据处理：**
```javascript
data: groupedData.map((group) => {
  const totalCount = group.items.reduce((sum, item) => sum + (item[4] || 0), 0);
  return {
    value: group.coord,
    symbolSize: Math.max(16, Math.min(24, 16 + totalCount)), // 动态大小
    items: group.items, // 保存原始数据
    totalCount: totalCount // 总数量
  };
})
```

## Tooltip 优化

### 智能定位系统

```javascript
tooltip: {
  confine: true, // 限制在容器内
  position: function (point, params, dom, rect, size) {
    const containerWidth = size.viewSize[0];
    const containerHeight = size.viewSize[1];
    const tooltipWidth = size.contentSize[0];
    const tooltipHeight = size.contentSize[1];
    
    // 默认位置：右上方
    let x = point[0] + 10;
    let y = point[1] - tooltipHeight - 10;
    
    // 边界检测和调整
    if (x + tooltipWidth > containerWidth) {
      x = point[0] - tooltipWidth - 10; // 移到左边
    }
    
    if (y < 0) {
      y = point[1] + 20; // 移到下方
    }
    
    if (y + tooltipHeight > containerHeight) {
      y = containerHeight - tooltipHeight - 10; // 贴近底部
    }
    
    return [x, y];
  }
}
```

### 内容格式化

```javascript
formatter: function (params) {
  const items = params.data.items;
  const tooltipItems = [];
  
  items.forEach((item, index) => {
    const list = [];
    for (let i = 5; i < item.length; i++) {
      list.push(item[i]);
    }
    // 添加分隔线和间距
    tooltipItems.push(`
      <div style="
        margin-bottom: ${index < items.length - 1 ? '8px' : '0'}; 
        padding-bottom: ${index < items.length - 1 ? '8px' : '0'}; 
        ${index < items.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.2)' : ''}
      ">
        ${list.join('<br>')}
      </div>
    `);
  });
  
  return tooltipItems.join('');
}
```

### 样式优化

```javascript
tooltip: {
  backgroundColor: 'rgba(0, 0, 0, 0.8)', // 半透明黑色背景
  borderColor: '#333',
  borderWidth: 1,
  textStyle: {
    color: '#fff',
    fontSize: 12
  },
  padding: [8, 12] // 合适的内边距
}
```

## 图表系列配置

### 1. 效果散点图（effectScatter）
- 显示起始港口位置
- 动态符号大小反映数据密度
- 聚合tooltip显示所有相关信息

### 2. 动画航线效果（lines - 第一层）
- `zlevel: 1` - 底层动画轨迹
- 橙色拖尾效果 `#fcb160`
- 无线条宽度，纯特效

### 3. 航线连接（lines - 第二层）
- `zlevel: 2` - 顶层实际连线
- 蓝色线条 `#337dfe`
- 半透明效果，弯曲度0.2

## 响应式处理

```javascript
// 图表自适应
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 监听窗口变化
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

// 数据变化监听
watch(() => props.data, () => {
  updateChart();
}, { deep: true });
```

## 样式配置

```scss
.kmap-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #fff;
}
```

## 数据格式要求

```javascript
// 数组格式：[起始经度, 起始纬度, 目标经度, 目标纬度, 数量, 标题, 起始港描述, 目标港描述]
[
  [-123.105949, 49.289773, 117.7373, 38.96904, 2, 
   "TJMC-1807: 3台", 
   "当前港: VANCOUVER, BC, CANADA, 日期: 08-19-2025", 
   "目的港: XINGANG, TIANJIN, CHINA, CN, 日期: 09-15-2025"]
]
```

## 主要改进总结

1. **功能完整性**：从空白组件到完整的世界地图可视化
2. **数据聚合**：解决相同坐标点信息丢失问题
3. **智能定位**：Tooltip自动避免边界溢出
4. **视觉优化**：合适的符号大小和清晰的信息展示
5. **响应式设计**：适配不同屏幕尺寸和数据变化

## 使用示例

```vue
<template>
  <kMap 
    :data="vehicleData" 
    :chatHeight="500" 
    :chatoption="customOptions"
  />
</template>
```

该组件现在完全具备了生产环境使用的功能和稳定性。