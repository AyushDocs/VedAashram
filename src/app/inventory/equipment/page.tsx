'use client'

import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  Search, 
  Filter,
  Monitor,
  Clock,
  ArrowRightLeft,
  Database
} from 'lucide-react'
import { getEquipment, getActiveAssignments, assignEquipment, releaseEquipment, getBedsWithPatients, getCurrentUser, UserRole } from '@/app/actions'

interface Machine {
  id: string
  name: string
  type: 'VENTILATOR' | 'ECG' | 'DEFIBRILLATOR' | 'SYRINGE_PUMP' | 'MONITOR' | 'OTHER'
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'FAULTY'
  serialNumber: string | null
  lastMaintenance: string | null
}

interface Patient {
  id: string
  name: string
  mrn: string
}

interface Assignment {
  assignment: {
    id: string
    equipmentId: string
    patientId: string | null
    assignedBy: string
    startTime: string
    endTime: string | null
    status: 'ACTIVE' | 'RELEASED'
  }
  equipment: Machine
  patient: Patient
}

interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export default function EquipmentHub() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  
  // Selection / Modal State
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState('')

  const fetchData = async () => {
    try {
      const [m, a, p, u] = await Promise.all([
        getEquipment(),
        getActiveAssignments(),
        getBedsWithPatients(),
        getCurrentUser()
      ])
      setMachines(m as Machine[])
      setActiveAssignments(a as Assignment[])
      setPatients(p.filter(b => b.patient).map(b => b.patient!) as Patient[])
      setUser(u as AuthUser | null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAssign = async () => {
    if (!selectedMachine || !selectedPatientId || !user) return
    await assignEquipment(selectedMachine.id, selectedPatientId, user.id)
    setShowAssignModal(false)
    setSelectedMachine(null)
    setSelectedPatientId('')
    fetchData()
  }

  const handleRelease = async (assignmentId: string) => {
    await releaseEquipment(assignmentId)
    fetchData()
  }

  const stats = {
    total: machines.length,
    inUse: machines.filter(m => m.status === 'IN_USE').length,
    maintenance: machines.filter(m => m.status === 'MAINTENANCE').length,
    critical: machines.filter(m => m.status === 'FAULTY').length
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-blue-500" size={48} /></div>

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden bg-[#020408]">
      
      {/* Tactical Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Asset Logic Cluster</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Biomedical Inventory • Real-Time Assignment • Node: {user?.email.split('@')[0]}</p>
        </div>
        
        <div className="flex gap-4">
           <StatNode label="Active Flux" value={stats.inUse} sub={`/ ${stats.total}`} color="text-blue-500" />
           <StatNode label="Maintenance" value={stats.maintenance} sub="PENDING" color="text-orange-500" />
           <StatNode label="Alerts" value={stats.critical} sub="FAULTY" color="text-red-500" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Main Asset Grid */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar space-y-8">
           
           <div className="flex justify-between items-center bg-slate-900/30 p-6 rounded-[2rem] border border-white/5">
              <div className="flex gap-4">
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Filter size={14} /> All Systems
                 </button>
                 <button className="px-4 py-2 bg-slate-950 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
                    Critical Care
                 </button>
              </div>
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                 <input className="bg-slate-950 border border-white/5 py-2 pl-12 pr-6 rounded-xl text-[10px] font-bold text-white uppercase placeholder:text-slate-800 focus:ring-1 focus:ring-blue-500/20 w-64" placeholder="Search Machine ID..." />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {machines.map((machine) => {
                 const assignment = activeAssignments.find(a => a.equipment.id === machine.id)
                 return (
                    <div key={machine.id} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 group hover:border-blue-500/20 transition-all relative overflow-hidden">
                       {machine.status === 'IN_USE' && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -z-10" />}
                       
                       <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-2xl ${machine.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-500' : machine.status === 'IN_USE' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                             {machine.type === 'VENTILATOR' ? <Activity size={20} /> : <Monitor size={20} />}
                          </div>
                          <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{machine.serialNumber}</span>
                       </div>

                       <div>
                          <h4 className="text-xl font-black italic tracking-tighter uppercase text-white">{machine.name}</h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{machine.type}</p>
                       </div>

                       {machine.status === 'IN_USE' ? (
                          <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/10 space-y-3">
                             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-blue-500">
                                <span>Assigned Path</span>
                                <Clock size={10} />
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-[10px]">{assignment?.patient?.name?.[0] || '?'}</div>
                                <div>
                                   <p className="text-[10px] font-black text-white uppercase">{assignment?.patient?.name || 'Unknown'}</p>
                                   <p className="text-[8px] font-bold text-slate-600 uppercase">Since {assignment?.assignment?.startTime ? new Date(assignment.assignment.startTime).toLocaleTimeString() : 'N/A'}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => assignment?.assignment?.id && handleRelease(assignment.assignment.id)}
                                className="w-full py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                             >
                                Release Device
                             </button>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-700">
                                <span>Status: {machine.status}</span>
                                <span>Maint: {machine.lastMaintenance ? new Date(machine.lastMaintenance).toLocaleDateString() : 'N/A'}</span>
                             </div>
                             <button 
                                onClick={() => { setSelectedMachine(machine); setShowAssignModal(true) }}
                                disabled={machine.status !== 'AVAILABLE'}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-950 disabled:text-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                             >
                                <ArrowRightLeft size={14} /> Assign to Patient
                             </button>
                          </div>
                       )}
                    </div>
                 )
              })}
           </div>

        </div>

        {/* Sidebar Log */}
        <div className="lg:col-span-1 border-l border-white/5 pl-8 space-y-8 overflow-y-auto custom-scrollbar">
           <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
                 <Database size={14} /> Global Assignment Log
              </h3>
              <div className="space-y-4">
                 {activeAssignments.map((a, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                       <div className="shrink-0 w-1 bg-blue-600/30 group-hover:bg-blue-600 h-10 rounded-full transition-all" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-white uppercase">{a.equipment.name} → {a.patient.name}</p>
                          <p className="text-[8px] font-bold text-slate-500 flex items-center gap-1 uppercase">
                             <Clock size={8} /> {new Date(a.assignment.startTime).toLocaleTimeString()}
                          </p>
                       </div>
                    </div>
                 ))}
                 {activeAssignments.length === 0 && <p className="text-[10px] font-bold text-slate-800 uppercase italic">No active flux detected.</p>}
              </div>
           </div>

           <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Procedures Requiring Assets</h3>
              <div className="space-y-3">
                 <ProcedureItem icon={<Activity size={12}/>} name="Ventilation Adjustment" time="14:00" />
                 <ProcedureItem icon={<Monitor size={12}/>} name="Standard 12-Lead ECG" time="14:30" />
                 <ProcedureItem icon={<Zap size={12}/>} name="Pacing Management" time="16:00" />
              </div>
           </div>
        </div>

      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedMachine && (
         <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/5 rounded-[3rem] w-full max-w-lg p-12 space-y-10 shadow-2xl relative">
               <button onClick={() => setShowAssignModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><Zap size={24} /></button>
               
               <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6"><ArrowRightLeft size={32} /></div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Initialize Assignment</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Targeting: {selectedMachine.name}</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 pl-2">Select Active Patient</label>
                     <select 
                       value={selectedPatientId} 
                       onChange={(e) => setSelectedPatientId(e.target.value)}
                       className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-2xl text-sm text-white appearance-none focus:ring-2 focus:ring-blue-500/20 outline-none"
                     >
                        <option value="">Choose Patient Registry...</option>
                        {patients.map(p => (
                           <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
                        ))}
                     </select>
                  </div>

                  <button 
                    onClick={handleAssign}
                    disabled={!selectedPatientId}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3"
                  >
                     <ShieldCheck size={18} /> Confirm Deployment
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  )
}

function StatNode({ label, value, sub, color }: { label: string, value: number, sub: string, color: string }) {
  return (
    <div className="bg-slate-900/30 border border-white/5 px-6 py-4 rounded-2xl flex flex-col items-center min-w-[120px]">
       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</span>
       <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</span>
          <span className="text-[8px] font-black text-slate-800 uppercase">{sub}</span>
       </div>
    </div>
  )
}

function ProcedureItem({ icon, name, time }: { icon: React.ReactNode, name: string, time: string }) {
  return (
    <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex gap-3 items-center group hover:border-slate-800 transition-all cursor-default">
       <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-blue-500 transition-all">{icon}</div>
       <div className="flex-1">
          <p className="text-[10px] font-black text-white uppercase truncate">{name}</p>
          <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">{time} • PRIORITY ALPHA</p>
       </div>
    </div>
  )
}
