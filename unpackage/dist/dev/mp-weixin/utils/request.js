"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../common/vendor.js");
const utils_auth = require("./auth.js");
const BASE_URL = "http://localhost:8081/api";
const TIMEOUT = 1e4;
class Request {
  constructor(baseURL = BASE_URL, timeout = TIMEOUT) {
    __publicField(this, "baseURL");
    __publicField(this, "timeout");
    this.baseURL = baseURL;
    this.timeout = timeout;
  }
  // 通用请求方法
  async request(config) {
    const { url, method = "GET", data, header = {}, timeout = this.timeout } = config;
    const token = utils_auth.getToken();
    if (token) {
      header["Authorization"] = `Bearer ${token}`;
    }
    header["Content-Type"] = header["Content-Type"] || "application/json";
    try {
      const response = await common_vendor.index.request({
        url: this.baseURL + url,
        method,
        data,
        header,
        timeout
      });
      const { statusCode, data: responseData } = response;
      if (statusCode !== 200) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }
      if (responseData.code !== 200) {
        if (responseData.code === 401) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }
        throw new Error(responseData.message || "请求失败");
      }
      return responseData;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.ts:70", "Request Error:", error);
      if (error.errMsg) {
        if (error.errMsg.includes("timeout")) {
          throw new Error("请求超时，请检查网络连接");
        } else if (error.errMsg.includes("fail")) {
          throw new Error("网络连接失败，请检查网络设置");
        }
      }
      throw error;
    }
  }
  // GET 请求
  get(url, params) {
    let queryString = "";
    if (params) {
      const queryParams = Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
      if (queryParams) {
        queryString = `?${queryParams}`;
      }
    }
    return this.request({
      url: url + queryString,
      method: "GET"
    });
  }
  // POST 请求
  post(url, data) {
    return this.request({
      url,
      method: "POST",
      data
    });
  }
  // PUT 请求
  put(url, data) {
    return this.request({
      url,
      method: "PUT",
      data
    });
  }
  // DELETE 请求
  delete(url) {
    return this.request({
      url,
      method: "DELETE"
    });
  }
}
const request = new Request();
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
