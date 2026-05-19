<template>
  <div class="workspace-list">
    <div class="workspace-grid">
      <div
        v-for="workspace in workspaces"
        :key="workspace.id"
        class="workspace-card"
        @click="$emit('view-detail', workspace)"
      >
        <div class="workspace-card-header">
          <div :class="['workspace-icon', workspace.workspaceType?.toLowerCase() || 'team']">
            <el-icon><User /></el-icon>
          </div>
          <div class="workspace-tags">
            <span v-if="workspace.isDefault" class="tag-default">默认</span>
            <span :class="getPermissionTagClass(workspace.permissionLevel)">
              {{ getPermissionLabel(workspace.permissionLevel) }}
            </span>
          </div>
        </div>
        <div class="workspace-name">{{ workspace.workspaceName }}</div>
        <div class="workspace-desc">{{ workspace.description }}</div>
        <div class="workspace-meta">
          <span class="meta-item">
            <el-icon><User /></el-icon>
            {{ workspace.memberCount || 0 }} 成员
          </span>
          <span class="workspace-creator">{{ formatTime(workspace.createTime) }}</span>
        </div>
        <div class="workspace-footer">
          
          <div class="workspace-actions">
            <el-button link type="primary" size="small" @click.stop="$emit('view-detail', workspace)">
              查看详情
            </el-button>
            <el-button link type="warning" size="small" @click.stop="$emit('manage-roles', workspace)">
              角色管理
            </el-button>
            <el-button link type="success" size="small" @click.stop="$emit('manage-members', workspace)">
              成员管理
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { User } from '@element-plus/icons-vue'
import { formatTime } from '@/views/industry/workspace/handle'

interface Workspace {
  id: number | string
  workspaceName: string
  description?: string
  permissionLevel?: string
  workspaceType?: string
  isDefault?: boolean
  totalMemberCount?: number
  createTime?: string
}

const props = defineProps<{
  workspaces: Workspace[]
}>()

defineEmits<{
  (e: 'view-detail', workspace: Workspace): void
  (e: 'manage-roles', workspace: Workspace): void
  (e: 'manage-members', workspace: Workspace): void
}>()

const getPermissionTagClass = (level?: string) => {
  const map: Record<string, string> = {
    'PUBLIC': 'tag-public',
    'PROTECTED': 'tag-protected',
    'PRIVATE': 'tag-private'
  }
  return map[level || ''] || 'tag-public'
}

const getPermissionLabel = (level?: string) => {
  const map: Record<string, string> = {
    'PUBLIC': '公共',
    'PROTECTED': '保护',
    'PRIVATE': '私有'
  }
  return map[level || ''] || '公共'
}
</script>

<style lang="scss" scoped>
.workspace-list {
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

  .tag-default {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .tag-public {
    background: #ecf5ff;
    color: #409EFF;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .tag-protected {
    background: #fdf6ec;
    color: #e6a23c;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .tag-private {
    background: #fef0f0;
    color: #f56c6c;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
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
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
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
    white-space: nowrap;
  }

  .workspace-actions {
    display: flex;
    gap: 4px;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
