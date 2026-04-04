<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const router = useRouter()

// Form States
const username = ref('')
const email = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')

// Verification Code Logic
const countdown = ref(0)
const timer = ref<number | null>(null)

const canGetCode = computed(() => {
  return email.value.includes('@') && countdown.value === 0
})

const getVerificationCode = async () => {
  if (!canGetCode.value) return
  
  try {
    const response = await fetch('/api/register/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()
    
    if (data.code === 200) {
      showToast(data.message || '验证码已发送至您的邮箱', 'success')
      // Start Countdown
      countdown.value = 60
      timer.value = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          stopTimer()
        }
      }, 1000)
    } else {
      showToast(data.message || '获取验证码失败，请稍后重试', 'error')
    }
  } catch (error) {
    console.error('Error fetching verification code:', error)
    showToast('网络错误，请检查您的后端服务是否启动', 'error')
  }
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

onUnmounted(() => {
  stopTimer()
})

// Validation & Registration
const isFormValid = computed(() => {
  return username.value && 
         email.value && 
         code.value && 
         password.value && 
         confirmPassword.value && 
         password.value === confirmPassword.value
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        code: code.value
      })
    })

    const data = await response.json()
    
    if (data.code === 200) {
      showToast(data.message || '注册成功！', 'success')
      // Small delay to let the toast be seen before redirecting
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      showToast(data.message || '注册失败，请检查填写内容', 'error')
    }
  } catch (error) {
    console.error('Registration error:', error)
    showToast('网络错误，请稍后重试', 'error')
  }
}

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

      <div class="register-form-container">
        <div class="register-form">
          <!-- Username Field -->
          <div class="input-group">
            <label for="username" class="input-label">用户名</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                placeholder="请输入您的用户名"
                class="form-input"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div class="input-group">
            <label for="email" class="input-label">邮箱地址</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="请输入您的邮箱"
                class="form-input"
              />
            </div>
          </div>

          <!-- Verification Code Field -->
          <div class="input-group">
            <label for="code" class="input-label">验证码</label>
            <div class="code-wrapper">
              <div class="input-wrapper flex-1">
                <span class="input-icon">🔑</span>
                <input 
                  type="text" 
                  id="code" 
                  v-model="code" 
                  placeholder="请输入验证码"
                  class="form-input"
                />
              </div>
              <button 
                class="code-btn" 
                :disabled="!canGetCode"
                @click="getVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <!-- Password Field -->
          <div class="input-group">
            <label for="password" class="input-label">设置密码</label>
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

          <!-- Confirm Password Field -->
          <div class="input-group">
            <label for="confirmPassword" class="input-label">确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">🛡️</span>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="请再次输入您的密码"
                class="form-input"
                :class="{ 'error-border': confirmPassword && password !== confirmPassword }"
              />
            </div>
            <p v-if="confirmPassword && password !== confirmPassword" class="error-text">密码不一致</p>
          </div>

          <button class="register-btn" @click="handleRegister" :disabled="!isFormValid">
            立即注册
          </button>

          <div class="login-footer">
            <span>已有账号？</span>
            <button class="login-link" @click="navigateToLogin">去登录</button>
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
  margin-bottom: 30px;
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
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.input-group {
  margin-bottom: 18px;
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

.flex-1 {
  flex: 1;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 42px;
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

.code-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code-btn {
  padding: 0 16px;
  height: 46px;
  background: #f0f3ff;
  color: #4361ee;
  border: 1.5px solid rgba(67, 97, 238, 0.2);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.code-btn:not(:disabled):hover {
  background: #4361ee;
  color: white;
}

.code-btn:disabled {
  background: #f5f5f5;
  color: #999;
  border-color: #eee;
  cursor: not-allowed;
}

.error-border {
  border-color: #ff4d4f !important;
}

.error-text {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
}

.register-btn {
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
  margin-top: 10px;
}

.register-btn:active {
  transform: scale(0.98);
}

.register-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link {
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
