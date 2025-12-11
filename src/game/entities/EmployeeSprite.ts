import * as me from 'melonjs'
import type { Employee } from '../../types/game'

export class EmployeeSprite extends me.Sprite {
  private employee: Employee
  private index: number
  private targetX: number
  private targetY: number
  private isMoving: boolean = false
  private animation: string = 'idle'
  
  constructor(employee: Employee, index: number) {
    // 计算员工位置
    const row = Math.floor(index / 3)
    const col = index % 3
    const x = 100 + col * 150 + 32
    const y = 200 + row * 150 + 48
    
    super(x, y, {
      image: 'characters', // 将使用像素角色精灵图
      framewidth: 32,
      frameheight: 32
    })
    
    this.employee = employee
    this.index = index
    this.targetX = x
    this.targetY = y
    
    // 设置碰撞体积
    this.body = new me.Body(this)
    this.body.addShape(new me.Rect(0, 0, 32, 32))
    this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT)
    
    // 设置动画帧（简单的像素角色）
    this.setupAnimations()
    
    // 使精灵可点击
    this.isKinematic = false
  }
  
  setupAnimations(): void {
    // 定义动画帧（这些需要对应实际的精灵图）
    // 目前使用简单的帧序列
    
    // 根据职业类型选择不同的精灵
    const baseFrame = this.getBaseFrameForJob(this.employee.jobType)
    
    // 闲置动画
    this.addAnimation('idle', [baseFrame, baseFrame + 1], 200)
    
    // 工作动画
    this.addAnimation('working', [baseFrame + 2, baseFrame + 3], 300)
    
    // 移动动画
    this.addAnimation('walking', [baseFrame + 4, baseFrame + 5, baseFrame + 6, baseFrame + 7], 150)
    
    this.setCurrentAnimation('idle')
  }
  
  getBaseFrameForJob(jobType: string): number {
    // 不同职业使用不同的精灵行
    const jobFrames: Record<string, number> = {
      'developer': 0,
      'product_manager': 8,
      'tester': 16,
      'sales': 24
    }
    return jobFrames[jobType] || 0
  }
  
  updateEmployee(employee: Employee): void {
    this.employee = employee
    
    // 根据员工状态更新动画
    if (employee.currentProjectId) {
      this.setCurrentAnimation('working')
    } else if (this.isMoving) {
      this.setCurrentAnimation('walking')
    } else {
      this.setCurrentAnimation('idle')
    }
  }
  
  update(dt: number): boolean {
    super.update(dt)
    
    // 简单的移动逻辑（可以添加更复杂的路径寻找）
    if (this.isMoving) {
      const dx = this.targetX - this.pos.x
      const dy = this.targetY - this.pos.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 2) {
        this.pos.x = this.targetX
        this.pos.y = this.targetY
        this.isMoving = false
        this.setCurrentAnimation('idle')
      } else {
        const speed = 2
        this.pos.x += (dx / distance) * speed
        this.pos.y += (dy / distance) * speed
      }
    }
    
    return true
  }
  
  draw(renderer: me.CanvasRenderer): void {
    super.draw(renderer)
    
    // 绘制员工状态指示器
    this.drawStatusIndicators(renderer)
  }
  
  drawStatusIndicators(renderer: me.CanvasRenderer): void {
    const ctx = renderer.getContext()
    
    // 绘制疲劳度条
    const barWidth = 32
    const barHeight = 4
    const barX = this.pos.x
    const barY = this.pos.y - 8
    
    // 背景
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    // 疲劳度（红色）
    if (this.employee.fatigue > 0) {
      ctx.fillStyle = '#e74c3c'
      const fatigueWidth = (this.employee.fatigue / 100) * barWidth
      ctx.fillRect(barX, barY, fatigueWidth, barHeight)
    }
    
    // 满意度条
    const satBarY = barY - 6
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(barX, satBarY, barWidth, barHeight)
    
    // 满意度（绿色到红色渐变）
    const satPercent = this.employee.satisfaction / 100
    const satColor = satPercent > 0.5 ? '#2ecc71' : satPercent > 0.3 ? '#f39c12' : '#e74c3c'
    ctx.fillStyle = satColor
    const satWidth = satPercent * barWidth
    ctx.fillRect(barX, satBarY, satWidth, barHeight)
    
    // 如果正在工作，显示工作指示器
    if (this.employee.currentProjectId) {
      ctx.fillStyle = '#3498db'
      ctx.beginPath()
      ctx.arc(this.pos.x + 28, this.pos.y + 4, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  // 点击事件处理
  onClick(event: me.Pointer): boolean {
    // 触发员工选择事件
    me.event.emit('employee-selected', this.employee)
    return true
  }
}