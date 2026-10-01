'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, CalendarDays, Image as ImageIcon, Mail, Users, Send, MessageSquare, Building2 } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import { AdminCard, AdminLoading } from '../ui'

interface DashboardData {
  stats: Record<string, number>
  trend: { date: string; count: number }[]
  recent: {
    messages: any[]
    inquiries: any[]
  }
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/v1/admin/dashboard').then((r) => r.json()).then((j) => { if (j.success) setData(j.data) })
  }, [])

  if (!data) return <AdminLoading />

  const cards = [
    { label: 'News', value: data.stats.news, icon: Newspaper },
    { label: 'Events', value: data.stats.events, icon: CalendarDays },
    { label: 'Gallery Items', value: data.stats.gallery, icon: ImageIcon },
    { label: 'Inbox (new)', value: data.stats.inbox, icon: Mail },
    { label: 'Subscribers', value: data.stats.subscribers, icon: Send },
    { label: 'Inquiries', value: data.stats.inquiries, icon: MessageSquare },
    { label: 'Alumni Applications', value: data.stats.alumniApplications, icon: Users },
    { label: 'Branches', value: data.stats.branches, icon: Building2 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <AdminCard className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">{c.label}</div>
                  <div className="mt-2 font-display text-3xl font-extrabold text-[#FFD500]">{c.value}</div>
                </div>
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#FFD500]/15 text-[#FFD500]">
                  <c.icon className="h-5 w-5" />
                </div>
              </div>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AdminCard className="p-5">
          <div className="text-sm font-semibold mb-4">Inquiries — last 7 days</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.trend}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD500" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#1FA64D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0A1A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#FFD500" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="text-sm font-semibold mb-4">Content overview</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'News', value: data.stats.news },
              { name: 'Events', value: data.stats.events },
              { name: 'Gallery', value: data.stats.gallery },
              { name: 'Branches', value: data.stats.branches },
              { name: 'Team', value: data.stats.team },
            ]}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0A1A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} cursor={{ fill: 'rgba(255,213,0,0.1)' }} />
              <Bar dataKey="value" fill="#1FA64D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AdminCard className="p-5">
          <div className="text-sm font-semibold mb-4">Recent contact messages</div>
          <div className="space-y-3">
            {data.recent.messages.length === 0 && <div className="text-xs text-white/40">No messages yet.</div>}
            {data.recent.messages.slice(0, 5).map((m: any) => (
              <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                <div className="grid place-items-center h-8 w-8 rounded-full bg-[#FFD500]/15 text-[#FFD500] text-xs font-bold shrink-0">{m.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-white/60 truncate">{m.subject || m.message}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{new Date(m.createdAt).toLocaleString('en-GB')}</div>
                </div>
                {m.status === 'new' && <span className="px-2 py-0.5 rounded-full bg-[#FFD500]/15 text-[#FFE24D] text-[10px] font-bold">NEW</span>}
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-sm font-semibold mb-4">Recent inquiries</div>
          <div className="space-y-3">
            {data.recent.inquiries.length === 0 && <div className="text-xs text-white/40">No inquiries yet.</div>}
            {data.recent.inquiries.slice(0, 5).map((m: any) => (
              <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                <div className="grid place-items-center h-8 w-8 rounded-full bg-[#1FA64D]/15 text-[#1FA64D] text-xs font-bold shrink-0">{m.parentName.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.parentName} → {m.gradeLevel || 'N/A'}</div>
                  <div className="text-xs text-white/60 truncate">{m.campus || 'Any campus'}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{new Date(m.createdAt).toLocaleString('en-GB')}</div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  )
}
