'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { signIn as signInAction, refreshAccessToken, signOut as signOutAction, UserRole } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  role: UserRole
}

interface AuthContextType {
  accessToken: string | null
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshAction = async () => {
    try {
      const resp = await refreshAccessToken()
      setAccessToken(resp.accessToken)
      setUser(resp.user)
    } catch (e) {
      setAccessToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAction()
  }, [])

  // Auto Refresh before expiration
  useEffect(() => {
    if (accessToken) {
      const interval = setInterval(refreshAction, 14 * 60 * 1000) // Refresh every 14 mins
      return () => clearInterval(interval)
    }
  }, [accessToken])

  const login = async (email: string, password: string) => {
    const resp = await signInAction(email, password)
    setAccessToken(resp.accessToken)
    setUser(resp.user)
    router.push('/')
  }

  const logout = async () => {
    await signOutAction()
    setAccessToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
