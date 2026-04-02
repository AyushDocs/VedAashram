'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Fingerprint,
  Mail,
  Lock,
  ArrowLeft,
  Briefcase,
  User
} from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-10 relative selection:bg-blue-600/30 selection:text-blue-400">
      <Link href="/home" className="absolute top-10 left-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors group z-50">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" /> Public Landing
      </Link>
      
      <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />
      
      <div className="max-w-md w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] text-blue-500 w-fit mx-auto shadow-2xl shadow-blue-500/10 animate-in zoom-in-95">
            <Building2 size={48} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-100">CREATE IDENTITY</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Node Asset Registration</p>
          </div>
        </div>

        <form className="space-y-6 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom-8 duration-700">
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Node Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                       <input required type="text" placeholder="John Doe" className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Type (Role)</label>
                    <div className="relative">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                       <select className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                         <option>Doctor</option>
                         <option>Nurse</option>
                         <option>Hospital Admin</option>
                         <option>Pharma Head</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Transmission Relay (Email)</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                    <input required type="email" placeholder="email@hospital.com" className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Primary Access Key</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                    <input required type="password" placeholder="••••••••" className="w-full bg-slate-950/80 border border-white/5 p-4 pl-12 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3 px-1">
              <input type="checkbox" id="terms" className="w-5 h-5 rounded-md accent-blue-600 border-white/5 bg-slate-950" required />
              <label htmlFor="terms" className="text-[8px] font-black uppercase tracking-widest text-slate-600 leading-relaxed">I consent to the HIPPA compliant clinical processing and asset monitoring protocols.</label>
           </div>

           <button 
            type="button" 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-slate-100 hover:bg-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 text-slate-950"
           >
              Create Asset Identity <Fingerprint size={18} className="translate-x-1" />
           </button>
           
           <p className="text-[10px] text-center font-bold text-slate-600">
             Already Operational? <Link href="/login" className="text-blue-500 font-black uppercase tracking-widest hover:text-white transition-colors ml-1">Proceed to Login</Link>
           </p>
        </form>

        <p className="text-[9px] text-center font-black uppercase tracking-[0.4em] text-slate-800 leading-loose">Automated Security Protocol Syncing...</p>
      </div>
    </div>
  )
}
