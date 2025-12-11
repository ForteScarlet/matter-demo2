<template>
  <div v-if="isOpen" class="manual-overlay" @click="close">
    <div class="manual-container" @click.stop>
      <div class="manual-header">
        <h2>📖 游戏说明手册</h2>
        <button @click="close" class="close-btn">✕</button>
      </div>
      
      <div class="manual-content">
        <div class="manual-nav">
          <button 
            v-for="section in sections" 
            :key="section.id"
            @click="currentSection = section.id"
            class="nav-btn"
            :class="{ active: currentSection === section.id }"
          >
            {{ section.icon }} {{ section.title }}
          </button>
        </div>
        
        <div class="manual-body">
          <!-- 游戏介绍 -->
          <div v-if="currentSection === 'intro'" class="section">
            <h3>🎮 游戏介绍</h3>
            <p>欢迎来到《Coder's Paradise》——一款软件公司经营模拟游戏。</p>
            <p>你将从车库创业起步，通过雇佣员工、接取项目、交付产品来发展你的软件公司，最终成为行业标杆。</p>
            
            <h4>游戏目标</h4>
            <ul>
              <li>管理资金，保持公司运营</li>
              <li>雇佣合适的员工组建团队</li>
              <li>完成项目，赚取收入和声望</li>
              <li>升级公司阶段，解锁更多功能</li>
              <li>平衡工作效率与员工满意度</li>
            </ul>
          </div>
          
          <!-- 基础操作 -->
          <div v-if="currentSection === 'controls'" class="section">
            <h3>⌨️ 基础操作</h3>
            
            <h4>快捷键</h4>
            <div class="key-list">
              <div class="key-item">
                <kbd>空格</kbd>
                <span>暂停/继续游戏</span>
              </div>
              <div class="key-item">
                <kbd>1</kbd>
                <span>0.5倍速</span>
              </div>
              <div class="key-item">
                <kbd>2</kbd>
                <span>1倍速（正常）</span>
              </div>
              <div class="key-item">
                <kbd>3</kbd>
                <span>2倍速</span>
              </div>
              <div class="key-item">
                <kbd>4</kbd>
                <span>5倍速</span>
              </div>
              <div class="key-item">
                <kbd>F5</kbd>
                <span>手动保存</span>
              </div>
            </div>
            
            <h4>界面说明</h4>
            <ul>
              <li><strong>顶部信息栏：</strong>显示资金、天数、声望、技术债等核心数据</li>
              <li><strong>项目生成进度：</strong>显示下一个项目何时生成</li>
              <li><strong>左侧面板：</strong>团队管理，雇佣和查看员工</li>
              <li><strong>中间面板：</strong>项目管理，查看和处理项目</li>
              <li><strong>底部日志：</strong>查看所有游戏事件记录</li>
            </ul>
          </div>
          
          <!-- 员工系统 -->
          <div v-if="currentSection === 'employees'" class="section">
            <h3>👥 员工系统</h3>
            
            <h4>职业类型</h4>
            <ul>
              <li><strong>产品经理：</strong>负责项目设计阶段，提升产品合理性和美观度</li>
              <li><strong>软件开发工程师：</strong>负责开发阶段（必须），决定性能和功能性</li>
              <li><strong>测试工程师：</strong>负责测试阶段，降低Bug率</li>
              <li><strong>售前：</strong>不参与项目开发，增加项目生成速度</li>
            </ul>
            
            <h4>员工属性</h4>
            <ul>
              <li><strong>效率：</strong>影响工作速度</li>
              <li><strong>质量：</strong>影响产出质量</li>
              <li><strong>满意度：</strong>低于30可能离职，高于80效率+10%</li>
              <li><strong>疲劳度：</strong>超过70降低效率，下班后恢复</li>
              <li><strong>专精领域：</strong>匹配项目类型时获得加成</li>
              <li><strong>特质：</strong>提供各种正面或负面效果</li>
            </ul>
            
            <h4>雇佣流程</h4>
            <ol>
              <li>点击"雇佣XX"按钮</li>
              <li>从3个随机候选人中选择1个</li>
              <li>候选人有不同的属性、工资和特质</li>
              <li>选择最适合当前需求的候选人</li>
            </ol>
            
            <h4>工作状态</h4>
            <p>产品经理和测试工程师可以切换"投入工作"或"暂离岗位"状态。只有投入工作时，对应阶段才会生效。</p>
          </div>
          
          <!-- 项目系统 -->
          <div v-if="currentSection === 'projects'" class="section">
            <h3>📦 项目系统</h3>
            
            <h4>项目生成</h4>
            <ul>
              <li>项目会根据公司阶段和售前人数自动生成</li>
              <li>顶部显示项目生成进度条</li>
              <li>项目池满时会流失客户并扣除声望</li>
            </ul>
            
            <h4>项目流程</h4>
            <ol>
              <li><strong>设计阶段（可选）：</strong>需要产品经理，且产品经理处于"投入工作"状态</li>
              <li><strong>开发阶段（必须）：</strong>需要软件开发工程师</li>
              <li><strong>测试阶段（可选）：</strong>需要测试工程师，且测试工程师处于"投入工作"状态</li>
              <li><strong>交付：</strong>自动结算收入和声望</li>
            </ol>
            
            <h4>项目属性</h4>
            <ul>
              <li><strong>预算：</strong>项目的基础收入</li>
              <li><strong>期限：</strong>完成期限，超期会扣款和降声望</li>
              <li><strong>复杂度：</strong>影响完成难度</li>
              <li><strong>清晰度：</strong>需求清晰程度，影响开发</li>
            </ul>
            
            <h4>质量评分</h4>
            <p>项目交付时会计算质量分，由以下因素决定：</p>
            <ul>
              <li>合理性（设计阶段）- 25%</li>
              <li>美观度（设计阶段）- 15%</li>
              <li>性能（开发阶段）- 30%</li>
              <li>Bug率（测试阶段）- 30%</li>
            </ul>
            <p>质量分越高，最终收入越高，声望增加也越多。</p>
          </div>
          
          <!-- 经营管理 -->
          <div v-if="currentSection === 'management'" class="section">
            <h3>💼 经营管理</h3>
            
            <h4>资金管理</h4>
            <ul>
              <li><strong>收入来源：</strong>项目交付收入</li>
              <li><strong>支出项目：</strong>每日工资、每月租金</li>
              <li>资金变化时会显示浮动数字特效</li>
              <li>保持充足资金避免破产</li>
            </ul>
            
            <h4>工作制度</h4>
            <ul>
              <li><strong>朝九晚五：</strong>均衡模式，9小时工作</li>
              <li><strong>996制度：</strong>效率+25%，但满意度大幅下降，技术债增加</li>
              <li><strong>弹性工作：</strong>满意度+0.8/天，技术债降低，但效率-10%</li>
            </ul>
            
            <h4>技术债</h4>
            <ul>
              <li>开发过程中积累，影响整体效率</li>
              <li>技术债过高会严重降低团队产出</li>
              <li>通过弹性工作或高质量开发来控制</li>
            </ul>
            
            <h4>声望系统</h4>
            <ul>
              <li>高质量交付增加声望</li>
              <li>延期交付降低声望</li>
              <li>声望影响员工满意度</li>
              <li>声望是公司升级的条件之一</li>
            </ul>
            
            <h4>平衡指标</h4>
            <p>项目消化率 / 项目生成率</p>
            <ul>
              <li><strong>绿色（0.8-1.5）：</strong>良好平衡</li>
              <li><strong>红色（&lt;0.8）：</strong>项目积压</li>
              <li><strong>橙色（&gt;1.5）：</strong>产能浪费</li>
            </ul>
          </div>
          
          <!-- 公司升级 -->
          <div v-if="currentSection === 'upgrade'" class="section">
            <h3>🏢 公司升级</h3>
            
            <h4>车库创业</h4>
            <ul>
              <li>最多3名员工</li>
              <li>只能雇佣开发工程师</li>
              <li>月租金：¥1,000</li>
              <li><strong>升级条件：</strong>总收入≥50,000，声望≥10</li>
            </ul>
            
            <h4>小型工作室</h4>
            <ul>
              <li>最多6名员工</li>
              <li>解锁产品经理</li>
              <li>月租金：¥3,000</li>
              <li><strong>升级条件：</strong>总收入≥200,000，声望≥30，拥有2名产品经理</li>
            </ul>
            
            <h4>正规公司</h4>
            <ul>
              <li>最多12名员工</li>
              <li>解锁测试工程师</li>
              <li>月租金：¥8,000</li>
              <li><strong>升级条件：</strong>总收入≥1,000,000，声望≥70，技术债&lt;40</li>
            </ul>
            
            <h4>行业标杆</h4>
            <ul>
              <li>最多20名员工</li>
              <li>解锁售前</li>
              <li>月租金：¥20,000</li>
              <li>最高级别</li>
            </ul>
          </div>
          
          <!-- 游戏提示 -->
          <div v-if="currentSection === 'tips'" class="section">
            <h3>💡 游戏提示</h3>
            
            <h4>新手建议</h4>
            <ul>
              <li>初期优先雇佣开发工程师，确保项目能开发</li>
              <li>注意控制员工数量，避免工资支出过大</li>
              <li>关注员工满意度和疲劳度，及时调整工作制度</li>
              <li>按时交付项目可以累积声望加成</li>
              <li>雇佣时选择专精匹配的员工可获得更好效果</li>
            </ul>
            
            <h4>进阶技巧</h4>
            <ul>
              <li>产品经理虽然可选，但能大幅提升项目质量和收入</li>
              <li>测试工程师可以显著降低Bug率，提高客户满意度</li>
              <li>员工特质很重要：完美主义者提高质量，快手提高速度</li>
              <li>技术债会严重影响效率，定期使用弹性工作制度</li>
              <li>售前能增加项目获取速度，但要确保团队能消化</li>
              <li>平衡项目生成和消化速度，避免积压或浪费</li>
            </ul>
            
            <h4>常见问题</h4>
            <ul>
              <li><strong>项目不推进？</strong>检查是否有对应阶段的员工，且处于"投入工作"状态</li>
              <li><strong>员工离职？</strong>满意度过低导致，提高工资或改善工作制度</li>
              <li><strong>资金不足？</strong>减少员工数量或加快项目交付</li>
              <li><strong>技术债过高？</strong>使用弹性工作制，雇佣高质量员工</li>
            </ul>
          </div>
          
          <!-- 存档系统 -->
          <div v-if="currentSection === 'save'" class="section">
            <h3>💾 存档系统</h3>
            
            <h4>自动保存</h4>
            <ul>
              <li>游戏每天（游戏内时间）自动保存一次</li>
              <li>自动保存时会显示通知气泡</li>
              <li>自动保存不占用手动存档槽位</li>
            </ul>
            
            <h4>手动保存</h4>
            <ul>
              <li>按<kbd>F5</kbd>键手动保存</li>
              <li>保存时会显示确认通知</li>
              <li>建议在重要决策前手动保存</li>
            </ul>
            
            <h4>读取存档</h4>
            <ul>
              <li>主菜单选择"继续游戏"加载最新存档</li>
              <li>可以从多个存档槽位中选择</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = defineModel<boolean>('isOpen', { default: false })

