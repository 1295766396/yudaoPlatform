<template>
  <div class="file-workspace">
    <div class="workspace-header">
      <div class="header-left">
        <el-button type="primary" @click="handleNewFolder">
          <el-icon><Plus /></el-icon>
          <span>新建文件夹</span>
        </el-button>
        
        <el-dropdown trigger="click" @command="handleNewDocument">
          <el-button>
            <el-icon><Edit /></el-icon>
            <span>新建文档</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="type in documentTypes" :key="type" :command="type">
                {{ type }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-dropdown trigger="click" @command="handleNewPart">
          <el-button>
            <el-icon><Edit /></el-icon>
            <span>新建零件</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="type in partTypes" :key="type" :command="type">
                {{ type }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-dropdown trigger="click" @command="handleNewDataset">
          <el-button>
            <el-icon><Plus /></el-icon>
            <span>新建数据集</span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="type in datasetTypes" :key="type" :command="type">
                {{ type }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      
      <div class="header-right">
        <el-button 
          :disabled="!selectedNode || selectedNode.type !== 'dataset'" 
          @click="handleUploadFile"
        >
          <el-icon><Plus /></el-icon>
          <span>上传</span>
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          <span>刷新</span>
        </el-button>
      </div>
    </div>
    
    <div class="workspace-body">
      <div class="tree-panel">
        <el-card shadow="never" class="tree-card">
          <template #header>
            <div class="tree-header">
              <div class="tree-header__col tree-header__name">对象名称</div>
              <div class="tree-header__col tree-header__type">对象类型</div>
            </div>
          </template>
          
          <el-tree
            ref="treeRef"
            :data="navigationTreeMock"
            :expand-on-click-node="false"
            :auto-expand-parent="false"
            :default-expanded-keys="['nav-my-work', 'nav-quick-access', 'nav-dynamic-folders']"
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
            @node-contextmenu="handleNodeContextMenu"
          >
            <template #default="{ data }">
              <div class="tree-node" :class="{ 'is-selected': selectedNode?.id === data.id }">
                <div class="tree-node__icon">
                  <Icon :icon="getNodeIcon(data)" :size="18" />
                </div>
                <div class="tree-node__name">{{ data.name }}</div>
                <div class="tree-node__type">{{ getNodeTypeName(data) }}</div>
                <div v-if="data.isCurrent" class="tree-node__current">当前</div>
                <div v-if="data.fileCount" class="tree-node__count">{{ data.fileCount }}个文件</div>
                <span v-if="data.status" class="tree-node__status" :class="`status-${data.status}`">
                  {{ getStatusText(data.status) }}
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </div>
      
      <div class="detail-panel">
        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="detail-header">
              <span v-if="selectedNode" class="detail-title">
                <Icon :icon="getNodeIcon(selectedNode)" :size="20" class="mr-2" />
                {{ selectedNode.name }}
              </span>
              <span v-else class="detail-title">请选择对象</span>
            </div>
          </template>
          
          <div v-if="!selectedNode" class="empty-state">
            <div class="empty-icon">📂</div>
            <div class="empty-text">请在左侧选择一个对象</div>
          </div>
          
          <div v-else-if="selectedNode.quickAccessType === 'recent'" class="quick-access-panel">
            <RecentList />
          </div>
          
          <div v-else-if="selectedNode.quickAccessType === 'favorite'" class="quick-access-panel">
            <FavoriteList />
          </div>
          
          <div v-else-if="selectedNode.quickAccessType === 'clipboard'" class="quick-access-panel">
            <ClipboardList />
          </div>
          
          <el-tabs v-else v-model="activeTab" class="detail-tabs">
            <el-tab-pane label="属性" name="properties">
              <div class="properties-panel">
                <div class="properties-overview">
                  <h3 class="panel-title">概览信息</h3>
                  <el-descriptions :column="2" border class="prop-descriptions">
                    <el-descriptions-item
                      v-for="item in selectedProperties"
                      :key="item.label"
                      :label="item.label"
                    >
                      {{ item.value }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
                
                <div class="properties-content">
                  <div class="content-header">
                    <h3 class="panel-title">{{ getContentListTitle() }}</h3>
                    <span class="content-count">共 {{ contentList.length }} 个</span>
                  </div>
                  <div class="content-list">
                    <div 
                      v-for="item in contentList" 
                      :key="item.id"
                      class="content-item"
                      @click="handleContentItemClick(item)"
                    >
                      <Icon :icon="getNodeIcon(item)" :size="16" class="content-icon" />
                      <span class="content-name">{{ item.name }}</span>
                      <span v-if="item.isCurrent" class="content-current">当前</span>
                      <span v-if="item.status" class="content-status" :class="`status-${item.status}`">
                        {{ getStatusText(item.status) }}
                      </span>
                      <span class="content-time">{{ getItemTime(item) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="预览" name="preview">
              <div class="preview-panel">
                <div class="empty-state">
                  <div class="empty-icon">👁️</div>
                  <div class="empty-text">预览功能开发中</div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="附件" name="attachments">
              <div class="attachments-panel">
                <div class="attachments-header">
                  <span>附件</span>
                  <el-button size="small" @click="handleUploadFile">上传文件</el-button>
                </div>
                <div v-if="attachmentsByDataset.length === 0" class="empty-state">
                  <div class="empty-icon">📎</div>
                  <div class="empty-text">暂无附件</div>
                </div>
                <div v-else class="attachments-list">
                  <div 
                    v-for="dataset in attachmentsByDataset" 
                    :key="dataset.id"
                    class="dataset-group"
                  >
                    <div class="dataset-header" @click="toggleDatasetExpand(dataset.id)">
                      <span class="dataset-icon">📂</span>
                      <span class="dataset-name">{{ dataset.name }}</span>
                      <span class="dataset-count">({{ dataset.files.length }}个文件)</span>
                      <Icon :icon="expandedDatasets.includes(dataset.id) ? 'ep:arrow-up' : 'ep:arrow-down'" :size="16" />
                    </div>
                    <div v-if="expandedDatasets.includes(dataset.id)" class="dataset-files">
                      <div 
                        v-for="file in dataset.files" 
                        :key="file.id"
                        class="file-item"
                      >
                        <Icon :icon="getFileIcon(file.name)" :size="16" class="file-icon" />
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ file.sizeText }}</span>
                        <span class="file-time">{{ file.createTime }}</span>
                        <el-button size="small" @click="handleDownloadFile(file)">
                          <el-icon><Download /></el-icon>
                          下载
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="影响分析" name="impact">
              <div class="impact-panel">
                <div v-if="impactItems.length === 0" class="empty-state">
                  <div class="empty-icon">🔗</div>
                  <div class="empty-text">暂无影响分析数据</div>
                </div>
                <div v-else>
                  <div class="impact-section">
                    <h4>被以下BOM引用</h4>
                    <div 
                      v-for="item in impactItems.filter(i => i.type === 'BOM引用')" 
                      :key="item.name"
                      class="impact-item"
                    >
                      <span class="impact-icon">📋</span>
                      <span class="impact-name">{{ item.name }}</span>
                      <span v-if="item.bomType" class="impact-bom">{{ item.bomType }}</span>
                    </div>
                  </div>
                  <div class="impact-section">
                    <h4>关联文档</h4>
                    <div 
                      v-for="item in impactItems.filter(i => i.type === '关联文档')" 
                      :key="item.name"
                      class="impact-item"
                    >
                      <span class="impact-icon">📄</span>
                      <span class="impact-name">{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="流程状态" name="workflow">
              <div class="workflow-panel">
                <div class="empty-state">
                  <div class="empty-icon">📋</div>
                  <div class="empty-text">流程状态功能开发中</div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="审计日志" name="audit">
              <div class="audit-panel">
                <div v-if="auditLogs.length === 0" class="empty-state">
                  <div class="empty-icon">📜</div>
                  <div class="empty-text">暂无审计日志</div>
                </div>
                <div v-else class="audit-list">
                  <div 
                    v-for="(log, index) in auditLogs" 
                    :key="index"
                    class="audit-item"
                  >
                    <span class="audit-time">{{ log.time }}</span>
                    <span class="audit-action">{{ log.action }}</span>
                    <span class="audit-operator">{{ log.operator }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
    
    <div
      v-show="contextMenu.visible"
      class="context-menu-mask"
      @click="closeContextMenu"
    >
      <div
        class="context-menu"
        :style="{ left: `${contextMenu.left}px`, top: `${contextMenu.top}px` }"
        @click.stop
      >
        <ContextMenuGroup :items="currentContextMenu" @item-click="handleContextMenuClick" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, defineComponent, h, PropType } from 'vue'
import { ElTree, ElTabs, ElTabPane, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElDescriptions, ElDescriptionsItem, ElIcon } from 'element-plus'
import { ArrowDown, ArrowUp, Plus, Edit, Delete, Refresh, Download } from '@element-plus/icons-vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { 
  fileTreeMock, 
  filePropertiesMock, 
  filesMock, 
  auditLogsMock, 
  impactAnalysisMock,
  folderContextMenuMock,
  documentPartContextMenuMock,
  versionContextMenuMock,
  datasetContextMenuMock,
  documentTypes,
  partTypes,
  datasetTypes,
  navigationTreeMock
} from './mock'
import type { FileNode, FileProperty, ContextMenuNode, FileItem, AuditLog, ImpactItem, ObjectType, ObjectStatus } from './mock'
import RecentList from './RecentList.vue'
import FavoriteList from './FavoriteList.vue'
import ClipboardList from './ClipboardList.vue'

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<FileNode[]>(fileTreeMock)
const selectedNode = ref<FileNode | null>(null)
const activeTab = ref('properties')
const expandedDatasets = ref<string[]>([])

const contextMenu = reactive({
  visible: false,
  left: 0,
  top: 0
})

const currentContextMenu = ref<ContextMenuNode[]>([])
const contextMenuTargetNode = ref<FileNode | null>(null)

const selectedProperties = computed<FileProperty[]>(() => {
  if (!selectedNode.value) return []
  return filePropertiesMock[selectedNode.value.id] || []
})

const contentList = computed<FileNode[]>(() => {
  if (!selectedNode.value) return []
  return selectedNode.value.children || []
})

const attachmentsByDataset = computed(() => {
  if (!selectedNode.value) return []
  
  const getDatasets = (node: FileNode): { id: string; name: string; files: FileItem[] }[] => {
    const result: { id: string; name: string; files: FileItem[] }[] = []
    
    if (node.type === 'dataset') {
      const files = filesMock[node.id] || []
      result.push({ id: node.id, name: node.name, files })
    }
    
    if (node.children) {
      node.children.forEach(child => {
        result.push(...getDatasets(child))
      })
    }
    
    return result
  }
  
  return getDatasets(selectedNode.value)
})

const impactItems = computed<ImpactItem[]>(() => {
  if (!selectedNode.value) return []
  return impactAnalysisMock[selectedNode.value.id] || []
})

const auditLogs = computed<AuditLog[]>(() => {
  if (!selectedNode.value) return []
  return auditLogsMock[selectedNode.value.id] || []
})

const getNodeIcon = (data: FileNode): string => {
  if (data.quickAccessType === 'recent') return 'ep:clock'
  if (data.quickAccessType === 'favorite') return 'ep:star'
  if (data.quickAccessType === 'clipboard') return 'ep:copy-document'
  if (data.type === 'dynamic-folder') return 'ep:magic-stick'
  
  switch (data.type) {
    case 'folder': return data.id === 'home' ? 'ep:home-filled' : 'ep:folder'
    case 'document': return 'ep:document'
    case 'part': return 'ep:tools'
    case 'version': return 'ep:document'
    case 'dataset': return 'ep:grid'
    default: return 'ep:document'
  }
}

const getNodeTypeName = (data: FileNode): string => {
  if (data.quickAccessType === 'recent') return '最近访问'
  if (data.quickAccessType === 'favorite') return '我的收藏'
  if (data.quickAccessType === 'clipboard') return '剪切板'
  if (data.type === 'dynamic-folder') return '动态文件夹'
  
  switch (data.type) {
    case 'folder': return '文件夹'
    case 'document': return data.subType || '文档'
    case 'part': return data.subType || '零件'
    case 'version': return '版本'
    case 'dataset': return '数据集'
    default: return '未知'
  }
}

const getStatusText = (status: ObjectStatus): string => {
  switch (status) {
    case 'draft': return '草稿'
    case 'designing': return '设计中'
    case 'published': return '已发布'
    case 'archived': return '已归档'
    default: return ''
  }
}

const getItemTime = (item: FileNode): string => {
  return '2026-05-13'
}

const getContentListTitle = (): string => {
  if (!selectedNode.value) return '内容列表'
  switch (selectedNode.value.type) {
    case 'folder': return '内容列表'
    case 'document':
    case 'part': return '版本列表'
    case 'version': return '数据集列表'
    case 'dataset': return '文件列表'
    default: return '内容列表'
  }
}

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'catpart': return 'ep:tools'
    case 'catproduct': return 'ep:folder-opened'
    case 'pdf': return 'ep:document'
    case 'xlsx':
    case 'xls': return 'ep:document'
    case 'docx':
    case 'doc': return 'ep:document'
    case 'pptx':
    case 'ppt': return 'ep:document'
    case 'zip': return 'ep:folder'
    case 'dxf': return 'ep:document'
    case 'txt': return 'ep:document'
    default: return 'ep:document'
  }
}

const toggleDatasetExpand = (datasetId: string) => {
  const index = expandedDatasets.value.indexOf(datasetId)
  if (index > -1) {
    expandedDatasets.value.splice(index, 1)
  } else {
    expandedDatasets.value.push(datasetId)
  }
}

const handleNodeClick = (data: FileNode) => {
  selectedNode.value = data
}

const handleNodeContextMenu = (event: MouseEvent, data: FileNode) => {
  event.preventDefault()
  selectedNode.value = data
  treeRef.value?.setCurrentKey(data.id)
  
  contextMenuTargetNode.value = data
  
  switch (data.type) {
    case 'folder':
      currentContextMenu.value = folderContextMenuMock
      break
    case 'document':
    case 'part':
      currentContextMenu.value = documentPartContextMenuMock
      break
    case 'version':
      currentContextMenu.value = versionContextMenuMock
      break
    case 'dataset':
      currentContextMenu.value = datasetContextMenuMock
      break
    default:
      currentContextMenu.value = folderContextMenuMock
  }
  
  contextMenu.visible = true
  contextMenu.left = event.clientX
  contextMenu.top = event.clientY
}

const closeContextMenu = () => {
  contextMenu.visible = false
}

const handleContextMenuClick = (item: ContextMenuNode) => {
  if (!item.children || item.children.length === 0) {
    console.log(`点击右键菜单项: ${item.label} (ID: ${item.id})`)
    
    switch (item.id) {
      case 'new-folder':
        handleNewFolder()
        break
      case 'rename':
        handleRename()
        break
      case 'delete':
        handleDelete()
        break
      case 'add-dataset':
        handleAddDataset()
        break
      case 'upgrade':
        handleUpgrade()
        break
      case 'upload':
        handleUploadFile()
        break
      case 'properties':
        activeTab.value = 'properties'
        break
    }
    
    closeContextMenu()
  }
}

const handleContentItemClick = (item: FileNode) => {
  selectedNode.value = item
  treeRef.value?.setCurrentKey(item.id)
}

const handleNewFolder = () => {
  console.log('新建文件夹 - 待实现')
}

const handleNewDocument = (type: string) => {
  console.log(`新建文档: ${type} - 待实现`)
}

const handleNewPart = (type: string) => {
  console.log(`新建零件: ${type} - 待实现`)
}

const handleNewDataset = (type: string) => {
  console.log(`新建数据集: ${type} - 待实现`)
}

const handleUploadFile = () => {
  console.log('上传文件 - 待实现')
}

const handleRefresh = () => {
  console.log('刷新 - 待实现')
}

const handleRename = () => {
  console.log('重命名 - 待实现')
}

const handleDelete = () => {
  console.log('删除 - 待实现')
}

const handleAddDataset = () => {
  console.log('添加数据集 - 待实现')
}

const handleUpgrade = () => {
  console.log('升版 - 待实现')
}

const handleDownloadFile = (file: FileItem) => {
  console.log(`下载文件: ${file.name} - 待实现`)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeContextMenu()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  
  const first = treeData.value?.[0]
  if (first) {
    selectedNode.value = first
    treeRef.value?.setCurrentKey(first.id)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const ContextMenuGroup = defineComponent({
  name: 'ContextMenuGroup',
  props: {
    items: {
      type: Array as PropType<ContextMenuNode[]>,
      required: true
    }
  },
  emits: ['item-click'],
  setup(props, { emit }) {
    const hoverIndex = ref<number | null>(null)

    const setHover = (index: number | null) => {
      hoverIndex.value = index
    }

    return () =>
      h(
        'ul',
        { class: 'context-menu__list' },
        props.items.map((item, idx) => {
          if (item.divider) {
            return h('li', { class: 'context-menu__divider' })
          }
          
          const hasChildren = !!item.children?.length
          const isHover = hoverIndex.value === idx
          return h(
            'li',
            {
              class: ['context-menu__item', { 'is-hover': isHover }],
              onMouseenter: () => setHover(idx),
              onMouseleave: () => setHover(null),
              onClick: (e: MouseEvent) => {
                if (!hasChildren) {
                  e.stopPropagation()
                  emit('item-click', item)
                }
              }
            },
            [
              h('div', { class: 'context-menu__item-row' }, [
                h('span', { class: 'context-menu__item-label' }, item.label),
                hasChildren ? h('span', { class: 'context-menu__item-arrow' }, '›') : null
              ]),
              hasChildren && isHover
                ? h('div', { class: 'context-menu__submenu' }, [
                    h(ContextMenuGroup, { 
                      items: item.children!,
                      onItemClick: (childItem: ContextMenuNode) => emit('item-click', childItem)
                    })
                  ])
                : null
            ]
          )
        })
      )
  }
})
</script>

<style lang="scss" scoped>
.file-workspace {
  height: calc(
    100vh - var(--top-tool-height, 0px) - var(--tags-view-height, 0px) -
      var(--app-content-padding, 0px) - var(--app-content-padding, 0px)
  );
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  
  .header-left,
  .header-right {
    display: flex;
    gap: 8px;
  }
}

.workspace-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.tree-panel {
  width: 40%;
  min-width: 320px;
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  
  .tree-card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 0;
    border-right: none;
  }
}

.detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  .detail-card {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 0;
  }
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.tree-header {
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 600;
}

.tree-header__col {
  line-height: 24px;
}

.tree-header__name {
  flex: 1;
}

.tree-header__type {
  width: 100px;
  text-align: right;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  
  &.is-selected {
    background: var(--el-fill-color-light);
  }
}

.tree-node__icon {
  width: 20px;
  text-align: center;
}

.tree-node__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}

.tree-node__type {
  width: 100px;
  text-align: right;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.tree-node__current {
  width: 40px;
  text-align: center;
  font-size: 11px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 4px;
  padding: 1px 4px;
}

.tree-node__count {
  width: 60px;
  text-align: right;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.tree-node__status {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 8px;
  
  &.status-draft {
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
  }
  
  &.status-designing {
    background: #fff7e6;
    color: #d48806;
  }
  
  &.status-published {
    background: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }
  
  &.status-archived {
    background: var(--el-bg-color);
    color: var(--el-text-color-secondary);
    border: 1px solid var(--el-border-color);
  }
}

.detail-header {
  .detail-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    
    .icon-text {
      font-size: 20px;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .empty-text {
    font-size: 14px;
  }
}

.detail-tabs {
  height: calc(100% - 52px);
  display: flex;
  flex-direction: column;
  
  :deep(.el-tabs__header) {
    border-bottom: 1px solid var(--el-border-color);
  }
  
  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
}

.quick-access-panel {
  height: 100%;
  padding: 0;
}

.properties-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.properties-overview {
  margin-bottom: 20px;
  
  .panel-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--el-text-color-primary);
  }
}

.properties-content {
  flex: 1;
  min-height: 0;
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .content-count {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
  
  .content-list {
    max-height: calc(100% - 40px);
    overflow: auto;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
  
  .content-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--el-border-color-light);
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: var(--el-fill-color-light);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .content-icon {
    width: 24px;
    font-size: 16px;
  }
  
  .content-name {
    flex: 1;
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .content-current {
    font-size: 11px;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
    padding: 2px 6px;
    margin-right: 8px;
  }
  
  .content-status {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 8px;
    
    &.status-draft {
      background: var(--el-color-warning-light-9);
      color: var(--el-color-warning);
    }
    
    &.status-designing {
      background: #fff7e6;
      color: #d48806;
    }
    
    &.status-published {
      background: var(--el-color-success-light-9);
      color: var(--el-color-success);
    }
    
    &.status-archived {
      background: var(--el-bg-color);
      color: var(--el-text-color-secondary);
      border: 1px solid var(--el-border-color);
    }
  }
  
  .content-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.attachments-panel {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .attachments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  .attachments-list {
    flex: 1;
    overflow: auto;
  }
  
  .dataset-group {
    margin-bottom: 16px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    overflow: hidden;
  }
  
  .dataset-header {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: var(--el-bg-color-page);
    cursor: pointer;
    
    &:hover {
      background: var(--el-fill-color-light);
    }
  }
  
  .dataset-icon {
    margin-right: 8px;
    font-size: 16px;
  }
  
  .dataset-name {
    flex: 1;
  }
  
  .dataset-count {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-right: 8px;
  }
  
  .dataset-files {
    padding: 8px;
  }
  
  .file-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 4px;
    
    &:hover {
      background: var(--el-fill-color-light);
    }
  }
  
  .file-icon {
    width: 24px;
    font-size: 16px;
  }
  
  .file-name {
    flex: 1;
    margin-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .file-size {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-right: 12px;
    width: 80px;
    text-align: right;
  }
  
  .file-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-right: 12px;
  }
}

.impact-panel {
  padding: 20px;
  height: 100%;
  
  .impact-section {
    margin-bottom: 24px;
    
    h4 {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--el-text-color-primary);
    }
  }
  
  .impact-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid var(--el-border-color-light);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .impact-icon {
    width: 24px;
    font-size: 16px;
  }
  
  .impact-name {
    flex: 1;
    margin-left: 8px;
  }
  
  .impact-bom {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    background: var(--el-bg-color-page);
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.audit-panel {
  padding: 20px;
  height: 100%;
  
  .audit-list {
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
  }
  
  .audit-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid var(--el-border-color-light);
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .audit-time {
    width: 140px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  
  .audit-action {
    flex: 1;
    margin-left: 16px;
  }
  
  .audit-operator {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-left: 16px;
  }
}

.context-menu-mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
}

.context-menu {
  position: fixed;
  min-width: 180px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
}

:deep(.context-menu__list) {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

:deep(.context-menu__divider) {
  height: 1px;
  background: var(--el-border-color-light);
  margin: 4px 0;
}

:deep(.context-menu__item) {
  position: relative;
  padding: 0 10px;
  font-size: 14px;
  line-height: 32px;
  cursor: default;
  user-select: none;
  
  &.is-hover {
    background: var(--el-fill-color-light);
  }
}

:deep(.context-menu__item-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

:deep(.context-menu__item-arrow) {
  color: var(--el-text-color-secondary);
}

:deep(.context-menu__submenu) {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 0;
  min-width: 160px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: var(--el-box-shadow-light);
}
</style>
