'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Activity, 
  Pill, 
  FlaskConical, 
  DollarSign, 
  User,
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react'
import { getPatientFullHistory } from '@/app/actions'
import { SymptomChecker } from '@/components/SymptomChecker'

interface PHRData {
  patient: { name: string; mrn: string; gender: string }
  notes: Array<{ id: string; createdAt: string; category?: string; content: string }>
  prescriptions: Array<{ id: string; drugName: string; dosage: string; duration: string }>
  labOrders: Array<{ order: { id: string; testName: string; createdAt: string; status: string }; result?: any }>
  vitals: Array<{ heartRate?: number; bpSystolic?: number; bpDiastolic?: number; temp?: number; spO2?: number; recordedAt: string }>
  billing: Array<{ id: string; item: string; date: string; amount: number; status: string }>
}

export default function PatientPHR() {
  const [data, setData] = useState<PHRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string | null>('timeline')
  const [isCheckerOpen, setIsCheckerOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await getPatientFullHistory('P001') // Defaulting to P001 for demo
    setData(res as unknown as PHRData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading || !data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Activity className="animate-spin text-indigo-600" size={48} /></div>

  return (
    <div className="p-8 space-y-10 bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* PHR Header: Identity & Vital Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              <User size={40} />
           </div>
           <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">MY PERSONAL HEALTH RECORD</h1>
                 <ShieldCheck size={20} className="text-indigo-500" />
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">{data.patient.name} • MRN: {data.patient.mrn} • {data.patient.gender}</p>
           </div>
        </div>
        
        <div className="flex gap-4 items-center">
           <button 
             onClick={() => setIsCheckerOpen(true)}
             className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-500/20"
           >
              <Bot size={16} /> AI Triage
           </button>
           <Statistic label="Blood Type" value="O+" color="text-indigo-600" />
           <Statistic label="Age" value="34" color="text-indigo-600" />
           <Statistic label="Weight" value="72 kg" color="text-indigo-600" />
        </div>
      </div>

      {isCheckerOpen && <SymptomChecker patientId="P001" onClose={() => { setIsCheckerOpen(false); fetchData() }} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Clinical Timeline & Notes */}
        <div className="lg:col-span-2 space-y-8">
           <Section 
             title="Clinical Events & History" 
             icon={<FileText size={20} />} 
             isOpen={expandedSection === 'timeline'}
             toggle={() => setExpandedSection(expandedSection === 'timeline' ? null : 'timeline')}
           >
              <div className="space-y-6 relative ml-4 border-l-2 border-slate-100 pl-8 py-4">
                 {data.notes.map((note) => (
                    <div key={note.id} className="relative">
                       <div className="absolute -left-[41px] top-1 w-5 h-5 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                       </div>
                       <div className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-500/5 group cursor-default">
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString()}</p>
                                <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none mt-1">{note.category || 'General Consultation'}</h4>
                             </div>
                             <span className="bg-slate-100 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest text-slate-500">Verified</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{note.content}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Section>

           <Section 
             title="Diagnostic Reports & Labs" 
             icon={<FlaskConical size={20} />}
             isOpen={expandedSection === 'labs'}
             toggle={() => setExpandedSection(expandedSection === 'labs' ? null : 'labs')}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {data.labOrders.map(item => (
                    <div key={item.order.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:border-amber-400 transition-all">
                       <div className="space-y-2">
                          <div className="flex justify-between items-center text-slate-400">
                             <FlaskConical size={16} />
                             <p className="text-[9px] font-black uppercase tracking-widest">{new Date(item.order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <h5 className="text-lg font-black text-slate-800 uppercase italic">{item.order.testName}</h5>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                          <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${item.order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                             {item.order.status}
                          </span>
                          {item.result && <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">View Result <ChevronRight size={12} /></button>}
                       </div>
                    </div>
                 ))}
              </div>
           </Section>
        </div>

        {/* Right Column: Medications, Vitals & Billing */}
        <div className="space-y-8">
           
           {/* Medication Wallet */}
           <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-200 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-2 uppercase">
                    <Pill size={24} /> My Medications
                 </h3>
                 <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase">{data.prescriptions.length} Active</span>
              </div>
              <div className="space-y-3">
                 {data.prescriptions.map(med => (
                    <div key={med.id} className="bg-white/10 p-4 rounded-2xl border border-white/10 group hover:bg-white/20 transition-all">
                       <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-black italic uppercase tracking-tight">{med.drugName}</p>
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Daily</span>
                       </div>
                       <p className="text-[11px] font-bold text-indigo-100/70 uppercase tracking-widest">{med.dosage} • {med.duration}</p>
                    </div>
                 ))}
                 {data.prescriptions.length === 0 && <p className="text-xs italic text-indigo-200">No active prescriptions found.</p>}
              </div>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                 Request Refill <ExternalLink size={12} />
              </button>
           </div>

           {/* Financial Integrity */}
           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <DollarSign size={14} className="text-emerald-500" /> Revenue & Billing
              </h3>
              <div className="space-y-4">
                 {data.billing.slice(0, 3).map(bill => (
                    <div key={bill.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:bg-white hover:border-emerald-200 transition-all">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-black text-slate-800 uppercase italic leading-none">{bill.item}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{bill.date}</p>
                       </div>
                       <div className="text-right">
                          <p className={`text-sm font-black tracking-tighter ${bill.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>${bill.amount}</p>
                          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">{bill.status}</p>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-emerald-400 hover:text-emerald-600 transition-all">View All Invoices</button>
              </div>
           </div>

           {/* Vitals Summary Card */}
           <div className="bg-[#020617] p-8 rounded-[3rem] text-cyan-400 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={80} /></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-900 flex items-center gap-2">
                 <Activity size={14} className="animate-pulse" /> Latest Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <VitalStat label="BPM" value={data.vitals[0]?.heartRate || '--'} />
                 <VitalStat label="BP" value={`${data.vitals[0]?.bpSystolic || '--'}/${data.vitals[0]?.bpDiastolic || '--'}`} />
                 <VitalStat label="Temp" value={`${data.vitals[0]?.temp || '--'}°C`} />
                 <VitalStat label="O2" value={`${data.vitals[0]?.spO2 || '--'}%`} />
              </div>
           </div>

        </div>

      </div>

    </div>
  )
}

function Section({ title, icon, children, isOpen, toggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, toggle: () => void }) {
  return (
    <div className="space-y-6">
       <button 
         onClick={toggle}
         className="flex items-center justify-between w-full group"
       >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white border border-slate-100 rounded-2xl text-indigo-600 shadow-sm group-hover:shadow-lg transition-all">
                {icon}
             </div>
             <h2 className="text-xs font-black uppercase italic tracking-tighter">
                {title}
             </h2>
          </div>
          {isOpen ? <ChevronUp size={20} className="text-slate-300" /> : <ChevronDown size={20} className="text-slate-300" />}
       </button>
       {isOpen && (
          <div className="animate-in slide-in-from-top-4 duration-500">
             {children}
          </div>
       )}
    </div>
  )
}

function Statistic({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-2 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-400 transition-all">
       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
       <span className={`text-lg font-black tracking-tighter italic ${color}`}>{value}</span>
    </div>
  )
}

function VitalStat({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 space-y-1">
       <p className="text-[8px] font-black text-cyan-900 uppercase tracking-widest">{label}</p>
       <p className="text-xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  )
}
