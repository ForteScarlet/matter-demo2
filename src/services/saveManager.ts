import type { SaveData, SaveMetadata, GameSettings } from '../types/save'
import { DEFAULT_SETTINGS } from '../types/save'

const SAVE_KEY_PREFIX = 'pixelsoft_save_'
const SETTINGS_KEY = 'pixelsoft_settings'
const AUTOSAVE_KEY = 'pixelsoft_autosave'
const MAX_SAVES = 5

export class SaveManager {
  private settings: GameSettings

  constructor() {
    this.settings = this.loadSettings()
  }

  // 保存游戏
  save(gameState: any, name?: string): SaveData {
    const saveData: SaveData = {
      id: `save_${Date.now()}`,
      name: name || this.generateSaveName(),
      timestamp: Date.now(),
      gameState: this.cloneState(gameState),
      metadata: this.extractMetadata(gameState)
    }

    // 找到空闲槽位或使用最旧的槽位
    const slotId = this.findAvailableSlot()
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(saveData))

    return saveData
  }

  // 快速保存（覆盖最近的存档）
  quickSave(gameState: any): SaveData {
    const recentSave = this.getMostRecentSave()
    const name = recentSave ? recentSave.name : this.generateSaveName()
    return this.save(gameState, name)
  }

  // 自动保存
  autoSave(gameState: any): SaveData {
    const saveData: SaveData = {
      id: AUTOSAVE_KEY,
      name: '自动保存',
      timestamp: Date.now(),
      gameState: this.cloneState(gameState),
      metadata: this.extractMetadata(gameState)
    }

    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveData))
    return saveData
  }

  // 载入游戏
  load(slotId: string): any | null {
    const key = slotId === 'autosave' ? AUTOSAVE_KEY : `${SAVE_KEY_PREFIX}${slotId}`
    const data = localStorage.getItem(key)
    
    if (!data) return null

    try {
      const saveData: SaveData = JSON.parse(data)
      return saveData.gameState
    } catch (e) {
      console.error('Failed to load save:', e)
      return null
    }
  }

  // 获取所有存档
  getAllSaves(): SaveData[] {
    const saves: SaveData[] = []

    for (let i = 1; i <= MAX_SAVES; i++) {
      const data = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)
      if (data) {
        try {
          saves.push(JSON.parse(data))
        } catch (e) {
          console.error(`Failed to parse save ${i}:`, e)
        }
      }
    }

    // 按时间倒序排序
    return saves.sort((a, b) => b.timestamp - a.timestamp)
  }

  // 获取自动保存
  getAutoSave(): SaveData | null {
    const data = localStorage.getItem(AUTOSAVE_KEY)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('Failed to parse autosave:', e)
      return null
    }
  }

  // 删除存档
  deleteSave(slotId: string): void {
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotId}`)
  }

  // 复制存档
  copySave(slotId: string): SaveData | null {
    const saveData = this.getSaveBySlot(slotId)
    if (!saveData) return null

    const newSave: SaveData = {
      ...saveData,
      id: `save_${Date.now()}`,
      name: `${saveData.name} (副本)`,
      timestamp: Date.now()
    }

    const newSlot = this.findAvailableSlot()
    localStorage.setItem(`${SAVE_KEY_PREFIX}${newSlot}`, JSON.stringify(newSave))

    return newSave
  }

  // 重命名存档
  renameSave(slotId: string, newName: string): boolean {
    const saveData = this.getSaveBySlot(slotId)
    if (!saveData) return false

    saveData.name = newName
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(saveData))
    return true
  }

  // 获取存档占用情况
  getSaveSlotStatus(): { slotId: number; isEmpty: boolean; save?: SaveData }[] {
    const status = []

    for (let i = 1; i <= MAX_SAVES; i++) {
      const data = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)
      status.push({
        slotId: i,
        isEmpty: !data,
        save: data ? JSON.parse(data) : undefined
      })
    }

    return status
  }

  // 保存设置
  saveSettings(settings: GameSettings): void {
    this.settings = settings
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }

  // 加载设置
  loadSettings(): GameSettings {
    const data = localStorage.getItem(SETTINGS_KEY)
    
    if (!data) return DEFAULT_SETTINGS

    try {
      const saved = JSON.parse(data)
      return { ...DEFAULT_SETTINGS, ...saved }
    } catch (e) {
      console.error('Failed to load settings:', e)
      return DEFAULT_SETTINGS
    }
  }

  // 获取当前设置
  getSettings(): GameSettings {
    return this.settings
  }

  // 重置设置为默认值
  resetSettings(): GameSettings {
    this.settings = { ...DEFAULT_SETTINGS }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
    return this.settings
  }

  // 导出存档到文件
  exportSave(slotId: string): void {
    const saveData = this.getSaveBySlot(slotId)
    if (!saveData) return

    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${saveData.name}_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入存档从文件
  async importSave(file: File): Promise<boolean> {
    try {
      const text = await file.text()
      const saveData: SaveData = JSON.parse(text)

      // 验证存档数据
      if (!saveData.gameState || !saveData.metadata) {
        throw new Error('Invalid save file')
      }

      const slotId = this.findAvailableSlot()
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(saveData))
      return true
    } catch (e) {
      console.error('Failed to import save:', e)
      return false
    }
  }

  // 清除所有存档（危险操作）
  clearAllSaves(): void {
    for (let i = 1; i <= MAX_SAVES; i++) {
      localStorage.removeItem(`${SAVE_KEY_PREFIX}${i}`)
    }
    localStorage.removeItem(AUTOSAVE_KEY)
  }

  // 私有辅助方法
  private findAvailableSlot(): number {
    for (let i = 1; i <= MAX_SAVES; i++) {
      if (!localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)) {
        return i
      }
    }
    // 如果没有空槽位，返回最旧的槽位
    const saves = this.getAllSaves()
    const oldest = saves.reduce((min, save) => 
      save.timestamp < min.timestamp ? save : min
    , saves[0])
    
    // 查找该存档的槽位
    for (let i = 1; i <= MAX_SAVES; i++) {
      const data = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)
      if (data) {
        const save = JSON.parse(data)
        if (save.id === oldest.id) return i
      }
    }
    
    return 1
  }

  private getSaveBySlot(slotId: string): SaveData | null {
    const data = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }

  private getMostRecentSave(): SaveData | null {
    const saves = this.getAllSaves()
    return saves.length > 0 ? saves[0] : null
  }

  private generateSaveName(): string {
    const now = new Date()
    return `存档${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  private extractMetadata(gameState: any): SaveMetadata {
    return {
      companyName: gameState.companyName || '未命名公司',
      currentDay: gameState.currentDay || 1,
      money: Math.round(gameState.money || 0),
      reputation: gameState.reputation || 0,
      employeeCount: gameState.employees?.length || 0,
      projectCount: gameState.projects?.filter((p: any) => p.stage !== 'completed').length || 0,
      companyStage: gameState.companyStage || 'garage',
      playTime: 0 // TODO: 实现游戏时间追踪
    }
  }

  private cloneState(state: any): any {
    return JSON.parse(JSON.stringify(state))
  }
}

// 单例导出
export const saveManager = new SaveManager()