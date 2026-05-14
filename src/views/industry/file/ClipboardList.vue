<template>
  <div class="clipboard-list">
    <div class="clipboard-header">
      <span class="clipboard-title">剪切板内容 ({{ clipboardItems.length }})</span>
      <el-button size="small" @click="handleClearAll">清空剪切板</el-button>
    </div>
    <el-table :data="clipboardItems" style="width: 100%" stripe>
      <el-table-column prop="name" label="名称" min-width="200">
        <template #default="{ row }">
          <div class="item-name">
            <Icon :icon="getItemIcon(row.type)" :size="16" class="item-icon" />
            <span>{{ row.name }}</span>
            <el-tag v-if="row.operation === 'copy'" type="success" size="small" class="operation-tag">
              复制
            </el-tag>
            <el-tag v-else type="warning" size="small" class="operation-tag">
              剪切
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          {{ getTypeName(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="sourcePath" label="源路径" min-width="300" show-overflow-tooltip />
      <el-table-column prop="copyTime" label="复制时间" width="180" />
      <el-table-column prop="operator" label="操作者" width="120" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handlePaste(row)">
            粘贴
          </el-button>
          <el-button link type="danger" size="small" @click="handleRemove(row)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { clipboardItemsMock, ClipboardItem, ObjectType } from './mock'

const clipboardItems = computed(() => clipboardItemsMock)

const getItemIcon = (type: ObjectType): string => {
  switch (type) {
    case 'folder': return 'ep:folder'
    case 'document': return 'ep:document'
    case 'part': return 'ep:tools'
    case 'version': return 'ep:document'
    case 'dataset': return 'ep:grid'
    default: return 'ep:document'
  }
}

const getTypeName = (type: ObjectType): string => {
  switch (type) {
    case 'folder': return '文件夹'
    case 'document': return '文档'
    case 'part': return '零件'
    case 'version': return '版本'
    case 'dataset': return '数据集'
    default: return '未知'
  }
}

const handlePaste = (item: ClipboardItem) => {
  console.log('粘贴:', item)
}

const handleRemove = (item: ClipboardItem) => {
  console.log('移除:', item)
}

const handleClearAll = () => {
  console.log('清空剪切板')
}
</script>

<style lang="scss" scoped>
.clipboard-list {
  padding: 16px;
  
  .clipboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .clipboard-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  
  .item-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .item-icon {
      color: var(--el-color-primary);
    }
    
    .operation-tag {
      margin-left: 8px;
    }
  }
}
</style>