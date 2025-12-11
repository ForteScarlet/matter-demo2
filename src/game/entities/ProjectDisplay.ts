import * as me from 'melonjs'
import type { Project } from '../../types/game'

export class ProjectDisplay extends me.Renderable {
  private project: Project
  private index: number
  
  constructor(project: Project, index: number) {
    // 项目显示在右侧区域
    const x = 550
    const y = 100 + index * 120
    const width = 230
    const height = 100
    
    super(x, y, width, height)
    
    this.project = project
    this.index = index
    this.floating = true
  }
  
  updateProject(project: Project): void {
    this.project = project
  }
  
  draw(renderer: me.CanvasRenderer): void {
    const ctx = renderer.getContext()
    
    // 背景
    ctx.fillStyle = '#2c3e50'
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    
    // 边框（根据项目类型不同颜色）
    ctx.strokeStyle = this.getProjectColor()
    ctx.lineWidth = 3
    ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height)
    
    // 项目图标
    this.drawProjectIcon(ctx)
    
    // 项目信息
    this.drawProjectInfo(ctx)
    
    // 进度条
    this.drawProgressBar(ctx)
    
    // 阶段标识
    this.drawStageIndicator(ctx)
  }
  
  drawProjectIcon(ctx: CanvasRenderingContext2D): void {
    const iconX = this.pos.x + 10
    const iconY = this.pos.y + 10
    const iconSize = 32
    
    // 简单的像素图标（根据项目类型）
    ctx.fillStyle = this.getProjectColor()
    ctx.fillRect(iconX, iconY, iconSize, iconSize)
    
    // 图标内部细节
    ctx.fillStyle = '#ecf0f1'
    ctx.fillRect(iconX + 4, iconY + 4, iconSize - 8, iconSize - 8)
    
    // 项目类型符号
    ctx.fillStyle = this.getProjectColor()
    ctx.font = '16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const symbol = this.getProjectTypeSymbol()
    ctx.fillText(symbol, iconX + iconSize / 2, iconY + iconSize / 2)
  }
  
  drawProjectInfo(ctx: CanvasRenderingContext2D): void {
    const textX = this.pos.x + 50
    let textY = this.pos.y + 15
    
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '10px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    
    // 项目类型
    const typeName = this.getProjectTypeName()
    ctx.fillText(typeName, textX, textY)
    textY += 12
    
    // 预算
    ctx.fillStyle = '#f39c12'
    ctx.fillText(`¥${this.project.budget}`, textX, textY)
    textY += 12
    
    // 期限
    const daysLeft = this.project.deadline - (Date.now() - this.project.startDate)
    ctx.fillStyle = daysLeft < 5 ? '#e74c3c' : '#95a5a6'
    ctx.fillText(`${this.project.deadline}天`, textX, textY)
  }
  
  drawProgressBar(ctx: CanvasRenderingContext2D): void {
    const barX = this.pos.x + 10
    const barY = this.pos.y + this.height - 25
    const barWidth = this.width - 20
    const barHeight = 12
    
    // 背景
    ctx.fillStyle = '#1a252f'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    // 进度
    ctx.fillStyle = this.getStageColor()
    const progressWidth = barWidth * this.project.stageProgress
    ctx.fillRect(barX, barY, progressWidth, barHeight)
    
    // 边框
    ctx.strokeStyle = '#7f8c8d'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barWidth, barHeight)
    
    // 百分比文字
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '8px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `${Math.round(this.project.stageProgress * 100)}%`,
      barX + barWidth / 2,
      barY + barHeight / 2
    )
  }
  
  drawStageIndicator(ctx: CanvasRenderingContext2D): void {
    const indicatorX = this.pos.x + 10
    const indicatorY = this.pos.y + this.height - 10
    
    ctx.fillStyle = '#95a5a6'
    ctx.font = '8px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    
    const stageName = this.getStageName()
    ctx.fillText(stageName, indicatorX, indicatorY)
    
    // 分配的员工数量
    if (this.project.assignedEmployees.length > 0) {
      ctx.fillStyle = '#3498db'
      ctx.fillText(
        `👤${this.project.assignedEmployees.length}`,
        this.pos.x + this.width - 30,
        indicatorY
      )
    }
  }
  
  getProjectColor(): string {
    const colors: Record<string, string> = {
      'web_app': '#3498db',
      'mobile_app': '#9b59b6',
      'enterprise_system': '#e67e22',
      'ai_innovation': '#1abc9c'
    }
    return colors[this.project.type] || '#95a5a6'
  }
  
  getProjectTypeSymbol(): string {
    const symbols: Record<string, string> = {
      'web_app': 'W',
      'mobile_app': 'M',
      'enterprise_system': 'E',
      'ai_innovation': 'A'
    }
    return symbols[this.project.type] || '?'
  }
  
  getProjectTypeName(): string {
    const names: Record<string, string> = {
      'web_app': 'Web应用',
      'mobile_app': '移动应用',
      'enterprise_system': '企业系统',
      'ai_innovation': 'AI项目'
    }
    return names[this.project.type] || '未知'
  }
  
  getStageName(): string {
    const stages: Record<string, string> = {
      'design': '设计',
      'development': '开发',
      'testing': '测试',
      'delivery': '交付',
      'completed': '完成'
    }
    return stages[this.project.stage] || '未知'
  }
  
  getStageColor(): string {
    const colors: Record<string, string> = {
      'design': '#9b59b6',
      'development': '#3498db',
      'testing': '#f39c12',
      'delivery': '#2ecc71',
      'completed': '#95a5a6'
    }
    return colors[this.project.stage] || '#95a5a6'
  }
  
  update(dt: number): boolean {
    return true
  }
  
  // 点击事件处理
  onClick(event: me.Pointer): boolean {
    me.event.emit('project-selected', this.project)
    return true
  }
}