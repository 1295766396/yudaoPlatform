import type {
  WorkspaceSimpleVO,
  WorkspaceVO,
  WorkspaceMemberVO,
  WorkspaceRoleCode,
  PermissionLevel,
  WorkspaceStatus,
  WorkspaceRoleVO,
  WorkspaceRoleDetailVO,
  WorkspaceRoleHierarchyVO
} from '@/api/own/workspace'
import type { TagProps } from 'element-plus'
import type { 
  PageWorkspace, 
  PageWorkspaceMember, 
  WorkspaceForm, 
  WorkspaceFormRules,
  PageWorkspaceRoleConfig,
  PageWorkspaceRoleDetail,
  PageWorkspaceRoleHierarchy
} from './types'
import {
  roleLabels,
  roleTagColors,
  statusLabels,
  typeLabels,
  permissionLevelLabels,
  permissionLevelTagTypes,
  statusTagTypes
} from './types'

// ========== 数据转换函数 ==========

/**
 * 将 WorkspaceSimpleVO 转换为 PageWorkspace
 */
export function convertWorkspaceSimpleToPage(vo: WorkspaceSimpleVO): PageWorkspace {
  return {
    id: String(vo.id),
    uid: vo.uid,
    workspace_code: vo.workspaceCode,
    workspace_name: vo.workspaceName,
    workspace_type: 'TEAM', // 默认值，需要从详情获取
    permission_level: vo.permissionLevel,
    description: '', // 详情才有
    status: vo.status,
    is_default: vo.isDefault,
    create_by: '', // 详情才有
    create_time: vo.createTime,
    update_time: vo.createTime,
    member_count: 0, // 详情才有
    project_count: '--', // API 不提供，显示占位符
    owner_user_uid: undefined
  }
}

/**
 * 将 WorkspaceVO 转换为 PageWorkspace
 */
export function convertWorkspaceToPage(vo: WorkspaceVO): PageWorkspace {
  return {
    id: String(vo.id),
    uid: vo.uid,
    workspace_code: vo.workspaceCode,
    workspace_name: vo.workspaceName,
    workspace_type: vo.workspaceType,
    permission_level: vo.permissionLevel,
    description: vo.description,
    status: vo.status,
    is_default: vo.isDefault,
    create_by: vo.createByName,
    create_time: vo.createTime,
    update_time: vo.updateTime,
    member_count: vo.totalMemberCount,
    project_count: '--', // API 不提供，显示占位符
    owner_user_uid: vo.owningUserId ? String(vo.owningUserId) : undefined
  }
}

/**
 * 将 WorkspaceMemberVO 转换为 PageWorkspaceMember
 */
export function convertWorkspaceMemberToPage(vo: WorkspaceMemberVO): PageWorkspaceMember {
  return {
    uid: vo.uid,
    user_uid: String(vo.userId),
    user_name: vo.userName,
    avatar: vo.userAvatar,
    role_code: vo.roleCode,
    joined_time: vo.joinedTime,
    last_access_time: vo.lastAccessTime,
    is_online: false, // API 不提供
    status: vo.status
  }
}

// ========== 权限点数据结构 ==========

export interface RolePermission {
  id: string
  name: string
  description: string
  module: string
}

// ========== 完整权限列表 ==========

export const allPermissions: RolePermission[] = [
  // 空间管理模块
  { id: 'perm_space_view', name: '查看空间', description: '查看空间基本信息', module: '空间管理' },
  { id: 'perm_space_edit', name: '编辑空间', description: '编辑空间信息', module: '空间管理' },
  { id: 'perm_space_delete', name: '删除空间', description: '删除空间', module: '空间管理' },
  // 成员管理模块
  { id: 'perm_member_view', name: '查看成员', description: '查看成员列表', module: '成员管理' },
  { id: 'perm_member_add', name: '添加成员', description: '添加新成员', module: '成员管理' },
  { id: 'perm_member_edit', name: '编辑成员', description: '编辑成员信息和角色', module: '成员管理' },
  { id: 'perm_member_delete', name: '移除成员', description: '移除空间成员', module: '成员管理' },
  // 角色管理模块
  { id: 'perm_role_manage', name: '管理角色', description: '配置角色权限', module: '角色管理' },
  // 文件管理模块
  { id: 'perm_file_view', name: '查看文件', description: '浏览和查看文件', module: '文件管理' },
  { id: 'perm_file_create_personal', name: '创建个人内容', description: '创建个人收藏夹和文件夹', module: '文件管理' },
  { id: 'perm_file_comment', name: '评论和批注', description: '创建评审、评论、批注', module: '文件管理' },
  { id: 'perm_file_edit', name: '编辑正式内容', description: '编辑和上传文件、产品结构、BOM', module: '文件管理' },
  { id: 'perm_file_delete', name: '删除内容', description: '删除自己创建的内容', module: '文件管理' },
  { id: 'perm_file_manage_public', name: '管理公共资源', description: '管理公共文件夹、资源库', module: '文件管理' },
  // BOM管理模块
  { id: 'perm_bom_view', name: '查看BOM', description: '浏览BOM结构', module: 'BOM管理' },
  { id: 'perm_bom_edit', name: '编辑BOM', description: '编辑BOM结构', module: 'BOM管理' },
  // 动态中心模块
  { id: 'perm_activity_view', name: '查看动态', description: '查看空间动态', module: '动态中心' },
  { id: 'perm_log_view', name: '查看日志', description: '查看操作日志', module: '动态中心' }
]

