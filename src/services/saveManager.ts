import type { SaveData, SaveMetadata, GameSettings } from '../types/save'
import { DEFAULT_SETTINGS } from '../types/save'
import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'PixelSoftwareDB'
const DB_VERSION = 1
const SAVES_STORE = 'saves'
const SETTINGS_STORE = 'settings'
const AUTOSAVE_KEY = 'autosave'
const MAX_SAVES = 5

interface GameDB {
  saves: {
    key: string
    value: SaveData
  }
  settings: {
    key: string
    value: GameSettings
  }
}

export class SaveManager {
  private settings: GameSettings
  private db: IDBPDatabase<GameDB> | null = null

  constructor() {
    this.settings = DEFAULT_SETTINGS
    this.initDB()
  }

  private async initDB(): Promise<void> {
    try {
      this.db = await openDB<GameDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(SAVES_STORE)) {
            db.createObjectStore(SAVES_STORE)
          }
          if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
            db.createObjectStore(SETTINGS_STORE)
          }
        },
      })
      await this.loadSettings()
    } catch (e) {
      console.error('Failed to initialize IndexedDB:', e)
    }
  }

  private async ensureDB(): Promise<IDBPDatabase<GameDB>> {
    if (!this.db) {
      await this.initDB()
    }
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  // 保存游戏
  async save(gameState: any, name?: string): Promise<SaveData> {
    try {
      const db = await this.ensureDB()
      const saveData: SaveData = {
        id: `save_${Date.now()}`,
        name: name || this.generateSaveName(),
        timestamp: Date.now(),
        gameState: this.cloneState(gameState),
        metadata: this.extractMetadata(gameState)
      }

      // 找到空闲槽位或使用最旧的槽位
      const slotId = await this.findAvailableSlot()
      await db.put(SAVES_STORE, saveData, `save_${slotId}`)

      return saveData
    } catch (e) {
      console.error('Failed to save game:', e)
      throw e
    }
  }

  // 快速保存（覆盖最近的存档）
  async quickSave(gameState: any): Promise<SaveData> {
    const recentSave = await this.getMostRecentSave()
    const name = recentSave ? recentSave.name : this.generateSaveName()
    return this.save(gameState, name)
  }

  // 自动保存
  async autoSave(gameState: any): Promise<SaveData> {
    try {
      const db = await this.ensureDB()
      const saveData: SaveData = {
        id: AUTOSAVE_KEY,
        name: '自动保存',
        timestamp: Date.now(),
        gameState: this.cloneState(gameState),
        metadata: this.extractMetadata(gameState)
      }

      await db.put(SAVES_STORE, saveData, AUTOSAVE_KEY)
      return saveData
    } catch (e) {
      console.error('Failed to autosave:', e)
      throw e
    }
  }

  // 载入游戏
  async load(slotId: string): Promise<any | null> {
    try {
      const db = await this.ensureDB()
      const key = slotId === 'autosave' ? AUTOSAVE_KEY : `save_${slotId}`
      const saveData = await db.get(SAVES_STORE, key)
      
      return saveData ? saveData.gameState : null
    } catch (e) {
      console.error('Failed to load save:', e)
      return null
    }
  }

  // 获取所有存档
  async getAllSaves(): Promise<SaveData[]> {
    try {
      const db = await this.ensureDB()
      const allKeys = await db.getAllKeys(SAVES_STORE)
      const saves: SaveData[] = []

      for (const key of allKeys) {
        if (key !== AUTOSAVE_KEY && typeof key === 'string' && key.startsWith('save_')) {
          const save = await db.get(SAVES_STORE, key)
          if (save) saves.push(save)
        }
      }

      // 按时间倒序排序
      return saves.sort((a, b) => b.timestamp - a.timestamp)
    } catch (e) {
      console.error('Failed to get saves:', e)
      return []
    }
  }

  // 获取自动保存
  async getAutoSave(): Promise<SaveData | null> {
    try {
      const db = await this.ensureDB()
      const save = await db.get(SAVES_STORE, AUTOSAVE_KEY)
      return save || null
    } catch (e) {
      console.error('Failed to get autosave:', e)
      return null
    }
  }

  // 删除存档
  async deleteSave(slotId: string): Promise<void> {
    try {
      const db = await this.ensureDB()
      await db.delete(SAVES_STORE, `save_${slotId}`)
    } catch (e) {
      console.error('Failed to delete save:', e)
    }
  }

  // 复制存档
  async copySave(slotId: string): Promise<SaveData | null> {
    const saveData = await this.getSaveBySlot(slotId)
    if (!saveData) return null

    try {
      const db = await this.ensureDB()
      const newSave: SaveData = {
        ...saveData,
        id: `save_${Date.now()}`,
        name: `${saveData.name} (副本)`,
        timestamp: Date.now()
      }

      const newSlot = await this.findAvailableSlot()
      await db.put(SAVES_STORE, newSave, `save_${newSlot}`)

      return newSave
    } catch (e) {
      console.error('Failed to copy save:', e)
      return null
    }
  }

  // 重命名存档
  async renameSave(slotId: string, newName: string): Promise<boolean> {
    const saveData = await this.getSaveBySlot(slotId)
    if (!saveData) return false

    try {
      const db = await this.ensureDB()
      saveData.name = newName
      await db.put(SAVES_STORE, saveData, `save_${slotId}`)
      return true
    } catch (e) {
      console.error('Failed to rename save:', e)
      return false
    }
  }

  // 获取存档占用情况
  async getSaveSlotStatus(): Promise<{ slotId: number; isEmpty: boolean; save?: SaveData }[]> {
    try {
      const db = await this.ensureDB()
      const status = []

      for (let i = 1; i <= MAX_SAVES; i++) {
        const save = await db.get(SAVES_STORE, `save_${i}`)
        status.push({
          slotId: i,
          isEmpty: !save,
          save: save || undefined
        })
      }

      return status
    } catch (e) {
      console.error('Failed to get slot status:', e)
      return []
    }
  }

  // 保存设置
  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      const db = await this.ensureDB()
      this.settings = settings
      await db.put(SETTINGS_STORE, settings, 'settings')
    } catch (e) {
      console.error('Failed to save settings:', e)
    }
  }

  // 加载设置
  async loadSettings(): Promise<GameSettings> {
    try {
      const db = await this.ensureDB()
      const saved = await db.get(SETTINGS_STORE, 'settings')
      
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...saved }
      } else {
        this.settings = DEFAULT_SETTINGS
      }
      
      return this.settings
    } catch (e) {
      console.error('Failed to load settings:', e)
      this.settings = DEFAULT_SETTINGS
      return DEFAULT_SETTINGS
    }
  }

  // 获取当前设置
  getSettings(): GameSettings {
    return this.settings
  }

  // 重置设置为默认值
  async resetSettings(): Promise<GameSettings> {
    try {
      const db = await this.ensureDB()
      this.settings = { ...DEFAULT_SETTINGS }
      await db.put(SETTINGS_STORE, this.settings, 'settings')
      return this.settings
    } catch (e) {
      console.error('Failed to reset settings:', e)
      return this.settings
    }
  }

  // 导出存档到文件
  async exportSave(slotId: string): Promise<void> {
    const saveData = await this.getSaveBySlot(slotId)
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

      const db = await this.ensureDB()
      const slotId = await this.findAvailableSlot()
      await db.put(SAVES_STORE, saveData, `save_${slotId}`)
      return true
    } catch (e) {
      console.error('Failed to import save:', e)
      return false
    }
  }

  // 清除所有存档（危险操作）
  async clearAllSaves(): Promise<void> {
    try {
      const db = await this.ensureDB()
      const allKeys = await db.getAllKeys(SAVES_STORE)
      
      for (const key of allKeys) {
        await db.delete(SAVES_STORE, key)
      }
    } catch (e) {
      console.error('Failed to clear saves:', e)
    }
  }

  // 私有辅助方法
  private async findAvailableSlot(): Promise<number> {
    const db = await this.ensureDB()
    
    for (let i = 1; i <= MAX_SAVES; i++) {
      const exists = await db.get(SAVES_STORE, `save_${i}`)
      if (!exists) {
        return i
      }
    }
    
    // 如果没有空槽位，返回最旧的槽位
    const saves = await this.getAllSaves()
    if (saves.length === 0) return 1
    
    const oldest = saves.reduce((min, save) => 
      save.timestamp < min.timestamp ? save : min
    , saves[0])
    
    // 查找该存档的槽位
    for (let i = 1; i <= MAX_SAVES; i++) {
      const save = await db.get(SAVES_STORE, `save_${i}`)
      if (save && save.id === oldest.id) return i
    }
    
    return 1
  }

  private async getSaveBySlot(slotId: string): Promise<SaveData | null> {
    try {
      const db = await this.ensureDB()
      const save = await db.get(SAVES_STORE, `save_${slotId}`)
      return save || null
    } catch (e) {
      return null
    }
  }

  private async getMostRecentSave(): Promise<SaveData | null> {
    const saves = await this.getAllSaves()
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