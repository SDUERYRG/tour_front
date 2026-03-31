<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/login')
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <header class="top-header">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span>
      </button>
    </header>

    <main class="register-content">
      <div class="welcome-section">
        <h1 class="welcome-title">加入我们</h1>
        <p class="welcome-subtitle">创建一个新账号来开始您的探索</p>
      </div>

      <div class="register-form">
        <p class="placeholder-text">注册功能开发中...</p>
        <button class="login-link" @click="navigateToLogin">已有账号？去登录</button>
      </div>
    </main>

    <!-- Decorative Elements -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8faff;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
}

.top-header {
  padding: 20px;
  position: relative;
  z-index: 10;
}

.back-btn {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-btn:active {
  transform: scale(0.9);
}

.register-content {
  flex: 1;
  padding: 20px 30px 40px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 15px;
  color: #666;
}

.register-form {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 40px 20px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.placeholder-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 24px;
}

.login-link {
  background: none;
  border: none;
  color: #4361ee;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

/* Background Decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  top: -100px;
  right: -50px;
  width: 300px;
  height: 300px;
  background-color: rgba(67, 97, 238, 0.15);
}

.circle-2 {
  bottom: -100px;
  left: -50px;
  width: 250px;
  height: 250px;
  background-color: rgba(76, 201, 240, 0.15);
}
</style>
