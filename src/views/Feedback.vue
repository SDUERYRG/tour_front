<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const router = useRouter()
const contact = ref('')
const type = ref('投诉')
const content = ref('')

const feedbackTypes = ['投诉', '建议', '咨询', '其他']

const handleSubmit = async () => {
  if (!contact.value || !content.value) {
    showToast('请填写完整信息', 'error')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }

  try {
    const response = await fetch('/api/feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contact: contact.value,
        type: type.value,
        content: content.value
      })
    })

    const data = await response.json()

    if (data.code === 200) {
      showToast(data.message || '提交成功，我们会尽快处理', 'success')
      // Redirect back to profile after success
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } else {
      showToast(data.message || '提交失败', 'error')
    }
  } catch (error) {
    console.error('Feedback error:', error)
    showToast('网络错误，请稍后重试', 'error')
  }
}

const goBack = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="feedback-page">
    <!-- Back Button -->
    <header class="top-header">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span>
      </button>
      <h1 class="page-title">投诉反馈</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="feedback-content">
      <div class="welcome-section">
        <h2 class="welcome-title">您的意见对我们很重要</h2>
        <p class="welcome-subtitle">请填写以下信息，我们会倾听您的声音</p>
      </div>

      <div class="feedback-form-container">
        <div class="feedback-form">
          <!-- Contact Info -->
          <div class="input-group">
            <label for="contact" class="input-label">联系方式</label>
            <div class="input-wrapper">
              <span class="input-icon">📞</span>
              <input 
                type="text" 
                id="contact" 
                v-model="contact" 
                placeholder="邮箱、手机号或微信号"
                class="form-input"
              />
            </div>
          </div>

          <!-- Feedback Type -->
          <div class="input-group">
            <label class="input-label">反馈类型</label>
            <div class="type-selector">
              <button 
                v-for="item in feedbackTypes" 
                :key="item"
                class="type-btn"
                :class="{ active: type === item }"
                @click="type = item"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="input-group">
            <label for="content" class="input-label">反馈内容</label>
            <div class="input-wrapper">
              <textarea 
                id="content" 
                v-model="content" 
                placeholder="请详细描述您遇到的问题或建议..."
                class="form-textarea"
                rows="6"
              ></textarea>
            </div>
          </div>

          <button class="submit-btn" @click="handleSubmit" :disabled="!contact || !content">
            提交反馈
          </button>
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
.feedback-page {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.header-spacer {
  width: 40px; /* Same as back-btn width */
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

.feedback-content {
  flex: 1;
  padding: 10px 24px 40px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 14px;
  color: #666;
}

.feedback-form {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin-bottom: 12px;
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

.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.type-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1.5px solid #eee;
  background: #fcfcfc;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn.active {
  background: rgba(67, 97, 238, 0.1);
  border-color: #4361ee;
  color: #4361ee;
  font-weight: 600;
}

.form-textarea {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #eee;
  border-radius: 14px;
  font-size: 15px;
  transition: all 0.3s;
  background: #fcfcfc;
  resize: none;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #4361ee;
  background: white;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.submit-btn {
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

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
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
