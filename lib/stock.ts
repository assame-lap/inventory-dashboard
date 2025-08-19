import { supabase } from './supabase'

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

export const processStockIn = async (stockInData: StockInFormData): Promise<{ data: StockTransaction | null; error: any }> => {
  const { product_id, quantity, unit_cost, supplier_id, notes } = stockInData

  // Start a transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('stock_transactions')
    .insert([{
      product_id,
      transaction_type: 'in',
      quantity,
      unit_cost,
      supplier_id,
      notes,
    }])
    .select()
    .single()

  if (transactionError) return { data: null, error: transactionError }

  // Update product stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ 
      current_stock: supabase.raw(`current_stock + ${quantity}`),
      updated_at: new Date().toISOString()
    })
    .eq('id', product_id)

  if (updateError) return { data: null, error: updateError }

  return { data: transaction, error: null }
}

export const processStockOut = async (stockOutData: StockOutFormData): Promise<{ data: StockTransaction | null; error: any }> => {
  const { product_id, quantity, unit_price, customer_id, notes } = stockOutData

  // Check if sufficient stock exists
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('current_stock')
    .eq('id', product_id)
    .single()

  if (productError) return { data: null, error: productError }

  if (product.current_stock < quantity) {
    return { 
      data: null, 
      error: { message: '재고가 부족합니다' } 
    }
  }

  // Start a transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('stock_transactions')
    .insert([{
      product_id,
      transaction_type: 'out',
      quantity,
      unit_price,
      customer_id,
      notes,
    }])
    .select()
    .single()

  if (transactionError) return { data: null, error: transactionError }

  // Update product stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ 
      current_stock: supabase.raw(`current_stock - ${quantity}`),
      updated_at: new Date().toISOString()
    })
    .eq('id', product_id)

  if (updateError) return { data: null, error: updateError }

  return { data: transaction, error: null }
}

export const processStockAdjustment = async (
  product_id: string, 
  adjustment: number, 
  notes?: string
): Promise<{ data: StockTransaction | null; error: any }> => {
  // Start a transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('stock_transactions')
    .insert([{
      product_id,
      transaction_type: 'adjustment',
      quantity: Math.abs(adjustment),
      notes: notes || `재고 조정: ${adjustment > 0 ? '+' : ''}${adjustment}`,
    }])
    .select()
    .single()

  if (transactionError) return { data: null, error: transactionError }

  // Update product stock
  const { error: updateError } = await supabase
    .from('products')
    .update({ 
      current_stock: supabase.raw(`current_stock + ${adjustment}`),
      updated_at: new Date().toISOString()
    })
    .eq('id', product_id)

  if (updateError) return { data: null, error: updateError }

  return { data: transaction, error: null }
}

export const getStockTransactions = async (
  product_id?: string,
  limit: number = 50
): Promise<{ data: StockTransaction[]; error: any }> => {
  let query = supabase
    .from('stock_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (product_id) {
    query = query.eq('product_id', product_id)
  }

  const { data, error } = await query

  return { data: data || [], error }
}

export const getProductStockHistory = async (
  product_id: string,
  days: number = 30
): Promise<{ data: StockTransaction[]; error: any }> => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('stock_transactions')
    .select('*')
    .eq('product_id', product_id)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  return { data: data || [], error }
}

export const getDailyStockSummary = async (date: Date): Promise<{ data: any[]; error: any }> => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('stock_transactions')
    .select('*')
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString())

  if (error) return { data: [], error }

  // Group by product and calculate summary
  const summary = data?.reduce((acc, transaction) => {
    const productId = transaction.product_id
    if (!acc[productId]) {
      acc[productId] = {
        product_id: productId,
        total_in: 0,
        total_out: 0,
        total_adjustment: 0,
        transactions: []
      }
    }

    acc[productId].transactions.push(transaction)

    switch (transaction.transaction_type) {
      case 'in':
        acc[productId].total_in += transaction.quantity
        break
      case 'out':
        acc[productId].total_out += transaction.quantity
        break
      case 'adjustment':
        acc[productId].total_adjustment += transaction.quantity
        break
    }

    return acc
  }, {} as Record<string, any>)

  return { data: Object.values(summary || {}), error: null }
}

export const getStockTransactionStats = async (
  startDate: Date,
  endDate: Date
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('stock_transactions')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (error) return { data: null, error }

  const stats = {
    total_transactions: data?.length || 0,
    total_in: data?.filter(t => t.transaction_type === 'in').reduce((sum, t) => sum + t.quantity, 0) || 0,
    total_out: data?.filter(t => t.transaction_type === 'out').reduce((sum, t) => sum + t.quantity, 0) || 0,
    total_adjustments: data?.filter(t => t.transaction_type === 'adjustment').reduce((sum, t) => sum + t.quantity, 0) || 0,
    products_affected: new Set(data?.map(t => t.product_id)).size,
  }

  return { data: stats, error: null }
}
