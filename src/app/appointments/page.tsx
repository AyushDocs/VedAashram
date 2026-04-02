'use client'

import React, { useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
  Plus,
  ExternalLink
} from 'lucide-react'
import { getAppointments, updateAppointmentStatus } from '../actions'

interface AppointmentRecord {
  appointment: {
    id: string
    patientName: string
    staffId: string
    date: string
    time: string
    type: 'CONSULTATION' | 'PROCEDURE' | 'FOLLOWUP' | 'EMERGENCY'
    status: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED'
    notes: string | null
  }
  staff: {
    name: string
    specialty: string | null
  }
}

export default function AppointmentsCRM() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const fetchData = async () => {
    try {
      const data = await getAppointments()
      setAppointments(data as AppointmentRecord[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStatusUpdate = async (id: string, status: any) => {
    await updateAppointmentStatus(id, status)
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  const filtered = appointments.filter(a => filter === 'ALL' || a.appointment.status === filter)

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden">
      {/* Ordex Integrated Header */}
      <div className="flex justify-between items-end shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
             <div className="bg-blue-600/10 px-3 py-1 rounded-full flex items-center gap-2">
               <ExternalLink size={12} />
               <span className="text-[10px] font-black uppercase tracking-widest">Ordex Coupled CRM</span>
             </div>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter">APPOINTMENT CLEARING</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Patient Inflow & Scheduling Intelligence</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-slate-900 border border-white/5 rounded-2xl flex p-1">
             {['ALL', 'SCHEDULED', 'CHECKED_IN'].map(s => (
               <button 
                 key={s}
                 onClick={() => setFilter(s)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {s.replace('_', ' ')}
               </button>
             ))}
           </div>
           <button className="bg-white text-slate-950 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2">
             <Plus size={16} /> New Booking
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-0">
        {/* Appointments List */}
        <div className="lg:col-span-3 min-h-0 overflow-y-auto pr-4 custom-scrollbar space-y-4">
          {filtered.map(item => (
            <div key={item.appointment.id} className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:bg-slate-900 transition-all">
              <div className="flex items-center gap-8">
                {/* Time Shield */}
                <div className="w-20 flex flex-col items-center">
                   <Clock className="text-slate-700 group-hover:text-blue-500 transition-colors mb-1" size={20} />
                   <p className="text-xl font-black italic tracking-tighter text-slate-200">{item.appointment.time}</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.appointment.date.split('-').slice(1).join('/')}</p>
                </div>

                <div className="h-12 w-px bg-white/5" />

                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                     <p className="text-2xl font-black tracking-tight text-white">{item.appointment.patientName}</p>
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                       item.appointment.type === 'EMERGENCY' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                     }`}>
                       {item.appointment.type}
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500">
                      <User size={12} />
                      <p className="text-xs font-bold uppercase tracking-widest">{item.staff.name} • {item.staff.specialty}</p>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 {/* Status Display */}
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current State</p>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.appointment.status === 'CHECKED_IN' ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5' :
                      item.appointment.status === 'SCHEDULED' ? 'border-blue-500/40 text-blue-400 bg-blue-500/5' :
                      'border-slate-700 text-slate-500'
                    }`}>
                      {item.appointment.status.replace('_', ' ')}
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="flex gap-2">
                    {item.appointment.status === 'SCHEDULED' && (
                      <button 
                        onClick={() => handleStatusUpdate(item.appointment.id, 'CHECKED_IN')}
                        className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white transition-all shadow-lg shadow-emerald-500/10"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                    <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 transition-all">
                      <MoreVertical size={20} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Side Summary */}
        <div className="space-y-8 flex flex-col">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" /> Daily Traffic
            </h3>
            <div className="space-y-4">
               <TrafficItem label="Total Bookings" value={appointments.length} />
               <TrafficItem label="Remaining" value={appointments.filter(a => a.appointment.status === 'SCHEDULED').length} />
               <TrafficItem label="Cancellations" value={0} color="text-red-500" />
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-blue-500/20 flex-1">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
               <AlertCircle size={24} />
             </div>
             <h4 className="text-xl font-black italic tracking-tighter">Waiting Room Alert</h4>
             <p className="text-xs text-blue-100/80 font-medium leading-relaxed italic">&ldquo;Average wait time for Cardiology is currently 22 minutes. Consider fast-tracking Alice Cooper.&rdquo;</p>
             <button className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Optimize Flow</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrafficItem({ label, value, color = "text-slate-100" }: { label: string, value: any, color?: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</span>
    </div>
  )
}
