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
      
      <div class="game-content">
        <div class="left-panel">
          <EmployeePanel />
        </div>
        
        <div class="main-panel">
          <ProjectPanel />
        </div>
      </div>
    </div>

    <!-- Toast 通知 -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      {{ toast.message }}
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

const store = useGameStore()

const gameState = ref<'menu' | 'playing'>('menu')
const showSettings = ref(false)

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
    saveGame()
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

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  stopGameLoop()
  stopAutoSave()
})

function saveGame() {
  try {
    const saveData = saveManager.save(store.$state)
    showToast(`游戏已保存: ${saveData.name}`, 'success')
  } catch (e) {
    showToast('保存失败', 'error')
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
  if (settings.autoSave.enabled) {
    autoSaveInterval = window.setInterval(() => {
      saveManager.autoSave(store.$state)
      showToast('自动保存', 'info')
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
</style>