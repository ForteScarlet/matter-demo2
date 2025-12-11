<template>
  <GameApp />
</template>

<script setup lang="ts">
import GameApp from './components/GameApp.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #1a252f;
  color: #ecf0f1;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #2c3e50;
}

::-webkit-scrollbar-thumb {
  background: #7f8c8d;
  border: 2px solid #2c3e50;
}

::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
</style>
