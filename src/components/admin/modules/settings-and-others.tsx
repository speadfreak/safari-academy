'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Save, Plus, Trash2, Download, Search, Archive, Star, Mail, MessageSquare, Send, Users } from 'lucide-react'
import {
  AdminCard, AdminButton, AdminInput, AdminTextarea, AdminField, AdminLoading, adminFetch, adminJson,
} from '../ui'

// ============================================================
// SETTINGS
// ============================================================
export function AdminSettings() {
  const [groups, setGroups] = useState<Record<string, Record<string, string>> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminFetch('/api/v1/admin/settings').then((d) => setGroups(d as any))
  }, [])

  const update = (group: string, key: string, value: string) => {
    setGroups((g) => g ? { ...g, [group]: { ...g[group], [key]: value } } : g)
  }

  const save = async () => {
    if (!groups) return
    setSaving(true)
    const flat: Record<string, string> = {}
    for (const g of Object.values(groups)) for (const [k, v] of Object.entries(g)) flat[k] = v
    const r = await adminFetch('/api/v1/admin/settings', adminJson('PUT', flat))
    if (r !== null) {
      toast.success('Settings saved')
      // Trigger a site refresh.
      fetch('/api/v1/public/bootstrap').then(() => window.location.reload())
    }
    setSaving(false)
  }

  if (!groups) return <AdminLoading />

  const sections = [
    { key: 'branding', label: 'Branding', fields: [['siteName', 'Site Name'], ['tagline', 'Tagline'], ['since', 'Since'], ['logoLight', 'Logo (light)'], ['logoDark', 'Logo (dark)'], ['favicon', 'Favicon'], ['primaryColor', 'Primary color'], ['secondaryColor', 'Secondary color'], ['accentColor', 'Accent color']] },
    { key: 'contact', label: 'Contact & Map', fields: [['address', 'Address'], ['phone', 'Phone'], ['phone2', 'Phone 2'], ['email', 'Email'], ['emailAdmissions', 'Admissions email'], ['workingHours', 'Working hours'], ['whatsapp', 'WhatsApp number'], ['mapEmbedUrl', 'Map embed URL (Google/OSM)'], ['mapDirectionsUrl', 'Directions URL']] },
    { key: 'footer', label: 'Footer', fields: [['footerText', 'Footer text'], ['copyrightText', 'Copyright text'], ['creditText', 'Credit text'], ['creditLink', 'Credit link']] },
    { key: 'seo', label: 'SEO', fields: [['seoTitleTemplate', 'Title template'], ['seoDescription', 'Meta description'], ['ogImage', 'OG image URL']] },
    { key: 'preloader', label: 'Preloader', fields: [['preloaderEnabled', 'Enabled (true/false)'], ['preloaderTagline', 'Tagline']] },
    { key: 'admissions', label: 'Admissions', fields: [['admissionsOpen', 'Open (true/false)'], ['admissionsDeadline', 'Deadline (YYYY-MM-DD)']] },
    { key: 'cookies', label: 'Cookies', fields: [['cookieText', 'Cookie banner text']] },
    { key: 'social', label: 'Social links', fields: [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['twitter', 'Twitter/X'], ['telegram', 'Telegram'], ['youtube', 'YouTube']] },
  ]

  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <AdminCard key={s.key} className="p-5">
          <div className="text-sm font-semibold mb-4 text-[#FFD500]">{s.label}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {s.fields.map(([k, label]) => (
              <AdminField key={k} label={label}>
                <AdminInput value={groups[s.key]?.[k] || ''} onChange={(e) => update(s.key, k, e.target.value)} />
              </AdminField>
            ))}
          </div>
        </AdminCard>
      ))}
      <div className="sticky bottom-4 flex justify-end">
        <AdminButton onClick={save} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save all settings'}</AdminButton>
      </div>
    </div>
  )
}