// ========== 7个基线角色配置 ==========

export const workspaceRoleConfigs: PageWorkspaceRoleConfig[] = [
  {
    uid: 'public_reader',
    role_code: 'PUBLIC_READER',
    role_name: '公共读者',
    description: '仅访问协作空间内公开内容',
    role_level: 1,
    permissions: ['perm_space_view'],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'reader',
    role_code: 'READER',
    role_name: '读者',
    description: '访问协作空间全部内容，可创建个人内容',
    role_level: 2,
    permissions: [
      'perm_space_view',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_file_create_personal'
    ],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'contributor',
    role_code: 'CONTRIBUTOR',
    role_name: '贡献者',
    description: '可创建评估类内容（评论、批注）',
    role_level: 3,
    permissions: [
      'perm_space_view',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_file_create_personal',
      'perm_file_comment'
    ],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'author',
    role_code: 'AUTHOR',
    role_name: '作者',
    description: '可创建正式业务对象（产品结构、BOM、文档）',
    role_level: 4,
    permissions: [
      'perm_space_view',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_file_create_personal',
      'perm_file_comment',
      'perm_file_edit',
      'perm_bom_edit',
      'perm_file_delete'
    ],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'leader',
    role_code: 'LEADER',
    role_name: '领导者',
    description: '可管理公共资源（公共文件夹、资源库）',
    role_level: 5,
    permissions: [
      'perm_space_view',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_file_create_personal',
      'perm_file_comment',
      'perm_file_edit',
      'perm_bom_edit',
      'perm_file_delete',
      'perm_file_manage_public'
    ],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'administrator',
    role_code: 'ADMINISTRATOR',
    role_name: '管理员',
    description: '管理空间成员、配置空间属性、查看操作日志',
    role_level: 6,
    permissions: [
      'perm_space_view',
      'perm_space_edit',
      'perm_member_view',
      'perm_member_add',
      'perm_member_edit',
      'perm_member_delete',
      'perm_role_manage',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_log_view',
      'perm_file_create_personal',
      'perm_file_comment',
      'perm_file_edit',
      'perm_bom_edit',
      'perm_file_delete',
      'perm_file_manage_public'
    ],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
    uid: 'owner',
    role_code: 'OWNER',
    role_name: '所有者',
    description: '空间完整控制权，可删除空间、变更任意成员角色',
    role_level: 7,
    permissions: [
      'perm_space_view',
      'perm_space_edit',
      'perm_space_delete',
      'perm_member_view',
      'perm_member_add',
      'perm_member_edit',
      'perm_member_delete',
      'perm_role_manage',
      'perm_file_view',
      'perm_bom_view',
      'perm_activity_view',
      'perm_log_view',
      'perm_file_create_personal',
      'perm_file_comment',
      'perm_file_edit',
      'perm_bom_edit',
      'perm_file_delete',
      'perm_file_manage_public'
    ],
    is_system: true,
    role_type: 'BASELINE'
  }
]

// ========== 工具函数 ==========

// 根据角色编码获取权限列表
export function getPermissionsByRole(role: WorkspaceRoleCode): RolePermission[] {
  const roleConfig = workspaceRoleConfigs.find(r => r.role_code === role)
  if (!roleConfig) return []
  return allPermissions.filter(p => roleConfig.permissions.includes(p.id))
}

// 根据模块分组权限
export function groupPermissionsByModule(permissions: RolePermission[]): Record<string, RolePermission[]> {
  const result: Record<string, RolePermission[]> = {}
  permissions.forEach(p => {
    if (!result[p.module]) result[p.module] = []
    result[p.module].push(p)
  })
  return result
}

// 获取角色继承关系链（从最低到当前）
export function getRoleInheritanceChain(role: WorkspaceRoleCode): WorkspaceRoleCode[] {
  const allRoles: WorkspaceRoleCode[] = ['PUBLIC_READER', 'READER', 'CONTRIBUTOR', 'AUTHOR', 'LEADER', 'ADMINISTRATOR', 'OWNER']
  const index = allRoles.indexOf(role)
  return allRoles.slice(0, index + 1)
}

// 获取角色级别
export function getRoleLevel(role: WorkspaceRoleCode): number {
  const config = workspaceRoleConfigs.find(r => r.role_code === role)
  return config?.role_level || 0
}

// ========== 标签工具函数 ==========

// 获取权限级别标签类型
export function getPermissionTagType(level: PermissionLevel): TagProps['type'] {
  return permissionLevelTagTypes[level] || 'info'
}

