'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DrawData, ScheduleSrc, Slot } from '@/data/ladder/draw'
import { createClient } from '@/lib/supabase/client'
import { saveMatch, type MatchEdit } from '@/lib/ladder/drawStore'

/**
 * The editable face of one match: literal player names, and its slot.
 *
 * The time is held as its three parts rather than as "4:00 PM", because a
 * half-typed time has no valid single-string form -- "4:" is not a time, and
 * round-tripping it through a parser would fight the person typing it. The
 * parts are composed back into the stored format on the way out.
 */
export type Draft = {
  a: string
  b: string
  day: string
  hh: string
  mm: string
  mer: string
  court: string
}

/** How long the gold "saved" pulse sits on a box. */
const SAVED_MS = 1200

/** The stored format: a 12-hour time, written the way the draw sheets write it. */
const TIME_RE = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i

export const DAY_CYCLE = ['', 'Saturday', 'Sunday'] as const

/**
 * The club has two courts, so a court is picked, never typed, and there is no
 * blank to pick: a match is taken off the schedule by clearing its day or its
 * time, which is what the stored slot actually hangs on.
 */
export const COURT_CYCLE = ['Court 1', 'Court 2'] as const

export const HOUR_MIN = 1
export const HOUR_MAX = 12
export const MINUTE_MAX = 59

/** Every slot in this draw is an afternoon or evening one, so a bare hour is PM. */
export const DEFAULT_MERIDIEM = 'PM'

export const clampHour = (n: number) => Math.min(HOUR_MAX, Math.max(HOUR_MIN, n))
export const clampMinute = (n: number) => Math.min(MINUTE_MAX, Math.max(0, n))

function baselineOf(draw: DrawData, mid: string): Draft {
  const m = draw.matches[mid]
  const s = draw.schedule[mid]
  const t = TIME_RE.exec(s?.time ?? '')
  return {
    // Only a literal name is editable. A side fed by another match is
    // structure: changing who feeds whom needs the graph re-validated.
    a: m.a[0] === 'name' ? m.a[1] : '',
    b: m.b[0] === 'name' ? m.b[1] : '',
    day: s?.day ?? '',
    hh: t ? String(Number(t[1])) : '',
    mm: t ? t[2] : '',
    mer: t ? t[3].toUpperCase() : '',
    court: s?.court ?? '',
  }
}

const trimmed = (d: Draft): Draft => {
  const hh = d.hh.replace(/\D/g, '').slice(0, 2)
  const mm = d.mm.replace(/\D/g, '').slice(0, 2)
  return {
    a: d.a.trim(),
    b: d.b.trim(),
    day: d.day.trim(),
    hh: hh ? String(Number(hh)) : '',
    mm: mm ? mm.padStart(2, '0') : '',
    mer: d.mer.trim().toUpperCase(),
    court: d.court.trim(),
  }
}

/** The three parts as one stored time, or '' while any part is still missing. */
export const composeTime = (d: Draft) =>
  d.hh && d.mm && d.mer ? `${d.hh}:${d.mm} ${d.mer}` : ''

/**
 * The slot a draft describes, or null when the match is unscheduled.
 *
 * A day and a time are what make a slot real; the court only says which of the
 * two it is on, so it falls back rather than being able to hold a half-slot
 * open on its own.
 */
export function resolveSlot(d: Draft): Omit<Slot, 'src'> | null {
  const time = composeTime(d)
  if (!d.day || !time) return null
  return { day: d.day as Slot['day'], time, court: d.court || COURT_CYCLE[0] }
}

const same = (x: Draft, y: Draft) =>
  x.a === y.a && x.b === y.b && x.day === y.day
  && x.hh === y.hh && x.mm === y.mm && x.mer === y.mer && x.court === y.court

/**
 * Where a slot's time and court came from, worked out rather than asked for.
 * "Adjusted" is defined as a printed match that had to move, so moving one is
 * exactly what earns the label; a slot filled in from nothing is planned.
 */
export function deriveSrc(prev: Slot | undefined, d: Draft): ScheduleSrc | null {
  const slot = resolveSlot(d)
  if (!slot) return null
  if (!prev) return 'planned'
  const moved = prev.day !== slot.day || prev.time !== slot.time || prev.court !== slot.court
  return moved && prev.src === 'printed' ? 'fixed' : prev.src
}

/**
 * A field inside a match box, named so that a double-click anywhere on the
 * board can say where the caret should land once edit mode is on.
 */
export type FocusField = 'a' | 'b' | 'day' | 'hh' | 'mm' | 'mer' | 'court'

export type FocusTarget = { mid: string; field: FocusField }

export type DrawEdit = ReturnType<typeof useDrawEdit>

