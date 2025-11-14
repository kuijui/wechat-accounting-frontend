import { getToken } from './auth';
import type { ApiResponse } from '../types';

// 基础配置
const BASE_URL = 'http://localhost:8081/api';
const TIMEOUT = 10000;

// 请求配置接口
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

// 请求封装
class Request {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = BASE_URL, timeout: number = TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // 通用请求方法
  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { url, method = 'GET', data, header = {}, timeout = this.timeout } = config;
    
    // 添加认证头
    const token = getToken();
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    // 添加默认头
    header['Content-Type'] = header['Content-Type'] || 'application/json';
    
    try {
      const response = await uni.request({
        url: this.baseURL + url,
        method,
        data,
        header,
        timeout
      });
      
      const { statusCode, data: responseData } = response;
      
      // HTTP 状态码检查
      if (statusCode !== 200) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }
      
      // 业务状态码检查
      if (responseData.code !== 200) {
        // 如果是认证失败，清除 token 并跳转登录
        if (responseData.code === 401) {
          uni.removeStorageSync('token');
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }
        throw new Error(responseData.message || '请求失败');
      }
      
      return responseData;
    } catch (error: any) {
      console.error('Request Error:', error);
      
      // 网络错误处理
      if (error.errMsg) {
        if (error.errMsg.includes('timeout')) {
          throw new Error('请求超时，请检查网络连接');
        } else if (error.errMsg.includes('fail')) {
          throw new Error('网络连接失败，请检查网络设置');
        }
      }
      
      throw error;
    }
  }
  
  // GET 请求
  get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    let queryString = '';
    if (params) {
      const queryParams = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      if (queryParams) {
        queryString = `?${queryParams}`;
      }
    }
    
    return this.request<T>({
      url: url + queryString,
      method: 'GET'
    });
  }
  
  // POST 请求
  post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data
    });
  }
  
  // PUT 请求
  put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data
    });
  }
  
  // DELETE 请求
  delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE'
    });
  }
}

// 创建实例
const request = new Request();

export default request;
