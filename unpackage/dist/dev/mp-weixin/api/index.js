"use strict";
const utils_request = require("../utils/request.js");
const userApi = {
  // 用户登录
  login: (data) => {
    return utils_request.request.post("/user/login", data);
  },
  // 获取用户信息
  getUserInfo: () => {
    return utils_request.request.get("/user/info");
  },
  // 更新用户信息
  updateUserInfo: (data) => {
    return utils_request.request.put("/user/info", data);
  }
};
exports.userApi = userApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
