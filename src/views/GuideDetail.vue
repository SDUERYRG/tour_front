<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import guideImgDetail from '../assets/images/guide_1.png'
import { showToast } from '../utils/toast'
import { scenicSpots } from '../data/scenicSpots'

const router = useRouter()
const route = useRoute()

// Reactive state for the guide detail
const guideDetail = ref({
  title: route.params.id as string || '黄河口一日游全攻略',
  author: '度假小助手',
  date: '2026-03-31',
  views: '1.2w',
  tags: ['热门', '推荐'],
  image: guideImgDetail,
  content: [
    {
      type: 'section',
      title: '景点简介',
      text: ''
    }
  ]
})

const isSpeaking = ref(false)
let utterance: SpeechSynthesisUtterance | null = null

const toggleSpeech = () => {
  if (isSpeaking.value) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }

  const textToRead = guideDetail.value.content[0].text
  if (!textToRead) return

  utterance = new SpeechSynthesisUtterance(textToRead)
  utterance.lang = 'zh-CN'
  utterance.onend = () => {
    isSpeaking.value = false
  }
  utterance.onerror = () => {
    isSpeaking.value = false
  }

  window.speechSynthesis.speak(utterance)
  isSpeaking.value = true
}

// Find initial data from static records
const initialSpot = scenicSpots.find(s => s.name === route.params.id)
if (initialSpot) {
  guideDetail.value.tags = [initialSpot.tag || '热门', '推荐']
  guideDetail.value.image = initialSpot.image
  guideDetail.value.content[0].text = initialSpot.description
} else {
  guideDetail.value.content[0].text = '正在加载景点描述...'
}

const fetchSpotDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/scenic-spots/range?startId=1&endId=13', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    
    if (result.code === 200 && Array.isArray(result.data)) {
      const spot = result.data.find((item: any) => item.name === route.params.id)
      if (spot) {
        guideDetail.value.tags = [spot.tag || '热门', '推荐']
        guideDetail.value.image = spot.imageUrl || guideDetail.value.image
        // Show only original description content
        guideDetail.value.content[0].text = spot.description
      }
    }
  } catch (error) {
    console.error('Failed to fetch spot detail:', error)
  }
}

onMounted(() => {
  fetchSpotDetail()
})

onUnmounted(() => {
  window.speechSynthesis.cancel()
})

const goBack = () => {
  router.back()
}

const handleShare = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('链接已复制到剪贴板', 'success')
  }).catch(() => {
    showToast('复制失败，请手动复制', 'error')
  })
}
</script>

<template>
  <div class="guide-detail">
    <!-- Immersive Header -->
    <header class="guide-header">
      <img :src="guideDetail.image" class="cover-img" alt="Guide Cover" />
      <button class="back-btn" @click="goBack">
        <span class="icon">〈</span>
      </button>
      <div class="header-overlay">
        <div class="tag-list">
          <span v-for="tag in guideDetail.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <main class="content-container">
      <h1 class="guide-title">{{ guideDetail.title }}</h1>

      <div class="author-info">
        <div class="author-meta">
          <span class="author-name">by {{ guideDetail.author }}</span>
          <span class="pub-date">{{ guideDetail.date }}</span>
        </div>
      </div>
      <div class="article-body">
        <div v-for="(section, index) in guideDetail.content" :key="index" class="content-section">
          <div class="section-header-row">
            <h2 class="section-title">{{ section.title }}</h2>
            <button v-if="section.title === '景点简介'" class="voice-btn" @click="toggleSpeech" :class="{ active: isSpeaking }">
              <span class="icon">{{ isSpeaking ? '⏹️' : '🔊' }}</span>
              <span class="text">{{ isSpeaking ? '正在播放' : '语音讲解' }}</span>
            </button>
          </div>
          <p class="section-text">{{ section.text }}</p>
        </div>
      </div>
    </main>

    <!-- Sticky Footer -->
    <footer class="engagement-bar">
      <button class="share-major-btn" @click="handleShare">
        <span class="icon">↗️</span>
        <span class="text">分享详情</span>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.guide-detail {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 80px;
}

/* Header Section */
.guide-header {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-btn {
  position: absolute;
  top: 44px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.header-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 16px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
}

.tag-list {
  display: flex;
  gap: 8px;
}

.tag {
  font-size: 11px;
  background-color: #6e8efb;
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 500;
}

/* Content Area */
.content-container {
  padding: 24px 20px;
}

.guide-title {
  font-size: 24px;
  font-weight: 800;
  color: #333;
  line-height: 1.4;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.author-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #999;
}

.view-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #bbb;
}

.article-body {
  line-height: 1.8;
  color: #444;
}

.content-section {
  margin-bottom: 28px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0; /* Override previous margin */
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f4ff;
  border: 1px solid #6e8efb;
  color: #6e8efb;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.voice-btn.active {
  background: #6e8efb;
  color: #fff;
}

.voice-btn .icon {
  font-size: 14px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background-color: #6e8efb;
  border-radius: 2px;
}

.section-text {
  font-size: 15px;
  color: #555;
  text-align: justify;
  white-space: pre-wrap;
}

/* Footer Section */
.engagement-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.action-btn .icon {
  font-size: 18px;
}

.action-btn .label {
  font-size: 10px;
  color: #666;
}

.share-major-btn {
  flex: 1;
  height: 44px;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  border: none;
  border-radius: 22px;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(110, 142, 251, 0.3);
}

.share-major-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}
</style>
