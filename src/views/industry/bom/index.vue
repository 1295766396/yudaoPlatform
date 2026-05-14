<template>
  <div class="bom-editor">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-select v-model="selectedBomId" placeholder="选择BOM" class="select-bom">
          <el-option
            v-for="bom in bomList"
            :key="bom.id"
            :label="`${bom.name} - ${bom.currentVersion}`"
            :value="bom.id"
          />
        </el-select>
        <el-select v-model="currentView" class="select-view">
          <el-option label="EBOM" value="EBOM" />
          <el-option label="MBOM" value="MBOM" />
          <el-option label="DBOM" value="DBOM" />
          <el-option label="PBOM" value="PBOM" />
        </el-select>
        <el-select v-model="selectedVersion" class="select-version">
          <el-option
            v-for="version in bomVersions"
            :key="version.id"
            :label="`版本：${version.version}`"
            :value="version.version"
          />
        </el-select>
        <el-button type="primary">保存</el-button>
        <el-button>升版</el-button>
        <el-button type="success">发布</el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索节点"
          class="search-input"
          clearable
          :prefix-icon="Search"
        />
        <el-select placeholder="筛选" class="select-filter" clearable>
          <el-option label="全部" value="" />
          <el-option label="装配件" value="assembly" />
          <el-option label="零件" value="part" />
          <el-option label="标准件" value="standard" />
        </el-select>
        <el-button>导入</el-button>
        <el-button>导出</el-button>
        <!-- <el-button @click="showCompare = true">对比</el-button> -->
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content-full">
      <!-- BOM编辑表格 -->
      <div class="table-panel-full">
        <el-card shadow="never">
          <template #header>
            <div class="panel-header">
              <span>BOM编辑表格</span>
            </div>
          </template>
          <el-table
            :data="tableData"
            border
            row-key="id"
            :tree-props="{ children: 'children' }"
            @selection-change="handleSelectionChange"
            highlight-current-row
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="name" label="零件名称" min-width="150">
              <template #default="{ row }">
                <span class="name-link" @click="handleNameClick(row)">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="partNo" label="零件编号" width="150" />
            <el-table-column prop="quantity" label="数量" width="150" align="center">
              <template #default="{ row }">
                <el-input-number
                  v-if="row.type !== 'assembly'"
                  v-model="row.quantity"
                  size="small"
                  :min="1"
                />
                <span v-else>{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="80" align="center" />
            <el-table-column prop="type" label="类型" width="90">
              <template #default="{ row }">
                <el-tag v-if="row.type === 'assembly'" size="small">装配件</el-tag>
                <el-tag v-else-if="row.type === 'part'" type="info" size="small">零件</el-tag>
                <el-tag v-else type="warning" size="small">标准件</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" width="70" align="center" />
            <el-table-column prop="material" label="材料" width="110" />
            <el-table-column prop="isKey" label="关键件" width="80" align="center">
              <template #default="{ row }">
                <el-icon v-if="row.isKey" color="#f56c6c">
                  <StarFilled />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag
                  v-if="row.status"
                  :type="getStatusTagType(row.status)"
                  size="small"
                >
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

    <!-- 对比弹窗 -->
    <el-dialog
      v-model="showCompare"
      title="版本对比"
      width="900px"
    >
      <div class="compare-header">
        <span class="compare-title">当前版本 A.2</span>
        <span class="compare-divider">vs</span>
        <el-select
          v-model="compareVersion"
          placeholder="选择对比版本"
          class="select-compare"
        >
          <el-option label="A.1" value="A.1" />
          <el-option label="A.0" value="A.0" />
        </el-select>
      </div>
      <div class="compare-stats">
        <span class="stat-item add">
          <el-tag type="success">🟢 新增 {{ bomDiffStats.add }}</el-tag>
        </span>
        <span class="stat-item delete">
          <el-tag type="danger">🔴 删除 {{ bomDiffStats.delete }}</el-tag>
        </span>
        <span class="stat-item modify">
          <el-tag type="warning">🟠 修改 {{ bomDiffStats.modify }}</el-tag>
        </span>
        <span class="stat-item move">
          <el-tag type="info">🔵 移动 {{ bomDiffStats.move }}</el-tag>
        </span>
        <span class="stat-item all">
          <el-tag>全部</el-tag>
        </span>
      </div>
      <el-table :data="bomDiffData" border>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="零件名称" width="200" />
        <el-table-column prop="currentVersion" label="当前版本" width="120" align="center" />
        <el-table-column prop="compareVersion" label="对比版本" width="120" align="center" />
        <el-table-column prop="diffType" label="差异" width="120">
          <template #default="{ row }">
            <el-tag
              :type="getDiffTagType(row.diffType)"
              size="small"
            >
              {{ getDiffText(row.diffType) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button>导出差异报告</el-button>
        <el-button @click="showCompare = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 属性弹窗 -->
    <el-dialog
      v-model="showPropertyDialog"
      :title="selectedNode?.name || '属性'"
      width="600px"
    >
      <div v-if="selectedNode">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="属性" name="properties">
            <el-descriptions
              :column="1"
              border
              class="property-desc"
            >
              <el-descriptions-item
                v-for="(prop, index) in currentProperties"
                :key="index"
                :label="prop.label"
              >
                <el-select
                  v-if="prop.options"
                  v-model="prop.value"
                  size="small"
                  :disabled="!prop.editable"
                  style="width: 100%"
                >
                  <el-option
                    v-for="opt in prop.options"
                    :key="opt"
                    :label="opt"
                    :value="opt"
                  />
                </el-select>
                <el-input-number
                  v-else-if="typeof prop.value === 'number'"
                  v-model="prop.value"
                  size="small"
                  :disabled="!prop.editable"
                  style="width: 100%"
                />
                <el-input
                  v-else
                  v-model="prop.value"
                  size="small"
                  :disabled="!prop.editable"
                />
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="版本" name="versions">
            <div class="version-list">
              <div
                v-for="version in bomVersions"
                :key="version.id"
                class="version-item"
                :class="{ 'is-current': version.isCurrent }"
              >
                <div class="version-main">
                  <span class="version-no">{{ version.version }}</span>
                  <el-tag
                    v-if="version.isCurrent"
                    type="primary"
                    size="small"
                  >
                    当前
                  </el-tag>
                  <el-tag
                    v-else
                    :type="getStatusTagType(version.status)"
                    size="small"
                  >
                    {{ getStatusText(version.status) }}
                  </el-tag>
                </div>
                <div class="version-info">
                  <span class="version-time">{{ version.createTime }}</span>
                  <span class="version-creator">{{ version.creator }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="影响分析" name="impact">
            <div v-if="currentImpact.length === 0" class="empty-state">
              <Icon icon="ep:link" :size="40" />
              <p>暂无影响分析数据</p>
            </div>
            <div v-else>
              <div class="impact-section">
                <h4>被以下BOM引用</h4>
                <div
                  v-for="item in currentImpact.filter(i => i.type === 'BOM引用')"
                  :key="item.name"
                  class="impact-item"
                >
                  <Icon icon="ep:document" class="item-icon" :size="16" />
                  <span class="item-name">{{ item.name }}</span>
                  <el-tag v-if="item.bomType" type="info" size="small">
                    {{ item.bomType }}
                  </el-tag>
                </div>
              </div>
              <div class="impact-section">
                <h4>关联文档</h4>
                <div
                  v-for="item in currentImpact.filter(i => i.type === '关联文档')"
                  :key="item.name"
                  class="impact-item"
                >
                  <Icon icon="ep:document" class="item-icon" :size="16" />
                  <span class="item-name">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button type="primary">保存</el-button>
        <el-button @click="showPropertyDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, StarFilled } from '@element-plus/icons-vue'
import Icon from '@/components/Icon/src/Icon.vue'
import {
  bomList,
  bomTreeData,
  bomVersions,
  bomPropertyMock,
  bomHistoryMock,
  impactAnalysisMock,
  bomDiffData,
  bomDiffStats,
  contextMenuItems
} from './mock'
import type { BOMNode, BOMViewType, BOMStatus, DiffType } from './mock'

defineOptions({ name: 'IndustryBom' })

const selectedBomId = ref('bom-001')
const currentView = ref<BOMViewType>('EBOM')
const selectedVersion = ref('A.2')
const selectedNode = ref<BOMNode | null>(null)
const activeTab = ref('properties')
const showCompare = ref(false)
const compareVersion = ref('A.1')
const searchKeyword = ref('')
const showPropertyDialog = ref(false)

const tableData = computed(() => {
  return bomTreeData.map(node => ({
    index: 1,
    ...node
  }))
})

const currentProperties = computed(() => {
  if (!selectedNode.value) return []
  return bomPropertyMock[selectedNode.value.id] || []
})

const currentImpact = computed(() => {
  if (!selectedNode.value) return []
  return impactAnalysisMock[selectedNode.value.id] || []
})

const getNodeIcon = (data: BOMNode) => {
  switch (data.type) {
    case 'assembly': return 'ep:folder-opened'
    case 'part': return 'ep:tool'
    case 'standard': return 'ep:box'
    default: return 'ep:document'
  }
}

const getStatusText = (status: BOMStatus) => {
  switch (status) {
    case 'draft': return '草稿'
    case 'designing': return '设计中'
    case 'published': return '已发布'
    case 'archived': return '已归档'
    default: return ''
  }
}

// 在 script lang="ts" setup 部分找到 getStatusTagType 函数并修改如下：

const getStatusTagType = (status: BOMStatus) => {
  switch (status) {
    case 'draft': return 'info'
    case 'designing': return 'warning'
    case 'published': return 'success'
    case 'archived': return 'info'
    default: return undefined // 修改点：将 '' 改为 undefined
  }
}

const getDiffText = (type: DiffType) => {
  switch (type) {
    case 'add': return '新增'
    case 'delete': return '删除'
    case 'modify': return '修改'
    case 'move': return '移动'
    default: return ''
  }
}

const getDiffTagType = (type: DiffType) => {
  switch (type) {
    case 'add': return 'success'
    case 'delete': return 'danger'
    case 'modify': return 'warning'
    case 'move': return 'info'
    default: return undefined // 修复点：将 '' 改为 undefined
  }
}

const handleNodeClick = (data: BOMNode) => {
  selectedNode.value = data
  showPropertyDialog.value = true
}

const handleNameClick = (row: BOMNode) => {
  selectedNode.value = row
  showPropertyDialog.value = true
}

const closeContextMenu = () => {
  // 保留函数以兼容现有代码
}

const handleContextMenuClick = (item: any) => {
  // 保留函数以兼容现有代码
}

const handleSelectionChange = (selection: BOMNode[]) => {
  console.log('选中节点:', selection)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeContextMenu()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.bom-editor {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--top-tool-height, 0px) - var(--tags-view-height, 0px));
  min-height: 0;
  background: #f5f7fa;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid var(--el-border-color-light);

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .select-bom {
    width: 220px;
  }

  .select-view,
  .select-version,
  .select-filter {
    width: 140px;
  }

  .search-input {
    width: 200px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 20px;
  gap: 20px;
}

.tree-panel,
.table-panel,
.property-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 16px;
  }
}

.main-content-full {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 20px;
  gap: 20px;
}

.table-panel-full {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  :deep(.el-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 16px;
  }
}

.name-link {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.panel-header {
  font-weight: 600;
}

.property-desc {
  :deep(.el-descriptions__label) {
    width: 100px;
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--el-text-color-secondary);

  p {
    margin-top: 12px;
  }
}

.version-list {
  .version-item {
    padding: 12px;
    border-bottom: 1px solid var(--el-border-color-light);

    &.is-current {
      background: var(--el-color-primary-light-9);
    }

    .version-main {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;

      .version-no {
        font-weight: 600;
      }
    }

    .version-info {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.impact-section {
  margin-bottom: 20px;

  h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    padding-left: 8px;
  }

  .impact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-light);

    .item-name {
      flex: 1;
    }
  }
}

.compare-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  .compare-title {
    font-weight: 600;
  }

  .select-compare {
    width: 160px;
  }
}

.compare-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