export function useDrawEdit(draw: DrawData) {
  const router = useRouter()
  const [editing, setEditingState] = useState(false)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  // Where the next render should put the caret. Set by a double-click on the
  // board and cleared by whichever box claims it, so it is a one-shot request
  // rather than a mode the board has to be talked back out of.
  const [focus, setFocus] = useState<FocusTarget | null>(null)
  const pulse = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Reverted boxes, waiting for the blur that would otherwise commit them.
  // Esc reverts and drops focus in the same keystroke, and the blur it causes
  // is dispatched before React has applied the revert -- so without this the
  // commit reads the draft that was just thrown away and saves it.
  const reverted = useRef(new Set<string>())

  useEffect(() => () => { if (pulse.current) clearTimeout(pulse.current) }, [])

  // A draft outlives its own save. router.refresh() re-renders the server
  // component asynchronously, so dropping the draft the moment the write
  // returns would flash the pre-edit value back into the box. Instead each
  // draft is retired once the draw coming down agrees with it.
  useEffect(() => {
    setDrafts(prev => {
      const next: Record<string, Draft> = {}
      let dropped = false
      for (const [mid, d] of Object.entries(prev)) {
        if (draw.matches[mid] && same(trimmed(d), baselineOf(draw, mid))) dropped = true
        else next[mid] = d
      }
      return dropped ? next : prev
    })
  }, [draw])

  const get = useCallback(
    (mid: string): Draft => drafts[mid] ?? baselineOf(draw, mid),
    [drafts, draw],
  )

  const dirty = useCallback(
    (mid: string) => !!drafts[mid] && !same(trimmed(drafts[mid]), baselineOf(draw, mid)),
    [drafts, draw],
  )

  const forget = useCallback((mid: string) => {
    setErrors(e => {
      if (!(mid in e)) return e
      const next = { ...e }
      delete next[mid]
      return next
    })
  }, [])

  const set = useCallback((mid: string, patch: Partial<Draft>) => {
    reverted.current.delete(mid)
    setDrafts(d => ({ ...d, [mid]: { ...(d[mid] ?? baselineOf(draw, mid)), ...patch } }))
    forget(mid)
  }, [draw, forget])

  const revert = useCallback((mid: string) => {
    reverted.current.add(mid)
    setDrafts(d => {
      if (!(mid in d)) return d
      const next = { ...d }
      delete next[mid]
      return next
    })
    forget(mid)
  }, [forget])

  /**
   * Step a field through its fixed set of values, the last wrapping back to
   * unset. A value that is not in the set at all -- older data, or something
   * typed before the field was closed down -- steps to the first real one
   * rather than to blank, so one click repairs it.
   */
  const cycle = useCallback((mid: string, field: 'day' | 'court', values: readonly string[]) => {
    const at = values.indexOf(get(mid)[field])
    set(mid, { [field]: at === -1 ? values[0] : values[(at + 1) % values.length] })
  }, [get, set])

  const setEditing = useCallback((on: boolean) => {
    setEditingState(on)
    // Leaving the mode discards anything still in hand. Every box commits on
    // the way out of its own focus, so this only ever drops rejected edits.
    if (!on) {
      reverted.current.clear()
      setDrafts({})
      setErrors({})
      setFocus(null)
    }
  }, [])

  /**
   * Esc leaves edit mode -- but only once it is not busy being the smaller
   * shortcut. Inside a box it reverts that box and drops focus, so the press
   * that closes the mode is the one made with the caret nowhere in particular:
   * either a second press, or the first if you never went into a field.
   */
  useEffect(() => {
    if (!editing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      const el = document.activeElement
      if (el instanceof HTMLElement && el.closest('[data-field]')) return
      setEditing(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [editing, setEditing])

  /**
   * Turn edit mode on straight into one field. Double-clicking a box is the
   * shortcut for the two-step "switch mode, then find the box again", so the
   * click that asked for it is also the click that picks the field.
   */
  const openAt = useCallback((mid: string, field: FocusField) => {
    setEditingState(true)
    setFocus({ mid, field })
  }, [])

  const clearFocus = useCallback(() => setFocus(null), [])

  const commit = useCallback(async (mid: string) => {
    if (reverted.current.delete(mid)) return
    const d = trimmed(get(mid))
    const match = draw.matches[mid]
    if (!match || same(d, baselineOf(draw, mid))) return

    const fail = (text: string) => setErrors(e => ({ ...e, [mid]: text }))

    if (match.a[0] === 'name' && !d.a) return fail('The top player needs a name.')
    if (match.b[0] === 'name' && !d.b) return fail('The bottom player needs a name.')

    // The hour and minute fields clamp as they are typed, so a part left out
    // is the only way to reach an unusable time.
    const time = composeTime(d)
    if (!time && (d.hh || d.mm)) return fail('A time needs an hour, minutes and AM or PM.')

    const slot = resolveSlot(d)
    if (!slot && (d.day || time)) return fail('A slot needs a day and a time — or neither.')

    const edit: MatchEdit = {
      day: slot?.day ?? null,
      time: slot?.time ?? null,
      court: slot?.court ?? null,
      src: deriveSrc(draw.schedule[mid], d),
    }
    if (match.a[0] === 'name') edit.a_ref = d.a
    if (match.b[0] === 'name') edit.b_ref = d.b

    setSaving(mid)
    forget(mid)
    try {
      await saveMatch(createClient(), mid, edit)
      setSaved(mid)
      if (pulse.current) clearTimeout(pulse.current)
      pulse.current = setTimeout(() => setSaved(null), SAVED_MS)
      // Re-render the server component so every box reads the saved draw.
      router.refresh()
    } catch (err) {
      fail((err as Error).message)
    } finally {
      setSaving(null)
    }
  }, [draw, forget, get, router])

  return {
    editing, setEditing, openAt, focus, clearFocus,
    get, set, dirty, revert, commit, cycle, errors, saving, saved,
  }
}
