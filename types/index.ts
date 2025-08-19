// 사용자 관련 타입
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  created_at: string
  updated_at: string
}

// 상품 관련 타입
export interface Product {
  id: string
  name: string
  sku: string
  description: string
  category: string
  current_stock: number
  min_stock: number
  max_stock: number
  unit_price: number
  supplier_id: string
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  name: string
  sku: string
  description: string
  category: string
  min_stock: number
  max_stock: number
  unit_price: number
  supplier_id: string
}

// 공급업체 관련 타입
export interface Supplier {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

// 재고 거래 관련 타입
export interface StockTransaction {
  id: string
  product_id: string
  transaction_type: 'in' | 'out' | 'adjustment'
  quantity: number
  unit_cost?: number
  unit_price?: number
  supplier_id?: string
  customer_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface StockInFormData {
  product_id: string
  quantity: number
  unit_cost: number
  supplier_id: string
  notes?: string
}

export interface StockOutFormData {
  product_id: string
  quantity: number
  unit_price: number
  customer_id?: string
  notes?: string
}

// 발주 관련 타입
export interface PurchaseOrder {
  id: string
  supplier_id: string
  order_date: string
  expected_delivery: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

// 매출 관련 타입
export interface Sale {
  id: string
  customer_id?: string
  sale_date: string
  total_amount: number
  payment_method: 'cash' | 'card' | 'transfer'
  status: 'completed' | 'pending' | 'cancelled'
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

// 알림 관련 타입
export interface Notification {
  id: string
  user_id: string
  type: 'low_stock' | 'out_of_stock' | 'order_placed' | 'order_delivered' | 'system'
  title: string
  message: string
  product_id?: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// 대시보드 통계 타입
export interface DashboardStats {
  total_products: number
  low_stock_count: number
  out_of_stock_count: number
  total_value: number
  monthly_sales: number
  monthly_profit: number
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T | null
  error: any
  message?: string
}

// 페이지네이션 타입
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  total_pages: number
  current_page: number
  has_next: boolean
  has_prev: boolean
}

// 검색 및 필터링 타입
export interface SearchFilters {
  search?: string
  category?: string
  supplier?: string
  min_price?: number
  max_price?: number
  stock_status?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
}

// 차트 데이터 타입
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface SalesChartData {
  date: string
  sales: number
  profit: number
  orders: number
}

// 설정 관련 타입
export interface UserSettings {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  language: 'ko' | 'en'
  notifications: {
    email: boolean
    push: boolean
    low_stock_threshold: number
    alert_frequency: 'immediate' | 'daily' | 'weekly'
  }
  dashboard: {
    default_view: 'overview' | 'inventory' | 'analytics'
    refresh_interval: number
    show_charts: boolean
  }
}

// 로그 관련 타입
export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: 'product' | 'order' | 'stock' | 'user'
  entity_id: string
  details: any
  ip_address?: string
  user_agent?: string
  created_at: string
}

// 에러 타입
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// 폼 검증 타입
export interface ValidationError {
  field: string
  message: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// 파일 업로드 타입
export interface FileUpload {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  uploaded_by: string
  created_at: string
}

// 내보내기/가져오기 타입
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  include_headers: boolean
  date_range?: {
    start: string
    end: string
  }
  filters?: SearchFilters
}

export interface ImportResult {
  success: boolean
  imported_count: number
  errors: Array<{
    row: number
    message: string
    data: any
  }>
}

// 웹훅 및 통합 타입
export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  is_active: boolean
  secret_key?: string
  created_at: string
}

export interface IntegrationConfig {
  id: string
  name: string
  type: 'accounting' | 'ecommerce' | 'shipping' | 'payment'
  config: Record<string, any>
  is_active: boolean
  last_sync?: string
  created_at: string
}
