import * as me from 'melonjs'

export class OfficeRenderer extends me.Renderable {
  constructor() {
    super(0, 0, 800, 600)
    this.floating = true
  }

  draw(renderer: me.CanvasRenderer): void {
    // 绘制办公室背景
    const ctx = renderer.getContext()
    
    // 地板
    ctx.fillStyle = '#2c3e50'
    ctx.fillRect(0, 0, this.width, this.height)
    
    // 绘制网格（办公桌位置）
    this.drawGrid(ctx)
    
    // 绘制办公桌
    this.drawDesks(ctx)
    
    // 绘制墙壁和装饰
    this.drawWalls(ctx)
  }

  private drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = '#34495e'
    ctx.lineWidth = 1
    
    const gridSize = 32
    
    // 垂直线
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.height)
      ctx.stroke()
    }
    
    // 水平线
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(this.width, y)
      ctx.stroke()
    }
  }

  private drawDesks(ctx: CanvasRenderingContext2D): void {
    // 绘制办公桌（像素风格）
    const deskPositions = [
      { x: 100, y: 200 },
      { x: 250, y: 200 },
      { x: 400, y: 200 },
      { x: 100, y: 350 },
      { x: 250, y: 350 },
      { x: 400, y: 350 },
    ]
    
    deskPositions.forEach(pos => {
      // 桌面
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(pos.x, pos.y, 64, 48)
      
      // 桌面边框
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      ctx.strokeRect(pos.x, pos.y, 64, 48)
      
      // 电脑显示器
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(pos.x + 16, pos.y + 8, 32, 24)
      
      // 显示器边框
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 1
      ctx.strokeRect(pos.x + 16, pos.y + 8, 32, 24)
      
      // 显示器屏幕（发光）
      ctx.fillStyle = '#0f3'
      ctx.fillRect(pos.x + 18, pos.y + 10, 28, 20)
    })
  }

  private drawWalls(ctx: CanvasRenderingContext2D): void {
    // 顶部墙壁
    ctx.fillStyle = '#1a252f'
    ctx.fillRect(0, 0, this.width, 50)
    
    // 墙壁装饰线
    ctx.strokeStyle = '#34495e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 50)
    ctx.lineTo(this.width, 50)
    ctx.stroke()
    
    // 窗户
    for (let i = 0; i < 3; i++) {
      const x = 150 + i * 200
      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(x, 10, 80, 30)
      ctx.strokeStyle = '#4682B4'
      ctx.strokeRect(x, 10, 80, 30)
      
      // 窗户十字
      ctx.beginPath()
      ctx.moveTo(x + 40, 10)
      ctx.lineTo(x + 40, 40)
      ctx.moveTo(x, 25)
      ctx.lineTo(x + 80, 25)
      ctx.stroke()
    }
  }

  update(dt: number): boolean {
    return true
  }
}