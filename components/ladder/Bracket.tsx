'use client'

import { SRC_LABEL, type BracketSpec, type DrawData, type Match } from '@/data/ladder/draw'
import {
  matchState, isReady, participants, type Results, type Snapshots, type Winner,
} from '@/lib/ladder/engine'
import { useEffect, useRef } from 'react'
import {
  clampHour, clampMinute, COURT_CYCLE, DAY_CYCLE, DEFAULT_MERIDIEM, HOUR_MAX, MINUTE_MAX,
  type Draft, type DrawEdit, type FocusField,
} from '@/lib/ladder/useDrawEdit'

const FLAG_TEXT = {
  orphan: '⚠ feeder cleared — result kept, needs re-check',
  conflict: '⚠ players changed — re-pick the winner',
  tainted: '⚠ provisional — an earlier match is unresolved',
} as const

export type BracketProps = {
  draw: DrawData
  results: Results
  snaps: Snapshots
  taint: Set<string>
  /** When false the boxes render read-only: no picking, no clear buttons. */
  admin: boolean
  onPick: (mid: string, side: Winner) => void
  onClear: (mid: string) => void
  /**
   * Present only while the board is in edit-draw mode. Its presence is what
   * turns the boxes into fields, so a box never has to ask twice whether a
   * click means "this player won" or "I am fixing this player's name".
   */
  edit?: DrawEdit | null
  /**
   * Present for an admin in either mode: double-clicking a box asks for edit
   * mode with the caret already in the field that was clicked. Absent for a
   * visitor, which is also what leaves the single-click path undelayed.
   */
  onEditAt?: (mid: string, field: FocusField) => void
}

/**
 * How long a click on a player waits to see whether it is half of a
 * double-click. Recording a winner is a write, so it is worth the pause not to
 * record one every time somebody double-clicks their way into edit mode.
 */
const DOUBLE_MS = 220

/**
 * Hour, minutes and meridiem as three segments that behave like one field.
 *
 * The point is that a committee member never has to type punctuation or think
 * about format: two digits at most per segment, focus moves on as soon as a
 * segment cannot take another digit, and out-of-range values are pulled back
 * in as they are typed rather than rejected afterwards.
 */
