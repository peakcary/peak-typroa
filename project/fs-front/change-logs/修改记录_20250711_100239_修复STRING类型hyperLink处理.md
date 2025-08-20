# 表格组件STRING类型hyperLink处理修复记录

## 修改时间
2025-07-11 10:02:39

## 修改文件
`/src/components/jsonSchema/Tables_new/commonTable.vue`

## 问题描述
之前的代码优化过程中，STRING类型数据的hyperLink处理逻辑被简化，导致带有hyperLink的数据无法正确渲染为可点击链接。

## 数据格式示例
需要支持的数据格式：
```javascript
{
  "value": "JG-AAA-1001",
  "hyperLink": {
    "iconName": "fz-form-view",
    "iconPrompt": "详情",
    "fetchSelected": true,
    "showMode": "text",
    "type": "postMessage",
    "refreshSchemaPage": false,
    "deleteSchemaPage": false,
    "postData": {
      "url": "/erp/front/bean-token/detail-schema/page?metaId=1938136327744786432&formType=FOO_BEAN&id=1943126620688748544",
      "type": "openSchemaPage",
      "comType": "allShowModelValue"
    }
  }
}
```

## 具体修改内容

### 修改位置
**行号**: 707-714行（STRING类型渲染逻辑）

### 修改前
```javascript
if (col.widget === "STRING") {
  baseCol.slots = {
    default: createRenderFunction(({ row, column }) => {
      const cellData = row[column.columnName] || {};
      const value = cellData.value || "";
      return h("span", value);
    }, col),
  };
}
```

### 修改后
```javascript
if (col.widget === "STRING") {
  baseCol.slots = {
    default: createRenderFunction(({ row, column }) => {
      const cellData = row[column.columnName] || {};
      const value = cellData.value || "";

      // 处理 hyperLink 的情况
      if (cellData.hyperLink) {
        const linkContent = cellData.iconName
          ? h("span", { style: "width: 100%; display: inline-flex; align-items: center;" }, [
              h("span", {
                class: ["iconfont", cellData.iconName],
                style: { color: cellData.iconColor || "#666", marginRight: "6px", flexShrink: "0" }
              }),
              h("span", {
                style: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1;"
              }, value)
            ])
          : value;

        return h(ElLink, {
          type: "primary",
          underline: false,
          class: "table-cell-link",
          onClick: (e) => {
            e.stopPropagation();
            handleAction(cellData.hyperLink);
          }
        }, linkContent);
      }

      // 处理带图标的普通文本
      if (cellData.iconName) {
        return h("span", {
          class: "string-cell-with-icon",
          style: "width: 100%; display: inline-flex; align-items: center;"
        }, [
          h("span", {
            class: ["iconfont", cellData.iconName],
            style: { color: cellData.iconColor || "#666", marginRight: "6px", flexShrink: "0" }
          }),
          h("span", {
            style: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; flex: 1;"
          }, value)
        ]);
      }

      // 普通文本
      return h("span", {
        style: "width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; line-height: 40px;"
      }, value);
    }, col),
  };
}
```

## 修复功能
1. **hyperLink支持**: 当数据包含hyperLink时，渲染为ElLink组件，支持点击事件
2. **图标支持**: 支持带图标的超链接和普通文本显示
3. **事件处理**: 正确调用handleAction处理hyperLink中的各种动作类型
4. **样式保持**: 保持文本省略号、垂直居中等原有样式
5. **兼容性**: 完全兼容普通字符串显示

## 支持的交互类型
- `postMessage`: 发送消息事件
- `goto_url`: 页面跳转
- 其他通过handleAction处理的动作类型

## 影响范围
仅影响STRING类型列的数据渲染，恢复了hyperLink功能，不影响其他类型列的显示。

## 测试建议
1. 测试带hyperLink的STRING数据点击功能
2. 测试带图标的hyperLink显示
3. 测试普通STRING数据显示正常
4. 验证文本省略号功能正常