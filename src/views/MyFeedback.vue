<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const router = useRouter()

interface FeedbackItem {
  id: number
  type: string
  content: string
  status: number
  createdAt: string
  replyContent?: string
}

const feedbackList = ref<FeedbackItem[]>([])
const loading = ref(false)

// Pagination & Filters
const pageNum = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const total = ref(0)
const selectedType = ref('')
const selectedStatus = ref('')

const statusMap: Record<number, { text: string; class: string }> = {
  0: { text: '待处理', class: 'status-pending' },
  1: { text: '处理中', class: 'status-processing' },
  2: { text: '已解决', class: 'status-done' }
}

const fetchFeedback = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    showToast('请先登录', 'error')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    let url = `/api/feedbacks/my?pageNum=${pageNum.value}&pageSize=${pageSize.value}`
    if (selectedType.value) url += `&type=${encodeURIComponent(selectedType.value)}`
    if (selectedStatus.value !== '') url += `&status=${selectedStatus.value}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (data.code === 200) {
      feedbackList.value = data.data.records
      total.value = data.data.total
      totalPages.value = data.data.totalPages
    } else {
      showToast(data.message || '查询失败', 'error')
    }
  } catch (error) {
    console.error('Fetch feedback error:', error)
    showToast('网络错误，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    pageNum.value = newPage
    fetchFeedback()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  fetchFeedback()
})

// Reset to page 1 when filters change
watch([selectedType, selectedStatus], () => {
  pageNum.value = 1
  fetchFeedback()
})

const goBack = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="my-feedback-page">
    <header class="top-header">
      <button class="back-btn" @click="goBack">
        <span class="icon">←</span>
      </button>
      <h1 class="page-title">我反馈的信息</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Filters -->
    <div class="filters-container">
      <select v-model="selectedType" class="filter-select">
        <option value="">全部类型</option>
        <option value="投诉">投诉</option>
        <option value="建议">建议</option>
        <option value="咨询">咨询</option>
        <option value="其他">其他</option>
      </select>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">全部状态</option>
        <option value="0">待处理</option>
        <option value="1">处理中</option>
        <option value="2">已解决</option>
      </select>
    </div>

    <main class="feedback-list">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="feedbackList.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>暂无反馈记录</p>
      </div>

      <div v-else v-for="item in feedbackList" :key="item.id" class="feedback-card">
        <div class="card-header">
          <span class="feedback-type" :class="item.type === '投诉' ? 'type-complaint' : 'type-suggest'">
            {{ item.type }}
          </span>
          <span class="feedback-time">{{ formatDate(item.createdAt) }}</span>
        </div>
        
        <div class="card-content">
          <p class="content-text">{{ item.content }}</p>
        </div>

        <div class="card-footer">
          <div class="status-badge" :class="statusMap[item.status]?.class">
            {{ statusMap[item.status]?.text }}
          </div>
        </div>

        <div v-if="item.replyContent" class="reply-box">
          <div class="reply-label">官方回复：</div>
          <p class="reply-text">{{ item.replyContent }}</p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn" 
          :disabled="pageNum === 1" 
          @click="handlePageChange(pageNum - 1)"
        >
          上一页
        </button>
        <span class="page-info">{{ pageNum }} / {{ totalPages }}</span>
        <button 
          class="page-btn" 
          :disabled="pageNum === totalPages" 
          @click="handlePageChange(pageNum + 1)"
        >
          下一页
        </button>
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
.my-feedback-page {
  min-height: 100vh;
  background-color: #f8faff;
  position: relative;
  overflow: hidden;
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
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.header-spacer {
  width: 40px;
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
}

.filters-container {
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  position: relative;
  z-index: 10;
}

.filter-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: white;
  font-size: 13px;
  color: #666;
  outline: none;
}

.feedback-list {
  flex: 1;
  padding: 10px 20px 40px;
  position: relative;
  z-index: 10;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  color: #666;
}

.loader {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  color: #888;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.feedback-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-type {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.type-complaint {
  background: #fef2f2;
  color: #ef4444;
}

.type-suggest {
  background: #ecfdf5;
  color: #10b981;
}

.feedback-time {
  font-size: 12px;
  color: #999;
}

.content-text {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-pending { background: #fef3c7; color: #d97706; }
.status-processing { background: #e0e7ff; color: #4361ee; }
.status-done { background: #dcfce7; color: #16a34a; }

.reply-box {
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #4361ee;
}

.reply-label {
  font-size: 12px;
  font-weight: 700;
  color: #4361ee;
  margin-bottom: 4px;
}

.reply-text {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding-bottom: 20px;
}

.page-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  background: #4361ee;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
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
  top: 100px;
  right: -50px;
  width: 300px;
  height: 300px;
  background-color: rgba(67, 97, 238, 0.1);
}

.circle-2 {
  bottom: 100px;
  left: -50px;
  width: 250px;
  height: 250px;
  background-color: rgba(76, 201, 240, 0.1);
}
</style>
