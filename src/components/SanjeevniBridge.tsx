'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShieldAlert, 
  Lock, 
  FileText, 
  HandMetal, 
  Eye, 
  Scan,
  AlertCircle,
  Activity
} from 'lucide-react'

interface SanjeevniRecordProps {
  recordId: string
  authToken: string
  patientName: string
}

export function SanjeevniSecureViewer({ recordId, authToken, patientName }: SanjeevniRecordProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [handshakeStatus, setHandshakeStatus] = useState('Initializing Handshake...')

  useEffect(() => {
    // Simulate Secure Handshake with Sanjeevni Blockchain Node
    const simulateHandshake = async () => {
      setHandshakeStatus('Reaching Sanjeevni Node...')
      await new Promise(r => setTimeout(r, 1000))
      setHandshakeStatus('Verifying Protocol Token...')
      await new Promise(r => setTimeout(r, 800))
      setHandshakeStatus('Syncing Encrypted Stream...')
      await new Promise(r => setTimeout(r, 600))
      
      if (authToken === 'dev-secret-token') {
        setIsAuthorized(true)
      }
      setLoading(false)
    }
    simulateHandshake()
  }, [authToken])

  if (loading) {
    return (
      <div className="h-[500px] bg-slate-950 border border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-4 animate-in fade-in">
         <div className="relative">
            <Scan className="text-blue-500 animate-pulse" size={64} />
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">{handshakeStatus}</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="h-[500px] bg-red-500/5 border border-red-500/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-6">
         <ShieldAlert className="text-red-500" size={48} />
         <div className="space-y-2">
            <h3 className="text-xl font-black italic tracking-tighter text-red-500">ACCESS PROTOCOL VIOLATION</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
               Record request denied by Sanjeevni Security Node. Invalid Bridge Auth Token detected.
            </p>
         </div>
         <button className="px-6 py-3 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all">Request Re-Auth</button>
      </div>
    )
  }

  return (
    <div className="relative group select-none h-full min-h-[600px]">
       {/* Security Overlays */}
       <div className="absolute inset-0 z-50 pointer-events-none border-[12px] border-blue-500/5 group-hover:border-blue-500/10 transition-all rounded-3xl" />
       
       {/* Anti-Scrape Watermark Overlay */}
       <div className="absolute inset-0 z-40 pointer-events-none grid grid-cols-4 grid-rows-6 opacity-[0.03] rotate-[-25deg] scale-150">
          {Array(24).fill(0).map((_, i) => (
             <div key={i} className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden">
               {patientName} • VEDAASHRAM VIEW • {new Date().toLocaleDateString()}
             </div>
          ))}
       </div>

       {/* Control Header */}
       <div className="absolute top-6 right-6 z-50 flex gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-emerald-500">
             <Lock size={10} />
             <span className="text-[8px] font-black uppercase tracking-widest">Sanjeevni Encrypted</span>
          </div>
       </div>

       {/* The "Component" - Hard to Download / Non-Static */}
       <div className="h-full bg-[#05070a] border border-white/5 rounded-3xl p-12 overflow-y-auto custom-scrollbar relative">
          
          <div className="space-y-12 max-w-2xl mx-auto">
             {/* Clinical Header */}
             <div className="flex justify-between items-start border-b border-white/10 pb-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Electronic Medical Record</p>
                   <h2 className="text-4xl font-black italic tracking-tighter uppercase">{patientName}</h2>
                   <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>DOB: 12/04/1979</span>
                      <span>Sex: M</span>
                      <span>Blood: O-</span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Record ID</p>
                   <p className="font-mono text-sm text-slate-400 font-bold">{recordId}</p>
                </div>
             </div>

             {/* Dynamic Content Sections (Hard to scrape because they're not standard text blocks) */}
             <section className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" /> Diagnosis History
                </h4>
                <div className="grid gap-4">
                   <RecordBlock date="2026-03-30" title="Acute Myocardial Infarction" details="Admitted to ICU for observation. Administered beta-blockers..." />
                   <RecordBlock date="2026-03-12" title="Hypertension (Stage 2)" details="Chronic management via Lisinopril 20mg daily." />
                </div>
             </section>

             <section className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" /> Lab Results (Secure Relay)
                </h4>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">
                      <span>Metric</span>
                      <span>Value</span>
                      <span>Range</span>
                   </div>
                   <LabRow label="Hemoglobin" value="14.2 g/dL" range="13.5-17.5" />
                   <LabRow label="Creatinine" value="0.9 mg/dL" range="0.7-1.3" />
                   <LabRow label="Troponin" value="0.04 ng/mL" range="< 0.04" status="NORMAL" />
                </div>
             </section>

             <div className="pt-20 text-center opacity-30 select-none pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">END OF ENCRYPTED RECORD • SANJEEVNI NODE 0491</p>
             </div>
          </div>

       </div>

       {/* Security Warning Footer */}
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 text-red-400 z-50">
          <AlertCircle size={14} className="animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest">Screen Capture & Direct Printing Disabled by Sanjeevni Bridge</span>
       </div>

    </div>
  )
}

function RecordBlock({ date, title, details }: { date: string, title: string, details: string }) {
  return (
    <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-blue-600/30">
       <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-blue-600" />
       <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">{date}</p>
       <h5 className="text-lg font-black italic tracking-tighter text-blue-400 uppercase">{title}</h5>
       <p className="text-xs text-slate-500 font-medium leading-relaxed italic">&ldquo;{details}&rdquo;</p>
    </div>
  )
}

function LabRow({ label, value, range, status = "NORMAL" }: { label: string, value: string, range: string, status?: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-xs font-bold text-slate-300">{label}</span>
       <span className="text-sm font-black italic tracking-tighter text-white">{value}</span>
       <span className="text-[10px] font-bold text-slate-600">{range}</span>
    </div>
  )
}
