# 协同工作空间API对接 - 实施计划

## [ ] Task 1: 实现数据转换工具和类型定义整合
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 创建数据转换函数，处理驼峰 ↔ 下划线命名
  - 统一类型定义，使用API定义的类型
  - 处理缺失字段的兼容逻辑（如project_count显示"--"）
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - programmatic TR-1.1: 数据转换函数正确处理所有字段
  - programmatic TR-1.2: 类型定义不冲突
- **Notes**: 先建立转换层，为后续API调用做准备

## [ ] Task 2: 工作空间列表和详情页API对接
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 使用getWorkspacePage替换mock数据
  - 使用getWorkspace获取详情
  - 实现搜索和筛选使用API参数
  - 添加loading状态和错误处理
  - 补充删除、归档、激活按钮和功能
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-6]
- **Test Requirements**:
  - programmatic TR-2.1: 列表通过API加载
  - programmatic TR-2.2: 详情页通过API加载
  - human-judgement TR-2.3: loading和错误状态展示正确
  - programmatic TR-2.4: 删除/归档/激活功能正常

## [ ] Task 3: 创建和编辑工作空间API对接
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 调用createWorkspace创建工作空间
  - 调用updateWorkspace编辑工作空间
  - 成功后刷新列表或返回详情
  - 表单验证和错误提示
- **Acceptance Criteria Addressed**: [AC-2, AC-6]
- **Test Requirements**:
  - programmatic TR-3.1: 创建成功后列表正确刷新
  - programmatic TR-3.2: 编辑成功后数据正确更新
  - human-judgement TR-3.3: 错误提示友好展示

## [ ] Task 4: 成员管理API对接
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 使用getMemberPage获取成员列表
  - 使用addMember添加成员（需要获取可选用户列表，暂时保持mock用户）
  - 使用removeMember移除成员
  - 使用changeMemberRole变更角色
  - 所有操作后刷新列表
- **Acceptance Criteria Addressed**: [AC-1, AC-3, AC-6]
- **Test Requirements**:
  - programmatic TR-4.1: 成员列表通过API加载
  - programmatic TR-4.2: 添加/移除/角色变更功能正常
  - human-judgement TR-4.3: loading和错误状态展示正确

## [ ] Task 5: 角色管理API对接
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 使用getRoleList获取角色列表
  - 使用getRoleDetail获取角色详情
  - 使用getRoleHierarchy获取层级结构
  - 移除对mock数据的依赖
- **Acceptance Criteria Addressed**: [AC-1, AC-4, AC-6]
- **Test Requirements**:
  - programmatic TR-5.1: 角色数据通过API加载
  - human-judgement TR-5.2: 权限对比表正确展示

## [ ] Task 6: 补充缺失功能的UI实现
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - 在工作空间卡片添加删除/归档/激活操作按钮（根据状态）
  - 添加确认弹窗（删除前确认）
  - 更新状态展示（归档状态的视觉提示）
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - human-judgement TR-6.1: 操作按钮按状态正确显示
  - human-judgement TR-6.2: 删除时有确认提示

## [ ] Task 7: 更新对比分析文档
- **Priority**: P1
- **Depends On**: Task 2-6
- **Description**:
  - 更新功能-API接口对比分析.md
  - 标记已实现的功能
  - 记录当前状态
- **Acceptance Criteria Addressed**: []
- **Test Requirements**:
  - human-judgement TR-7.1: 文档内容更新正确
