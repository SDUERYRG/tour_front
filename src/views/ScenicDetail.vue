<script setup lang="ts">
import { useRouter } from 'vue-router'
import img1 from '../assets/images/yellow_1.png'
import img2 from '../assets/images/yellow_2.png'
import img3 from '../assets/images/yellow_3.png'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="scenic-detail">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <span class="icon">〈</span>
      </button>
      <h1 class="title">景区详情</h1>
    </header>

    <main class="content">
      <!-- Top Images -->
      <div class="image-stack">
        <img :src="img1" alt="Scenic Image 1" class="detail-img" />
      </div>

      <!-- Text Content -->
      <section class="description-section">
        <p class="description-text">
          黄河口生态旅游区依托山东黄河三角洲国家级自然保护区而建，位于黄河现行入海口处，区内拥有河海交汇、生态湿地、珍稀濒危鸟类、滨海滩涂景观和石油工业等独具特色的生态旅游资源。保护区总面积1530平方公里，拥有世界上暖温带最广阔、最完整、最年轻的湿地生态系统。2020年1月由文化和旅游部评定为国家5A级旅游景区。
        </p>
      </section>

      <!-- Bottom Image -->
      <div class="image-footer">
        <img :src="img3" alt="Scenic Image 3" class="detail-img" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.scenic-detail {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-bottom: 40px;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fff;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #334155;
  margin-right: 12px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.content {
  padding: 16px;
}

.image-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-img {
  width: 90%;
  display: block;
  margin: 0 auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.description-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.description-text {
  font-size: 15px;
  line-height: 1.8;
  color: #475569;
  text-align: justify;
}

.image-footer {
  margin-top: 12px;
}
</style>
