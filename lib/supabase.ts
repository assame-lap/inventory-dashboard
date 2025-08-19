import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  SUPPLIERS: 'suppliers',
  STOCK_TRANSACTIONS: 'stock_transactions',
  PURCHASE_ORDERS: 'purchase_orders',
  PURCHASE_ORDER_ITEMS: 'purchase_order_items',
  SALES: 'sales',
  NOTIFICATIONS: 'notifications'
} as const

export const createRLSPolicies = async () => {
  // This function would be run in Supabase SQL Editor
  console.log('RLS policies should be created in Supabase SQL Editor')
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
