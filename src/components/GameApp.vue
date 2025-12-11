I see the issue - the component imports don't exist yet. Let me create a simplified version without the missing components first.

<template>
  <div class="game-app">
    <!-- 主菜单 -->
    <MainMenu 
      v-if="gameState === 'menu'"
      @continue="continueGame"
      @new-game="startNewGame"
      @load-game="showLoadGame"
      @settings="showSettings = true"
    />

    <!-- 游戏界面 -->
    <div v-if="gameState === 'playing'" class="game-view">
      <GameHeader />
      
      <!-- 游戏菜单按钮 -->
      <div class="game-menu-buttons">
        <button @click="showManual = true" class="menu-button" title="游戏说明手册">
          📖 帮助
        </button>
        <button @click="showGameMenu = true" class="menu-button" title="游戏菜单">
          ☰ 菜单
        </button>
      </div>
      
      <div class="game-content">
        <div class="left-panel">
          <EmployeePanel />
        </div>
        
        <div class="main-panel">
          <ProjectPanel />
          <EventLog />
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      {{ toast.message }}
    </div>
    
    <!-- 游戏手册 -->
    <GameManual v-model:isOpen="showManual" />
    
    <!-- 游戏菜单 -->
    <div v-if="showGameMenu" class="modal-overlay" @click="showGameMenu = false">
      <div class="game-menu-modal" @click.stop>
        <h3>游戏菜单</h3>
        <div class="menu-options">
          <button @click="handleManualSave" class="menu-option-btn save">
            💾 手动保存
          </button>
          <button @click="showManual = true; showGameMenu = false" class="menu-option-btn">
            📖 游戏手册
          </button>
          <button @click="handleReturnToMenu" class="menu-option-btn danger">
            🏠 返回主菜单
          </button>
          <button @click="showGameMenu = false" class="menu-option-btn">
            ✕ 取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { saveManager } from '../services/saveManager'
import MainMenu from './MainMenu.vue'
import GameHeader from './GameHeader.vue'
import EmployeePanel from './EmployeePanel.vue'
import ProjectPanel from './ProjectPanel.vue'
import EventLog from './EventLog.vue'
import GameManual from './GameManual.vue'

const store = useGameStore()

const gameState = ref<'menu' | 'playing'>('menu')
const showSettings = ref(false)
const showManual = ref(false)
const showGameMenu = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

let gameLoop: number | null = null
let autoSaveInterval: number | null = null

function handleKeyDown(e: KeyboardEvent) {
  if (gameState.value !== 'playing') return
  
  const key = e.key
  
  if (key === ' ') {
    e.preventDefault()
    store.togglePause()
  }
  
  if (key === '1') {
    store.setGameSpeed(0.5)
  }
  if (key === '2') {
    store.setGameSpeed(1)
  }
  if (key === '3') {
    store.setGameSpeed(2)
  }
  if (key === '4') {
    store.setGameSpeed(5)
  }
  
  if (key === 'F5') {
    e.preventDefault()
    handleManualSave()
  }
  
  if (key === 'Escape') {
    if (showGameMenu.value) {
      showGameMenu.value = false
    } else {
      showGameMenu.value = true
    }
  }
}

function continueGame() {
  const saves = saveManager.getAllSaves()
  if (saves.length > 0) {
    loadGame('1')
  } else {
    const autoSave = saveManager.getAutoSave()
    if (autoSave) {
      const gameData = saveManager.load('autosave')
      if (gameData) {
        Object.assign(store.$state, gameData)
        gameState.value = 'playing'
        startGameLoop()
        startAutoSave()
        showToast('游戏已载入', 'success')
      }
    }
  }
}

function startNewGame() {
  store.initGame()
  gameState.value = 'playing'
  startGameLoop()
  startAutoSave()
  showToast('游戏开始！', 'success')
}

