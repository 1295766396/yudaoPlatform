<template>
  <div class="workspace-roles">
    <div class="roles-header">
      <div class="header-left">
        <el-button link @click="$emit('back')">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="page-title">角色管理</span>
      </div>
    </div>

    <el-card class="roles-card">
      <div class="card-header">
        <div class="card-title">空间角色体系</div>
        <!-- <el-button type="primary" @click="handleCreateRole">+ 创建自定义角色</el-button> -->
      </div>

      <!-- 角色层级说明 -->
      <div class="role-hierarchy" v-if="showHierarchy">
        <div class="hierarchy-item" :style="{ background: '#fef0f0', color: '#f56c6c', border: '1px solid #fef0f0' }">
          Owner
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#ecf5ff', color: '#409EFF', border: '1px solid #ecf5ff' }">
          Admin
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#fdf6ec', color: '#e6a23c', border: '1px solid #fdf6ec' }">
          Leader
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#f0f9eb', color: '#67c23a', border: '1px solid #f0f9eb' }">
          Author
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#e6f7ff', color: '#1890ff', border: '1px solid #e6f7ff' }">
          Contributor
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#f4f4f5', color: '#909399', border: '1px solid #f4f4f5' }">
          Reader
        </div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-item" :style="{ background: '#f9f0ff', color: '#9254de', border: '1px solid #f9f0ff' }">
          Public Reader
        </div>
        <span class="inheritance-note">权限逐级继承，高等级角色自动拥有低等级角色的所有权限</span>
      </div>

      <!-- 角色卡片列表 -->
      <div class="roles-list">
        <div v-for="role in mockRoles" :key="role.code" :class="['role-card', role.isSystem ? 'system' : 'custom']">
          <div class="role-header">
            <div class="role-info">
              <div :class="['role-icon', getRoleIconClass(role.code)]">
                {{ getRoleInitial(role.code) }}
              </div>
              <div class="role-name-area">
                <div class="role-name">
                  {{ role.name }}
                  <el-tag v-if="role.isSystem" class="role-tag" type="warning" effect="light" size="small">系统内置</el-tag>
                  <el-tag v-else class="role-tag" type="primary" effect="light" size="small">自定义</el-tag>
                </div>
                <div class="role-desc">{{ role.description }}</div>
              </div>
            </div>
            <div class="role-member-count">{{ role.memberCount || 0 }} 名成员</div>
          </div>
          
          <div class="permission-section" v-if="role.permissions">
            <div class="section-title">核心权限</div>
            <div class="permission-grid">
              <div 
                v-for="(permission, index) in role.permissions" 
                :key="index"
                :class="['permission-item', permission.enabled ? 'enabled' : 'disabled']"
              >
                {{ permission.enabled ? '✓' : '✗' }} {{ permission.name }}
              </div>
            </div>
          </div>

          <div class="role-actions">
            <el-button type="primary" size="small">编辑权限</el-button>
            <el-button v-if="role.isSystem" type="info" size="small" disabled>系统内置角色不可删除</el-button>
            <el-button v-else type="danger" size="small">删除</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { ref } from 'vue'

interface Permission {
  name: string
  enabled: boolean
}

interface Role {
  code: string
  name: string
  description?: string
  isSystem?: boolean
  memberCount?: number
  permissions?: Permission[]
}

defineEmits<{
  (e: 'back'): void
}>()

const showHierarchy = ref(true)

