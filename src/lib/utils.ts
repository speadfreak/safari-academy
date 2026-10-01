import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parse a JSON-encoded DB string field safely. */
export function parseJSON<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

/** Format a date in a human-friendly way. */
export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(d)
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/** Calculate reading time estimate. */
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** Count down to a target date. */
export function daysUntil(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = d.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/** Generate a slug from a string. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Sanitize HTML for safe rendering (basic). */
export function sanitizeHTML(html: string) {
  // Very small sanitizer — strips <script> tags and event handlers.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

/** Extract allowed map src URL from iframe snippet or raw URL. */
export function extractMapSrc(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  // Direct URL?
  const allowedHosts = ['google.com/maps', 'maps.google.com', 'openstreetmap.org', 'www.openstreetmap.org']
  const tryUrl = (url: string) => allowedHosts.some((h) => url.includes(h))
  if (/^https?:\/\//.test(trimmed) && tryUrl(trimmed)) return trimmed
  // iframe snippet: extract src
  const m = trimmed.match(/src=["']([^"']+)["']/i)
  if (m && tryUrl(m[1])) return m[1]
  return null
}

/** Truncate text. */
export function truncate(text: string, n: number) {
  if (text.length <= n) return text
  return text.slice(0, n).trimEnd() + '…'
}

/** Format currency for Ethiopian Birr. */
export function formatETB(n: number) {
  return new Intl.NumberFormat('en-ET', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(n) + ' ETB'
}
