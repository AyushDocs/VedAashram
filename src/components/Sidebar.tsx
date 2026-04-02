'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  Building2,
  Stethoscope,
  ChevronDown,
  Calendar,
  Heart,
  DollarSign,
  FlaskConical,
  ShoppingBag,
  ShieldAlert,
  Zap,
  Network
} from 'lucide-react'
import { useAuth } from './auth/AuthContext'
import { UserRole } from '@/app/actions'

const navItems = [
  { name: 'Mission Control', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'NURSE'] },
  { name: 'Emergency Node', href: '/emergency', icon: ShieldAlert, roles: ['ADMIN', 'NURSE', 'DOCTOR'] },
  { name: 'Automation Node', href: '/automation', icon: Zap, roles: ['ADMIN', 'NURSE'] },
  { name: 'Command Center', href: '/command-center', icon: Network, roles: ['ADMIN', 'NURSE'] },
  { name: 'My Health Portal', href: '/patient/phr', icon: Heart, roles: ['PATIENT', 'ADMIN'] },
  { name: 'Doctor Dashboard', href: '/doctor', icon: Stethoscope, roles: ['DOCTOR', 'ADMIN'] },
  { name: 'Pharmacy Hub', href: '/pharmacy', icon: ShoppingBag, roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { name: 'LIS Laboratory', href: '/laboratory', icon: FlaskConical, roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Revenue Cluster', href: '/billing', icon: DollarSign, roles: ['ADMIN'] },
  { name: 'Staff Management', href: '/staff', icon: Users, roles: ['ADMIN'] },
  { name: 'Equipment Node', href: '/inventory/equipment', icon: Package, roles: ['ADMIN', 'NURSE', 'DOCTOR'] },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarUser {
  name: string
  role: UserRole
  email?: string
}

export function Sidebar({ user: initialUser }: { user: SidebarUser | null }) {
  const pathname = usePathname()
  const { user: authUser, logout } = useAuth()
  
  // Use a derived state pattern or ref for the simulation
  const [selectedSimUser, setSelectedSimUser] = useState<SidebarUser | null>(initialUser)
  
  const currentUser: SidebarUser = selectedSimUser || (authUser ? {
    name: authUser.email.split('@')[0],
    role: authUser.role as UserRole,
    email: authUser.email
  } : { name: 'Guest', role: 'ADMIN' })

  const [showRoles, setShowRoles] = useState(false)

  const roles: SidebarUser[] = [
    { name: 'Admin User', role: 'ADMIN' },
    { name: 'Dr. Ayush', role: 'DOCTOR' },
    { name: 'Nurse Joy', role: 'NURSE' },
    { name: 'Patient John', role: 'PATIENT' },
  ]

  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Unknown'

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter italic uppercase">VEDAASHRAM</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">Intelligence</p>
          </div>
        </div>

        {/* Identity Selector */}
        <div className="mb-8 relative">
           <button 
            onClick={() => setShowRoles(!showRoles)}
            className="w-full bg-slate-950/50 border border-white/5 p-4 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all text-left group"
           >
              <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-xs uppercase">
                {displayName ? displayName[0] : 'G'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Active Role</p>
                <p className="text-xs font-bold text-slate-200 truncate capitalize">{displayName}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-600 group-hover:text-slate-400 transition-transform ${showRoles ? 'rotate-180' : ''}`} />
           </button>

           {showRoles && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-[60] animate-in zoom-in-95 duration-200">
                {roles.map(r => (
                  <button 
                    key={r.role}
                    onClick={() => {
                      setSelectedSimUser(r)
                      setShowRoles(false)
                    }}
                    className="w-full p-3 rounded-xl text-left hover:bg-white/5 transition-all flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">{r.name[0]}</div>
                    <div>
                      <p className="text-xs font-bold">{r.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{r.role}</p>
                    </div>
                  </button>
                ))}
             </div>
           )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(currentUser?.role)) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white font-bold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-blue-500/60'} />
                <span className="flex-1 truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Terminal Exit
        </button>
      </div>
    </aside>
  )
}
