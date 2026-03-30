<script setup lang="ts">
import { ref } from 'vue'
import Carousel from '../components/Carousel.vue'
import img1 from '../assets/images/yellow_1.png'
import img2 from '../assets/images/yellow_2.png'
import img3 from '../assets/images/yellow_3.png'
import foodImg from '../assets/images/food_1.png'
import hotelImg from '../assets/images/hotel_1.png'
import guideImg from '../assets/images/guide_1.png'
import shopImg from '../assets/images/shop_1.png'

const carouselImages = [img1, img2, img3]

// Tab State for Peripheral Section
type TabKey = 'food' | 'hotel' | 'guide' | 'shop'
const activeTab = ref<TabKey>('food')

const peripheralData: Record<TabKey, { name: string; desc: string; tag: string; img: string; }[]> = {
  food: [
    { name: '黄河口鲜味馆', desc: '特色：黄河口刀鱼、大闸蟹', tag: '必吃', img: foodImg },
    { name: '垦利农家大院', desc: '特色：地锅鸡、野菜包子', tag: '地道', img: foodImg }
  ],
  hotel: [
    { name: '黄河口大酒店', desc: '距景区3.2km · 五星级标准', tag: '推荐', img: hotelImg },
    { name: '湿地之星民宿', desc: '距景区1.5km · 原生态风情', tag: '近景区', img: hotelImg }
  ],
  guide: [
    { name: '一日游全攻略', desc: '看蓝黄交汇，观万鸟翔集', tag: '热门', img: guideImg },
    { name: '亲子探秘指南', desc: '科普湿地知识，亲近大自然', tag: '亲子', img: guideImg }
  ],
  shop: [
    { name: '黄河口咸鸭蛋', desc: '当地特产 · 咸香流油', tag: '特产', img: shopImg },
    { name: '大闸蟹礼盒', desc: '鲜活直供 · 馈赠佳品', tag: '热销', img: shopImg }
  ]
}
</script>

<template>
  <div class="home-page">
    <!-- Carousel at the top -->
    <header class="home-header">
      <Carousel :images="carouselImages" :interval="4000" />
      
      <!-- Text overlay - positioned relative to the header -->
      <div class="overlay-container">
        <h1 class="title">黄河口生态旅游区</h1>
        <div class="badge-row">
          <span class="badge">国家级自然保护区</span>
        </div>
        <div class="badge-row secondary">
          <span class="badge mini">5A景区</span>
          <span class="badge mini">云游齐鲁</span>
        </div>
      </div>
    </header>

    <main class="home-content">
      <section class="info-card">
        <div class="info-item">
          <div class="info-label">
            <span class="icon">🕒</span>
            <span class="text">开放时间</span>
          </div>
          <p class="info-value">08:30 - 17:00 (全年开放)</p>
        </div>
        
        <div class="info-item">
          <div class="info-label">
            <span class="icon">📝</span>
            <span class="text">景区简介</span>
          </div>
          <p class="info-value small">大河入海，蓝黄交汇。这里是鸟类的天堂，红滩苇海，构成中国最完整、最广阔、最年轻的湿地生态系统。</p>
        </div>

        <div class="info-item">
          <div class="info-label">
            <span class="icon">📍</span>
            <span class="text">详细地址</span>
          </div>
          <p class="info-value">山东省东营市垦利区黄河三角洲大汶流管理站</p>
        </div>
      </section>
      <section class="features-section">
        <div class="section-title">核心魅力</div>
        <div class="feature-grid">
          <div class="feature-card">
            <span class="f-icon">🌊</span>
            <span class="f-name">黄蓝交汇</span>
          </div>
          <div class="feature-card">
            <span class="f-icon">🦩</span>
            <span class="f-name">万鸟翔集</span>
          </div>
          <div class="feature-card">
            <span class="f-icon">🌾</span>
            <span class="f-name">红滩绿苇</span>
          </div>
        </div>
      </section>

      <!-- New Peripheral Section -->
      <section class="peripheral-section">
        <div class="section-title">周边配套</div>
        <div class="peripheral-grid">
          <div 
            class="p-item" 
            :class="{ active: activeTab === 'food' }" 
            @click="activeTab = 'food'"
          >
            <div class="p-icon-box food">🍲</div>
            <span class="p-name">美食</span>
          </div>
          <div 
            class="p-item" 
            :class="{ active: activeTab === 'hotel' }" 
            @click="activeTab = 'hotel'"
          >
            <div class="p-icon-box hotel">🏨</div>
            <span class="p-name">酒店</span>
          </div>
          <div 
            class="p-item" 
            :class="{ active: activeTab === 'guide' }" 
            @click="activeTab = 'guide'"
          >
            <div class="p-icon-box guide">📖</div>
            <span class="p-name">攻略</span>
          </div>
          <div 
            class="p-item" 
            :class="{ active: activeTab === 'shop' }" 
            @click="activeTab = 'shop'"
          >
            <div class="p-icon-box shop">🛍️</div>
            <span class="p-name">商品</span>
          </div>
        </div>

        <!-- Tab Content Panel -->
        <div class="tab-panel">
          <transition name="list-fade" mode="out-in">
            <div :key="activeTab" class="content-list">
              <div 
                v-for="(item, index) in peripheralData[activeTab]" 
                :key="index" 
                class="list-card"
              >
                <div class="card-img-box">
                  <img :src="item.img" alt="Item image" />
                </div>
                <div class="card-content">
                  <div class="card-main">
                    <span class="card-title">{{ item.name }}</span>
                    <span class="card-tag">{{ item.tag }}</span>
                  </div>
                  <p class="card-desc">{{ item.desc }}</p>
                  <div class="card-action">查看详情 ›</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f6f8fb;
  padding-bottom: 90px; /* Space for TabBar if exists */
}

