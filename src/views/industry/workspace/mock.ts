// 工作空间状态枚举
export type WorkspaceStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

// 工作空间角色枚举 - 7个基线角色
export type WorkspaceRole = 'PUBLIC_READER' | 'READER' | 'CONTRIBUTOR' | 'AUTHOR' | 'LEADER' | 'ADMINISTRATOR' | 'OWNER'

// 工作空间类型枚举
export type WorkspaceType = 'TEAM' | 'PROJECT'

// 权限级别枚举
export type PermissionLevel = 'PUBLIC' | 'PROTECTED' | 'PRIVATE'

// 权限点数据结构
export interface RolePermission {
  id: string
  name: string
  description: string
  module: string
}

// 工作空间角色配置
export interface WorkspaceRoleConfig {
  role_code: WorkspaceRole
  role_name: string
  description: string
  role_level: number
  permissions: string[]
  is_system: boolean
  role_type: 'BASELINE' | 'CUSTOM'
}

// 工作空间成员数据结构
export interface WorkspaceMember {
  uid: string
  user_uid: string
  user_name: string
  avatar?: string
  role_code: WorkspaceRole
  joined_time: string
  last_access_time?: string
  is_online?: boolean
  status: 'ACTIVE' | 'INVITED' | 'INACTIVE'
}

// 工作空间数据结构
export interface Workspace {
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
    project_count: number
    owner_user_uid?: string
}

// 工作空间活动/日志
export interface WorkspaceActivity {
  uid: string
  type: 'create' | 'update' | 'join' | 'leave' | 'delete' | 'role_change'
  operator: string
  content: string
  change_time: string
}

// ========== 常量和枚举值映射 ==========

// 角色名称映射
export const roleLabels: Record<WorkspaceRole, string> = {
  PUBLIC_READER: '公共读者',
  READER: '读者',
  CONTRIBUTOR: '贡献者',
  AUTHOR: '作者',
  LEADER: '领导者',
  ADMINISTRATOR: '管理员',
  OWNER: '所有者'
}

