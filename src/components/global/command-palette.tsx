'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog'
import {
  Home as HomeIcon, Info, GraduationCap, BookOpen, Newspaper, CalendarDays,
  Users, Compass, Phone, Building2, ScrollText, HelpCircle, Shield, Search,
} from 'lucide-react'
import { useStore, RouteKey } from '@/lib/store'

interface Item { label: string; route: RouteKey; param?: string; icon: any; group: string }

export function CommandPalette() {
  const { commandOpen, setCommandOpen, data, navigate } = useStore()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen(!commandOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandOpen, setCommandOpen])

  useEffect(() => {
    if (!data) return
    const navItems: Item[] = [
      { label: 'Home', route: 'home', icon: HomeIcon, group: 'Pages' },
      { label: 'About Us', route: 'about', icon: Info, group: 'Pages' },
      { label: 'Admissions', route: 'admissions', icon: GraduationCap, group: 'Pages' },
      { label: 'Academics', route: 'academics', icon: BookOpen, group: 'Pages' },
      { label: 'Campus & Facilities', route: 'campus-facilities', icon: Building2, group: 'Pages' },
      { label: 'Student Life', route: 'student-life', icon: BookOpen, group: 'Pages' },
      { label: 'News', route: 'news', icon: Newspaper, group: 'Pages' },
      { label: 'Events', route: 'events', icon: CalendarDays, group: 'Pages' },
      { label: 'Alumni', route: 'alumni', icon: Users, group: 'Pages' },
      { label: 'Virtual Tour', route: 'virtual-tour', icon: Compass, group: 'Pages' },
      { label: 'Branches', route: 'branches', icon: Building2, group: 'Pages' },
      { label: 'Contact', route: 'contact', icon: Phone, group: 'Pages' },
      { label: 'FAQs', route: 'faqs', icon: HelpCircle, group: 'Support' },
      { label: 'Policies', route: 'policies', icon: Shield, group: 'Support' },
      { label: 'Privacy Policy', route: 'privacy', icon: ScrollText, group: 'Support' },
      { label: 'Terms of Service', route: 'terms', icon: ScrollText, group: 'Support' },
    ]
    const newsItems: Item[] = data.news.slice(0, 6).map((n) => ({
      label: n.title, route: 'news-detail', param: n.slug, icon: Newspaper, group: 'News',
    }))
    const eventItems: Item[] = data.events.slice(0, 6).map((e) => ({
      label: e.title, route: 'events-detail', param: e.slug, icon: CalendarDays, group: 'Events',
    }))
    const branchItems: Item[] = data.branches.map((b) => ({
      label: `${b.name} Campus`, route: 'branch-detail', param: b.slug, icon: Building2, group: 'Branches',
    }))
    setItems([...navItems, ...branchItems, ...newsItems, ...eventItems])
  }, [data])

  const run = (item: Item) => {
    navigate(item.route, item.param)
    setCommandOpen(false)
  }

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="p-0 max-w-xl overflow-hidden gap-0 bg-popover/95 backdrop-blur-xl">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Search pages, news, events, branches…" className="h-12" />
          </div>
          <CommandList className="max-h-[420px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {['Pages', 'Branches', 'News', 'Events', 'Support'].map((group) => {
              const groupItems = items.filter((i) => i.group === group)
              if (!groupItems.length) return null
              return (
                <CommandGroup key={group} heading={group}>
                  {groupItems.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={`${item.label} ${item.group}`}
                      onSelect={() => run(item)}
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
