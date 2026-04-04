<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import userAvatar from '../assets/images/user_avatar.png'
import { showToast } from '../utils/toast'

const router = useRouter()
const username = ref<string | null>(null)

onMounted(() => {
  // Check if user is logged in
  const storedName = localStorage.getItem('username')
  if (storedName) {
    username.value = storedName
  }
})

const goToLogin = () => {
  if (!username.value) {
    router.push('/login')
  }
}

const handleLogout = () => {
  if (!username.value) return
  
  // Clear user data
  localStorage.removeItem('token')
  localStorage.setItem('userId', '')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
  
  username.value = null
  showToast('已退出登录', 'info')
}
</script>

<template>
  <div class="profile-page">
    <!-- Top Action Bar -->
    <div class="top-bar">
      <h1 class="page-title">我的</h1>
    </div>

    <!-- User Info Section -->
    <header class="user-header">
      <div class="user-main">
        <div class="avatar-box" @click="goToLogin">
          <img :src="userAvatar" alt="Avatar" />
        </div>
        <div class="user-details">
          <h2 class="user-name" @click="goToLogin">
            {{ username || '点击登录' }}
          </h2>
        </div>
      </div>
      <div class="user-side-actions" v-if="username">
        <span class="logout-link" @click="handleLogout" title="退出登录">📤</span>
      </div>
    </header>

    <!-- Stats Row -->
    <section class="stats-row">
      <div class="stat-card">
        <span class="stat-value">0</span>
        <span class="stat-label">关注</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">0</span>
        <span class="stat-label">粉丝</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">0</span>
        <span class="stat-label">获赞与收藏</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">0</span>
        <span class="stat-label">/ 余额 ›</span>
      </div>
    </section>

    <!-- Membership Card -->
    <div class="membership-card">
      <div class="member-info">
        <span class="member-text">登录查看会员信息</span>
      </div>
      <button class="member-login-btn" @click="goToLogin">登录</button>
    </div>

    <!-- White Content Container (curved top overflow) -->
    <main class="content-container">
      <!-- Orders Section -->
      <section class="section-box order-grid">
        <div class="grid-item">
          <div class="grid-icon shop">📦</div>
          <span class="grid-label">商品订单</span>
        </div>
        <div class="grid-item">
          <div class="grid-icon hotel">🏨</div>
          <span class="grid-label">酒店订单</span>
        </div>
        <div class="grid-item">
          <div class="grid-icon appointment">🕘</div>
          <span class="grid-label">我的预约</span>
        </div>
        <div class="grid-item">
          <div class="grid-icon coupon">🎟️</div>
          <span class="grid-label">我的券包</span>
        </div>
      </section>

      <!-- Services Section -->
      <section class="section-box services-section">
        <h3 class="section-title">我的服务</h3>
        <div class="services-grid">
          <div class="grid-item">
            <div class="service-icon">⚙️</div>
            <span class="grid-label">账号设置</span>
          </div>
          <div class="grid-item">
            <div class="service-icon">📁</div>
            <span class="grid-label">投诉反馈</span>
          </div>
          <div class="grid-item">
            <div class="service-icon">🏪</div>
            <span class="grid-label">商家入驻</span>
          </div>
          <div class="grid-item">
            <div class="service-icon">🪐</div>
            <span class="grid-label">领券中心</span>
          </div>
          <div class="grid-item">
            <div class="service-icon">📝</div>
            <span class="grid-label">我的创作</span>
          </div>
        </div>
      </section>

      <!-- Favorites Section Title -->
      <section class="section-box favorite-section">
        <h3 class="section-title">我的收藏</h3>
      </section>

      <!-- Decorative Footer Logo -->
      <div class="footer-logo">
        <svg viewBox="0 0 400 100" class="wave-svg">
          <path d="M0 50 Q50 20 100 50 T200 50 T300 50 T400 50" fill="none" stroke="#FF5733" stroke-width="3" />
          <path d="M0 60 Q50 30 100 60 T200 60 T300 60 T400 60" fill="none" stroke="#FFC300" stroke-width="3" />
          <path d="M0 70 Q50 40 100 70 T200 70 T300 70 T400 70" fill="none" stroke="#28B463" stroke-width="3" />
          <path d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80" fill="none" stroke="#3498DB" stroke-width="3" />
        </svg>
      </div>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  background: linear-gradient(180deg, #f8faff 0%, #f4f6fb 100%);
  min-height: 100vh;
  padding-bottom: 20px;
}

/* Header & Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px; /* Reduced top padding as requested */
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.top-actions {
  display: flex;
  gap: 16px;
}

.action-icon {
  font-size: 20px;
  background: white;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  margin-bottom: 30px;
}

.user-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-box {
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.logout-link {
  font-size: 20px;
  color: #666;
}

/* Stats Row */
.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #888;
}

/* Membership Card */
.membership-card {
  margin: 0 20px 0;
  padding: 20px 24px;
  background: linear-gradient(90deg, #f7d794 0%, #e1b12c 100%);
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 -4px 15px rgba(225, 177, 44, 0.2);
}

.member-text {
  color: #5c3b1e;
  font-weight: 700;
  font-size: 14px;
}

.member-login-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #5c3b1e;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Content Container */
.content-container {
  background: white;
  margin-top: -10px;
  border-radius: 24px 24px 0 0;
  padding: 40px 20px 100px;
  position: relative;
  z-index: 3;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.03);
}

.section-box {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

/* Order Grid */
.order-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.grid-icon {
  width: 44px;
  height: 44px;
  background: #f0f7ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.grid-icon.shop { background: #eef2ff; color: #4361ee; }
.grid-icon.hotel { background: #ecfdf5; color: #10b981; }
.grid-icon.appointment { background: #fffbe6; color: #f59e0b; }
.grid-icon.coupon { background: #fef2f2; color: #ef4444; }

.grid-label {
  font-size: 12px;
  color: #555;
  font-weight: 500;
}

/* Services Section */
.services-section {
  background: #fafbfc;
  padding: 16px;
  border-radius: 16px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 10px;
}

.service-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

/* Footer Logo */
.footer-logo {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  opacity: 0.6;
}

.wave-svg {
  width: 200px;
  height: 50px;
}
</style>
