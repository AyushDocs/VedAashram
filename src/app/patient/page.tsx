'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  Heart, 
  Activity, 
  Plus, 
  ChevronRight,
  MessageSquare,
  FileText,
  Thermometer,
  Droplets,
  Zap,
  ShieldCheck
} from 'lucide-react'
import { getAppointments } from '../actions'

export default function PatientHub() {
  const [myAppointments, setMyAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const data = await getAppointments()
      // Simulate "My" appointments for John Doe (P001 is mapped to John in our scenario)
      setMyAppointments(data.slice(0, 2))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden">
      
      {/* Patient Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-12 text-white shadow-2xl flex justify-between items-center shrink-0">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Heart size={200} />
         </div>
         
         <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
               <ShieldCheck size={12} /> Patient Identity Verified
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Welcome, John Doe</h1>
            <p className="text-emerald-500/80 font-bold text-xs uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full w-fit">PID: VEDA-002491</p>
         </div>

         <div className="hidden md:flex gap-4 relative z-10">
            <button className="bg-white text-emerald-800 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-3">
               <Plus size={18} /> Book Appointment
            </button>
            <button 
              onClick={async () => {
                 const { dischargePatient } = await import('../actions')
                 await dischargePatient('P001')
                 alert('Discharge Triggered: Automation Event Logged.')
              }}
              className="bg-red-600/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-3"
            >
               <Zap size={18} /> Simulate Discharge
            </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-0">
        
        {/* Left Column: Appointments & Timeline */}
        <div className="lg:col-span-2 space-y-8 flex flex-col min-h-0">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase italic">
                 <Calendar className="text-emerald-500" /> Upcoming Sessions
              </h2>
           </div>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {myAppointments.map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex items-center justify-between hover:bg-slate-900 transition-all group">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/10">
                         <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{item.appointment.date.split('-')[2]}</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.appointment.date.split('-')[1]}</span>
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-xl font-black tracking-tight text-white">{item.appointment.type}</h3>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">With {item.staff.name} • {item.staff.specialty}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                         <p className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">{item.appointment.status}</p>
                      </div>
                      <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 group-hover:text-white transition-all">
                         <ChevronRight size={20} />
                      </button>
                   </div>
                </div>
              ))}
              
              <button className="w-full py-6 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center gap-3 text-slate-600 hover:border-emerald-500/20 hover:text-emerald-500 transition-all group">
                 <Plus size={20} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Recurring Appointment Slot</span>
              </button>
           </div>
        </div>

        {/* Right Column: Health Snapshot & Quick Links */}
        <div className="space-y-8 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
           
           <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                 <Activity size={14} className="text-emerald-500" /> Operative Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <VitalCard icon={<Heart className="text-red-500" size={12}/>} label="BPM" value="72" />
                 <VitalCard icon={<Thermometer className="text-orange-500" size={12}/>} label="TEMP" value="98.6°" />
                 <VitalCard icon={<Droplets className="text-blue-500" size={12}/>} label="SPO2" value="99%" />
                 <VitalCard icon={<Zap className="text-yellow-500" size={12}/>} label="BP" value="120/80" />
              </div>
           </div>

           <div className="space-y-4">
              <QuickAction icon={<FileText size={18} />} title="Health Records" subtitle="4 documents updated" />
              <QuickAction icon={<MessageSquare size={18} />} title="Secure Messaging" subtitle="2 active threads" />
           </div>

           <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-3xl p-8 space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500">Facility Note</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 &ldquo;Your annual cardiology screening is scheduled for next Tuesday. Please arrive 15 minutes early for pre-op vitals.&rdquo;
              </p>
           </div>

        </div>

      </div>

    </div>
  )
}

function VitalCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 space-y-1 hover:border-emerald-500/20 transition-all cursor-default group">
       <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">{label}</span>
       </div>
       <p className="text-2xl font-black italic tracking-tighter group-hover:text-emerald-400 transition-colors">{value}</p>
    </div>
  )
}

function QuickAction({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <button className="w-full bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-6 hover:bg-slate-800 transition-all text-left group">
       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
          {icon}
       </div>
       <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-emerald-400 transition-colors">{title}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
       </div>
    </button>
  )
}
