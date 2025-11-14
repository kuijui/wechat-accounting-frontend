import type { LoginResponse, UserInfo } from '../types';

// Token 相关操作
export const getToken = (): string | null => {
  try {
    return uni.getStorageSync('token') || null;
  } catch (error) {
    console.error('Get token error:', error);
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    uni.setStorageSync('token', token);
  } catch (error) {
    console.error('Set token error:', error);
  }
};

export const removeToken = (): void => {
  try {
    uni.removeStorageSync('token');
  } catch (error) {
    console.error('Remove token error:', error);
  }
};

// 用户信息相关操作
export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfoStr = uni.getStorageSync('userInfo');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
};

export const setUserInfo = (userInfo: UserInfo): void => {
  try {
    uni.setStorageSync('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error('Set user info error:', error);
  }
};

export const removeUserInfo = (): void => {
  try {
    uni.removeStorageSync('userInfo');
  } catch (error) {
    console.error('Remove user info error:', error);
  }
};

// 登录状态检查
export const isLoggedIn = (): boolean => {
  const token = getToken();
  const userInfo = getUserInfo();
  return !!(token && userInfo);
};

// 登录成功后保存信息
export const saveLoginInfo = (loginResponse: LoginResponse): void => {
  const { token, userId, nickname, avatarUrl } = loginResponse;
  
  // 保存 token
  setToken(token);
  
  // 保存用户信息
  setUserInfo({
    id: userId,
    nickname,
    avatarUrl
  });
};

// 退出登录
export const logout = (): void => {
  removeToken();
  removeUserInfo();
  
  // 跳转到登录页
  uni.reLaunch({
    url: '/pages/login/login'
  });
};

// 检查登录状态，未登录则跳转登录页
export const checkAuth = (): boolean => {
  if (!isLoggedIn()) {
    uni.reLaunch({
      url: '/pages/login/login'
    });
    return false;
  }
  return true;
};

// 获取微信登录码
export const getWechatLoginCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error('获取登录码失败'));
        }
      },
      fail: (error) => {
        reject(new Error('微信登录失败: ' + (error.errMsg || '未知错误')));
      }
    });
  });
};
