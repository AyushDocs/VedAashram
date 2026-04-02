'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Activity, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Bed, 
  UserPlus, 
  ChevronRight, 
  MoreVertical,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'
import { registerEmergency, getEmergencyPatients, getAvailableERBeds, updateTriage } from '@/app/actions'

interface ERPatient {
  patient: {
    id: string
    name: string
    mrn: string
    age: number
    gender: string
    triageLevel: number | null
    arrivalTime: string | null
    status: string
    bedId: string | null
  }
  bed: {
    id: string
    ward: string
    room: string
  } | null
}

const TRIAGE_LEVELS = [
  { level: 1, name: 'RESUSCITATION', color: 'bg-red-600', text: 'text-red-500', glow: 'shadow-red-500/20' },
  { level: 2, name: 'EMERGENCY', color: 'bg-orange-600', text: 'text-orange-500', glow: 'shadow-orange-500/20' },
  { level: 3, name: 'URGENT', color: 'bg-yellow-600', text: 'text-yellow-500', glow: 'shadow-yellow-500/20' },
  { level: 4, name: 'LESS URGENT', color: 'bg-emerald-600', text: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
  { level: 5, name: 'NON-URGENT', color: 'bg-blue-600', text: 'text-blue-500', glow: 'shadow-blue-500/20' },
]

export default function EmergencyHub() {
  const [patients, setPatients] = useState<ERPatient[]>([])
  const [availableBeds, setAvailableBeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Registration Form
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('0')
  const [newGender, setNewGender] = useState('UNKNOWN')
  const [newTriage, setNewTriage] = useState(3)

  const fetchData = async () => {
    try {
      const [p, b] = await Promise.all([getEmergencyPatients(), getAvailableERBeds()])
      setPatients(p as ERPatient[])
      setAvailableBeds(b)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Polling every 10s
    return () => clearInterval(interval)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return
    await registerEmergency({
      name: newName,
      age: parseInt(newAge),
      gender: newGender,
      triageLevel: newTriage
    })
    setNewName('')
    setNewAge('0')
    setNewGender('UNKNOWN')
    fetchData()
  }

  const getTriageInfo = (level: number | null) => TRIAGE_LEVELS.find(l => l.level === level) || TRIAGE_LEVELS[2]

  const getTimeSince = (time: string | null) => {
    if (!time) return '0m'
    const diff = Math.floor((new Date().getTime() - new Date(time).getTime()) / 60000)
    return `${diff}m`
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-red-500" size={48} /></div>

  return (
    <div className="p-8 space-y-8 h-screen flex flex-col bg-[#050000] overflow-hidden">
      
      {/* Header & Intake Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white flex items-center gap-4">
              <AlertTriangle className="text-red-600 animate-pulse" size={40} />
              ER Tactical Node
            </h1>
            <p className="text-[10px] font-black text-red-900/60 uppercase tracking-[0.5em]">Triage Level 1-5 • Rapid Intake Active • Ward: ER-ALPHA</p>
          </div>
          
          <div className="flex gap-4">
             <StatBox label="Active Trauma" value={patients.length} color="text-red-500" />
             <StatBox label="ER Beds" value={availableBeds.length} sub="READY" color="text-blue-400" />
          </div>
        </div>

        {/* Rapid Intake Bar */}
        <form onSubmit={handleRegister} className="bg-red-600/5 border border-red-600/20 p-2 rounded-3xl flex gap-3 group focus-within:border-red-600/50 transition-all">
           <div className="flex-1 flex gap-2 p-2">
              <input 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="REGISTRAR: ENTER PATIENT NAME OR IDENTITY..."
                className="flex-1 bg-transparent border-none text-red-500 font-black placeholder:text-red-900/40 uppercase tracking-tighter text-xl outline-none"
              />
              <div className="flex gap-2">
                 <select value={newGender} onChange={e => setNewGender(e.target.value)} className="bg-slate-950/50 border border-red-900/20 text-red-500 font-black text-[10px] rounded-xl px-4 uppercase appearance-none outline-none">
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                 </select>
                 <input type="number" value={newAge} onChange={e => setNewAge(e.target.value)} className="w-16 bg-slate-950/50 border border-red-900/20 text-red-500 font-black text-[10px] rounded-xl px-4 outline-none" />
              </div>
           </div>
           
           <div className="flex gap-1 p-2">
              {TRIAGE_LEVELS.map(l => (
                 <button 
                  key={l.level}
                  type="button"
                  onClick={() => setNewTriage(l.level)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${newTriage === l.level ? `${l.color} text-white shadow-lg ${l.glow}` : 'bg-slate-950 text-slate-700'}`}
                 >
                   {l.level}
                 </button>
              ))}
           </div>

           <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all">
              <Plus size={16} /> Deploy Intake
           </button>
        </form>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Triage Matrix */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map((p) => {
                 const triage = getTriageInfo(p.patient.triageLevel)
                 return (
                    <div key={p.patient.id} className={`bg-slate-900/20 border-l-4 ${triage.name === 'RESUSCITATION' ? 'border-red-600 animate-pulse' : 'border-slate-800'} border-t border-r border-b border-white/5 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden group hover:bg-slate-900/40 transition-all`}>
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${triage.color} ${triage.glow}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${triage.text}`}>{triage.name}</span>
                             </div>
                             <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white truncate max-w-[200px]">{p.patient.name}</h3>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.patient.mrn} • {p.patient.age}Y • {p.patient.gender}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <div className="px-3 py-1 bg-slate-950 rounded-lg text-[9px] font-black text-slate-400 flex items-center gap-2 uppercase">
                                <Clock size={12} className="text-blue-500" /> Wait: {getTimeSince(p.patient.arrivalTime)}
                             </div>
                             <div className="px-3 py-1 bg-slate-950 rounded-lg text-[9px] font-black text-slate-400 flex items-center gap-2 uppercase">
                                <Bed size={12} className="text-emerald-500" /> {p.bed ? `${p.bed.ward} / ${p.bed.room}` : 'UNASSIGNED'}
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-5 gap-2">
                          {TRIAGE_LEVELS.map(l => (
                             <button 
                                key={l.level}
                                onClick={() => updateTriage(p.patient.id, l.level)}
                                className={`h-1.5 rounded-full transition-all ${p.patient.triageLevel === l.level ? l.color : 'bg-slate-900'}`}
                             />
                          ))}
                       </div>

                       <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                             <Activity size={14} className="text-red-500" /> Full Vitals
                          </button>
                          <button className="flex-1 py-3 bg-red-600 shadow-xl shadow-red-600/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                             Initiate Trauma Protocol <ArrowRight size={14} />
                          </button>
                       </div>
                    </div>
                 )
              })}
              {patients.length === 0 && (
                <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-800 space-y-4">
                  <ShieldAlert size={64} />
                  <p className="text-xs font-black uppercase tracking-widest">No active trauma cases in queue.</p>
                </div>
              )}
           </div>
        </div>

        {/* Logistics Panel */}
        <div className="lg:col-span-1 border-l border-red-950/20 pl-8 space-y-8 overflow-y-auto custom-scrollbar">
           
           <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-900/60 mb-6 flex items-center gap-2">
                 <Bed size={14} /> Available ER Logistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 {availableBeds.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col items-center gap-2">
                       <Bed size={20} className="text-blue-500/50" />
                       <span className="text-[10px] font-black text-white uppercase">{b.room}</span>
                       <span className="text-[8px] font-bold text-slate-700 uppercase">{b.id}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-red-600/5 p-8 rounded-[2.5rem] border border-red-600/10 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">Quick Alerts</h3>
              <div className="space-y-4">
                 <AlertItem msg="Ambulance ETA: 4m (Cardiac)" />
                 <AlertItem msg="Blood Bank: O- Low Stock" />
                 <AlertItem msg="Lab: Rapid Troponin Online" />
              </div>
           </div>

        </div>

      </div>

    </div>
  )
}

function StatBox({ label, value, sub, color }: { label: string, value: number, sub?: string, color: string }) {
  return (
    <div className="bg-slate-900/30 border border-white/5 px-8 py-4 rounded-3xl flex flex-col items-center min-w-[140px]">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</span>
       <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</span>
          {sub && <span className="text-[10px] font-black text-slate-800 uppercase">{sub}</span>}
       </div>
    </div>
  )
}

function AlertItem({ msg }: { msg: string }) {
  return (
    <div className="flex gap-3 items-center">
       <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
       <p className="text-[9px] font-black text-white uppercase leading-none">{msg}</p>
    </div>
  )
}
