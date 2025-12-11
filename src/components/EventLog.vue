<template>
  <div class="event-log-compact">
    <div class="log-header-compact">
      <h3>📋 日志 ({{ filteredLogs.length }})</h3>
    </div>
    
    <div class="log-filters-compact">
      <div class="filter-buttons-compact">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          @click="toggleCategory(cat.value)"
          class="filter-btn-compact"
          :class="{ active: selectedCategories.includes(cat.value) }"
          :title="cat.label"
        >
          {{ cat.icon }}
        </button>
      </div>
      <button 
        @click="clearLog" 
        class="clear-btn-compact"
        title="清空日志"
      >
        🗑️
      </button>
    </div>
    
    <div class="log-list-compact">
      <div 
        v-for="log in filteredLogs" 
        :key="log.id"
        class="log-entry-compact"
        :class="log.category"
      >
        <div class="log-time-compact">D{{ Math.floor(log.timestamp) }}</div>
        <div class="log-content-compact">
          <div class="log-message-compact">{{ log.message }}</div>
          <div class="log-changes-compact">
            <span v-if="log.moneyChange" class="money-change-compact" :class="{ positive: log.moneyChange > 0 }">
              {{ log.moneyChange > 0 ? '+' : '' }}¥{{ Math.round(log.moneyChange) }}
            </span>
            <span v-if="log.reputationChange" class="rep-change-compact" :class="{ positive: log.reputationChange > 0 }">
              {{ log.reputationChange > 0 ? '+' : '' }}{{ log.reputationChange }}⭐
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="filteredLogs.length === 0" class="no-logs-compact">
        暂无日志
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { LogCategory } from '../types/game'

const store = useGameStore()

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
    .slice(0, 50)
})

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
.event-log-compact {
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.log-header-compact {
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #7f8c8d;
}

.log-header-compact h3 {
  margin: 0;
  color: #ecf0f1;
  font-size: 14px;
}

.log-filters-compact {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  padding: 6px;
  background: #34495e;
  border: 1px solid #7f8c8d;
  margin-bottom: 8px;
  align-items: center;
}

.filter-buttons-compact {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.filter-btn-compact {
  padding: 3px 6px;
  background: #2c3e50;
  border: 1px solid #7f8c8d;
  color: #95a5a6;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.2s;
}

.filter-btn-compact:hover {
  border-color: #3498db;
  background: #34495e;
}

.filter-btn-compact.active {
  background: #3498db;
  border-color: #2980b9;
  color: #ecf0f1;
}

.clear-btn-compact {
  padding: 3px 8px;
  background: #e74c3c;
  border: 1px solid #c0392b;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  transition: all 0.2s;
}

.clear-btn-compact:hover {
  background: #c0392b;
}

.log-list-compact {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.log-entry-compact {
  display: flex;
  gap: 6px;
  padding: 4px 6px;
  border-left: 2px solid #7f8c8d;
  background: #34495e;
  font-size: 9px;
  transition: background 0.2s;
}

.log-entry-compact:hover {
  background: #3e5264;
}

.log-entry-compact.money {
  border-left-color: #f39c12;
}

.log-entry-compact.reputation {
  border-left-color: #e67e22;
}

.log-entry-compact.employee {
  border-left-color: #3498db;
}

.log-entry-compact.project {
  border-left-color: #9b59b6;
}

.log-entry-compact.system {
  border-left-color: #95a5a6;
}

.log-time-compact {
  color: #7f8c8d;
  font-size: 8px;
  min-width: 25px;
  flex-shrink: 0;
}

.log-content-compact {
  flex: 1;
}

.log-message-compact {
  color: #ecf0f1;
  margin-bottom: 2px;
  line-height: 1.3;
  font-size: 10px;
}

.log-changes-compact {
  display: flex;
  gap: 6px;
  font-size: 9px;
  font-weight: bold;
}

.money-change-compact {
  color: #e74c3c;
}

.money-change-compact.positive {
  color: #2ecc71;
}

.rep-change-compact {
  color: #e74c3c;
}

.rep-change-compact.positive {
  color: #f39c12;
}

.no-logs-compact {
  text-align: center;
  color: #7f8c8d;
  padding: 20px;
  font-size: 11px;
}
</style>