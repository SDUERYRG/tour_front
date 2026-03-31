<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import foodImgDetail from '../assets/images/food_1.png' // Using existing food image as placeholder

const router = useRouter()
const route = useRoute()

// Mock data based on the screenshot
const foodDetail = ref({
  name: route.params.id || '张大师吮指鸭爪爪(东城万达广场店)',
  tags: ['美食', '餐厅'],
  businessHours: '周一至周日 10:30-14:00 16:30-22:00',
  address: '中国山东省东营市东营区莒州路',
  description: '特色餐饮，欢迎品尝',
  image: foodImgDetail,
  likes: 1
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="food-detail">
    <!-- Header Image with Overlay -->
    <header class="detail-header">
      <img :src="foodDetail.image" class="header-img" alt="Food Image" />
      
      <!-- Top Action Bar -->
      <div class="top-bar">
        <button class="icon-btn back-btn" @click="goBack">
          <span class="icon">〈</span>
        </button>
      </div>

      <!-- Title Overlay - Positioned at 1/5 from bottom -->
      <div class="title-overlay">
        <h1 class="restaurant-name">{{ foodDetail.name }}</h1>
        <div class="tag-row">
          <span v-for="tag in foodDetail.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="info-row">
          <span class="hours">营业时间：{{ foodDetail.businessHours }}</span>
          <span class="image-count">3/3</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="detail-content">
      <!-- Address Section -->
      <section class="info-section address-section">
        <div class="section-header">
          <h2 class="section-title">地址</h2>
          <div class="header-actions">
            <button class="action-circle blue">
              <span class="icon">✈️</span>
            </button>
            <button class="action-circle light-blue">
              <span class="icon">📞</span>
            </button>
          </div>
        </div>
        <p class="address-text">{{ foodDetail.address }}</p>
        <div class="recommendation-link">
          <span class="rec-icon">🌐</span>
          <span class="rec-text">周边推荐</span>
          <span class="arrow">▶</span>
        </div>
      </section>

      <!-- Description Section -->
      <section class="info-section description-section">
        <h2 class="section-title">餐厅详情</h2>
        <p class="description-text">{{ foodDetail.description }}</p>
      </section>
    </main>

    <!-- Footer Action Bar -->
    <footer class="detail-footer">
      <div class="comment-input-box">
        <span class="edit-icon">✏️</span>
        <span class="placeholder-text">写评论</span>
      </div>
      <div class="footer-actions">
        <div class="footer-item">
          <span class="icon">🤍</span>
          <span class="label">{{ foodDetail.likes }}</span>
        </div>
        <div class="footer-item">
          <span class="icon">💬</span>
          <span class="label">评论</span>
        </div>
        <div class="footer-item">
          <span class="icon">↗️</span>
          <span class="label">分享</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.food-detail {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 80px; /* Space for footer */
}

.detail-header {
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
}

.header-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top-bar {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 10;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  backdrop-filter: blur(4px);
}

.right-actions {
  display: flex;
  gap: 12px;
}

.title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80px 16px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
}

.restaurant-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

.tag-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  opacity: 0.9;
}

.detail-content {
  padding: 24px 16px;
}

.info-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0b3d4f; /* Darker teal/blue from screenshot */
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.action-circle.blue {
  background-color: #e6f7ff;
  color: #1890ff;
}

.action-circle.light-blue {
  background-color: #f0f5ff;
  color: #adc6ff;
}

.address-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
}

.recommendation-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6fb5c9;
}

.rec-icon {
  font-size: 16px;
}

.arrow {
  font-size: 10px;
  margin-left: 2px;
}

.description-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 20px;
  z-index: 100;
}

.comment-input-box {
  flex: 1;
  height: 38px;
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
  color: #999;
}

.edit-icon {
  font-size: 14px;
}

.placeholder-text {
  font-size: 14px;
}

.footer-actions {
  display: flex;
  gap: 20px;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.footer-item .icon {
  font-size: 20px;
  color: #333;
}

.footer-item .label {
  font-size: 10px;
  color: #666;
}
</style>
