'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Save, X, Upload, Search, Eye, EyeOff, Star, ArrowUp, ArrowDown } from 'lucide-react'
import {
  AdminCard, AdminButton, AdminInput, AdminTextarea, AdminField, AdminLabel, AdminEmpty, AdminLoading,
  adminFetch, adminJson,
} from '../ui'
import { useStore } from '@/lib/store'

// ============================================================
// Generic list view
// ============================================================
interface ListProps { onEdit: (item: any) => void; refreshKey: number; url: string; }

function useResourceList(url: string) {
  const [items, setItems] = useState<any[] | null>(null)
  useEffect(() => {
    adminFetch(url).then((d) => setItems(d || []))
  }, [url])
  return { items, setItems }
}

// ============================================================
// HERO SLIDES
// ============================================================
export function AdminHeroSlides() {
  const { items, setItems } = useResourceList('/api/v1/admin/hero-slides')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/hero-slides${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Slide updated' : 'Slide created')
      setEditing(null)
      adminFetch('/api/v1/admin/hero-slides').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this slide?')) return
    if (await adminFetch(`/api/v1/admin/hero-slides/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} slides</div>
        <AdminButton onClick={() => setEditing({ title: '', subtitle: '', mediaUrl: '', ctaLabel: '', ctaLink: '', overlay: 40, order: items.length, visible: true })}>
          <Plus className="h-4 w-4" /> New Slide
        </AdminButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((h) => (
          <AdminCard key={h.id} className="overflow-hidden">
            <div className="aspect-[16/9] relative bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.mediaUrl} alt={h.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs text-[#FFE24D] uppercase tracking-widest">Order {h.order} {!h.visible && '• Hidden'}</div>
                <h3 className="font-display text-lg font-bold mt-1">{h.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2">{h.subtitle}</p>
              </div>
            </div>
            <div className="p-3 flex gap-2 border-t border-white/10">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing(h)}><Pencil className="h-3.5 w-3.5" /> Edit</AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(h.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <HeroSlideEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function HeroSlideEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(data)
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit slide' : 'New slide'}>
      <div className="space-y-3">
        <AdminField label="Title"><AdminInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></AdminField>
        <AdminField label="Subtitle"><AdminTextarea rows={2} value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} /></AdminField>
        <AdminField label="Image URL"><AdminInput value={f.mediaUrl} onChange={(e) => setF({ ...f, mediaUrl: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, mediaUrl: url })} />
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="CTA Label"><AdminInput value={f.ctaLabel || ''} onChange={(e) => setF({ ...f, ctaLabel: e.target.value })} /></AdminField>
          <AdminField label="CTA Link (#anchor or route)"><AdminInput value={f.ctaLink || ''} onChange={(e) => setF({ ...f, ctaLink: e.target.value })} /></AdminField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <AdminField label="Overlay %"><AdminInput type="number" value={f.overlay} onChange={(e) => setF({ ...f, overlay: Number(e.target.value) })} /></AdminField>
          <AdminField label="Order"><AdminInput type="number" value={f.order} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></AdminField>
          <AdminField label="Visible"><label className="flex items-center gap-2 mt-1"><input type="checkbox" checked={f.visible} onChange={(e) => setF({ ...f, visible: e.target.checked })} /> Visible</label></AdminField>
        </div>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// BRANCHES
// ============================================================
export function AdminBranches() {
  const { items, setItems } = useResourceList('/api/v1/admin/branches')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const payload = { ...data, facilities: typeof data.facilities === 'string' ? data.facilities.split(',').map((s: string) => s.trim()).filter(Boolean) : data.facilities }
    const r = await adminFetch(`/api/v1/admin/branches${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', payload))
    if (r !== null) {
      toast.success(isEdit ? 'Branch updated' : 'Branch created')
      setEditing(null)
      adminFetch('/api/v1/admin/branches').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this branch?')) return
    if (await adminFetch(`/api/v1/admin/branches/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} branches</div>
        <AdminButton onClick={() => setEditing({ name: '', slug: '', description: '', visible: true, featured: false, facilities: [], order: items.length })}><Plus className="h-4 w-4" /> New Branch</AdminButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b: any) => (
          <AdminCard key={b.id} className="overflow-hidden">
            <div className="aspect-[16/10] bg-black/40 relative">
              {b.coverImage && <img src={b.coverImage} alt={b.name} className="h-full w-full object-cover" />}
              <div className="absolute top-2 right-2 flex gap-1">
                {b.featured && <span className="px-2 py-0.5 rounded-full bg-[#FFD500] text-[#06130B] text-[10px] font-bold">FEATURED</span>}
                {!b.visible && <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-bold">HIDDEN</span>}
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-[#FFE24D] uppercase tracking-widest">{b.tagline || 'Campus'}</div>
              <h3 className="font-display text-lg font-bold mt-0.5">{b.name}</h3>
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{b.description}</p>
              <div className="flex gap-2 mt-3">
                <AdminButton size="sm" variant="ghost" onClick={() => setEditing(b)}><Pencil className="h-3.5 w-3.5" /> Edit</AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => del(b.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <BranchEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function BranchEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState({ ...data, facilities: Array.isArray(data.facilities) ? data.facilities.join(', ') : data.facilities || '' })
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit branch' : 'New branch'} wide>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Name"><AdminInput value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></AdminField>
          <AdminField label="Slug (leave blank for auto)"><AdminInput value={f.slug || ''} onChange={(e) => setF({ ...f, slug: e.target.value })} /></AdminField>
        </div>
        <AdminField label="Tagline"><AdminInput value={f.tagline || ''} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></AdminField>
        <AdminField label="Description"><AdminTextarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Principal"><AdminInput value={f.principal || ''} onChange={(e) => setF({ ...f, principal: e.target.value })} /></AdminField>
          <AdminField label="Grades"><AdminInput value={f.grades || ''} onChange={(e) => setF({ ...f, grades: e.target.value })} /></AdminField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Phone"><AdminInput value={f.phone || ''} onChange={(e) => setF({ ...f, phone: e.target.value })} /></AdminField>
          <AdminField label="Email"><AdminInput value={f.email || ''} onChange={(e) => setF({ ...f, email: e.target.value })} /></AdminField>
        </div>
        <AdminField label="Address"><AdminInput value={f.address || ''} onChange={(e) => setF({ ...f, address: e.target.value })} /></AdminField>
        <AdminField label="Cover Image URL"><AdminInput value={f.coverImage || ''} onChange={(e) => setF({ ...f, coverImage: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, coverImage: url })} />
        <AdminField label="Facilities (comma-separated)"><AdminInput value={f.facilities} onChange={(e) => setF({ ...f, facilities: e.target.value })} /></AdminField>
        <AdminField label="Video Tour URL (YouTube embed)"><AdminInput value={f.videoTourUrl || ''} onChange={(e) => setF({ ...f, videoTourUrl: e.target.value })} /></AdminField>
        <AdminField label="Map Embed URL"><AdminInput value={f.mapEmbedUrl || ''} onChange={(e) => setF({ ...f, mapEmbedUrl: e.target.value })} /></AdminField>
        <div className="grid grid-cols-3 gap-3">
          <AdminField label="Order"><AdminInput type="number" value={f.order || 0} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></AdminField>
          <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.visible ?? true} onChange={(e) => setF({ ...f, visible: e.target.checked })} /> Visible</label>
          <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        </div>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// TEAM
// ============================================================
export function AdminTeam() {
  const { items, setItems } = useResourceList('/api/v1/admin/team')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/team${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Member updated' : 'Member created')
      setEditing(null)
      adminFetch('/api/v1/admin/team').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    if (await adminFetch(`/api/v1/admin/team/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} members</div>
        <AdminButton onClick={() => setEditing({ name: '', role: '', type: 'LEADERSHIP', bio: '', visible: true, featured: false, order: items.length })}><Plus className="h-4 w-4" /> New Member</AdminButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((t: any) => (
          <AdminCard key={t.id} className="p-4">
            {t.photo && <img src={t.photo} alt={t.name} className="h-20 w-20 rounded-full object-cover mx-auto mb-3" />}
            <div className="text-center">
              <div className="font-semibold text-sm">{t.name}</div>
              <div className="text-xs text-[#FFD500]">{t.role}</div>
              <div className="text-[10px] text-white/50 mt-0.5">{t.type} • {t.department}</div>
            </div>
            <div className="flex gap-1 mt-3 justify-center">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing(t)}><Pencil className="h-3.5 w-3.5" /></AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(t.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <TeamEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function TeamEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(data)
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit member' : 'New member'} wide>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Name"><AdminInput value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></AdminField>
          <AdminField label="Role"><AdminInput value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></AdminField>
          <AdminField label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
            <option value="LEADERSHIP">Leadership</option><option value="STAFF">Staff</option>
          </select></AdminField>
          <AdminField label="Department"><AdminInput value={f.department || ''} onChange={(e) => setF({ ...f, department: e.target.value })} /></AdminField>
        </div>
        <AdminField label="Photo URL"><AdminInput value={f.photo || ''} onChange={(e) => setF({ ...f, photo: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, photo: url })} />
        <AdminField label="Short Bio"><AdminTextarea rows={2} value={f.bio || ''} onChange={(e) => setF({ ...f, bio: e.target.value })} /></AdminField>
        <AdminField label="Full Bio (optional)"><AdminTextarea rows={4} value={f.fullBio || ''} onChange={(e) => setF({ ...f, fullBio: e.target.value })} /></AdminField>
        <AdminField label="Quote"><AdminInput value={f.quote || ''} onChange={(e) => setF({ ...f, quote: e.target.value })} /></AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Email"><AdminInput value={f.email || ''} onChange={(e) => setF({ ...f, email: e.target.value })} /></AdminField>
          <AdminField label="Phone"><AdminInput value={f.phone || ''} onChange={(e) => setF({ ...f, phone: e.target.value })} /></AdminField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <AdminField label="Order"><AdminInput type="number" value={f.order || 0} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></AdminField>
          <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.visible ?? true} onChange={(e) => setF({ ...f, visible: e.target.checked })} /> Visible</label>
          <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        </div>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// NEWS
// ============================================================
export function AdminNews() {
  const { items, setItems } = useResourceList('/api/v1/admin/news')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const payload = { ...data, tags: typeof data.tags === 'string' ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : data.tags }
    const r = await adminFetch(`/api/v1/admin/news${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', payload))
    if (r !== null) {
      toast.success(isEdit ? 'News updated' : 'News created')
      setEditing(null)
      adminFetch('/api/v1/admin/news').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this news post?')) return
    if (await adminFetch(`/api/v1/admin/news/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} posts</div>
        <AdminButton onClick={() => setEditing({ title: '', body: '', excerpt: '', category: 'Announcements', status: 'draft', featured: false, coverImage: '', tags: '' })}><Plus className="h-4 w-4" /> New Post</AdminButton>
      </div>
      <div className="space-y-2">
        {items.map((n: any) => (
          <AdminCard key={n.id} className="p-4 flex items-center gap-4">
            {n.coverImage && <img src={n.coverImage} alt={n.title} className="h-14 w-14 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{n.title}</div>
              <div className="text-xs text-white/50">{n.category} • {n.status} • {new Date(n.publishedAt).toLocaleDateString('en-GB')}</div>
            </div>
            {n.featured && <span className="px-2 py-0.5 rounded-full bg-[#FFD500]/15 text-[#FFE24D] text-[10px] font-bold">FEATURED</span>}
            <div className="flex gap-1">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing(n)}><Pencil className="h-3.5 w-3.5" /></AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(n.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <NewsEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function NewsEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '' })
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit post' : 'New post'} wide>
      <div className="space-y-3">
        <AdminField label="Title"><AdminInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></AdminField>
        <AdminField label="Excerpt"><AdminTextarea rows={2} value={f.excerpt || ''} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></AdminField>
        <AdminField label="Body (HTML)"><AdminTextarea rows={8} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} className="font-mono text-xs" /></AdminField>
        <div className="grid grid-cols-3 gap-3">
          <AdminField label="Category"><AdminInput value={f.category || ''} onChange={(e) => setF({ ...f, category: e.target.value })} /></AdminField>
          <AdminField label="Status"><select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
            <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
          </select></AdminField>
          <AdminField label="Author"><AdminInput value={f.author || ''} onChange={(e) => setF({ ...f, author: e.target.value })} /></AdminField>
        </div>
        <AdminField label="Cover Image URL"><AdminInput value={f.coverImage || ''} onChange={(e) => setF({ ...f, coverImage: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, coverImage: url })} />
        <AdminField label="Tags (comma-separated)"><AdminInput value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></AdminField>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// EVENTS
// ============================================================
export function AdminEvents() {
  const { items, setItems } = useResourceList('/api/v1/admin/events')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/events${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Event updated' : 'Event created')
      setEditing(null)
      adminFetch('/api/v1/admin/events').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this event?')) return
    if (await adminFetch(`/api/v1/admin/events/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} events</div>
        <AdminButton onClick={() => setEditing({ title: '', body: '', excerpt: '', startDateTime: new Date().toISOString().slice(0, 16), venue: '', category: 'General', status: 'upcoming', featured: false, registrationOpen: false, coverImage: '' })}><Plus className="h-4 w-4" /> New Event</AdminButton>
      </div>
      <div className="space-y-2">
        {items.map((e: any) => (
          <AdminCard key={e.id} className="p-4 flex items-center gap-4">
            {e.coverImage && <img src={e.coverImage} alt={e.title} className="h-14 w-14 rounded-lg object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{e.title}</div>
              <div className="text-xs text-white/50">{e.category} • {new Date(e.startDateTime).toLocaleDateString('en-GB')} • {e.venue}</div>
            </div>
            {e.featured && <span className="px-2 py-0.5 rounded-full bg-[#FFD500]/15 text-[#FFE24D] text-[10px] font-bold">FEATURED</span>}
            <div className="flex gap-1">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing({ ...e, startDateTime: new Date(e.startDateTime).toISOString().slice(0, 16) })}><Pencil className="h-3.5 w-3.5" /></AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(e.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <EventEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function EventEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(data)
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit event' : 'New event'} wide>
      <div className="space-y-3">
        <AdminField label="Title"><AdminInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></AdminField>
        <AdminField label="Excerpt"><AdminTextarea rows={2} value={f.excerpt || ''} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></AdminField>
        <AdminField label="Body (HTML)"><AdminTextarea rows={6} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} className="font-mono text-xs" /></AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Start date/time"><AdminInput type="datetime-local" value={f.startDateTime} onChange={(e) => setF({ ...f, startDateTime: e.target.value })} /></AdminField>
          <AdminField label="End date/time (optional)"><AdminInput type="datetime-local" value={f.endDateTime ? new Date(f.endDateTime).toISOString().slice(0, 16) : ''} onChange={(e) => setF({ ...f, endDateTime: e.target.value })} /></AdminField>
          <AdminField label="Venue"><AdminInput value={f.venue || ''} onChange={(e) => setF({ ...f, venue: e.target.value })} /></AdminField>
          <AdminField label="Category"><AdminInput value={f.category || ''} onChange={(e) => setF({ ...f, category: e.target.value })} /></AdminField>
        </div>
        <AdminField label="Cover Image URL"><AdminInput value={f.coverImage || ''} onChange={(e) => setF({ ...f, coverImage: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, coverImage: url })} />
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.registrationOpen ?? false} onChange={(e) => setF({ ...f, registrationOpen: e.target.checked })} /> Registration open</label>
        </div>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// GALLERY
// ============================================================
export function AdminGallery() {
  const { items, setItems } = useResourceList('/api/v1/admin/gallery')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/gallery${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Updated' : 'Created')
      setEditing(null)
      adminFetch('/api/v1/admin/gallery').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this item?')) return
    if (await adminFetch(`/api/v1/admin/gallery/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} items</div>
        <AdminButton onClick={() => setEditing({ title: '', url: '', category: 'Campus', type: 'image', visible: true, featured: false, order: items.length })}><Plus className="h-4 w-4" /> New Item</AdminButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((g: any) => (
          <AdminCard key={g.id} className="overflow-hidden group relative">
            <img src={g.url} alt={g.title || ''} className="aspect-square w-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setEditing(g)} className="grid place-items-center h-7 w-7 rounded-full bg-black/60 hover:bg-[#FFD500] hover:text-[#06130B] transition"><Pencil className="h-3 w-3" /></button>
              <button onClick={() => del(g.id)} className="grid place-items-center h-7 w-7 rounded-full bg-black/60 hover:bg-red-500 transition"><Trash2 className="h-3 w-3" /></button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-[10px] text-[#FFE24D] uppercase">{g.category}</div>
              <div className="text-xs truncate">{g.title}</div>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && <GalleryEditor data={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  )
}

function GalleryEditor({ data, onClose, onSave }: { data: any; onClose: () => void; onSave: (d: any) => void }) {
  const [f, setF] = useState(data)
  return (
    <Modal onClose={onClose} title={data.id ? 'Edit item' : 'New item'}>
      <div className="space-y-3">
        <AdminField label="Title"><AdminInput value={f.title || ''} onChange={(e) => setF({ ...f, title: e.target.value })} /></AdminField>
        <AdminField label="Caption"><AdminInput value={f.caption || ''} onChange={(e) => setF({ ...f, caption: e.target.value })} /></AdminField>
        <AdminField label="Image URL"><AdminInput value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} /></AdminField>
        <ImageUpload onUploaded={(url) => setF({ ...f, url })} />
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="Category"><select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
            {['Sports', 'Arts', 'Trips', 'Ceremonies', 'Clubs', 'Campus'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select></AdminField>
          <AdminField label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white">
            <option value="image">Image</option><option value="video">Video</option>
          </select></AdminField>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
        <div className="flex gap-2 pt-2">
          <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
          <AdminButton variant="ghost" onClick={onClose}>Cancel</AdminButton>
        </div>
      </div>
    </Modal>
  )
}

// ============================================================
// ALUMNI
// ============================================================
export function AdminAlumni() {
  const { items, setItems } = useResourceList('/api/v1/admin/alumni')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/alumni${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Updated' : 'Created')
      setEditing(null)
      adminFetch('/api/v1/admin/alumni').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete this alumni?')) return
    if (await adminFetch(`/api/v1/admin/alumni/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} alumni</div>
        <AdminButton onClick={() => setEditing({ name: '', graduationYear: '', currentRole: '', company: '', quote: '', photo: '', sector: '', visible: true, featured: false, order: items.length })}><Plus className="h-4 w-4" /> New Alumni</AdminButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((a: any) => (
          <AdminCard key={a.id} className="p-4 text-center">
            {a.photo && <img src={a.photo} alt={a.name} className="h-20 w-20 rounded-full object-cover mx-auto mb-2" />}
            <div className="font-semibold text-sm">{a.name}</div>
            <div className="text-xs text-[#FFD500]">Class of {a.graduationYear}</div>
            <div className="text-[10px] text-white/50">{a.currentRole}</div>
            <div className="flex gap-1 mt-2 justify-center">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing(a)}><Pencil className="h-3.5 w-3.5" /></AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(a.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Edit alumni' : 'New alumni'} wide>
          <AlumniForm data={editing} onCancel={() => setEditing(null)} onSave={save} />
        </Modal>
      )}
    </div>
  )
}

function AlumniForm({ data, onCancel, onSave }: any) {
  const [f, setF] = useState(data)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Name"><AdminInput value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></AdminField>
        <AdminField label="Graduation Year"><AdminInput value={f.graduationYear} onChange={(e) => setF({ ...f, graduationYear: e.target.value })} /></AdminField>
        <AdminField label="Current Role"><AdminInput value={f.currentRole || ''} onChange={(e) => setF({ ...f, currentRole: e.target.value })} /></AdminField>
        <AdminField label="Company"><AdminInput value={f.company || ''} onChange={(e) => setF({ ...f, company: e.target.value })} /></AdminField>
        <AdminField label="Sector"><AdminInput value={f.sector || ''} onChange={(e) => setF({ ...f, sector: e.target.value })} /></AdminField>
        <AdminField label="LinkedIn"><AdminInput value={f.linkedin || ''} onChange={(e) => setF({ ...f, linkedin: e.target.value })} /></AdminField>
      </div>
      <AdminField label="Quote"><AdminTextarea rows={2} value={f.quote || ''} onChange={(e) => setF({ ...f, quote: e.target.value })} /></AdminField>
      <AdminField label="Photo URL"><AdminInput value={f.photo || ''} onChange={(e) => setF({ ...f, photo: e.target.value })} /></AdminField>
      <ImageUpload onUploaded={(url) => setF({ ...f, photo: url })} />
      <div className="grid grid-cols-3 gap-3">
        <AdminField label="Order"><AdminInput type="number" value={f.order || 0} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></AdminField>
        <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.visible ?? true} onChange={(e) => setF({ ...f, visible: e.target.checked })} /> Visible</label>
        <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={f.featured ?? false} onChange={(e) => setF({ ...f, featured: e.target.checked })} /> Featured</label>
      </div>
      <div className="flex gap-2 pt-2">
        <AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton>
        <AdminButton variant="ghost" onClick={onCancel}>Cancel</AdminButton>
      </div>
    </div>
  )
}

// ============================================================
// TESTIMONIALS
// ============================================================
export function AdminTestimonials() {
  const { items, setItems } = useResourceList('/api/v1/admin/testimonials')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/testimonials${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Updated' : 'Created')
      setEditing(null)
      adminFetch('/api/v1/admin/testimonials').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    if (await adminFetch(`/api/v1/admin/testimonials/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} testimonials</div>
        <AdminButton onClick={() => setEditing({ name: '', role: '', quote: '', rating: 5, avatar: '', visible: true, order: items.length })}><Plus className="h-4 w-4" /> New</AdminButton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((t: any) => (
          <AdminCard key={t.id} className="p-4">
            <p className="text-sm text-white/80 italic mb-3">"{t.quote}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {t.avatar && <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />}
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <AdminButton size="sm" variant="ghost" onClick={() => setEditing(t)}><Pencil className="h-3.5 w-3.5" /></AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => del(t.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Edit' : 'New'}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Name"><AdminInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></AdminField>
              <AdminField label="Role"><AdminInput value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></AdminField>
            </div>
            <AdminField label="Quote"><AdminTextarea rows={3} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></AdminField>
            <AdminField label="Avatar URL"><AdminInput value={editing.avatar || ''} onChange={(e) => setEditing({ ...editing, avatar: e.target.value })} /></AdminField>
            <ImageUpload onUploaded={(url) => setEditing({ ...editing, avatar: url })} />
            <div className="grid grid-cols-3 gap-3">
              <AdminField label="Rating"><AdminInput type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></AdminField>
              <AdminField label="Order"><AdminInput type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></AdminField>
              <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} /> Visible</label>
            </div>
            <div className="flex gap-2 pt-2">
              <AdminButton onClick={() => save(editing)}><Save className="h-4 w-4" /> Save</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================================
// FAQS
// ============================================================
export function AdminFaqs() {
  const { items, setItems } = useResourceList('/api/v1/admin/faqs')
  const [editing, setEditing] = useState<any | null>(null)

  const save = async (data: any) => {
    const isEdit = !!data.id
    const r = await adminFetch(`/api/v1/admin/faqs${isEdit ? `/${data.id}` : ''}`, adminJson(isEdit ? 'PUT' : 'POST', data))
    if (r !== null) {
      toast.success(isEdit ? 'Updated' : 'Created')
      setEditing(null)
      adminFetch('/api/v1/admin/faqs').then((d) => setItems(d || []))
      useStore.getState().refresh()
    }
  }
  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    if (await adminFetch(`/api/v1/admin/faqs/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted')
      setItems((items || []).filter((i) => i.id !== id))
      useStore.getState().refresh()
    }
  }

  if (!items) return <AdminLoading />
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{items.length} FAQs</div>
        <AdminButton onClick={() => setEditing({ question: '', answer: '', category: 'General', visible: true, order: items.length })}><Plus className="h-4 w-4" /> New FAQ</AdminButton>
      </div>
      <div className="space-y-2">
        {items.map((f: any) => (
          <AdminCard key={f.id} className="p-4 flex items-start gap-3">
            <div className="flex-1">
              <div className="text-xs text-[#FFD500]">{f.category}</div>
              <div className="font-semibold text-sm">{f.question}</div>
              <div className="text-xs text-white/60 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: f.answer }} />
            </div>
            <div className="flex gap-1">
              <AdminButton size="sm" variant="ghost" onClick={() => setEditing(f)}><Pencil className="h-3.5 w-3.5" /></AdminButton>
              <AdminButton size="sm" variant="danger" onClick={() => del(f.id)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? 'Edit FAQ' : 'New FAQ'}>
          <div className="space-y-3">
            <AdminField label="Question"><AdminInput value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></AdminField>
            <AdminField label="Answer"><AdminTextarea rows={4} value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} /></AdminField>
            <div className="grid grid-cols-3 gap-3">
              <AdminField label="Category"><AdminInput value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></AdminField>
              <AdminField label="Order"><AdminInput type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></AdminField>
              <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} /> Visible</label>
            </div>
            <div className="flex gap-2 pt-2">
              <AdminButton onClick={() => save(editing)}><Save className="h-4 w-4" /> Save</AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AdminButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================================
// Shared Modal + Image upload
// ============================================================
export function Modal({ children, onClose, title, wide }: { children: React.ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[210] bg-black/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} bg-[#0A1A0F] rounded-2xl border border-white/10 my-8`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="grid place-items-center h-8 w-8 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const onFile = async (file: File) => {
    setUploading(true)
    setErrorMsg('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch('/api/v1/admin/upload', { method: 'POST', body: fd })
      // Handle non-OK responses — the server might return JSON error or HTML
      if (!r.ok) {
        let detail = `HTTP ${r.status}`
        try {
          const j = await r.json()
          detail = j.error || j.message || detail
        } catch {
          // response wasn't JSON (likely HTML 404/500 page)
          const text = await r.text().catch(() => '')
          if (text.includes('404') || r.status === 404) detail = 'Upload endpoint not found (404). Please redeploy.'
          else if (text) detail = text.substring(0, 200)
        }
        setErrorMsg(detail)
        toast.error(detail)
        return
      }
      const j = await r.json()
      if (j.success && j.data?.url) {
        toast.success('Image uploaded')
        onUploaded(j.data.url)
      } else {
        const msg = j.error || 'Upload failed — unexpected response'
        setErrorMsg(msg)
        toast.error(msg)
      }
    } catch (e: any) {
      const msg = e?.message || 'Network error — could not reach the server.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }
  return (
    <label className="block">
      <div className="text-xs font-semibold text-white/70 mb-1.5">Or upload an image</div>
      <input type="file" accept="image/*,video/mp4,application/pdf" disabled={uploading} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="block w-full text-xs text-white/70 file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-[#FFD500] file:text-[#06130B] file:font-semibold file:cursor-pointer disabled:opacity-50" />
      {uploading && <div className="text-xs text-white/50 mt-1">Uploading…</div>}
      {errorMsg && (
        <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
          {errorMsg}
        </div>
      )}
    </label>
  )
}
