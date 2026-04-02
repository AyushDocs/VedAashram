'use client'

import React, { useState } from 'react'
import { 
  Send, 
  Bot, 
  X, 
  CheckCircle2, 
  Stethoscope, 
  History,
  ShieldAlert
} from 'lucide-react'
import { processSymptomTriage, addClinicalNote } from '@/app/actions'

interface TriageResult {
  score: number
  recommendation: string
  reason: string
}

interface Message {
  role: 'user' | 'bot'
  content: string
  triage?: TriageResult
}

export function SymptomChecker({ patientId, onClose }: { patientId: string, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello. I am the Veda-AI Clinical Triage Assistant. Please describe your symptoms in detail so I can provide a preliminary assessment." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TriageResult | null>(null)

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const resp = await processSymptomTriage(userMsg)
      setResult(resp as TriageResult)
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `Assessment Complete. Triage Level: ${resp.score}. Recommendation: ${resp.recommendation.replace('_', ' ')}.`,
        triage: resp as TriageResult
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: "I encountered an error analyzing your symptoms. Please consult a clinician directly." }])
    } finally {
      setLoading(false)
    }
  }

  const saveToRecord = async () => {
    if (!result) return
    await addClinicalNote({
      patientId,
      staffId: 'D001', // Using primary medical director node for AI validation
      type: 'PROGRESS',
      subjective: `Patient reported symptoms: ${messages[messages.length - 2].content}`,
      assessment: `AI Triage Verdict: Level ${result.score} (${result.recommendation.replace('_', ' ')})`,
      plan: `AI Recommendation: ${result.reason}`
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[80vh] selection:bg-indigo-500/30">
        
        {/* Header */}
        <div className="p-8 bg-slate-900 border-b border-white/5 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                 <Bot size={28} />
              </div>
              <div>
                 <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">AI Triage Node</h2>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert size={10} className="text-amber-500" /> Preliminary Assessment Only
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 tracking-tighter hover:text-white transition-all">
              <X size={24} />
           </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-950/20">
           {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                    m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none'
                 }`}>
                    {m.content}

                    {m.triage && (
                       <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-indigo-500/30 space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-indigo-400">
                             <span>Triage Verdict</span>
                             <span className={`px-2 py-0.5 rounded-lg ${
                                m.triage.score <= 2 ? 'bg-red-500/20 text-red-500' : 
                                m.triage.score <= 4 ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                             }`}>Level {m.triage.score}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic">&ldquo;{m.triage.reason}&rdquo;</p>
                          <div className="flex items-center gap-2 text-white font-black uppercase italic tracking-tight text-lg">
                             <Stethoscope size={18} className="text-indigo-500" />
                             {m.triage.recommendation.replace('_', ' ')}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           ))}
           {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-800 p-5 rounded-3xl rounded-bl-none border border-white/5 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-300" />
                 </div>
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-900 border-t border-white/5 shrink-0">
           {result ? (
              <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                 <button 
                   onClick={() => {setResult(null); setMessages([{ role: 'bot', content: "Let's try again. Please describe your symptoms." }])}}
                   className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                 >
                    <History size={16} /> New Assessment
                 </button>
                 <button 
                   onClick={saveToRecord}
                   className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                 >
                    <CheckCircle2 size={16} /> Sync to Health Record
                 </button>
              </div>
           ) : (
              <div className="relative group">
                 <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe symptoms (e.g., 'Severe chest pain')..."
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                 />
                 <button 
                    onClick={handleSend}
                    className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
                    disabled={!input.trim()}
                 >
                    <Send size={18} />
                 </button>
              </div>
           )}
        </div>

      </div>
    </div>
  )
}
