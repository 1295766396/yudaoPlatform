<template>
  <div class="workspace-detail">
    <div class="detail-header">
      <div class="header-left">
        <el-button link @click="$emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="page-title">{{ workspace.workspaceName }}</span>
      </div>
      <div class="header-right">
        <el-button link type="primary" @click="$emit('edit')">编辑</el-button>
        <el-button link type="danger" @click="$emit('delete', workspace)">删除</el-button>
      </div>
    </div>

    <el-card class="detail-card">
      <div class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="空间名称">{{ workspace.workspaceName }}</el-descriptions-item>
          <el-descriptions-item label="空间编码">{{ workspace.workspaceCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="权限级别">
            <el-tag :type="getPermissionTagType(workspace.permissionLevel)">
              {{ getPermissionLabel(workspace.permissionLevel) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(workspace.status)">
              {{ getStatusLabel(workspace.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建人">{{ workspace.createByName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="成员数">{{ workspace.totalMemberCount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTime(workspace.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatTime(workspace.updateTime) }}</el-descriptions-item>
          <el-descriptions-item label="空间描述" :span="2">{{ workspace.description || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="action-buttons">
          <el-button type="primary" @click="$emit('manage-members', workspace)">
            <el-icon><User /></el-icon>
            成员管理
          </el-button>
          <el-button type="warning" @click="$emit('manage-roles', workspace)">
            <el-icon><Lock /></el-icon>
            角色管理
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, User, Lock } from '@element-plus/icons-vue'
import { formatTime } from '@/views/industry/workspace/handle'

interface Workspace {
  id: number | string
  workspaceName: string
  workspaceCode?: string
  permissionLevel?: string
  status?: string
  createByName?: string
  totalMemberCount?: number
  createTime?: string
  updateTime?: string
  description?: string
}

const props = defineProps<{
  workspace: Workspace
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'edit'): void
  (e: 'delete', workspace: Workspace): void
  (e: 'manage-members', workspace: Workspace): void
  (e: 'manage-roles', workspace: Workspace): void
}>()

const getPermissionTagType = (level?: string) => {
  const map: Record<string, any> = {
    'PUBLIC': 'primary',
    'PROTECTED': 'warning',
    'PRIVATE': 'danger'
  }
  return map[level || ''] || 'primary'
}

const getPermissionLabel = (level?: string) => {
  const map: Record<string, string> = {
    'PUBLIC': '公共',
    'PROTECTED': '保护',
    'PRIVATE': '私有'
  }
  return map[level || ''] || '公共'
}

const getStatusTagType = (status?: string) => {
  const map: Record<string, any> = {
    'ACTIVE': 'success',
    'INACTIVE': 'info',
    'ARCHIVED': 'danger'
  }
  return map[status || ''] || 'info'
}

const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    'ACTIVE': '活跃',
    'INACTIVE': '未激活',
    'ARCHIVED': '已归档'
  }
  return map[status || ''] || '未知'
}
</script>

<style lang="scss" scoped>
.workspace-detail {
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }

  .detail-card {
    border-radius: 8px;
  }

  .detail-content {
    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;
    }
  }
}
</style>