// 角色标签颜色映射
export const roleTagColors: Record<WorkspaceRole, string> = {
  OWNER: 'danger',
  ADMINISTRATOR: 'warning',
  LEADER: 'primary',
  AUTHOR: 'success',
  CONTRIBUTOR: 'info',
  READER: '',
  PUBLIC_READER: ''
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

export const workspaceRoleConfigs: WorkspaceRoleConfig[] = [
  {
    role_code: 'PUBLIC_READER',
    role_name: '公共读者',
    description: '仅访问协作空间内公开内容',
    role_level: 1,
    permissions: ['perm_space_view'],
    is_system: true,
    role_type: 'BASELINE'
  },
  {
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

// ========== 模拟数据 ==========

// 工作空间列表模拟数据
export const workspaces: Workspace[] = [
    {
        id: 'ws-001',
        uid: 'ws-001-uuid',
        workspace_code: 'DEFAULT_WS',
        workspace_name: '默认工作空间',
        workspace_type: 'TEAM',
        permission_level: 'PUBLIC',
        description: '租户默认工作空间，用于团队协同工作和数据共享',
        status: 'ACTIVE',
        is_default: true,
        create_by: '张三',
        create_time: '2026-05-01 09:00:00',
        update_time: '2026-05-14 16:00:00',
        member_count: 23,
        project_count: 8,
        owner_user_uid: 'u1'
    },
    {
        id: 'ws-002',
        uid: 'ws-002-uuid',
        workspace_code: 'DEV_TEAM',
        workspace_name: '研发团队空间',
        workspace_type: 'TEAM',
        permission_level: 'PUBLIC',
        description: '研发团队协同工作空间，管理产品研发相关的文档和数据',
        status: 'ACTIVE',
        is_default: false,
        create_by: '李四',
        create_time: '2026-04-15 10:00:00',
        update_time: '2026-05-13 14:30:00',
        member_count: 15,
        project_count: 5,
        owner_user_uid: 'u2'
    },
    {
        id: 'ws-003',
        uid: 'ws-003-uuid',
        workspace_code: 'SUPPLIER',
        workspace_name: '供应商协同空间',
        workspace_type: 'PROJECT',
        permission_level: 'PRIVATE',
        description: '与外部供应商协同的工作空间，用于共享技术文档和沟通',
        status: 'ACTIVE',
        is_default: false,
        create_by: '王五',
        create_time: '2026-03-20 09:00:00',
        update_time: '2026-04-30 18:00:00',
        member_count: 8,
        project_count: 3,
        owner_user_uid: 'u3'
    },
    {
        id: 'ws-004',
        uid: 'ws-004-uuid',
        workspace_code: 'TEST_TEAM',
        workspace_name: '测试团队空间',
        workspace_type: 'PROJECT',
        permission_level: 'PROTECTED',
        description: '测试团队专用空间，管理测试用例、测试报告和缺陷跟踪',
        status: 'ACTIVE',
        is_default: false,
        create_by: '赵六',
        create_time: '2026-03-10 14:00:00',
        update_time: '2026-05-10 10:30:00',
        member_count: 10,
        project_count: 4,
        owner_user_uid: 'u4'
    }
]

// 工作空间成员数据
export const workspaceMembers: Record<string, WorkspaceMember[]> = {
  'ws-001': [
    { 
      uid: 'm-001', 
      user_uid: 'u1', 
      user_name: '张三', 
      role_code: 'OWNER', 
      joined_time: '2026-05-01', 
      last_access_time: '2026-05-14 16:30:00',
      is_online: true,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-002', 
      user_uid: 'u2', 
      user_name: '李四', 
      role_code: 'ADMINISTRATOR', 
      joined_time: '2026-05-02', 
      last_access_time: '2026-05-14 15:00:00',
      is_online: true,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-003', 
      user_uid: 'u3', 
      user_name: '王五', 
      role_code: 'LEADER', 
      joined_time: '2026-05-03', 
      last_access_time: '2026-05-13 17:30:00',
      is_online: false,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-004', 
      user_uid: 'u4', 
      user_name: '赵六', 
      role_code: 'AUTHOR', 
      joined_time: '2026-05-05', 
      last_access_time: '2026-05-14 10:00:00',
      is_online: true,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-005', 
      user_uid: 'u5', 
      user_name: '钱七', 
      role_code: 'READER', 
      joined_time: '2026-05-08', 
      last_access_time: '2026-05-12 14:00:00',
      is_online: false,
      status: 'ACTIVE'
    }
  ],
  'ws-002': [
    { 
      uid: 'm-101', 
      user_uid: 'u2', 
      user_name: '李四', 
      role_code: 'OWNER', 
      joined_time: '2026-04-15', 
      last_access_time: '2026-05-14 16:00:00',
      is_online: true,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-102', 
      user_uid: 'u6', 
      user_name: '孙八', 
      role_code: 'LEADER', 
      joined_time: '2026-04-16', 
      last_access_time: '2026-05-14 13:00:00',
      is_online: true,
      status: 'ACTIVE'
    },
    { 
      uid: 'm-103', 
      user_uid: 'u7', 
      user_name: '周九', 
      role_code: 'CONTRIBUTOR', 
      joined_time: '2026-04-18', 
      last_access_time: '2026-05-11 09:00:00',
      is_online: false,
      status: 'ACTIVE'
    }
  ]
}

// 工作空间活动/日志数据
export const workspaceActivities: Record<string, WorkspaceActivity[]> = {
  'ws-001': [
    { uid: 'act-001', type: 'create', operator: '张三', content: '创建了协同工作空间', change_time: '2026-05-01 09:00:00' },
    { uid: 'act-002', type: 'join', operator: '李四', content: '加入了工作空间', change_time: '2026-05-02 10:15:00' },
    { uid: 'act-003', type: 'role_change', operator: '张三', content: '将李四的角色变更为管理员', change_time: '2026-05-03 14:20:00' },
    { uid: 'act-004', type: 'join', operator: '王五', content: '加入了工作空间', change_time: '2026-05-03 15:00:00' },
    { uid: 'act-005', type: 'update', operator: '赵六', content: '更新了空间描述', change_time: '2026-05-14 16:00:00' }
  ]
}

// ========== 工具函数 ==========

// 根据角色编码获取权限列表
export function getPermissionsByRole(role: WorkspaceRole): RolePermission[] {
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
export function getRoleInheritanceChain(role: WorkspaceRole): WorkspaceRole[] {
  const allRoles: WorkspaceRole[] = ['PUBLIC_READER', 'READER', 'CONTRIBUTOR', 'AUTHOR', 'LEADER', 'ADMINISTRATOR', 'OWNER']
  const index = allRoles.indexOf(role)
  return allRoles.slice(0, index + 1)
}
