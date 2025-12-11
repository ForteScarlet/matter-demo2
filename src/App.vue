<template>
  <div class="game-container">
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
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import GameHeader from './components/GameHeader.vue'
import EmployeePanel from './components/EmployeePanel.vue'
import ProjectPanel from './components/ProjectPanel.vue'

const store = useGameStore()

let gameLoop: number

onMounted(() => {
  store.initGame()
  
  let lastTime = Date.now()
  
  const tick = () => {
    const now = Date.now()
    const deltaTime = (now - lastTime) / 1000
    lastTime = now
    
    store.gameTick(deltaTime)
    
    gameLoop = requestAnimationFrame(tick)
  }
  
  gameLoop = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #1a252f;
  color: #ecf0f1;
  overflow: hidden;
}

.game-container {
  width: 100vw;
  height: 100vh;
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

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #2c3e50;
}

::-webkit-scrollbar-thumb {
  background: #7f8c8d;
  border: 2px solid #2c3e50;
}

::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
</style>
