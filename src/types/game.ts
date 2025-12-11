// 游戏核心类型定义

// 职业类型
export enum JobType {
  DEVELOPER = 'developer',
  PRODUCT_MANAGER = 'product_manager',
  TESTER = 'tester',
  SALES = 'sales'
}

// 专精领域
export enum Specialty {
  WEB_FRONTEND = 'web_frontend',
  MOBILE = 'mobile',
  BACKEND = 'backend',
  AI_BIGDATA = 'ai_bigdata',
  GAME = 'game'
}

// 特质类型
export enum TraitType {
  PERFECTIONIST = 'perfectionist',
  FAST_CODER = 'fast_coder',
  MENTOR = 'mentor',
  BUG_MAGNET = 'bug_magnet',
  DETAIL_ORIENTED = 'detail_oriented',
  PRESSURE_DRIVEN = 'pressure_driven',
  STABLE = 'stable'
}

// 特质定义
export interface Trait {
  type: TraitType
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
}

// 项目类型
export enum ProjectType {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  ENTERPRISE_SYSTEM = 'enterprise_system',
  AI_INNOVATION = 'ai_innovation'
}

// 项目阶段
export enum ProjectStage {
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  DELIVERY = 'delivery',
  COMPLETED = 'completed'
}

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
export enum WorkSchedule {
  NORMAL_955 = 'normal_955',
  OT_996 = 'ot_996',
  FLEXIBLE = 'flexible'
}

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
export enum CompanyStage {
  GARAGE = 'garage',
  SMALL_STUDIO = 'small_studio',
  REGULAR_COMPANY = 'regular_company',
  INDUSTRY_LEADER = 'industry_leader'
}

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
export enum EventType {
  OPPORTUNITY = 'opportunity',
  CRISIS = 'crisis',
  MARKET = 'market'
}

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
}

// 常量配置
export const TRAITS: Record<TraitType, Trait> = {
  [TraitType.PERFECTIONIST]: {
    type: TraitType.PERFECTIONIST,
    name: '完美主义',
    description: '质量+30%，效率-20%',
    efficiencyBonus: -0.2,
    qualityBonus: 0.3
  },
  [TraitType.FAST_CODER]: {
    type: TraitType.FAST_CODER,
    name: '快手',
    description: '效率+25%，技术债+40%',
    efficiencyBonus: 0.25,
    qualityBonus: 0,
    techDebtMultiplier: 1.4
  },
  [TraitType.MENTOR]: {
    type: TraitType.MENTOR,
    name: '导师型',
    description: '团队经验+20%，自身效率-10%',
    efficiencyBonus: -0.1,
    qualityBonus: 0,
    experienceBonus: 0.2
  },
  [TraitType.BUG_MAGNET]: {
    type: TraitType.BUG_MAGNET,
    name: 'Bug磁铁',
    description: 'Bug率+30%',
    efficiencyBonus: 0,
    qualityBonus: -0.3
  },
  [TraitType.DETAIL_ORIENTED]: {
    type: TraitType.DETAIL_ORIENTED,
    name: '细节控',
    description: '美观度/合理性+25%，设计耗时+20%',
    efficiencyBonus: 0,
    qualityBonus: 0.25,
    timePenalty: 0.2
  },
  [TraitType.PRESSURE_DRIVEN]: {
    type: TraitType.PRESSURE_DRIVEN,
    name: '压力驱动',
    description: '临近期限效率+40%，平时-10%',
    efficiencyBonus: -0.1,
    qualityBonus: 0
  },
  [TraitType.STABLE]: {
    type: TraitType.STABLE,
    name: '稳定输出',
    description: '效率和质量稳定',
    efficiencyBonus: 0,
    qualityBonus: 0
  }
}

