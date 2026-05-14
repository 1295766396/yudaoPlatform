# 协同工作空间重构 - 实施计划

## [x] Task 1：更新 mock.ts 数据结构
- **优先级**：P0
- **依赖**：无
- **描述**：
  - 更新角色枚举为 7 个基线角色：PUBLIC_READER, READER, CONTRIBUTOR, AUTHOR, LEADER, ADMINISTRATOR, OWNER
  - 更新 Workspace 接口，添加 workspace_code, workspace_type, permission_level, is_default 字段
  - 更新 WorkspaceMember 接口，添加 last_access_time, status 字段
  - 添加完整的 7 个角色配置和权限数据
  - 更新模拟数据，包含默认空间标识
- **验收标准**：AC-001, AC-003
- **测试要求**：
  - human-judgment：数据结构完整，包含所有字段

---

## [ ] Task 2：重构角色体系展示
- **优先级**：P0
- **依赖**：Task 1
- **描述**：
  - 实现角色层级结构图（7级，从 Public Reader 到 Owner）
  - 实现角色权限详情展示（按模块分组）
  - 展示当前用户的角色位置
  - 删除原有的标签功能相关代码
- **验收标准**：AC-001, AC-002
- **测试要求**：
  - human-judgment：角色层级图正确展示
  - human-judgment：权限详情清晰可见

---

## [ ] Task 3：完善工作空间管理
- **优先级**：P0
- **依赖**：Task 1
- **描述**：
  - 实现创建工作空间对话框（名称、编码、类型、权限级别、描述）
  - 实现编辑工作空间对话框（编码不可修改）
  - 实现删除工作空间功能（有成员时提示不能删除）
  - 更新工作空间列表展示字段（名称、编码、权限级别、角色、状态、创建时间）
  - 添加搜索和筛选功能
- **验收标准**：AC-003, AC-005
- **测试要求**：
  - human-judgment：CRUD 功能完整
  - human-judgment：编辑时编码不可修改

---

## [ ] Task 4：完善成员管理功能
- **优先级**：P0
- **依赖**：Task 1
- **描述**：
  - 实现批量添加成员功能（支持选择多个用户）
  - 实现移除成员功能（二次确认）
  - 实现变更角色功能（7个角色可选）
  - 实现成员列表搜索和筛选
  - Owner 置顶显示
- **验收标准**：AC-004
- **测试要求**：
  - human-judgment：成员管理功能完整
  - human-judgment：Owner 置顶展示

---

## [ ] Task 5：整体代码清理和优化
- **优先级**：P1
- **依赖**：Tasks 1-4
- **描述**：
  - 清理无用代码和注释
  - 优化样式，与现有模块风格一致
  - 检查 TypeScript 类型安全
  - 运行诊断检查，无错误
- **验收标准**：所有 AC
- **测试要求**：
  - human-judgment：代码整洁，风格一致
  - programmatic：无编译或诊断错误
