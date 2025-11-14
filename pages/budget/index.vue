<template>
  <view class="budget-container">
    <!-- 顶部：月份选择 -->
    <view class="header">
      <view class="month-bar">
        <text class="arrow" @click="changeMonth(-1)">‹</text>
        <text class="month-text">{{ currentMonthLabel }}</text>
        <text class="arrow" @click="changeMonth(1)">›</text>
      </view>

      <!-- 概览卡片 -->
      <view class="overview">
        <view class="overview-item">
          <text class="overview-label">总预算</text>
          <text class="overview-total">¥{{ totalBudget.toFixed(2) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">已使用</text>
          <text class="overview-used">¥{{ totalUsed.toFixed(2) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">剩余</text>
          <text class="overview-remaining">¥{{ totalRemaining.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 预算列表 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="budgetList.length === 0" class="empty">
        <text class="empty-icon">📉</text>
        <text class="empty-text">本月还没有设置预算</text>
      </view>
      <scroll-view v-else scroll-y class="list-scroll">
        <view 
          v-for="item in budgetList" 
          :key="item.id" 
          class="budget-item"
        >
          <view class="budget-header">
            <text class="budget-name">{{ item.categoryName || '总预算' }}</text>
            <text class="budget-percent">{{ formatPercent(item.usagePercentage) }}</text>
          </view>

          <view class="budget-amount-row">
            <text class="amount-text">预算 ¥{{ item.amount.toFixed(2) }}</text>
            <text class="amount-text">已用 ¥{{ item.usedAmount.toFixed(2) }}</text>
            <text 
              class="amount-text" 
              :class="{ warning: item.remainingAmount < 0 }"
            >
              剩余 ¥{{ item.remainingAmount.toFixed(2) }}
            </text>
          </view>

          <view class="progress-bar">
            <view 
              class="progress-inner"
              :class="{ over: item.usagePercentage > 100 }"
              :style="{ width: getProgressWidth(item.usagePercentage) }"
            ></view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { budgetApi } from '../../api';
import type { BudgetResponse } from '../../types';

const loading = ref(false);
const budgetList = ref<BudgetResponse[]>([]);

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 当前月份文本
const currentMonthLabel = computed(() => {
  return `${currentYear.value}年${currentMonth.value.toString().padStart(2, '0')}月`;
});

// 汇总数据
const totalBudget = computed(() => {
  return budgetList.value.reduce((sum, item) => sum + (item.amount || 0), 0);
});

const totalUsed = computed(() => {
  return budgetList.value.reduce((sum, item) => sum + (item.usedAmount || 0), 0);
});

const totalRemaining = computed(() => {
  return budgetList.value.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);
});

// 百分比格式化
const formatPercent = (value: number) => {
  if (value == null || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

const getProgressWidth = (value: number) => {
  if (value == null || isNaN(value)) return '0%';
  const v = Math.max(0, Math.min(value, 120));
  return `${v}%`;
};

// 切换月份
const changeMonth = (offset: number) => {
  let year = currentYear.value;
  let month = currentMonth.value + offset;
  if (month <= 0) {
    year -= 1;
    month += 12;
  } else if (month > 12) {
    year += 1;
    month -= 12;
  }
  currentYear.value = year;
  currentMonth.value = month;
  loadBudget();
};

// 加载预算数据
const loadBudget = async () => {
  try {
    loading.value = true;
    const res = await budgetApi.getList(currentYear.value, currentMonth.value);
    if (res.code === 200 && Array.isArray(res.data)) {
      budgetList.value = res.data;
    } else {
      budgetList.value = [];
    }
  } catch (error: any) {
    console.error('获取预算数据失败:', error);
    uni.showToast({
      title: error?.message || '获取预算失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBudget();
});
</script>

<style scoped>
.budget-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 顶部 */
.header {
  margin-bottom: 20rpx;
}

.month-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}

.month-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin: 0 40rpx;
}

.arrow {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx 20rpx;
}

.overview {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
}

.overview-item {
  display: flex;
  flex-direction: column;
}

.overview-label {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 6rpx;
}

.overview-total {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.overview-used {
  font-size: 28rpx;
  color: #ff9f43;
  font-weight: 600;
}

.overview-remaining {
  font-size: 28rpx;
  color: #07c160;
  font-weight: 600;
}

/* 内容 */
.content {
  margin-top: 20rpx;
}

.loading {
  text-align: center;
  color: #999;
  padding: 60rpx 0;
}

.empty {
  padding: 80rpx 0;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}

.list-scroll {
  max-height: calc(100vh - 320rpx);
}

.budget-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.budget-name {
  font-size: 28rpx;
  color: #333;
}

.budget-percent {
  font-size: 24rpx;
  color: #666;
}

.budget-amount-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.amount-text {
  font-size: 22rpx;
  color: #666;
}

.amount-text.warning {
  color: #ff4d4f;
}

.progress-bar {
  width: 100%;
  height: 14rpx;
  background: #f0f0f0;
  border-radius: 7rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.progress-inner.over {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5253 100%);
}
</style>
