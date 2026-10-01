import { db } from './db'
import { parseJSON } from './utils'

export type Settings = Record<string, string>

export async function getSettings(): Promise<Settings> {
  const rows = await db.setting.findMany()
  const map: Settings = {}
  for (const r of rows) map[r.key] = r.value
  return map
}

export async function getSetting(key: string, fallback = ''): Promise<string> {
  const r = await db.setting.findUnique({ where: { key } })
  return r?.value ?? fallback
}

export async function getSettingBool(key: string, fallback = false): Promise<boolean> {
  const v = await getSetting(key, fallback ? 'true' : 'false')
  return v === 'true'
}

export async function getSettingJSON<T>(key: string, fallback: T): Promise<T> {
  const v = await getSetting(key, '')
  return parseJSON<T>(v, fallback)
}

export async function setSetting(key: string, value: string, group = 'general') {
  return db.setting.upsert({
    where: { key },
    update: { value, group },
    create: { key, value, group },
  })
}
