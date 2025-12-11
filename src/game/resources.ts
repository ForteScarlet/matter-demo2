// 游戏资源清单
export const resources = [
  // 精灵图集
  { name: 'office_tileset', type: 'image', src: '/assets/images/office_tileset.png' },
  { name: 'ui_elements', type: 'image', src: '/assets/images/ui_elements.png' },
  { name: 'characters', type: 'image', src: '/assets/images/characters.png' },
  { name: 'icons', type: 'image', src: '/assets/images/icons.png' },
  
  // 字体
  { name: 'pixel_font', type: 'binary', src: '/assets/fonts/pixel_font.png' },
  
  // 音效
  { name: 'click', type: 'audio', src: '/assets/sounds/click' },
  { name: 'hire', type: 'audio', src: '/assets/sounds/hire' },
  { name: 'complete', type: 'audio', src: '/assets/sounds/complete' },
  { name: 'money', type: 'audio', src: '/assets/sounds/money' },
  
  // 音乐
  { name: 'menu_bgm', type: 'audio', src: '/assets/music/menu_bgm', channel: 1 },
  { name: 'game_bgm', type: 'audio', src: '/assets/music/game_bgm', channel: 1 }
]