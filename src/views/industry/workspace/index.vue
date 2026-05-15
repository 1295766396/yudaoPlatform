<template>
  <div class="workspace-container">
    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="list-view">
      <el-card class="main-card">
        <template #header>
          <div class="card-header">
            <div class="card-title">协同空间</div>
            <el-button type="primary" @click="showCreateDialog">
              <el-icon><Plus /></el-icon>
              创建空间
            </el-button>
          </div>
        </template>

        <!-- 搜索筛选栏 -->
        <div class="search-bar">
          <el-input v-model="searchQuery" placeholder="请输入空间名称搜索" style="width: 250px;" clearable />
          <el-select v-model="permissionLevelFilter" placeholder="权限级别" clearable style="width: 150px;">
            <el-option label="Public" value="PUBLIC" />
            <el-option label="Protected" value="PROTECTED" />
            <el-option label="Private" value="PRIVATE" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 150px;">
            <el-option label="Active" value="ACTIVE" />
            <el-option label="Inactive" value="INACTIVE" />
            <el-option label="Archived" value="ARCHIVED" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :count="3" animated />
        </div>

        <!-- 空间卡片列表 -->
        <div v-else class="workspace-grid">
          <div 
            v-for="workspace in workspaces" 
            :key="workspace.id"
            class="workspace-card"
            @click="goToDetail(workspace)"
          >
            <div class="workspace-card-header">
              <div :class="['workspace-icon', 'team']">
                <el-icon><User /></el-icon>
              </div>
              <div class="workspace-tags">
                <el-tag v-if="workspace.isDefault" type="primary" size="small" effect="dark">默认</el-tag>
                <el-tag 
                  :type="getPermissionTagType(workspace.permissionLevel)"
                  size="small"
                  effect="light"
                >
                  {{ getPermissionLevelLabel(workspace.permissionLevel) }}
                </el-tag>
              </div>
            </div>
            <div class="workspace-name">{{ workspace.workspaceName }}</div>
            <div class="workspace-desc">--</div>
            <div class="workspace-meta">
              <span class="meta-item">
                <el-icon><User /></el-icon>
                -- 成员
              </span>
              <span class="meta-item">
                <el-icon><Folder /></el-icon>
                -- 项目
              </span>
            </div>
            <div class="workspace-footer">
              <span class="workspace-creator">-- · {{ formatTime(workspace.createTime) }}</span>
              <div class="workspace-actions">
                <el-button link type="primary" size="small" @click.stop="goToDetail(workspace)">查看详情</el-button>
                <el-button link type="warning" size="small" @click.stop="goToRoles(workspace)">角色管理</el-button>
                <el-button link type="success" size="small" @click.stop="goToMembers(workspace)">成员管理</el-button>
                <el-dropdown v-if="workspace.status === 'ACTIVE'" trigger="click" @command="handleWorkspaceAction($event, workspace)">
                  <el-button link size="small">更多<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="archive">归档</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button v-else-if="workspace.status === 'ARCHIVED'" link type="info" size="small" @click.stop="handleActivateWorkspace(workspace)">激活</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详情视图 -->
    <div v-else-if="viewMode === 'detail' && currentWorkspace" class="detail-view">
      <el-card class="detail-card">
        <template #header>
          <div class="detail-header">
            <div class="header-left">
              <el-button link @click="goToList">
                <el-icon><ArrowLeft /></el-icon>
                返回
              </el-button>
              <span class="detail-title">{{ currentWorkspace.workspaceName }}</span>
            </div>
            <div class="header-right">
              <el-button type="primary" @click="handleEditWorkspace">编辑</el-button>
            </div>
          </div>
        </template>

        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="概览" name="overview">
            <div class="tab-content">
              <div class="properties-section">
                <h4 class="section-title">基本信息</h4>
                <el-descriptions :column="2" border class="prop-descriptions">
                  <el-descriptions-item label="空间编码">
                    {{ (currentWorkspace as any).workspaceCode || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="空间名称">
                    {{ currentWorkspace.workspaceName }}
                  </el-descriptions-item>
                  <el-descriptions-item label="空间类型">
                    {{ typeLabels[(currentWorkspace as any).workspaceType || 'TEAM'] }}
                  </el-descriptions-item>
                  <el-descriptions-item label="权限级别">
                    {{ permissionLevelLabels[currentWorkspace.permissionLevel] }}
                  </el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusTagType(currentWorkspace.status)" size="small">
                      {{ statusLabels[currentWorkspace.status] }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="创建人">
                    {{ (currentWorkspace as any).createByName || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="创建时间">
                    {{ currentWorkspace.createTime }}
                  </el-descriptions-item>
                  <el-descriptions-item label="更新时间">
                    {{ (currentWorkspace as any).updateTime || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="描述" :span="2">
                    {{ (currentWorkspace as any).description || '-' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="members-section">
                <div class="section-header">
                  <h4 class="section-title">成员列表</h4>
                  <el-button type="primary" size="small" @click="goToMembers(currentWorkspace)">管理成员</el-button>
                </div>
                <div v-if="membersLoading" class="loading-container">
                  <el-skeleton :count="3" animated />
                </div>
                <div v-else class="members-list">
                  <div
                    v-for="member in currentMembers"
                    :key="member.uid"
                    class="member-item"
                  >
                    <div class="member-avatar">
                      <el-avatar :size="40">
                        {{ member.userName.charAt(0) }}
                      </el-avatar>
                    </div>
                    <div class="member-info">
                      <div class="member-name">{{ member.userName }}</div>
                      <div class="member-role">
                        <el-tag :type="getRoleTagType(member.roleCode)" size="small">
                          {{ roleLabels[member.roleCode] }}
                        </el-tag>
                        <span class="member-status" v-if="member.status !== 'ACTIVE'">
                          {{ member.status === 'INVITED' ? '待接受' : '未激活' }}
                        </span>
                      </div>
                    </div>
                    <div class="member-time">
                      <div class="join-time">加入 {{ member.joinedTime }}</div>
                      <div v-if="member.lastAccessTime" class="last-access">
                        最后访问 {{ member.lastAccessTime }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="动态" name="activity">
            <div class="tab-content">
              <div class="empty-state">
                <div class="empty-icon">📋</div>
                <div class="empty-text">暂无活动动态</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 角色管理视图 -->
    <div v-else-if="viewMode === 'roles' && currentWorkspace" class="roles-view">
      <el-card class="roles-card">
        <template #header>
          <div class="detail-header">
            <div class="header-left">
              <el-button link @click="goToList">
                <el-icon><ArrowLeft /></el-icon>
                返回
              </el-button>
              <span class="detail-title">角色体系 - {{ currentWorkspace.workspaceName }}</span>
            </div>
          </div>
        </template>

        <div class="roles-section">
          <el-tabs v-model="roleViewTab" class="role-tabs">
            <el-tab-pane label="权限对比" name="comparison">
              <h4 class="section-title">角色权限对比</h4>
              
              <!-- 加载状态 -->
              <div v-if="rolesLoading" class="loading-container">
                <el-skeleton :count="3" animated />
              </div>
              
              <!-- 权限对比表格 -->
              <div v-else class="role-table-container">
                <el-table :data="permissionTableData" stripe border style="width: 100%">
                  <el-table-column label="权限模块" width="140" fixed>
                    <template #default="{ row }">
                      <span class="module-name">{{ row.module }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="权限名称" width="160">
                    <template #default="{ row }">
                      <div class="permission-name-cell">
                        <span>{{ row.name }}</span>
                        <el-tooltip :content="row.description" placement="top">
                          <el-icon class="info-icon"><InfoFilled /></el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="roleConfig in currentRoles"
                    :key="roleConfig.uid || roleConfig.role_code"
                    :label="roleConfig.role_name"
                    width="110"
                    align="center"
                  >
                    <template #header>
                      <el-button 
                        type="text" 
                        @click.stop="handleSelectRole(roleConfig)"
                        class="role-header-btn"
                      >
                        {{ roleConfig.role_name }}
                      </el-button>
                    </template>
                    <template #default="{ row }">
                      <el-icon
                        v-if="row.permissions.includes(roleConfig.role_code)"
                        class="has-permission"
                      >
                        <Check />
                      </el-icon>
                      <span v-else class="no-permission">—</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 选中角色详情 -->
              <div v-if="selectedRoleConfig" class="selected-role-card">
                <div class="role-card-header">
                  <el-tag :type="getRoleTagType(selectedRoleConfig.role_code)" size="large">
                    {{ selectedRoleConfig.role_name }}
                  </el-tag>
                  <span class="role-level-badge">Level {{ selectedRoleConfig.role_level }}</span>
                  <el-tag v-if="selectedRoleConfig.is_system" type="info" size="small">系统角色</el-tag>
                </div>
                <p class="role-card-desc">{{ selectedRoleConfig.description }}</p>
                <div class="role-inheritance">
                  <div class="inheritance-label">继承关系：</div>
                  <div class="inheritance-chain">
                    <el-tag
                      v-for="role in getSelectedRoleInheritance(selectedRoleConfig)"
                      :key="role"
                      size="small"
                      :type="getRoleTagType(role)"
                    >
                      {{ roleLabels[role] }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="角色层级" name="hierarchy">
              <h4 class="section-title">角色层级结构</h4>
              
              <!-- 加载状态 -->
              <div v-if="roleHierarchyLoading" class="loading-container">
                <el-skeleton :count="3" animated />
              </div>
              
              <!-- 角色层级树 -->
              <div v-else class="role-hierarchy-container">
                <el-tree
                  :data="roleHierarchy"
                  :props="{ label: 'role_name', children: 'children' }"
                  node-key="uid"
                  default-expand-all
                  class="role-hierarchy-tree"
                >
                  <template #default="{ data }">
                    <div class="role-tree-node">
                      <el-tag :type="getRoleTagType(data.role_code)" size="small">
                        {{ data.role_name }}
                      </el-tag>
                      <span class="role-level-text">Level {{ data.role_level }}</span>
                      <el-tooltip :content="data.description" placement="top">
                        <el-icon class="info-icon"><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>

    <!-- 成员管理视图 -->
    <div v-else-if="viewMode === 'members' && currentWorkspace" class="members-view">
      <el-card class="members-card">
        <template #header>
          <div class="detail-header">
            <div class="header-left">
              <el-button link @click="goToList">
                <el-icon><ArrowLeft /></el-icon>
                返回
              </el-button>
              <span class="detail-title">成员管理 - {{ currentWorkspace.workspaceName }}</span>
            </div>
            <div class="header-right">
              <el-button type="primary" @click="handleAddMembers">添加成员</el-button>
            </div>
          </div>
        </template>

        <div class="members-section">
          <div v-if="membersLoading" class="loading-container">
            <el-skeleton :count="3" animated />
          </div>
          <div v-else class="members-list">
            <div
              v-for="member in currentMembers"
              :key="member.uid"
              class="member-item"
            >
              <div class="member-avatar">
                <el-avatar :size="40">
                  {{ member.userName.charAt(0) }}
                </el-avatar>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.userName }}</div>
                <div class="member-role">
                  <el-tag :type="getRoleTagType(member.roleCode)" size="small">
                    {{ roleLabels[member.roleCode] }}
                  </el-tag>
                  <span class="member-status" v-if="member.status !== 'ACTIVE'">
                    {{ member.status === 'INVITED' ? '待接受' : '未激活' }}
                  </span>
                </div>
              </div>
              <div class="member-time">
                <div class="join-time">加入 {{ member.joinedTime }}</div>
                <div v-if="member.lastAccessTime" class="last-access">
                  最后访问 {{ member.lastAccessTime }}
                </div>
              </div>
              <div class="member-actions">
                <el-button link type="primary" size="small" @click="handleChangeRole(member)">变更角色</el-button>
                <el-button link type="danger" size="small" @click="handleRemoveMember(member)">移除</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑空间弹窗 -->
    <el-dialog v-model="workspaceDialogVisible" :title="editingWorkspace ? '编辑工作空间' : '创建工作空间'" width="500px">
      <el-form ref="workspaceFormRef" :model="workspaceForm" :rules="workspaceFormRules" label-width="100px">
        <el-form-item label="空间编码" prop="workspace_code">
          <el-input v-model="workspaceForm.workspace_code" placeholder="请输入空间编码" :disabled="!!editingWorkspace" />
        </el-form-item>
        <el-form-item label="空间名称" prop="workspace_name">
          <el-input v-model="workspaceForm.workspace_name" placeholder="请输入空间名称" />
        </el-form-item>
        <el-form-item label="空间类型" prop="workspace_type">
          <el-select v-model="workspaceForm.workspace_type">
            <el-option label="团队空间" value="TEAM" />
            <el-option label="项目空间" value="PROJECT" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限级别" prop="permission_level">
          <el-select v-model="workspaceForm.permission_level">
            <el-option label="公共" value="PUBLIC" />
            <el-option label="保护" value="PROTECTED" />
            <el-option label="私有" value="PRIVATE" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="workspaceForm.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="workspaceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveWorkspace" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加成员弹窗 -->
    <el-dialog v-model="addMemberDialogVisible" title="添加成员" width="600px">
      <div class="add-member-content">
        <el-transfer
          v-model="selectedUserIds"
          :data="availableUsers"
          :titles="['可选用户', '已选用户']"
          filterable
          filter-placeholder="搜索用户"
        />
        <div class="role-selector">
          <span class="role-label">默认角色：</span>
          <el-select v-model="defaultNewMemberRole" style="width: 200px;">
            <el-option
              v-for="roleConfig in workspaceRoleConfigs"
              :key="roleConfig.role_code"
              :label="roleConfig.role_name"
              :value="roleConfig.role_code"
            />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button @click="addMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddMembers" :loading="addingMembers">添加</el-button>
      </template>
    </el-dialog>

    <!-- 变更角色弹窗 -->
    <el-dialog v-model="changeRoleDialogVisible" title="变更角色" width="400px">
      <div v-if="changingMember" class="change-role-content">
        <div class="member-preview">
          <el-avatar :size="40" class="mr-3">
            {{ changingMember.user_name.charAt(0) }}
          </el-avatar>
          <div>
            <div class="member-name">{{ changingMember.user_name }}</div>
            <div class="current-role">
              当前角色：
              <el-tag :type="getRoleTagType(changingMember.role_code)" size="small">
                {{ roleLabels[changingMember.role_code] }}
              </el-tag>
            </div>
          </div>
        </div>
        <el-form label-width="100px" class="mt-4">
          <el-form-item label="新角色">
            <el-select v-model="newMemberRole" placeholder="请选择新角色">
              <el-option
                v-for="roleConfig in workspaceRoleConfigs"
                :key="roleConfig.role_code"
                :label="roleConfig.role_name"
                :value="roleConfig.role_code"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="changeRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmChangeRole" :loading="changingRole">确认变更</el-button>
      </template>
    </el-dialog>

    <!-- 确认删除弹窗 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="400px">
      <p>确定要删除工作空间「{{ deletingWorkspace?.workspace_name }}」吗？此操作不可撤销。</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleConfirmDelete" :loading="deleting">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, User, Folder, FolderOpened, ArrowLeft, Check, InfoFilled, ArrowDown } from '@element-plus/icons-vue'
import {
  getWorkspacePage,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  archiveWorkspace,
  activateWorkspace,
  getMemberPage,
  addMember,
  removeMember,
  changeMemberRole,
  getRoleList,
  getRoleDetail,
  getRoleHierarchy,
  type PermissionLevel,
  type WorkspaceStatus,
  type WorkspaceRoleCode,
  type WorkspaceSimpleVO,
  type WorkspaceVO,
  type WorkspaceMemberVO,
} from '@/api/own/workspace'
import {
  roleLabels,
  statusLabels,
  typeLabels,
  permissionLevelLabels,
  type PageWorkspace,
  type PageWorkspaceMember,
  type WorkspaceForm,
  type PageWorkspaceRoleConfig,
  type PageWorkspaceRoleDetail,
  type PageWorkspaceRoleHierarchy,
} from './types'
import {
  workspaceRoleConfigs,
  getRoleInheritanceChain,
  getPermissionTagType,
  getStatusTagType,
  getRoleTagType,
  formatTime,
  getDefaultWorkspaceForm,
  createWorkspaceFormFromWorkspace,
  getWorkspaceFormRules,
  getRoleName,
  getPermissionTableData,
  convertRoleVOToConfig,
  convertRoleDetailVOToPage,
  convertRoleHierarchyVOToPage,
  type PermissionTableRow,
} from './handle'

// 加载状态
const loading = ref(false)
const membersLoading = ref(false)
const rolesLoading = ref(false)
const roleDetailLoading = ref(false)
const roleHierarchyLoading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const addingMembers = ref(false)
const changingRole = ref(false)

// 角色相关数据
const currentRoles = ref<PageWorkspaceRoleConfig[]>(workspaceRoleConfigs)
const selectedRoleDetail = ref<PageWorkspaceRoleDetail | null>(null)
const selectedRoleConfig = ref<PageWorkspaceRoleConfig | null>(null)
const roleHierarchy = ref<PageWorkspaceRoleHierarchy[]>([])
const roleViewTab = ref('comparison')

// 搜索和筛选状态
const searchQuery = ref('')
const permissionLevelFilter = ref<PermissionLevel | ''>('')
const statusFilter = ref<WorkspaceStatus | ''>('')

// 当前视图状态
const viewMode = ref<'list' | 'detail' | 'roles' | 'members'>('list')
const activeTab = ref('overview')
const currentWorkspace = ref<PageWorkspace | null>(null)
const selectedRole = ref<WorkspaceRoleCode | null>(null)

// 弹窗相关状态
const workspaceDialogVisible = ref(false)
const addMemberDialogVisible = ref(false)
const changeRoleDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingWorkspace = ref<PageWorkspace | null>(null)
const changingMember = ref<PageWorkspaceMember | null>(null)
const deletingWorkspace = ref<PageWorkspace | null>(null)

// 表单相关
const workspaceFormRef = ref()
const workspaceForm = ref<WorkspaceForm>(getDefaultWorkspaceForm())
const workspaceFormRules = getWorkspaceFormRules()

// 添加成员相关
const selectedUserIds = ref<number[]>([])
const defaultNewMemberRole = ref<WorkspaceRoleCode>('READER')
const newMemberRole = ref<WorkspaceRoleCode>('READER')
const availableUsers = [
  { key: 1, label: '王小明' },
  { key: 2, label: '李小红' },
  { key: 3, label: '张小刚' },
  { key: 4, label: '赵小强' },
  { key: 5, label: '陈小丽' },
]

// 数据存储
const workspaces = ref<PageWorkspace[]>([])
const currentMembers = ref<PageWorkspaceMember[]>([])

// 获取工作空间列表
const fetchWorkspaces = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: 1,
      pageSize: 100,
      workspaceName: searchQuery.value || undefined,
      permissionLevel: permissionLevelFilter.value || undefined,
      status: statusFilter.value || undefined,
    }
    const res = await getWorkspacePage(params)
    console.log('res', res)
    if (res) {
      workspaces.value = res.list || []
    }
  } catch (error) {
    ElMessage.error('获取工作空间列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取工作空间详情
const fetchWorkspaceDetail = async (uid: string) => {
  try {
    const res = await getWorkspace(uid)
    if (res) {
      currentWorkspace.value = res
    }
  } catch (error) {
    ElMessage.error('获取工作空间详情失败')
    console.error(error)
  }
}

// 获取成员列表
const fetchMembers = async () => {
  if (!currentWorkspace.value?.uid) return
  
  membersLoading.value = true
  try {
    const params = {
      workspaceUid: currentWorkspace.value.uid,
      pageNo: 1,
      pageSize: 100,
    }
    const res = await getMemberPage(params)
    if (res) {
      currentMembers.value = res.list || []
    }
  } catch (error) {
    ElMessage.error('获取成员列表失败')
    console.error(error)
  } finally {
    membersLoading.value = false
  }
}

// 计算属性：权限表格数据
const permissionTableData = computed<PermissionTableRow[]>(() => {
  return getPermissionTableData(currentRoles.value)
})

// 获取角色列表
const fetchRoles = async () => {
  if (!currentWorkspace.value?.uid) return
  
  rolesLoading.value = true
  try {
    const res = await getRoleList(currentWorkspace.value.uid)
    if (res) {
      currentRoles.value = res.map(convertRoleVOToConfig)
    }
  } catch (error) {
    ElMessage.error('获取角色列表失败')
    console.error(error)
  } finally {
    rolesLoading.value = false
  }
}

// 获取角色详情
const fetchRoleDetail = async (roleUid: string) => {
  roleDetailLoading.value = true
  try {
    const res = await getRoleDetail(roleUid)
    if (res) {
      selectedRoleDetail.value = convertRoleDetailVOToPage(res)
    }
  } catch (error) {
    ElMessage.error('获取角色详情失败')
    console.error(error)
  } finally {
    roleDetailLoading.value = false
  }
}

// 获取角色层级结构
const fetchRoleHierarchy = async () => {
  if (!currentWorkspace.value?.uid) return
  
  roleHierarchyLoading.value = true
  try {
    const res = await getRoleHierarchy(currentWorkspace.value.uid)
    if (res) {
      roleHierarchy.value = res.map(convertRoleHierarchyVOToPage)
    }
  } catch (error) {
    ElMessage.error('获取角色层级结构失败')
    console.error(error)
  } finally {
    roleHierarchyLoading.value = false
  }
}

// 计算属性：选中角色的继承关系
const selectedRoleInheritance = computed(() => {
  if (!selectedRole.value) return []
  return getRoleInheritanceChain(selectedRole.value)
})

// 工具函数
const getPermissionLevelLabel = (level: PermissionLevel) => {
  return permissionLevelLabels[level] || ''
}

// 处理角色选择
const handleSelectRole = (roleConfig: PageWorkspaceRoleConfig) => {
  selectedRoleConfig.value = roleConfig
  if (roleConfig.uid) {
    fetchRoleDetail(roleConfig.uid)
  }
}

// 获取选中角色的继承关系
const getSelectedRoleInheritance = (roleConfig: PageWorkspaceRoleConfig) => {
  return getRoleInheritanceChain(roleConfig.role_code)
}

// 视图切换函数
const goToList = () => {
  viewMode.value = 'list'
  currentWorkspace.value = null
  selectedRole.value = null
  activeTab.value = 'overview'
  fetchWorkspaces()
}

const goToDetail = async (workspace: PageWorkspace) => {
  currentWorkspace.value = workspace
  viewMode.value = 'detail'
  activeTab.value = 'overview'
  if (workspace.uid) {
    await fetchWorkspaceDetail(workspace.uid)
    await fetchMembers()
  }
}

const goToRoles = async (workspace: PageWorkspace) => {
  currentWorkspace.value = workspace
  viewMode.value = 'roles'
  roleViewTab.value = 'comparison'
  selectedRoleConfig.value = currentRoles.value.find(r => r.role_code === 'ADMINISTRATOR') || null
  if (workspace.uid) {
    await fetchWorkspaceDetail(workspace.uid)
    await fetchRoles()
    await fetchRoleHierarchy()
  }
}

const goToMembers = async (workspace: PageWorkspace) => {
  currentWorkspace.value = workspace
  viewMode.value = 'members'
  if (workspace.uid) {
    await fetchWorkspaceDetail(workspace.uid)
    await fetchMembers()
  }
}

// 事件处理函数
const handleSearch = () => {
  fetchWorkspaces()
}

const handleReset = () => {
  searchQuery.value = ''
  permissionLevelFilter.value = ''
  statusFilter.value = ''
  fetchWorkspaces()
}

const showCreateDialog = () => {
  editingWorkspace.value = null
  workspaceForm.value = getDefaultWorkspaceForm()
  workspaceDialogVisible.value = true
}

const handleEditWorkspace = () => {
  if (!currentWorkspace.value) return
  editingWorkspace.value = currentWorkspace.value
  workspaceForm.value = createWorkspaceFormFromWorkspace(currentWorkspace.value)
  workspaceDialogVisible.value = true
}

const handleSaveWorkspace = async () => {
  const valid = await workspaceFormRef.value?.validate().catch(() => false)
  if (!valid) return
  
  saving.value = true
  try {
    if (editingWorkspace.value && editingWorkspace.value.uid) {
      await updateWorkspace({
        uid: editingWorkspace.value.uid,
        workspaceName: workspaceForm.value.workspace_name,
        permissionLevel: workspaceForm.value.permission_level,
        description: workspaceForm.value.description,
      })
      ElMessage.success('编辑成功')
    } else {
      await createWorkspace({
        workspaceName: workspaceForm.value.workspace_name,
        workspaceCode: workspaceForm.value.workspace_code,
        workspaceType: workspaceForm.value.workspace_type,
        permissionLevel: workspaceForm.value.permission_level,
        description: workspaceForm.value.description,
      })
      ElMessage.success('创建成功')
    }
    workspaceDialogVisible.value = false
    await fetchWorkspaces()
    if (currentWorkspace.value?.uid) {
      await fetchWorkspaceDetail(currentWorkspace.value.uid)
    }
  } catch (error) {
    ElMessage.error(editingWorkspace.value ? '编辑失败' : '创建失败')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const handleWorkspaceAction = (command: string, workspace: PageWorkspace) => {
  if (command === 'archive') {
    handleArchiveWorkspace(workspace)
  } else if (command === 'delete') {
    handleDeleteWorkspace(workspace)
  }
}

const handleArchiveWorkspace = async (workspace: PageWorkspace) => {
  try {
    await ElMessageBox.confirm(`确定要归档工作空间「${workspace.workspace_name}」吗？`, '确认归档', {
      type: 'warning',
    })
    if (!workspace.uid) return
    await archiveWorkspace(workspace.uid)
    ElMessage.success('归档成功')
    await fetchWorkspaces()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('归档失败')
      console.error(error)
    }
  }
}

const handleActivateWorkspace = async (workspace: PageWorkspace) => {
  try {
    if (!workspace.uid) return
    await activateWorkspace(workspace.uid)
    ElMessage.success('激活成功')
    await fetchWorkspaces()
  } catch (error) {
    ElMessage.error('激活失败')
    console.error(error)
  }
}

const handleDeleteWorkspace = (workspace: PageWorkspace) => {
  deletingWorkspace.value = workspace
  deleteDialogVisible.value = true
}

const handleConfirmDelete = async () => {
  if (!deletingWorkspace.value?.uid) return
  
  deleting.value = true
  try {
    await deleteWorkspace(deletingWorkspace.value.uid)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    await fetchWorkspaces()
    if (viewMode.value !== 'list') {
      goToList()
    }
  } catch (error) {
    ElMessage.error('删除失败')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const handleAddMembers = () => {
  selectedUserIds.value = []
  defaultNewMemberRole.value = 'READER'
  addMemberDialogVisible.value = true
}

const handleConfirmAddMembers = async () => {
  if (selectedUserIds.value.length === 0) {
    ElMessage.warning('请选择要添加的成员')
    return
  }
  if (!currentWorkspace.value?.uid) return
  
  addingMembers.value = true
  try {
    await addMember({
      workspaceUid: currentWorkspace.value.uid,
      userIds: selectedUserIds.value,
      roleCode: defaultNewMemberRole.value,
    })
    ElMessage.success(`已添加 ${selectedUserIds.value.length} 位成员`)
    addMemberDialogVisible.value = false
    await fetchMembers()
  } catch (error) {
    ElMessage.error('添加成员失败')
    console.error(error)
  } finally {
    addingMembers.value = false
  }
}

const handleChangeRole = (member: PageWorkspaceMember) => {
  changingMember.value = member
  newMemberRole.value = member.role_code
  changeRoleDialogVisible.value = true
}

const handleConfirmChangeRole = async () => {
  if (!changingMember.value || !currentWorkspace.value?.uid) return
  
  changingRole.value = true
  try {
    await changeMemberRole({
      workspaceUid: currentWorkspace.value.uid,
      memberUid: changingMember.value.uid,
      newRoleCode: newMemberRole.value,
    })
    ElMessage.success(`已将 ${changingMember.value.user_name} 的角色变更为 ${getRoleName(newMemberRole.value)}`)
    changeRoleDialogVisible.value = false
    await fetchMembers()
  } catch (error) {
    ElMessage.error('变更角色失败')
    console.error(error)
  } finally {
    changingRole.value = false
  }
}

const handleRemoveMember = async (member: PageWorkspaceMember) => {
  if (!currentWorkspace.value?.uid) return
  
  try {
    await ElMessageBox.confirm(`确定要移除成员「${member.user_name}」吗？`, '确认移除', {
      type: 'warning',
    })
    await removeMember(currentWorkspace.value.uid, member.uid)
    ElMessage.success('移除成功')
    await fetchMembers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('移除失败')
      console.error(error)
    }
  }
}

// 初始化
onMounted(() => {
  fetchWorkspaces()
})
</script>

<style lang="scss" scoped>
.workspace-container {
  padding: 20px;
}

.main-card,
.detail-card,
.roles-card,
.members-card {
  border-radius: 4px;

  :deep(.el-card__header) {
    padding: 18px 20px;
  }

  :deep(.el-card__body) {
    padding: 0 20px 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-top: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.loading-container {
  padding: 20px 0;
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.workspace-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
  background: #fff;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.workspace-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.workspace-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;

  &.team {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.project {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
}

.workspace-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.workspace-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.workspace-desc {
  font-size: 14px;
  color: #909399;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.workspace-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #606266;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.workspace-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.workspace-creator {
  font-size: 13px;
  color: #909399;
}

.workspace-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* 详情视图样式 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.detail-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.prop-descriptions {
  margin-bottom: 32px;
}

/* 成员列表样式 */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.member-avatar {
  position: relative;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.member-role {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-status {
  font-size: 12px;
  color: #909399;
}

.member-time {
  flex-shrink: 0;
  text-align: right;
  font-size: 12px;
  color: #909399;

  .join-time,
  .last-access {
    display: block;
  }
}

/* 活动列表样式 */
.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #909399;
}

/* 角色管理样式 */
.roles-section {
  .section-title {
    margin-bottom: 16px;
  }
}

.role-table-container {
  margin-bottom: 24px;
  overflow-x: auto;
  border-radius: 8px;

  :deep(.el-table) {
    font-size: 13px;

    .module-name {
      font-weight: 600;
      color: #606266;
    }

    .permission-name-cell {
      display: flex;
      align-items: center;
      gap: 6px;

      .info-icon {
        color: #909399;
        cursor: help;
        font-size: 14px;
      }
    }

    .has-permission {
      color: #67c23a;
      font-size: 18px;
    }

    .no-permission {
      color: #c0c4cc;
      font-size: 16px;
    }

    th.el-table__cell {
      background: #f5f7fa;
      font-weight: 600;
    }
  }
}

.selected-role-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #ecf5ff 100%);
  border-radius: 12px;
  padding: 20px;

  .role-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .role-level-badge {
      background: #409eff;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .role-card-desc {
    color: #606266;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .role-inheritance {
    display: flex;
    align-items: center;
    gap: 12px;

    .inheritance-label {
      font-size: 13px;
      color: #606266;
    }

    .inheritance-chain {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

/* 成员管理视图样式 */
.members-section {
  .member-item {
    .member-actions {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
    }
  }
}

/* 弹窗样式 */
.add-member-content {
  .role-selector {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 12px;

    .role-label {
      font-size: 14px;
      color: #303133;
    }
  }
}

.change-role-content {
  .member-preview {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .member-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }

    .current-role {
      font-size: 14px;
      color: #606266;
    }
  }

  .mt-4 {
    margin-top: 16px;
  }
}

.mr-3 {
  margin-right: 12px;
}
</style>