const currentSection = ref('intro')

const sections = [
  { id: 'intro', title: '游戏介绍', icon: '🎮' },
  { id: 'controls', title: '基础操作', icon: '⌨️' },
  { id: 'employees', title: '员工系统', icon: '👥' },
  { id: 'projects', title: '项目系统', icon: '📦' },
  { id: 'management', title: '经营管理', icon: '💼' },
  { id: 'upgrade', title: '公司升级', icon: '🏢' },
  { id: 'tips', title: '游戏提示', icon: '💡' },
  { id: 'save', title: '存档系统', icon: '💾' }
]

function close() {
  isOpen.value = false
}
</script>

<style scoped>
.manual-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  overflow: hidden;
}

.manual-container {
  background: #2c3e50;
  border: 3px solid #34495e;
  width: 90%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', monospace;
}

.manual-header {
  background: #34495e;
  padding: 15px 20px;
  border-bottom: 2px solid #7f8c8d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.manual-header h2 {
  margin: 0;
  color: #ecf0f1;
  font-size: 20px;
}

.close-btn {
  background: #e74c3c;
  color: #ecf0f1;
  border: 2px solid #c0392b;
  padding: 5px 15px;
  font-size: 18px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #c0392b;
}

.manual-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.manual-nav {
  width: 200px;
  background: #34495e;
  border-right: 2px solid #7f8c8d;
  overflow-y: auto;
  padding: 10px 0;
}

