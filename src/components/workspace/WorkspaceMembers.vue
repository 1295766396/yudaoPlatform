<template>
  <div class="workspace-members">
    <div class="members-header">
      <div class="header-left">
        <el-button link @click="$emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="page-title">成员管理</span>
      </div>
      <el-button type="primary" @click="$emit('add-member')">
        <el-icon><Plus /></el-icon>
        添加成员
      </el-button>
    </div>

    <el-card class="members-card">
      <div class="card-header">
        <div class="card-title">成员列表</div>
      </div>

      <!-- 成员统计 -->
      <div class="member-stat-bar">
        <div v-for="stat in roleStats" :key="stat.code" class="member-stat-item">
          <span :class="['role-badge', getRoleBadgeClass(stat.code)]">{{ stat.name }}</span>
          <span class="member-stat-count">{{ stat.count }}</span>
          <span class="member-stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <!-- 成员表格 -->
      <el-table :data="members" style="width: 100%;" class="members-table">
        <el-table-column label="成员">
          <template #default="{ row }">
            <div class="member-cell">
              <div :class="['user-avatar-small', getAvatarStyle(row.roleCode)]">
                {{ (row.userNickname || row.userName)?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="user-info">
                <div class="user-name">{{ row.userNickname || row.userName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="130">
          <template #default="{ row }">
            <span :class="['role-badge', getRoleBadgeClass(row.roleCode)]">
              {{ getRoleName(row.roleCode) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-active">{{ row.status === 'ACTIVE' ? '活跃' : row.status === 'INVITED' ? '已邀请' : '未激活' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" width="150">
          <template #default="{ row }">
            {{ formatTime(row.joinedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最后访问" width="150">
          <template #default="{ row }">
            {{ formatLastAccess(row.lastAccessTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button 
              v-if="!isOwner(row)"
              link 
              type="primary" 
              size="small"
              @click="handleEditRole(row)"
            >
              编辑角色
            </el-button>
            <el-button 
              v-if="!isOwner(row)"
              link 
              type="danger" 
              size="small"
              @click="$emit('remove-member', row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="loading" class="loading-container">
        <el-skeleton :count="3" animated />
      </div>

      <div v-else-if="members.length === 0" class="empty-container">
        <el-empty description="暂无成员" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { formatTime } from '@/views/industry/workspace/handle'
import type { PageWorkspaceMember } from '@/views/industry/workspace/types'

interface Role {
  code: string
  name: string
}

const props = defineProps<{
  members: PageWorkspaceMember[]
  roles: Role[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'add-member'): void
  (e: 'remove-member', member: PageWorkspaceMember): void
  (e: 'change-role', member: PageWorkspaceMember): void
}>()

// 角色统计
const roleStats = computed(() => {
  const stats: { code: string; name: string; label: string; count: number }[] = []
  const roleMap: Record<string, { name: string; label: string }> = {
    'OWNER': { name: 'Owner', label: '所有者' },
    'ADMINISTRATOR': { name: 'Admin', label: '管理员' },
    'LEADER': { name: 'Leader', label: '领导者' },
    'AUTHOR': { name: 'Author', label: '作者' },
    'CONTRIBUTOR': { name: 'Contributor', label: '贡献者' },
    'READER': { name: 'Reader', label: '读者' },
    'PUBLIC_READER': { name: 'Public', label: '公共读者' }
  }

  // 统计每个角色的数量
  const counts: Record<string, number> = {}
  props.members.forEach(member => {
    const role = member.roleCode || 'READER'
    counts[role] = (counts[role] || 0) + 1
  })

  // 构建统计数组
  Object.entries(roleMap).forEach(([code, info]) => {
    stats.push({
      code,
      name: info.name,
      label: info.label,
      count: counts[code] || 0
    })
  })

  return stats
})

// 获取角色徽章类名
const getRoleBadgeClass = (roleCode?: string) => {
  const map: Record<string, string> = {
    'OWNER': 'role-owner',
    'ADMINISTRATOR': 'role-admin',
    'LEADER': 'role-leader',
    'AUTHOR': 'role-author',
    'CONTRIBUTOR': 'role-contributor',
    'READER': 'role-reader',
    'PUBLIC_READER': 'role-public'
  }
  return map[roleCode || ''] || 'role-reader'
}

// 获取角色显示名称
const getRoleName = (roleCode?: string) => {
  const map: Record<string, string> = {
    'OWNER': 'Owner',
    'ADMINISTRATOR': 'Admin',
    'LEADER': 'Leader',
    'AUTHOR': 'Author',
    'CONTRIBUTOR': 'Contributor',
    'READER': 'Reader',
    'PUBLIC_READER': 'Public'
  }
  return map[roleCode || ''] || 'Reader'
}

// 获取头像样式
const getAvatarStyle = (roleCode?: string) => {
  const map: Record<string, string> = {
    'OWNER': 'avatar-owner',
    'ADMINISTRATOR': 'avatar-admin',
    'LEADER': 'avatar-leader',
    'AUTHOR': 'avatar-author',
    'CONTRIBUTOR': 'avatar-contributor',
    'READER': 'avatar-reader',
    'PUBLIC_READER': 'avatar-public'
  }
  return map[roleCode || ''] || 'avatar-reader'
}

// 检查是否是所有者
const isOwner = (member: PageWorkspaceMember) => {
  return member.roleCode === 'OWNER'
}

// 格式化最后访问时间
const formatLastAccess = (time?: string) => {
  if (!time) return '-'
  // 这里可以添加更智能的时间格式化，比如"刚刚"、"2小时前"等
  return formatTime(time)
}

// 编辑角色
const handleEditRole = (member: PageWorkspaceMember) => {
  emit('change-role', member)
}
</script>

<style lang="scss" scoped>
.workspace-members {
  .members-header {
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

  .members-card {
    border-radius: 4px;
    
    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .member-stat-bar {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    flex-wrap: wrap;
  }

  .member-stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .member-stat-count {
    font-weight: 600;
    color: #303133;
  }

  .member-stat-label {
    color: #909399;
    font-size: 13px;
  }

  .members-table {
    :deep(.el-table__header) {
      th {
        background: #fafafa;
        font-weight: 600;
        color: #909399;
        font-size: 14px;
      }
    }

    :deep(.el-table__body) {
      tr:hover {
        background: #f5f7fa;
      }
    }
  }

  .member-cell {
    display: flex;
    align-items: center;
  }

  .user-avatar-small {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    margin-right: 10px;
    vertical-align: middle;

    &.avatar-owner {
      background: #f56c6c;
    }

    &.avatar-admin {
      background: #409EFF;
    }

    &.avatar-leader {
      background: #e6a23c;
    }

    &.avatar-author {
      background: #67c23a;
    }

    &.avatar-contributor {
      background: #1890ff;
    }

    &.avatar-reader {
      background: #b3d8ff;
      color: #409EFF;
    }

    &.avatar-public {
      background: #9254de;
    }
  }

  .user-info {
    display: inline-flex;
    flex-direction: column;
    vertical-align: middle;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }

  .user-email {
    font-size: 12px;
    color: #909399;
  }

  .role-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;

    &.role-owner {
      background: #fef0f0;
      color: #f56c6c;
    }

    &.role-admin {
      background: #ecf5ff;
      color: #409EFF;
    }

    &.role-leader {
      background: #fdf6ec;
      color: #e6a23c;
    }

    &.role-author {
      background: #f0f9eb;
      color: #67c23a;
    }

    &.role-contributor {
      background: #e6f7ff;
      color: #1890ff;
    }

    &.role-reader {
      background: #f4f4f5;
      color: #909399;
    }

    &.role-public {
      background: #f9f0ff;
      color: #9254de;
    }
  }

  .status-active {
    background: #f0f9eb;
    color: #67c23a;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-block;
  }

  .loading-container,
  .empty-container {
    padding: 40px 0;
  }
}
</style>
