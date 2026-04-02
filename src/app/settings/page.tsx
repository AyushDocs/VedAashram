'use client'

import React from 'react'
import { User, Bell, Lock, Globe, Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <p className="text-slate-500">Global preferences and security controls</p>
      </div>

      <div className="space-y-6">
        <SettingItem icon={<User size={24} />} name="User Profile" description="Change your personal details and avatar." />
        <SettingItem icon={<Bell size={24} />} name="Notifications" description="Manage email alerts and mission critical updates." />
        <SettingItem icon={<Lock size={24} />} name="Security & Roles" description="Admin-only RBAC controls and key rotations." />
        <SettingItem icon={<Globe size={24} />} name="Regional" description="Timezone, language, and clinical reporting standards." />
      </div>

      <div className="pt-8 border-t border-slate-800 flex justify-end">
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
          <Save size={18} />
          Save Global Config
        </button>
      </div>
    </div>
  )
}

function SettingItem({ icon, name, description }: { icon: React.ReactNode, name: string, description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 group hover:bg-slate-900 transition-colors">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 text-blue-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-200">{name}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
        Configure
      </button>
    </div>
  )
}