// ============================================================
// TUITION
// ============================================================
export function AdminTuition() {
  const [tables, setTables] = useState<any[] | null>(null)

  const refresh = () => adminFetch('/api/v1/admin/fee-tables').then((d) => setTables(d || []))
  useEffect(() => { refresh() }, [])

  const createTable = async () => {
    const r = await adminFetch('/api/v1/admin/fee-tables', adminJson('POST', {
      title: 'New Fee Table', academicYear: '2026/2027', currency: 'ETB', published: false, order: (tables?.length || 0),
      columns: [{ label: 'Tuition' }, { label: 'Registration' }], rows: [{ label: 'KG', cells: ['0', '0'] }],
    }))
    if (r !== null) { toast.success('Created'); refresh() }
  }

  const updateTable = async (t: any) => {
    const r = await adminFetch(`/api/v1/admin/fee-tables/${t.id}`, adminJson('PUT', t))
    if (r !== null) { toast.success('Saved'); refresh() }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this fee table?')) return
    if (await adminFetch(`/api/v1/admin/fee-tables/${id}`, { method: 'DELETE' }) !== null) {
      toast.success('Deleted'); refresh()
    }
  }

  if (!tables) return <AdminLoading />

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-white/60">{tables.length} tables</div>
        <AdminButton onClick={createTable}><Plus className="h-4 w-4" /> New Fee Table</AdminButton>
      </div>
      {tables.map((t) => (
        <FeeTableEditor key={t.id} table={t} onSave={updateTable} onDelete={() => del(t.id)} />
      ))}
    </div>
  )
}

