// 游戏核心类型定义

// 事件日志类别
export type LogCategory = 'money' | 'reputation' | 'employee' | 'project' | 'system' | 'other'

// 事件日志条目
export interface LogEntry {
  id: string
  timestamp: number // 游戏内时间（天数）
  category: LogCategory
  message: string
  details?: string
  moneyChange?: number
  reputationChange?: number
}

// 职业类型
export type JobType = 'developer' | 'product_manager' | 'tester' | 'sales'

// 专精领域
export type Specialty = 'web_frontend' | 'mobile' | 'backend' | 'ai_bigdata' | 'game'

// 特质类型
export type TraitType = 'perfectionist' | 'fast_coder' | 'mentor' | 'bug_magnet' | 'detail_oriented' | 'pressure_driven' | 'stable'

// 特质定义
export interface Trait {
  name: string
  description: string
  efficiencyBonus: number
  qualityBonus: number
  techDebtMultiplier?: number
  experienceBonus?: number
  timePenalty?: number
}

// 员工状态
export interface Employee {
  id: string
  name: string
  jobType: JobType
  level: number
  experience: number
  specialties: Specialty[]
  baseEfficiency: number // 0.8-1.5
  qualityFactor: number // 0.7-1.3
  satisfaction: number // 0-100
  fatigue: number // 0-100
  salary: number
  traits: TraitType[]
  currentProjectId?: string
  hireDate: number
  isWorking: boolean // 是否投入工作（仅对产品经理和测试工程师有效）
}

// 项目类型
export type ProjectType = 'web_app' | 'mobile_app' | 'enterprise_system' | 'ai_innovation'

// 项目阶段
export type ProjectStage = 'design' | 'development' | 'testing' | 'delivery' | 'completed'

// 项目状态
export interface Project {
  id: string
  type: ProjectType
  budget: number
  deadline: number // 天数
  complexity: number // 3-9
  clarityLevel: number // 5-9
  stage: ProjectStage
  stageProgress: number // 0-1
  stageStartTime: number
  
  // 设计阶段产出
  rationality?: number
  aesthetics?: number
  
  // 开发阶段产出
  performance?: number
  functionality?: number
  techDebt: number
  
  // 测试阶段产出
  bugRate?: number
  
  // 交付
  qualityScore?: number
  finalIncome?: number
  
  assignedEmployees: string[] // 员工ID列表
  startDate: number
  isUrgent: boolean
}

// 工作制度
export type WorkSchedule = 'normal_955' | 'ot_996' | 'flexible'

// 工作制度配置
export interface WorkScheduleConfig {
  type: WorkSchedule
  name: string
  workHours: number
  efficiencyMultiplier: number
  fatiguePerHour: number
  satisfactionDelta: number
  techDebtMultiplier: number
  experienceBonus?: number
}

// 公司阶段
export type CompanyStage = 'garage' | 'small_studio' | 'regular_company' | 'industry_leader'

// 公司阶段配置
export interface CompanyStageConfig {
  stage: CompanyStage
  name: string
  maxEmployees: number
  unlockedJobs: JobType[]
  projectPoolCapacity: number
  baseGenerationRate: number
  monthlyRent: number
  upgradeRequirements: {
    totalRevenue: number
    reputation: number
    specificRequirements?: string
  }
}

// 事件类型
export type EventType = 'opportunity' | 'crisis' | 'market'

// 事件选项
export interface EventOption {
  text: string
  action: () => void
  requirement?: string
}

// 游戏事件
export interface GameEvent {
  id: string
  type: EventType
  title: string
  description: string
  options: EventOption[]
  triggerCondition?: string
}

// 候选员工
export interface EmployeeCandidate {
  id: string
  name: string
  jobType: JobType
  level: number
  specialties: Specialty[]
  baseEfficiency: number
  qualityFactor: number
  salary: number
  traits: TraitType[]
  isWorking?: boolean // 是否投入工作（默认true）
}

// 游戏状态
export interface GameState {
  // 基础信息
  currentDay: number
  currentTime: number // 小时数 0-23.99
  gameSpeed: number // 0.5, 1, 2, 5
  isPaused: boolean
  
  // 经济
  money: number
  totalRevenue: number
  totalExpense: number
  
  // 公司
  companyName: string
  companyStage: CompanyStage
  reputation: number
  techDebt: number
  workSchedule: WorkSchedule
  
  // 员工和项目
  employees: Employee[]
  projects: Project[]
  projectPool: Project[]
  
  // 统计
  completedProjects: number
  failedProjects: number
  consecutiveOnTimeDeliveries: number
  
  // 事件
  currentEvent?: GameEvent
  
  // 新手引导
  tutorialStep: number
  tutorialCompleted: boolean
  
  // 事件日志
  eventLog: LogEntry[]
  
  // 项目生成进度 (0-1)
  projectGenerationProgress: number
  
  // 最后自动保存天数
  lastAutoSaveDay: number
}

