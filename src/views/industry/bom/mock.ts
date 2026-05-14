export type BOMViewType = 'EBOM' | 'MBOM' | 'DBOM' | 'PBOM'

export type BOMStatus = 'draft' | 'designing' | 'published' | 'archived'

export type DiffType = 'add' | 'delete' | 'modify' | 'move' | 'none'

export interface BOMNode {
  id: string
  name: string
  type: 'assembly' | 'part' | 'standard'
  partNo?: string
  version?: string
  quantity?: number
  unit?: string
  material?: string
  isKey?: boolean
  status?: BOMStatus
  diffType?: DiffType
  children?: BOMNode[]
}

export interface BOMProperty {
  label: string
  value: string | number
  editable?: boolean
  options?: string[]
}

export interface BOMVersion {
  id: string
  version: string
  status: BOMStatus
  createTime: string
  creator: string
  isCurrent?: boolean
}

export interface BOMDiffItem {
  id: string
  name: string
  currentVersion?: string
  compareVersion?: string
  diffType: DiffType
}

export interface BOMHistoryItem {
  version: string
  time: string
  operator: string
  action: string
}

export interface ImpactItem {
  type: string
  name: string
  bomType?: string
}

export const bomList: { id: string; name: string; currentVersion: string }[] = [
  { id: 'bom-001', name: '总成_A', currentVersion: 'A.2' },
  { id: 'bom-002', name: '总成_B', currentVersion: 'A.1' },
  { id: 'bom-003', name: '发动机总成', currentVersion: 'B.0' }
]

export const bomTreeData: BOMNode[] = [
  {
    id: 'root-1',
    name: '总成_A',
    type: 'assembly',
    partNo: 'BOM-001',
    version: 'A.2',
    quantity: 1,
    unit: 'EA',
    status: 'published',
    children: [
      {
        id: 'node-1',
        name: '部件_A1',
        type: 'assembly',
        partNo: 'ASSY-001',
        version: 'B.1',
        quantity: 2,
        unit: 'EA',
        status: 'published',
        children: [
          {
            id: 'node-1-1',
            name: '零件_A11',
            type: 'part',
            partNo: 'PART-001',
            version: 'A.0',
            quantity: 4,
            unit: 'EA',
            material: '铝合金',
            isKey: true,
            status: 'published'
          },
          {
            id: 'node-1-2',
            name: '零件_A12',
            type: 'part',
            partNo: 'PART-002',
            version: 'A.1',
            quantity: 2,
            unit: 'EA',
            material: '钢材',
            status: 'published'
          }
        ]
      },
      {
        id: 'node-2',
        name: '部件_A2',
        type: 'assembly',
        partNo: 'ASSY-002',
        version: 'A.0',
        quantity: 1,
        unit: 'EA',
        status: 'designing',
        children: [
          {
            id: 'node-2-1',
            name: '零件_A21',
            type: 'part',
            partNo: 'PART-003',
            version: 'A.0',
            quantity: 1,
            unit: 'EA',
            material: '铜',
            status: 'designing'
          },
          {
            id: 'node-2-2',
            name: '零件_A22',
            type: 'part',
            partNo: 'PART-004',
            version: 'A.0',
            quantity: 1,
            unit: 'EA',
            material: '钢材',
            status: 'draft'
          }
        ]
      },
      {
        id: 'node-3',
        name: '标准件_A3',
        type: 'standard',
        partNo: 'STD-001',
        version: 'A.0',
        quantity: 8,
        unit: 'EA',
        material: '钢材',
        status: 'published'
      }
    ]
  }
]

export const bomVersions: BOMVersion[] = [
  { id: 'v1', version: 'A.2', status: 'published', createTime: '2026-05-14', creator: '张三', isCurrent: true },
  { id: 'v2', version: 'A.1', status: 'published', createTime: '2026-05-10', creator: '张三' },
  { id: 'v3', version: 'A.0', status: 'archived', createTime: '2026-05-01', creator: '李四' }
]

