import request from '../utils/request';
import type {
  LoginRequest,
  LoginResponse,
  UserInfo,
  CategoryResponse,
  BillRequest,
  BillQueryRequest,
  BillResponse,
  StatisticResponse,
  CategoryStatisticResponse,
  TrendResponse,
  BudgetRequest,
  BudgetResponse,
  ApiResponse
} from '../types';

// 用户相关 API
export const userApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/user/login', data);
  },
  
  // 获取用户信息
  getUserInfo: (): Promise<ApiResponse<UserInfo>> => {
    return request.get('/user/info');
  },
  
  // 更新用户信息
  updateUserInfo: (data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> => {
    return request.put('/user/info', data);
  }
};

// 分类相关 API
export const categoryApi = {
  // 获取分类列表
  getList: (type?: number): Promise<ApiResponse<CategoryResponse[]>> => {
    return request.get('/category/list', { type });
  },
  
  // 创建分类
  create: (data: any): Promise<ApiResponse<any>> => {
    return request.post('/category/create', data);
  },
  
  // 更新分类
  update: (id: number, data: any): Promise<ApiResponse<any>> => {
    return request.put(`/category/update/${id}`, data);
  },
  
  // 删除分类
  delete: (id: number): Promise<ApiResponse<string>> => {
    return request.delete(`/category/delete/${id}`);
  }
};

// 账单相关 API
export const billApi = {
  // 创建账单
  create: (data: BillRequest): Promise<ApiResponse<BillResponse>> => {
    return request.post('/bill/create', data);
  },
  
  // 获取账单列表
  getList: (query: BillQueryRequest): Promise<ApiResponse<BillResponse[]>> => {
    return request.post('/bill/list', query);
  },
  
  // 获取账单详情
  getDetail: (id: number): Promise<ApiResponse<BillResponse>> => {
    return request.get(`/bill/detail/${id}`);
  },
  
  // 更新账单
  update: (id: number, data: BillRequest): Promise<ApiResponse<BillResponse>> => {
    return request.put(`/bill/update/${id}`, data);
  },
  
  // 删除账单
  delete: (id: number): Promise<ApiResponse<string>> => {
    return request.delete(`/bill/delete/${id}`);
  }
};

// 统计相关 API
export const statisticApi = {
  // 获取概览统计
  getOverview: (startDate: string, endDate: string): Promise<ApiResponse<StatisticResponse>> => {
    return request.get('/statistic/overview', { startDate, endDate });
  },
  
  // 获取分类统计
  getCategoryStatistics: (
    type: number, 
    startDate: string, 
    endDate: string
  ): Promise<ApiResponse<CategoryStatisticResponse[]>> => {
    return request.get('/statistic/category', { type, startDate, endDate });
  },
  
  // 获取趋势统计
  getTrendStatistics: (
    startDate: string, 
    endDate: string
  ): Promise<ApiResponse<TrendResponse[]>> => {
    return request.get('/statistic/trend', { startDate, endDate });
  }
};

// 预算相关 API
export const budgetApi = {
  // 创建预算
  create: (data: BudgetRequest): Promise<ApiResponse<null>> => {
    return request.post('/budget/create', data);
  },
  
  // 获取预算列表
  getList: (year: number, month: number): Promise<ApiResponse<BudgetResponse[]>> => {
    return request.get('/budget/list', { year, month });
  },
  
  // 获取预算详情
  getDetail: (id: number): Promise<ApiResponse<BudgetResponse>> => {
    return request.get(`/budget/detail/${id}`);
  },
  
  // 更新预算
  update: (id: number, data: BudgetRequest): Promise<ApiResponse<null>> => {
    return request.put(`/budget/update/${id}`, data);
  },
  
  // 删除预算
  delete: (id: number): Promise<ApiResponse<string>> => {
    return request.delete(`/budget/delete/${id}`);
  }
};

// 导出所有 API
export default {
  user: userApi,
  category: categoryApi,
  bill: billApi,
  statistic: statisticApi,
  budget: budgetApi
};
