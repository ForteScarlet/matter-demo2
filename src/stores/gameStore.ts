import { defineStore } from 'pinia'
import type {
  GameState,
  Employee,
  Project,
  JobType,
  Specialty,
  TraitType,
  ProjectType,
  ProjectStage,
  WorkSchedule,
  CompanyStage,
  LogEntry,
  LogCategory,
  EmployeeCandidate
} from '../types/game'
import {
  COMPANY_STAGES,
  JOB_CONFIGS,
  PROJECT_TYPE_CONFIGS,
  TRAITS,
  WORK_SCHEDULES
} from '../types/game'

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    currentDay: 1,
    currentTime: 9.0,
    gameSpeed: 1,
    isPaused: false,
    
    money: 30000,
    totalRevenue: 0,
    totalExpense: 0,
    
    companyName: '我的软件公司',
    companyStage: 'garage',
    reputation: 0,
    techDebt: 0,
    workSchedule: 'normal_955',
    
    employees: [],
    projects: [],
    projectPool: [],
    
    completedProjects: 0,
    failedProjects: 0,
    consecutiveOnTimeDeliveries: 0,
    
    tutorialStep: 0,
    tutorialCompleted: false,
    
    eventLog: [],
    projectGenerationProgress: 0,
    lastAutoSaveDay: 0
  }),

  getters: {
    currentStageConfig: (state) => COMPANY_STAGES[state.companyStage],
    
    workScheduleConfig: (state) => WORK_SCHEDULES[state.workSchedule],
    
    isWorkingHours: (state) => {
      const schedule = WORK_SCHEDULES[state.workSchedule]
      const startHour = 9
      const endHour = startHour + schedule.workHours
      return state.currentTime >= startHour && state.currentTime < endHour
    },
    
    availableEmployees: (state) => {
      return state.employees.filter(emp => !emp.currentProjectId)
    },
    
    activeProjects: (state) => {
      return state.projects.filter(p => p.stage !== 'completed')
    },
    
    dailyWageCost: (state) => {
      return state.employees.reduce((sum, emp) => sum + emp.salary, 0)
    },
    
    monthlyRent: (state) => COMPANY_STAGES[state.companyStage].monthlyRent,
    
    projectGenerationRate: (state) => {
      const baseRate = COMPANY_STAGES[state.companyStage].baseGenerationRate
      const salesBonus = state.employees
        .filter(e => e.jobType === 'sales')
        .reduce((sum, emp) => {
          const efficiency = getEmployeeEfficiency(emp, state)
          return sum + efficiency * 0.2
        }, 0)
      return Math.min(baseRate + salesBonus, baseRate + state.employees.filter(e => e.jobType === 'sales').length * 0.6)
    },
    
    projectDigestionRate: (state) => {
      const designers = state.employees.filter(e => e.jobType === 'product_manager')
      const developers = state.employees.filter(e => e.jobType === 'developer')
      const testers = state.employees.filter(e => e.jobType === 'tester')
      
      const avgEfficiency = state.employees.length > 0
        ? state.employees.reduce((sum, emp) => sum + getEmployeeEfficiency(emp, state), 0) / state.employees.length
        : 0
      
      const fatigueImpact = state.employees.length > 0
        ? 1 - (state.employees.reduce((sum, emp) => sum + Math.max(0, (emp.fatigue - 60) * 0.01), 0) / state.employees.length)
        : 1
      
      const techDebtImpact = state.techDebt > 20
        ? 1 - Math.min(0.4, (state.techDebt - 20) * 0.005)
        : 1
      
      const designCapacity = designers.length * 1
      const devCapacity = developers.length * 1
      const testCapacity = testers.length * 2
      
      const bottleneck = Math.min(designCapacity || 999, devCapacity || 999, testCapacity || 999)
      
      return bottleneck * avgEfficiency * fatigueImpact * techDebtImpact
    },
    
    balanceRatio: (state) => {
      const digestion = useGameStore().projectDigestionRate
      const generation = useGameStore().projectGenerationRate
      return generation > 0 ? digestion / generation : 0
    },
    
    canUpgradeStage: (state) => {
      const config = COMPANY_STAGES[state.companyStage]
      const req = config.upgradeRequirements
      
      if (state.totalRevenue < req.totalRevenue) return false
      if (state.reputation < req.reputation) return false
      
      if (state.companyStage === 'small_studio') {
        const pmCount = state.employees.filter(e => e.jobType === 'product_manager').length
        if (pmCount < 2) return false
      }
      
      if (state.companyStage === 'regular_company') {
        if (state.techDebt >= 40) return false
      }
      
      return true
    }
  },

  actions: {
    // 添加日志
    addLog(category: LogCategory, message: string, details?: string, moneyChange?: number, reputationChange?: number) {
      const log: LogEntry = {
        id: `log_${Date.now()}_${Math.random()}`,
        timestamp: this.currentDay + this.currentTime / 24,
        category,
        message,
        details,
        moneyChange,
        reputationChange
      }
      this.eventLog.push(log)
      
      // 限制日志数量，保留最近1000条
      if (this.eventLog.length > 1000) {
        this.eventLog.shift()
      }
    },

    // 修改金钱（带日志）
    changeMoney(amount: number, reason: string) {
      this.money += amount
      if (amount > 0) {
        this.totalRevenue += amount
      } else {
        this.totalExpense += Math.abs(amount)
      }
      this.addLog('money', reason, `${amount > 0 ? '+' : ''}${Math.round(amount)}`, amount)
    },

    // 修改声望（带日志）
    changeReputation(amount: number, reason: string) {
      this.reputation += amount
      this.addLog('reputation', reason, `${amount > 0 ? '+' : ''}${amount}`, undefined, amount)
    },

    // 初始化游戏
    initGame() {
      this.currentDay = 1
      this.currentTime = 9.0
      this.money = 30000
      this.totalRevenue = 0
      this.totalExpense = 0
      this.reputation = 0
      this.techDebt = 0
      this.employees = []
      this.projects = []
      this.projectPool = []
      this.completedProjects = 0
      this.failedProjects = 0
      this.consecutiveOnTimeDeliveries = 0
      this.eventLog = []
      this.projectGenerationProgress = 0
      this.lastAutoSaveDay = 0
      
      // 生成3个初始项目（无初始员工）
      for (let i = 0; i < 3; i++) {
        this.generateProject()
      }
      
      this.addLog('system', '游戏开始', '欢迎来到Coder\'s Paradise！')
    },
    
    // 游戏主循环 (每帧调用，deltaTime是秒数)
    gameTick(deltaTime: number) {
      if (this.isPaused) return
      
      // 游戏速度影响时间流逝：1x = 1秒真实时间 = 1小时游戏时间
      const hoursElapsed = this.gameSpeed * deltaTime
      this.currentTime += hoursElapsed
      
      // 跨天处理
      if (this.currentTime >= 24) {
        this.currentTime -= 24
        this.currentDay++
        this.onNewDay()
      }
      
      // 工作时段处理
      if (this.isWorkingHours) {
        this.processProjects(deltaTime)
        this.updateEmployeeFatigue(deltaTime)
      } else {
        this.recoverEmployeeFatigue(deltaTime)
      }
      
      // 项目生成
      this.tryGenerateProjects(deltaTime)
    },
    
    // 新的一天
    onNewDay() {
      // 结算工资
      const wages = this.dailyWageCost
      if (wages > 0) {
        this.changeMoney(-wages, `工资结算（${this.employees.length}名员工）`)
      }
      
      // 更新满意度
      this.updateEmployeeSatisfaction()
      
      // 检查离职
      this.checkEmployeeResignation()
      
      // 月度租金 (每30天)
      if (this.currentDay % 30 === 0) {
        const rent = this.monthlyRent
        this.changeMoney(-rent, `月度租金（${COMPANY_STAGES[this.companyStage].name}）`)
      }
      
      // 声望衰减
      if (this.consecutiveOnTimeDeliveries > 0 && this.currentDay % 30 === 0) {
        this.consecutiveOnTimeDeliveries = 0
      }
      
      // 每日自动保存
      if (this.currentDay > this.lastAutoSaveDay) {
        this.lastAutoSaveDay = this.currentDay
        // 触发自动保存事件（在GameApp.vue中监听）
        window.dispatchEvent(new CustomEvent('daily-autosave'))
      }
    },
    
    // 生成候选员工（每个职位3个候选人）
    generateEmployeeCandidates(jobType: JobType): EmployeeCandidate[] {
      const config = JOB_CONFIGS[jobType]
      const candidates: EmployeeCandidate[] = []
      
      const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗']
      const secondNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '鹏', '华', '燕']
      
      for (let i = 0; i < 3; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const secondName = secondNames[Math.floor(Math.random() * secondNames.length)]
        
        candidates.push({
          id: `candidate_${Date.now()}_${Math.random()}`,
          name: `${firstName}${secondName}`,
          jobType,
          level: 1,
          specialties: this.randomSpecialties(),
          baseEfficiency: 0.8 + Math.random() * 0.7,
          qualityFactor: 0.7 + Math.random() * 0.6,
          salary: config.baseSalary * (0.9 + Math.random() * 0.4), // 90%-130%
          traits: this.randomTraits()
        })
      }
      
      return candidates
    },

    // 雇佣员工（从候选人中选择）
    hireEmployee(candidate: EmployeeCandidate) {
      const stageConfig = this.currentStageConfig
      
      if (!stageConfig.unlockedJobs.includes(candidate.jobType)) {
        console.error('该职业尚未解锁')
        return null
      }
      
      if (this.employees.length >= stageConfig.maxEmployees) {
        console.error('已达到最大员工数')
        return null
      }
      
      const employee: Employee = {
        id: `emp_${Date.now()}_${Math.random()}`,
        name: candidate.name,
        jobType: candidate.jobType,
        level: candidate.level,
        experience: 0,
        specialties: candidate.specialties,
        baseEfficiency: candidate.baseEfficiency,
        qualityFactor: candidate.qualityFactor,
        satisfaction: 70,
        fatigue: 0,
        salary: candidate.salary,
        traits: candidate.traits,
        hireDate: this.currentDay,
        isWorking: candidate.jobType === 'developer' || candidate.jobType === 'sales' // 开发和售前默认工作中
      }
      
      this.employees.push(employee)
      this.addLog('employee', `雇佣了${JOB_CONFIGS[candidate.jobType].name}：${candidate.name}`, 
        `工资：${Math.round(candidate.salary)}/天`)
      return employee
    },
    
    // 切换员工工作状态
    toggleEmployeeWorkStatus(employeeId: string) {
      const employee = this.employees.find(e => e.id === employeeId)
      if (!employee) return
      
      // 只有产品经理和测试工程师可以切换
      if (employee.jobType !== 'product_manager' && employee.jobType !== 'tester') return
      
      employee.isWorking = !employee.isWorking
      
      // 如果切换为不工作，从所有项目中移除
      if (!employee.isWorking && employee.currentProjectId) {
        this.projects.forEach(p => {
          p.assignedEmployees = p.assignedEmployees.filter(id => id !== employeeId)
        })
        employee.currentProjectId = undefined
      }
      
      this.addLog('employee', `${employee.name}${employee.isWorking ? '投入工作' : '暂离岗位'}`)
    },
    
    // 解雇员工
    fireEmployee(employeeId: string) {
      const index = this.employees.findIndex(e => e.id === employeeId)
      if (index !== -1) {
        const employee = this.employees[index]
        
        // 从项目中移除
        this.projects.forEach(p => {
          p.assignedEmployees = p.assignedEmployees.filter(id => id !== employeeId)
        })
        
        this.employees.splice(index, 1)
        this.addLog('employee', `解雇了${employee.name}`, `职位：${JOB_CONFIGS[employee.jobType].name}`)
      }
    },
    
    // 随机生成专精
    randomSpecialties(): Specialty[] {
      const all: Specialty[] = ['web_frontend', 'mobile', 'backend', 'ai_bigdata', 'game']
      const count = 1 + Math.floor(Math.random() * 3) // 1-3个
      const selected: Specialty[] = []
      
      for (let i = 0; i < count; i++) {
        const spec = all[Math.floor(Math.random() * all.length)]
        if (!selected.includes(spec)) {
          selected.push(spec)
        }
      }
      
      return selected
    },
    
    // 随机生成特质
    randomTraits(): TraitType[] {
      const traits: TraitType[] = []
      const traitCount = Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : 2) : 0
      
      if (traitCount > 0) {
        const allTraits: TraitType[] = ['perfectionist', 'fast_coder', 'mentor', 'bug_magnet', 'detail_oriented', 'pressure_driven', 'stable']
        for (let i = 0; i < traitCount; i++) {
          const trait = allTraits[Math.floor(Math.random() * allTraits.length)]
          if (!traits.includes(trait)) {
            traits.push(trait)
          }
        }
      }
      
      return traits
    },
    
    // 尝试生成项目
    tryGenerateProjects(deltaTime: number) {
      const rate = this.projectGenerationRate
      const progressPerSecond = (rate / 86400) * this.gameSpeed
      
      this.projectGenerationProgress += progressPerSecond * deltaTime
      
      if (this.projectGenerationProgress >= 1) {
        this.projectGenerationProgress = 0
        this.generateProject()
      }
    },
    
    // 生成新项目
    generateProject() {
      const stageConfig = this.currentStageConfig
      
      if (this.projectPool.length >= stageConfig.projectPoolCapacity) {
        // 项目池满，扣除声望
        this.changeReputation(-2, '项目池已满，客户流失')
        return
      }
      
      // 选择项目类型
      const rand = Math.random()
      let cumulativeProb = 0
      let selectedType: ProjectType = 'web_app'
      
      for (const [type, config] of Object.entries(PROJECT_TYPE_CONFIGS)) {
        cumulativeProb += config.probability
        if (rand < cumulativeProb) {
          selectedType = type as ProjectType
          break
        }
      }
      
      const typeConfig = PROJECT_TYPE_CONFIGS[selectedType]
      
      const budget = Math.round(typeConfig.budgetBase * (0.5 + Math.random()))
      const deadline = Math.round(typeConfig.deadlineBase * (0.7 + Math.random() * 0.6))
      
      const project: Project = {
        id: `proj_${Date.now()}_${Math.random()}`,
        type: selectedType,
        budget,
        deadline,
        complexity: 3 + Math.floor(Math.random() * 7),
        clarityLevel: 5 + Math.floor(Math.random() * 5),
        stage: 'design',
        stageProgress: 0,
        stageStartTime: this.currentDay + this.currentTime / 24,
        techDebt: 0,
        assignedEmployees: [],
        startDate: this.currentDay,
        isUrgent: false
      }
      
      this.projectPool.push(project)
      this.projects.push(project)
      this.addLog('project', `新项目：${typeConfig.name}`, 
        `预算：${budget}，期限：${deadline}天`)
    },
    
    // 处理项目进度
    processProjects(deltaTime: number) {
      const activeProjects = this.projects.filter(p => p.stage !== 'completed')
      
      // 自动分配员工
      this.autoAssignEmployees()
      
      // 更新每个项目
      activeProjects.forEach(project => {
        if (project.assignedEmployees.length === 0) return
        
        const assignedEmps = this.employees.filter(e => project.assignedEmployees.includes(e.id))
        
        // 计算平均效率
        const avgEfficiency = assignedEmps.reduce((sum, emp) => {
          return sum + getEmployeeEfficiency(emp, this)
        }, 0) / assignedEmps.length
        
        // 阶段进度增加：deltaTime是秒数，直接用效率计算
        // 基础速度：效率1.0时，大约需要8小时完成一个阶段
        const progressPerSecond = (avgEfficiency / (8 * 3600)) * this.gameSpeed
        project.stageProgress += progressPerSecond * deltaTime
        
        // 阶段完成
        if (project.stageProgress >= 1) {
          this.completeProjectStage(project)
        }
      })
    },
    
    // 完成项目阶段
    completeProjectStage(project: Project) {
      project.stageProgress = 0
      const assignedEmps = this.employees.filter(e => project.assignedEmployees.includes(e.id))
      
      switch (project.stage) {
        case 'design':
          // 设计阶段完成
          const designer = assignedEmps[0]
          if (designer) {
            const qualityBonus = getEmployeeQualityBonus(designer)
            const specialtyBonus = hasSpecialtyMatch(designer, project) ? 0.15 : 0
            
            project.rationality = project.clarityLevel * (0.7 + designer.qualityFactor * 0.3) * (1 + specialtyBonus)
            project.aesthetics = designer.qualityFactor * 8 * (1 + specialtyBonus) * (1 + qualityBonus)
            
            // 给予经验
            giveExperience(designer, 50)
            designer.currentProjectId = undefined
          }
          
          project.stage = 'development'
          project.assignedEmployees = []
          break
          
        case 'development':
          // 开发阶段完成
          const developer = assignedEmps[0]
          if (developer) {
            const qualityBonus = getEmployeeQualityBonus(developer)
            const specialtyBonus = hasSpecialtyMatch(developer, project) ? 0.15 : 0
            
            project.performance = developer.qualityFactor * 7 * (1 + specialtyBonus) * (1 + qualityBonus)
            project.functionality = project.clarityLevel * 0.4 + developer.qualityFactor * 6 * (1 + specialtyBonus) * (1 + qualityBonus)
            
            // 技术债积累
            const techDebtRate = 0.1 * (1 - developer.qualityFactor)
            const workPressure = 1 + Math.max(0, (project.deadline - (this.currentDay - project.startDate)) / project.deadline < 0.3 ? 0.5 : 0)
            project.techDebt += techDebtRate * workPressure
            
            // 给予经验
            giveExperience(developer, 80)
            developer.currentProjectId = undefined
          }
          
          // 检查是否有投入工作的测试工程师
          const hasWorkingTester = this.employees.some(e => 
            e.jobType === 'tester' && e.isWorking && !e.currentProjectId
          )
          
          if (hasWorkingTester) {
            project.stage = 'testing'
          } else {
            // 没有测试工程师，直接交付，设置默认bug率
            project.bugRate = 25
            project.stage = 'delivery'
            this.deliverProject(project)
          }
          project.assignedEmployees = []
          break
          
        case 'testing':
          // 测试阶段完成
          const tester = assignedEmps[0]
          let baseBugRate = 20
          
          if (tester) {
            const testerEfficiency = getEmployeeEfficiency(tester, this)
            baseBugRate = Math.max(1, baseBugRate * (1 - testerEfficiency * 0.5))
            giveExperience(tester, 60)
            tester.currentProjectId = undefined
          }
          
          // 考虑开发者质量
          const devQuality = 1.0 // 使用默认值，因为开发者已经完成
          project.bugRate = Math.max(1, baseBugRate * (1 - devQuality * 0.5))
          
          project.stage = 'delivery'
          project.assignedEmployees = []
          this.deliverProject(project)
          break
      }
    },
    
    // 交付项目
    deliverProject(project: Project) {
      // 计算质量分
      const qualityScore = (
        (project.rationality || 5) * 0.25 +
        (project.aesthetics || 5) * 0.15 +
        (project.performance || 5) * 0.30 +
        (100 - (project.bugRate || 20)) * 0.30
      ) / 10
      
      project.qualityScore = qualityScore
      
      // 计算延期
      const daysElapsed = this.currentDay - project.startDate
      const delayDays = Math.max(0, daysElapsed - project.deadline)
      
      let delayPenalty = 0
      if (delayDays > 0 && delayDays <= 3) {
        delayPenalty = 0.1 * delayDays
      } else if (delayDays > 3 && delayDays <= 7) {
        delayPenalty = 0.3 + 0.15 * (delayDays - 3)
      } else if (delayDays > 7) {
        delayPenalty = 0.7
      }
      
      // 计算最终收入
      const finalIncome = project.budget * qualityScore * (1 - delayPenalty)
      project.finalIncome = Math.max(project.budget * 0.3, finalIncome)
      
      const projectType = PROJECT_TYPE_CONFIGS[project.type].name
      this.changeMoney(project.finalIncome, `项目交付：${projectType}`)
      
      // 更新声望
      let reputationChange = 0
      if (qualityScore >= 1.2) {
        reputationChange += 3 + Math.floor(Math.random() * 3)
      }
      
      if (delayDays === 0) {
        this.consecutiveOnTimeDeliveries++
        if (this.consecutiveOnTimeDeliveries <= 30) {
          reputationChange += 1
        }
        this.addLog('project', `按时交付项目：${projectType}`, 
          `质量分：${qualityScore.toFixed(2)}，收入：${Math.round(project.finalIncome)}`)
      } else {
        this.consecutiveOnTimeDeliveries = 0
        if (delayDays > project.deadline * 0.5) {
          reputationChange -= 5 + Math.floor(Math.random() * 10)
        }
        this.addLog('project', `延期交付项目：${projectType}`, 
          `延期${delayDays}天，质量分：${qualityScore.toFixed(2)}，收入：${Math.round(project.finalIncome)}`)
      }
      
      if (reputationChange !== 0) {
        this.changeReputation(reputationChange, `项目交付质量${qualityScore >= 1.2 ? '优秀' : ''}${delayDays > 0 ? '（延期）' : ''}`)
      }
      
      // 全局技术债
      this.techDebt += project.techDebt
      
      project.stage = 'completed'
      this.completedProjects++
      
      // 从项目池移除
      const poolIndex = this.projectPool.findIndex(p => p.id === project.id)
      if (poolIndex !== -1) {
        this.projectPool.splice(poolIndex, 1)
      }
    },
    
    // 自动分配员工到项目
    autoAssignEmployees() {
      const projectsNeedingWorkers = this.projects.filter(p => 
        p.stage !== 'completed' && 
        p.stage !== 'delivery' &&
        p.assignedEmployees.length === 0
      )
      
      projectsNeedingWorkers.forEach(project => {
        // 跳过设计阶段：如果没有投入工作的产品经理，直接进入开发阶段
        if (project.stage === 'design') {
          const hasWorkingPM = this.employees.some(e => 
            e.jobType === 'product_manager' && e.isWorking && !e.currentProjectId
          )
          
          if (!hasWorkingPM) {
            // 设置默认值并跳到开发阶段
            project.rationality = project.clarityLevel * 0.8
            project.aesthetics = 5
            project.stage = 'development'
            project.stageProgress = 0
            return
          }
        }
        
        let requiredJob: JobType | null = null
        
        switch (project.stage) {
          case 'design':
            requiredJob = 'product_manager'
            break
          case 'development':
            requiredJob = 'developer'
            break
          case 'testing':
            requiredJob = 'tester'
            break
        }
        
        if (!requiredJob) return
        
        // 找到合适的员工（必须是投入工作状态）
        const suitableEmployees = this.employees.filter(e => 
          e.jobType === requiredJob && 
          !e.currentProjectId &&
          e.isWorking
        )
        
        if (suitableEmployees.length > 0) {
          // 优先选择专精匹配的
          let bestEmployee = suitableEmployees[0]
          for (const emp of suitableEmployees) {
            if (hasSpecialtyMatch(emp, project) && !hasSpecialtyMatch(bestEmployee, project)) {
              bestEmployee = emp
            } else if (getEmployeeEfficiency(emp, this) > getEmployeeEfficiency(bestEmployee, this)) {
              bestEmployee = emp
            }
          }
          
          project.assignedEmployees.push(bestEmployee.id)
          bestEmployee.currentProjectId = project.id
        }
      })
    },
    
    // 更新员工疲劳度
    updateEmployeeFatigue(deltaTime: number) {
      const schedule = this.workScheduleConfig
      // deltaTime是秒数，转换为小时
      const hoursElapsed = (deltaTime * this.gameSpeed) / 3600
      
      this.employees.forEach(emp => {
        if (emp.currentProjectId) {
          emp.fatigue = Math.min(100, emp.fatigue + schedule.fatiguePerHour * hoursElapsed)
        }
      })
    },
    
    // 恢复员工疲劳度
    recoverEmployeeFatigue(deltaTime: number) {
      // deltaTime是秒数，转换为小时
      const hoursElapsed = (deltaTime * this.gameSpeed) / 3600
      const recoveryRate = 10 // 每小时恢复10点
      
      this.employees.forEach(emp => {
        emp.fatigue = Math.max(0, emp.fatigue - recoveryRate * hoursElapsed)
      })
    },
    
    // 更新员工满意度
    updateEmployeeSatisfaction() {
      const schedule = this.workScheduleConfig
      
      this.employees.forEach(emp => {
        let delta = schedule.satisfactionDelta
        
        // 公司声望影响
        delta += Math.floor(this.reputation / 10) * 0.1
        
        // 技术债影响
        delta -= Math.floor(this.techDebt / 10) * 0.1
        
        emp.satisfaction = Math.max(0, Math.min(100, emp.satisfaction + delta))
      })
    },
    
    // 检查员工离职
    checkEmployeeResignation() {
      const toRemove: string[] = []
      
      this.employees.forEach(emp => {
        if (emp.satisfaction < 30 && Math.random() < 0.1) {
          toRemove.push(emp.id)
        }
      })
      
      toRemove.forEach(id => this.fireEmployee(id))
      
      if (toRemove.length > 0) {
        this.reputation -= 5 * toRemove.length
      }
    },
    
    // 切换工作制度
    setWorkSchedule(schedule: WorkSchedule) {
      this.workSchedule = schedule
    },
    
    // 切换游戏速度
    setGameSpeed(speed: number) {
      this.gameSpeed = speed
    },
    
    // 暂停/继续
    togglePause() {
      this.isPaused = !this.isPaused
    },
    
    // 升级公司阶段
    upgradeCompanyStage() {
      const stages: CompanyStage[] = [
        'garage',
        'small_studio',
        'regular_company',
        'industry_leader'
      ]
      
      const currentIndex = stages.indexOf(this.companyStage)
      if (currentIndex < stages.length - 1) {
        this.companyStage = stages[currentIndex + 1]
      }
    }
  }
})

