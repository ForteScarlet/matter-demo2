// 存档系统类型定义

export interface SaveData {
  id: string
  name: string
  timestamp: number
  gameState: any
  thumbnail?: string
  metadata: SaveMetadata
}

export interface SaveMetadata {
  companyName: string
  currentDay: number
  money: number
  reputation: number
  employeeCount: number
  projectCount: number
  companyStage: string
  playTime: number // 游戏时间（秒）
}

export interface GameSettings {
  // 游戏设置
  difficulty: 'easy' | 'normal' | 'hard'
  autoPause: {
    onEvent: boolean
    onProjectPoolFull: boolean
    onMassResignation: boolean
    onLowMoney: boolean
  }
  gameSpeed: {
    default: number
    max: number
  }
  autoSave: {
    enabled: boolean
    interval: number // 分钟
  }
  confirmDialogs: {
    dangerousOperations: boolean
    overwriteSave: boolean
    fireEmployee: boolean
    rejectProject: boolean
  }
  
  // 画面设置
  resolution: string
  displayMode: 'fullscreen' | 'windowed' | 'borderless'
  pixelStyle: {
    pixelSize: number
    scanlines: 'off' | 'weak' | 'medium' | 'strong'
    crtEffect: boolean
    colorDithering: boolean
  }
  performance: {
    fpsLimit: number
    animationQuality: 'low' | 'medium' | 'high'
    particleEffects: boolean
    dynamicLighting: boolean
  }
  ui: {
    scale: number
    fontClearness: 'pixel' | 'clear'
    showEmployeeAnimation: boolean
    showProjectFlowAnimation: boolean
  }
  accessibility: {
    colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
    highContrast: boolean
    reducedAnimation: boolean
    largeUI: boolean
  }
  
  // 音效设置
  audio: {
    masterVolume: number
    musicVolume: number
    sfxVolume: number
    ambientVolume: number
    voiceVolume: number
    playMusic: boolean
    musicStyle: 'work' | 'relaxed' | 'intense'
    dynamicMusic: boolean
    buttonSound: 'classic' | 'modern' | 'retro' | 'silent'
    eventSound: boolean
    completionSound: boolean
  }
  
  // 控制设置
  controls: {
    keyBindings: Record<string, string>
    mouseWheel: 'zoom' | 'scroll' | 'none'
    doubleClickSpeed: number
    rightClickMenu: boolean
    dragSensitivity: number
    gamepadEnabled: boolean
    gamepadVibration: boolean
  }
  
  // 其他设置
  language: string
  dateFormat: string
  numberFormat: string
  notifications: {
    desktop: boolean
    events: 'all' | 'important' | 'none'
    sound: boolean
  }
  tutorial: {
    hints: 'all' | 'new_content' | 'off'
    valueTooltips: boolean
    autoSuggestions: boolean
  }
}

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'normal',
  autoPause: {
    onEvent: true,
    onProjectPoolFull: true,
    onMassResignation: true,
    onLowMoney: true
  },
  gameSpeed: {
    default: 1,
    max: 5
  },
  autoSave: {
    enabled: true,
    interval: 5
  },
  confirmDialogs: {
    dangerousOperations: true,
    overwriteSave: true,
    fireEmployee: true,
    rejectProject: true
  },
  resolution: '1920x1080',
  displayMode: 'windowed',
  pixelStyle: {
    pixelSize: 2,
    scanlines: 'off',
    crtEffect: false,
    colorDithering: true
  },
  performance: {
    fpsLimit: 60,
    animationQuality: 'high',
    particleEffects: true,
    dynamicLighting: true
  },
  ui: {
    scale: 1.0,
    fontClearness: 'pixel',
    showEmployeeAnimation: true,
    showProjectFlowAnimation: true
  },
  accessibility: {
    colorblindMode: 'none',
    highContrast: false,
    reducedAnimation: false,
    largeUI: false
  },
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 90,
    ambientVolume: 60,
    voiceVolume: 80,
    playMusic: true,
    musicStyle: 'work',
    dynamicMusic: true,
    buttonSound: 'classic',
    eventSound: true,
    completionSound: true
  },
  controls: {
    keyBindings: {
      pause: 'Space',
      speed1x: '1',
      speed2x: '2',
      speed5x: '3',
      openMenu: 'Escape',
      employees: 'E',
      projects: 'P',
      data: 'D',
      save: 'F5',
      quickLoad: 'F9'
    },
    mouseWheel: 'scroll',
    doubleClickSpeed: 50,
    rightClickMenu: true,
    dragSensitivity: 50,
    gamepadEnabled: false,
    gamepadVibration: true
  },
  language: 'zh-CN',
  dateFormat: 'YYYY-MM-DD',
  numberFormat: 'comma',
  notifications: {
    desktop: false,
    events: 'important',
    sound: true
  },
  tutorial: {
    hints: 'all',
    valueTooltips: true,
    autoSuggestions: true
  }
}