export const WORK_SCHEDULES: Record<WorkSchedule, WorkScheduleConfig> = {
  [WorkSchedule.NORMAL_955]: {
    type: WorkSchedule.NORMAL_955,
    name: '朝九晚五',
    workHours: 9,
    efficiencyMultiplier: 1.0,
    fatiguePerHour: 5,
    satisfactionDelta: 0.2,
    techDebtMultiplier: 1.0
  },
  [WorkSchedule.OT_996]: {
    type: WorkSchedule.OT_996,
    name: '996制度',
    workHours: 12,
    efficiencyMultiplier: 1.25,
    fatiguePerHour: 7,
    satisfactionDelta: -0.5,
    techDebtMultiplier: 1.5
  },
  [WorkSchedule.FLEXIBLE]: {
    type: WorkSchedule.FLEXIBLE,
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
  [CompanyStage.GARAGE]: {
    stage: CompanyStage.GARAGE,
    name: '车库创业',
    maxEmployees: 3,
    unlockedJobs: [JobType.DEVELOPER],
    projectPoolCapacity: 10,
    baseGenerationRate: 0.3,
    monthlyRent: 1000,
    upgradeRequirements: {
      totalRevenue: 50000,
      reputation: 10
    }
  },
  [CompanyStage.SMALL_STUDIO]: {
    stage: CompanyStage.SMALL_STUDIO,
    name: '小型工作室',
    maxEmployees: 6,
    unlockedJobs: [JobType.DEVELOPER, JobType.PRODUCT_MANAGER],
    projectPoolCapacity: 15,
    baseGenerationRate: 0.4,
    monthlyRent: 3000,
    upgradeRequirements: {
      totalRevenue: 200000,
      reputation: 30,
      specificRequirements: '拥有2名产品经理'
    }
  },
  [CompanyStage.REGULAR_COMPANY]: {
    stage: CompanyStage.REGULAR_COMPANY,
    name: '正规公司',
    maxEmployees: 12,
    unlockedJobs: [JobType.DEVELOPER, JobType.PRODUCT_MANAGER, JobType.TESTER],
    projectPoolCapacity: 25,
    baseGenerationRate: 0.5,
    monthlyRent: 8000,
    upgradeRequirements: {
      totalRevenue: 1000000,
      reputation: 70,
      specificRequirements: '技术债<40'
    }
  },
  [CompanyStage.INDUSTRY_LEADER]: {
    stage: CompanyStage.INDUSTRY_LEADER,
    name: '行业标杆',
    maxEmployees: 20,
    unlockedJobs: [JobType.DEVELOPER, JobType.PRODUCT_MANAGER, JobType.TESTER, JobType.SALES],
    projectPoolCapacity: 40,
    baseGenerationRate: 0.6,
    monthlyRent: 20000,
    upgradeRequirements: {
      totalRevenue: Infinity,
      reputation: 90
    }
  }
}

export const JOB_CONFIGS = {
  [JobType.DEVELOPER]: {
    name: '软件开发工程师',
    baseSalary: 300,
    growthRate: 1.15,
    stage: ProjectStage.DEVELOPMENT,
    maxConcurrent: 1
  },
  [JobType.PRODUCT_MANAGER]: {
    name: '产品经理',
    baseSalary: 500,
    growthRate: 1.18,
    stage: ProjectStage.DESIGN,
    maxConcurrent: 1
  },
  [JobType.TESTER]: {
    name: '测试工程师',
    baseSalary: 400,
    growthRate: 1.16,
    stage: ProjectStage.TESTING,
    maxConcurrent: 2
  },
  [JobType.SALES]: {
    name: '售前',
    baseSalary: 600,
    growthRate: 1.20,
    stage: null,
    maxConcurrent: 0
  }
}

export const PROJECT_TYPE_CONFIGS = {
  [ProjectType.WEB_APP]: {
    name: 'Web应用',
    probability: 0.4,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: [Specialty.WEB_FRONTEND, Specialty.BACKEND]
  },
  [ProjectType.MOBILE_APP]: {
    name: '移动应用',
    probability: 0.3,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: [Specialty.MOBILE, Specialty.BACKEND]
  },
  [ProjectType.ENTERPRISE_SYSTEM]: {
    name: '企业系统',
    probability: 0.2,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: [Specialty.BACKEND, Specialty.WEB_FRONTEND]
  },
  [ProjectType.AI_INNOVATION]: {
    name: 'AI/创新项目',
    probability: 0.1,
    budgetBase: 10000,
    deadlineBase: 21,
    specialtyMatch: [Specialty.AI_BIGDATA, Specialty.BACKEND]
  }
}