// 辅助函数
function getEmployeeEfficiency(employee: Employee, state: GameState): number {
  let efficiency = employee.baseEfficiency
  
  // 特质影响
  employee.traits.forEach(traitType => {
    const trait = TRAITS[traitType]
    efficiency *= (1 + trait.efficiencyBonus)
  })
  
  // 疲劳影响
  if (employee.fatigue > 70) {
    efficiency *= Math.max(0.6, 1 - (employee.fatigue - 70) * 0.01)
  }
  
  // 满意度影响
  if (employee.satisfaction > 80) {
    efficiency *= 1.1
  } else if (employee.satisfaction < 30) {
    efficiency *= 0.7
  }
  
  // 工作制度影响
  const schedule = WORK_SCHEDULES[state.workSchedule]
  efficiency *= schedule.efficiencyMultiplier
  
  return efficiency
}

function getEmployeeQualityBonus(employee: Employee): number {
  let bonus = 0
  
  employee.traits.forEach(traitType => {
    const trait = TRAITS[traitType]
    bonus += trait.qualityBonus
  })
  
  return bonus
}

function hasSpecialtyMatch(employee: Employee, project: Project): boolean {
  const projectConfig = PROJECT_TYPE_CONFIGS[project.type]
  return employee.specialties.some(s => projectConfig.specialtyMatch.includes(s))
}

function giveExperience(employee: Employee, amount: number) {
  employee.experience += amount
  
  const requiredExp = employee.level * employee.level * 100
  if (employee.experience >= requiredExp) {
    employee.experience -= requiredExp
    employee.level++
    
    // 提升工资
    const jobConfig = JOB_CONFIGS[employee.jobType]
    employee.salary = Math.round(jobConfig.baseSalary * Math.pow(jobConfig.growthRate, employee.level - 1))
  }
}