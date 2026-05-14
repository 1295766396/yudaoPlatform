export type ObjectType = 'folder' | 'document' | 'part' | 'version' | 'dataset' | 'file' | 'quick-access' | 'dynamic-folder'

export type QuickAccessType = 'recent' | 'favorite' | 'clipboard'

export type ObjectStatus = 'draft' | 'designing' | 'published' | 'archived'

export interface FileNode {
  id: string
  name: string
  type: ObjectType
  subType?: string
  status?: ObjectStatus
  version?: string
  isCurrent?: boolean
  fileCount?: number
  children?: FileNode[]
  quickAccessType?: QuickAccessType
}

export interface FileProperty {
  label: string
  value: string
}

export interface ContextMenuNode {
  id?: string
  label?: string
  icon?: string
  children?: ContextMenuNode[]
  divider?: boolean
}

export interface FileItem {
  id: string
  name: string
  size: number
  sizeText: string
  createTime: string
  downloadUrl?: string
}

export interface AuditLog {
  time: string
  action: string
  operator: string
}

export interface ImpactItem {
  type: string
  name: string
  bomType?: string
}

export interface RecentItem {
  id: string
  name: string
  type: ObjectType
  path: string
  accessTime: string
  operator: string
}

export interface FavoriteItem {
  id: string
  name: string
  type: ObjectType
  path: string
  addTime: string
  operator: string
}

export interface ClipboardItem {
  id: string
  name: string
  type: ObjectType
  operation: 'copy' | 'cut'
  sourcePath: string
  copyTime: string
  operator: string
}

export interface DynamicFolder {
  id: string
  name: string
  description: string
  itemCount: number
  updateTime: string
}

