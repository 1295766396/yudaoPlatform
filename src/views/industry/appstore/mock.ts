export type AppStatus = 'not_installed' | 'installing' | 'installed' | 'updating' | 'has_update'

export type AppCategory = 'CATIA' | 'PDQ' | 'ENV' | 'CONVERT' | 'CLIENT_ENV' | 'CAD_CARTIER' | 'PDK' | 'ALL'

export interface App {
  id: string
  name: string
  description: string
  category: AppCategory
  icon: string
  version: string
  status: AppStatus
  installCount: number
  rating: number
  author: string
  updateTime: string
  isOfficial?: boolean
}

export interface AppDetail extends App {
  introduction: string
  features: string[]
  screenshots: string[]
  versions: AppVersion[]
}

export interface AppVersion {
  version: string
  updateTime: string
  updateLog: string
  isLatest?: boolean
}

export const appCategories: { value: AppCategory, label: string }[] = [
  { value: 'ALL', label: '全部' },
  { value: 'CATIA', label: 'CATIA工具' },
  { value: 'PDQ', label: 'PDQ质检' },
  { value: 'ENV', label: '环境配置' },
  { value: 'CONVERT', label: '数据转换' },
  { value: 'CLIENT_ENV', label: '客户端环境管理器' },
  { value: 'CAD_CARTIER', label: 'CAD集成工具（卡提尔）' },
  { value: 'PDK', label: '质量检查工具（PDK）' }
]

