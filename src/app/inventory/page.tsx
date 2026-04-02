'use client'

import React from 'react'
import { Package, Truck, Boxes, AlertTriangle, ArrowUpRight } from 'lucide-react'

export default function InventoryPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Inventory & Supplies</h1>
        <p className="text-slate-500">Track medical supplies, equipment and procurement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl w-fit"><Packages size={24} /></div>
          <div>
            <p className="text-2xl font-bold">1,240</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Total Items</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl w-fit"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Low Stock Alerts</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-2xl w-fit"><Truck size={24} /></div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Pending Shipments</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <Boxes size={40} />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold">Advanced Inventory Control</h2>
          <p className="text-slate-500">
            This module is being integrated with your **Ordex CRM** to provide automated procurement and predictive restocking based on clinical usage.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all font-semibold">
          Preview Ordex Integration <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  )
}

function Packages({ size }: { size: number }) {
  return <Package size={size} />
}