export const bomPropertyMock: Record<string, BOMProperty[]> = {
  'root-1': [
    { label: 'BOM编号', value: 'BOM-001' },
    { label: 'BOM名称', value: '总成_A' },
    { label: '版本', value: 'A.2' },
    { label: '类型', value: '装配件' },
    { label: '状态', value: '已发布' },
    { label: '创建人', value: '张三' },
    { label: '创建时间', value: '2026-05-14' },
    { label: '更新人', value: '张三' },
    { label: '更新时间', value: '2026-05-14' }
  ],
  'node-1': [
    { label: '零件编号', value: 'ASSY-001' },
    { label: '零件名称', value: '部件_A1' },
    { label: '版本', value: 'B.1' },
    { label: '类型', value: '装配件' },
    { label: '数量', value: 2, editable: true },
    { label: '单位', value: 'EA', editable: true, options: ['EA', 'PCS', 'KG', 'M'] },
    { label: '状态', value: '已发布' },
    { label: '设计者', value: '张三' }
  ],
  'node-1-1': [
    { label: '零件编号', value: 'PART-001' },
    { label: '零件名称', value: '零件_A11' },
    { label: '版本', value: 'A.0' },
    { label: '类型', value: '自制件', editable: true, options: ['自制件', '外购件', '外协件'] },
    { label: '数量', value: 4, editable: true },
    { label: '单位', value: 'EA', editable: true, options: ['EA', 'PCS', 'KG', 'M'] },
    { label: '材料', value: '铝合金', editable: true, options: ['铝合金', '钢材', '铜', '塑料'] },
    { label: '关键件', value: '是', editable: true, options: ['是', '否'] },
    { label: '状态', value: '已发布' },
    { label: '设计者', value: '张三' }
  ]
}

export const bomHistoryMock: Record<string, BOMHistoryItem[]> = {
  'root-1': [
    { version: 'A.2', time: '2026-05-14 10:30', operator: '张三', action: '版本升版' },
    { version: 'A.1', time: '2026-05-10 14:20', operator: '张三', action: '添加部件_A2' },
    { version: 'A.0', time: '2026-05-01 09:00', operator: '李四', action: '创建BOM' }
  ]
}

export const impactAnalysisMock: Record<string, ImpactItem[]> = {
  'node-1-1': [
    { type: 'BOM引用', name: '总成_A', bomType: 'EBOM' },
    { type: 'BOM引用', name: '总成_B', bomType: 'MBOM' },
    { type: '关联文档', name: '设计说明书' }
  ]
}

export const bomDiffData: BOMDiffItem[] = [
  { id: 'diff-1', name: '支架_A', currentVersion: 'A.1', compareVersion: 'A.0', diffType: 'modify' },
  { id: 'diff-2', name: '螺栓_M8', currentVersion: 'A.0', compareVersion: '-', diffType: 'add' },
  { id: 'diff-3', name: '垫片_M8', currentVersion: '-', compareVersion: 'A.0', diffType: 'delete' },
  { id: 'diff-4', name: '螺母_M8', currentVersion: 'A.0', compareVersion: 'A.0', diffType: 'move' },
  { id: 'diff-5', name: '部件_A1', currentVersion: 'B.1', compareVersion: 'B.0', diffType: 'modify' }
]

export const bomDiffStats = {
  add: 5,
  delete: 2,
  modify: 4,
  move: 1
}

export const contextMenuItems = [
  { id: 'add-child', label: '添加子件' },
  { id: 'add-sibling', label: '添加同级' },
  { divider: true },
  { id: 'cut', label: '剪切' },
  { id: 'copy', label: '复制' },
  { id: 'paste', label: '粘贴' },
  { divider: true },
  { id: 'upgrade', label: '升级' },
  { id: 'downgrade', label: '降级' },
  { id: 'move-up', label: '上移' },
  { id: 'move-down', label: '下移' },
  { divider: true },
  { id: 'delete', label: '删除' }
]
