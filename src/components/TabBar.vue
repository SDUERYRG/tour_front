<script setup lang="ts">
const tabs = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '导航', path: '/guide', icon: '📍' },
  { name: '商城', path: '/shop', icon: '🛒' },
  { name: '我的', path: '/profile', icon: '👤' },
]
</script>

<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      custom
      v-slot="{ navigate, isActive }"
    >
      <div
        class="tab-item"
        :class="{ active: isActive }"
        @click="navigate"
      >
        <span class="icon">{{ tab.icon }}</span>
        <span class="label">{{ tab.name }}</span>
      </div>
    </router-link>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 9999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: #999;
  flex: 1;
  transition: all 0.2s ease;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.tab-item .icon {
  font-size: 20px;
}

.tab-item .label {
  font-size: 11px;
  font-weight: 500;
}

.tab-item.active {
  color: #6e8efb;
}

.tab-item.active .icon {
  transform: translateY(-2px);
}
</style>
