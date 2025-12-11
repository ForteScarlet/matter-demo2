<template>
  <div class="employee-panel">
    <div class="panel-header">
      <h2>👥 团队管理</h2>
      <div class="employee-count">{{ store.employees.length }} / {{ stageConfig.maxEmployees }}</div>
    </div>
    
    <div class="hire-section">
      <button 
        v-for="job in availableJobs" 
        :key="job"
        @click="hireEmployee(job)"
        class="hire-btn"
        :disabled="store.employees.length >= stageConfig.maxEmployees"
      >
        + 雇佣{{ getJobName(job) }}
      </button>
    </div>
    
    <div class="employee-list">
      <div 
        v-for="emp in store.employees" 
        :key="emp.id"
        class="employee-card"
        :class="{ working: emp.currentProjectId }"
      >
        <div class="emp-header">
          <div class="emp-name">{{ emp.name }}</div>
          <div class="emp-job">{{ getJobName(emp.jobType) }}</div>
          <div class="emp-level">Lv.{{ emp.level }}</div>
        </div>
        
        <div class="emp-stats">
          <div class="stat-bar">
            <span class="bar-label">满意度</span>
            <div class="bar-bg">
              <div class="bar-fill satisfaction" :style="{ width: emp.satisfaction + '%' }"></div>
            </div>
            <span class="bar-value">{{ Math.round(emp.satisfaction) }}</span>
          </div>
          
          <div class="stat-bar">
            <span class="bar-label">疲劳度</span>
            <div class="bar-bg">
              <div class="bar-fill fatigue" :style="{ width: emp.fatigue + '%' }"></div>
            </div>
            <span class="bar-value">{{ Math.round(emp.fatigue) }}</span>
          </div>
        </div>
        
        <div class="emp-info">
          <div class="info-row">
            <span class="info-label">工资:</span>
            <span class="info-value">¥{{ emp.salary }}/天</span>
          </div>
          <div class="info-row">
            <span class="info-label">效率:</span>
            <span class="info-value">{{ emp.baseEfficiency.toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">质量:</span>
            <span class="info-value">{{ emp.qualityFactor.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="emp-traits" v-if="emp.traits.length > 0">
          <span 
            v-for="trait in emp.traits" 
            :key="trait"
            class="trait-badge"
          >
            {{ getTraitName(trait) }}
          </span>
        </div>
        
        <div class="emp-actions">
          <button 
            @click="fireEmployee(emp.id)"
            class="fire-btn"
            :disabled="emp.currentProjectId !== undefined"
          >
            解雇
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { TRAITS, JOB_CONFIGS, type JobType, type TraitType } from '../types/game'

const store = useGameStore()

const stageConfig = computed(() => store.currentStageConfig)

const availableJobs = computed(() => {
  return stageConfig.value.unlockedJobs
})

function getJobName(job: JobType): string {
  return JOB_CONFIGS[job].name
}

function getTraitName(trait: TraitType): string {
  return TRAITS[trait].name
}

function hireEmployee(job: JobType) {
  store.hireEmployee(job)
}

function fireEmployee(id: string) {
  if (confirm('确定要解雇这名员工吗？')) {
    store.fireEmployee(id)
  }
}
</script>

<style scoped>
.employee-panel {
  background: #34495e;
  border: 3px solid #2c3e50;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h2 {
  margin: 0;
  color: #ecf0f1;
  font-size: 18px;
}

.employee-count {
  color: #95a5a6;
  font-size: 14px;
}

.hire-section {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.hire-btn {
  background: #27ae60;
  color: #ecf0f1;
  border: 2px solid #229954;
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.2s;
}

.hire-btn:hover:not(:disabled) {
  background: #2ecc71;
  transform: translateY(-2px);
}

.hire-btn:disabled {
  background: #7f8c8d;
  border-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.5;
}

.employee-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.employee-card {
  background: #2c3e50;
  border: 2px solid #7f8c8d;
  padding: 12px;
  transition: all 0.2s;
}

.employee-card.working {
  border-color: #3498db;
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
}

.emp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.emp-name {
  color: #ecf0f1;
  font-weight: bold;
  font-size: 14px;
}

.emp-job {
  color: #3498db;
  font-size: 12px;
}

.emp-level {
  color: #f39c12;
  font-size: 12px;
  font-weight: bold;
}

.emp-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 11px;
  color: #95a5a6;
  min-width: 50px;
}

.bar-bg {
  flex: 1;
  height: 12px;
  background: #1a252f;
  border: 1px solid #7f8c8d;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
}

.bar-fill.satisfaction {
  background: linear-gradient(90deg, #e74c3c 0%, #f39c12 50%, #2ecc71 100%);
}

.bar-fill.fatigue {
  background: linear-gradient(90deg, #2ecc71 0%, #f39c12 50%, #e74c3c 100%);
}

.bar-value {
  font-size: 11px;
  color: #ecf0f1;
  min-width: 30px;
  text-align: right;
}

.emp-info {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.info-row {
  display: flex;
  gap: 5px;
}

.info-label {
  font-size: 11px;
  color: #95a5a6;
}

.info-value {
  font-size: 11px;
  color: #ecf0f1;
  font-weight: bold;
}

.emp-traits {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.trait-badge {
  background: #7f8c8d;
  color: #ecf0f1;
  padding: 2px 8px;
  font-size: 10px;
  border: 1px solid #95a5a6;
}

.emp-actions {
  display: flex;
  justify-content: flex-end;
}

.fire-btn {
  background: #e74c3c;
  color: #ecf0f1;
  border: 2px solid #c0392b;
  padding: 6px 12px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  transition: all 0.2s;
}

.fire-btn:hover:not(:disabled) {
  background: #c0392b;
}

.fire-btn:disabled {
  background: #7f8c8d;
  border-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.5;
}
</style>