function loadGame(slotId: string) {
  const gameData = saveManager.load(slotId)
  if (gameData) {
    Object.assign(store.$state, gameData)
    gameState.value = 'playing'
    startGameLoop()
    startAutoSave()
    showToast('游戏已载入', 'success')
  } else {
    showToast('载入失败', 'error')
  }
}

function showLoadGame() {
  showToast('载入功能开发中...', 'info')
}

function handleDailyAutoSave() {
  saveManager.autoSave(store.$state)
  showToast('💾 每日自动保存', 'info')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('daily-autosave', handleDailyAutoSave)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('daily-autosave', handleDailyAutoSave)
  stopGameLoop()
  stopAutoSave()
})

function handleManualSave() {
  try {
    const saveData = saveManager.save(store.$state)
    showToast(`游戏已保存: ${saveData.name}`, 'success')
    showGameMenu.value = false
  } catch (e) {
    showToast('保存失败', 'error')
  }
}

function handleReturnToMenu() {
  if (confirm('确定要返回主菜单吗？未保存的进度将会丢失。')) {
    stopGameLoop()
    stopAutoSave()
    gameState.value = 'menu'
    showGameMenu.value = false
  }
}

function startGameLoop() {
  if (gameLoop !== null) return
  
  let lastTime = Date.now()
  
  const tick = () => {
    if (gameState.value !== 'playing') {
      gameLoop = requestAnimationFrame(tick)
      return
    }
    
    const now = Date.now()
    const deltaTime = (now - lastTime) / 1000
    lastTime = now
    
    store.gameTick(deltaTime)
    
    gameLoop = requestAnimationFrame(tick)
  }
  
  gameLoop = requestAnimationFrame(tick)
}

function stopGameLoop() {
  if (gameLoop !== null) {
    cancelAnimationFrame(gameLoop)
    gameLoop = null
  }
}

function startAutoSave() {
  const settings = saveManager.getSettings()
  if (settings.autoSave.enabled && settings.autoSave.interval > 0) {
    autoSaveInterval = window.setInterval(() => {
      saveManager.autoSave(store.$state)
      showToast('⏰ 定时自动保存', 'info')
    }, settings.autoSave.interval * 60 * 1000)
  }
}

function stopAutoSave() {
  if (autoSaveInterval !== null) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }
}

function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  toast.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.game-app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.game-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 350px;
  overflow-y: auto;
}

.main-panel {
  flex: 1;
  overflow-y: auto;
}

.toast-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 15px 25px;
  background: #34495e;
  border: 2px solid;
  color: #ecf0f1;
  font-size: 14px;
  z-index: 3000;
  animation: slideInRight 0.3s ease-out;
}

.toast-notification.info {
  border-color: #3498db;
}

.toast-notification.success {
  border-color: #2ecc71;
}

.toast-notification.error {
  border-color: #e74c3c;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.game-menu-buttons {
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.menu-button {
  background: #3498db;
  color: #ecf0f1;
  border: 2px solid #2980b9;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
}

.menu-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.game-menu-modal {
  background: #2c3e50;
  border: 3px solid #34495e;
  padding: 30px;
  min-width: 350px;
}

.game-menu-modal h3 {
  margin: 0 0 25px 0;
  color: #ecf0f1;
  font-size: 20px;
  text-align: center;
  border-bottom: 2px solid #34495e;
  padding-bottom: 15px;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-option-btn {
  background: #34495e;
  color: #ecf0f1;
  border: 2px solid #7f8c8d;
  padding: 15px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
  text-align: left;
}

.menu-option-btn:hover {
  background: #415a77;
  border-color: #95a5a6;
  transform: translateX(5px);
}

.menu-option-btn.save {
  background: #27ae60;
  border-color: #229954;
}

.menu-option-btn.save:hover {
  background: #2ecc71;
}

.menu-option-btn.danger {
  background: #e74c3c;
  border-color: #c0392b;
}

.menu-option-btn.danger:hover {
  background: #c0392b;
}
</style>