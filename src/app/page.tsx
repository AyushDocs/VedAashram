'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Activity, 
  Filter, 
  Map, 
  Thermometer,
  Plus,
  Info,
  User,
  HeartPulse,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  History,
  Workflow
} from 'lucide-react'
import { 
  getBedsWithPatients, 
  updateBedStatus 
} from './actions'

interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  status: 'CRITICAL' | 'STABLE' | 'RECOVERY' | 'OBSERVATION'
  diagnosis: string | null
  admissionDate: string
}

interface BedWithPatient {
  bed: {
    id: string
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING'
    ward: string
    floor: string
    room: string
    department: string
    lastCleaned: string | null
  }
  patient: PatientData | null
}

export default function HospitalDashboard() {
  const [beds, setBeds] = useState<BedWithPatient[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [filterFloor, setFilterFloor] = useState('All Floors')
  const [filterDept, setFilterDept] = useState('All Departments')
  const [selectedBed, setSelectedBed] = useState<BedWithPatient | null>(null)

  const fetchData = async () => {
    try {
      const bedsData = await getBedsWithPatients()
      setBeds(bedsData as BedWithPatient[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateStatus = async (id: string, current: string) => {
    const statusMap: Record<string, any> = {
      'AVAILABLE': 'OCCUPIED',
      'OCCUPIED': 'CLEANING',
      'CLEANING': 'MAINTENANCE',
      'MAINTENANCE': 'AVAILABLE'
    }
    await updateBedStatus(id, statusMap[current])
    fetchData()
  }

  // AI Insights Logic (Mock)
  const insights = useMemo(() => {
    const floor1Occupancy = beds.filter(b => b.bed.floor === '1st Floor' && b.bed.status === 'OCCUPIED').length / beds.filter(b => b.bed.floor === '1st Floor').length || 0
    const criticalCount = beds.filter(b => b.patient?.status === 'CRITICAL').length

    return [
      { 
        type: 'ADVISORY', 
        message: floor1Occupancy > 0.8 ? 'Floor 1 exceeds 80% capacity. Redirecting non-acute admissions to Floor 2 recommended.' : 'Floor occupancy within stable limits.',
        icon: <TrendingUp className="text-orange-400" size={14} />,
        color: floor1Occupancy > 0.8 ? 'border-orange-500/20 bg-orange-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
      },
      { 
        type: 'PRIORITY', 
        message: `${criticalCount} high-acuity patients require intensive monitoring. ICU staff alert initiated.`,
        icon: <BrainCircuit className="text-purple-400" size={14} />,
        color: 'border-purple-500/20 bg-purple-500/5'
      }
    ]
  }, [beds])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    )
  }

  const floors = ['All Floors', ...Array.from(new Set(beds.map(b => b.bed.floor)))]
  const departments = ['All Departments', ...Array.from(new Set(beds.map(b => b.bed.department)))]

  const filteredBeds = beds.filter(b => 
    (filterFloor === 'All Floors' || b.bed.floor === filterFloor) &&
    (filterDept === 'All Departments' || b.bed.department === filterDept)
  )

  const rooms = Array.from(new Set(filteredBeds.map(b => b.bed.room)))

  return (
    <div className="p-8 space-y-6 flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header section with Unified Filter & Insights */}
      <div className="shrink-0 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
               VEDAASHRAM INTELLIGENCE
            </h1>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-[0.2em]">Next-Gen Clinical Asset Monitoring</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-2xl">
              {floors.map(f => (
                <button 
                  key={f}
                  onClick={() => setFilterFloor(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterFloor === f ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative group">
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="bg-slate-900 border border-white/5 rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none pr-12 cursor-pointer focus:ring-2 focus:ring-blue-500/20"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* AI Insight Marquee/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className={`p-4 border rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-1000 ${insight.color}`}>
              <div className="flex-shrink-0 animate-pulse">{insight.icon}</div>
              <div className="flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 leading-none">{insight.type} INSIGHT</span>
                <p className="text-[11px] font-bold text-slate-200 mt-1">{insight.message}</p>
              </div>
              <Sparkles className="text-blue-500/20" size={18} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 min-h-0">
        {/* Spatial Floor Area */}
        <div className="xl:col-span-3 min-h-0 flex flex-col space-y-8 overflow-y-auto pr-6 custom-scrollbar">
          {rooms.map(roomName => {
            const roomBeds = filteredBeds.filter(b => b.bed.room === roomName)
            return (
              <div key={roomName} className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black text-slate-100">{roomName}</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-white/5 rounded-full">
                      <Workflow size={10} className="text-blue-400" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{roomBeds[0].bed.department}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {roomBeds.map(b => (
                      <div key={b.bed.id} className={`w-1 h-3 rounded-full ${b.bed.status === 'OCCUPIED' ? 'bg-blue-500' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-10 flex flex-wrap gap-8 items-start justify-start shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Building2 className="text-white" size={120} />
                  </div>
                  {roomBeds.map(item => (
                    <BedSpatial 
                      key={item.bed.id} 
                      data={item} 
                      onSelect={() => setSelectedBed(item)}
                      selected={selectedBed?.bed.id === item.bed.id}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Clinical Sidebar Area */}
        <div className="flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          {selectedBed ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
                 {/* Vitals Background Mock */}
                <div className="absolute inset-x-0 bottom-0 h-40 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 100 20" className="w-full h-full stroke-blue-500 stroke-[0.5] fill-none">
                    <path d="M0 10 L10 10 L12 5 L14 15 L16 10 L40 10 L42 2 L44 18 L46 10 L100 10" />
                  </svg>
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="text-4xl font-black tracking-tighter italic">B-{selectedBed.bed.id.split('B')[1]}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Acuity Node</span>
                  </div>
                  <button onClick={() => setSelectedBed(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                    <Plus className="rotate-45" size={20} />
                  </button>
                </div>

                {selectedBed.patient ? (
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-2">
                       <User className="text-blue-500" size={16} />
                       <h2 className="text-2xl font-black tracking-tight">{selectedBed.patient.name}</h2>
                       <div className="flex gap-2 text-[10px] uppercase font-black text-slate-500 border border-white/5 w-fit px-3 py-1 rounded-full">
                         <span>{selectedBed.patient.age}Y</span>
                         <span className="opacity-30">|</span>
                         <span>{selectedBed.patient.gender}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl group hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acuity Status</span>
                          <p className={`text-sm font-black uppercase ${selectedBed.patient.status === 'CRITICAL' ? 'text-red-500' : 'text-blue-400'}`}>
                            {selectedBed.patient.status}
                          </p>
                        </div>
                        <Activity className={selectedBed.patient.status === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-blue-400'} size={20} />
                      </div>

                      <div className="bg-white text-slate-950 p-6 rounded-3xl space-y-4 shadow-xl shadow-white/10">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                           <span>Primary Diagnosis</span>
                           <TrendingUp size={12} />
                         </div>
                         <p className="font-bold text-sm leading-relaxed">&ldquo;{selectedBed.patient.diagnosis}&rdquo;</p>
                         <button className="w-full py-3 bg-blue-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors">
                           View EMR History
                         </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <History size={14} /> Audit Trail
                       </h5>
                       <div className="space-y-3 pl-2 border-l border-white/5">
                          <p className="text-[10px] text-slate-400 font-medium">10:42 AM - Status updated to CRITICAL by Dr. Ayush</p>
                          <p className="text-[10px] text-slate-400 font-medium">09:12 AM - SPO2 checked: 94% (Stable)</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-6 relative z-10 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                    <Plus size={48} className="mx-auto text-slate-800" />
                    <div className="space-y-1">
                      <p className="text-xl font-black text-slate-200">Patient Admission</p>
                      <p className="text-[10px] text-slate-600 font-black uppercase">Asset Ready for Deployment</p>
                    </div>
                    <button className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-colors">Assign Patient</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-950 border border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-800">
                <Map size={40} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-slate-100 italic tracking-tighter underline underline-offset-4 decoration-blue-500">Intelligence Node Active</p>
                <p className="text-slate-500 font-medium text-xs">Awaiting Asset Selection for Real-time Telemetry Data Stream</p>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl mt-auto">
             <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Facility Throughput</span>
               <Thermometer size={14} className="text-orange-500" />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-black italic tracking-tighter">84%</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">Bed Load factor</p>
                </div>
                <div>
                  <p className="text-2xl font-black italic tracking-tighter">18m</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">AVG Care Response</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BedSpatial({ data, onSelect, selected }: { data: BedWithPatient, onSelect: () => void, selected: boolean }) {
  const { bed, patient } = data
  
  const statusConfig = {
    AVAILABLE: 'bg-emerald-500 shadow-emerald-500/20 border-emerald-400/30',
    OCCUPIED: 'bg-blue-600 shadow-blue-500/20 border-blue-400/30',
    MAINTENANCE: 'bg-orange-500 shadow-orange-500/20 border-orange-400/30',
    CLEANING: 'bg-yellow-500 shadow-yellow-500/20 border-yellow-400/30',
  }

  const criticalAcuity = patient?.status === 'CRITICAL' 
    ? 'ring-[8px] ring-offset-[8px] ring-offset-slate-950 ring-red-500/20 animate-pulse border-red-500/50' 
    : ''

  return (
    <div className="flex flex-col items-center gap-3">
      <button 
        onClick={onSelect}
        className={`group relative w-20 h-32 rounded-2xl transition-all duration-500 transform border-2
          ${selected ? 'scale-110 -translate-y-4' : 'hover:scale-105 hover:-translate-y-2'}
          ${statusConfig[bed.status]} 
          ${criticalAcuity}
          ${selected ? 'ring-2 ring-white/30 shadow-2xl z-50' : 'shadow-xl shadow-black/80'}
          flex flex-col items-center justify-start p-1.5
        `}
      >
        {/* Physical Bed Texture/Pattern */}
        <div className="w-full h-1/4 bg-white/10 rounded-t-xl mb-1 flex items-center justify-center">
           <div className="w-2/3 h-1 bg-white/20 rounded-full" />
        </div>
        
        {/* Main Interaction Surface */}
        <div className="flex-1 w-full bg-white/5 rounded-lg flex flex-col items-center justify-around overflow-hidden p-2 relative backdrop-blur-sm">
          <span className="text-xl font-black italic tracking-tighter text-white/40 group-hover:text-white/80 transition-opacity">
            {bed.id.split('B')[1]}
          </span>
          {patient && (
            <div className="animate-pulse">
              <HeartPulse size={16} className={patient.status === 'CRITICAL' ? 'text-red-300' : 'text-blue-200'} />
            </div>
          )}
          {selected && (
             <div className="absolute inset-0 bg-white/10 animate-pulse backdrop-blur-md" />
          )}
        </div>

        {/* Footboard/End of Bed */}
        <div className="w-full h-2 bg-black/20 rounded-b-lg mt-1" />
      </button>
      <div className="flex flex-col items-center leading-none">
        <span className="text-[10px] font-black tracking-tighter text-slate-100 italic">{bed.id}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 mt-1">{bed.ward}</span>
      </div>
    </div>
  )
}

function Building2({ className, size }: { className?: string, size: number }) {
  // Since original Building2 might be missing or causing issues, use a simplified version
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}
