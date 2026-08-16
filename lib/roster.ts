import committee from '@/data/committee.json'
import admissionsData from '@/data/admissions.json'

const admissions = admissionsData.admissions as Record<string, number | string | null>

// Roles pulled from committee.json (executive + heads) so designations shown on
// the Team / Home pages always follow the current committee, never a stale hardcode.
const roleMap: Record<string, string> = {}
for (const m of [...committee.executive, ...committee.heads]) {
  roleMap[m.name] = m.role
}

/** Committee designation for a player, or null if they hold no committee role. */
export function roleFor(name: string): string | null {
  return roleMap[name] ?? null
}

/** Team-page role label: "<designation> & Team Player", else "Team Player". */
export function teamRole(name: string): string {
  const r = roleFor(name)
  return r ? `${r} & Team Player` : 'Team Player'
}

/** Compact designation for the home ladder preview: committee role, else "Team Player". */
export function previewRole(name: string): string {
  return roleFor(name) ?? 'Team Player'
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}

// Academic year auto-increments every August (start of the FLAME academic year):
// admission 2024 -> 1st year in Aug 2024, 2nd in Aug 2025, 3rd in Aug 2026, ...
// No cap — 4th/5th year etc. are valid. "graduated" -> "Graduated".
// Data source: data/admissions.json (edit there, not here).
export function academicYear(name: string): string {
  const admit = admissions[name]
  if (admit === 'graduated') return 'Graduated'
  if (typeof admit !== 'number') return ''
  const now = new Date()
  const n = now.getFullYear() - admit + (now.getMonth() >= 7 ? 1 : 0)
  if (n < 1) return ''
  return `${ordinal(n)} Year`
}