function TimeField(
  { mid, draft, edit, display, onFieldKey }: {
    mid: string
    draft: Draft
    edit: DrawEdit
    display: string
    onFieldKey: (e: React.KeyboardEvent<HTMLElement>) => void
  },
) {
  const hourRef = useRef<HTMLInputElement>(null)
  const minRef = useRef<HTMLInputElement>(null)
  const merRef = useRef<HTMLButtonElement>(null)

  const focus = (el: HTMLElement | null) => {
    if (!el) return
    el.focus()
    if (el instanceof HTMLInputElement) el.select()
  }

  const digitsOf = (raw: string) => raw.replace(/\D/g, '').slice(0, 2)

  const onHour = (raw: string) => {
    const digits = digitsOf(raw)
    // Starting a time on an empty slot picks the meridiem the draw runs in;
    // it is one click to flip and saves 64 of them.
    const mer = draft.mer || (digits ? DEFAULT_MERIDIEM : '')

    if (!digits) return edit.set(mid, { hh: '', mer })
    if (digits.length === 1) {
      // 2 through 9 cannot begin a two-digit hour, so that segment is done.
      edit.set(mid, { hh: digits, mer })
      if (Number(digits) * 10 > HOUR_MAX) focus(minRef.current)
      return
    }
    edit.set(mid, { hh: String(clampHour(Number(digits))), mer })
    focus(minRef.current)
  }

  const onMinute = (raw: string) => {
    const digits = digitsOf(raw)
    if (!digits) return edit.set(mid, { mm: '' })
    if (digits.length === 1) {
      // 6 through 9 cannot begin a two-digit minute, so it means 06 through 09.
      if (Number(digits) * 10 > MINUTE_MAX) {
        edit.set(mid, { mm: `0${digits}` })
        focus(merRef.current)
      } else {
        edit.set(mid, { mm: digits })
      }
      return
    }
    edit.set(mid, { mm: String(clampMinute(Number(digits))).padStart(2, '0') })
    focus(merRef.current)
  }

  const hourKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight' && e.currentTarget.selectionStart === e.currentTarget.value.length) {
      e.preventDefault()
      focus(minRef.current)
      return
    }
    onFieldKey(e)
  }

  const minuteKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const atStart = e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0
    if ((e.key === 'Backspace' && !e.currentTarget.value) || (e.key === 'ArrowLeft' && atStart)) {
      e.preventDefault()
      focus(hourRef.current)
      return
    }
    if (e.key === 'ArrowRight' && e.currentTarget.selectionStart === e.currentTarget.value.length) {
      e.preventDefault()
      focus(merRef.current)
      return
    }
    onFieldKey(e)
  }

  const merKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const k = e.key.toLowerCase()
    if (k === 'a' || k === 'p') {
      e.preventDefault()
      edit.set(mid, { mer: k === 'a' ? 'AM' : 'PM' })
      return
    }
    if (k === 'backspace' || k === 'arrowleft') {
      e.preventDefault()
      focus(minRef.current)
      return
    }
    if (k === 'arrowup' || k === 'arrowdown') {
      e.preventDefault()
      edit.set(mid, { mer: draft.mer === 'AM' ? 'PM' : 'AM' })
      return
    }
    onFieldKey(e)
  }

  return (
    <div className="lc-f-time">
      <input
        ref={hourRef}
        data-field="hh"
        className="lc-f-hh"
        value={draft.hh}
        placeholder="--"
        inputMode="numeric"
        autoComplete="off"
        aria-label={`Hour for ${display}`}
        onChange={e => onHour(e.target.value)}
        onFocus={e => e.currentTarget.select()}
        onBlur={e => {
          // Read the field, not `draft`: auto-advance blurs this input during
          // the same keystroke that changed it, before a re-render, so the
          // captured draft here is one keystroke stale.
          const v = digitsOf(e.currentTarget.value)
          if (v) edit.set(mid, { hh: String(clampHour(Number(v))) })
        }}
        onKeyDown={hourKey}
      />
      <span aria-hidden="true">:</span>
      <input
        ref={minRef}
        data-field="mm"
        className="lc-f-mm"
        value={draft.mm}
        placeholder="--"
        inputMode="numeric"
        autoComplete="off"
        aria-label={`Minutes for ${display}`}
        onChange={e => onMinute(e.target.value)}
        onFocus={e => e.currentTarget.select()}
        onBlur={e => {
          const v = digitsOf(e.currentTarget.value)
          if (v) edit.set(mid, { mm: String(clampMinute(Number(v))).padStart(2, '0') })
        }}
        onKeyDown={minuteKey}
      />
      <button
        ref={merRef}
        data-field="mer"
        type="button"
        className="lc-f-mer"
        aria-label={`${display} runs ${draft.mer || 'at an unset half of the day'}. Switches to ${
          draft.mer === 'PM' ? 'AM' : 'PM'
        }`}
        onClick={() => edit.set(mid, { mer: draft.mer === 'PM' ? 'AM' : 'PM' })}
        onKeyDown={merKey}
      >
        {draft.mer || '--'}
      </button>
    </div>
  )
}

/** What a cycling field lands on next, for its label. */
function nextIn(values: readonly string[], current: string): string {
  const at = values.indexOf(current)
  return at === -1 ? values[0] : values[(at + 1) % values.length]
}

/** How a structural side reads when it is shown instead of a resolved player. */
function describeSide(side: Match['a'], draw: DrawData): string {
  const [type, val] = side
  if (type === 'name') return val
  if (type === 'bye') return 'Bye'
  return `${type === 'W' ? 'Winner' : 'Loser'} of ${draw.matches[val].display}`
}

