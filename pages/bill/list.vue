<template>
  <view class="bill-list-container">
    <!-- 顶部统计和月份切换 -->
    <view class="header">
      <view class="month-bar">
        <text class="arrow" @click="changeMonth(-1)">‹</text>
        <text class="month-text">{{ currentMonthLabel }}</text>
        <text class="arrow" @click="changeMonth(1)">›</text>
      </view>

      <view class="summary">
        <view class="summary-item">
          <text class="summary-label">本月支出</text>
          <text class="summary-expense">-{{ totalExpense.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">本月收入</text>
          <text class="summary-income">+{{ totalIncome.toFixed(2) }}</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">结余</text>
          <text class="summary-balance">{{ balanceSign }}{{ Math.abs(balance).toFixed(2) }}</text>
        </view>
      </view>

      <!-- 类型筛选 -->
      <view class="type-filter">
        <view 
          class="type-tab" 
          :class="{ active: filterType === 0 }"
          @click="setFilterType(0)"
        >全部</view>
        <view 
          class="type-tab" 
          :class="{ active: filterType === 1 }"
          @click="setFilterType(1)"
        >收入</view>
        <view 
          class="type-tab" 
          :class="{ active: filterType === 2 }"
          @click="setFilterType(2)"
        >支出</view>
      </view>
    </view>

    <!-- 账单列表 -->
    <view class="content">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="filteredBills.length === 0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">本月还没有记账记录</text>
      </view>
      <scroll-view v-else scroll-y class="list-scroll">
        <view 
          v-for="bill in filteredBills" 
          :key="bill.id" 
          class="bill-item"
        >
          <view class="bill-left">
            <view class="icon-circle">
              <text class="icon-text">{{ bill.categoryName.charAt(0) }}</text>
            </view>
            <view class="bill-info">
              <text class="bill-title">{{ bill.categoryName }}</text>
              <text class="bill-remark">{{ bill.remark || bill.description || '无备注' }}</text>
            </view>
          </view>
          <view class="bill-right">
            <text 
              class="bill-amount"
              :class="bill.type === 2 ? 'expense' : 'income'"
            >
              {{ bill.type === 2 ? '-' : '+' }}{{ bill.amount.toFixed(2) }}
            </text>
            <text class="bill-date">{{ formatDateDisplay(bill.billDate) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { billApi } from '../../api';
import type { BillResponse, BillQueryRequest } from '../../types';

// 加载状态
const loading = ref(false);

// 当前年月
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 筛选类型：0-全部 1-收入 2-支出
const filterType = ref<0 | 1 | 2>(0);

// 账单列表
const billList = ref<BillResponse[]>([]);

// 计算属性：当前月份文本
const currentMonthLabel = computed(() => {
  return `${currentYear.value}年${currentMonth.value.toString().padStart(2, '0')}月`;
});

// 计算属性：汇总
const totalIncome = computed(() => {
  return billList.value
    .filter(item => item.type === 1)
    .reduce((sum, item) => sum + (item.amount || 0), 0);
});

const totalExpense = computed(() => {
  return billList.value
    .filter(item => item.type === 2)
    .reduce((sum, item) => sum + (item.amount || 0), 0);
});

const balance = computed(() => totalIncome.value - totalExpense.value);

const balanceSign = computed(() => {
  if (balance.value > 0) return '+';
  if (balance.value < 0) return '-';
  return '';
});

// 计算属性：根据筛选类型过滤
const filteredBills = computed(() => {
  if (filterType.value === 0) {
    return billList.value;
  }
  return billList.value.filter(item => item.type === filterType.value);
});

// 工具函数：格式化日期字符串
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  // 兼容可能带时间的格式
  const datePart = dateStr.split(' ')[0];
  const parts = datePart.split('-');
  if (parts.length < 3) return datePart;
  return `${parts[1]}-${parts[2]}`;
};

// 根据当前年月生成查询条件
const getMonthRange = () => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value, 0);
  const query: BillQueryRequest = {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay)
  };
  return query;
};

// 设置筛选类型
const setFilterType = (type: 0 | 1 | 2) => {
  filterType.value = type;
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
  loadBillList();
};

// 加载账单列表
const loadBillList = async () => {
  try {
    loading.value = true;
    const query = getMonthRange();
    const res = await billApi.getList(query);
    if (res.code === 200 && Array.isArray(res.data)) {
      billList.value = res.data;
    } else {
      billList.value = [];
    }
  } catch (error: any) {
    console.error('获取账单列表失败:', error);
    uni.showToast({
      title: error?.message || '获取账单失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBillList();
});
</script>

<style scoped>
.bill-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  box-sizing: border-box;
}

/* 头部 */
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

.summary {
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.summary-label {
  font-size: 22rpx;
  color: #888;
  margin-bottom: 6rpx;
}

.summary-income {
  font-size: 28rpx;
  color: #07c160;
  font-weight: 600;
}

.summary-expense {
  font-size: 28rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.summary-balance {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

/* 类型筛选 */
.type-filter {
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

/* 内容区域 */
.content {
  background: transparent;
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

.bill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.bill-left {
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

.bill-info {
  display: flex;
  flex-direction: column;
}

.bill-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.bill-remark {
  font-size: 22rpx;
  color: #999;
}

.bill-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bill-amount {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 6rpx;
}

.bill-amount.income {
  color: #07c160;
}

.bill-amount.expense {
  color: #ff4d4f;
}

.bill-date {
  font-size: 22rpx;
  color: #999;
}
</style>
