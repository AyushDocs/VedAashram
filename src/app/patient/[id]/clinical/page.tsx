'use client'

import React, { useState, useEffect, use } from 'react'
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Zap, 
  Plus, 
  ChevronRight,
  FileText,
  ClipboardList,
  Clock,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
  Search,
  FlaskConical,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { 
  getPatientById, 
  getVitalsForPatient, 
  getPrescriptionsForPatient, 
  getClinicalNotesForPatient,
  recordVitals,
  addClinicalNote,
  searchIcdCodes,
  getLabOrdersForPatient
} from '@/app/actions'
import { calculateNews2, getRiskColor } from '@/lib/clinical'
import { useAuth } from '@/components/auth/AuthContext'

export default function ClinicalHub({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [patient, setPatient] = useState<any>(null)
  const [vitals, setVitals] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [notes, setNotes] = useState<any[]>([])
  const [labOrders, setLabOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'HISTORY' | 'LABS'>('TELEMETRY')
  
  // Note Form State
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [icdSearch, setIcdSearch] = useState('')
  const [icdResults, setIcdResults] = useState<any[]>([])
  const [selectedIcd, setSelectedIcd] = useState<any>(null)
  const { user } = useAuth()
  
  const [soap, setSoap] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  })

  const fetchData = async () => {
    try {
      const [p, v, rx, n, lo] = await Promise.all([
        getPatientById(id),
        getVitalsForPatient(id),
        getPrescriptionsForPatient(id),
        getClinicalNotesForPatient(id),
        getLabOrdersForPatient(id)
      ])
      setPatient(p)
      setVitals(v)
      setPrescriptions(rx)
      setNotes(n)
      setLabOrders(lo)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (icdSearch.length > 1) {
      searchIcdCodes(icdSearch).then(setIcdResults)
    } else {
      setIcdResults([])
    }
  }, [icdSearch])

  const handleSubmitNote = async () => {
    if (!user) return
    await addClinicalNote({
      patientId: id,
      staffId: user.id,
      type: 'SOAP',
      icdCode: selectedIcd?.code,
      ...soap
    })
    setShowNoteForm(false)
    setSoap({ subjective: '', objective: '', assessment: '', plan: '' })
    setSelectedIcd(null)
    fetchData()
  }

  const latestVitals = vitals[0]
  const news2 = latestVitals ? calculateNews2({
    respirationRate: latestVitals.respirationRate || 18,
    spO2: latestVitals.spO2 || 98,
    supplementalOxygen: latestVitals.supplementalOxygen || false,
    systolicBP: latestVitals.bpSystolic || 120,
    pulse: latestVitals.heartRate || 70,
    temperature: latestVitals.temp || 36.5,
    consciousness: latestVitals.consciousness || 'ALERT'
  }) : null

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-blue-500" size={48} /></div>
  if (!patient) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Patient Record Not Located</div>

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden bg-[#020408]">
      
      {/* Tactical Header */}
      <div className="flex justify-between items-center shrink-0">
         <div className="flex items-center gap-6">
            <Link href="/" className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black italic tracking-tighter uppercase">{patient.name}</h1>
                  <span className="bg-blue-600/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{patient.mrn}</span>
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                  {patient.age}Y • {patient.gender} • {patient.bloodGroup} • Allergy: <span className="text-red-500">{patient.allergies}</span>
               </p>
            </div>
         </div>

         <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('TELEMETRY')}
              className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'TELEMETRY' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-900 text-slate-500'}`}
            >
               Telemetry
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'HISTORY' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-900 text-slate-500'}`}
            >
               History
            </button>
            <button 
              onClick={() => setActiveTab('LABS')}
              className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'LABS' ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'bg-slate-900 text-slate-500'}`}
            >
               Labs ({labOrders.length})
            </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar">
           
           {activeTab === 'TELEMETRY' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
                       <Activity size={14} className="text-blue-500" /> Vitals Telemetry Node
                    </h2>
                    {news2 && (
                       <div className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl ${getRiskColor(news2.risk)}`}>
                          <AlertCircle size={14} /> NEWS2: {news2.score} • {news2.risk} RISK
                       </div>
                    )}
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <VitalsTrendCard label="Heart Rate" value={vitals[0]?.heartRate || '--'} unit="BPM" icon={<Heart className="text-red-500" size={14}/>} data={vitals.map(v => v.heartRate).reverse()} />
                    <VitalsTrendCard label="Blood Pressure" value={`${vitals[0]?.bpSystolic || '--'}/${vitals[0]?.bpDiastolic || '--'}`} unit="mmHg" icon={<Zap className="text-yellow-500" size={14}/>} data={vitals.map(v => v.bpSystolic).reverse()} />
                    <VitalsTrendCard label="SpO2" value={vitals[0]?.spO2 || '--'} unit="%" icon={<Droplets className="text-blue-500" size={14}/>} data={vitals.map(v => v.spO2).reverse()} />
                    <VitalsTrendCard label="Temp" value={vitals[0]?.temp || '--'} unit="°F" icon={<Thermometer className="text-orange-500" size={14}/>} data={vitals.map(v => v.temp).reverse()} />
                 </div>

                 <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Nursing MAR Feed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {prescriptions.map((rx, idx) => (
                          <div key={idx} className="bg-slate-950 p-6 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-blue-500/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                   <ShieldCheck size={20} />
                                </div>
                                <div>
                                   <h4 className="text-sm font-black uppercase tracking-widest text-white">{rx.drugName}</h4>
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{rx.dosage} • {rx.frequency}</p>
                                </div>
                             </div>
                             <button className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Administer</button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'HISTORY' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="flex justify-between items-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
                       <ClipboardList size={14} className="text-blue-500" /> Clinical History & SOAP
                    </h2>
                    <button onClick={() => setShowNoteForm(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
                       <Plus size={14} /> Add Note
                    </button>
                 </div>

                 <div className="space-y-6">
                    {notes.map((note, idx) => (
                      <div key={idx} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden group">
                         <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                               <div className="bg-blue-600/10 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-400">
                                  {note.type}
                               </div>
                               {note.icdCode && (
                                  <div className="bg-emerald-600/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                     Dx: {note.icdCode}
                                  </div>
                               )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{new Date(note.createdAt).toLocaleString()}</span>
                         </div>

                         <div className="grid grid-cols-2 gap-8">
                            <SoapPart label="S" content={note.subjective} color="text-emerald-500" />
                            <SoapPart label="O" content={note.objective} color="text-blue-400" />
                            <SoapPart label="A" content={note.assessment} color="text-purple-400" />
                            <SoapPart label="P" content={note.plan} color="text-orange-400" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           )}

           {activeTab === 'LABS' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
                    <FlaskConical size={14} className="text-purple-500" /> Lab result integration node
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {labOrders.map((lo, idx) => (
                       <div key={idx} className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 group hover:border-purple-500/20 transition-all">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-2xl font-black italic tracking-tighter uppercase text-white">{lo.order.testName}</h4>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Ref: {lo.order.id.split('-')[0]}</p>
                             </div>
                             <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lo.order.status === 'COMPLETED' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-600/10 text-purple-400 border border-purple-500/20'}`}>
                                {lo.order.status}
                             </div>
                          </div>

                          {lo.result && (
                             <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                   {Object.entries(JSON.parse(lo.result.resultJson)).map(([key, val]: any) => (
                                      <div key={key}>
                                         <p className="text-[8px] font-black uppercase text-slate-600 mb-1">{key}</p>
                                         <p className="text-lg font-black italic text-white tracking-tighter">{val}</p>
                                      </div>
                                   ))}
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                   <p className="text-[8px] font-black uppercase text-slate-700 tracking-widest flex items-center gap-1">
                                      <ShieldCheck size={10} /> Verified by NODE: {lo.result.verifiedBy}
                                   </p>
                                   <CheckCircle2 size={16} className="text-emerald-500" />
                                </div>
                             </div>
                          )}

                          {!lo.result && (
                             <div className="h-32 flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-3xl opacity-20">
                                <Clock size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Analysis...</p>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
           <div className="bg-blue-600/10 border border-blue-500/20 rounded-[2rem] p-6 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                 <AlertCircle size={14} /> Clinical Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                 {patient.tags?.split(',').map((tag: string) => (
                    <span key={tag} className="bg-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 border border-white/5">{tag.trim()}</span>
                 ))}
                 {news2 && news2.score >= 5 && (
                    <span className="bg-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 animate-pulse">CRITICAL</span>
                 )}
              </div>
           </div>

           <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Quick Diagnostic Access</h3>
              <div className="space-y-3">
                 <DiagnosticLink label="Sanjeevni Bridge" color="text-emerald-500" />
                 <DiagnosticLink label="PAC Imaging" color="text-blue-500" />
                 <DiagnosticLink label="Risk Profile" color="text-purple-500" />
              </div>
           </div>
        </div>

      </div>

      {/* Note Form Overlay */}
      {showNoteForm && (
         <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/5 rounded-[4rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
               <button onClick={() => setShowNoteForm(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><Zap size={24} /></button>
               
               <div className="p-12 space-y-10 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">Record Clinical Encounter</h2>
                     <p className="text-xs font-black text-slate-500 uppercase tracking-widest">SOAP Standard • ICD-10 Compliant</p>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Standardized Diagnosis (ICD-10)</h4>
                     <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                        <input 
                           value={icdSearch}
                           onChange={(e) => setIcdSearch(e.target.value)}
                           className="w-full bg-slate-950 border border-white/5 py-4 pl-16 pr-6 rounded-2xl text-sm text-white focus:ring-2 focus:ring-blue-500/20"
                           placeholder="Search for diagnosis code or description..."
                        />
                        {icdResults.length > 0 && (
                           <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-white/10 rounded-2xl p-2 z-50 shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
                              {icdResults.map(item => (
                                 <button 
                                    key={item.code} 
                                    onClick={() => { setSelectedIcd(item); setIcdSearch(''); setIcdResults([]) }}
                                    className="w-full p-4 text-left hover:bg-white/5 rounded-xl transition-all flex justify-between items-center group"
                                 >
                                    <div>
                                       <span className="text-blue-500 font-black text-sm uppercase tracking-tighter italic">{item.code}</span>
                                       <p className="text-xs text-slate-400 font-medium">{item.description}</p>
                                    </div>
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>
                     {selectedIcd && (
                        <div className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-2xl flex justify-between items-center animate-in zoom-in-95">
                           <div>
                              <span className="text-emerald-500 font-black italic tracking-tighter uppercase text-sm">SELECTED DX: {selectedIcd.code}</span>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedIcd.description}</p>
                           </div>
                           <button onClick={() => setSelectedIcd(null)} className="text-red-500/40 hover:text-red-500 transition-colors uppercase text-[9px] font-black">Remove</button>
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                     <SoapInput label="Subjective" value={soap.subjective} onChange={v => setSoap({...soap, subjective: v})} placeholder="Patient complaints, history..." color="border-emerald-500/20 focus:border-emerald-500" />
                     <SoapInput label="Objective" value={soap.objective} onChange={v => setSoap({...soap, objective: v})} placeholder="Physical exam findings, vitals summary..." color="border-blue-500/20 focus:border-blue-500" />
                     <SoapInput label="Assessment" value={soap.assessment} onChange={v => setSoap({...soap, assessment: v})} placeholder="Clinical reasoning, differential diagnosis..." color="border-purple-500/20 focus:border-purple-500" />
                     <SoapInput label="Plan" value={soap.plan} onChange={v => setSoap({...soap, plan: v})} placeholder="Medications, tests ordered, follow-up..." color="border-orange-500/20 focus:border-orange-500" />
                  </div>

                  <button 
                    onClick={handleSubmitNote}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                     <CheckCircle2 size={18} /> Finalize Node Entry
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  )
}

function VitalsTrendCard({ label, value, unit, icon, data }: { label: string, value: string | number, unit: string, icon: React.ReactNode, data: number[] }) {
  return (
    <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-1 hover:border-blue-500/20 transition-all cursor-default group">
       <div className="flex justify-between items-center mb-3 text-slate-600 group-hover:text-slate-400 transition-colors">
          {icon} <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">{value}</p>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{unit}</span>
       </div>
    </div>
  )
}

function SoapPart({ label, content, color }: { label: string, content: string, color: string }) {
  if (!content) return null
  return (
    <div className="space-y-2">
       <h5 className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label} Node</h5>
       <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-white/5 pl-4">{content}</p>
    </div>
  )
}

function SoapInput({ label, value, onChange, placeholder, color }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, color: string }) {
  return (
    <div className="space-y-4">
       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</label>
       <textarea 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full bg-slate-950 border ${color} p-6 rounded-2xl text-xs text-white focus:ring-0 outline-none h-32 transition-all`}
       />
    </div>
  )
}

function DiagnosticLink({ label, color }: { label: string, color: string }) {
  return (
    <button className="w-full p-4 bg-slate-950 rounded-xl flex justify-between items-center group border border-white/5 hover:border-white/10 transition-all">
       <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
       <ArrowUpRight size={14} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  )
}

function ArrowUpRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
    </svg>
  )
}
