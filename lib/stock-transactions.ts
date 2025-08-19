import { supabase } from './supabase'
import { StockTransaction, StockInFormData, StockOutFormData } from '@/types'

// 재고 입고 처리
export const processStockIn = async (data: StockInFormData, userId: string): Promise<StockTransaction> => {
  try {
    // 트랜잭션 시작
    const { data: transaction, error: transactionError } = await supabase
      .from('stock_transactions')
      .insert({
        product_id: data.product_id,
        transaction_type: 'in',
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_amount: data.quantity * data.unit_price,
        user_id: userId,
        notes: data.notes,
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error(transactionError.message)
    }

    // 입고 상세 정보 저장
    const { error: detailError } = await supabase
      .from('stock_in_details')
      .insert({
        transaction_id: transaction.id,
        supplier_id: data.supplier_id,
        expected_delivery_date: data.expected_delivery_date,
        actual_delivery_date: new Date().toISOString().split('T')[0],
      })

    if (detailError) {
      // 상세 정보 저장 실패 시 트랜잭션도 롤백
      await supabase
        .from('stock_transactions')
        .delete()
        .eq('id', transaction.id)
      throw new Error(detailError.message)
    }

    return transaction
  } catch (error) {
    throw new Error('재고 입고 처리 중 오류가 발생했습니다.')
  }
}

// 재고 출고 처리
export const processStockOut = async (data: StockOutFormData, userId: string): Promise<StockTransaction> => {
  try {
    // 현재 재고 확인
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('current_stock')
      .eq('id', data.product_id)
      .single()

    if (productError) {
      throw new Error(productError.message)
    }

    if (product.current_stock < data.quantity) {
      throw new Error('재고가 부족합니다.')
    }

    // 트랜잭션 생성
    const { data: transaction, error: transactionError } = await supabase
      .from('stock_transactions')
      .insert({
        product_id: data.product_id,
        transaction_type: 'out',
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_amount: data.quantity * data.unit_price,
        user_id: userId,
        notes: data.notes,
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error(transactionError.message)
    }

    // 출고 상세 정보 저장
    const { error: detailError } = await supabase
      .from('stock_out_details')
      .insert({
        transaction_id: transaction.id,
        customer_name: data.customer_name,
        order_number: data.order_number,
      })

    if (detailError) {
      // 상세 정보 저장 실패 시 트랜잭션도 롤백
      await supabase
        .from('stock_transactions')
        .delete()
        .eq('id', transaction.id)
      throw new Error(detailError.message)
    }

    return transaction
  } catch (error) {
    throw new Error('재고 출고 처리 중 오류가 발생했습니다.')
  }
}

// 재고 조정 처리
export const processStockAdjustment = async (
  productId: string,
  quantity: number,
  reason: string,
  userId: string
): Promise<StockTransaction> => {
  try {
    const { data: transaction, error } = await supabase
      .from('stock_transactions')
      .insert({
        product_id: productId,
        transaction_type: 'adjustment',
        quantity: Math.abs(quantity),
        unit_price: 0,
        total_amount: 0,
        user_id: userId,
        notes: reason,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return transaction
  } catch (error) {
    throw new Error('재고 조정 처리 중 오류가 발생했습니다.')
  }
}

// 재고 거래 이력 조회
export const getStockTransactions = async (
  productId?: string,
  transactionType?: string,
  limit: number = 50
): Promise<StockTransaction[]> => {
  try {
    let query = supabase
      .from('stock_transactions')
      .select(`
        *,
        products (
          id,
          name,
          sku
        ),
        users (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (transactionType) {
      query = query.eq('transaction_type', transactionType)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    throw new Error('재고 거래 이력을 가져오는 중 오류가 발생했습니다.')
  }
}

// 상품별 재고 이력 조회
export const getProductStockHistory = async (productId: string): Promise<StockTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('stock_transactions')
      .select(`
        *,
        users (
          id,
          name
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    throw new Error('상품 재고 이력을 가져오는 중 오류가 발생했습니다.')
  }
}

// 일별 재고 변동 요약
export const getDailyStockSummary = async (date: string): Promise<Array<{
  product_id: string
  product_name: string
  in_quantity: number
  out_quantity: number
  net_change: number
}>> => {
  try {
    const { data, error } = await supabase
      .from('stock_transactions')
      .select(`
        product_id,
        transaction_type,
        quantity,
        products (
          name
        )
      `)
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`)

    if (error) {
      throw new Error(error.message)
    }

    // 상품별로 입출고 수량 집계
    const summary = data?.reduce((acc, transaction) => {
      const productId = transaction.product_id
      const productName = transaction.products?.name || 'Unknown'
      
      if (!acc[productId]) {
        acc[productId] = {
          product_id: productId,
          product_name: productName,
          in_quantity: 0,
          out_quantity: 0,
          net_change: 0,
        }
      }

      if (transaction.transaction_type === 'in') {
        acc[productId].in_quantity += transaction.quantity
        acc[productId].net_change += transaction.quantity
      } else if (transaction.transaction_type === 'out') {
        acc[productId].out_quantity += transaction.quantity
        acc[productId].net_change -= transaction.quantity
      }

      return acc
    }, {} as Record<string, any>)

    return Object.values(summary || {})
  } catch (error) {
    throw new Error('일별 재고 요약을 가져오는 중 오류가 발생했습니다.')
  }
}

// 재고 거래 통계
export const getStockTransactionStats = async (
  startDate: string,
  endDate: string
): Promise<{
  total_in: number
  total_out: number
  total_adjustments: number
  total_value: number
}> => {
  try {
    const { data, error } = await supabase
      .from('stock_transactions')
      .select('transaction_type, quantity, unit_price, total_amount')
      .gte('created_at', `${startDate}T00:00:00`)
      .lte('created_at', `${endDate}T23:59:59`)

    if (error) {
      throw new Error(error.message)
    }

    const stats = data?.reduce(
      (acc, transaction) => {
        if (transaction.transaction_type === 'in') {
          acc.total_in += transaction.quantity
          acc.total_value += transaction.total_amount
        } else if (transaction.transaction_type === 'out') {
          acc.total_out += transaction.quantity
        } else if (transaction.transaction_type === 'adjustment') {
          acc.total_adjustments += transaction.quantity
        }
        return acc
      },
      {
        total_in: 0,
        total_out: 0,
        total_adjustments: 0,
        total_value: 0,
      }
    )

    return stats || {
      total_in: 0,
      total_out: 0,
      total_adjustments: 0,
      total_value: 0,
    }
  } catch (error) {
    throw new Error('재고 거래 통계를 가져오는 중 오류가 발생했습니다.')
  }
}
