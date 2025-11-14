<template>
  <view class="bill-add-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="nav-bar">
        <text class="back-btn" @click="goBack">←</text>
        <text class="title">记一笔</text>
        <view style="width: 60rpx"></view>
      </view>
    </view>

    <!-- 主要内容 -->
    <view class="content">
      <!-- 类型选择 -->
      <view class="type-selector">
        <view 
          class="type-btn" 
          :class="{ active: billType === 'expense' }"
          @click="changeBillType('expense')"
        >
          <text class="type-icon">💵</text>
          <text class="type-text">支出</text>
        </view>
        <view 
          class="type-btn" 
          :class="{ active: billType === 'income' }"
          @click="changeBillType('income')"
        >
          <text class="type-icon">💴</text>
          <text class="type-text">收入</text>
        </view>
      </view>

      <!-- 金额输入 -->
      <view class="form-group">
        <view class="amount-input-wrapper">
          <text class="currency">¥</text>
          <input 
            v-model="form.amount" 
            type="digit" 
            placeholder="0.00"
            class="amount-input"
            @input="handleAmountInput"
          />
        </view>
      </view>

      <!-- 表单项 -->
      <view class="form-group">
        <text class="label">分类</text>
        <view class="category-selector" @click="showCategoryPicker = true">
          <text class="category-text">{{ selectedCategory || '请选择分类' }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="form-group">
        <text class="label">日期</text>
        <view class="date-selector" @click="showDatePicker = true">
          <text class="date-text">{{ form.date }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="form-group">
        <text class="label">备注</text>
        <textarea 
          v-model="form.remark" 
          placeholder="添加备注（可选）"
          class="remark-input"
          maxlength="200"
        />
      </view>

      <!-- 提交按钮 -->
      <view class="button-group">
        <button class="submit-btn" @click="submitBill" :disabled="!form.amount">
          💾 保存记录
        </button>
      </view>
    </view>

    <!-- 分类选择器 -->
    <view v-if="showCategoryPicker" class="picker-overlay" @click="showCategoryPicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择分类</text>
          <text class="close-btn" @click="showCategoryPicker = false">×</text>
        </view>
        <view class="category-list">
          <view 
            v-for="cat in categories" 
            :key="cat.id" 
            class="category-item"
            @click="selectCategory(cat)"
          >
            <text>{{ cat.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 日期选择器 -->
    <view v-if="showDatePicker" class="picker-overlay" @click="showDatePicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择日期</text>
          <text class="close-btn" @click="showDatePicker = false">×</text>
        </view>
        <input 
          type="date" 
          v-model="form.date"
          class="date-input"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { billApi, categoryApi } from '../../api';
import type { CategoryResponse, BillRequest } from '../../types';

// 数据定义
const billType = ref<'income' | 'expense'>('expense');
const showCategoryPicker = ref(false);
const showDatePicker = ref(false);
const selectedCategory = ref('');
const selectedCategoryId = ref<number | null>(null);

const form = reactive({
  amount: '',
  date: new Date().toISOString().split('T')[0],
  remark: ''
});

// 分类列表
const categories = ref<CategoryResponse[]>([]);

// 加载分类
const loadCategories = async () => {
  try {
    const type = billType.value === 'income' ? 1 : 2;
    const res = await categoryApi.getList(type);
    if (res.code === 200 && Array.isArray(res.data)) {
      categories.value = res.data;
    } else {
      categories.value = [];
    }
  } catch (error: any) {
    console.error('获取分类失败:', error);
    categories.value = [];
    uni.showToast({
      title: error?.message || '获取分类失败',
      icon: 'none'
    });
  }
};

// 切换收支类型
const changeBillType = (type: 'income' | 'expense') => {
  if (billType.value === type) return;
  billType.value = type;
  // 切换类型时清空当前选中的分类
  selectedCategory.value = '';
  selectedCategoryId.value = null;
  loadCategories();
};

// 方法
const handleAmountInput = () => {
  // 验证金额格式
  if (form.amount && !/^\d+(\.\d{0,2})?$/.test(form.amount)) {
    form.amount = form.amount.replace(/[^\d.]/g, '');
  }
};

const selectCategory = (category: any) => {
  selectedCategory.value = category.name;
  selectedCategoryId.value = category.id;
  showCategoryPicker.value = false;
};

const submitBill = async () => {
  if (!form.amount) {
    uni.showToast({
      title: '请输入金额',
      icon: 'none'
    });
    return;
  }

  const amountNum = Number(form.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    uni.showToast({
      title: '金额必须大于0',
      icon: 'none'
    });
    return;
  }

  if (!selectedCategoryId.value) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none'
    });
    return;
  }

  const payload: BillRequest = {
    categoryId: selectedCategoryId.value as number,
    amount: amountNum,
    type: billType.value === 'income' ? 1 : 2,
    billDate: form.date,
    remark: form.remark || undefined
  };

  try {
    uni.showLoading({ title: '保存中...' });
    const res = await billApi.create(payload);
    if (res.code === 200) {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });

      // 清空表单
      form.amount = '';
      form.remark = '';
      selectedCategory.value = '';
      selectedCategoryId.value = null;
      form.date = new Date().toISOString().split('T')[0];
    } else {
      uni.showToast({
        title: res.message || '保存失败',
        icon: 'none'
      });
    }
  } catch (error: any) {
    console.error('保存账单失败:', error);
    uni.showToast({
      title: error?.message || '保存失败',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  console.log('记账页面加载');
  loadCategories();
});
</script>

<style scoped>
.bill-add-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 顶部导航 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 0;
  margin-bottom: 40rpx;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
}

.back-btn {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  flex: 1;
  text-align: center;
}

/* 类型选择 */
.type-selector {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
  padding: 0 20rpx;
}

.type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  background: #fff;
  border-radius: 15rpx;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s ease;
}

.type-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.type-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.type-text {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.type-btn.active .type-text {
  color: #fff;
}

/* 金额输入 */
.content {
  padding: 0 20rpx;
}

.form-group {
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 15rpx;
  padding: 20rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  font-size: 60rpx;
  font-weight: bold;
}

.currency {
  color: #667eea;
  margin-right: 10rpx;
}

.amount-input {
  flex: 1;
  font-size: 60rpx;
  font-weight: bold;
  color: #333;
  border: none;
  outline: none;
}

.label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.category-selector,
.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 10rpx;
  border: 1rpx solid #e0e0e0;
}

.category-text,
.date-text {
  font-size: 28rpx;
  color: #333;
}

.arrow {
  font-size: 32rpx;
  color: #999;
}

.remark-input {
  width: 100%;
  min-height: 100rpx;
  padding: 15rpx;
  background: #f9f9f9;
  border: 1rpx solid #e0e0e0;
  border-radius: 10rpx;
  font-size: 24rpx;
  color: #333;
  box-sizing: border-box;
}

/* 按钮 */
.button-group {
  margin-top: 40rpx;
  padding: 0 20rpx;
}

.submit-btn {
  width: 100%;
  padding: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 15rpx;
  font-size: 28rpx;
  font-weight: bold;
  transition: all 0.3s ease;
}

.submit-btn:disabled {
  opacity: 0.5;
}

/* 选择器模态 */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.picker-content {
  width: 100%;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.picker-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  padding: 30rpx;
}

.category-item {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #333;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.category-item:active {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.date-input {
  width: 100%;
  padding: 20rpx;
  font-size: 28rpx;
  border: none;
  outline: none;
}
</style>