function MatchBox(
  { mid, draw, results, snaps, taint, admin, onPick, onClear, edit, onEditAt }:
    BracketProps & { mid: string },
) {
  const match = draw.matches[mid]
  const slot = draw.schedule[mid]
  const [a, b] = participants(mid, results, draw.matches)
  const state = matchState(mid, results, snaps, draw.matches)
  const recorded = results[mid]

  const editing = admin && !!edit
  const draft = edit?.get(mid)
  const error = edit?.errors[mid]

  const flag =
    state === 'orphan' || state === 'conflict' ? state : taint.has(mid) ? 'tainted' : null
  const pickable = admin && !editing && isReady(mid, results, snaps, draw.matches)

  const boxRef = useRef<HTMLDivElement>(null)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (clickTimer.current) clearTimeout(clickTimer.current) }, [])

  // The board hands out one focus request at a time; the box it names claims
  // it once the fields have rendered, then puts it down so a later re-render
  // does not steal the caret back.
  const wanted = edit?.focus?.mid === mid ? edit.focus.field : null
  const clearFocus = edit?.clearFocus
  useEffect(() => {
    if (!wanted || !clearFocus) return
    const box = boxRef.current
    // A box whose sides are both fed by earlier matches has no name field, so
    // fall back to whatever it does offer rather than focusing nothing.
    const el = box?.querySelector<HTMLElement>(`[data-field="${wanted}"]`)
      ?? box?.querySelector<HTMLElement>('[data-field]')
    el?.focus()
    if (el instanceof HTMLInputElement) el.select()
    clearFocus()
  }, [wanted, clearFocus])

  /** Enter edit mode with the caret in `field`, dropping any pending pick. */
  const openAt = (field: FocusField) => {
    if (!onEditAt) return
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
    onEditAt(mid, field)
  }

  const slotClick = (key: Winner) => {
    if (!pickable) return
    // Without an edit route out of this box a click can never be half of
    // anything, so the result goes in at once.
    if (!onEditAt) return onPick(mid, key)
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      onPick(mid, key)
    }, DOUBLE_MS)
  }

  const classes = [
    'lc-box',
    match.route.startsWith('Decides') ? 'decider' : '',
    isReady(mid, results, snaps, draw.matches) && !recorded ? 'live' : '',
    flag ?? '',
    editing ? 'editing' : '',
    error ? 'invalid' : '',
    edit?.saving === mid ? 'saving' : '',
    edit?.saved === mid ? 'saved' : '',
  ].filter(Boolean).join(' ')

  const title =
    `${match.label} — ${match.route}` +
    (slot ? `\n${slot.day} ${slot.time} · ${slot.court}` : '')

  // Leaving the box is the commit. Moving between its own fields is not, so a
  // name and a court time change together in one write.
  const onBoxBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!edit) return
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    void edit.commit(mid)
  }

  const onFieldKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!edit) return
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      edit.revert(mid)
      e.currentTarget.blur()
    }
  }

  const dayLabel = draft?.day ? draft.day.slice(0, 3) : 'Day'

  return (
    <div
      ref={boxRef}
      className={classes}
      title={editing ? undefined : title}
      onBlur={editing ? onBoxBlur : undefined}
      onDoubleClick={!editing && onEditAt ? () => openAt('a') : undefined}
    >
      <div className="lc-head">
        <b>{match.display}</b>
        <span className="lc-head-right">
          {editing ? (
            /* The time lives in the slot row below while editing, so the
               header is free to report what the box is doing instead. */
            <span className={edit.dirty(mid) ? 'lc-pending' : undefined}>
              {edit.saving === mid ? 'Saving' : edit.dirty(mid) ? 'Unsaved' : (slot?.time ?? '')}
            </span>
          ) : (
            <span onDoubleClick={onEditAt ? e => { e.stopPropagation(); openAt('hh') } : undefined}>
              {slot?.time ?? ''}
            </span>
          )}
          {!editing && admin && recorded && (
            <button
              type="button"
              className="lc-x"
              title="Clear this result (later matches are kept, but flagged)"
              aria-label={`Clear the result of ${match.display}`}
              onClick={e => { e.stopPropagation(); onClear(mid) }}
              onDoubleClick={e => e.stopPropagation()}
            >
              ✕
            </button>
          )}
        </span>
      </div>

      <div className="lc-sides">
        {editing && edit && draft
          ? ([['a', a], ['b', b]] as const).map(([key, player]) => (
              match[key][0] === 'name' ? (
                <input
                  key={key}
                  data-field={key}
                  className="lc-name"
                  value={key === 'a' ? draft.a : draft.b}
                  placeholder={key === 'a' ? 'Top player' : 'Bottom player'}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label={`${match.display} ${key === 'a' ? 'top' : 'bottom'} player`}
                  onChange={e => edit.set(mid, key === 'a' ? { a: e.target.value } : { b: e.target.value })}
                  onKeyDown={onFieldKey}
                />
              ) : (
                // Not typeable, but not a blank either: once the feeding match
                // is decided this side is a person, and editing the rest of the
                // box is a lot easier when you can see which one.
                <div
                  key={key}
                  className={`lc-static${player.known ? ' resolved' : ''}`}
                  title="Decided by an earlier match"
                >
                  <span>{player.known ? player.name : describeSide(match[key], draw)}</span>
                  {player.known && <span className="lc-from">{describeSide(match[key], draw)}</span>}
                </div>
              )
            ))
          : ([['a', a], ['b', b]] as const).map(([key, player]) => {
              // A conflicted box shows no win/lose marks: the recorded winner
              // refers to players who are no longer the ones in the slots.
              const mark = recorded && state !== 'conflict' ? (recorded === key ? ' win' : ' lose') : ''
              return (
                <button
                  key={key}
                  type="button"
                  className={`lc-slot${player.known ? '' : ' tbd'}${mark}`}
                  // aria-disabled rather than disabled: a decided or not-yet-ready
                  // box still has to hear the double-click that opens it for editing,
                  // and a disabled button is dropped from the event path entirely.
                  aria-disabled={!pickable}
                  tabIndex={pickable ? 0 : -1}
                  aria-label={pickable ? `Record ${player.name} as the winner of ${match.display}` : undefined}
                  onClick={() => slotClick(key)}
                  onDoubleClick={onEditAt ? e => { e.stopPropagation(); openAt(key) } : undefined}
                >
                  <span>{player.name}</span>
                </button>
              )
            })}
      </div>

      {editing && edit && draft && (
        <div className="lc-slotrow">
          <button
            type="button"
            data-field="day"
            className="lc-f-day"
            aria-label={`Day for ${match.display}: ${draft.day || 'not set'}. Changes to ${
              nextIn(DAY_CYCLE, draft.day) || 'not set'
            }`}
            onClick={() => edit.cycle(mid, 'day', DAY_CYCLE)}
            onKeyDown={onFieldKey}
          >
            {dayLabel}
          </button>
          <TimeField
            mid={mid}
            draft={draft}
            edit={edit}
            display={match.display}
            onFieldKey={onFieldKey}
          />
          <button
            type="button"
            data-field="court"
            className="lc-f-court"
            aria-label={`Court for ${match.display}: ${draft.court || 'not set'}. Changes to ${
              nextIn(COURT_CYCLE, draft.court)
            }`}
            onClick={() => edit.cycle(mid, 'court', COURT_CYCLE)}
            onKeyDown={onFieldKey}
          >
            {draft.court || 'Court'}
          </button>
        </div>
      )}

      {error
        ? <div className="lc-flag">{error}</div>
        : flag && <div className="lc-flag">{FLAG_TEXT[flag]}</div>}
    </div>
  )
}

