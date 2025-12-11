<template>
  <div class="project-panel">
    <div class="panel-header">
      <h2>📋 项目管理</h2>
      <div class="project-stats">
        <span>项目池: {{ store.projectPool.length }} / {{ stageConfig.projectPoolCapacity }}</span>
        <span>生成率: {{ store.projectGenerationRate.toFixed(2) }}/天</span>
        <span>消化率: {{ store.projectDigestionRate.toFixed(2) }}/天</span>
      </div>
    </div>
    
    <div class="project-pipeline">
      <div class="stage-column">
        <div class="stage-header">设计</div>
        <div class="stage-projects">
          <div 
            v-for="project in designProjects" 
            :key="project.id"
            class="project-card"
            :class="{ urgent: project.isUrgent }"
          >
            <div class="project-header">
              <span class="project-type">{{ getProjectTypeName(project.type) }}</span>
              <span class="project-budget">¥{{ formatMoney(project.budget) }}</span>
            </div>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (project.stageProgress * 100) + '%' }"></div>
              </div>
              <span class="progress-text">{{ Math.round(project.stageProgress * 100) }}%</span>
            </div>
            <div class="project-info">
              <div class="info-item">
                <span>复杂度: {{ project.complexity }}</span>
              </div>
              <div class="info-item">
                <span>剩余: {{ getRemainingDays(project) }}天</span>
              </div>
            </div>
            <div class="assigned-employees">
              <span v-if="project.assignedEmployees.length === 0" class="no-worker">等待分配</span>
              <span v-else class="worker-name">{{ getEmployeeName(project.assignedEmployees[0]) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stage-column">
        <div class="stage-header">开发</div>
        <div class="stage-projects">
          <div 
            v-for="project in developmentProjects" 
            :key="project.id"
            class="project-card"
            :class="{ urgent: project.isUrgent }"
          >
            <div class="project-header">
              <span class="project-type">{{ getProjectTypeName(project.type) }}</span>
              <span class="project-budget">¥{{ formatMoney(project.budget) }}</span>
            </div>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (project.stageProgress * 100) + '%' }"></div>
              </div>
              <span class="progress-text">{{ Math.round(project.stageProgress * 100) }}%</span>
            </div>
            <div class="project-info">
              <div class="info-item">
                <span>性能: {{ project.performance?.toFixed(1) || '-' }}</span>
              </div>
              <div class="info-item">
                <span>剩余: {{ getRemainingDays(project) }}天</span>
              </div>
            </div>
            <div class="assigned-employees">
              <span v-if="project.assignedEmployees.length === 0" class="no-worker">等待分配</span>
              <span v-else class="worker-name">{{ getEmployeeName(project.assignedEmployees[0]) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stage-column">
        <div class="stage-header">测试</div>
        <div class="stage-projects">
          <div 
            v-for="project in testingProjects" 
            :key="project.id"
            class="project-card"
            :class="{ urgent: project.isUrgent }"
          >
            <div class="project-header">
              <span class="project-type">{{ getProjectTypeName(project.type) }}</span>
              <span class="project-budget">¥{{ formatMoney(project.budget) }}</span>
            </div>
            <div class="project-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (project.stageProgress * 100) + '%' }"></div>
              </div>
              <span class="progress-text">{{ Math.round(project.stageProgress * 100) }}%</span>
            </div>
            <div class="project-info">
              <div class="info-item">
                <span>Bug率: {{ project.bugRate?.toFixed(1) || '-' }}%</span>
              </div>
              <div class="info-item">
                <span>剩余: {{ getRemainingDays(project) }}天</span>
              </div>
            </div>
            <div class="assigned-employees">
              <span v-if="project.assignedEmployees.length === 0" class="no-worker">等待分配</span>
              <span v-else class="worker-name">{{ getEmployeeName(project.assignedEmployees[0]) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="stage-column">
        <div class="stage-header">已完成</div>
        <div class="stage-projects">
          <div 
            v-for="project in completedProjects" 
            :key="project.id"
            class="project-card completed"
          >
            <div class="project-header">
              <span class="project-type">{{ getProjectTypeName(project.type) }}</span>
              <span class="project-income success">+¥{{ formatMoney(project.finalIncome || 0) }}</span>
            </div>
            <div class="project-info">
              <div class="info-item">
                <span>质量分: {{ project.qualityScore?.toFixed(2) || '-' }}</span>
              </div>
              <div class="info-item">
                <span>耗时: {{ store.currentDay - project.startDate }}天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { PROJECT_TYPE_CONFIGS, type ProjectType } from '../types/game'

const store = useGameStore()

const stageConfig = computed(() => store.currentStageConfig)

const designProjects = computed(() => 
  store.projects.filter(p => p.stage === 'design')
)

const developmentProjects = computed(() => 
  store.projects.filter(p => p.stage === 'development')
)

const testingProjects = computed(() => 
  store.projects.filter(p => p.stage === 'testing')
)

const completedProjects = computed(() => 
  store.projects.filter(p => p.stage === 'completed').slice(-5)
)

function getProjectTypeName(type: ProjectType): string {
  return PROJECT_TYPE_CONFIGS[type].name
}

function formatMoney(amount: number): string {
  return Math.round(amount).toLocaleString()
}

function getRemainingDays(project: any): number {
  return Math.max(0, project.deadline - (store.currentDay - project.startDate))
}

function getEmployeeName(empId: string): string {
  const emp = store.employees.find(e => e.id === empId)
  return emp ? emp.name : '未知'
}
</script>

<style scoped>
.project-panel {
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

.project-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #95a5a6;
}

.project-pipeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stage-column {
  display: flex;
  flex-direction: column;
}

.stage-header {
  background: #2c3e50;
  color: #3498db;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  border: 2px solid #7f8c8d;
  margin-bottom: 10px;
}

.stage-projects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-card {
  background: #2c3e50;
  border: 2px solid #7f8c8d;
  padding: 10px;
  transition: all 0.2s;
}

.project-card.urgent {
  border-color: #e74c3c;
  animation: pulse 2s infinite;
}

.project-card.completed {
  opacity: 0.7;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-type {
  color: #3498db;
  font-size: 12px;
  font-weight: bold;
}

.project-budget {
  color: #f39c12;
  font-size: 11px;
}

.project-income.success {
  color: #2ecc71;
  font-weight: bold;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #1a252f;
  border: 1px solid #7f8c8d;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.3s;
}

.progress-text {
  font-size: 10px;
  color: #95a5a6;
  min-width: 35px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.info-item {
  font-size: 11px;
  color: #95a5a6;
}

.assigned-employees {
  padding-top: 8px;
  border-top: 1px solid #7f8c8d;
}

.no-worker {
  font-size: 10px;
  color: #e74c3c;
  font-style: italic;
}

.worker-name {
  font-size: 10px;
  color: #2ecc71;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.8);
  }
}
</style>