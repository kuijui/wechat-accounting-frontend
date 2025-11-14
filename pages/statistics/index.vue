<template>
  <view class="statistics-container">
    <!-- 顶部：月份和收支切换 -->
    <view class="header">
      <view class="month-bar">
        <text class="arrow" @click="changeMonth(-1)">‹</text>
        <text class="month-text">{{ currentMonthLabel }}</text>
        <text class="arrow" @click="changeMonth(1)">›</text>
      </view>

      <view class="type-switch">
        <view 
          class="type-tab" 
          :class="{ active: currentType === 2 }"
          @click="setType(2)"
        >支出</view>
        <view 
          class="type-tab" 
          :class="{ active: currentType === 1 }"
          @click="setType(1)"
        >收入</view>
      </view>

      <!-- 概览卡片 -->
      <view class="overview">
        <view class="overview-item">
          <text class="overview-label">本月支出</text>
          <text class="overview-expense">-{{ totalExpense.toFixed(2) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">本月收入</text>
          <text class="overview-income">+{{ totalIncome.toFixed(2) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">结余</text>
          <text class="overview-balance">{{ balanceSign }}{{ Math.abs(balance).toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>

      <view v-else>
        <!-- 分类占比 -->
        <view class="section-header">
          <text class="section-title">分类占比（{{ currentType === 2 ? '支出' : '收入' }}）</text>
        </view>

        <view v-if="categoryList.length === 0" class="empty">
          <text class="empty-icon">📊</text>
          <text class="empty-text">暂无统计数据</text>
        </view>

        <scroll-view v-else scroll-y class="category-scroll">
          <view 
            v-for="item in categoryList" 
            :key="item.categoryId"
            class="category-item"
          >
            <view class="category-left">
              <view class="icon-circle">
                <text class="icon-text">{{ item.categoryName.charAt(0) }}</text>
              </view>
              <view class="category-info">
                <text class="category-name">{{ item.categoryName }}</text>
                <text class="category-amount">
                  {{ amountSign }}{{ item.totalAmount.toFixed(2) }}
                </text>
              </view>
            </view>
            <view class="category-right">
              <view class="progress-bar">
                <view 
                  class="progress-inner"
                  :style="{ width: getPercent(item) }"
                ></view>
              </view>
              <text class="percent-text">{{ getPercent(item) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { statisticApi } from '../../api';
import type { StatisticResponse, CategoryStatisticResponse } from '../../types';

const loading = ref(false);

// 当前年月
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 当前查看类型：1-收入 2-支出
const currentType = ref<1 | 2>(2);

// 概览数据
const overview = ref<StatisticResponse | null>(null);

// 分类统计
const categoryList = ref<CategoryStatisticResponse[]>([]);

// 当前月份文本
const currentMonthLabel = computed(() => {
  return `${currentYear.value}年${currentMonth.value.toString().padStart(2, '0')}月`;
});

// 汇总数据
const totalIncome = computed(() => overview.value?.totalIncome ?? 0);
const totalExpense = computed(() => overview.value?.totalExpense ?? 0);
const balance = computed(() => overview.value?.balance ?? totalIncome.value - totalExpense.value);

const balanceSign = computed(() => {
  if (balance.value > 0) return '+';
  if (balance.value < 0) return '-';
  return '';
});

const amountSign = computed(() => (currentType.value === 2 ? '-' : '+'));

// 分类总金额
const categoryTotalAmount = computed(() => {
  return categoryList.value.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
});

// 百分比展示
const getPercent = (item: CategoryStatisticResponse) => {
  const base = categoryTotalAmount.value || 1;
  const value = (item.totalAmount / base) * 100;
  return `${value.toFixed(1)}%`;
};

// 工具函数：格式化日期
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 当前月份的日期范围
const getMonthRange = () => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0);
  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay)
  };
};

// 切换类型
const setType = (type: 1 | 2) => {
  if (currentType.value === type) return;
  currentType.value = type;
  loadStatistics();
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
  loadStatistics();
};

// 加载统计数据
const loadStatistics = async () => {
  try {
    loading.value = true;
    const { startDate, endDate } = getMonthRange();

    const [overviewRes, categoryRes] = await Promise.all([
      statisticApi.getOverview(startDate, endDate),
      statisticApi.getCategoryStatistics(currentType.value, startDate, endDate)
    ]);

    if (overviewRes.code === 200 && overviewRes.data) {
      overview.value = overviewRes.data;
    } else {
      overview.value = null;
    }

    if (categoryRes.code === 200 && Array.isArray(categoryRes.data)) {
      categoryList.value = categoryRes.data;
    } else {
      categoryList.value = [];
    }
  } catch (error: any) {
    console.error('获取统计数据失败:', error);
    uni.showToast({
      title: error?.message || '获取统计数据失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.statistics-container {
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

.type-switch {
  display: flex;
  background: #ffffff;
  border-radius: 50rpx;
  padding: 6rpx;
  margin-bottom: 20rpx;
}

.type-tab {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 40rpx;
}

.type-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-weight: 600;
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

.overview-income {
  font-size: 28rpx;
  color: #07c160;
  font-weight: 600;
}

.overview-expense {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.overview-balance {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

/* 内容 */
.content {
  margin-top: 20rpx;
}

.section-header {
  margin-bottom: 10rpx;
}

.section-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
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

.category-scroll {
  max-height: calc(100vh - 320rpx);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.category-left {
  display: flex;
  align-items: center;
}

.icon-circle {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f3f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.icon-text {
  font-size: 32rpx;
  color: #667eea;
}

.category-info {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.category-amount {
  font-size: 24rpx;
  color: #666;
}

.category-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 160rpx;
}

.progress-bar {
  width: 140rpx;
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 6rpx;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.percent-text {
  font-size: 22rpx;
  color: #999;
}
</style>
