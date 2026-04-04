<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const router = useRouter()
const account = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!account.value || !password.value) return

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        account: account.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (data.code === 200) {
      showToast(data.message || '登录成功', 'success')
      
      // Save user data to localStorage
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userId', data.data.id.toString())
      localStorage.setItem('username', data.data.username)
      localStorage.setItem('email', data.data.email)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    } else {
      showToast(data.message || '登录失败', 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    showToast('网络错误，请稍后重试', 'error')
  }
}

const navigateToRegister = () => {
  router.push('/register')
}

const goBack = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="login-page">
    <!-- Back Button -->
    <header class="top-header">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span>
      </button>
    </header>

    <main class="login-content">
      <div class="welcome-section">
        <h1 class="welcome-title">欢迎回来</h1>
        <p class="welcome-subtitle">请登录您的账号以开启旅程</p>
      </div>

      <div class="login-form-container">
        <div class="login-form">
          <div class="input-group">
            <label for="account" class="input-label">账号/邮箱</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                id="account" 
                v-model="account" 
                placeholder="请输入用户名或邮箱"
                class="form-input"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password" class="input-label">登录密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="请输入您的密码"
                class="form-input"
              />
            </div>
          </div>

          <div class="forgot-password">
            <span>忘记密码？</span>
          </div>

          <button class="login-btn" @click="handleLogin" :disabled="!account || !password">
            立即登录
          </button>

          <div class="register-footer">
            <span>没有账号？</span>
            <button class="register-link" @click="navigateToRegister">点击注册</button>
          </div>
        </div>
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
.login-page {
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
  color: #333;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-btn:active {
  transform: scale(0.9);
}

.login-content {
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

.login-form {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 42px;
  border: 1.5px solid #eee;
  border-radius: 14px;
  font-size: 15px;
  transition: all 0.3s;
  background: #fcfcfc;
}

.form-input:focus {
  outline: none;
  border-color: #4361ee;
  background: white;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.forgot-password {
  text-align: right;
  margin-top: -10px;
  margin-bottom: 24px;
}

.forgot-password span {
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
}

.login-btn:active {
  transform: scale(0.98);
}

.login-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link {
  background: none;
  border: none;
  color: #4361ee;
  font-weight: 700;
  cursor: pointer;
  padding: 0 4px;
  text-decoration: underline;
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
