'use client'

import React from 'react'
import { AuthProvider } from '@/components/auth/AuthContext'
import { Sidebar } from '@/components/Sidebar'
import { usePathname } from 'next/navigation'

export function ClientLayout({ children, initialUser }: { children: React.ReactNode, initialUser: any }) {
  const pathname = usePathname()
  const publicRoutes = ['/home', '/login', '/signup', '/connect']
  const isPublic = publicRoutes.includes(pathname)

  return (
    <AuthProvider>
       {!isPublic && <Sidebar user={initialUser} />}
       <main className={`flex-1 ${!isPublic ? 'ml-64' : ''} min-h-screen overflow-y-auto`}>
          {children}
       </main>
    </AuthProvider>
  )
}
