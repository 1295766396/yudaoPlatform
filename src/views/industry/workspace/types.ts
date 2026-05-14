// 从 API 导入类型定义
import type {
  WorkspaceType,
  PermissionLevel,
  WorkspaceStatus,
  WorkspaceRoleCode,
  RoleType,
  MemberStatus,
  WorkspaceRoleVO,
  WorkspaceRoleDetailVO,
  WorkspaceRoleHierarchyVO
} from '@/api/own/workspace'
import type { TagProps } from 'element-plus'

// ========== 页面使用的类型定义 ==========

// 工作空间角色配置（页面使用）
export interface PageWorkspaceRoleConfig {
  uid: string
  role_code: WorkspaceRoleCode
  role_name: string
  role_type: RoleType
  role_level: number
  description: string
  inherited_role_code?: WorkspaceRoleCode
  permissions: string[]
  is_system: boolean
}

// 工作空间角色层级（页面使用）
export interface PageWorkspaceRoleHierarchy {
  uid: string
  role_code: WorkspaceRoleCode
  role_name: string
  role_level: number
  description: string
  children?: PageWorkspaceRoleHierarchy[]
}

// 工作空间角色详情（页面使用）
export interface PageWorkspaceRoleDetail extends PageWorkspaceRoleConfig {
  all_permissions: string[]
  inherited_role_name?: string
}

// 工作空间类型（页面使用，下划线命名）
export interface PageWorkspace {
  id: string
  uid?: string
  workspace_code: string
  workspace_name: string
  workspace_type: WorkspaceType
  permission_level: PermissionLevel
  description?: string
  status: WorkspaceStatus
  is_default: boolean
  create_by: string
  create_time: string
  update_time: string
  member_count: number
  project_count: number | string
  owner_user_uid?: string
}

// 工作空间成员类型（页面使用，下划线命名）
export interface PageWorkspaceMember {
  uid: string
  user_uid: string
  user_name: string
  avatar?: string
  role_code: WorkspaceRoleCode
  joined_time: string
  last_access_time?: string
  is_online?: boolean
  status: MemberStatus
}

// 工作空间活动类型（页面使用，下划线命名）
export interface PageWorkspaceActivity {
  uid: string
  type: 'create' | 'update' | 'join' | 'leave' | 'delete' | 'role_change'
  operator: string
  content: string
  change_time: string
}

// 工作空间表单类型
export interface WorkspaceForm {
  workspace_code: string
  workspace_name: string
  workspace_type: WorkspaceType
  permission_level: PermissionLevel
  description: string
}

// 工作空间表单验证规则类型
export interface WorkspaceFormRules {
  workspace_code: { required: boolean; message: string; trigger: string }[]
  workspace_name: { required: boolean; message: string; trigger: string }[]
  workspace_type: { required: boolean; message: string; trigger: string }[]
  permission_level: { required: boolean; message: string; trigger: string }[]
}

// ========== 常量和枚举值映射 ==========

// 角色名称映射
export const roleLabels: Record<WorkspaceRoleCode, string> = {
  PUBLIC_READER: '公共读者',
  READER: '读者',
  CONTRIBUTOR: '贡献者',
  AUTHOR: '作者',
  LEADER: '领导者',
  ADMINISTRATOR: '管理员',
  OWNER: '所有者'
}

// 角色标签颜色映射
export const roleTagColors: Record<WorkspaceRoleCode, TagProps['type']> = {
  OWNER: 'danger',
  ADMINISTRATOR: 'warning',
  LEADER: 'primary',
  AUTHOR: 'success',
  CONTRIBUTOR: 'info',
  READER: 'info',
  PUBLIC_READER: 'info'
}

// 状态名称映射
export const statusLabels: Record<WorkspaceStatus, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  ARCHIVED: '已归档'
}

// 工作空间类型映射
export const typeLabels: Record<WorkspaceType, string> = {
  TEAM: '团队空间',
  PROJECT: '项目空间'
}

// 权限级别映射
export const permissionLevelLabels: Record<PermissionLevel, string> = {
  PUBLIC: '公共',
  PROTECTED: '保护',
  PRIVATE: '私有'
}

// 权限级别标签类型映射
export const permissionLevelTagTypes: Record<PermissionLevel, TagProps['type']> = {
  PUBLIC: 'success',
  PROTECTED: 'warning',
  PRIVATE: 'danger'
}

// 状态标签类型映射
export const statusTagTypes: Record<WorkspaceStatus, TagProps['type']> = {
  ACTIVE: 'success',
  INACTIVE: 'info',
  ARCHIVED: 'info'
}
