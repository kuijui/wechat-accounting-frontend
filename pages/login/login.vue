<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <!-- 主要内容 -->
    <view class="login-content">
      <!-- Logo 和标题 -->
      <view class="header">
        <view class="logo">
          <text class="logo-icon">💰</text>
        </view>
        <view class="title">微信记账</view>
        <view class="subtitle">让记账变得简单有趣</view>
      </view>
      
      <!-- 登录表单 -->
      <view class="login-form">
        <!-- 测试登录按钮 -->
        <button 
          class="login-btn test-btn"
          @click="handleTestLogin"
          :disabled="loading"
        >
          <text v-if="loading" class="loading-text">登录中...</text>
          <text v-else>🧪 测试登录</text>
        </button>
        
        <!-- 微信登录按钮 -->
        <button 
          class="login-btn wechat-btn"
          @click="handleWechatLogin"
          :disabled="loading"
          open-type="getUserInfo"
          @getuserinfo="onGetUserInfo"
        >
          <text v-if="loading" class="loading-text">登录中...</text>
          <text v-else>🔐 微信登录</text>
        </button>
        
        <!-- 提示文本 -->
        <view class="tips">
          <text class="tip-text">登录即表示同意</text>
          <text class="link-text">《用户协议》</text>
          <text class="tip-text">和</text>
          <text class="link-text">《隐私政策》</text>
        </view>
      </view>
    </view>
    
    <!-- 底部信息 -->
    <view class="footer">
      <text class="footer-text">安全 · 便捷 · 智能</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userApi } from '../../api';
import { saveLoginInfo, getWechatLoginCode } from '../../utils/auth';
import type { LoginRequest } from '../../types';

// 响应式数据
const loading = ref(false);

// 测试登录
const handleTestLogin = async () => {
  if (loading.value) return;
  
  try {
    loading.value = true;
    
    // 使用测试登录码
    const loginData: LoginRequest = {
      code: 'test-12345'
    };
    
    const response = await userApi.login(loginData);
    
    if (response.code === 200) {
      // 保存登录信息
      saveLoginInfo(response.data);
      
      // 显示成功提示
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      // 延迟跳转到首页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }, 1500);
    }
  } catch (error: any) {
    console.error('登录失败:', error);
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

// 微信登录
const handleWechatLogin = async () => {
  if (loading.value) return;
  
  try {
    loading.value = true;
    
    // 获取微信登录码
    const code = await getWechatLoginCode();
    
    const loginData: LoginRequest = {
      code
    };
    
    const response = await userApi.login(loginData);
    
    if (response.code === 200) {
      // 保存登录信息
      saveLoginInfo(response.data);
      
      // 显示成功提示
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });
      
      // 延迟跳转到首页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }, 1500);
    }
  } catch (error: any) {
    console.error('微信登录失败:', error);
    uni.showToast({
      title: error.message || '微信登录失败',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};

// 获取用户信息回调（兼容旧版本）
const onGetUserInfo = (e: any) => {
  console.log('获取用户信息:', e.detail);
  // 这里可以处理用户授权信息
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40rpx 60rpx;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  bottom: 20%;
  left: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 50%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* 主要内容 */
.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

/* 头部 */
.header {
  text-align: center;
  margin-bottom: 120rpx;
}

.logo {
  margin-bottom: 40rpx;
}

.logo-icon {
  font-size: 120rpx;
  display: block;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20rpx;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

/* 登录表单 */
.login-form {
  width: 100%;
  max-width: 500rpx;
}

.login-btn {
  width: 100%;
  height: 100rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin-bottom: 30rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.test-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: #ffffff;
}

.test-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}

.wechat-btn {
  background: linear-gradient(135deg, #07c160, #06ad56);
  color: #ffffff;
}

.wechat-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}

.login-btn:disabled {
  opacity: 0.6;
  transform: none !important;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
}

/* 提示文本 */
.tips {
  text-align: center;
  margin-top: 60rpx;
  line-height: 1.6;
}

.tip-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.link-text {
  font-size: 24rpx;
  color: #ffffff;
  text-decoration: underline;
}

/* 底部 */
.footer {
  text-align: center;
  z-index: 1;
}

.footer-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
}
</style>
