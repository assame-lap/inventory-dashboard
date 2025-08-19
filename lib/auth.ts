import { supabase } from './supabase'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  created_at: string
  updated_at: string
}

export const signUp = async (userData: {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'staff'
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  })

  if (error) return { user: null, error }

  if (data.user) {
    // Create user profile in custom users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      })

    if (profileError) return { user: null, error: profileError }
  }

  return { user: data.user, error: null }
}

export const signIn = async (credentials: {
  email: string
  password: string
}) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) return { user: null, error }

  if (data.user) {
    // Get user profile from custom users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) return { user: null, error: profileError }

    return { user: profile, error: null }
  }

  return { user: null, error: null }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) return null
  return profile
}

export const checkUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) return null
  return data.role
}

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  return { error }
}

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { error }
}
