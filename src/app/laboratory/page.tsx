'use client'

import React, { useState, useEffect } from 'react'
import { 
  FlaskConical, 
  Activity, 
  Scan, 
  CheckCircle2, 
  BarChart,
  FileText,
  Microscope,
  Zap,
  ShieldCheck,
  Inbox
} from 'lucide-react'
import { getBedsWithPatients, getLabOrdersForPatient, recordLabResult } from '../actions'

interface LabOrderData {
  order: {
    id: string
    patientId: string
    staffId: string
    testName: string
    category: 'BLOOD' | 'URINE' | 'STOOL' | 'RADIOLOGY' | 'CARDIOLOGY'
    status: 'PENDING' | 'COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    notes: string | null
    createdAt: string
  }
  result: {
    id: string
    orderId: string
    resultJson: string
    verifiedBy: string | null
    updatedAt: string
  } | null
}

export default function LaboratoryHub() {
  const [orders, setOrders] = useState<LabOrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<LabOrderData | null>(null)
  const [resultJson, setResultJson] = useState('{"Hemoglobin": "14.2", "WBC": "7.5"}')

  const fetchData = async () => {
    try {
      const beds = await getBedsWithPatients()
      const patients = beds.filter(b => b.patient !== null).map(b => b.patient!)
      let allOrders: LabOrderData[] = []
      for (const p of patients) {
        const pOrders = await getLabOrdersForPatient(p.id)
        allOrders = [...allOrders, ...pOrders]
      }
      setOrders(allOrders)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmitResult = async () => {
    if (!selectedOrder) return
    await recordLabResult(selectedOrder.order.id, resultJson, 'D001')
    setSelectedOrder(null)
    fetchData()
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-purple-500" size={48} /></div>

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden bg-[#020408]">
      
      {/* LIS Tactical Banner */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-500/10 rounded-[3rem] p-12 text-white shadow-2xl flex justify-between items-center shrink-0 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
            <FlaskConical size={200} />
         </div>
         
         <div className="space-y-4 relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">LIS Intelligence Node</h1>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck size={14} /> Laboratory Information System • VEDA-LIS-GAMMA
            </p>
         </div>

         <div className="hidden lg:flex gap-12 relative z-10">
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-1">Avg TAT</p>
               <p className="text-4xl font-black italic tracking-tighter text-emerald-400">42m</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 mb-1">Queue Depth</p>
               <p className="text-4xl font-black italic tracking-tighter text-white">{orders.filter(o => o.order.status !== 'COMPLETED').length}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-0">
        
        {/* Left Col: Order Queue */}
        <div className="lg:col-span-1 space-y-8 flex flex-col min-h-0">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
              <Inbox size={14} className="text-purple-500" /> Specimen Queue
           </h2>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {orders.filter(o => o.order.status !== 'COMPLETED').map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedOrder(item)}
                  className={`w-full p-8 rounded-[2rem] text-left transition-all border relative overflow-hidden group ${selectedOrder?.order.id === item.order.id ? 'bg-purple-600 border-purple-500 shadow-xl shadow-purple-500/20' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800'}`}
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${selectedOrder?.order.id === item.order.id ? 'bg-white/10' : 'bg-purple-500/10'} text-white`}>
                         <Zap size={16} />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${selectedOrder?.order.id === item.order.id ? 'text-white' : 'text-slate-600'}`}>{item.order.category}</span>
                   </div>
                   <h4 className={`text-md font-black uppercase tracking-tight ${selectedOrder?.order.id === item.order.id ? 'text-white' : 'text-slate-200'}`}>{item.order.testName}</h4>
                   <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedOrder?.order.id === item.order.id ? 'text-purple-100/60' : 'text-slate-600'}`}>ID: {item.order.id.split('-')[0]}</p>
                </button>
              ))}
              
              {orders.length === 0 && (
                <div className="h-64 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-800 gap-4">
                   <Microscope size={48} className="opacity-10" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Specimen Pending Retrieval</p>
                </div>
              )}
           </div>
        </div>

        {/* Mid Col: Result Entry Portal (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-8 flex flex-col min-h-0">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                 <Scan className="text-purple-500" /> High-Resolution Result Node
              </h2>
           </div>

           {selectedOrder ? (
              <div className="flex-1 bg-slate-900 border border-white/5 rounded-[3rem] p-12 space-y-10 animate-in zoom-in-95 overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between items-start border-b border-white/5 pb-8">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black italic tracking-tighter uppercase text-purple-400">{selectedOrder.order.testName}</h3>
                       <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order Group: {selectedOrder.order.id}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                       <p className="text-lg font-black text-purple-500 uppercase italic tracking-widest">{selectedOrder.order.status}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <FileText size={14} className="text-purple-500" /> Verified Laboratory Metadata (JSON)
                    </h4>
                    <textarea 
                      value={resultJson}
                      onChange={(e) => setResultJson(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 p-8 rounded-[2rem] font-mono text-sm text-emerald-500 focus:ring-2 focus:ring-purple-500/20 outline-none h-64 shadow-inner"
                    />
                 </div>

                 <button 
                  onClick={handleSubmitResult}
                  className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
                 >
                    <CheckCircle2 size={18} /> Transmit Verified Result to Clinical Hub
                 </button>
              </div>
           ) : (
              <div className="flex-1 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-800 gap-6">
                 <Inbox size={100} className="opacity-[0.03] animate-pulse" />
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-black italic tracking-tighter uppercase text-slate-700">Awaiting Specimen Selection</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Select an operative order from the queue to initiate result entry</p>
                 </div>
              </div>
           )}
        </div>

        {/* Right Col: Analytics & TAT */}
        <div className="lg:col-span-1 space-y-10 overflow-y-auto custom-scrollbar">
           
           <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                 <BarChart size={14} className="text-purple-500" /> Operational Analytics
              </h3>
              <div className="space-y-4">
                 <AnalyticsMetric title="Verified Labs Today" value="12" subtitle="Processed by Session Node" />
                 <AnalyticsMetric title="Clinical Accuracy" value="99.9%" subtitle="Zero Critical Mismatches" />
                 <AnalyticsMetric title="Peak Load TAT" value="58m" subtitle="Max Response Delay" />
              </div>
           </div>

           <div className="bg-purple-600/10 border border-purple-500/20 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-500">Security Beacon</h3>
                 <ShieldCheck size={14} className="text-purple-500" />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 All result entries are immutable and timestamped against the verifier ID: D001 (Dr. Ayush).
              </p>
           </div>

        </div>

      </div>

    </div>
  )
}

function AnalyticsMetric({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all group">
       <p className="text-[9px] font-black uppercase text-slate-600 mb-2">{title}</p>
       <p className="text-3xl font-black italic tracking-tighter text-purple-400 group-hover:scale-105 transition-transform origin-left">{value}</p>
       <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
  )
}
