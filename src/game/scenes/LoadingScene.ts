import * as me from 'melonjs'

export class LoadingScene extends me.Stage {
  onResetEvent(): void {
    // 创建加载文本
    const loadingText = new me.Text(
      me.game.viewport.width / 2,
      me.game.viewport.height / 2,
      {
        font: 'Arial',
        size: 24,
        fillStyle: '#FFFFFF',
        textAlign: 'center',
        textBaseline: 'middle',
        text: 'Loading...'
      }
    )
    
    this.addChild(loadingText)
    
    // 设置背景色
    me.game.world.addChild(new me.ColorLayer('background', '#2c3e50', 0), 0)
  }

  onDestroyEvent(): void {
    // 清理
  }
}