<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import guideImgDetail from '../assets/images/guide_1.png' // Using existing guide image as placeholder

import { scenicSpots } from '../data/scenicSpots'

const router = useRouter()
const route = useRoute()

// Find current spot from shared data
const currentSpot = scenicSpots.find(s => s.name === route.params.id)

// Mock data for the guide
const guideDetail = ref({
  title: route.params.id || '黄河口一日游全攻略',
  author: '度假小助手',
  date: '2026-03-31',
  views: '1.2w',
  tags: [currentSpot?.tag || '热门', '推荐'],
  image: currentSpot?.image || guideImgDetail,
  content: [
    {
      type: 'section',
      title: '景点概览',
      text: currentSpot?.description || '从游客中心出发，建议乘坐观光巴士前往蓝黄交汇处。沿途可以欣赏到壮观的红滩绿苇，这是大自然最年轻的湿地奇观。'
    },
    {
      type: 'section',
      title: '精彩亮点',
      text: '不容错过的“孤岛槐林”，万亩槐林在花开季节香飘十里。此外，“万鸟翔集”是摄影爱好者的天堂，运气好的话可以见到东方白鹳。'
    },
    {
      type: 'section',
      title: '贴心小提示',
      text: '由于海边风大，建议携带防风外套。防晒霜和驱蚊喷雾也是必不可少的。最佳游览时间为上午10点至下午4点。'
    }
  ]
})

const goBack = () => {
  router.back()
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
        <div class="view-stats">
          <span class="eye-icon">👁️</span>
          <span class="view-count">{{ guideDetail.views }}</span>
        </div>
      </div>

      <div class="article-body">
        <div v-for="(section, index) in guideDetail.content" :key="index" class="content-section">
          <h2 class="section-title">{{ section.title }}</h2>
          <p class="section-text">{{ section.text }}</p>
        </div>
      </div>
    </main>

    <!-- Sticky Footer -->
    <footer class="engagement-bar">
      <div class="action-btn">
        <span class="icon">🧡</span>
        <span class="label">赞</span>
      </div>
      <div class="action-btn">
        <span class="icon">⭐</span>
        <span class="label">收藏</span>
      </div>
      <div class="action-btn">
        <span class="icon">💬</span>
        <span class="label">评论</span>
      </div>
      <button class="share-major-btn">
        <span class="icon">↗️</span>
        <span class="text">分享全攻略</span>
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

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
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
