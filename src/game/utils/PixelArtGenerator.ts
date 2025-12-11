export class PixelArtGenerator {
  // 生成员工精灵图
  static generateEmployeeSprite(jobType: string): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    
    // 根据职业类型选择颜色方案
    const colors = this.getJobColors(jobType)
    
    // 绘制像素角色
    // 头部
    ctx.fillStyle = colors.skin
    ctx.fillRect(12, 8, 8, 8)
    
    // 头发
    ctx.fillStyle = colors.hair
    ctx.fillRect(11, 6, 10, 3)
    
    // 眼睛
    ctx.fillStyle = '#000000'
    ctx.fillRect(13, 11, 2, 2)
    ctx.fillRect(17, 11, 2, 2)
    
    // 身体
    ctx.fillStyle = colors.shirt
    ctx.fillRect(11, 16, 10, 8)
    
    // 手臂
    ctx.fillStyle = colors.skin
    ctx.fillRect(9, 18, 2, 6)
    ctx.fillRect(21, 18, 2, 6)
    
    // 腿
    ctx.fillStyle = colors.pants
    ctx.fillRect(12, 24, 3, 6)
    ctx.fillRect(17, 24, 3, 6)
    
    // 鞋子
    ctx.fillStyle = '#333333'
    ctx.fillRect(12, 29, 3, 2)
    ctx.fillRect(17, 29, 3, 2)
    
    return ctx.getImageData(0, 0, 32, 32)
  }
  
  // 生成办公桌精灵
  static generateDeskSprite(): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 48
    const ctx = canvas.getContext('2d')!
    
    // 桌面
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, 0, 64, 48)
    
    // 桌面边缘高光
    ctx.fillStyle = '#A0522D'
    ctx.fillRect(0, 0, 64, 2)
    ctx.fillRect(0, 0, 2, 48)
    
    // 桌面阴影
    ctx.fillStyle = '#654321'
    ctx.fillRect(62, 0, 2, 48)
    ctx.fillRect(0, 46, 64, 2)
    
    // 显示器
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(16, 8, 32, 24)
    
    // 显示器屏幕（绿色光）
    ctx.fillStyle = '#00ff33'
    ctx.fillRect(18, 10, 28, 20)
    
    // 键盘
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(8, 35, 24, 10)
    
    // 键盘按键
    ctx.fillStyle = '#3a3a3a'
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(10 + i * 5, 37 + j * 3, 3, 2)
      }
    }
    
    // 鼠标
    ctx.fillStyle = '#cccccc'
    ctx.fillRect(40, 38, 8, 6)
    
    return ctx.getImageData(0, 0, 64, 48)
  }
  
  // 生成项目图标
  static generateProjectIcon(projectType: string): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    
    const color = this.getProjectColor(projectType)
    
    // 背景
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 32, 32)
    
    // 内部框
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(4, 4, 24, 24)
    
    // 图标符号
    ctx.fillStyle = color
    ctx.font = 'bold 16px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const symbol = this.getProjectSymbol(projectType)
    ctx.fillText(symbol, 16, 16)
    
    return ctx.getImageData(0, 0, 32, 32)
  }
  
  // 生成办公室地板瓦片
  static generateFloorTile(): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    
    // 基础地板颜色
    ctx.fillStyle = '#2c3e50'
    ctx.fillRect(0, 0, 32, 32)
    
    // 地板纹理
    ctx.fillStyle = '#34495e'
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * 8, j * 8, 8, 8)
        }
      }
    }
    
    // 边框
    ctx.strokeStyle = '#1a252f'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, 32, 32)
    
    return ctx.getImageData(0, 0, 32, 32)
  }
  
  // 生成墙壁瓦片
  static generateWallTile(): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    
    // 墙壁颜色
    ctx.fillStyle = '#1a252f'
    ctx.fillRect(0, 0, 32, 32)
    
    // 砖块纹理
    ctx.strokeStyle = '#34495e'
    ctx.lineWidth = 1
    
    for (let i = 0; i < 2; i++) {
      ctx.strokeRect(0, i * 16, 32, 16)
      ctx.strokeRect(16, i * 16, 16, 16)
    }
    
    return ctx.getImageData(0, 0, 32, 32)
  }
  
  // 生成窗户
  static generateWindow(): ImageData {
    const canvas = document.createElement('canvas')
    canvas.width = 80
    canvas.height = 60
    const ctx = canvas.getContext('2d')!
    
    // 天空/外景
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, 80, 60)
    
    // 窗框
    ctx.strokeStyle = '#4682B4'
    ctx.lineWidth = 3
    ctx.strokeRect(0, 0, 80, 60)
    
    // 窗户十字分割
    ctx.beginPath()
    ctx.moveTo(40, 0)
    ctx.lineTo(40, 60)
    ctx.moveTo(0, 30)
    ctx.lineTo(80, 30)
    ctx.stroke()
    
    // 云朵效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fillRect(10, 10, 20, 8)
    ctx.fillRect(50, 15, 15, 6)
    
    return ctx.getImageData(0, 0, 80, 60)
  }
  
  // 获取职业颜色方案
  private static getJobColors(jobType: string): { skin: string, hair: string, shirt: string, pants: string } {
    const colorSchemes: Record<string, any> = {
      'developer': {
        skin: '#FFDAB9',
        hair: '#4A4A4A',
        shirt: '#3498db',
        pants: '#2c3e50'
      },
      'product_manager': {
        skin: '#FFDAB9',
        hair: '#8B4513',
        shirt: '#9b59b6',
        pants: '#34495e'
      },
      'tester': {
        skin: '#FFDAB9',
        hair: '#654321',
        shirt: '#f39c12',
        pants: '#2c3e50'
      },
      'sales': {
        skin: '#FFDAB9',
        hair: '#2F4F4F',
        shirt: '#e74c3c',
        pants: '#34495e'
      }
    }
    
    return colorSchemes[jobType] || colorSchemes['developer']
  }
  
  // 获取项目颜色
  private static getProjectColor(projectType: string): string {
    const colors: Record<string, string> = {
      'web_app': '#3498db',
      'mobile_app': '#9b59b6',
      'enterprise_system': '#e67e22',
      'ai_innovation': '#1abc9c'
    }
    return colors[projectType] || '#95a5a6'
  }
  
  // 获取项目符号
  private static getProjectSymbol(projectType: string): string {
    const symbols: Record<string, string> = {
      'web_app': 'W',
      'mobile_app': 'M',
      'enterprise_system': 'E',
      'ai_innovation': 'A'
    }
    return symbols[projectType] || '?'
  }
  
  // 将 ImageData 转换为 Canvas
  static imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(imageData, 0, 0)
    return canvas
  }
  
  // 将 ImageData 转换为 Base64
  static imageDataToBase64(imageData: ImageData): string {
    const canvas = this.imageDataToCanvas(imageData)
    return canvas.toDataURL()
  }
}