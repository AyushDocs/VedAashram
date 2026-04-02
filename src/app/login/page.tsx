'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Fingerprint,
  Mail,
  Lock,
  ArrowLeft,
  Activity
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Access Denied')
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-10 relative selection:bg-blue-600/30 selection:text-blue-400">
      <Link href="/home" className="absolute top-10 left-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors group z-50">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" /> Public Landing
      </Link>
      
      <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />
      
      <div className="max-w-md w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-600 rounded-[2rem] text-white w-fit mx-auto shadow-2xl shadow-blue-600/30 animate-in zoom-in-95">
            <Building2 size={48} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">VEDAASHRAM</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operative Intelligence Node</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom-8 duration-700">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal ID (Email)</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@hospital.com" 
                      className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" 
                    />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Cipher (Password)</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                    <input 
                      required 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" 
                    />
                 </div>
              </div>
           </div>

           {error && (
             <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 text-center animate-shake">
               {error}
             </div>
           )}

           <button 
            type="submit" 
            disabled={localLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 group transition-all active:scale-95 disabled:opacity-50"
           >
              {localLoading ? <Activity className="animate-spin" size={18} /> : (
                <>Initialize Session <Fingerprint size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" /></>
              )}
           </button>
           
           <p className="text-[10px] text-center font-bold text-slate-600">
             New Asset Identity? <Link href="/signup" className="text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors ml-1">Create Account</Link>
           </p>
        </form>

        <p className="text-[9px] text-center font-black uppercase tracking-[0.4em] text-slate-800">AES-256 Cloudflare Protection Active</p>
      </div>
    </div>
  )
}