/**
 * One bracket tree. Each round is a column of equal-height cells; the elbow
 * connectors are drawn in CSS off .has-in / .has-out / .lc-vline, so the only
 * thing this has to get right is which cells carry which class.
 */
export function BracketTree({ spec, ...rest }: BracketProps & { spec: BracketSpec }) {
  const { columns, headings, playoffs } = spec
  return (
    <div className="lc-scroll">
      <div className="lc-heads">
        {headings.map(h => <div key={h}>{h}</div>)}
        {playoffs.length > 0 && <div>Playoff</div>}
      </div>

      <div className="lc-bracket">
        {columns.map((col, ci) => (
          <div className="lc-round" key={ci}>
            {col.map((mid, i) => (
              <div
                key={mid}
                className={[
                  'lc-cell',
                  ci < columns.length - 1 ? 'has-out' : '',
                  ci > 0 ? 'has-in' : '',
                ].filter(Boolean).join(' ')}
              >
                <MatchBox mid={mid} {...rest} />
                {/* One vertical rung per pair, hung off the even-indexed cell. */}
                {ci < columns.length - 1 && i % 2 === 0 && <span className="lc-vline" />}
              </div>
            ))}
          </div>
        ))}

        {playoffs.length > 0 && (
          <div className="lc-round">
            {playoffs.map(mid => (
              <div className="lc-cell" key={mid}>
                <MatchBox mid={mid} {...rest} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Standings({ placings }: { placings: { rank: number; name: string; provisional: boolean }[] }) {
  if (!placings.length) {
    return (
      <div className="lc-standings">
        <div>No placement matches decided yet.</div>
      </div>
    )
  }
  return (
    <div className="lc-standings">
      {placings.map(p => (
        <div key={p.rank} className={p.provisional ? 'prov' : undefined}>
          <b>#{p.rank}</b>
          <span>{p.name}{p.provisional ? ' (provisional)' : ''}</span>
        </div>
      ))}
    </div>
  )
}

/** Schedule, derived from SCHEDULE so it cannot drift from the draw. */
export function Schedule({ draw }: { draw: DrawData }) {
  const days = ['Saturday', 'Sunday'] as const

  const rows = (day: string) => {
    const byTime = new Map<string, Record<string, string>>()
    for (const [mid, slot] of Object.entries(draw.schedule)) {
      if (slot.day !== day) continue
      const row = byTime.get(slot.time) ?? {}
      row[slot.court] = mid
      byTime.set(slot.time, row)
    }
    // Times are 12-hour strings; sort by the minute-of-day they represent.
    return Array.from(byTime.entries()).sort((x, y) => minutes(x[0]) - minutes(y[0]))
  }

  return (
    <>
      {days.map(day => (
        <section key={day}>
          <h3 className="font-bebas text-3xl tracking-wider mt-10 mb-3 uppercase">{day}</h3>
          <div className="lc-tablewrap">
            <table>
              <thead>
                <tr><th>Time</th><th>Court 1</th><th>Court 2</th></tr>
              </thead>
              <tbody>
                {rows(day).map(([time, courts]) => (
                  <tr key={time}>
                    <td className="lc-time">{time}</td>
                    {['Court 1', 'Court 2'].map(court => (
                      <td key={court}>{courts[court] ? <ScheduleCell mid={courts[court]} draw={draw} /> : null}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  )
}

function ScheduleCell({ mid, draw }: { mid: string; draw: DrawData }) {
  const match = draw.matches[mid]
  const slot = draw.schedule[mid]
  const decides = match.route.startsWith('Decides')

  return (
    <div className={`lc-match${decides ? ' final-rank' : ''}`}>
      <strong>
        {match.display}
        {slot.src !== 'printed' && (
          <span className={`lc-tag ${slot.src}`}>{SRC_LABEL[slot.src]}</span>
        )}
      </strong>
      <div>{describeSide(match.a, draw)} vs {describeSide(match.b, draw)}</div>
      <small>{match.route}</small>
    </div>
  )
}

function minutes(time: string): number {
  const m = /^(\d+):(\d+)\s*(AM|PM)$/i.exec(time.trim())
  if (!m) return 0
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return h * 60 + Number(m[2])
}