function FeeTableEditor({ table, onSave, onDelete }: { table: any; onSave: (t: any) => void; onDelete: () => void }) {
  const [t, setT] = useState(table)
  const setField = (k: string, v: any) => setT({ ...t, [k]: v })
  const setCol = (i: number, label: string) => {
    const cols = [...t.columns]; cols[i] = { ...cols[i], label }; setField('columns', cols)
  }
  const setRow = (i: number, key: string, v: any) => {
    const rows = [...t.rows]
    rows[i] = { ...rows[i], [key]: v }
    setField('rows', rows)
  }
  const setCell = (ri: number, ci: number, v: string) => {
    const rows = [...t.rows]
    const cells = [...(rows[ri].cells || [])]
    cells[ci] = v
    rows[ri] = { ...rows[ri], cells }
    setField('rows', rows)
  }
  const addCol = () => setField('columns', [...t.columns, { label: 'New' }])
  const addRow = () => setField('rows', [...t.rows, { label: 'New', cells: t.columns.map(() => '0'), highlight: false }])
  const delCol = (i: number) => setField('columns', t.columns.filter((_: any, k: number) => k !== i))
  const delRow = (i: number) => setField('rows', t.rows.filter((_: any, k: number) => k !== i))

  return (
    <AdminCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <input value={t.title} onChange={(e) => setField('title', e.target.value)} className="font-display text-lg font-bold bg-transparent border-0 outline-none flex-1" />
        <div className="flex gap-2">
          <AdminButton size="sm" onClick={() => onSave(t)}><Save className="h-3.5 w-3.5" /> Save</AdminButton>
          <AdminButton size="sm" variant="danger" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></AdminButton>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <AdminField label="Academic Year"><AdminInput value={t.academicYear} onChange={(e) => setField('academicYear', e.target.value)} /></AdminField>
        <AdminField label="Currency"><AdminInput value={t.currency} onChange={(e) => setField('currency', e.target.value)} /></AdminField>
        <AdminField label="PDF URL"><AdminInput value={t.pdfUrl || ''} onChange={(e) => setField('pdfUrl', e.target.value)} /></AdminField>
        <label className="flex items-center gap-2 mt-7"><input type="checkbox" checked={t.published} onChange={(e) => setField('published', e.target.checked)} /> Published</label>
      </div>
      <AdminField label="Note"><AdminTextarea rows={2} value={t.note || ''} onChange={(e) => setField('note', e.target.value)} /></AdminField>

      {/* Spreadsheet-like table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 font-semibold">Label</th>
              {t.columns.map((c: any, i: number) => (
                <th key={c.id || i} className="p-2">
                  <div className="flex items-center gap-1">
                    <AdminInput value={c.label} onChange={(e) => setCol(i, e.target.value)} className="text-center text-xs" />
                    <button onClick={() => delCol(i)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </th>
              ))}
              <th className="p-2"><AdminButton size="sm" variant="ghost" onClick={addCol}><Plus className="h-3 w-3" /></AdminButton></th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r: any, ri: number) => (
              <tr key={r.id || ri}>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <AdminInput value={r.label} onChange={(e) => setRow(ri, 'label', e.target.value)} className="text-xs" />
                    <button onClick={() => delRow(ri)} className="text-red-400 hover:text-red-300"><Trash2 className="h-3 w-3" /></button>
                  </div>
                  <label className="flex items-center gap-1 mt-1 text-[10px]"><input type="checkbox" checked={!!r.highlight} onChange={(e) => setRow(ri, 'highlight', e.target.checked)} /> Highlight</label>
                </td>
                {(r.cells || []).map((c: string, ci: number) => (
                  <td key={ci} className="p-2"><AdminInput value={c} onChange={(e) => setCell(ri, ci, e.target.value)} className="text-right text-xs tabular-nums" /></td>
                ))}
                <td className="p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminButton size="sm" variant="ghost" onClick={addRow} className="mt-2"><Plus className="h-3.5 w-3.5" /> Add row</AdminButton>
      </div>
    </AdminCard>
  )
}

// ============================================================
// INBOX
// ============================================================
export function AdminInbox() {
  const [data, setData] = useState<any | null>(null)
  const [tab, setTab] = useState<'messages' | 'inquiries' | 'subscribers' | 'applications' | 'registrations'>('messages')
  const [search, setSearch] = useState('')

  useEffect(() => { adminFetch('/api/v1/admin/inbox').then((d) => setData(d)) }, [])

  const updateMessageStatus = async (id: string, status: string) => {
    if (await adminFetch(`/api/v1/admin/inbox/${id}`, adminJson('PUT', { status })) !== null) {
      adminFetch('/api/v1/admin/inbox').then((d) => setData(d))
    }
  }
  const deleteMessage = async (id: string) => {
    if (!confirm('Delete?')) return
    if (await adminFetch(`/api/v1/admin/inbox/${id}`, { method: 'DELETE' }) !== null) {
      adminFetch('/api/v1/admin/inbox').then((d) => setData(d))
    }
  }

  if (!data) return <AdminLoading />

  const list = (data[tab] || []).filter((x: any) => !search || JSON.stringify(x).toLowerCase().includes(search.toLowerCase()))

  const exportCsv = () => {
    if (!list.length) return
    const headers = Object.keys(list[0])
    const rows = list.map((r: any) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${tab}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {([
          ['messages', 'Messages', Mail], ['inquiries', 'Inquiries', MessageSquare], ['subscribers', 'Subscribers', Send],
          ['applications', 'Alumni Apps', Users], ['registrations', 'Event Reg', Star],
        ] as const).map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${tab === k ? 'bg-[#FFD500] text-[#06130B]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
            <Icon className="h-4 w-4" /> {label} <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">{(data[k] || []).length}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <AdminInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9" />
        </div>
        <AdminButton variant="ghost" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</AdminButton>
      </div>

      <div className="space-y-2">
        {list.length === 0 && <div className="text-center py-16 text-white/40 text-sm">Nothing here yet.</div>}
        {tab === 'subscribers' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {list.map((s: any) => <AdminCard key={s.id} className="p-3 text-sm">{s.email}</AdminCard>)}
          </div>
        ) : (
          list.map((m: any) => (
            <AdminCard key={m.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{m.name || m.parentName}</div>
                    {m.status === 'new' && <span className="px-2 py-0.5 rounded-full bg-[#FFD500]/15 text-[#FFE24D] text-[10px] font-bold">NEW</span>}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {m.email}{m.phone && ` • ${m.phone}`}{m.subject && ` • ${m.subject}`}{m.campus && ` • ${m.campus}`}
                  </div>
                  {m.message && <p className="text-sm text-white/80 mt-2">{m.message}</p>}
                  <div className="text-[10px] text-white/40 mt-2">{new Date(m.createdAt).toLocaleString('en-GB')}</div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {m.email && <a href={`mailto:${m.email}`} className="grid place-items-center h-7 w-7 rounded-full bg-white/5 hover:bg-white/10"><Mail className="h-3.5 w-3.5" /></a>}
                  {m.status && (
                    <select value={m.status} onChange={(e) => updateMessageStatus(m.id, e.target.value)} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                      <option value="new">new</option><option value="read">read</option><option value="archived">archived</option><option value="starred">starred</option>
                    </select>
                  )}
                  <button onClick={() => deleteMessage(m.id)} className="grid place-items-center h-7 w-7 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </AdminCard>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================
// LEGAL PAGES
// ============================================================
export function AdminLegal() {
  const [pages, setPages] = useState<any[] | null>(null)

  useEffect(() => { adminFetch('/api/v1/admin/legal').then((d) => setPages(d || [])) }, [])

  const save = async (p: any) => {
    const r = await adminFetch('/api/v1/admin/legal', adminJson('PUT', p))
    if (r !== null) { toast.success('Saved'); triggerSiteRefresh() }
  }

  if (!pages) return <AdminLoading />

  return (
    <div className="space-y-4">
      {pages.map((p) => <LegalEditor key={p.id} page={p} onSave={save} />)}
    </div>
  )
}

function LegalEditor({ page, onSave }: { page: any; onSave: (p: any) => void }) {
  const [f, setF] = useState(page)
  return (
    <AdminCard className="p-5">
      <div className="text-sm font-semibold mb-3 text-[#FFD500]">{f.slug.toUpperCase()}</div>
      <AdminField label="Title"><AdminInput value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></AdminField>
      <AdminField label="Last updated (label)"><AdminInput value={f.updatedAt || ''} onChange={(e) => setF({ ...f, updatedAt: e.target.value })} /></AdminField>
      <AdminField label="Body (HTML)"><AdminTextarea rows={12} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} className="font-mono text-xs" /></AdminField>
      <div className="flex justify-end mt-3"><AdminButton onClick={() => onSave(f)}><Save className="h-4 w-4" /> Save</AdminButton></div>
    </AdminCard>
  )
}

function triggerSiteRefresh() { fetch('/api/v1/public/bootstrap').then(() => window.location.reload()) }

// ============================================================
// PROFILE
// ============================================================
export function AdminProfile({ user }: { user: any }) {
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', password: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const body: any = { name: f.name, email: f.email }
    if (f.password) body.password = f.password
    const r = await adminFetch('/api/v1/admin/me/profile', adminJson('PUT', body))
    if (r !== null) toast.success('Profile updated')
    setSaving(false)
  }

  return (
    <div className="max-w-lg">
      <AdminCard className="p-5 space-y-3">
        <AdminField label="Name"><AdminInput value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></AdminField>
        <AdminField label="Email"><AdminInput value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></AdminField>
        <AdminField label="New password (leave blank to keep)"><AdminInput type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></AdminField>
        <AdminButton onClick={save} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}</AdminButton>
      </AdminCard>
    </div>
  )
}

// ============================================================
// USERS (SUPER_ADMIN only)
// ============================================================
export function AdminUsers({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<any[] | null>(null)

  useEffect(() => { adminFetch('/api/v1/admin/users').then((d) => setUsers(d || [])) }, [])

  const create = async () => {
    const email = prompt('New user email:')
    if (!email) return
    const name = prompt('Name:') || ''
    const password = prompt('Temporary password (min 8 chars):') || ''
    const role = prompt('Role (SUPER_ADMIN / ADMIN / EDITOR):', 'EDITOR') || 'EDITOR'
    if (password.length < 8) return toast.error('Password too short')
    const r = await adminFetch('/api/v1/admin/users', adminJson('POST', { email, name, password, role, active: true }))
    if (r !== null) { toast.success('User created'); adminFetch('/api/v1/admin/users').then((d) => setUsers(d || [])) }
  }
  const toggleActive = async (u: any) => {
    if (u.id === currentUser?.id) return toast.error('Cannot deactivate yourself')
    const r = await adminFetch(`/api/v1/admin/users/${u.id}`, adminJson('PUT', { active: !u.active }))
    if (r !== null) { toast.success('Updated'); adminFetch('/api/v1/admin/users').then((d) => setUsers(d || [])) }
  }
  const changeRole = async (u: any, role: string) => {
    const r = await adminFetch(`/api/v1/admin/users/${u.id}`, adminJson('PUT', { role }))
    if (r !== null) { toast.success('Role updated'); adminFetch('/api/v1/admin/users').then((d) => setUsers(d || [])) }
  }
  const del = async (u: any) => {
    if (!confirm(`Delete ${u.email}?`)) return
    const r = await adminFetch(`/api/v1/admin/users/${u.id}`, { method: 'DELETE' })
    if (r !== null) { toast.success('Deleted'); adminFetch('/api/v1/admin/users').then((d) => setUsers(d || [])) }
  }
  const resetPw = async (u: any) => {
    const pw = prompt(`New password for ${u.email}:`)
    if (!pw || pw.length < 8) return
    const r = await adminFetch(`/api/v1/admin/users/${u.id}`, adminJson('PUT', { password: pw }))
    if (r !== null) toast.success('Password reset')
  }

  if (!users) return <AdminLoading />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-white/60">{users.length} users</div>
        <AdminButton onClick={create}><Plus className="h-4 w-4" /> New User</AdminButton>
      </div>
      <div className="space-y-2">
        {users.map((u: any) => (
          <AdminCard key={u.id} className="p-4 flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-full bg-[#FFD500]/15 text-[#FFD500] font-bold">{u.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{u.name} {u.id === currentUser?.id && <span className="text-[10px] text-white/40">(you)</span>}</div>
              <div className="text-xs text-white/60">{u.email}</div>
              <div className="text-[10px] text-white/40">Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-GB') : 'never'}</div>
            </div>
            <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} disabled={u.id === currentUser?.id} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
              <option value="SUPER_ADMIN">SUPER_ADMIN</option><option value="ADMIN">ADMIN</option><option value="EDITOR">EDITOR</option>
            </select>
            <AdminButton size="sm" variant="ghost" onClick={() => toggleActive(u)}>{u.active ? 'Deactivate' : 'Activate'}</AdminButton>
            <AdminButton size="sm" variant="ghost" onClick={() => resetPw(u)}>Reset PW</AdminButton>
            {u.id !== currentUser?.id && <AdminButton size="sm" variant="danger" onClick={() => del(u)}><Trash2 className="h-3.5 w-3.5" /></AdminButton>}
          </AdminCard>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// AUDIT LOG
// ============================================================
export function AdminAuditLog() {
  const [logs, setLogs] = useState<any[] | null>(null)
  useEffect(() => { adminFetch('/api/v1/admin/audit-log').then((d) => setLogs(d || [])) }, [])

  if (!logs) return <AdminLoading />
  return (
    <div className="space-y-2">
      {logs.length === 0 && <div className="text-center py-16 text-white/40 text-sm">No activity yet.</div>}
      {logs.map((l: any) => (
        <AdminCard key={l.id} className="p-3 flex items-center gap-3 text-sm">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${l.action === 'CREATE' ? 'bg-green-500/20 text-green-300' : l.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-300' : l.action === 'DELETE' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white/60'}`}>{l.action}</span>
          <span className="font-semibold">{l.entity}</span>
          <span className="text-white/60 flex-1 truncate">{l.summary}</span>
          <span className="text-[10px] text-white/40 shrink-0">{l.user?.name || 'system'} • {new Date(l.createdAt).toLocaleString('en-GB')}</span>
        </AdminCard>
      ))}
    </div>
  )
}
