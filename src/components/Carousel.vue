<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  interval: 3000
})

const currentIndex = ref(0)
const timer = ref<number | null>(null)
const touchStartX = ref(0)
const touchEndX = ref(0)

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const startTimer = () => {
  timer.value = window.setInterval(next, props.interval)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// Swipe logic
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  stopTimer()
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX
  handleSwipe()
  startTimer()
}

const handleSwipe = () => {
  const swipeDistance = touchEndX.value - touchStartX.value
  const threshold = 50 // Minimum distance to trigger a swipe

  if (swipeDistance > threshold) {
    prev()
  } else if (swipeDistance < -threshold) {
    next()
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>

<template>
  <div 
    class="carousel-container" 
    @mouseenter="stopTimer" 
    @mouseleave="startTimer"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div 
      class="carousel-wrapper" 
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div 
        v-for="(img, index) in images" 
        :key="index" 
        class="carousel-item"
      >
        <img :src="img" alt="Carousel image" />
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="carousel-dots">
      <span 
        v-for="(_, index) in images" 
        :key="index" 
        class="dot" 
        :class="{ active: index === currentIndex }"
        @click="currentIndex = index"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  touch-action: pan-y; /* Allow vertical scroll while capturing horizontal swipes */
}

.carousel-wrapper {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-item {
  flex: 0 0 100%;
  height: 100%;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}

.carousel-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  width: 18px;
  border-radius: 3px;
  background: #fff;
}

@media (max-width: 768px) {
  .carousel-container {
    aspect-ratio: 4 / 3;
  }
}
</style>
