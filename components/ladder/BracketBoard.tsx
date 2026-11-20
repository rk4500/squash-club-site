'use client'

import { useMemo, useRef, useState } from 'react'
import { BRACKETS, LADDER_DRAW_ID, type BracketSpec, type DrawData } from '@/data/ladder/draw'
import { useLadder } from '@/lib/ladder/useLadder'
import { frozenStore, type LadderStore } from '@/lib/ladder/store'
import { standings, type Results, type Snapshots } from '@/lib/ladder/engine'
import { createSupabaseStore } from '@/lib/ladder/supabaseStore'
import { BracketTree, Schedule, Standings } from './Bracket'
import { useDrawEdit } from '@/lib/ladder/useDrawEdit'

// Stable identity, so useLadder's memo is not rebuilt every render.
const NO_PAIRS: readonly (readonly [string, number])[] = []

export default function BracketBoard(
  {
    draw, admin: adminProp = false, store, frozen,
    drawId = LADDER_DRAW_ID, brackets = BRACKETS,
  }: {
    draw: DrawData
    /** Which draw this is, in ladder_matches / ladder_results. */
    drawId?: string
    /** How to lay the draw out. Defaults to the ladder's. */
    brackets?: readonly BracketSpec[]
    admin?: boolean
    store?: LadderStore
    /**
     * A finished draw's final results. The board renders them read-only and
     * never touches Supabase: no load, no realtime channel, no admin controls.
     */
    frozen?: { results: Results; snaps: Snapshots }
  },
) {
  const admin = adminProp && !frozen
  // A multi-event draw ranks each event on its own; the ladder ranks the whole
  // draw through RANK_PAIRS, which is what passing undefined keeps.
  const perEvent = brackets.some(b => b.places)
  // One store for the lifetime of the board: it owns a realtime subscription,
  // so rebuilding it on every render would tear the channel down and back up.
  const boardStore = useMemo(
    () => store ?? (frozen ? frozenStore(frozen.results, frozen.snaps) : createSupabaseStore(drawId)),
    [store, frozen, drawId],
  )
  const ladder = useLadder(draw.matches, boardStore, frozen, drawId, perEvent ? NO_PAIRS : undefined)
  const { broken, taint, placings, champ, decided, total } = ladder

  // Recording a winner and correcting the draw are different jobs on the same
  // boxes, so the board is in one mode or the other rather than trying to read
  // intent out of a single click.
  const edit = useDrawEdit(draw, drawId)

  const fileRef = useRef<HTMLInputElement>(null)
  const [pasted, setPasted] = useState('')

  function exportResults() {
    const data = ladder.payload()
    const now = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    const name = `${drawId}-results-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
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
      `That file was saved from draw "${draw}", not ${drawId}. The match IDs may not line up. Load it anyway?`,
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
    // is-editing switches off the small-screen scale-down (ladder.css): edit
    // fields need their full 16px or a phone zooms the page on focus.
    <div className={`ladder${edit.editing ? ' is-editing' : ''}`}>
      {admin && (
        <>
          <div className="lc-controls">
            <div className="lc-seg" role="group" aria-label="What clicking the board does">
              <button
                type="button"
                aria-pressed={!edit.editing}
                onClick={() => edit.setEditing(false)}
              >
                Record results
              </button>
              <button
                type="button"
                aria-pressed={edit.editing}
                onClick={() => edit.setEditing(true)}
              >
                Edit draw
              </button>
            </div>
            <span className="self-center font-condensed text-xs tracking-widest text-white/25 uppercase">
              {edit.editing ? 'Esc leaves edit mode' : 'Double-click any box to edit it'}
            </span>
          </div>

          {edit.editing && (
            <p className="lc-note">
              Type straight into a box. It saves when you leave it; Esc puts it back, and Esc again,
              with the caret out of the box, leaves edit mode. A side fed by
              an earlier match shows whoever has reached it and cannot be typed over. Renaming a player
              flags every recorded match they appear in for re-checking; re-picking the same winner
              clears the flag without changing the result.
            </p>
          )}
        </>
      )}

      {admin && !edit.editing && (
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
              Paste an exported file here, or hand-write a plain map like <code>{'{"M1":"a","M2":"b"}'}</code>:
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
                  ladder.say('Current results written into the box below, select all and copy.')
                }}
              >
                Show current results here
              </button>
            </div>
          </details>
        </>
      )}

      <div className="lc-controls">
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
          {Array.from(broken).map(m => draw.matches[m].display).join(', ')}
          {taint.size > 0 && ` · ${taint.size} later match${taint.size > 1 ? 'es are' : ' is'} provisional`}
        </div>
      )}

      {champ && (
        <div className="lc-champ">
          🏆 Champion: {champ.name}{taint.has('F') ? ' (provisional)' : ''}
        </div>
      )}

      {brackets.map(spec => (
        <section key={spec.id} id={spec.id} className="scroll-mt-24">
          <h3 className="font-condensed text-xs tracking-[0.25em] uppercase text-[#f5a800] mt-10 mb-3 flex items-center gap-2.5 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800] before:shrink-0">
            {spec.title}
          </h3>
          <BracketTree
            spec={spec}
            draw={draw}
            results={ladder.results}
            snaps={ladder.snaps}
            taint={taint}
            admin={admin}
            edit={edit.editing ? edit : null}
            onEditAt={admin ? edit.openAt : undefined}
            onPick={(mid, side) => void ladder.pick(mid, side)}
            onClear={mid => void ladder.clear(mid)}
          />
        </section>
      ))}

      {perEvent ? (
        brackets.filter(b => b.places).map(spec => (
          <div key={spec.id}>
            <h3 className="font-condensed text-xs tracking-[0.25em] uppercase text-[#f5a800] mt-10 mb-3 flex items-center gap-2.5 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800] before:shrink-0">
              {spec.title}: Podium
            </h3>
            <Standings placings={standings(ladder.results, ladder.snaps, taint, draw.matches, spec.places)} />
          </div>
        ))
      ) : (
        <>
          <h3 className="font-condensed text-xs tracking-[0.25em] uppercase text-[#f5a800] mt-10 mb-3 flex items-center gap-2.5 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800] before:shrink-0">
            Final Standings
          </h3>
          <Standings placings={placings} />
        </>
      )}

      <h2 id="schedule" className="font-bebas text-4xl md:text-5xl tracking-wider uppercase mt-14 mb-2 scroll-mt-24">Schedule</h2>
      <Schedule draw={draw} />
    </div>
  )
}
