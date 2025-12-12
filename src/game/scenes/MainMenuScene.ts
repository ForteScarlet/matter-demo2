import * as me from 'melonjs'

export class MainMenuScene extends me.Stage {
  onResetEvent(): void {
    // 背景
    me.game.world.addChild(new me.ColorLayer('background', '#1a252f', 0), 0)
    
    // 标题
    const title = new me.Text(
      me.game.viewport.width / 2,
      150,
      {
        font: 'Arial',
        size: 48,
        fillStyle: '#3498db',
        textAlign: 'center',
        textBaseline: 'middle',
        text: 'CODER\'S PARADISE'
      }
    )
    this.addChild(title)
    
    // 副标题
    const subtitle = new me.Text(
      me.game.viewport.width / 2,
      200,
      {
        font: 'Arial',
        size: 16,
        fillStyle: '#ecf0f1',
        textAlign: 'center',
        textBaseline: 'middle',
        text: 'Software Company Simulator'
      }
    )
    this.addChild(subtitle)
    
    // 菜单按钮将由 Vue 组件处理
    // MelonJS 只负责渲染游戏画面
  }

  onDestroyEvent(): void {
    // 清理
  }
}