// 本地 Mock 数据
const mockRoles: Role[] = [
  {
    code: 'OWNER',
    name: '所有者 (Owner)',
    description: '空间最高权限，拥有所有操作权限，可删除空间和转移所有权',
    isSystem: true,
    memberCount: 1,
    permissions: [
      { name: '删除空间', enabled: true },
      { name: '转移所有权', enabled: true },
      { name: '管理成员', enabled: true },
      { name: '管理角色权限', enabled: true },
      { name: '编辑空间设置', enabled: true },
      { name: '查看操作日志', enabled: true },
      { name: '管理所有内容', enabled: true },
      { name: '管理公共文件夹', enabled: true },
      { name: '创建正式业务对象', enabled: true },
      { name: '创建评审/批注', enabled: true },
      { name: '查看所有内容', enabled: true },
      { name: '仅查看公开内容', enabled: true }
    ]
  },
  {
    code: 'ADMINISTRATOR',
    name: '管理员 (Admin)',
    description: '空间管理员，可管理成员、分配角色、配置空间设置',
    isSystem: true,
    memberCount: 2,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '转移所有权', enabled: false },
      { name: '管理成员', enabled: true },
      { name: '分配角色', enabled: true },
      { name: '编辑空间设置', enabled: true },
      { name: '查看操作日志', enabled: true },
      { name: '管理所有内容', enabled: true },
      { name: '管理公共文件夹', enabled: true },
      { name: '创建正式业务对象', enabled: true },
      { name: '创建评审/批注', enabled: true },
      { name: '查看所有内容', enabled: true },
      { name: '仅查看公开内容', enabled: true }
    ]
  },
  {
    code: 'LEADER',
    name: '领导者 (Leader)',
    description: '团队领导者，可管理公共资源和创建正式业务对象',
    isSystem: true,
    memberCount: 3,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '转移所有权', enabled: false },
      { name: '管理成员', enabled: false },
      { name: '管理角色权限', enabled: false },
      { name: '编辑空间设置', enabled: false },
      { name: '查看操作日志', enabled: false },
      { name: '管理所有内容', enabled: true },
      { name: '管理公共文件夹', enabled: true },
      { name: '创建正式业务对象', enabled: true },
      { name: '创建评审/批注', enabled: true },
      { name: '查看所有内容', enabled: true },
      { name: '仅查看公开内容', enabled: true }
    ]
  },
  {
    code: 'AUTHOR',
    name: '作者 (Author)',
    description: '内容创作者，可创建正式业务对象，管理自己创建的内容',
    isSystem: true,
    memberCount: 5,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '管理成员', enabled: false },
      { name: '管理公共文件夹', enabled: false },
      { name: '创建正式业务对象', enabled: true },
      { name: '编辑自己创建的内容', enabled: true },
      { name: '删除自己创建的内容', enabled: true },
      { name: '创建评审/批注', enabled: true },
      { name: '查看所有内容', enabled: true },
      { name: '仅查看公开内容', enabled: true }
    ]
  },
  {
    code: 'CONTRIBUTOR',
    name: '贡献者 (Contributor)',
    description: '内容贡献者，可创建评审、评论、批注等非正式内容',
    isSystem: true,
    memberCount: 4,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '管理成员', enabled: false },
      { name: '创建正式业务对象', enabled: false },
      { name: '编辑内容', enabled: false },
      { name: '创建评审/评论', enabled: true },
      { name: '创建批注/标记', enabled: true },
      { name: '查看所有内容', enabled: true },
      { name: '仅查看公开内容', enabled: true }
    ]
  },
  {
    code: 'READER',
    name: '读者 (Reader)',
    description: '普通读者，可查看空间内所有内容，可创建个人收藏夹',
    isSystem: true,
    memberCount: 6,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '管理成员', enabled: false },
      { name: '创建正式业务对象', enabled: false },
      { name: '创建评审/批注', enabled: false },
      { name: '查看所有内容', enabled: true },
      { name: '创建个人收藏夹', enabled: true },
      { name: '管理个人文件夹', enabled: true }
    ]
  },
  {
    code: 'PUBLIC_READER',
    name: '公共读者 (Public Reader)',
    description: '公共读者，仅可查看空间内标记为公开的内容，无其他操作权限',
    isSystem: true,
    memberCount: 2,
    permissions: [
      { name: '删除空间', enabled: false },
      { name: '管理成员', enabled: false },
      { name: '创建正式业务对象', enabled: false },
      { name: '创建评审/批注', enabled: false },
      { name: '查看私有内容', enabled: false },
      { name: '仅查看公开内容', enabled: true }
    ]
  }
]

const getRoleIconClass = (code: string): string => {
  const map: Record<string, string> = {
    'OWNER': 'owner',
    'ADMINISTRATOR': 'admin',
    'LEADER': 'leader',
    'AUTHOR': 'author',
    'CONTRIBUTOR': 'contributor',
    'READER': 'reader',
    'PUBLIC_READER': 'public'
  }
  return map[code] || 'reader'
}

const getRoleInitial = (code: string): string => {
  const map: Record<string, string> = {
    'OWNER': 'O',
    'ADMINISTRATOR': 'A',
    'LEADER': 'L',
    'AUTHOR': 'A',
    'CONTRIBUTOR': 'C',
    'READER': 'R',
    'PUBLIC_READER': 'P'
  }
  return map[code] || 'R'
}

const handleCreateRole = () => {
  console.log('创建自定义角色')
}
</script>

<style lang="scss" scoped>
.workspace-roles {
  .roles-header {
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

  .roles-card {
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

  .role-hierarchy {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #ecf5ff 0%, #f5f7fa 100%);
    border-radius: 8px;
    flex-wrap: wrap;
  }

  .hierarchy-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #fff;
    border-radius: 20px;
    font-size: 13px;
    color: #606266;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .hierarchy-arrow {
    color: #909399;
    font-size: 14px;
  }

  .inheritance-note {
    font-size: 12px;
    color: #909399;
    margin-left: 20px;
  }

  .roles-list {
    .role-card {
      border: 1px solid #ebeef5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &.system {
        border-left: 4px solid #e6a23c;
      }

      &.custom {
        border-left: 4px solid #409EFF;
      }
    }

    .role-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .role-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .role-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 20px;
      font-weight: 600;

      &.owner {
        background: linear-gradient(135deg, #f56c6c 0%, #c45656 100%);
      }

      &.admin {
        background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
      }

      &.leader {
        background: linear-gradient(135deg, #e6a23c 0%, #b88230 100%);
      }

      &.author {
        background: linear-gradient(135deg, #67c23a 0%, #529b2e 100%);
      }

      &.contributor {
        background: linear-gradient(135deg, #1890ff 0%, #0d7acc 100%);
      }

      &.reader {
        background: linear-gradient(135deg, #909399 0%, #6a6d72 100%);
      }

      &.public {
        background: linear-gradient(135deg, #9254de 0%, #7647b3 100%);
      }
    }

    .role-name-area {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .role-name {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 8px;

      .role-tag {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }

    .role-desc {
      font-size: 13px;
      color: #909399;
    }

    .role-member-count {
      font-size: 14px;
      color: #606266;
    }

    .permission-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ebeef5;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 10px;
    }

    .permission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .permission-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f5f7fa;
      border-radius: 4px;
      font-size: 13px;
      color: #606266;

      &.enabled {
        background: #ecf5ff;
        color: #409EFF;
      }

      &.disabled {
        opacity: 0.5;
      }
    }

    .role-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ebeef5;
    }
  }
}
</style>
