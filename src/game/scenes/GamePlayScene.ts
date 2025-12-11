import * as me from 'melonjs'
import { OfficeRenderer } from '../entities/OfficeRenderer'
import { EmployeeSprite } from '../entities/EmployeeSprite'
import { ProjectDisplay } from '../entities/ProjectDisplay'
import { GameHUD } from '../ui/GameHUD'
import { useGameStore } from '../../stores/gameStore'

export class GamePlayScene extends me.Stage {
  private gameStore: any
  private officeRenderer: OfficeRenderer | null = null
  private employeeSprites: Map<string, EmployeeSprite> = new Map()
  private projectDisplays: Map<string, ProjectDisplay> = new Map()
  private hud: GameHUD | null = null

  onResetEvent(): void {
    // 获取游戏状态
    this.gameStore = useGameStore()
    
    // 背景色
    me.game.world.addChild(new me.ColorLayer('background', '#34495e', 0), 0)
    
    // 创建办公室场景渲染器
    this.officeRenderer = new OfficeRenderer()
    me.game.world.addChild(this.officeRenderer, 1)
    
    // 创建 HUD
    this.hud = new GameHUD()
    me.game.world.addChild(this.hud, 100)
    
    // 初始化员工精灵
    this.syncEmployees()
    
    // 初始化项目显示
    this.syncProjects()
    
    // 监听游戏状态变化
    this.setupStateWatchers()
  }

  update(dt: number): boolean {
    // 同步游戏状态
    this.syncEmployees()
    this.syncProjects()
    
    return super.update(dt)
  }

  private syncEmployees(): void {
    if (!this.gameStore) return
    
    const employees = this.gameStore.employees
    
    // 移除已经不存在的员工精灵
    this.employeeSprites.forEach((sprite, id) => {
      const exists = employees.find((e: any) => e.id === id)
      if (!exists) {
        me.game.world.removeChild(sprite)
        this.employeeSprites.delete(id)
      }
    })
    
    // 添加或更新员工精灵
    employees.forEach((employee: any, index: number) => {
      let sprite = this.employeeSprites.get(employee.id)
      
      if (!sprite) {
        // 创建新的员工精灵
        sprite = new EmployeeSprite(employee, index)
        this.employeeSprites.set(employee.id, sprite)
        me.game.world.addChild(sprite, 10)
      } else {
        // 更新现有精灵
        sprite.updateEmployee(employee)
      }
    })
  }

  private syncProjects(): void {
    if (!this.gameStore) return
    
    const projects = this.gameStore.projects.filter((p: any) => p.stage !== 'completed')
    
    // 移除已完成的项目显示
    this.projectDisplays.forEach((display, id) => {
      const exists = projects.find((p: any) => p.id === id)
      if (!exists) {
        me.game.world.removeChild(display)
        this.projectDisplays.delete(id)
      }
    })
    
    // 添加或更新项目显示
    projects.forEach((project: any, index: number) => {
      let display = this.projectDisplays.get(project.id)
      
      if (!display) {
        display = new ProjectDisplay(project, index)
        this.projectDisplays.set(project.id, display)
        me.game.world.addChild(display, 5)
      } else {
        display.updateProject(project)
      }
    })
  }

  private setupStateWatchers(): void {
    // 这里可以设置对游戏状态的监听
    // 当状态改变时触发相应的动画和效果
  }

  onDestroyEvent(): void {
    // 清理所有精灵和显示对象
    this.employeeSprites.clear()
    this.projectDisplays.clear()
    this.officeRenderer = null
    this.hud = null
  }
}