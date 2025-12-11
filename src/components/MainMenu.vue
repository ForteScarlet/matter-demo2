<template>
  <div class="main-menu">
    <div class="menu-background">
      <div class="office-scene"></div>
    </div>

    <div class="game-title">
      <div class="title-logo">
        <div class="logo-text">PIXEL</div>
        <div class="logo-subtext">SOFTWARE CO.</div>
      </div>
    </div>

    <div class="menu-buttons">
      <button 
        class="menu-btn" 
        :class="{ disabled: !hasSaveData }"
        :disabled="!hasSaveData"
        @click="$emit('continue')"
      >
        <span class="btn-icon">▶️</span>
        <span class="btn-text">继续游戏</span>
      </button>

      <button class="menu-btn" @click="$emit('new-game')">
        <span class="btn-icon">🆕</span>
        <span class="btn-text">新游戏</span>
      </button>

      <button class="menu-btn" @click="$emit('load-game')">
        <span class="btn-icon">📂</span>
        <span class="btn-text">载入游戏</span>
      </button>

      <button class="menu-btn" @click="$emit('settings')">
        <span class="btn-icon">⚙️</span>
        <span class="btn-text">设置</span>
      </button>
    </div>

    <div class="version-info">
      <span>v1.0.0</span>
      <span>|</span>
      <span>© 2024 Pixel Studio</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { saveManager } from '../services/saveManager'

const emit = defineEmits(['continue', 'new-game', 'load-game', 'settings'])

const recentSaves = ref<any[]>([])
const autoSave = ref<any>(null)

const hasSaveData = computed(() => {
  return recentSaves.value.length > 0 || autoSave.value !== null
})

onMounted(async () => {
  recentSaves.value = await saveManager.getAllSaves()
  autoSave.value = await saveManager.getAutoSave()
})
</script>

<style scoped>
.main-menu {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.menu-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
  z-index: 0;
}

.office-scene {
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  background-image: repeating-linear-gradient(
    90deg,
    #34495e 0px,
    #34495e 20px,
    #2c3e50 20px,
    #2c3e50 40px
  );
}

.game-title {
  position: relative;
  z-index: 1;
  margin-bottom: 50px;
  text-align: center;
}

.title-logo {
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 72px;
  font-weight: bold;
  color: #3498db;
  text-shadow: 
    3px 3px 0 #2980b9,
    6px 6px 0 #1a5276;
  letter-spacing: 8px;
}

.logo-subtext {
  font-size: 24px;
  color: #ecf0f1;
  letter-spacing: 4px;
  margin-top: 10px;
}

.menu-buttons {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #34495e;
  color: #ecf0f1;
  border: 3px solid #7f8c8d;
  padding: 15px 30px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 280px;
}

.menu-btn:hover:not(.disabled) {
  background: #415a77;
  border-color: #95a5a6;
  transform: translateX(10px);
}

.menu-btn:active:not(.disabled) {
  transform: translateX(5px) scale(0.98);
}

.menu-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #2c3e50;
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.version-info {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  color: #7f8c8d;
  font-size: 12px;
  z-index: 1;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>