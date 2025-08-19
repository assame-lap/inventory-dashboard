import { supabase } from './supabase'

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

export interface CreateNotificationData {
  user_id: string
  type: Notification['type']
  title: string
  message: string
  product_id?: string
}

export const createNotification = async (
  notificationData: CreateNotificationData
): Promise<{ data: Notification | null; error: any }> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single()

  return { data, error }
}

export const getNotifications = async (
  user_id: string,
  limit: number = 50,
  unread_only: boolean = false
): Promise<{ data: Notification[]; error: any }> => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (unread_only) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query

  return { data: data || [], error }
}

export const markNotificationAsRead = async (
  notification_id: string
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', notification_id)

  return { data, error }
}

export const markAllNotificationsAsRead = async (
  user_id: string
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ 
      is_read: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user_id)
    .eq('is_read', false)

  return { data, error }
}

export const deleteNotification = async (
  notification_id: string
): Promise<{ data: any; error: any }> => {
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notification_id)

  return { data, error }
}

export const getUnreadNotificationCount = async (
  user_id: string
): Promise<{ data: number; error: any }> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .eq('is_read', false)

  return { data: count || 0, error }
}

export const createLowStockNotification = async (
  user_id: string,
  product_id: string,
  product_name: string,
  current_stock: number,
  min_stock: number
): Promise<{ data: Notification | null; error: any }> => {
  return createNotification({
    user_id,
    type: 'low_stock',
    title: '재고 부족 알림',
    message: `${product_name}의 재고가 부족합니다. 현재 재고: ${current_stock}, 최소 재고: ${min_stock}`,
    product_id,
  })
}

export const createOutOfStockNotification = async (
  user_id: string,
  product_id: string,
  product_name: string
): Promise<{ data: Notification | null; error: any }> => {
  return createNotification({
    user_id,
    type: 'out_of_stock',
    title: '재고 소진 알림',
    message: `${product_name}의 재고가 소진되었습니다.`,
    product_id,
  })
}

export const createOrderPlacedNotification = async (
  user_id: string,
  order_id: string,
  supplier_name: string
): Promise<{ data: Notification | null; error: any }> => {
  return createNotification({
    user_id,
    type: 'order_placed',
    title: '발주 완료',
    message: `${supplier_name}에 발주가 완료되었습니다.`,
  })
}

export const createOrderDeliveredNotification = async (
  user_id: string,
  order_id: string,
  supplier_name: string
): Promise<{ data: Notification | null; error: any }> => {
  return createNotification({
    user_id,
    type: 'order_delivered',
    title: '입고 완료',
    message: `${supplier_name}의 발주가 입고되었습니다.`,
  })
}

export const createSystemNotification = async (
  user_id: string,
  title: string,
  message: string
): Promise<{ data: Notification | null; error: any }> => {
  return createNotification({
    user_id,
    type: 'system',
    title,
    message,
  })
}
