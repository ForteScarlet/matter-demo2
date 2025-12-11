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

      <button class="menu-btn" @click="showLoadDialog = true">
        <span class="btn-icon">📂</span>
        <span class="btn-text">载入游戏</span>
      </button>

      <button class="menu-btn" @click="showSaveDialog = true">
        <span class="btn-icon">💾</span>
        <span class="btn-text">保存游戏</span>
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

    <!-- 载入游戏对话框 -->
    <div v-if="showLoadDialog" class="modal-overlay" @click="showLoadDialog = false">
      <div class="modal-content" @click.stop>
        <h3>📂 载入游戏</h3>
        
        <div class="saves-list">
          <!-- 自动保存 -->
          <div v-if="autoSave" class="save-item auto-save" @click="loadSave('autosave')">
            <div class="save-header">
              <span class="save-name">🔄 {{ autoSave.name }}</span>
              <span class="save-date">{{ formatDate(autoSave.timestamp) }}</span>
            </div>
            <div class="save-info">
              <span>{{ autoSave.metadata.companyName }}</span>
              <span>第{{ autoSave.metadata.currentDay }}天</span>
              <span>¥{{ autoSave.metadata.money.toLocaleString() }}</span>
            </div>
          </div>

          <!-- 手动存档 -->
          <div 
            v-for="save in recentSaves" 
            :key="save.id"
            class="save-item"
            @click="loadSave(save.id)"
          >
            <div class="save-header">
              <span class="save-name">{{ save.name }}</span>
              <span class="save-date">{{ formatDate(save.timestamp) }}</span>
            </div>
            <div class="save-info">
              <span>{{ save.metadata.companyName }}</span>
              <span>第{{ save.metadata.currentDay }}天</span>
              <span>¥{{ save.metadata.money.toLocaleString() }}</span>
              <span>{{ save.metadata.employeeCount }}名员工</span>
            </div>
          </div>

          <div v-if="!autoSave && recentSaves.length === 0" class="no-saves">
            暂无存档
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showLoadDialog = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>

    <!-- 保存游戏对话框 -->
    <div v-if="showSaveDialog" class="modal-overlay" @click="showSaveDialog = false">
      <div class="modal-content" @click.stop>
        <h3>💾 保存游戏</h3>
        
        <div class="save-form">
          <label for="save-name">存档名称：</label>
          <input 
            id="save-name"
            v-model="newSaveName"
            type="text"
            class="save-input"
            placeholder="输入存档名称"
            maxlength="30"
            @keyup.enter="confirmSave"
          >
        </div>

        <div class="modal-actions">
          <button @click="confirmSave" class="btn-primary" :disabled="!newSaveName.trim()">
            确认保存
          </button>
          <button @click="showSaveDialog = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { saveManager } from '../services/saveManager'

const emit = defineEmits(['continue', 'new-game', 'load-game', 'settings', 'load-save', 'save-game'])

const recentSaves = ref<any[]>([])
const autoSave = ref<any>(null)
const showLoadDialog = ref(false)
const showSaveDialog = ref(false)
const newSaveName = ref('')

const hasSaveData = computed(() => {
  return recentSaves.value.length > 0 || autoSave.value !== null
})

onMounted(async () => {
  await refreshSaves()
})

async function refreshSaves() {
  recentSaves.value = await saveManager.getAllSaves()
  autoSave.value = await saveManager.getAutoSave()
}

function loadSave(saveId: string) {
  emit('load-save', saveId)
  showLoadDialog.value = false
}

function confirmSave() {
  if (newSaveName.value.trim()) {
    emit('save-game', newSaveName.value.trim())
    showSaveDialog.value = false
    newSaveName.value = ''
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #2c3e50;
  border: 3px solid #34495e;
  padding: 30px;
  min-width: 500px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #ecf0f1;
  font-size: 20px;
  border-bottom: 2px solid #34495e;
  padding-bottom: 10px;
}

.saves-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.save-item {
  background: #34495e;
  border: 2px solid #7f8c8d;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.save-item:hover {
  background: #415a77;
  border-color: #3498db;
  transform: translateX(5px);
}

.save-item.auto-save {
  border-color: #f39c12;
}

.save-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.save-name {
  color: #ecf0f1;
  font-size: 16px;
  font-weight: bold;
}

.save-date {
  color: #95a5a6;
  font-size: 12px;
}

.save-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #bdc3c7;
}

.no-saves {
  text-align: center;
  color: #7f8c8d;
  padding: 40px;
  font-size: 14px;
}

.save-form {
  margin-bottom: 20px;
}

.save-form label {
  display: block;
  color: #ecf0f1;
  font-size: 14px;
  margin-bottom: 10px;
}

.save-input {
  width: 100%;
  background: #34495e;
  border: 2px solid #7f8c8d;
  color: #ecf0f1;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
}

.save-input:focus {
  outline: none;
  border-color: #3498db;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary {
  padding: 12px 24px;
  background: #27ae60;
  border: 2px solid #229954;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2ecc71;
}

.btn-primary:disabled {
  background: #7f8c8d;
  border-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-secondary {
  padding: 12px 24px;
  background: #7f8c8d;
  border: 2px solid #95a5a6;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #95a5a6;
}
</style>