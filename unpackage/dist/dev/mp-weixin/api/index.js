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
const billApi = {
  // 创建账单
  create: (data) => {
    return utils_request.request.post("/bill/create", data);
  },
  // 获取账单列表
  getList: (query) => {
    return utils_request.request.post("/bill/list", query);
  },
  // 获取账单详情
  getDetail: (id) => {
    return utils_request.request.get(`/bill/detail/${id}`);
  },
  // 更新账单
  update: (id, data) => {
    return utils_request.request.put(`/bill/update/${id}`, data);
  },
  // 删除账单
  delete: (id) => {
    return utils_request.request.delete(`/bill/delete/${id}`);
  }
};
const statisticApi = {
  // 获取概览统计
  getOverview: (startDate, endDate) => {
    return utils_request.request.get("/statistic/overview", { startDate, endDate });
  },
  // 获取分类统计
  getCategoryStatistics: (type, startDate, endDate) => {
    return utils_request.request.get("/statistic/category", { type, startDate, endDate });
  },
  // 获取趋势统计
  getTrendStatistics: (startDate, endDate) => {
    return utils_request.request.get("/statistic/trend", { startDate, endDate });
  }
};
const budgetApi = {
  // 创建预算
  create: (data) => {
    return utils_request.request.post("/budget/create", data);
  },
  // 获取预算列表
  getList: (year, month) => {
    return utils_request.request.get("/budget/list", { year, month });
  },
  // 获取预算详情
  getDetail: (id) => {
    return utils_request.request.get(`/budget/detail/${id}`);
  },
  // 更新预算
  update: (id, data) => {
    return utils_request.request.put(`/budget/update/${id}`, data);
  },
  // 删除预算
  delete: (id) => {
    return utils_request.request.delete(`/budget/delete/${id}`);
  }
};
exports.billApi = billApi;
exports.budgetApi = budgetApi;
exports.statisticApi = statisticApi;
exports.userApi = userApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
