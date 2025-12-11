import * as me from 'melonjs'

export class Game {
  private static instance: Game | null = null
  private initialized = false
  private canvas: HTMLCanvasElement | null = null

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game()
    }
    return Game.instance
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (this.initialized) return

    this.canvas = canvas
    
    try {
      // 初始化 MelonJS
      if (!me.video.init(800, 600, {
        parent: canvas.parentElement || undefined,
        canvas: canvas,
        scale: 'auto',
        scaleMethod: 'fit',
        renderer: me.video.CANVAS,
        antiAlias: false,
        transparent: false
      })) {
        throw new Error('无法初始化 MelonJS')
      }

      console.log('MelonJS 初始化成功')
      this.initialized = true
    } catch (error) {
      console.error('MelonJS 初始化失败:', error)
      throw error
    }
  }

  start(): void {
    console.log('游戏启动')
  }

  pause(): void {
    me.state.pause()
  }

  resume(): void {
    me.state.resume()
  }

  stop(): void {
    me.state.stop()
  }
}