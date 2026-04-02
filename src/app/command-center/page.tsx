'use client'

import React, { useState, useEffect } from 'react'
import { 
  Network, 
  Activity, 
  Users, 
  Blocks, 
  Zap, 
  ShieldAlert, 
  AlertCircle,
  LayoutGrid,
  Monitor,
  Cpu,
  Layers,
  Container,
  Microchip
} from 'lucide-react'
import { getCommandCenterData } from '@/app/actions'

interface Bed {
  id: string
  ward: string
  status: string
}

interface WorkflowEvent {
  id: string
  type: string
  severity: string
  createdAt: string
}

interface CommandCenterStats {
  beds: Bed[]
  staff: { total: number; active: number }
  equipment: { total: number; inUse: number }
  recentEvents: WorkflowEvent[]
}

export default function CommandCenter() {
  const [data, setData] = useState<CommandCenterStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const res = await getCommandCenterData()
    setData(res as unknown as CommandCenterStats)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 8000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !data) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-500"><Cpu className="animate-pulse" size={48} /></div>

  const wards = Array.from(new Set(data.beds.map(b => b.ward)))

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen flex flex-col font-mono text-cyan-500 selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Tactical Header */}
      <div className="flex justify-between items-end border-b border-cyan-900/30 pb-8 shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-cyan-600/10 rounded-lg border border-cyan-500/20">
                <Network className="text-cyan-400 animate-pulse" size={24} />
             </div>
             <h1 className="text-4xl font-black tracking-tighter uppercase text-white italic">VEDA-TWIN COMMAND</h1>
          </div>
          <p className="text-[10px] font-bold text-cyan-900 uppercase tracking-[0.4em]">Integrated Digital Twin • Real-Time Operational Heatmap • Hub: NORTH-01</p>
        </div>
        
        <div className="flex gap-10">
           <StatusMetric label="Sync Status" value="SYNCHRONIZED" color="text-cyan-400" />
           <StatusMetric label="Digital Twin" value="OPERATIONAL" color="text-emerald-400" />
           <StatusMetric label="Uplink" value="ACTIVE" color="text-cyan-400" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Left Column: Aggregated Gauges */}
        <div className="space-y-6 flex flex-col pt-4">
           <SectionLabel icon={<Layers size={14}/>} label="Workforce Load" />
           <Gauge 
              label="Staff Load" 
              current={data.staff.active} 
              total={data.staff.total} 
              icon={<Users size={16} />} 
              color="bg-cyan-500"
           />
           
           <SectionLabel icon={<Microchip size={14}/>} label="Tech Density" />
           <Gauge 
              label="Equipment" 
              current={data.equipment.inUse} 
              total={data.equipment.total} 
              icon={<Blocks size={16} />} 
              color="bg-purple-500"
           />

           <div className="mt-auto space-y-4">
              <div className="p-6 bg-cyan-950/20 border border-cyan-900/20 rounded-3xl space-y-2 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Monitor size={80} />
                 </div>
                 <p className="text-[10px] font-black text-cyan-900 uppercase tracking-widest leading-none">System Load</p>
                 <p className="text-3xl font-black text-white italic">14.2%</p>
                 <div className="h-1 bg-cyan-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[14%] animate-progress" />
                 </div>
              </div>
           </div>
        </div>

        {/* Center Canvas: Ward Heatmap */}
        <div className="lg:col-span-2 flex flex-col space-y-6 p-1 bg-cyan-900/5 rounded-[3rem] border border-cyan-900/10">
           <div className="flex justify-between items-center p-8 pb-0">
              <SectionLabel icon={<LayoutGrid size={14}/>} label="Clinical Heatmap (Digital Twin)" />
              <div className="flex gap-4">
                 <LegendItem color="bg-emerald-500" label="Available" />
                 <LegendItem color="bg-cyan-500" label="Occupied" />
                 <LegendItem color="bg-red-500" label="Alarm" />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-12 custom-scrollbar">
              {wards.map(ward => (
                 <div key={ward} className="space-y-4">
                    <div className="flex items-center gap-4 border-l-2 border-cyan-900/30 pl-4">
                       <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">{ward}</h3>
                       <span className="text-[10px] font-bold text-cyan-900 uppercase">Sector Map v2.1</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                       {data.beds.filter(b => b.ward === ward).map(bed => (
                          <div 
                            key={bed.id}
                            className={`group h-12 relative rounded-xl border border-white/5 transition-all cursor-crosshair overflow-hidden ${
                               bed.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' : 
                               bed.status === 'OCCUPIED' ? 'bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20' :
                               'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 animate-pulse'
                            }`}
                          >
                             <div className={`absolute top-0 right-0 w-1 h-1 m-1 rounded-full ${
                                bed.status === 'AVAILABLE' ? 'bg-emerald-500' : 
                                bed.status === 'OCCUPIED' ? 'bg-cyan-500' : 'bg-red-500'
                             }`} />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-black group-hover:scale-110 transition-transform">{bed.id.split('-').pop()}</span>
                             </div>
                             
                             {/* Tactical Tooltip Simulation */}
                             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1 pointer-events-none">
                                <p className="text-[6px] font-black uppercase text-white bg-black/80 rounded px-1 w-fit">{bed.status}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Column: Event Pulse */}
        <div className="space-y-6 flex flex-col pt-4">
           <SectionLabel icon={<Zap size={14}/>} label="Veda-Core Events" />
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {data.recentEvents.map(ev => (
                 <div key={ev.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          ev.severity === 'CRITICAL' ? 'bg-red-900/30 text-red-500' : 'bg-cyan-900/30 text-cyan-400'
                       }`}>
                          {ev.severity}
                       </span>
                       <span className="text-[8px] font-bold text-slate-700">{new Date(ev.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic">{ev.type}</p>
                    <div className="h-4 mt-2 border-l border-cyan-900/30 ml-1 pl-2 flex items-center">
                       <p className="text-[8px] font-bold text-slate-600 truncate">NODE_UPD: RULE_MET_AUTO_OK</p>
                    </div>
                 </div>
              ))}
           </div>

           <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 space-y-3 animate-pulse group hover:bg-red-500/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3 text-red-500">
                 <ShieldAlert size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Global Safety Lock</span>
              </div>
              <p className="text-[10px] text-red-500/80 font-bold leading-relaxed">Systemic override available via manual authorization bypass (Admin Only).</p>
           </div>
        </div>

      </div>

    </div>
  )
}

function StatusMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-end gap-1">
       <span className="text-[8px] font-black text-cyan-900 uppercase tracking-widest">{label}</span>
       <span className={`text-xs font-black uppercase tracking-tighter ${color}`}>{value}</span>
    </div>
  )
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-cyan-900">
       <div className="p-1.5 bg-cyan-950 rounded-lg border border-cyan-500/10">{icon}</div> {label}
    </h2>
  )
}

function Gauge({ label, current, total, icon, color }: { label: string; current: number; total: number; icon: React.ReactNode; color: string }) {
  const percent = Math.min(100, Math.round((current / total) * 100))
  return (
    <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4 hover:border-cyan-500/20 transition-all">
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="text-white/20">{icon}</div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">{label}</p>
          </div>
          <span className="text-[10px] font-black text-cyan-500">{percent}%</span>
       </div>
       <div className="text-3xl font-black text-white italic">{current}<span className="text-sm font-bold text-slate-700 not-italic ml-2">/ {total}</span></div>
       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
       </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
       <div className={`w-2 h-2 rounded-full ${color}`} />
       <span className="text-[8px] font-black uppercase tracking-widest text-cyan-900">{label}</span>
    </div>
  )
}
