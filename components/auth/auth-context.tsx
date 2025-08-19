"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUser, getCurrentUser, signOut } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (error) {
        setUser(null)
      } else {
        setUser(currentUser)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
