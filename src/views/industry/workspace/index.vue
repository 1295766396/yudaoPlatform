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
          <el-input v-model="searchQuery" placeholder="请输入空间名称搜索" style="width: 250px;" clearable @keyup.enter="handleSearch" />
          <el-select v-model="permissionLevelFilter" placeholder="权限级别" clearable style="width: 150px;" @change="handleSearch">
            <el-option label="全部" value="all" />
            <el-option label="公共" value="PUBLIC" />
            <el-option label="保护" value="PROTECTED" />
            <el-option label="私有" value="PRIVATE" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 150px;" @change="handleSearch">
            <el-option label="全部" value="all" />
            <el-option label="活跃" value="ACTIVE" />
            <el-option label="未激活" value="INACTIVE" />
            <el-option label="已归档" value="ARCHIVED" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :count="3" animated />
        </div>

        <!-- 空间卡片列表 -->
        <div v-else>
          <WorkspaceList 
            :workspaces="workspaces" 
            @view-detail="goToDetail"
            @manage-roles="goToRoles"
            @manage-members="goToMembers"
          />
        </div>
      </el-card>
    </div>

    <!-- 详情视图 -->
    <div v-else-if="viewMode === 'detail' && currentWorkspace" class="detail-view">
      <WorkspaceDetail
        :workspace="currentWorkspace"
        @back="goToList"
        @edit="handleEditWorkspace"
        @delete="handleDeleteWorkspace"
        @manage-members="goToMembers"
        @manage-roles="goToRoles"
      />
    </div>

    <!-- 成员管理视图 -->
    <div v-else-if="viewMode === 'members' && currentWorkspace" class="members-view">
      <WorkspaceMembers
        :members="currentMembers"
        :roles="roleSelectOptions"
        :loading="membersLoading"
        @back="goToList"
        @add-member="handleAddMembers"
        @remove-member="handleRemoveMember"
        @change-role="handleChangeRole"
      />
    </div>

    <!-- 角色管理视图 -->
    <div v-if="viewMode === 'roles'" class="roles-view">
      <WorkspaceRoles
        :roles="displayRoles"
        @back="goToList"
      />
    </div>

    <!-- 创建/编辑空间弹窗 -->
    <el-dialog
      :title="editingWorkspace ? '编辑空间' : '创建空间'"
      v-model="workspaceDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="workspaceFormRef"
        :model="workspaceForm"
        :rules="workspaceFormRules"
        label-width="100px"
      >
        <el-form-item label="空间名称" prop="workspace_name">
          <el-input v-model="workspaceForm.workspace_name" placeholder="请输入空间名称" />
        </el-form-item>
        <el-form-item label="空间编码" prop="workspace_code" v-if="!editingWorkspace">
          <el-input v-model="workspaceForm.workspace_code" placeholder="请输入空间编码" />
        </el-form-item>
        <el-form-item label="空间类型" prop="workspace_type" v-if="!editingWorkspace">
          <el-select v-model="workspaceForm.workspace_type" placeholder="请选择空间类型" style="width: 100%;">
            <el-option label="团队空间" value="TEAM" />
            <el-option label="项目空间" value="PROJECT" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限级别" prop="permission_level">
          <el-select v-model="workspaceForm.permission_level" placeholder="请选择权限级别" style="width: 100%;">
            <el-option label="公共" value="PUBLIC" />
            <el-option label="保护" value="PROTECTED" />
            <el-option label="私有" value="PRIVATE" />
          </el-select>
        </el-form-item>
        <el-form-item label="空间描述" prop="description">
          <el-input
            v-model="workspaceForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入空间描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="workspaceDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSaveWorkspace">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加成员弹窗 -->
    <el-dialog title="添加成员" v-model="addMemberDialogVisible" width="500px">
      <el-form label-width="100px">
        <el-form-item label="选择成员">
          <el-select
            v-model="selectedUserIds"
            multiple
            placeholder="请选择要添加的成员"
            style="width: 100%;"
          >
            <el-option
              v-for="user in availableUsers"
              :key="user.key"
              :label="user.label"
              :value="user.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="defaultNewMemberRole" placeholder="请选择角色" style="width: 100%;">
            <el-option
              v-for="role in workspaceRoleConfigs"
              :key="role.role_code"
              :label="role.role_name"
              :value="role.role_code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMemberDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="addingMembers" @click="handleConfirmAddMembers">
          确定添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 变更角色弹窗 -->
    <el-dialog title="变更角色" v-model="changeRoleDialogVisible" width="400px">
      <el-form label-width="100px">
        <el-form-item label="成员">
          <el-input :value="changingMember?.user_name" disabled />
        </el-form-item>
        <el-form-item label="新角色">
          <el-select v-model="newMemberRole" placeholder="请选择角色" style="width: 100%;">
            <el-option
              v-for="role in workspaceRoleConfigs"
              :key="role.role_code"
              :label="role.role_name"
              :value="role.role_code"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="changingRole" @click="handleConfirmChangeRole">
          确定变更
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog title="确认删除" v-model="deleteDialogVisible" width="400px">
      <p>确定要删除吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleting" @click="handleConfirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import WorkspaceList from '@/components/workspace/WorkspaceList.vue'
