# 协同工作空间API对接 - 产品需求文档

## Overview

- **Summary**: 为协同工作空间模块实现完整的API对接，将现有的mock数据替换为真实API调用，补充缺失的功能实现。
- **Purpose**: 将演示级别的mock数据替换为真实业务逻辑，实现完整的前后端对接。
- **Target Users**: 协同工作空间模块的终端用户

## Goals

1. 完全移除对mock数据的依赖
2. 实现所有已提供API的功能对接
3. 补充实现已有接口但页面未实现的功能
4. 处理数据结构转换（驼峰 ↔ 下划线）
5. 实现完整的加载状态和错误处理

## Non-Goals (Out of Scope)

- 不实现API文档未提供的功能（活动列表、在线状态等）
- 不修改API接口定义
- 不添加新的UI功能，仅实现API已支持的

## Background & Context

1. **现状**:
   - 已有完整的UI实现，但使用mock数据
   - API接口文件已生成，包含所有必需的接口
   - 数据结构存在差异（驼峰命名 vs 下划线命名）
   - 一些功能有API但页面未实现（删除、归档、激活）

2. **技术栈**:
   - Vue 3 + TypeScript
   - Element Plus UI框架
   - 已有的request封装

## Functional Requirements

- **FR-1**: 工作空间管理功能API对接
  - 获取工作空间分页列表
  - 获取工作空间详情
  - 创建工作空间
  - 编辑工作空间
  - 删除工作空间（新增）
  - 归档工作空间（新增）
  - 激活工作空间（新增）

- **FR-2**: 成员管理功能API对接
  - 获取成员分页列表
  - 添加成员
  - 移除成员
  - 变更成员角色

- **FR-3**: 角色管理功能API对接
  - 获取空间角色列表
  - 获取角色权限详情
  - 获取角色层级结构

- **FR-4**: 数据转换层
  - API数据 → 页面数据转换
  - 处理缺失字段的兼容性
  - 命名风格统一处理

## Non-Functional Requirements

- **NFR-1**: 加载状态展示
  - 所有数据请求都有loading状态
  - 列表使用骨架屏或loading动画

- **NFR-2**: 错误处理
  - API失败时展示友好提示
  - 网络错误的容错处理

- **NFR-3**: 空状态展示
  - 数据为空时的友好提示

## Constraints

- **Technical**: 必须使用现有的API定义和request封装
- **Business**: 保持现有UI风格不变
- **Dependencies**: 依赖已生成的workspace.ts API文件

## Assumptions

1. API响应格式为统一的CommonResult结构
2. 分页参数遵循PageParam规范
3. API按文档定义正常工作

## Acceptance Criteria

### AC-1: 完全移除mock数据依赖
- **Given**: 用户打开工作空间页面
- **When**: 所有数据都是通过API获取
- **Then**: mock.ts不再被import和使用
- **Verification**: programmatic

### AC-2: 完整的工作空间CRUD功能
- **Given**: 用户在工作空间页面
- **When**: 执行创建、编辑、删除、归档、激活操作
- **Then**: 对应的API被正确调用，页面状态正确更新
- **Verification**: programmatic

### AC-3: 完整的成员管理功能
- **Given**: 用户在成员管理页面
- **When**: 执行添加、移除、角色变更操作
- **Then**: 对应的API被正确调用，列表正确刷新
- **Verification**: programmatic

### AC-4: 角色管理功能正常
- **Given**: 用户在角色管理页面
- **When**: 查看角色列表、详情、层级结构
- **Then**: 数据通过API获取并正确展示
- **Verification**: programmatic

### AC-5: 数据正确转换
- **Given**: API返回数据
- **When**: 页面展示数据
- **Then**: 数据格式正确，所有字段映射正确
- **Verification**: programmatic

### AC-6: 加载和错误状态
- **Given**: 用户进行操作
- **When**: API请求中/请求失败
- **Then**: 展示loading状态/错误提示
- **Verification**: human-judgment

## Open Questions

- [ ] 分页组件如何实现？（API支持但页面暂无）
- [ ] 项目统计数量（project_count）API未提供，是否显示占位符？
