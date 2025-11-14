<template>
  <view class="index-container">
    <view class="header">
      <text class="title">💰 微信记账</text>
      <text class="subtitle">欢迎使用</text>
    </view>
    
    <view class="content">
      <view class="welcome-card">
        <text class="welcome-text">🎉 欢迎使用微信记账</text>
        <text class="tip-text">点击下方按钮开始体验</text>
      </view>
      
      <!-- 功能导航 -->
      <view class="nav-grid">
        <view class="nav-item" @click="navigateTo('/pages/bill/add')">
          <text class="nav-icon">📝</text>
          <text class="nav-text">记一笔</text>
        </view>
        
        <view class="nav-item" @click="navigateTo('/pages/bill/list')">
          <text class="nav-icon">📈</text>
          <text class="nav-text">账单</text>
        </view>
        
        <view class="nav-item" @click="navigateTo('/pages/statistics/index')">
          <text class="nav-icon">📊</text>
          <text class="nav-text">统计</text>
        </view>
        
        <view class="nav-item" @click="navigateTo('/pages/budget/index')">
          <text class="nav-icon">💳</text>
          <text class="nav-text">预算</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { checkAuth } from '../../utils/auth';

// 检查登录状态
onMounted(() => {
  console.log('首页加载');
  // 检查是否已登录，未登录则跳转登录页
  checkAuth();
});

// 导航函数
const navigateTo = (url: string) => {
  uni.navigateTo({
    url
  });
};
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
  padding-top: 100rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20rpx;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.welcome-text {
  display: block;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.tip-text {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

/* 导航网格 */
.nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
  margin-top: 60rpx;
  width: 100%;
  max-width: 500rpx;
}

.nav-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.nav-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.nav-icon {
  display: block;
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

.nav-text {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
</style>
