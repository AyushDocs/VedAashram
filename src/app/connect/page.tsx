'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Globe,
  Activity,
  ArrowLeft,
  Users,
  ChevronRight
} from 'lucide-react'

export default function ConnectPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col font-sans relative selection:bg-blue-600/30 selection:text-blue-400">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />
      
      {/* Header */}
      <nav className="p-10 flex justify-between items-center relative z-10 shrink-0">
        <Link href="/home" className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" /> Back to Base
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Building2 size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic">VEDAASHRAM</h1>
        </div>
      </nav>

      {/* Hero / Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-20 p-10 max-w-7xl mx-auto w-full items-center relative z-10">
        
        {/* Contact Intelligence Column */}
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Node Support CRM</span>
            <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
               Connect with the <br /> <span className="text-blue-500 underline underline-offset-[12px] decoration-blue-600/40">Intelligence Node.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-lg italic font-medium">
              Awaiting clinical inquiries, integration requests, and operative support commands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ConnectCard icon={<MessageSquare className="text-blue-500" />} label="General Inquiries" value="inquiry@vedaashram.com" />
            <ConnectCard icon={<Activity className="text-purple-500" />} label="Technical OPS" value="ops@vedaashram.com" />
            <ConnectCard icon={<Users className="text-emerald-500" />} label="Partnerships" value="ecosystem@vedaashram.com" />
            <ConnectCard icon={<ShieldCheck className="text-red-500" />} label="Security" value="+1 (800) VEDA-SEC" />
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="py-24 text-center space-y-6 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                 <ShieldCheck size={40} />
               </div>
               <h2 className="text-3xl font-black italic tracking-tighter">Transmission Successful</h2>
               <p className="text-slate-500 font-medium">Our clinical ops node has received your broadcast. Expect a relay within 24 standard care hours.</p>
               <button onClick={() => setSubmitted(false)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 underline underline-offset-4">Relay New Transmission</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity Name</label>
                     <input required type="text" placeholder="e.g. Dr. John Doe" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Relay Address</label>
                     <input required type="email" placeholder="email@hospital.com" className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Node Subject</label>
                   <select className="w-full bg-slate-950 border border-white/5 p-4 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                     <option>Clinical System Integration</option>
                     <option>Facility Upgrade Inquiry</option>
                     <option>Ordex API Support</option>
                     <option>Security Incident Relay</option>
                   </select>
                 </div>

                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">The Transmission</label>
                   <textarea rows={4} required placeholder="State your command or inquiry..." className="w-full bg-slate-950 border border-white/5 p-5 rounded-2xl text-sm font-bold placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
               </div>

               <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 group">
                  Send Relay <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
               
               <p className="text-[9px] text-center font-black uppercase tracking-[0.2em] text-slate-700">Encrypted AES-256 Link Active</p>
            </form>
          )}
        </div>
      </div>

      {/* Global Presence Banner */}
      <div className="bg-slate-900 py-12 flex justify-center items-center gap-20 border-t border-white/5 grayscale contrast-150 opacity-20">
         <Globe size={40} />
         <div className="text-3xl font-black italic tracking-tighter">GLOBAL OPS</div>
         <div className="text-3xl font-black italic tracking-tighter">VEDAASHRAM</div>
         <div className="text-3xl font-black italic tracking-tighter">INTELLIGENCE</div>
      </div>
    </div>
  )
}

function ConnectCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1 group cursor-pointer">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{label}</p>
      <p className="text-sm font-bold text-slate-300 group-hover:text-blue-400 transition-colors">{value}</p>
    </div>
  )
}
