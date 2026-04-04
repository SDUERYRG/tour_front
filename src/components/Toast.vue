<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const emit = defineEmits(['close'])
const visible = ref(false)

onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 300)
  }, props.duration || 2500)
})
</script>

<template>
  <Transition name="toast-fade">
    <div v-if="visible" class="toast-container" :class="type || 'info'">
      <div class="toast-content">
        <span class="toast-icon">
          <template v-if="type === 'success'">✅</template>
          <template v-else-if="type === 'error'">❌</template>
          <template v-else>💡</template>
        </span>
        <span class="toast-text">{{ message }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 200px;
  max-width: 85vw;
  padding: 12px 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.success {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.error {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.info {
  background: rgba(67, 97, 238, 0.9);
  color: white;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-icon {
  font-size: 18px;
}

.toast-text {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}
</style>
