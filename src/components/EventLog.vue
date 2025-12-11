<template>
  <div class="event-log">
    <div class="log-header">
      <h3>📋 事件日志</h3>
      <button @click="toggleExpanded" class="toggle-btn">
        {{ isExpanded ? '▼' : '▲' }}
      </button>
    </div>
    
    <div v-if="isExpanded" class="log-content">
      <div class="log-filters">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          @click="toggleCategory(cat.value)"
          class="filter-btn"
          :class="{ active: selectedCategories.includes(cat.value) }"
        >
          {{ cat.icon }} {{ cat.label }}
        </button>
        <button 
          @click="clearLog" 
          class="clear-btn"
          title="清空日志"
        >
          🗑️
        </button>
      </div>
      
      <div class="log-list">
        <div 
          v-for="log in filteredLogs" 
          :key="log.id"
          class="log-entry"
          :class="log.category"
        >
          <div class="log-time">第{{ Math.floor(log.timestamp) }}天</div>
          <div class="log-content-text">
            <div class="log-message">{{ log.message }}</div>
            <div v-if="log.details" class="log-details">{{ log.details }}</div>
            <div class="log-changes">
              <span v-if="log.moneyChange" class="money-change" :class="{ positive: log.moneyChange > 0 }">
                {{ log.moneyChange > 0 ? '+' : '' }}¥{{ Math.round(log.moneyChange) }}
              </span>
              <span v-if="log.reputationChange" class="rep-change" :class="{ positive: log.reputationChange > 0 }">
                {{ log.reputationChange > 0 ? '+' : '' }}{{ log.reputationChange }} 声望
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="filteredLogs.length === 0" class="no-logs">
          暂无日志记录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { LogCategory } from '../types/game'

const store = useGameStore()

const isExpanded = ref(true)
const selectedCategories = ref<LogCategory[]>(['money', 'reputation', 'employee', 'project', 'system', 'other'])

const categories = [
  { value: 'money' as LogCategory, label: '资金', icon: '💰' },
  { value: 'reputation' as LogCategory, label: '声望', icon: '⭐' },
  { value: 'employee' as LogCategory, label: '员工', icon: '👥' },
  { value: 'project' as LogCategory, label: '项目', icon: '📦' },
  { value: 'system' as LogCategory, label: '系统', icon: '⚙️' },
  { value: 'other' as LogCategory, label: '其他', icon: '📝' }
]

const filteredLogs = computed(() => {
  return store.eventLog
    .filter(log => selectedCategories.value.includes(log.category))
    .slice()
    .reverse()
    .slice(0, 100)
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function toggleCategory(category: LogCategory) {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    if (selectedCategories.value.length > 1) {
      selectedCategories.value.splice(index, 1)
    }
  } else {
    selectedCategories.value.push(category)
  }
}

function clearLog() {
  if (confirm('确定要清空所有日志吗？')) {
    store.eventLog = []
  }
}
</script>

<style scoped>
.event-log {
  background: #2c3e50;
  border: 3px solid #34495e;
  margin: 10px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #34495e;
  border-bottom: 2px solid #7f8c8d;
}

.log-header h3 {
  margin: 0;
  color: #ecf0f1;
  font-size: 16px;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
}

.toggle-btn:hover {
  background: #2c3e50;
}

.log-content {
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.log-filters {
  display: flex;
  gap: 5px;
  padding: 10px;
  background: #34495e;
  border-bottom: 2px solid #7f8c8d;
  flex-wrap: wrap;
  align-items: center;
}

.filter-btn {
  padding: 5px 10px;
  background: #2c3e50;
  border: 2px solid #7f8c8d;
  color: #95a5a6;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #3498db;
}

.filter-btn.active {
  background: #3498db;
  border-color: #2980b9;
  color: #ecf0f1;
}

.clear-btn {
  padding: 5px 10px;
  background: #e74c3c;
  border: 2px solid #c0392b;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  margin-left: auto;
}

.clear-btn:hover {
  background: #c0392b;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 8px;
  margin-bottom: 5px;
  border-left: 3px solid #7f8c8d;
  background: #34495e;
  font-size: 12px;
}

.log-entry.money {
  border-left-color: #f39c12;
}

.log-entry.reputation {
  border-left-color: #e67e22;
}

.log-entry.employee {
  border-left-color: #3498db;
}

.log-entry.project {
  border-left-color: #9b59b6;
}

.log-entry.system {
  border-left-color: #95a5a6;
}

.log-time {
  color: #95a5a6;
  font-size: 10px;
  min-width: 55px;
  flex-shrink: 0;
}

.log-content-text {
  flex: 1;
}

.log-message {
  color: #ecf0f1;
  margin-bottom: 3px;
}

.log-details {
  color: #95a5a6;
  font-size: 11px;
  margin-bottom: 3px;
}

.log-changes {
  display: flex;
  gap: 10px;
  font-size: 11px;
  font-weight: bold;
}

.money-change {
  color: #e74c3c;
}

.money-change.positive {
  color: #2ecc71;
}

.rep-change {
  color: #e74c3c;
}

.rep-change.positive {
  color: #f39c12;
}

.no-logs {
  text-align: center;
  color: #7f8c8d;
  padding: 30px;
  font-size: 14px;
}
</style>