.nav-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #95a5a6;
  padding: 12px 15px;
  text-align: left;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-btn:hover {
  background: #2c3e50;
  color: #ecf0f1;
}

.nav-btn.active {
  background: #2c3e50;
  color: #3498db;
  border-left-color: #3498db;
}

.manual-body {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  color: #ecf0f1;
}

.section h3 {
  color: #3498db;
  margin: 0 0 20px 0;
  font-size: 18px;
  border-bottom: 2px solid #34495e;
  padding-bottom: 10px;
}

.section h4 {
  color: #f39c12;
  margin: 20px 0 10px 0;
  font-size: 15px;
}

.section p {
  line-height: 1.6;
  margin: 10px 0;
  color: #bdc3c7;
}

.section ul, .section ol {
  line-height: 1.8;
  margin: 10px 0;
  padding-left: 25px;
  color: #bdc3c7;
}

.section li {
  margin: 5px 0;
}

.section strong {
  color: #ecf0f1;
}

.key-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.key-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px 12px;
  background: #34495e;
  border: 1px solid #7f8c8d;
}

kbd {
  background: #1a252f;
  color: #ecf0f1;
  padding: 4px 10px;
  border: 2px solid #7f8c8d;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

/* 滚动条样式 */
.manual-nav::-webkit-scrollbar,
.manual-body::-webkit-scrollbar {
  width: 8px;
}

.manual-nav::-webkit-scrollbar-track,
.manual-body::-webkit-scrollbar-track {
  background: #1a252f;
}

.manual-nav::-webkit-scrollbar-thumb,
.manual-body::-webkit-scrollbar-thumb {
  background: #7f8c8d;
  border-radius: 4px;
}

.manual-nav::-webkit-scrollbar-thumb:hover,
.manual-body::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
</style>