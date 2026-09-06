'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BRACKETS, DRAW_ID, MATCHES } from '@/data/ladder/draw'
import { useLadder } from '@/lib/ladder/useLadder'
import type { LadderStore } from '@/lib/ladder/store'
import { createSupabaseStore } from '@/lib/ladder/supabaseStore'
import { BracketTree, Schedule, Standings } from './Bracket'

const ZOOM_KEY = `${DRAW_ID}-zoom`
const ZOOM_MIN = 0.6
const ZOOM_MAX = 1.6
const BASE_COL = 210
const BASE_STUB = 18

export default function BracketBoard({ admin = false, store }: { admin?: boolean; store?: LadderStore }) {
  // One store for the lifetime of the board: it owns a realtime subscription,
  // so rebuilding it on every render would tear the channel down and back up.
  const supabaseStore = useMemo(() => store ?? createSupabaseStore(), [store])
  const ladder = useLadder(supabaseStore)
  const { broken, taint, placings, champ, decided, total } = ladder

  const rootRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pasted, setPasted] = useState('')

  // Zoom is a per-viewer display preference, so it stays in localStorage even
  // once results live server-side.
  const [zoom, setZoom] = useState(1)
  useEffect(() => {
    const saved = parseFloat(window.localStorage.getItem(ZOOM_KEY) ?? '1')
    if (Number.isFinite(saved)) setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, saved)))
  }, [])
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    el.style.setProperty('--colw', `${Math.round(BASE_COL * zoom)}px`)
    el.style.setProperty('--stub', `${Math.round(BASE_STUB * zoom)}px`)
    try { window.localStorage.setItem(ZOOM_KEY, String(zoom)) } catch { /* storage blocked */ }
  }, [zoom])

  const zoomBy = (dir: number) =>
    setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + dir * 0.15) * 100) / 100)))

  function exportResults() {
    const data = ladder.payload()
    const now = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    const name = `${DRAW_ID}-results-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
      + `-${p(now.getHours())}${p(now.getMinutes())}.json`

    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
    ladder.say(
      `Exported ${data.decided} recorded result${data.decided === 1 ? '' : 's'} as ${name}.`
      + ' If no download appeared, open "Paste results instead" and copy the text out.',
    )
  }

  const confirmForeign = (draw: string) =>
    window.confirm(
      `That file was saved from draw "${draw}", not ${DRAW_ID}. The match IDs may not line up. Load it anyway?`,
    )
  const confirmOverwrite = (existing: number, incoming: number) =>
    window.confirm(
      `Replace the ${existing} result${existing === 1 ? '' : 's'} recorded here with ${incoming} from the file?`,
    )

  function pickFile() {
    const input = fileRef.current
    if (!input) return
    input.value = ''
    input.click()
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      await ladder.importFrom(text, file.name, confirmForeign, confirmOverwrite)
    } catch {
      ladder.say(`Could not read ${file.name}.`, true)
    }
  }

  return (
    <div className="ladder" ref={rootRef}>
      {admin && (
        <>
          <div className="lc-controls">
            <button type="button" className="lc-btn primary" onClick={exportResults}>Export results</button>
            <button type="button" className="lc-btn" onClick={pickFile}>Import results</button>
            <button
              type="button"
              className="lc-btn danger"
              onClick={() => {
                if (!decided) return ladder.say('Nothing recorded yet.', true)
                if (window.confirm(`Clear all ${decided} recorded results? Export first if you want a backup.`)) {
                  void ladder.resetAll()
                }
              }}
            >
              Reset all results
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={onFileChosen}
            />
          </div>

          <details className="lc-io">
            <summary>Paste results instead</summary>
            <p className="text-white/40 text-sm leading-relaxed mt-3 max-w-[78ch]">
              Paste an exported file here, or hand-write a plain map like <code>{'{"M1":"a","M2":"b"}'}</code> —
              {' '}<code>a</code> is the top player in the box, <code>b</code> the bottom one. Partly finished sets
              are fine; anything left out stays open, and anything downstream of a gap gets flagged rather
              than guessed.
            </p>
            <textarea
              value={pasted}
              spellCheck={false}
              placeholder={'{"format":"flame-ladder-results","results":{"M1":"a"}}'}
              onChange={e => setPasted(e.target.value)}
            />
            <div className="lc-controls">
              <button
                type="button"
                className="lc-btn"
                onClick={() => {
                  if (!pasted.trim()) return ladder.say('Nothing pasted in the box.', true)
                  void ladder.importFrom(pasted.trim(), 'the pasted text', confirmForeign, confirmOverwrite)
                }}
              >
                Load pasted results
              </button>
              <button
                type="button"
                className="lc-btn"
                onClick={() => {
                  setPasted(JSON.stringify(ladder.payload(), null, 2))
                  ladder.say('Current results written into the box below — select all and copy.')
                }}
              >
                Show current results here
              </button>
            </div>
          </details>
        </>
      )}

      <div className="lc-controls">
        <button type="button" className="lc-btn" onClick={() => zoomBy(-1)} aria-label="Zoom the bracket out">Zoom out</button>
        <button type="button" className="lc-btn" onClick={() => zoomBy(1)} aria-label="Zoom the bracket in">Zoom in</button>
        <span className="self-center font-condensed text-xs tracking-widest text-white/25 uppercase">
          {decided} of {total} matches decided
        </span>
      </div>

      {ladder.status && (
        <div className={ladder.status.bad ? 'lc-alert' : 'lc-ok'} role="status">{ladder.status.text}</div>
      )}

      {broken.size > 0 && (
        <div className="lc-alert" role="status">
          ⚠ {broken.size} match{broken.size > 1 ? 'es need' : ' needs'} re-checking after a reset:{' '}
          {Array.from(broken).map(m => MATCHES[m].display).join(', ')}
          {taint.size > 0 && ` · ${taint.size} later match${taint.size > 1 ? 'es are' : ' is'} provisional`}
        </div>
      )}

      {champ && (
        <div className="lc-champ">
          🏆 Champion: {champ.name}{taint.has('F') ? ' (provisional)' : ''}
        </div>
      )}

      {BRACKETS.map(spec => (
        <section key={spec.id} id={spec.id}>
          <h3 className="font-condensed text-xs tracking-[0.25em] uppercase text-[#f5a800] mt-10 mb-3 flex items-center gap-2.5 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800] before:shrink-0">
            {spec.title}
          </h3>
          <BracketTree
            spec={spec}
            results={ladder.results}
            snaps={ladder.snaps}
            taint={taint}
            admin={admin}
            onPick={(mid, side) => void ladder.pick(mid, side)}
            onClear={mid => void ladder.clear(mid)}
          />
        </section>
      ))}

      <h3 className="font-condensed text-xs tracking-[0.25em] uppercase text-[#f5a800] mt-10 mb-3 flex items-center gap-2.5 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800] before:shrink-0">
        Final Standings
      </h3>
      <Standings placings={placings} />

      <h2 className="font-bebas text-4xl md:text-5xl tracking-wider uppercase mt-14 mb-2">Schedule</h2>
      <Schedule />
    </div>
  )
}
