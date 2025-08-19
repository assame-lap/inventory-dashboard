import { supabase } from './supabase'

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
  error: any
}

export const getProducts = async (params: PaginationParams = {}): Promise<PaginatedResponse<Product>> => {
  const { page = 1, limit = 20, search, category, sortBy = 'created_at', sortOrder = 'desc' } = params
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (category) {
    query = query.eq('category', category)
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, count, error } = await query

  return {
    data: data || [],
    count: count || 0,
    error
  }
}

export const getProduct = async (id: string): Promise<{ data: Product | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

export const createProduct = async (productData: ProductFormData): Promise<{ data: Product | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  return { data, error }
}

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<{ data: Product | null; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export const deleteProduct = async (id: string): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  return { data, error }
}

export const getProductCountByCategory = async (): Promise<{ data: any[]; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .then(result => {
      if (result.error) return result
      
      const counts = result.data?.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return { data: Object.entries(counts || {}).map(([category, count]) => ({ category, count })), error: null }
    })

  return { data: data || [], error }
}

export const getLowStockProducts = async (): Promise<{ data: Product[]; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lte('current_stock', supabase.raw('min_stock'))

  return { data: data || [], error }
}

export const getOutOfStockProducts = async (): Promise<{ data: Product[]; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('current_stock', 0)

  return { data: data || [], error }
}

export const checkSkuExists = async (sku: string, excludeId?: string): Promise<{ exists: boolean; error: any }> => {
  let query = supabase
    .from('products')
    .select('id')
    .eq('sku', sku)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  return { exists: (data && data.length > 0), error }
}

export const searchProducts = async (searchTerm: string): Promise<{ data: Product[]; error: any }> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)

  return { data: data || [], error }
}
