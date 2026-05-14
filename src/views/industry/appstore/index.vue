<template>
  <div class="app-store">
    <!-- 顶部搜索栏 -->
    <div class="header-bar">
      <div class="header-left">
        <h1 class="title">App Store</h1>
        <span class="subtitle">工具应用市场</span>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索应用"
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <el-radio-group v-model="selectedCategory" size="large">
        <el-radio-button
          v-for="cat in appCategories"
          :key="cat.value"
          :value="cat.value"
        >
          {{ cat.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 应用卡片列表 -->
    <div v-if="!showDetail" class="app-grid">
      <el-card
        v-for="app in filteredApps"
        :key="app.id"
        class="app-card"
        shadow="hover"
        @click="openAppDetail(app)"
      >
        <div class="card-content">
          <div class="card-header">
            <Icon :icon="app.icon" class="app-icon" :size="48" />
            <div class="app-basic">
              <h3 class="app-name">{{ app.name }}</h3>
              <div class="app-meta">
                <span class="app-version">{{ app.version }}</span>
                <el-tag
                  v-if="app.isOfficial"
                  type="success"
                  size="small"
                  class="official-tag"
                >
                  官方认证
                </el-tag>
              </div>
            </div>
          </div>

          <p class="app-desc">{{ app.description }}</p>

          <div class="app-stats">
            <div class="stat-item">
              <Icon icon="ep:download" :size="14" />
              <span>{{ formatInstallCount(app.installCount) }}</span>
            </div>
            <div class="stat-item">
              <Icon icon="ep:star" :size="14" class="star-icon" />
              <span>{{ app.rating }}</span>
            </div>
            <div class="stat-item">
              <span class="update-time">{{ app.updateTime }}</span>
            </div>
          </div>

          <div class="card-footer">
            <el-button
              :type="getButtonType(app.status)"
              :loading="app.status === 'installing' || app.status === 'updating'"
              :disabled="app.status === 'installed'"
              @click.stop="handleAction(app)"
            >
              {{ getButtonText(app.status) }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 应用详情页 -->
    <div v-else class="app-detail-page">
      <div class="detail-header">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
      </div>

      <div v-if="currentApp" class="detail-content">
        <div class="detail-top">
          <div class="detail-icon">
            <Icon :icon="currentApp.icon" :size="80" />
          </div>
          <div class="detail-info">
            <div class="detail-title-row">
              <h2 class="detail-name">{{ currentApp.name }}</h2>
              <el-tag
                v-if="currentApp.isOfficial"
                type="success"
                size="small"
                class="official-tag"
              >
                官方认证
              </el-tag>
            </div>
            <p class="detail-desc">{{ currentApp.description }}</p>
            <div class="detail-stats">
              <span class="stat">
                <Icon icon="ep:star" :size="16" class="star-icon" />
                {{ currentApp.rating }}分
              </span>
              <span class="stat">
                {{ formatInstallCount(currentApp.installCount) }}次安装
              </span>
              <span class="stat">
                {{ currentApp.author }}
              </span>
              <span class="stat">
                {{ currentApp.updateTime }}
              </span>
            </div>
            <div class="detail-actions">
              <el-button
                type="primary"
                :loading="currentApp.status === 'installing' || currentApp.status === 'updating'"
                :disabled="currentApp.status === 'installed'"
                size="large"
                @click="handleAction(currentApp)"
              >
                {{ getButtonText(currentApp.status) }}
              </el-button>
              <el-button size="large">版本对比</el-button>
            </div>
          </div>
        </div>

        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="功能介绍" name="intro">
            <div class="tab-content">
              <h4 class="section-title">功能简介</h4>
              <p class="intro-text">{{ (currentApp as AppDetail).introduction }}</p>

              <h4 class="section-title">核心功能</h4>
              <ul class="feature-list">
                <li v-for="(feature, idx) in (currentApp as AppDetail).features" :key="idx">
                  <Icon icon="ep:circle-check" :size="16" />
                  {{ feature }}
                </li>
              </ul>
            </div>
          </el-tab-pane>

          <el-tab-pane label="版本历史" name="versions">
            <div class="tab-content">
              <div
                v-for="(ver, idx) in (currentApp as AppDetail).versions"
                :key="idx"
                class="version-item"
              >
                <div class="version-header">
                  <span class="version-no">{{ ver.version }}</span>
                  <el-tag v-if="ver.isLatest" type="success" size="small">最新</el-tag>
                  <span class="version-time">{{ ver.updateTime }}</span>
                </div>
                <p class="version-log">{{ ver.updateLog }}</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, ArrowLeft } from '@element-plus/icons-vue'
import Icon from '@/components/Icon/src/Icon.vue'
import {
  appCategories,
  apps,
  appDetails
} from './mock'
import type { App, AppCategory, AppStatus, AppDetail } from './mock'

defineOptions({ name: 'IndustryAppStore' })

const selectedCategory = ref<AppCategory>('ALL')
const searchKeyword = ref('')
const showDetail = ref(false)
const currentAppId = ref('')
const activeTab = ref('intro')

const filteredApps = computed(() => {
  let result = apps

  if (selectedCategory.value !== 'ALL') {
    result = result.filter(app => app.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      app =>
        app.name.toLowerCase().includes(keyword) ||
        app.description.toLowerCase().includes(keyword)
    )
  }

  return result
})

const currentApp = computed<App | null>(() => {
  if (!currentAppId.value) return null
  const app = apps.find(a => a.id === currentAppId.value)
  const detail = appDetails[currentAppId.value]
  return detail || app || null
})

const getButtonType = (status: AppStatus) => {
  switch (status) {
    case 'has_update': return 'warning'
    case 'installed': return ''
    default: return 'primary'
  }
}

const getButtonText = (status: AppStatus) => {
  switch (status) {
    case 'not_installed': return '安装'
    case 'installing': return '安装中...'
    case 'installed': return '已安装'
    case 'has_update': return '有更新'
    case 'updating': return '更新中...'
    default: return '安装'
  }
}

const formatInstallCount = (count: number) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

const openAppDetail = (app: App) => {
  currentAppId.value = app.id
  showDetail.value = true
}

const goBack = () => {
  showDetail.value = false
  currentAppId.value = ''
  activeTab.value = 'intro'
}

const handleAction = (app: App) => {
  if (app.status === 'installed') return

  const targetApp = apps.find(a => a.id === app.id)
  if (!targetApp) return

  if (app.status === 'not_installed') {
    targetApp.status = 'installing'
    ElMessage.success(`正在安装 ${app.name}...`)

    setTimeout(() => {
      targetApp.status = 'installed'
      ElMessage.success(`${app.name} 安装成功！`)
    }, 2000)
  } else if (app.status === 'has_update') {
    targetApp.status = 'updating'
    ElMessage.success(`正在更新 ${app.name}...`)

    setTimeout(() => {
      targetApp.status = 'installed'
      ElMessage.success(`${app.name} 更新成功！`)
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.app-store {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - var(--top-tool-height, 0px) - var(--tags-view-height, 0px));
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .subtitle {
      font-size: 14px;
      color: #909399;
    }
  }

  .search-input {
    width: 320px;
  }
}

.category-tabs {
  margin-bottom: 24px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.app-card {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-header {
    display: flex;
    gap: 12px;

    .app-icon {
      flex-shrink: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 8px;
      color: white;
    }

    .app-basic {
      flex: 1;
      min-width: 0;

      .app-name {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }

      .app-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .app-version {
          font-size: 13px;
          color: #909399;
        }
      }
    }
  }

  .app-desc {
    margin: 0;
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .app-stats {
    display: flex;
    align-items: center;
    gap: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #909399;
    }

    .star-icon {
      color: #f7ba2a;
    }

    .update-time {
      font-size: 12px;
    }
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
  }
}

.app-detail-page {
  background: white;
  border-radius: 8px;
  padding: 24px;
}

.detail-header {
  margin-bottom: 24px;
}

.detail-content {
  .detail-top {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;

    .detail-icon {
      flex-shrink: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 16px;
      color: white;
    }

    .detail-info {
      flex: 1;

      .detail-title-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .detail-name {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #303133;
        }
      }

      .detail-desc {
        margin: 0 0 16px 0;
        font-size: 14px;
        color: #606266;
      }

      .detail-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 16px;
        font-size: 14px;
        color: #909399;

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .star-icon {
          color: #f7ba2a;
        }
      }

      .detail-actions {
        display: flex;
        gap: 12px;
      }
    }
  }

  .detail-tabs {
    border-top: 1px solid #ebeef5;
    padding-top: 16px;

    .tab-content {
      padding: 16px 0;

      .section-title {
        margin: 0 0 12px 0;
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .intro-text {
        margin: 0 0 24px 0;
        font-size: 14px;
        color: #606266;
        line-height: 1.8;
      }

      .feature-list {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-size: 14px;
          color: #606266;
        }
      }
    }

    .version-item {
      padding: 16px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .version-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .version-no {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }

        .version-time {
          font-size: 13px;
          color: #909399;
        }
      }

      .version-log {
        margin: 0;
        font-size: 14px;
        color: #606266;
        line-height: 1.6;
      }
    }
  }
}
</style>