.home-header {
  position: relative;
  width: 100%;
}

.overlay-container {
  position: absolute;
  bottom: 20%; /* Adjusted to 20% from bottom as requested */
  left: 16px;
  text-align: left;
  width: auto;
  max-width: 80%;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.title {
  color: #fff;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 8px;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.badge-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 6px;
}

.badge-row.secondary {
  gap: 8px;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.badge.mini {
  font-size: 10px;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.15);
}

.home-content {
  padding: 20px 16px; /* Adjusted padding for better card fit */
  margin-top: -36px; /* Increased overlay effect */
  position: relative;
  z-index: 5;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* Soft premium shadow */
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-item {
  margin-bottom: 16px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.info-label .icon {
  font-size: 16px;
}

.info-label .text {
  font-size: 13px;
  font-weight: 700;
  color: #333;
}

.info-value {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  padding-left: 24px;
}

.info-value.small {
  font-size: 12px;
  color: #777;
}


.features-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  padding-left: 4px;
  border-left: 4px solid #6e8efb;
}

.feature-grid {
  display: flex;
  justify-content: space-between;
  gap: 8px; /* Reduced from 12px */
}

.feature-card {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  padding: 12px 6px; /* Reduced from 16x8 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  min-width: 0; /* Important to prevent overflow on very small columns */
}

.f-icon {
  font-size: 24px;
}

.f-name {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.peripheral-section {
  margin-top: 32px;
}

.peripheral-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.p-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.p-item.active {
  opacity: 1;
  transform: translateY(-2px);
}

.p-icon-box {
  width: 54px;
  height: 54px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.p-item.active .p-icon-box {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #6e8efb33;
}

.p-item:active {
  transform: scale(0.92);
}

.p-name {
  font-size: 11px;
  font-weight: 500;
  color: #444;
}

/* Tab Panel Styling */
.tab-panel {
  min-height: 160px;
}

.list-card {
  background: white;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.02);
  display: flex;
  gap: 12px;
}

.card-img-box {
  flex: 0 0 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
}

.card-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
}

.card-tag {
  font-size: 10px;
  background: #6e8efb1a;
  color: #6e8efb;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.card-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.card-action {
  font-size: 12px;
  color: #6e8efb;
  font-weight: 600;
  display: flex;
  justify-content: flex-end;
}

/* Transitions */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.3s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Theme colors for boxes */
.p-icon-box.food { background: linear-gradient(135deg, #fff 0%, #fff5f5 100%); }
.p-icon-box.hotel { background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%); }
.p-icon-box.guide { background: linear-gradient(135deg, #fff 0%, #f5fff5 100%); }
.p-icon-box.shop { background: linear-gradient(135deg, #fff 0%, #f7f3ff 100%); }

/* Animations */
.overlay-container .title {
  animation: fadeInLeft 0.8s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