export const apps: App[] = [
  {
    id: 'app-1',
    name: 'CATIA集成客户端',
    description: 'CATIA V5/V6与平台深度集成，文件一键打开/保存回传',
    category: 'CATIA',
    icon: 'ep:platform',
    version: 'v2.1.0',
    status: 'has_update',
    installCount: 1200,
    rating: 4.8,
    author: '官方开发组',
    updateTime: '2026-05-01',
    isOfficial: true
  },
  {
    id: 'app-2',
    name: 'PDQ自动检测工具',
    description: '自动化产品数据质量检查，支持自定义规则',
    category: 'PDQ',
    icon: 'ep:check',
    version: 'v3.2.1',
    status: 'installed',
    installCount: 2400,
    rating: 4.9,
    author: '官方开发组',
    updateTime: '2026-05-10',
    isOfficial: true
  },
  {
    id: 'app-3',
    name: 'CATIA环境配置器',
    description: '统一管理CATIA运行环境、许可证配置',
    category: 'ENV',
    icon: 'ep:setting',
    version: 'v1.5.0',
    status: 'installed',
    installCount: 876,
    rating: 4.7,
    author: '官方开发组',
    updateTime: '2026-04-20',
    isOfficial: true
  },
  {
    id: 'app-4',
    name: '工程图转换器',
    description: 'DWG/DXF图纸与CATIA图纸格式互转',
    category: 'CONVERT',
    icon: 'ep:document',
    version: 'v1.3.2',
    status: 'not_installed',
    installCount: 654,
    rating: 4.6,
    author: '第三方团队',
    updateTime: '2026-05-08'
  },
  {
    id: 'app-5',
    name: 'CATIA零件库',
    description: '标准件、常用件库快速调用',
    category: 'CATIA',
    icon: 'ep:box',
    version: 'v2.0.0',
    status: 'not_installed',
    installCount: 320,
    rating: 4.5,
    author: '第三方团队',
    updateTime: '2026-05-05'
  },
  {
    id: 'app-6',
    name: 'PDQ规则编辑器',
    description: '可视化规则编辑、自定义检查逻辑',
    category: 'PDQ',
    icon: 'ep:edit',
    version: 'v1.8.0',
    status: 'installing',
    installCount: 450,
    rating: 4.4,
    author: '官方开发组',
    updateTime: '2026-04-25',
    isOfficial: true
  },
  {
    id: 'app-7',
    name: '轻量化模型查看器',
    description: '无需CATIA环境直接查看三维模型',
    category: 'CATIA',
    icon: 'ep:view',
    version: 'v1.2.0',
    status: 'not_installed',
    installCount: 780,
    rating: 4.6,
    author: '第三方团队',
    updateTime: '2026-05-12'
  },
  {
    id: 'app-8',
    name: '版本管理器',
    description: 'CATIA文件版本管理与备份',
    category: 'CATIA',
    icon: 'ep:refresh-left',
    version: 'v1.0.0',
    status: 'not_installed',
    installCount: 230,
    rating: 4.3,
    author: '第三方团队',
    updateTime: '2026-05-03'
  },
  {
    id: 'app-9',
    name: '客户端环境管理器',
    description: '统一管理设计客户端环境配置、权限和插件',
    category: 'CLIENT_ENV',
    icon: 'ep:monitor',
    version: 'v2.3.0',
    status: 'has_update',
    installCount: 950,
    rating: 4.7,
    author: '官方开发组',
    updateTime: '2026-05-13',
    isOfficial: true
  },
  {
    id: 'app-10',
    name: '环境配置中心',
    description: '自动检测并修复客户端环境问题',
    category: 'CLIENT_ENV',
    icon: 'ep:tools',
    version: 'v1.2.0',
    status: 'installed',
    installCount: 680,
    rating: 4.6,
    author: '官方开发组',
    updateTime: '2026-05-05',
    isOfficial: true
  },
  {
    id: 'app-11',
    name: '卡提尔CAD集成工具',
    description: '卡提尔CAD与平台深度集成解决方案',
    category: 'CAD_CARTIER',
    icon: 'ep:connection',
    version: 'v3.0.0',
    status: 'not_installed',
    installCount: 420,
    rating: 4.8,
    author: '官方开发组',
    updateTime: '2026-05-12',
    isOfficial: true
  },
  {
    id: 'app-12',
    name: '卡提尔图纸转换器',
    description: '卡提尔图纸格式批量转换工具',
    category: 'CAD_CARTIER',
    icon: 'ep:switch-button',
    version: 'v1.5.0',
    status: 'not_installed',
    installCount: 310,
    rating: 4.5,
    author: '第三方团队',
    updateTime: '2026-05-08'
  },
  {
    id: 'app-13',
    name: 'PDK质量检查工具',
    description: '专业的产品数据质量检查工具，支持PDK标准',
    category: 'PDK',
    icon: 'ep:success-filled',
    version: 'v2.5.0',
    status: 'installed',
    installCount: 1600,
    rating: 4.9,
    author: '官方开发组',
    updateTime: '2026-05-11',
    isOfficial: true
  },
  {
    id: 'app-14',
    name: 'PDK规则库',
    description: 'PDK标准检查规则库，含500+预置规则',
    category: 'PDK',
    icon: 'ep:collection',
    version: 'v1.8.0',
    status: 'installing',
    installCount: 890,
    rating: 4.7,
    author: '官方开发组',
    updateTime: '2026-05-09',
    isOfficial: true
  },
  {
    id: 'app-15',
    name: 'PDK报告生成器',
    description: '自动生成PDK质量检查报告',
    category: 'PDK',
    icon: 'ep:document',
    version: 'v1.1.0',
    status: 'not_installed',
    installCount: 560,
    rating: 4.4,
    author: '第三方团队',
    updateTime: '2026-05-06'
  }
]

export const appDetails: Record<string, AppDetail> = {
  'app-1': {
    id: 'app-1',
    name: 'CATIA集成客户端',
    description: 'CATIA V5/V6与平台深度集成，文件一键打开/保存回传',
    category: 'CATIA',
    icon: 'ep:platform',
    version: 'v2.1.0',
    status: 'has_update',
    installCount: 1200,
    rating: 4.8,
    author: '官方开发组',
    updateTime: '2026-05-01',
    isOfficial: true,
    introduction: 'CATIA集成客户端为您提供与设计平台的无缝对接体验。支持V5/V6多版本兼容，文件自动同步，BOM自动提取等核心功能。',
    features: [
      'CATIA V5/V6多版本兼容',
      '文件一键打开/保存回传',
      'BOM结构自动提取与同步',
      '设计版本自动关联',
      '实时消息推送'
    ],
    screenshots: [
      'screenshot-1.png',
      'screenshot-2.png'
    ],
    versions: [
      {
        version: 'v2.1.0',
        updateTime: '2026-05-01',
        updateLog: '新增V6 R33版本支持',
        isLatest: true
      },
      {
        version: 'v2.0.0',
        updateTime: '2026-03-15',
        updateLog: '重构核心架构，性能提升50%'
      },
      {
        version: 'v1.9.0',
        updateTime: '2026-02-20',
        updateLog: '修复V5R29兼容性问题'
      }
    ]
  }
}
