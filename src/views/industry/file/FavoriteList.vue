<template>
  <div class="favorite-list">
    <el-table :data="favoriteItems" style="width: 100%" stripe>
      <el-table-column prop="name" label="名称" min-width="200">
        <template #default="{ row }">
          <div class="item-name">
            <Icon :icon="getItemIcon(row.type)" :size="16" class="item-icon" />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          {{ getTypeName(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" min-width="300" show-overflow-tooltip />
      <el-table-column prop="addTime" label="收藏时间" width="180" />
      <el-table-column prop="operator" label="收藏者" width="120" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleOpen(row)">
            打开
          </el-button>
          <el-button link type="danger" size="small" @click="handleRemove(row)">
            取消收藏
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { favoriteItemsMock, FavoriteItem, ObjectType } from './mock'

const favoriteItems = computed(() => favoriteItemsMock)

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

const handleOpen = (item: FavoriteItem) => {
  console.log('打开:', item)
}

const handleRemove = (item: FavoriteItem) => {
  console.log('取消收藏:', item)
}
</script>

<style lang="scss" scoped>
.favorite-list {
  padding: 16px;
  
  .item-name {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .item-icon {
      color: var(--el-color-primary);
    }
  }
}
</style>