import WorkspaceDetail from '@/components/workspace/WorkspaceDetail.vue'
import WorkspaceMembers from '@/components/workspace/WorkspaceMembers.vue'
import WorkspaceRoles from '@/components/workspace/WorkspaceRoles.vue'
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
import { getSimpleUserList, type UserVO } from '@/api/system/user'
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
  convertRolesForDisplay,
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

// 角色选择选项
const roleSelectOptions = computed(() => {
  return currentRoles.value.map(role => ({
    code: role.role_code,
    name: role.role_name
  }))
})

// 搜索和筛选状态
const searchQuery = ref('')
const permissionLevelFilter = ref<PermissionLevel | 'all'>('all')
const statusFilter = ref<WorkspaceStatus | 'all'>('all')

// 当前视图状态
const viewMode = ref<'list' | 'detail' | 'roles' | 'members'>('list')
const currentWorkspace = ref<PageWorkspace | null>(null)

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
const availableUsers = ref<{ key: number; label: string }[]>([])

// 数据存储
const workspaces = ref<PageWorkspace[]>([])
const currentMembers = ref<PageWorkspaceMember[]>([])

// 计算属性：权限表格数据
const permissionTableData = computed<PermissionTableRow[]>(() => {
  return getPermissionTableData(currentRoles.value)
})

// 计算属性：转换后的角色数据（用于 WorkspaceRoles 组件）
const displayRoles = computed(() => {
  const roles = convertRolesForDisplay(currentRoles.value)
  
  // 计算每个角色的成员数量
  const roleMemberCount: Record<string, number> = {}
  for (const member of currentMembers.value) {
    const roleCode = member.role_code
    roleMemberCount[roleCode] = (roleMemberCount[roleCode] || 0) + 1
  }
  
  // 更新成员数量
  return roles.map(role => ({
    ...role,
    memberCount: roleMemberCount[role.code] || 0
  }))
})

// 获取工作空间列表
const fetchWorkspaces = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: 1,
      pageSize: 100,
      workspaceName: searchQuery.value || undefined,
      permissionLevel: permissionLevelFilter.value === 'all' ? undefined : permissionLevelFilter.value,
      status: statusFilter.value === 'all' ? undefined : statusFilter.value,
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

// 视图切换函数
const goToList = () => {
  viewMode.value = 'list'
  currentWorkspace.value = null
  fetchWorkspaces()
}

const goToDetail = async (workspace: PageWorkspace) => {
  currentWorkspace.value = workspace
  viewMode.value = 'detail'
  if (workspace.uid) {
    await fetchWorkspaceDetail(workspace.uid)
    await fetchMembers()
  }
}

const goToRoles = async (workspace?: PageWorkspace) => {
  if (workspace) {
    currentWorkspace.value = workspace
  }
  viewMode.value = 'roles'
  if (currentWorkspace.value?.uid) {
    await fetchWorkspaceDetail(currentWorkspace.value.uid)
    await fetchRoles()
    await fetchRoleHierarchy()
  }
}

const goToMembers = async (workspace?: PageWorkspace) => {
  if (workspace) {
    currentWorkspace.value = workspace
  }
  viewMode.value = 'members'
  if (currentWorkspace.value?.uid) {
    await fetchWorkspaceDetail(currentWorkspace.value.uid)
    await fetchMembers()
  }
}

// 事件处理函数
const handleSearch = () => {
  fetchWorkspaces()
}

const handleReset = () => {
  searchQuery.value = ''
  permissionLevelFilter.value = 'all'
  statusFilter.value = 'all'
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

const handleDeleteWorkspace = (workspace: PageWorkspace) => {
  deletingWorkspace.value = workspace
  deleteDialogVisible.value = true
}

const handleConfirmDelete = async () => {
  console.log('handleConfirmDelete', deletingWorkspace.value)
  if (!deletingWorkspace.value?.uid) return
  
  deleting.value = true
  try {
    await deleteWorkspace(deletingWorkspace.value.uid)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    await fetchWorkspaces()
    goToList()
  } catch (error) {
    ElMessage.error('删除失败')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const handleAddMembers = async () => {
  selectedUserIds.value = []
  defaultNewMemberRole.value = 'READER'
  try {
    // 获取所有用户
    const users = await getSimpleUserList()
    // 获取当前空间已有的成员ID
    const existingMemberIds = new Set(currentMembers.value.map(member => member.id))
    // 过滤掉已经是成员的用户
    availableUsers.value = users
      .filter(user => !existingMemberIds.has(user.id))
      .map(user => ({
        key: user.id,
        label: user.nickname || user.username
      }))
    addMemberDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error(error)
  }
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
</style>
