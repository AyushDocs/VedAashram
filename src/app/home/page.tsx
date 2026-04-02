'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Play,
  ArrowRight,
  Globe,
  Stethoscope,
  HeartPulse,
  BrainCircuit,
  Workflow,
  Map
} from 'lucide-react'

export default function PublicLanding() {
  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-400">
      {/* Navbar */}
      <nav className="border-b border-white/5 py-6 px-10 flex justify-between items-center fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Building2 size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter italic">VEDAASHRAM</h1>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link href="/connect" className="hover:text-blue-400 transition-colors">Connect</Link>
            <Link href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors px-6">Login</Link>
            <Link href="/signup" className="bg-white text-slate-950 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent opacity-40 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] animate-in zoom-in-95">
             <HeartPulse size={12} className="animate-pulse" /> V3.0 RELEASED: Clinical Intelligence Enabled
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] max-w-5xl mx-auto uppercase">
            The Operative <span className="text-blue-500">Intelligence Node</span> for Next-Gen Healthcare.
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed font-medium">
             VedAashram integrates tactical spatial mapping, AI clinical acuity alerts, and real-time asset telemetry into a single unified hospital command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <Link href="/signup" className="group bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3">
               Scale Your Facility <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group px-10 py-5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all flex items-center gap-3 bg-white/5">
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                 <Play size={12} fill="currentColor" />
               </div>
               <span className="text-sm font-black uppercase tracking-widest">Watch Intelligence Node in Action</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Map className="text-blue-500" size={32} />}
            title="Spatial Floor Plan"
            desc="Physically aware bed visualization with high-acuity heatmap overlays."
          />
          <FeatureCard 
            icon={<BrainCircuit className="text-purple-500" size={32} />}
            title="Acuity Intelligence"
            desc="AI-driven predictions for clinical deterioration and resource routing."
          />
          <FeatureCard 
            icon={<Workflow className="text-emerald-500" size={32} />}
            title="Ordex Synchronization"
            desc="Automatic inventory clearing and billing reconciliation via Ordex API."
          />
        </div>
      </section>

      {/* Social Trust */}
      <section className="py-24 px-10 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Powering Modern Systems Globally</p>
          <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale contrast-125">
             <div className="text-3xl font-black italic tracking-tighter">SANJEEVNI</div>
             <div className="text-3xl font-black italic tracking-tighter">ORDEX</div>
             <div className="text-3xl font-black italic tracking-tighter">VEDAASHRAM</div>
             <div className="text-3xl font-black italic tracking-tighter">SMARTFHIR</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-10 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
             <Link href="/" className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Go to Dashboard</Link>
             <span className="text-slate-800">•</span>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">VedAashram Intelligence System © 2026</p>
           </div>
           
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
             <Link href="#" className="hover:text-blue-400">Privacy Protocol</Link>
             <Link href="#" className="hover:text-blue-400">Security Layers</Link>
             <Link href="/connect" className="hover:text-blue-400">System Support</Link>
           </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-slate-900 hover:-translate-y-2 transition-all duration-500 group">
      <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black italic tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Explore Protocol <ChevronRight size={12} />
      </div>
    </div>
  )
}
