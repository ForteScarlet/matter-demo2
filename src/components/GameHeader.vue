<template>
  <div class="game-header">
    <div class="header-left">
      <div class="company-info">
        <h1 class="company-name">{{ store.companyName }}</h1>
        <div class="company-stage">{{ stageConfig.name }}</div>
      </div>
      <div class="stats-group">
        <div class="stat-item money-stat">
          <span class="stat-label">💰 资金</span>
          <span class="stat-value money-value">
            ¥{{ formatMoney(store.money) }}
            <div v-for="anim in moneyAnimations" :key="anim.id" class="money-animation" :class="{ positive: anim.amount > 0 }">
              {{ anim.amount > 0 ? '+' : '' }}{{ Math.round(anim.amount) }}
            </div>
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">📅 第 {{ store.currentDay }} 天</span>
          <span class="stat-value">{{ formatTime(store.currentTime) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">⭐ 声望</span>
          <span class="stat-value">{{ store.reputation }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">⚠️ 技术债</span>
          <span class="stat-value" :class="techDebtClass">{{ Math.round(store.techDebt) }}</span>
        </div>
      </div>
      
      <!-- 项目生成进度 -->
      <div class="project-generation">
        <div class="gen-label">📦 下个项目</div>
        <div class="gen-progress-bar">
          <div class="gen-progress-fill" :style="{ width: (store.projectGenerationProgress * 100) + '%' }"></div>
        </div>
        <div class="gen-percent">{{ Math.round(store.projectGenerationProgress * 100) }}%</div>
      </div>
    </div>
    
    <div class="header-right">
      <div class="control-group">
        <button @click="store.togglePause()" class="control-btn" :class="{ active: store.isPaused }">
          {{ store.isPaused ? '▶️ 继续' : '⏸️ 暂停' }}
        </button>
        
        <div class="speed-controls">
          <button 
            v-for="speed in [0.5, 1, 2, 5]" 
            :key="speed"
            @click="store.setGameSpeed(speed)"
            class="speed-btn"
            :class="{ active: store.gameSpeed === speed }"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
      
      <div class="work-schedule">
        <label>工作制度：</label>
        <select v-model="currentSchedule" @change="onScheduleChange" class="schedule-select">
          <option value="normal_955">朝九晚五</option>
          <option value="ot_996">996制度</option>
          <option value="flexible">弹性工作</option>
        </select>
      </div>
      
      <div class="balance-indicator">
        <span class="balance-label">平衡指标:</span>
        <div class="balance-bar">
          <div class="balance-fill" :style="{ width: balancePercent + '%' }" :class="balanceClass"></div>
        </div>
        <span class="balance-value">{{ balanceRatio.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { WorkSchedule } from '../types/game'

interface MoneyAnimation {
  id: number
  amount: number
}

const store = useGameStore()
const currentSchedule = ref<WorkSchedule>(store.workSchedule)
const moneyAnimations = ref<MoneyAnimation[]>([])

// 监听金钱变化，触发动画
watch(() => store.money, (newMoney, oldMoney) => {
  const change = newMoney - oldMoney
  if (Math.abs(change) > 0.1) {
    const anim: MoneyAnimation = {
      id: Date.now() + Math.random(),
      amount: change
    }
    moneyAnimations.value.push(anim)
    
    setTimeout(() => {
      const index = moneyAnimations.value.findIndex((a: MoneyAnimation) => a.id === anim.id)
      if (index > -1) {
        moneyAnimations.value.splice(index, 1)
      }
    }, 3000)
  }
})

const stageConfig = computed(() => store.currentStageConfig)

const techDebtClass = computed(() => {
  if (store.techDebt < 20) return 'safe'
  if (store.techDebt < 50) return 'warning'
  if (store.techDebt < 80) return 'danger'
  return 'critical'
})

const balanceRatio = computed(() => store.balanceRatio)

const balancePercent = computed(() => {
  return Math.min(100, balanceRatio.value * 50)
})

const balanceClass = computed(() => {
  const ratio = balanceRatio.value
  if (ratio < 0.8) return 'bad'
  if (ratio > 1.5) return 'waste'
  return 'good'
})

function formatMoney(amount: number): string {
  return Math.round(amount).toLocaleString()
}

function formatTime(time: number): string {
  const hours = Math.floor(time)
  const minutes = Math.floor((time - hours) * 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function onScheduleChange() {
  store.setWorkSchedule(currentSchedule.value)
}
</script>

<style scoped>
.game-header {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #34495e;
  font-family: 'Courier New', monospace;
}

.header-left {
  display: flex;
  gap: 30px;
  align-items: center;
}

.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 20px;
  margin: 0;
  font-weight: bold;
  color: #3498db;
}

.company-stage {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 2px;
}

.stats-group {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #95a5a6;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #ecf0f1;
  position: relative;
}

.money-stat {
  position: relative;
}

.money-value {
  display: inline-block;
}

.money-animation {
  position: absolute;
  top: -10px;
  right: -60px;
  font-size: 14px;
  font-weight: bold;
  animation: moneyFloat 3s ease-out forwards;
  pointer-events: none;
  white-space: nowrap;
}

.money-animation.positive {
  color: #2ecc71;
}

.money-animation:not(.positive) {
  color: #e74c3c;
}

@keyframes moneyFloat {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px);
  }
}

.stat-value.safe {
  color: #2ecc71;
}

.stat-value.warning {
  color: #f39c12;
}

.stat-value.danger {
  color: #e74c3c;
}

.stat-value.critical {
  color: #c0392b;
  animation: blink 1s infinite;
}

.header-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.control-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.control-btn {
  background: #34495e;
  color: #ecf0f1;
  border: 2px solid #7f8c8d;
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #415a77;
  border-color: #95a5a6;
}

.control-btn.active {
  background: #e74c3c;
  border-color: #c0392b;
}

.speed-controls {
  display: flex;
  gap: 2px;
}

.speed-btn {
  background: #34495e;
  color: #95a5a6;
  border: 2px solid #7f8c8d;
  padding: 6px 12px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.2s;
}

.speed-btn:hover {
  background: #415a77;
}

.speed-btn.active {
  background: #3498db;
  color: #ecf0f1;
  border-color: #2980b9;
}

.work-schedule {
  display: flex;
  align-items: center;
  gap: 8px;
}

.work-schedule label {
  font-size: 12px;
  color: #95a5a6;
}

.schedule-select {
  background: #34495e;
  color: #ecf0f1;
  border: 2px solid #7f8c8d;
  padding: 6px 10px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
}

.balance-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.balance-label {
  font-size: 11px;
  color: #95a5a6;
}

.balance-bar {
  width: 100px;
  height: 12px;
  background: #34495e;
  border: 2px solid #7f8c8d;
  position: relative;
  overflow: hidden;
}

.balance-fill {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
}

.balance-fill.good {
  background: #2ecc71;
}

.balance-fill.bad {
  background: #e74c3c;
}

.balance-fill.waste {
  background: #f39c12;
}

.balance-value {
  font-size: 12px;
  font-weight: bold;
  min-width: 40px;
}

.project-generation {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #34495e;
  border: 2px solid #7f8c8d;
}

.gen-label {
  font-size: 11px;
  color: #95a5a6;
  white-space: nowrap;
}

.gen-progress-bar {
  width: 120px;
  height: 10px;
  background: #2c3e50;
  border: 1px solid #7f8c8d;
  position: relative;
  overflow: hidden;
}

.gen-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
}

.gen-percent {
  font-size: 11px;
  color: #ecf0f1;
  font-weight: bold;
  min-width: 35px;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.5; }
}
</style>