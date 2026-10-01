'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Settings, Image as ImageIcon, Building2, Users, Newspaper, CalendarDays,
  GalleryVerticalEnd, GraduationCap, MessageSquare, Users2, Award, HelpCircle, FileText,
  ScrollText, User as UserIcon, History, LogOut, Menu, X, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import { AdminDashboard } from './modules/dashboard'
import { AdminHeroSlides, AdminBranches, AdminTeam, AdminNews, AdminEvents, AdminGallery, AdminAlumni, AdminTestimonials, AdminFaqs } from './modules/crud-modules'
import { AdminSettings, AdminTuition, AdminInbox, AdminLegal, AdminProfile, AdminUsers, AdminAuditLog } from './modules/settings-and-others'

type ModuleKey =
  | 'dashboard' | 'settings' | 'hero' | 'branches' | 'team' | 'news' | 'events'
  | 'gallery' | 'tuition' | 'alumni' | 'testimonials' | 'faqs' | 'inbox'
  | 'legal' | 'profile' | 'users' | 'audit-log'

const NAV: { key: ModuleKey; label: string; icon: any; superAdmin?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'hero', label: 'Hero Slides', icon: Sparkles },
  { key: 'branches', label: 'Branches', icon: Building2 },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'news', label: 'News', icon: Newspaper },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'gallery', label: 'Gallery', icon: GalleryVerticalEnd },
  { key: 'tuition', label: 'Tuition & Fees', icon: GraduationCap },
  { key: 'alumni', label: 'Alumni', icon: Users2 },
  { key: 'testimonials', label: 'Testimonials', icon: Award },
  { key: 'faqs', label: 'FAQs', icon: HelpCircle },
  { key: 'inbox', label: 'Inbox', icon: MessageSquare },
  { key: 'legal', label: 'Legal Pages', icon: ScrollText },
  { key: 'settings', label: 'Site Settings', icon: Settings },
  { key: 'users', label: 'Users & Roles', icon: UserIcon, superAdmin: true },
  { key: 'audit-log', label: 'Audit Log', icon: History, superAdmin: true },
  { key: 'profile', label: 'Profile', icon: UserIcon },
]

export function AdminShell({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<ModuleKey>('dashboard')
  const [user, setUser] = useState<{ name: string; email: string; role: string; avatar?: string | null } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetch('/api/v1/admin/me').then((r) => r.json()).then((j) => { if (j.success) setUser(j.data) })
  }, [])

  const logout = async () => {
    await fetch('/api/v1/admin/logout', { method: 'POST' })
    toast.success('Logged out')
    onClose()
  }

  const renderModule = () => {
    switch (active) {
      case 'dashboard': return <AdminDashboard />
      case 'settings': return <AdminSettings />
      case 'hero': return <AdminHeroSlides />
      case 'branches': return <AdminBranches />
      case 'team': return <AdminTeam />
      case 'news': return <AdminNews />
      case 'events': return <AdminEvents />
      case 'gallery': return <AdminGallery />
      case 'tuition': return <AdminTuition />
      case 'alumni': return <AdminAlumni />
      case 'testimonials': return <AdminTestimonials />
      case 'faqs': return <AdminFaqs />
      case 'inbox': return <AdminInbox />
      case 'legal': return <AdminLegal />
      case 'profile': return <AdminProfile user={user} />
      case 'users': return <AdminUsers currentUser={user} />
      case 'audit-log': return <AdminAuditLog />
      default: return null
    }
  }

  return (
    <div className="min-h-screen flex bg-[#06130B] text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        'fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0A1A0F] border-r border-white/10 flex flex-col transition-transform',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-sm.png" alt="Safari Admin" className="h-9 w-9 rounded-full" />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 no-scrollbar">
          {NAV.filter((n) => !n.superAdmin || user?.role === 'SUPER_ADMIN').map((n) => (
            <button
              key={n.key}
              onClick={() => { setActive(n.key); setSidebarOpen(false) }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                active === n.key ? 'bg-[#FFD500] text-[#06130B]' : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <n.icon className="h-4 w-4 shrink-0" />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-2 mb-2 px-2">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="grid place-items-center h-8 w-8 rounded-full bg-[#FFD500]/20 text-[#FFD500] text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{user.name}</div>
                <div className="text-[10px] text-white/50 truncate">{user.role}</div>
              </div>
            </div>
          )}
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-[#06130B]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden grid place-items-center h-9 w-9 rounded-lg hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg md:text-xl font-bold capitalize">
              {NAV.find((n) => n.key === active)?.label}
            </h1>
          </div>
          <button onClick={onClose} className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1">
            View site <X className="h-3 w-3" />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {renderModule()}
        </main>
      </div>
    </div>
  )
}