// 常量配置
export const TRAITS: Record<TraitType, Trait> = {
  'perfectionist': {
    name: '完美主义',
    description: '质量+30%，效率-20%',
    efficiencyBonus: -0.2,
    qualityBonus: 0.3
  },
  'fast_coder': {
    name: '快手',
    description: '效率+25%，技术债+40%',
    efficiencyBonus: 0.25,
    qualityBonus: 0,
    techDebtMultiplier: 1.4
  },
  'mentor': {
    name: '导师型',
    description: '团队经验+20%，自身效率-10%',
    efficiencyBonus: -0.1,
    qualityBonus: 0,
    experienceBonus: 0.2
  },
  'bug_magnet': {
    name: 'Bug磁铁',
    description: 'Bug率+30%',
    efficiencyBonus: 0,
    qualityBonus: -0.3
  },
  'detail_oriented': {
    name: '细节控',
    description: '美观度/合理性+25%，设计耗时+20%',
    efficiencyBonus: 0,
    qualityBonus: 0.25,
    timePenalty: 0.2
  },
  'pressure_driven': {
    name: '压力驱动',
    description: '临近期限效率+40%，平时-10%',
    efficiencyBonus: -0.1,
    qualityBonus: 0
  },
  'stable': {
    name: '稳定输出',
    description: '效率和质量稳定',
    efficiencyBonus: 0,
    qualityBonus: 0
  }
}

export const WORK_SCHEDULES: Record<WorkSchedule, WorkScheduleConfig> = {
  'normal_955': {
    type: 'normal_955',
    name: '朝九晚五',
    workHours: 9,
    efficiencyMultiplier: 1.0,
    fatiguePerHour: 5,
    satisfactionDelta: 0.2,
    techDebtMultiplier: 1.0
  },
  'ot_996': {
    type: 'ot_996',
    name: '996制度',
    workHours: 12,
    efficiencyMultiplier: 1.25,
    fatiguePerHour: 7,
    satisfactionDelta: -0.5,
    techDebtMultiplier: 1.5
  },
  'flexible': {
    type: 'flexible',
    name: '弹性工作',
    workHours: 8,
    efficiencyMultiplier: 0.9,
    fatiguePerHour: 4,
    satisfactionDelta: 0.8,
    techDebtMultiplier: 0.8,
    experienceBonus: 0.2
  }
}

export const COMPANY_STAGES: Record<CompanyStage, CompanyStageConfig> = {
  'garage': {
    stage: 'garage',
    name: '车库创业',
    maxEmployees: 3,
    unlockedJobs: ['developer'],
    projectPoolCapacity: 10,
    baseGenerationRate: 0.3,
    monthlyRent: 1000,
    upgradeRequirements: {
      totalRevenue: 50000,
      reputation: 10
    }
  },
  'small_studio': {
    stage: 'small_studio',
    name: '小型工作室',
    maxEmployees: 6,
    unlockedJobs: ['developer', 'product_manager'],
    projectPoolCapacity: 15,
    baseGenerationRate: 0.4,
    monthlyRent: 3000,
    upgradeRequirements: {
      totalRevenue: 200000,
      reputation: 30,
      specificRequirements: '拥有2名产品经理'
    }
  },
  'regular_company': {
    stage: 'regular_company',
    name: '正规公司',
    maxEmployees: 12,
    unlockedJobs: ['developer', 'product_manager', 'tester'],
    projectPoolCapacity: 25,
    baseGenerationRate: 0.5,
    monthlyRent: 8000,
    upgradeRequirements: {
      totalRevenue: 1000000,
      reputation: 70,
      specificRequirements: '技术债<40'
    }
  },
  'industry_leader': {
    stage: 'industry_leader',
    name: '行业标杆',
    maxEmployees: 20,
    unlockedJobs: ['developer', 'product_manager', 'tester', 'sales'],
    projectPoolCapacity: 40,
    baseGenerationRate: 0.6,
    monthlyRent: 20000,
    upgradeRequirements: {
      totalRevenue: Infinity,
      reputation: 90
    }
  }
}

export const JOB_CONFIGS: Record<JobType, any> = {
  'developer': {
    name: '软件开发工程师',
    baseSalary: 300,
    growthRate: 1.15,
    stage: 'development',
    maxConcurrent: 1
  },
  'product_manager': {
    name: '产品经理',
    baseSalary: 500,
    growthRate: 1.18,
    stage: 'design',
    maxConcurrent: 1
  },
  'tester': {
    name: '测试工程师',
    baseSalary: 400,
    growthRate: 1.16,
    stage: 'testing',
    maxConcurrent: 2
  },
  'sales': {
    name: '售前',
    baseSalary: 600,
    growthRate: 1.20,
    stage: null,
    maxConcurrent: 0
  }
}

export const PROJECT_TYPE_CONFIGS: Record<ProjectType, any> = {
  'web_app': {
    name: 'Web应用',
    probability: 0.4,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: ['web_frontend', 'backend']
  },
  'mobile_app': {
    name: '移动应用',
    probability: 0.3,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: ['mobile', 'backend']
  },
  'enterprise_system': {
    name: '企业系统',
    probability: 0.2,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: ['backend', 'web_frontend']
  },
  'ai_innovation': {
    name: 'AI/创新项目',
    probability: 0.1,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: ['ai_bigdata', 'backend']
  }
}