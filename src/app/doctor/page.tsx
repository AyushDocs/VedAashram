'use client'

import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  User, 
  Activity, 
  Map, 
  LogOut, 
  LogIn, 
  ClipboardList,
  AlertCircle,
  TrendingUp,
  Stethoscope,
  X,
  ShieldCheck
} from 'lucide-react'
import { 
  getActiveShiftForStaff, 
  checkIn, 
  checkOut, 
  getBedsWithPatients 
} from '../actions'
import { SanjeevniSecureViewer } from '@/components/SanjeevniBridge'

const DOCTOR_ID = 'D001' // Mock Dr. Ayush

export default function DoctorDashboard() {
  const [activeShift, setActiveShift] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [myBeds, setMyBeds] = useState<any[]>([])
  const [viewingPatient, setViewingPatient] = useState<any>(null)

  const fetchShiftData = async () => {
    try {
      const [shift, beds] = await Promise.all([
        getActiveShiftForStaff(DOCTOR_ID),
        getBedsWithPatients()
      ])
      setActiveShift(shift)
      const cardiologyBeds = (beds as any[]).filter(b => b.bed.department === 'Critical Care')
      setMyBeds(cardiologyBeds)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShiftData()
  }, [])

  const handleShift = async () => {
    if (activeShift) {
      await checkOut(activeShift.id)
    } else {
      await checkIn(DOCTOR_ID)
    }
    fetchShiftData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden relative">
      
      {/* Sanjeevni Global Record Overlay */}
      {viewingPatient && (
        <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-3xl p-10 flex flex-col items-center animate-in zoom-in-95 duration-300">
           <div className="w-full max-w-5xl flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Sanjeevni Secure Bridge</h2>
                    <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Authenticated Terminal Access • Session: {Math.random().toString(36).substring(7)}</p>
                 </div>
              </div>
              <button 
                onClick={() => setViewingPatient(null)}
                className="p-4 bg-slate-900 hover:bg-red-500/10 hover:text-red-500 border border-white/5 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
           </div>
           <div className="w-full max-w-5xl flex-1 min-h-0">
              <SanjeevniSecureViewer 
                recordId={`RE-SAN-${viewingPatient.patient.id}`} 
                authToken="dev-secret-token" 
                patientName={viewingPatient.patient.name} 
              />
           </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 flex justify-between items-center text-white shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Stethoscope size={200} />
        </div>
        <div className="space-y-2 relative z-10">
           <h1 className="text-4xl font-black italic tracking-tighter">Good morning, Dr. Ayush</h1>
           <p className="text-blue-100/60 font-bold uppercase tracking-widest text-xs">Cardiology Dept • Ground Multi-Specialty</p>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={handleShift}
            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeShift ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-white text-blue-800 hover:bg-blue-50 shadow-lg'}`}
          >
            {activeShift ? 'PUNCH OUT' : 'PUNCH IN'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        {/* Patient Load */}
        <div className="lg:col-span-2 space-y-6 flex flex-col min-h-0 overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase italic">
              <ClipboardList className="text-blue-500" /> Active Patient Load
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBeds.filter(b => b.patient).map(item => (
              <div key={item.bed.id} className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:bg-slate-900 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Activity size={100} />
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black italic tracking-tighter text-blue-500">B-{item.bed.id.split('B')[1]}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.bed.room}</span>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.patient.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-blue-500/10 text-blue-400'}`}>
                    {item.patient.status}
                  </div>
                </div>

                <h3 className="text-3xl font-black tracking-tighter uppercase mb-1">{item.patient.name}</h3>
                <p className="text-xs text-slate-500 font-medium mb-8 italic">&ldquo;{item.patient.diagnosis}&rdquo;</p>
                
                <div className="flex gap-3 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setViewingPatient(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={14} /> Open Records
                  </button>
                  <button className="px-6 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Vitals</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Summary Right Sidebar */}
        <div className="space-y-8 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
               <TrendingUp className="text-blue-500" />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Clinical Summary</h3>
             </div>
             <div className="space-y-4">
               <SummaryBlock label="Critical Cases" value="2" color="text-red-500" />
               <SummaryBlock label="Stability Rate" value="94%" color="text-emerald-500" />
               <SummaryBlock label="Shift Handover" value="READY" color="text-blue-400" />
             </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 flex-1">
             <div className="flex items-center gap-3 text-orange-500">
               <AlertCircle size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-widest leading-none">Intelligence Relay</h3>
             </div>
             <div className="space-y-4">
                <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
                  <p className="text-xs font-semibold text-slate-300 italic">&ldquo;Sanjeevni node reporting updated labs for B101. Critical troponin levels detected.&rdquo;</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 mt-3">— Sanjeevni Bot v4.1</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryBlock({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center p-5 bg-slate-950/50 rounded-2xl border border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
      <span className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</span>
    </div>
  )
}