export const fileTreeMock: FileNode[] = [
  {
    id: 'home',
    name: 'Home',
    type: 'folder',
    children: [
      {
        id: 'folder-new-stuff',
        name: 'NEW STUFF',
        type: 'folder'
      },
      {
        id: 'folder-project-a',
        name: '项目A',
        type: 'folder',
        children: [
          {
            id: 'folder-assembly',
            name: '总成零件',
            type: 'folder',
            children: [
              {
                id: 'part-bracket',
                name: '支架_A',
                type: 'part',
                subType: '自制件',
                version: 'A.1',
                status: 'published',
                children: [
                  {
                    id: 'part-bracket-v1',
                    name: 'A.1',
                    type: 'version',
                    status: 'published',
                    isCurrent: true,
                    children: [
                      {
                        id: 'dataset-bracket-catpart',
                        name: 'CATPart文件',
                        type: 'dataset',
                        fileCount: 2
                      },
                      {
                        id: 'dataset-bracket-doc',
                        name: '参考文档',
                        type: 'dataset',
                        fileCount: 1
                      }
                    ]
                  },
                  {
                    id: 'part-bracket-v0',
                    name: 'A.0',
                    type: 'version',
                    status: 'designing',
                    children: [
                      {
                        id: 'dataset-bracket-v0-files',
                        name: '原始数据',
                        type: 'dataset',
                        fileCount: 1
                      }
                    ]
                  }
                ]
              },
              {
                id: 'part-assembly',
                name: '总成_B',
                type: 'part',
                subType: '装配',
                version: 'A.0',
                status: 'designing',
                children: [
                  {
                    id: 'part-assembly-v0',
                    name: 'A.0',
                    type: 'version',
                    status: 'designing',
                    isCurrent: true
                  }
                ]
              }
            ]
          },
          {
            id: 'folder-docs',
            name: '参考文档',
            type: 'folder',
            children: [
              {
                id: 'doc-spec',
                name: '设计说明书',
                type: 'document',
                subType: 'PRD',
                version: 'B.0',
                status: 'published',
                children: [
                  {
                    id: 'doc-spec-v1',
                    name: 'B.0',
                    type: 'version',
                    status: 'published',
                    isCurrent: true,
                    children: [
                      {
                        id: 'dataset-spec-files',
                        name: '文档附件',
                        type: 'dataset',
                        fileCount: 1
                      }
                    ]
                  },
                  {
                    id: 'doc-spec-v0',
                    name: 'A.0',
                    type: 'version',
                    status: 'designing'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'folder-project-b',
        name: '项目B',
        type: 'folder',
        children: [
          {
            id: 'part-engine',
            name: '发动机总成',
            type: 'part',
            subType: '装配',
            version: 'A.2',
            status: 'published',
            children: [
              {
                id: 'part-engine-v2',
                name: 'A.2',
                type: 'version',
                status: 'published',
                isCurrent: true,
                children: [
                  {
                    id: 'dataset-engine-main',
                    name: '主模型',
                    type: 'dataset',
                    fileCount: 3
                  }
                ]
              },
              {
                id: 'part-engine-v1',
                name: 'A.1',
                type: 'version',
                status: 'designing'
              },
              {
                id: 'part-engine-v0',
                name: 'A.0',
                type: 'version',
                status: 'archived'
              }
            ]
          },
          {
            id: 'dataset-test',
            name: '测试数据',
            type: 'dataset',
            fileCount: 5
          }
        ]
      },
      {
        id: 'doc-report',
        name: '项目总结报告',
        type: 'document',
        subType: 'Report',
        version: 'A.0',
        status: 'draft',
        children: [
          {
            id: 'doc-report-v0',
            name: 'A.0',
            type: 'version',
            status: 'draft',
            isCurrent: true
          }
        ]
      }
    ]
  },
  {
    id: 'share',
    name: 'SHARE',
    type: 'folder',
    children: [
      {
        id: 'folder-shared-with-me',
        name: '与我共享',
        type: 'folder'
      },
      {
        id: 'folder-shared-by-me',
        name: '我共享给别人',
        type: 'folder'
      }
    ]
  }
]

export const filePropertiesMock: Record<string, FileProperty[]> = {
  home: [
    { label: '编号', value: 'HOME' },
    { label: '对象名称', value: 'Home' },
    { label: '对象类型', value: '目录' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: 'system' },
    { label: '创建时间', value: '2026-05-06 10:20:21' },
    { label: '更新人', value: 'system' },
    { label: '更新时间', value: '2026-05-06 10:20:21' },
    { label: '路径', value: '/Home' }
  ],
  'folder-new-stuff': [
    { label: '编号', value: 'NEW-STUFF' },
    { label: '对象名称', value: 'NEW STUFF' },
    { label: '对象类型', value: '文件夹' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: 'system' },
    { label: '创建时间', value: '2026-05-14 09:00:00' },
    { label: '更新人', value: 'system' },
    { label: '更新时间', value: '2026-05-14 09:00:00' },
    { label: '路径', value: '/Home/NEW STUFF' }
  ],
  share: [
    { label: '编号', value: 'SHARE' },
    { label: '对象名称', value: 'SHARE' },
    { label: '对象类型', value: '目录' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: 'system' },
    { label: '创建时间', value: '2026-05-14 09:00:00' },
    { label: '更新人', value: 'system' },
    { label: '更新时间', value: '2026-05-14 09:00:00' },
    { label: '路径', value: '/SHARE' }
  ],
  'folder-shared-with-me': [
    { label: '编号', value: 'SHARED-WITH-ME' },
    { label: '对象名称', value: '与我共享' },
    { label: '对象类型', value: '文件夹' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: 'system' },
    { label: '创建时间', value: '2026-05-14 09:00:00' },
    { label: '更新人', value: 'system' },
    { label: '更新时间', value: '2026-05-14 09:00:00' },
    { label: '路径', value: '/SHARE/与我共享' }
  ],
  'folder-shared-by-me': [
    { label: '编号', value: 'SHARED-BY-ME' },
    { label: '对象名称', value: '我共享给别人' },
    { label: '对象类型', value: '文件夹' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: 'system' },
    { label: '创建时间', value: '2026-05-14 09:00:00' },
    { label: '更新人', value: 'system' },
    { label: '更新时间', value: '2026-05-14 09:00:00' },
    { label: '路径', value: '/SHARE/我共享给别人' }
  ],
  'folder-project-a': [
    { label: '编号', value: 'FOLDER-PA' },
    { label: '对象名称', value: '项目A' },
    { label: '对象类型', value: '文件夹' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: '李工程师' },
    { label: '创建时间', value: '2026-05-10 09:30:00' },
    { label: '更新人', value: '李工程师' },
    { label: '更新时间', value: '2026-05-12 14:15:00' },
    { label: '路径', value: '/Home/项目A' }
  ],
  'folder-assembly': [
    { label: '编号', value: 'FOLDER-ASM' },
    { label: '对象名称', value: '总成零件' },
    { label: '对象类型', value: '文件夹' },
    { label: '状态', value: '工作中' },
    { label: '创建人', value: '李工程师' },
    { label: '创建时间', value: '2026-05-11 10:00:00' },
    { label: '更新人', value: '李工程师' },
    { label: '更新时间', value: '2026-05-11 10:00:00' },
    { label: '路径', value: '/Home/项目A/总成零件' }
  ],
  'part-bracket': [
    { label: '编号', value: 'PART-001' },
    { label: '对象名称', value: '支架_A' },
    { label: '对象类型', value: '零件' },
    { label: '零件类型', value: '自制件' },
    { label: '当前版本', value: 'A.1' },
    { label: '状态', value: '已发布' },
    { label: '材料', value: '铝合金' },
    { label: '重量', value: '2.5 kg' },
    { label: '创建人', value: '李工程师' },
    { label: '创建时间', value: '2026-05-10 11:00:00' },
    { label: '更新人', value: '王工程师' },
    { label: '更新时间', value: '2026-05-12 15:30:00' }
  ],
  'part-bracket-v1': [
    { label: '版本号', value: 'A.1' },
    { label: '对象名称', value: '支架_A - A.1' },
    { label: '对象类型', value: '版本' },
    { label: '状态', value: '已发布' },
    { label: '是否当前版本', value: '是' },
    { label: '创建人', value: '王工程师' },
    { label: '创建时间', value: '2026-05-12 15:30:00' }
  ],
  'dataset-bracket-catpart': [
    { label: '编号', value: 'DS-CAT-001' },
    { label: '对象名称', value: 'CATPart文件' },
    { label: '对象类型', value: '数据集' },
    { label: '文件数量', value: '2' },
    { label: '总大小', value: '3.7 MB' },
    { label: '关联版本', value: '支架_A - A.1' },
    { label: '创建人', value: '王工程师' },
    { label: '创建时间', value: '2026-05-12 16:00:00' }
  ],
  'doc-spec': [
    { label: '编号', value: 'DOC-SPEC-001' },
    { label: '对象名称', value: '设计说明书' },
    { label: '对象类型', value: '文档' },
    { label: '文档类型', value: 'PRD' },
    { label: '当前版本', value: 'B.0' },
    { label: '状态', value: '已发布' },
    { label: '创建人', value: '张工程师' },
    { label: '创建时间', value: '2026-05-08 09:00:00' },
    { label: '更新人', value: '张工程师' },
    { label: '更新时间', value: '2026-05-11 14:00:00' }
  ],
  'part-assembly': [
    { label: '编号', value: 'PART-002' },
    { label: '对象名称', value: '总成_B' },
    { label: '对象类型', value: '零件' },
    { label: '零件类型', value: '装配' },
    { label: '当前版本', value: 'A.0' },
    { label: '状态', value: '设计中' },
    { label: '材料', value: '钢材' },
    { label: '重量', value: '15.8 kg' },
    { label: '创建人', value: '李工程师' },
    { label: '创建时间', value: '2026-05-11 14:00:00' },
    { label: '更新人', value: '李工程师' },
    { label: '更新时间', value: '2026-05-11 14:00:00' }
  ],
  'part-engine': [
    { label: '编号', value: 'PART-003' },
    { label: '对象名称', value: '发动机总成' },
    { label: '对象类型', value: '零件' },
    { label: '零件类型', value: '装配' },
    { label: '当前版本', value: 'A.2' },
    { label: '状态', value: '已发布' },
    { label: '材料', value: '铸铁+铝合金' },
    { label: '重量', value: '150.5 kg' },
    { label: '创建人', value: '赵工程师' },
    { label: '创建时间', value: '2026-05-05 08:00:00' },
    { label: '更新人', value: '赵工程师' },
    { label: '更新时间', value: '2026-05-13 10:00:00' }
  ],
  'doc-report': [
    { label: '编号', value: 'DOC-RPT-001' },
    { label: '对象名称', value: '项目总结报告' },
    { label: '对象类型', value: '文档' },
    { label: '文档类型', value: 'Report' },
    { label: '当前版本', value: 'A.0' },
    { label: '状态', value: '草稿' },
    { label: '创建人', value: '孙工程师' },
    { label: '创建时间', value: '2026-05-13 09:00:00' },
    { label: '更新人', value: '孙工程师' },
    { label: '更新时间', value: '2026-05-13 09:00:00' }
  ],
  'dataset-test': [
    { label: '编号', value: 'DS-TST-001' },
    { label: '对象名称', value: '测试数据' },
    { label: '对象类型', value: '数据集' },
    { label: '文件数量', value: '5' },
    { label: '总大小', value: '12.3 MB' },
    { label: '关联版本', value: '无（独立数据集）' },
    { label: '创建人', value: '孙工程师' },
    { label: '创建时间', value: '2026-05-13 11:00:00' }
  ]
}

export const filesMock: Record<string, FileItem[]> = {
  'dataset-bracket-catpart': [
    { id: 'file-1', name: '支架_A.CATPart', size: 2500000, sizeText: '2.5 MB', createTime: '2026-05-12 16:00:00' },
    { id: 'file-2', name: '支架_A.DXF', size: 1200000, sizeText: '1.2 MB', createTime: '2026-05-12 16:05:00' }
  ],
  'dataset-bracket-doc': [
    { id: 'file-3', name: '设计规范.pdf', size: 800000, sizeText: '0.8 MB', createTime: '2026-05-12 16:10:00' }
  ],
  'dataset-bracket-v0-files': [
    { id: 'file-4', name: '支架_A_v0.CATPart', size: 2200000, sizeText: '2.2 MB', createTime: '2026-05-10 11:30:00' }
  ],
  'dataset-spec-files': [
    { id: 'file-5', name: '设计说明书_B.0.pdf', size: 1500000, sizeText: '1.5 MB', createTime: '2026-05-11 14:00:00' }
  ],
  'dataset-engine-main': [
    { id: 'file-6', name: '发动机.CATProduct', size: 5000000, sizeText: '5.0 MB', createTime: '2026-05-13 10:00:00' },
    { id: 'file-7', name: '缸体.CATPart', size: 3500000, sizeText: '3.5 MB', createTime: '2026-05-13 10:05:00' },
    { id: 'file-8', name: '缸盖.CATPart', size: 2800000, sizeText: '2.8 MB', createTime: '2026-05-13 10:10:00' }
  ],
  'dataset-test': [
    { id: 'file-9', name: 'test_data_01.xlsx', size: 2000000, sizeText: '2.0 MB', createTime: '2026-05-13 11:00:00' },
    { id: 'file-10', name: 'test_data_02.xlsx', size: 3500000, sizeText: '3.5 MB', createTime: '2026-05-13 11:05:00' },
    { id: 'file-11', name: 'report.pdf', size: 1800000, sizeText: '1.8 MB', createTime: '2026-05-13 11:10:00' },
    { id: 'file-12', name: 'images.zip', size: 4500000, sizeText: '4.5 MB', createTime: '2026-05-13 11:15:00' },
    { id: 'file-13', name: 'readme.txt', size: 50000, sizeText: '50 KB', createTime: '2026-05-13 11:20:00' }
  ]
}

export const auditLogsMock: Record<string, AuditLog[]> = {
  'part-bracket': [
    { time: '2026-05-12 15:30:00', action: '版本升版：A.0 → A.1', operator: '王工程师' },
    { time: '2026-05-12 16:00:00', action: '上传文件：支架_A.CATPart', operator: '王工程师' },
    { time: '2026-05-10 11:00:00', action: '创建零件：支架_A', operator: '李工程师' }
  ],
  'doc-spec': [
    { time: '2026-05-11 14:00:00', action: '版本升版：A.0 → B.0', operator: '张工程师' },
    { time: '2026-05-11 14:05:00', action: '上传文件：设计说明书_B.0.pdf', operator: '张工程师' },
    { time: '2026-05-08 09:00:00', action: '创建文档：设计说明书', operator: '张工程师' }
  ],
  'part-engine': [
    { time: '2026-05-13 10:00:00', action: '版本升版：A.1 → A.2', operator: '赵工程师' },
    { time: '2026-05-12 09:00:00', action: '版本升版：A.0 → A.1', operator: '赵工程师' },
    { time: '2026-05-05 08:00:00', action: '创建零件：发动机总成', operator: '赵工程师' }
  ]
}

export const impactAnalysisMock: Record<string, ImpactItem[]> = {
  'part-bracket': [
    { type: 'BOM引用', name: '总成_A', bomType: 'EBOM' },
    { type: 'BOM引用', name: '总成_B', bomType: 'MBOM' },
    { type: '关联文档', name: '设计说明书' }
  ],
  'part-engine': [
    { type: 'BOM引用', name: '整车装配', bomType: 'EBOM' },
    { type: '关联文档', name: '发动机设计规范' }
  ]
}

export const folderContextMenuMock: ContextMenuNode[] = [
  { id: 'open', label: '打开' },
  { divider: true },
  {
    id: 'new',
    label: '新建',
    children: [
      { id: 'new-folder', label: '文件夹' },
      {
        id: 'new-document',
        label: '文档',
        children: [
          { id: 'new-doc-sor', label: 'SOR' },
          { id: 'new-doc-brd', label: 'BRD' },
          { id: 'new-doc-prd', label: 'PRD' },
          { id: 'new-doc-report', label: 'Report' }
        ]
      },
      {
        id: 'new-part',
        label: '零件',
        children: [
          { id: 'new-part-assembly', label: '装配' },
          { id: 'new-part-part', label: '零件' }
        ]
      },
      {
        id: 'new-dataset',
        label: '数据集',
        children: [
          { id: 'new-ds-catpart', label: 'CATPart' },
          { id: 'new-ds-catproduct', label: 'CATProduct' },
          { id: 'new-ds-pdf', label: 'PDF' },
          { id: 'new-ds-excel', label: 'Excel' },
          { id: 'new-ds-word', label: 'Word' },
          { id: 'new-ds-ppt', label: 'PPT' },
          { id: 'new-ds-zip', label: 'ZIP' }
        ]
      }
    ]
  },
  { divider: true },
  { id: 'rename', label: '重命名' },
  { id: 'copy', label: '复制' },
  { id: 'cut', label: '剪切' },
  { id: 'paste', label: '粘贴' },
  { divider: true },
  { id: 'delete', label: '删除' },
  { divider: true },
  { id: 'properties', label: '属性' }
]

export const documentPartContextMenuMock: ContextMenuNode[] = [
  { id: 'open', label: '打开（展开版本）' },
  { divider: true },
  {
    id: 'new',
    label: '新建',
    children: [
      { id: 'new-folder', label: '文件夹' },
      {
        id: 'new-document',
        label: '文档',
        children: [
          { id: 'new-doc-sor', label: 'SOR' },
          { id: 'new-doc-brd', label: 'BRD' },
          { id: 'new-doc-prd', label: 'PRD' },
          { id: 'new-doc-report', label: 'Report' }
        ]
      },
      {
        id: 'new-part',
        label: '零件',
        children: [
          { id: 'new-part-assembly', label: '装配' },
          { id: 'new-part-part', label: '零件' }
        ]
      },
      {
        id: 'new-dataset',
        label: '数据集',
        children: [
          { id: 'new-ds-catpart', label: 'CATPart' },
          { id: 'new-ds-catproduct', label: 'CATProduct' },
          { id: 'new-ds-pdf', label: 'PDF' },
          { id: 'new-ds-excel', label: 'Excel' }
        ]
      }
    ]
  },
  { divider: true },
  { id: 'rename', label: '重命名' },
  { id: 'copy', label: '复制' },
  { id: 'cut', label: '剪切' },
  { divider: true },
  { id: 'delete', label: '删除' },
  { divider: true },
  { id: 'properties', label: '属性' }
]

export const versionContextMenuMock: ContextMenuNode[] = [
  { id: 'open', label: '打开' },
  { divider: true },
  { id: 'add-dataset', label: '添加数据集' },
  { divider: true },
  { id: 'upgrade', label: '升版' },
  { id: 'copy-properties', label: '复制属性' },
  { divider: true },
  { id: 'rename', label: '重命名' },
  { id: 'cut', label: '剪切' },
  { divider: true },
  { id: 'delete', label: '删除' },
  { divider: true },
  { id: 'properties', label: '属性' }
]

export const datasetContextMenuMock: ContextMenuNode[] = [
  { id: 'open', label: '打开（查看文件）' },
  { divider: true },
  { id: 'upload', label: '上传文件' },
  { divider: true },
  { id: 'rename', label: '重命名' },
  { id: 'copy', label: '复制' },
  { id: 'cut', label: '剪切' },
  { divider: true },
  { id: 'delete', label: '删除' },
  { divider: true },
  { id: 'properties', label: '属性' }
]

export const documentTypes = ['SOR', 'BRD', 'PRD', 'Report']
export const partTypes = ['装配', '零件']
export const datasetTypes = ['PPT', 'Excel', 'Word', 'PDF', 'CATProduct', 'CATPart', 'ZIP']

export const recentItemsMock: RecentItem[] = [
  {
    id: 'recent-1',
    name: '支架_A',
    type: 'part',
    path: '/Home/项目A/总成零件/支架_A',
    accessTime: '2026-05-14 10:30:00',
    operator: '王工程师'
  },
  {
    id: 'recent-2',
    name: '设计说明书',
    type: 'document',
    path: '/Home/项目A/参考文档/设计说明书',
    accessTime: '2026-05-14 09:45:00',
    operator: '张工程师'
  },
  {
    id: 'recent-3',
    name: '发动机总成',
    type: 'part',
    path: '/Home/项目B/发动机总成',
    accessTime: '2026-05-13 16:20:00',
    operator: '赵工程师'
  },
  {
    id: 'recent-4',
    name: '项目总结报告',
    type: 'document',
    path: '/Home/项目总结报告',
    accessTime: '2026-05-13 14:10:00',
    operator: '孙工程师'
  },
  {
    id: 'recent-5',
    name: '总成_B',
    type: 'part',
    path: '/Home/项目A/总成零件/总成_B',
    accessTime: '2026-05-13 11:00:00',
    operator: '李工程师'
  }
]

export const favoriteItemsMock: FavoriteItem[] = [
  {
    id: 'favorite-1',
    name: '支架_A',
    type: 'part',
    path: '/Home/项目A/总成零件/支架_A',
    addTime: '2026-05-10 11:30:00',
    operator: '王工程师'
  },
  {
    id: 'favorite-2',
    name: '设计说明书',
    type: 'document',
    path: '/Home/项目A/参考文档/设计说明书',
    addTime: '2026-05-08 10:00:00',
    operator: '张工程师'
  },
  {
    id: 'favorite-3',
    name: '发动机总成',
    type: 'part',
    path: '/Home/项目B/发动机总成',
    addTime: '2026-05-05 09:15:00',
    operator: '赵工程师'
  }
]

export const clipboardItemsMock: ClipboardItem[] = [
  {
    id: 'clipboard-1',
    name: '支架_A',
    type: 'part',
    operation: 'copy',
    sourcePath: '/Home/项目A/总成零件',
    copyTime: '2026-05-14 10:25:00',
    operator: '王工程师'
  },
  {
    id: 'clipboard-2',
    name: '设计说明书_B.0.pdf',
    type: 'file',
    operation: 'cut',
    sourcePath: '/Home/项目A/参考文档/设计说明书/B.0/文档附件',
    copyTime: '2026-05-13 15:30:00',
    operator: '张工程师'
  }
]

export const dynamicFoldersMock: DynamicFolder[] = [
  {
    id: 'dynamic-1',
    name: '我的工作项',
    description: '包含所有分配给我的工作项',
    itemCount: 12,
    updateTime: '2026-05-14 10:00:00'
  },
  {
    id: 'dynamic-2',
    name: '本周修改',
    description: '本周内有过修改的文件',
    itemCount: 8,
    updateTime: '2026-05-14 09:00:00'
  },
  {
    id: 'dynamic-3',
    name: '待审批',
    description: '需要我审批的文件',
    itemCount: 3,
    updateTime: '2026-05-13 16:00:00'
  }
]

export const navigationTreeMock: FileNode[] = [
  {
    id: 'nav-my-work',
    name: '我的工作',
    type: 'folder',
    children: [
      {
        id: 'home',
        name: 'Home',
        type: 'folder'
      },
      {
        id: 'share',
        name: 'SHARE',
        type: 'folder'
      }
    ]
  },
  {
    id: 'nav-quick-access',
    name: '快捷访问',
    type: 'folder',
    children: [
      {
        id: 'quick-recent',
        name: '我访问过的',
        type: 'quick-access',
        quickAccessType: 'recent'
      },
      {
        id: 'quick-favorite',
        name: '我收藏的',
        type: 'quick-access',
        quickAccessType: 'favorite'
      },
      {
        id: 'quick-clipboard',
        name: '剪切板',
        type: 'quick-access',
        quickAccessType: 'clipboard'
      }
    ]
  },
  {
    id: 'nav-dynamic-folders',
    name: '动态文件夹',
    type: 'folder',
    children: [
      {
        id: 'dynamic-1',
        name: '我的工作项',
        type: 'dynamic-folder'
      },
      {
        id: 'dynamic-2',
        name: '本周修改',
        type: 'dynamic-folder'
      },
      {
        id: 'dynamic-3',
        name: '待审批',
        type: 'dynamic-folder'
      }
    ]
  }
]
