'use client'

import React, { useState, useEffect } from 'react'
import { 
  Zap, 
  Activity, 
  History, 
  CheckCircle, 
  ShieldCheck,
  Cpu,
  Terminal,
  Layers,
} from 'lucide-react'
import { getWorkflowEvents, getAutomationLogs } from '@/app/actions'

interface WorkflowEvent {
  id: string
  type: string
  severity: string
  metadata: string | null
  status: string
  createdAt: string
}

interface AutomationLog {
  log: {
    id: string
    actionTaken: string
    executedAt: string
    output: string | null
  }
  event: WorkflowEvent
}

export default function AutomationHub() {
  const [events, setEvents] = useState<WorkflowEvent[]>([])
  const [logs, setLogs] = useState<AutomationLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [ev, lg] = await Promise.all([getWorkflowEvents(), getAutomationLogs()])
      setEvents(ev as WorkflowEvent[])
      setLogs(lg as AutomationLog[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Cpu className="animate-pulse text-emerald-500" size={48} /></div>

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen flex flex-col font-mono text-emerald-500">
      
      {/* Tactical Header */}
      <div className="flex justify-between items-end border-b border-emerald-900/30 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Zap className="text-emerald-500 animate-pulse" size={24} />
             </div>
             <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Veda-Core Automation</h1>
          </div>
          <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.4em]">Systemic Autonomic Layer • Event-Driven Response Node • Node: AV-01</p>
        </div>
        
        <div className="flex gap-4">
           <StatusBit label="Core Engine" status="ACTIVE" />
           <StatusBit label="Event Bus" status="STABLE" />
           <StatusBit label="Ruleset v4.2" status="LOADED" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        
        {/* Event Stream */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="flex justify-between items-center bg-emerald-900/5 p-4 rounded-2xl border border-emerald-900/20">
             <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Live Event Telemetry
             </h2>
             <span className="text-[10px] font-bold opacity-50 tracking-widest">REAL-TIME SYNC • FEED</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
             {events.map((ev) => (
                <div key={ev.id} className="group p-5 bg-slate-900/40 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-all flex justify-between items-center relative overflow-hidden">
                   <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                   <div className="flex gap-6 items-center">
                      <div className={`p-3 rounded-2xl ${ev.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                         {ev.type === 'LOW_STOCK' ? <Layers size={18} /> : ev.type === 'CRITICAL_VITALS' ? <Activity size={18} /> : <Terminal size={18} />}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                            <span className="text-white font-black text-xs uppercase tracking-tighter">{ev.type}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${ev.severity === 'CRITICAL' ? 'bg-red-900/30 text-red-500' : 'bg-emerald-900/30 text-emerald-500'}`}>
                              {ev.severity}
                            </span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-500 truncate max-w-[300px]">{ev.metadata}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black text-slate-600">{new Date(ev.createdAt).toLocaleTimeString()}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${ev.status === 'PROCESSED' ? 'text-emerald-500' : 'text-yellow-500 animate-pulse'}`}>{ev.status}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Action Logs */}
        <div className="space-y-6 flex flex-col">
          <div className="flex justify-between items-center bg-emerald-900/5 p-4 rounded-2xl border border-emerald-900/20">
             <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white">
                <History size={14} /> Automation Registry
             </h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
             {logs.map((l) => (
                <div key={l.log.id} className="p-5 bg-emerald-950/10 border border-emerald-900/20 rounded-3xl space-y-3 hover:bg-emerald-950/20 transition-all group">
                   <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-emerald-900 uppercase tracking-widest">Execution Path</span>
                      <ShieldCheck size={12} className="text-emerald-800" />
                   </div>
                   <h3 className="text-xs font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">{l.log.actionTaken}</h3>
                   <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-[9px] font-bold text-emerald-800">
                      <div className="flex items-center gap-2">
                         <CheckCircle size={10} className="text-emerald-500" /> Success
                      </div>
                      <span>{new Date(l.log.executedAt).toLocaleTimeString()}</span>
                   </div>
                   <div className="bg-black/40 p-3 rounded-xl">
                      <p className="text-[8px] leading-relaxed opacity-60">RULE_TARGET: {l.event.type} • RESULT: DISPATCH_OK</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

      </div>

    </div>
  )
}

function StatusBit({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex flex-col items-end gap-1 px-4 border-r border-emerald-900/30 last:border-none">
       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
          {status}
       </span>
    </div>
  )
}
