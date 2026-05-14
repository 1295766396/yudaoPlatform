import request from '@/config/axios'

// ========== 类型定义 ==========

// 工作空间类型
export type WorkspaceType = 'TEAM' | 'PROJECT'

// 权限级别
export type PermissionLevel = 'PUBLIC' | 'PROTECTED' | 'PRIVATE'

// 工作空间状态
export type WorkspaceStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

// 角色编码
export type WorkspaceRoleCode =
  | 'PUBLIC_READER'
  | 'READER'
  | 'CONTRIBUTOR'
  | 'AUTHOR'
  | 'LEADER'
  | 'ADMINISTRATOR'
  | 'OWNER'

// 角色类型
export type RoleType = 'BASELINE' | 'CUSTOM'

// 成员状态
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'INACTIVE'

// ========== VO 类型定义 ==========

// 工作空间 VO - 分页列表用
export interface WorkspaceSimpleVO {
  id: number
  uid: string
  workspaceCode: string
  workspaceName: string
  permissionLevel: PermissionLevel
  status: WorkspaceStatus
  isDefault: boolean
  currentUserRole: WorkspaceRoleCode
  createTime: string
}

// 工作空间 VO - 详情用
export interface WorkspaceVO {
  id: number
  uid: string
  workspaceCode: string
  workspaceName: string
  workspaceType: WorkspaceType
  permissionLevel: PermissionLevel
  description?: string
  status: WorkspaceStatus
  isDefault: boolean
  owningUserId?: number
  owningUserName?: string
  myWorkEnabled: boolean
  defaultRoleCode?: WorkspaceRoleCode
  createByName: string
  createTime: string
  updateTime: string
  totalMemberCount: number
  roleMemberCount: Record<string, number>
  recentMembers: any[]
}

// 工作空间成员 VO
export interface WorkspaceMemberVO {
  id: number
  uid: string
  userId: number
  userName: string
  userNickname: string
  userAvatar?: string
  roleUid: string
  roleCode: WorkspaceRoleCode
  roleName: string
  status: MemberStatus
  joinedTime: string
  lastAccessTime?: string
}

// 工作空间角色 VO - 列表用
export interface WorkspaceRoleVO {
  id: number
  uid: string
  roleCode: WorkspaceRoleCode
  roleName: string
  roleType: RoleType
  roleLevel: number
  description: string
  inheritedRoleCode?: WorkspaceRoleCode
  permissions: string[]
  isSystem: boolean
}

// 工作空间角色 VO - 详情用
export interface WorkspaceRoleDetailVO extends WorkspaceRoleVO {
  allPermissions: string[]
  inheritedRoleName?: string
}

// 角色层级结构
export interface WorkspaceRoleHierarchyVO {
  uid: string
  roleCode: WorkspaceRoleCode
  roleName: string
  roleLevel: number
  description: string
  children?: WorkspaceRoleHierarchyVO[]
}

// ========== 请求参数类型 ==========

// 创建工作空间请求
export interface CreateWorkspaceReq {
  workspaceName: string
  workspaceCode: string
  workspaceType: WorkspaceType
  permissionLevel: PermissionLevel
  description?: string
}

// 更新工作空间请求
export interface UpdateWorkspaceReq {
  uid: string
  workspaceName?: string
  permissionLevel?: PermissionLevel
  description?: string
}

// 工作空间分页查询参数
export interface WorkspacePageReq extends PageParam {
  workspaceName?: string
  permissionLevel?: PermissionLevel
  status?: WorkspaceStatus
}

// 成员分页查询参数
export interface MemberPageReq extends PageParam {
  workspaceUid: string
  userName?: string
  roleCode?: WorkspaceRoleCode
}

// 添加成员请求
export interface AddMemberReq {
  workspaceUid: string
  userIds: number[]
  roleCode: WorkspaceRoleCode
}

// 变更成员角色请求
export interface ChangeMemberRoleReq {
  workspaceUid: string
  memberUid: string
  newRoleCode: WorkspaceRoleCode
  changeReason?: string
}

// ========== 响应类型 ==========

// 添加成员响应
export interface AddMemberResp {
  successCount: number
  skipCount: number
  skipUserNames: string[]
}

// ========== 工作空间管理 API ==========

// 创建工作空间
export const createWorkspace = (data: CreateWorkspaceReq) => {
  return request.post({ url: '/collaboration/workspace/create', data })
}

// 获取工作空间分页列表
export const getWorkspacePage = (params: WorkspacePageReq) => {
  return request.get({ url: '/collaboration/workspace/page', params })
}

// 获取工作空间详情
export const getWorkspace = (uid: string) => {
  return request.get({ url: '/collaboration/workspace/get', params: { uid } })
}

// 编辑工作空间
export const updateWorkspace = (data: UpdateWorkspaceReq) => {
  return request.put({ url: '/collaboration/workspace/update', data })
}

// 删除工作空间
export const deleteWorkspace = (uid: string) => {
  return request.delete({ url: '/collaboration/workspace/delete', params: { uid } })
}

// 归档工作空间
export const archiveWorkspace = (uid: string) => {
  return request.put({ url: '/collaboration/workspace/archive', params: { uid } })
}

// 激活工作空间
export const activateWorkspace = (uid: string) => {
  return request.put({ url: '/collaboration/workspace/activate', params: { uid } })
}

// 获取当前用户的工作空间列表
export const getMyWorkspaces = () => {
  return request.get({ url: '/collaboration/workspace/my-workspaces' })
}

// ========== 成员管理 API ==========

// 添加成员
export const addMember = (data: AddMemberReq) => {
  return request.post({ url: '/collaboration/member/add', data })
}

// 移除成员
export const removeMember = (workspaceUid: string, memberUid: string) => {
  return request.delete({ url: '/collaboration/member/remove', params: { workspaceUid, memberUid } })
}

// 变更成员角色
export const changeMemberRole = (data: ChangeMemberRoleReq) => {
  return request.put({ url: '/collaboration/member/change-role', data })
}

// 获取成员分页列表
export const getMemberPage = (params: MemberPageReq) => {
  return request.get({ url: '/collaboration/member/page', params })
}

// ========== 角色管理 API ==========

// 获取空间角色列表
export const getRoleList = (workspaceUid: string) => {
  return request.get({ url: '/collaboration/role/list', params: { workspaceUid } })
}

// 获取角色权限详情
export const getRoleDetail = (uid: string) => {
  return request.get({ url: '/collaboration/role/detail', params: { uid } })
}

// 获取角色层级结构
export const getRoleHierarchy = (workspaceUid: string) => {
  return request.get({ url: '/collaboration/role/hierarchy', params: { workspaceUid } })
}
