---
name: "frontend-dev-workflow"
description: "前端开发流程规范，确保前端开发规范化、模块化，提高代码可维护性和可扩展性。在生成前端代码时必须调用此SKILL。"
---

# Frontend Dev Workflow - 前端开发流程规范

## 🎯 核心目标

确保前端开发过程规范化、模块化，提高代码可维护性和可扩展性，通过清晰的文档展示开发成果。

## 📋 第一阶段：需求分析与规划（必须优先完成）

在开始生成任何代码前，必须先完成以下工作：

### 1.1 需求分析
- [ ] 全面分析用户提出的需求
- [ ] 准确理解用户意图和功能目标
- [ ] 识别关键技术难点和潜在问题

### 1.2 生成详细开发计划表
**必须生成并提交用户确认后方可执行后续开发**，计划表必须包含：

#### 1.2.1 功能模块划分
```markdown
## 功能模块划分
- 模块一：[模块名称]
  - 子功能1
  - 子功能2
  - 子功能3

- 模块二：[模块名称]
  - 子功能1
  - 子功能2
...
```

#### 1.2.2 技术栈选择与确认
```markdown
## 技术栈选择
- 框架：Vue 3 / React / 等
- UI框架：Element Plus / Ant Design / 等
- 状态管理：Pinia / Redux / 等
- 路由：Vue Router / React Router / 等
- 其他技术：TypeScript, Axios, 等
```

#### 1.2.3 开发时间节点与里程碑
```markdown
## 开发时间节点
- 阶段一：[功能名称] - [预计完成时间]
  - 任务1
  - 任务2

- 阶段二：[功能名称] - [预计完成时间]
  - 任务1
  - 任务2
...
```

#### 1.2.4 组件结构设计
```markdown
## 组件结构设计
- 组件1：/src/components/ComponentName.vue
  - 功能说明
  - 依赖组件
  - Props定义

- 组件2：/src/components/OtherComponent.vue
  - 功能说明
  - 依赖组件
  - Props定义
...
```

#### 1.2.5 接口交互规划
```markdown
## 接口交互规划
- 接口1：GET /api/xxx
  - 参数：{ id: number, page: number }
  - 返回：{ data: [], total: number }
  - 使用位置：组件A、组件B

- 接口2：POST /api/yyy
  - 参数：{ name: string, value: any }
  - 返回：{ success: boolean }
  - 使用位置：组件C
...
```

### 1.3 用户确认
开发计划表完成后，必须等待用户确认后方可进入下一阶段。

## 🔧 第二阶段：代码生成规范

### 2.1 模块化开发原则
- [ ] 严格遵循模块化开发原则
- [ ] 将不同功能模块封装为独立组件
- [ ] **禁止**将多个功能模块或组件代码混合编写在同一个文件中

### 2.2 文件结构规范
```
src/
├── components/          # 组件目录
│   ├── ComponentA.vue
│   ├── ComponentB.vue
│   └── ...
├── types.ts          # 所有类型定义
├── utils/           # 通用工具函数
│   ├── helpers.ts  # 辅助方法
│   ├── api.ts      # API工具
│   └── ...
├── views/           # 页面组件
├── api/             # API接口
└── ...
```

### 2.3 类型定义规范
- [ ] 所有类型定义**必须**放置在 `types.ts` 文件中
```typescript
// types.ts - 所有类型集中定义
export interface User {
  id: number;
  name: string;
  createdAt: string;
}

export interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}
```

### 2.4 工具函数规范
- [ ] 通用工具函数、辅助方法必须放置在 `utils/` 目录下
- [ ] 按功能进行分类组织
```
utils/
├── date.ts     # 日期处理工具
├── format.ts  # 格式化工具
├── validate.ts # 验证工具
└── storage.ts # 存储工具
```

### 2.5 代码格式规范
- [ ] 组件命名：PascalCase（首字母大写）
- [ ] 文件命名：kebab-case（短横线分隔）
- [ ] 变量命名：camelCase（驼峰命名）
- [ ] 常量命名：UPPER_SNAKE_CASE（全大写下划线分隔）
- [ ] 组件结构清晰，注释完整

## 📦 第三阶段：交付文档要求

代码生成完成后，**必须输出详细的实现功能清单文档：

### 3.1 修改/创建的文件列表
```markdown
## 文件列表
- [新增] /src/components/NewComponent.vue
- [修改] /src/views/Home.vue
- [新增] /src/types.ts
- [新增] /src/utils/helpers.ts
```

### 3.2 功能点说明
```markdown
## 新增功能点
- NewComponent.vue
  - 功能1：实现了xxx
  - 功能2：实现了yyy
  - 功能3：实现了zzz

- Home.vue
  - 修改1：调整了aaa
  - 修改2：更新了bbb
```

### 3.3 删除或修改的原有功能
```markdown
## 修改/删除功能
- 组件A：删除了xxx功能
- 组件B：修改了yyy功能，改为zzz
```

### 3.4 组件间依赖关系
```markdown
## 组件依赖关系
- App.vue → 依赖：Header.vue, Footer.vue, MainContent.vue
- Header.vue → 依赖：SearchBar.vue, UserMenu.vue
- MainContent.vue → 依赖：List.vue, Detail.vue
```

### 3.5 关键功能实现逻辑
```markdown
## 关键实现逻辑
1. 用户登录流程
   - 步骤1：验证用户输入
   - 步骤2：调用API
   - 步骤3：存储Token
   - 步骤4：跳转页面

2. 数据获取逻辑
   - 步骤1：请求API
   - 步骤2：数据处理
   - 步骤3：状态更新
   - 步骤4：界面渲染
```

## 🚨 执行流程图

```
用户需求
    ↓
需求分析
    ↓
生成开发计划表
    ↓
用户确认
    ↓
模块化代码生成
    ↓
交付文档
    ↓
完成
```

## 📝 标准示例

### 标准开发计划表示例：

```markdown
# 前端开发计划
## 功能模块划分
- 用户管理模块
  - 用户列表
  - 用户编辑
  - 用户删除

## 技术栈
- Vue 3 + TypeScript + Element Plus + Pinia

## 组件结构
- UserList.vue: 用户列表组件
- UserEdit.vue: 用户编辑组件
- types.ts: 类型定义
```

---

**生效日期**: 2026-05-19
**最后更新**: 2026-05-19
