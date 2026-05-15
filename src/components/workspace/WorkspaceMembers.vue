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
      <div class="member-list">
        <div
          v-for="member in members"
          :key="member.id"
          class="member-item"
        >
          <div class="member-avatar">
            <el-avatar :size="40">
              {{ member.userName?.charAt(0)?.toUpperCase() || 'U' }}
            </el-avatar>
          </div>
          <div class="member-info">
            <div class="member-name">{{ member.userName }}</div>
            <div class="member-time">加入时间：{{ formatTime(member.joinedTime) }}</div>
          </div>
          <div class="member-role">
            <el-select 
              v-model="member.role" 
              size="small" 
              style="width: 120px;"
              @change="handleRoleChange(member)"
            >
              <el-option 
                v-for="role in roles" 
                :key="role.code" 
                :label="role.name" 
                :value="role.code" 
              />
            </el-select>
          </div>
          <div class="member-actions">
            <el-button link type="danger" size="small" @click="$emit('remove-member', member)">
              移除
            </el-button>
          </div>
        </div>
      </div>

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
import { formatTime } from '@/views/industry/workspace/handle'

interface Member {
  id: number | string
  userId?: number | string
  userName?: string
  role?: string
  joinedTime?: string
}

interface Role {
  code: string
  name: string
}

const props = defineProps<{
  members: Member[]
  roles: Role[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'add-member'): void
  (e: 'remove-member', member: Member): void
  (e: 'change-role', member: Member): void
}>()

const handleRoleChange = (member: Member) => {
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
    border-radius: 8px;
  }

  .member-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .member-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 8px;
  }

  .member-avatar {
    margin-right: 16px;
  }

  .member-info {
    flex: 1;
  }

  .member-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
  }

  .member-time {
    font-size: 12px;
    color: #909399;
  }

  .member-role {
    margin-right: 16px;
  }

  .member-actions {
    margin-left: auto;
  }

  .loading-container,
  .empty-container {
    padding: 40px 0;
  }
}
</style>
