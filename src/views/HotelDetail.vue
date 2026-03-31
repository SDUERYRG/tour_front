<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import hotelImgDetail from '../assets/images/hotel_1.png' // Using existing hotel image as placeholder

const router = useRouter()
const route = useRoute()

// Mock data based on the screenshot
const hotelDetail = ref({
  name: route.params.id || '回家民宿 (东营黄河口知青小镇店)',
  diamonds: 2,
  info: '2019年开业2019年装修',
  phones: ['0546-2628001', '13793971866'],
  address: '黄河口知青小镇',
  image: hotelImgDetail,
  rooms: [
    {
      name: '温馨小院',
      desc: '90m² 1.3单人床/1.1单人床 有窗 无宽...',
      img: hotelImgDetail
    }
  ]
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="hotel-detail">
    <!-- Navbar -->
    <nav class="navbar">
      <button class="back-btn" @click="goBack">
        <span class="icon">〈</span>
      </button>
      <h1 class="nav-title">酒店详情</h1>
      <div class="nav-right-placeholder"></div>
    </nav>

    <!-- Header Image -->
    <div class="header-image-box">
      <img :src="hotelDetail.image" class="header-img" alt="Hotel Image" />
    </div>

    <!-- Main Content with Overlay Card -->
    <main class="detail-container">
      <div class="hotel-info-card">
        <h2 class="hotel-name">{{ hotelDetail.name }}</h2>
        <div class="rating-row">
          <span v-for="i in hotelDetail.diamonds" :key="i" class="diamond-icon">💎</span>
        </div>
        <div class="info-meta-row">
          <span class="meta-text">{{ hotelDetail.info }}</span>
          <span class="details-link">设施/详情 〉</span>
        </div>

        <div class="divider"></div>

        <!-- Contact List -->
        <div class="contact-list">
          <div v-for="phone in hotelDetail.phones" :key="phone" class="contact-item">
            <div class="item-left">
              <span class="icon">📞</span>
              <span class="text">{{ phone }}</span>
            </div>
            <span class="chevron">〉</span>
          </div>
          <div class="contact-item">
            <div class="item-left">
              <span class="icon">📍</span>
              <span class="text">{{ hotelDetail.address }}</span>
            </div>
            <span class="chevron">〉</span>
          </div>
        </div>
      </div>

      <!-- Room List Section -->
      <section class="room-section">
        <div v-for="(room, index) in hotelDetail.rooms" :key="index" class="room-card">
          <div class="room-img-box">
            <img :src="room.img" alt="Room Image" />
          </div>
          <div class="room-info">
            <h3 class="room-name">{{ room.name }}</h3>
            <p class="room-desc">{{ room.desc }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.hotel-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

/* Navbar Styling */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  padding: 0;
  width: 40px;
  text-align: left;
}

.nav-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.nav-right-placeholder {
  width: 40px;
}

/* Header Image */
.header-image-box {
  width: 100%;
  height: 300px;
  margin-top: 44px;
}

.header-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Container & Card Overlay */
.detail-container {
  padding: 0 12px 24px;
  margin-top: -40px; /* Offset to overlap the image */
  position: relative;
  z-index: 10;
}

.hotel-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

.hotel-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 10px;
}

.rating-row {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.diamond-icon {
  font-size: 14px;
}

.info-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.meta-text {
  font-size: 13px;
  color: #666;
}

.details-link {
  font-size: 13px;
  color: #666;
}

.divider {
  height: 1px;
  background-color: #f0f0f0;
  margin-bottom: 16px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-left .icon {
  font-size: 18px;
  color: #2c7c7d; /* Teal color from screenshot icons */
}

.item-left .text {
  font-size: 15px;
  color: #333;
}

.chevron {
  color: #ccc;
  font-size: 14px;
}

/* Room Section */
.room-section {
  margin-top: 16px;
}

.room-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  padding: 12px;
  gap: 12px;
  margin-bottom: 12px;
}

.room-img-box {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.room-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.room-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}
</style>
