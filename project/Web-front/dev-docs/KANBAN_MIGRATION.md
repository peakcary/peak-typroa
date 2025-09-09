# Kanban Board Migration: react-trello → Atlassian Pragmatic Drag and Drop

## 概述

我们已经成功将看板组件从 `react-trello` 迁移到 Atlassian 的 `Pragmatic drag and drop` 库。这次迁移带来了以下改进：

## 主要改进

### 1. 性能优化
- **更小的包体积**: Pragmatic drag and drop 核心包只有 ~4.7kB，而 react-trello 约为 31kB
- **按需加载**: 只加载实际使用的功能模块
- **原生拖拽**: 使用浏览器原生 HTML5 拖拽 API，性能更好

### 2. 新增功能
- ✅ **卡片拖拽**: 支持卡片在同一列内重新排序
- ✅ **跨列拖拽**: 支持卡片在不同列之间移动
- ✅ **列拖拽**: 支持整个列的重新排序（新功能）
- ✅ **拖拽指示器**: 清晰的视觉反馈显示拖拽目标位置
- ✅ **拖拽预览**: 拖拽时的半透明效果

### 3. 更好的用户体验
- **实时状态更新**: 拖拽操作立即反映在界面上
- **视觉反馈**: 拖拽过程中的高亮和指示器
- **流畅动画**: 平滑的过渡效果

## 技术实现

### 核心组件

1. **CustomBoard**: 替代 react-trello 的 Board 组件
2. **DraggableLane**: 可拖拽的列组件
3. **DraggableCard**: 可拖拽的卡片组件

### 关键特性

#### 状态管理
```typescript
const [lanes, setLanes] = React.useState(data?.lanes || []);
const [draggedCardId, setDraggedCardId] = React.useState(null);
const [draggedLaneId, setDraggedLaneId] = React.useState(null);
const [cardClosestEdges, setCardClosestEdges] = React.useState({});
const [laneClosestEdges, setLaneClosestEdges] = React.useState({});
```

#### 拖拽监听
```typescript
React.useEffect(() => {
  return monitorForElements({
    onDragStart: ({ source }) => { /* 处理拖拽开始 */ },
    onDrag: ({ source, location }) => { /* 处理拖拽过程 */ },
    onDrop: ({ source, location }) => { /* 处理拖拽结束 */ },
  });
}, [lanes, onCardMoveAcrossLanes, updateLocalLanes]);
```

## 支持的拖拽场景

### 卡片拖拽
1. **同列重排**: 在同一列内改变卡片顺序
2. **跨列移动**: 将卡片从一列移动到另一列
3. **精确定位**: 可以拖拽到其他卡片的上方或下方
4. **空列拖拽**: 可以拖拽到空的列中

### 列拖拽
1. **列重排**: 改变列的顺序
2. **左右定位**: 可以拖拽到其他列的左侧或右侧

## 兼容性

### 保持的 API
- `onCardClick`: 卡片点击事件
- `onCardMoveAcrossLanes`: 跨列移动回调
- `onLaneAdd`: 添加列回调
- `onLaneDelete`: 删除列回调

### 新增的功能
- 列拖拽重排（自动处理，无需额外配置）
- 更精确的拖拽定位
- 实时的视觉反馈

## 调试功能

在开发模式下，控制台会输出详细的拖拽日志：
- 拖拽开始事件
- 拖拽目标信息
- 拖拽结果确认

## 样式定制

### 主要样式组件
- `BoardContainer`: 看板容器
- `LaneContainer`: 列容器
- `CardsContainer`: 卡片容器
- `DropIndicator`: 拖拽指示器
- `LaneDropIndicator`: 列拖拽指示器

### 自定义样式
所有组件都使用 styled-components，可以轻松自定义样式：

```typescript
const LaneContainer = styled.div<{ isDraggedOver?: boolean; isDragging?: boolean }>`
  opacity: ${props => props.isDragging ? 0.5 : 1};
  border: 2px solid ${props => props.isDraggedOver ? '#1b9aee' : 'transparent'};
`;
```

## 迁移完成

✅ 移除了 react-trello 依赖
✅ 实现了所有原有功能
✅ 新增了列拖拽功能
✅ 改善了用户体验
✅ 优化了性能

现在的看板组件更加现代化、高性能，并且提供了更丰富的交互功能。 