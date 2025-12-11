<template>
  <div class="employee-panel-compact">
    <div class="panel-header">
      <h3>👥 团队 ({{ store.employees.length }}/{{ stageConfig.maxEmployees }})</h3>
    </div>
    
    <div class="hire-section">
      <button 
        v-for="job in availableJobs" 
        :key="job"
        @click="openHireDialog(job)"
        class="hire-btn-compact"
        :disabled="store.employees.length >= stageConfig.maxEmployees"
      >
        + {{ getJobName(job) }}
      </button>
    </div>
    
    <div class="employee-list-compact">
      <div 
        v-for="emp in store.employees" 
        :key="emp.id"
        class="employee-card-compact"
        :class="{ working: emp.currentProjectId }"
      >
        <div class="emp-header-compact">
          <div class="emp-name">{{ emp.name }}</div>
          <div class="emp-meta">
            <span class="emp-job">{{ getJobName(emp.jobType) }}</span>
            <span class="emp-level">Lv.{{ emp.level }}</span>
          </div>
        </div>
        
        <div class="emp-stats-compact">
          <div class="stat-bar-mini">
            <span class="bar-label-mini">满意</span>
            <div class="bar-bg-mini">
              <div class="bar-fill satisfaction" :style="{ width: emp.satisfaction + '%' }"></div>
            </div>
            <span class="bar-value-mini">{{ Math.round(emp.satisfaction) }}</span>
          </div>
          
          <div class="stat-bar-mini">
            <span class="bar-label-mini">疲劳</span>
            <div class="bar-bg-mini">
              <div class="bar-fill fatigue" :style="{ width: emp.fatigue + '%' }"></div>
            </div>
            <span class="bar-value-mini">{{ Math.round(emp.fatigue) }}</span>
          </div>
        </div>
        
        <div class="emp-info-compact">
          <span class="info-mini">💰¥{{ Math.round(emp.salary) }}</span>
          <span class="info-mini">⚡{{ (emp.baseEfficiency * 100).toFixed(0) }}%</span>
          <span class="info-mini">⭐{{ (emp.qualityFactor * 100).toFixed(0) }}%</span>
        </div>
        
        <div class="emp-actions-compact">
          <button 
            v-if="emp.jobType === 'product_manager' || emp.jobType === 'tester'"
            @click="store.toggleEmployeeWorkStatus(emp.id)"
            class="btn-mini"
            :class="{ working: emp.isWorking }"
          >
            {{ emp.isWorking ? '🟢' : '🔴' }}
          </button>
          <button 
            @click="fireEmployee(emp.id)"
            class="btn-mini fire"
            :disabled="emp.currentProjectId !== undefined"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
    
    <!-- 雇佣对话框 -->
    <div v-if="showHireDialog" class="modal-overlay" @click="closeHireDialog">
      <div class="modal-content" @click.stop>
        <h3>雇佣{{ getJobName(selectedJobType!) }}</h3>
        
        <!-- 候选人列表 -->
        <div class="candidates-list">
          <h4>选择候选人 (三选一):</h4>
          <div class="candidate-cards">
            <div 
              v-for="candidate in candidates" 
              :key="candidate.id"
              class="candidate-card"
              :class="{ selected: selectedCandidate?.id === candidate.id }"
              @click="selectedCandidate = candidate"
            >
              <div class="candidate-name">{{ candidate.name }}</div>
              <div class="candidate-stats">
                <div class="stat-item">
                  <span class="stat-label">效率:</span>
                  <span class="stat-value">{{ (candidate.baseEfficiency * 100).toFixed(0) }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">质量:</span>
                  <span class="stat-value">{{ (candidate.qualityFactor * 100).toFixed(0) }}%</span>
                </div>
                <div class="stat-item salary">
                  <span class="stat-label">工资:</span>
                  <span class="stat-value">¥{{ Math.round(candidate.salary) }}/天</span>
                </div>
              </div>
              <div class="candidate-specialties">
                <span class="specialty-tag" v-for="spec in candidate.specialties" :key="spec">
                  {{ getSpecialtyName(spec) }}
                </span>
              </div>
              <div class="candidate-traits" v-if="candidate.traits.length > 0">
                <span class="trait-tag" v-for="trait in candidate.traits" :key="trait">
                  {{ TRAITS[trait].name }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button 
            @click="confirmHire" 
            class="btn-primary"
            :disabled="!selectedCandidate"
          >
            确认雇佣
          </button>
          <button @click="closeHireDialog" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { TRAITS, JOB_CONFIGS, type JobType, type TraitType, type EmployeeCandidate, type Specialty } from '../types/game'

const store = useGameStore()

const stageConfig = computed(() => store.currentStageConfig)
const showHireDialog = ref(false)
const selectedJobType = ref<JobType | null>(null)
const candidates = ref<EmployeeCandidate[]>([])
const selectedCandidate = ref<EmployeeCandidate | null>(null)

const availableJobs = computed(() => {
  return stageConfig.value.unlockedJobs
})

function getJobName(job: JobType): string {
  return JOB_CONFIGS[job].name
}

function getTraitName(trait: TraitType): string {
  return TRAITS[trait].name
}

function getSpecialtyName(spec: Specialty): string {
  const names: Record<Specialty, string> = {
    web_frontend: 'Web前端',
    mobile: '移动开发',
    backend: '后端',
    ai_bigdata: 'AI/大数据',
    game: '游戏开发'
  }
  return names[spec]
}

function openHireDialog(job: JobType) {
  selectedJobType.value = job
  candidates.value = store.generateEmployeeCandidates(job)
  selectedCandidate.value = null
  showHireDialog.value = true
}

function confirmHire() {
  if (selectedCandidate.value) {
    store.hireEmployee(selectedCandidate.value)
    closeHireDialog()
  }
}

function closeHireDialog() {
  showHireDialog.value = false
  candidates.value = []
  selectedCandidate.value = null
  selectedJobType.value = null
}

function fireEmployee(id: string) {
  if (confirm('确定要解雇这名员工吗？')) {
    store.fireEmployee(id)
  }
}
</script>

<style scoped>
.employee-panel-compact {
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #7f8c8d;
}

.panel-header h3 {
  margin: 0;
  color: #ecf0f1;
  font-size: 14px;
}

.hire-section {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.hire-btn-compact {
  background: #27ae60;
  color: #ecf0f1;
  border: 1px solid #229954;
  padding: 4px 8px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  transition: all 0.2s;
  flex: 1;
  min-width: 70px;
}

.hire-btn-compact:hover:not(:disabled) {
  background: #2ecc71;
}

.hire-btn-compact:disabled {
  background: #7f8c8d;
  border-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.5;
}

.employee-list-compact {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.employee-card-compact {
  background: #2c3e50;
  border: 1px solid #7f8c8d;
  padding: 6px;
  transition: all 0.2s;
  font-size: 10px;
}

.employee-card-compact.working {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.emp-header-compact {
  margin-bottom: 4px;
}

.emp-name {
  color: #ecf0f1;
  font-weight: bold;
  font-size: 11px;
}

.emp-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.emp-job {
  color: #3498db;
  font-size: 9px;
}

.emp-level {
  color: #f39c12;
  font-size: 9px;
  font-weight: bold;
}

.emp-stats-compact {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 4px;
}

.stat-bar-mini {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bar-label-mini {
  font-size: 8px;
  color: #95a5a6;
  min-width: 28px;
}

.bar-bg-mini {
  flex: 1;
  height: 8px;
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

.bar-value-mini {
  font-size: 8px;
  color: #ecf0f1;
  min-width: 20px;
  text-align: right;
}

.emp-info-compact {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 9px;
}

.info-mini {
  color: #bdc3c7;
}

.emp-actions-compact {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.btn-mini {
  background: #7f8c8d;
  color: #ecf0f1;
  border: 1px solid #95a5a6;
  padding: 2px 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  transition: all 0.2s;
}

.btn-mini:hover:not(:disabled) {
  opacity: 0.8;
}

.btn-mini:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-mini.working {
  background: #27ae60;
  border-color: #229954;
}

.btn-mini.fire {
  background: #e74c3c;
  border-color: #c0392b;
}

.btn-mini.fire:hover:not(:disabled) {
  background: #c0392b;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #2c3e50;
  padding: 25px;
  border: 3px solid #34495e;
  max-width: 650px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  color: #ecf0f1;
  margin: 0 0 20px 0;
  font-size: 18px;
}

.candidates-list h4 {
  color: #3498db;
  margin-bottom: 15px;
  font-size: 14px;
}

.candidate-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.candidate-card {
  background: #34495e;
  border: 2px solid #7f8c8d;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.candidate-card:hover {
  border-color: #3498db;
  transform: translateX(5px);
}

.candidate-card.selected {
  border-color: #2ecc71;
  background: #2c5f3f;
}

.candidate-name {
  color: #ecf0f1;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.candidate-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  gap: 5px;
  font-size: 12px;
}

.stat-label {
  color: #95a5a6;
}

.stat-value {
  color: #ecf0f1;
  font-weight: bold;
}

.stat-item.salary .stat-value {
  color: #f39c12;
}

.candidate-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}

.specialty-tag {
  background: #3498db;
  color: #ecf0f1;
  padding: 2px 8px;
  font-size: 11px;
  border: 1px solid #2980b9;
}

.candidate-traits {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.trait-tag {
  background: #9b59b6;
  color: #ecf0f1;
  padding: 2px 8px;
  font-size: 11px;
  border: 1px solid #8e44ad;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary {
  padding: 10px 20px;
  background: #2ecc71;
  border: 2px solid #27ae60;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #27ae60;
}

.btn-primary:disabled {
  background: #7f8c8d;
  border-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-secondary {
  padding: 10px 20px;
  background: #7f8c8d;
  border: 2px solid #95a5a6;
  color: #ecf0f1;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #95a5a6;
}
</style>