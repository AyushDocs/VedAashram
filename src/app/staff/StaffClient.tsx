'use client'

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, Shield, Search } from 'lucide-react'
import { getStaff, addStaff, UserRole } from '../actions'

interface StaffMember {
  id: string
  name: string
  role: string
  specialty: string | null
  email: string
  phone: string | null
}

export default function StaffClient() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'NURSE' as UserRole, specialty: '' })

  const fetchStaff = async () => {
    try {
      const data = await getStaff()
      setStaff(data as StaffMember[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    await addStaff(newStaff)
    setShowAddModal(false)
    setNewStaff({ name: '', email: '', role: 'NURSE' as UserRole, specialty: '' })
    fetchStaff()
  }

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Staff Registry</h1>
          <p className="text-slate-500">Manage hospital personnel and access roles</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <UserPlus size={20} />
          Add Medical Staff
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 flex items-center gap-2 text-slate-400 text-sm">
          <Shield size={16} />
          Total Staff: {staff.length}
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Specialty</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredStaff.map((person) => (
              <tr key={person.id} className="group hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform">
                      {person.name[0]}
                    </div>
                    <span className="font-semibold">{person.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    person.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' :
                    person.role === 'DOCTOR' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {person.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-400 text-sm">{person.specialty || 'General'}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-200">{person.email}</span>
                    <span className="text-[10px] text-slate-500">{person.phone || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-slate-400">Active</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && !loading && (
          <div className="py-20 text-center space-y-3">
            <Users size={48} className="mx-auto text-slate-800" />
            <p className="text-slate-500 italic">No staff members match your search.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">Add Staff Member</h3>
              <p className="text-slate-500 text-sm">Register a new medical professional.</p>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  placeholder="Dr. Ved Aashram"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
                  <select 
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none appearance-none"
                  >
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Specialty</label>
                  <input 
                    type="text" 
                    value={newStaff.specialty}
                    onChange={e => setNewStaff({...newStaff, specialty: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    placeholder="Cardiology"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  placeholder="ved@vedaashram.com"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-800 rounded-xl text-slate-400 hover:bg-slate-800 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
