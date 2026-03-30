<script setup lang="ts">
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>商城</h1>
    </header>
    <main class="page-content">
      <div class="category-tabs">
        <div class="tab active">门票</div>
        <div class="tab">特产</div>
        <div class="tab">纪念品</div>
        <div class="tab">酒店</div>
      </div>
      <div class="shop-grid">
        <div class="shop-card" v-for="i in 6" :key="i">
          <div class="product-img"></div>
          <div class="product-info">
            <h4>特色产品 {{ i }}</h4>
            <p class="price">¥{{ i * 100 }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-container {
  padding: 16px;
  padding-bottom: 80px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  white-space: nowrap;
}

.tab {
  padding: 8px 16px;
  background: #f0f2f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.tab.active {
  background: #6e8efb;
  color: white;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.shop-card {
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.product-img {
  width: 100%;
  aspect-ratio: 1;
  background: #f0f2f5;
  border-radius: 12px;
  margin-bottom: 12px;
}

.product-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.product-info .price {
  margin: 0;
  color: #ff4d4f;
  font-weight: 700;
  font-size: 16px;
}
</style>
