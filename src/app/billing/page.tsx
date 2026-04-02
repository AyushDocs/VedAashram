'use client'

import React, { useState, useEffect } from 'react'
import { 
  Activity,
  DollarSign, 
  ArrowRight, 
  Receipt,
  Search,
  BarChart3,
  ChevronRight
} from 'lucide-react'
import { getBedsWithPatients, getBillingByPatientId } from '../actions'

interface BillingItem {
  id: string
  patientId: string
  itemName: string
  category: 'BED' | 'LAB' | 'CONSULTATION' | 'PHARMACY' | 'PROCEDURE'
  amount: number
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  date: string
}

interface Patient {
  id: string
  mrn: string
  name: string
}

export default function BillingRevenueHub() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [bills, setBills] = useState<BillingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const data = await getBedsWithPatients()
      const patientsWithBeds = data
        .filter((b): b is { bed: any, patient: any } => b.patient !== null)
        .map(b => ({
          id: b.patient.id,
          mrn: b.patient.mrn,
          name: b.patient.name
        }))
      setPatients(patientsWithBeds)
      if (patientsWithBeds.length > 0 && !selectedPatient) {
        setSelectedPatient(patientsWithBeds[0])
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchBills = async (pId: string) => {
    const data = await getBillingByPatientId(pId)
    setBills(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      fetchBills(selectedPatient.id)
    }
  }, [selectedPatient])

  const totalOutstanding = bills.reduce((acc, curr) => acc + (curr.status === 'PENDING' ? curr.amount : 0), 0)

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-blue-500" size={48} /></div>

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden bg-[#020408]">
      
      {/* Revenue Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/5 rounded-[3rem] p-12 text-white shadow-2xl flex justify-between items-center shrink-0">
         <div className="space-y-4">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Revenue Cycle Cluster</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck className="text-blue-500" size={14} /> Global Settlement Node • VEDA-REV-ALPHA
            </p>
         </div>

         <div className="text-right space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Unsettled (Active Patients)</p>
            <p className="text-6xl font-black italic tracking-tighter text-emerald-400">₹{totalOutstanding.toLocaleString()}</p>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-0">
        
        {/* Left Col: Patient Selector */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
           <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH ASSET (MRN/ID/NAME)" 
                className="w-full bg-slate-950 border border-white/5 py-4 pl-14 pr-6 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              />
           </div>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-3">
              {patients.filter(p => p.name.toUpperCase().includes(searchTerm) || p.id.toUpperCase().includes(searchTerm)).map((p, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedPatient(p)}
                  className={`w-full p-6 rounded-3xl text-left transition-all flex items-center justify-between group ${selectedPatient?.id === p.id ? 'bg-blue-600 shadow-xl shadow-blue-500/20' : 'bg-slate-900/40 hover:bg-slate-800'}`}
                >
                   <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${selectedPatient?.id === p.id ? 'text-white' : 'text-slate-200'}`}>{p.name}</h4>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedPatient?.id === p.id ? 'text-blue-100/60' : 'text-slate-600'}`}>{p.id}</p>
                   </div>
                   <ChevronRight className={selectedPatient?.id === p.id ? 'text-white' : 'text-slate-800'} size={18} />
                </button>
              ))}
           </div>
        </div>

        {/* Mid Col: Itemized Ledger (2 Cols Wide) */}
        <div className="lg:col-span-2 flex flex-col space-y-8 min-h-0">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                 <Receipt className="text-blue-500" /> Itemized Ledger
              </h2>
              <button 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-600/20"
              >
                 <ArrowRight size={14} /> Clear via Ordex
              </button>
           </div>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {bills.map((bill, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between hover:bg-slate-900 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                         <Activity size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{bill.category}</p>
                         <h4 className="text-lg font-black uppercase tracking-tight text-white">{bill.itemName}</h4>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black italic tracking-tighter text-white">₹{bill.amount.toLocaleString()}</p>
                      <div className={`text-[9px] font-black uppercase tracking-widest pt-1 ${bill.status === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>
                         {bill.status}
                      </div>
                   </div>
                </div>
              ))}
              
              {bills.length === 0 && (
                <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-700 gap-4">
                   <DollarSign size={48} className="opacity-10" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Recorded Ledger Events</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Col: Analytics & Insurance */}
        <div className="lg:col-span-1 space-y-10 overflow-y-auto custom-scrollbar">
           
           <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                 <BarChart3 size={14} className="text-blue-500" /> Revenue Pulse
              </h3>
              <div className="space-y-4">
                 <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                    <p className="text-[9px] font-black uppercase text-slate-600 mb-2">Settlement Delta</p>
                    <p className="text-3xl font-black italic tracking-tighter text-emerald-400">92.4%</p>
                 </div>
                 <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all">
                    <p className="text-[9px] font-black uppercase text-slate-600 mb-2">Unbilled Procedures</p>
                    <p className="text-3xl font-black italic tracking-tighter text-blue-500">0</p>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                 <ShieldCheck size={14} /> Insurance Active
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 &ldquo;Star Health Gold Plan verified for all critical care bed types. Deductible (₹25,000) not yet met for this cycle.&rdquo;
              </p>
           </div>

        </div>

      </div>

    </div>
  )
}

function ShieldCheck({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}
