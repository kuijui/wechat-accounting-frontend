<template>
  <view class="bill-list-container">
    <view class="header">
      <text class="title">账单明细</text>
    </view>
    
    <view class="content">
      <text class="placeholder">账单列表页面开发中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 账单列表页面逻辑
console.log('账单列表页面加载');
</script>

<style scoped>
.bill-list-container {
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
