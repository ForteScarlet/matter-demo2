import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// 注册全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info)
}
