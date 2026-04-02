'use client'

import React, { useState, useEffect } from 'react'
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Activity, 
  Calendar, 
  Zap, 
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  Box
} from 'lucide-react'
import Link from 'next/link'
import { getPharmacyInventory, updatePharmacyStock } from '../actions'

interface InventoryItem {
  id: string
  drugName: string
  quantity: number
  unit: string
  batchNumber?: string | null
  expiryDate?: string | null
  reorderLevel: number
}

export default function PharmacyHub() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const data = await getPharmacyInventory()
      setInventory(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStock = async (id: string, delta: number) => {
    await updatePharmacyStock(id, delta)
    fetchData()
  }

  const filteredInventory = inventory.filter(p => p.drugName.toUpperCase().includes(searchTerm.toUpperCase()))
  const criticallyLow = inventory.filter(p => p.quantity <= p.reorderLevel)
  const nearExpiry = inventory.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Activity className="animate-spin text-emerald-500" size={48} /></div>

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 h-screen flex flex-col overflow-hidden bg-[#020408]">
      
      {/* Pharmacy Tactical Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-500/10 rounded-[3rem] p-12 text-white shadow-2xl flex justify-between items-center shrink-0 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
            <Package size={200} />
         </div>
         
         <div className="space-y-4 relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Pharmacy Inventory Node</h1>
            <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck size={14} /> Global Supply Relay • VEDA-PHARMA-01
            </p>
         </div>

         <div className="hidden lg:flex gap-8 relative z-10">
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Low Stock Alerts</p>
               <p className="text-4xl font-black italic tracking-tighter text-orange-400">{criticallyLow.length}</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Expiry Warnings</p>
               <p className="text-4xl font-black italic tracking-tighter text-red-500">{nearExpiry.length}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-10 min-h-0">
        
        {/* Left Col: Stock Alert Cluster */}
        <div className="lg:col-span-1 space-y-8 flex flex-col min-h-0">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
              <AlertTriangle size={14} className="text-orange-500" /> Critical Supply Alerts
           </h2>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {criticallyLow.map((item, idx) => (
                <div key={idx} className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-3xl space-y-3 animate-pulse">
                   <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-400">{item.drugName}</h4>
                      <TrendingDown size={14} className="text-orange-500" />
                   </div>
                   <p className="text-2xl font-black italic tracking-tighter text-white">{item.quantity} <span className="text-[10px] uppercase text-slate-600">{item.unit}</span></p>
                   <button className="w-full py-3 bg-orange-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-orange-500 transition-all">Reorder Now</button>
                </div>
              ))}

              {nearExpiry.map((item, idx) => (
                <div key={idx} className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl space-y-3">
                   <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black uppercase tracking-widest text-red-400">{item.drugName}</h4>
                      <Calendar size={14} className="text-red-500" />
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expires: {item.expiryDate}</p>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-3/4" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Mid Col: Global Inventory View (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-8 flex flex-col min-h-0">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                 <Box className="text-emerald-500" /> Master Inventory
              </h2>
              <div className="relative w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="SEARCH INVENTORY..." 
                   className="w-full bg-slate-900 border border-white/5 py-3 pl-10 pr-4 rounded-xl text-[9px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500/20"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {filteredInventory.map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between hover:bg-slate-900 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                         <Zap size={24} />
                      </div>
                      <div>
                         <h4 className="text-xl font-black uppercase tracking-tight text-white">{item.drugName}</h4>
                         <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.batchNumber} • {item.unit}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <p className="text-3xl font-black italic tracking-tighter text-white">{item.quantity}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-700">In Stock</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         <button onClick={() => handleStock(item.id, 10)} className="p-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white rounded-lg transition-all"><Plus size={14}/></button>
                         <button onClick={() => handleStock(item.id, -1)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"><Minus size={14}/></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Col: Logistics & Supply */}
        <div className="lg:col-span-1 space-y-10 overflow-y-auto custom-scrollbar">
           
           <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                 <ShoppingBag size={14} className="text-emerald-500" /> Logistics Hub
              </h3>
              <div className="space-y-4">
                 <LogisticsCard title="Pending GRN" value="4" subtitle="Goods Received Notes" />
                 <LogisticsCard title="Supplier Lead Time" value="1.8d" subtitle="Avg Delivery" />
                 <LogisticsCard title="Inventory Turnover" value="12.4" subtitle="Monthly Ratio" />
              </div>
           </div>

           <Link href="/billing" className="block p-8 bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] space-y-4 hover:bg-emerald-600/20 transition-all group">
              <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Revenue Link</h4>
                 <ArrowUpRight size={14} className="text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 Verify pharmaceutical charge capture against settlement nodes.
              </p>
           </Link>

        </div>

      </div>

    </div>
  )
}

function LogisticsCard({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div className="p-5 bg-slate-950 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
       <p className="text-[9px] font-black uppercase text-slate-600 mb-2">{title}</p>
       <p className="text-3xl font-black italic tracking-tighter text-emerald-400 group-hover:scale-105 transition-transform origin-left">{value}</p>
       <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
  )
}
