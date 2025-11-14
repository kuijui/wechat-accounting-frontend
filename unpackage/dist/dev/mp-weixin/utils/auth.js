"use strict";
const common_vendor = require("../common/vendor.js");
const getToken = () => {
  try {
    return common_vendor.index.getStorageSync("token") || null;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/auth.ts:8", "Get token error:", error);
    return null;
  }
};
const setToken = (token) => {
  try {
    common_vendor.index.setStorageSync("token", token);
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/auth.ts:17", "Set token error:", error);
  }
};
const getUserInfo = () => {
  try {
    const userInfoStr = common_vendor.index.getStorageSync("userInfo");
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/auth.ts:35", "Get user info error:", error);
    return null;
  }
};
const setUserInfo = (userInfo) => {
  try {
    common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/auth.ts:44", "Set user info error:", error);
  }
};
const isLoggedIn = () => {
  const token = getToken();
  const userInfo = getUserInfo();
  return !!(token && userInfo);
};
const saveLoginInfo = (loginResponse) => {
  const { token, userId, nickname, avatarUrl } = loginResponse;
  setToken(token);
  setUserInfo({
    id: userId,
    nickname,
    avatarUrl
  });
};
const checkAuth = () => {
  if (!isLoggedIn()) {
    common_vendor.index.reLaunch({
      url: "/pages/login/login"
    });
    return false;
  }
  return true;
};
const getWechatLoginCode = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error("获取登录码失败"));
        }
      },
      fail: (error) => {
        reject(new Error("微信登录失败: " + (error.errMsg || "未知错误")));
      }
    });
  });
};
exports.checkAuth = checkAuth;
exports.getToken = getToken;
exports.getWechatLoginCode = getWechatLoginCode;
exports.saveLoginInfo = saveLoginInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
