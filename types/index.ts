// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户相关类型
export interface LoginRequest {
  code: string;
}

export interface LoginResponse {
  userId: number;
  nickname: string | null;
  avatarUrl: string | null;
  token: string;
  isNewUser: boolean;
}

export interface UserInfo {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
}

// 分类相关类型
export interface CategoryResponse {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: number; // 1-收入 2-支出
  sortOrder: number;
  isSystem: boolean;
}

// 账单相关类型
export interface BillRequest {
  categoryId: number;
  amount: number;
  type: number; // 1-收入 2-支出
  billDate: string;
  description?: string;
  remark?: string;
}

export interface BillQueryRequest {
  startDate?: string;
  endDate?: string;
  type?: number;
  categoryId?: number;
}

export interface BillResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  type: number;
  amount: number;
  billDate: string;
  description?: string;
  remark?: string;
  createTime: string | null;
}

// 统计相关类型
export interface StatisticResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  startDate: string;
  endDate: string;
}

export interface CategoryStatisticResponse {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  totalAmount: number;
  billCount: number;
  percentage?: number;
}

export interface TrendResponse {
  period: string;
  income: number;
  expense: number;
  balance: number;
}

// 预算相关类型
export interface BudgetRequest {
  categoryId?: number;
  amount: number;
  year: number;
  month: number;
  status?: number;
}

export interface BudgetResponse {
  id: number;
  categoryId: number | null;
  categoryName: string;
  amount: number;
  year: number;
  month: number;
  status: number;
  usedAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  createTime: string;
}