// 获取状态标签类型
export function getStatusTagType(status: WorkspaceStatus): TagProps['type'] {
  return statusTagTypes[status] || 'info'
}

// 获取角色标签类型
export function getRoleTagType(role: WorkspaceRoleCode): TagProps['type'] {
  return roleTagColors[role] || 'info'
}

// ========== 时间格式化函数 ==========

// 格式化时间显示（相对时间）
export function formatTime(time: string): string {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (weeks < 4) return `${weeks}周前`
  if (months < 12) return `${months}个月前`
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// ========== 表单相关函数 ==========

// 获取默认工作空间表单
export function getDefaultWorkspaceForm(): WorkspaceForm {
  return {
    workspace_code: '',
    workspace_name: '',
    workspace_type: 'TEAM',
    permission_level: 'PUBLIC',
    description: ''
  }
}

// 从工作空间创建表单
export function createWorkspaceFormFromWorkspace(workspace: PageWorkspace): WorkspaceForm {
  return {
    workspace_code: (workspace as any).workspaceCode || '',
    workspace_name: workspace.workspaceName,
    workspace_type: (workspace as any).workspaceType || 'TEAM',
    permission_level: workspace.permissionLevel,
    description: (workspace as any).description || ''
  }
}

// 获取工作空间表单验证规则
export function getWorkspaceFormRules(): WorkspaceFormRules {
  return {
    workspace_code: [{ required: true, message: '请输入空间编码', trigger: 'blur' }],
    workspace_name: [{ required: true, message: '请输入空间名称', trigger: 'blur' }],
    workspace_type: [{ required: true, message: '请选择空间类型', trigger: 'change' }],
    permission_level: [{ required: true, message: '请选择权限级别', trigger: 'change' }]
  }
}

// ========== 角色相关工具函数 ==========

// 根据角色编码获取角色名称
export function getRoleName(role: WorkspaceRoleCode): string {
  return roleLabels[role] || ''
}

// 根据角色编码获取角色描述
export function getRoleDescription(role: WorkspaceRoleCode): string {
  const config = workspaceRoleConfigs.find(c => c.role_code === role)
  return config?.description || ''
}

// ========== 权限表格数据生成 ==========

export interface PermissionTableRow {
  id: string
  name: string
  description: string
  module: string
  permissions: WorkspaceRoleCode[]
}

// 生成权限表格数据 - 支持从API获取的角色配置
export function getPermissionTableData(roles?: PageWorkspaceRoleConfig[]): PermissionTableRow[] {
  const result: PermissionTableRow[] = []
  const roleConfigs = roles || workspaceRoleConfigs

  for (const perm of allPermissions) {
    const rolesWithPerm = roleConfigs
      .filter(rc => rc.permissions.includes(perm.id))
      .map(rc => rc.role_code)
    
    result.push({
      ...perm,
      permissions: rolesWithPerm
    })
  }
  return result
}

// ========== 角色数据转换函数 ==========

/**
 * 将 WorkspaceRoleVO 转换为 PageWorkspaceRoleConfig
 */
export function convertRoleVOToConfig(vo: WorkspaceRoleVO): PageWorkspaceRoleConfig {
  return {
    uid: vo.uid,
    role_code: vo.roleCode,
    role_name: vo.roleName,
    role_type: vo.roleType,
    role_level: vo.roleLevel,
    description: vo.description,
    inherited_role_code: vo.inheritedRoleCode,
    permissions: vo.permissions,
    is_system: vo.isSystem
  }
}

/**
 * 将 WorkspaceRoleDetailVO 转换为 PageWorkspaceRoleDetail
 */
export function convertRoleDetailVOToPage(vo: WorkspaceRoleDetailVO): PageWorkspaceRoleDetail {
  return {
    uid: vo.uid,
    role_code: vo.roleCode,
    role_name: vo.roleName,
    role_type: vo.roleType,
    role_level: vo.roleLevel,
    description: vo.description,
    inherited_role_code: vo.inheritedRoleCode,
    permissions: vo.permissions,
    is_system: vo.isSystem,
    all_permissions: vo.allPermissions,
    inherited_role_name: vo.inheritedRoleName
  }
}

/**
 * 将 WorkspaceRoleHierarchyVO 转换为 PageWorkspaceRoleHierarchy
 */
export function convertRoleHierarchyVOToPage(vo: WorkspaceRoleHierarchyVO): PageWorkspaceRoleHierarchy {
  return {
    uid: vo.uid,
    role_code: vo.roleCode,
    role_name: vo.roleName,
    role_level: vo.roleLevel,
    description: vo.description,
    children: vo.children?.map(convertRoleHierarchyVOToPage)
  }
}

/**
 * 将角色列表转换为权限表格数据
 */
export function getPermissionTableDataFromRoles(roles: PageWorkspaceRoleConfig[]): PermissionTableRow[] {
  return getPermissionTableData(roles)
}
