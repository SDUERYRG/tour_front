<script setup lang="ts">
import TabBar from './components/TabBar.vue'
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TabBar />
  </div>
</template>

<style>
:root {
  --primary-color: #6e8efb;
  --secondary-color: #a777e3;
  --bg-color: #f8f9fa;
  --text-color: #333;
  --card-bg: #fff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.5;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  position: relative;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
