<template>
  <view class="budget-container">
    <view class="header">
      <text class="title">预算管理</text>
    </view>
    
    <view class="content">
      <text class="placeholder">预算页面开发中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 预算页面逻辑
console.log('预算页面加载');
</script>

<style scoped>
.budget-container {
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}
</style>
