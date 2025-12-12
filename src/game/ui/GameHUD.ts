import * as me from 'melonjs'
import { useGameStore } from '../../stores/gameStore'

export class GameHUD extends me.Renderable {
  private gameStore: any
  private moneyDisplay: string = '¥0'
  private dayDisplay: string = '第1天'
  private reputationDisplay: string = '0'
  private techDebtDisplay: string = '0'
  
  constructor() {
    super(0, 0, 800, 80)
    this.floating = true
    this.gameStore = useGameStore()
  }
  
  update(dt: number): boolean {
    // 更新显示数据
    if (this.gameStore) {
      this.moneyDisplay = `¥${Math.round(this.gameStore.money).toLocaleString()}`
      this.dayDisplay = `第${this.gameStore.currentDay}天`
      this.reputationDisplay = `${this.gameStore.reputation}`
      this.techDebtDisplay = `${Math.round(this.gameStore.techDebt)}`
    }
    return true
  }
  
  draw(renderer: me.CanvasRenderer): void {
    const ctx = renderer.getContext()
    
    // HUD 背景
    ctx.fillStyle = 'rgba(44, 62, 80, 0.95)'
    ctx.fillRect(0, 0, this.width, this.height)
    
    // 分隔线
    ctx.strokeStyle = '#7f8c8d'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, this.height)
    ctx.lineTo(this.width, this.height)
    ctx.stroke()
    
    // 绘制各项信息
    this.drawMoneyInfo(ctx)
    this.drawDayInfo(ctx)
    this.drawReputationInfo(ctx)
    this.drawTechDebtInfo(ctx)
    this.drawControls(ctx)
  }
  
  drawMoneyInfo(ctx: CanvasRenderingContext2D): void {
    const x = 20
    const y = 20
    
    // 图标
    ctx.fillStyle = '#f39c12'
    ctx.font = '24px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('💰', x, y)
    
    // 标签
    ctx.fillStyle = '#95a5a6'
    ctx.font = '10px monospace'
    ctx.fillText('资金', x + 30, y)
    
    // 数值
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '16px monospace'
    ctx.fillText(this.moneyDisplay, x + 30, y + 12)
  }
  
  drawDayInfo(ctx: CanvasRenderingContext2D): void {
    const x = 200
    const y = 20
    
    // 图标
    ctx.fillStyle = '#3498db'
    ctx.font = '24px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('📅', x, y)
    
    // 标签
    ctx.fillStyle = '#95a5a6'
    ctx.font = '10px monospace'
    ctx.fillText('时间', x + 30, y)
    
    // 数值
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '16px monospace'
    ctx.fillText(this.dayDisplay, x + 30, y + 12)
    
    // 当前时间
    if (this.gameStore) {
      const hours = Math.floor(this.gameStore.currentTime)
      const minutes = Math.floor((this.gameStore.currentTime - hours) * 60)
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      ctx.font = '12px monospace'
      ctx.fillStyle = '#bdc3c7'
      ctx.fillText(timeStr, x + 30, y + 30)
    }
  }
  
  drawReputationInfo(ctx: CanvasRenderingContext2D): void {
    const x = 360
    const y = 20
    
    // 图标
    ctx.fillStyle = '#e67e22'
    ctx.font = '24px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('⭐', x, y)
    
    // 标签
    ctx.fillStyle = '#95a5a6'
    ctx.font = '10px monospace'
    ctx.fillText('声望', x + 30, y)
    
    // 数值
    ctx.fillStyle = '#ecf0f1'
    ctx.font = '16px monospace'
    ctx.fillText(this.reputationDisplay, x + 30, y + 12)
  }
  
  drawTechDebtInfo(ctx: CanvasRenderingContext2D): void {
    const x = 480
    const y = 20
    
    // 图标
    const techDebt = this.gameStore ? this.gameStore.techDebt : 0
    const color = techDebt < 20 ? '#2ecc71' : techDebt < 50 ? '#f39c12' : '#e74c3c'
    
    ctx.fillStyle = color
    ctx.font = '24px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('⚠️', x, y)
    
    // 标签
    ctx.fillStyle = '#95a5a6'
    ctx.font = '10px monospace'
    ctx.fillText('技术债', x + 30, y)
    
    // 数值
    ctx.fillStyle = color
    ctx.font = '16px monospace'
    ctx.fillText(this.techDebtDisplay, x + 30, y + 12)
  }
  
  drawControls(ctx: CanvasRenderingContext2D): void {
    const x = 620
    const y = 20
    
    // 游戏速度显示
    if (this.gameStore) {
      ctx.fillStyle = '#95a5a6'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText('速度', x, y)
      
      ctx.fillStyle = '#3498db'
      ctx.font = '16px monospace'
      ctx.fillText(`${this.gameStore.gameSpeed}x`, x, y + 12)
      
      // 暂停状态
      if (this.gameStore.isPaused) {
        ctx.fillStyle = '#e74c3c'
        ctx.font = '12px monospace'
        ctx.fillText('已暂停', x, y + 30)
      }
    }
    
    // 提示信息
    ctx.fillStyle = '#7f8c8d'
    ctx.font = '8px monospace'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('空格:暂停 1-4:速度 ESC:菜单', this.width - 10, this.height - 5)
  }
}