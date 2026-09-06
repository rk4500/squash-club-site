'use client'

import { MATCHES, SCHEDULE, SRC_LABEL, type BracketSpec } from '@/data/ladder/draw'
import {
  matchState, isReady, participants, type Results, type Snapshots, type Winner,
} from '@/lib/ladder/engine'

const FLAG_TEXT = {
  orphan: '⚠ feeder cleared — result kept, needs re-check',
  conflict: '⚠ players changed — re-pick the winner',
  tainted: '⚠ provisional — an earlier match is unresolved',
} as const

export type BracketProps = {
  results: Results
  snaps: Snapshots
  taint: Set<string>
  /** When false the boxes render read-only: no picking, no clear buttons. */
  admin: boolean
  onPick: (mid: string, side: Winner) => void
  onClear: (mid: string) => void
}

function MatchBox({ mid, results, snaps, taint, admin, onPick, onClear }: BracketProps & { mid: string }) {
  const match = MATCHES[mid]
  const slot = SCHEDULE[mid]
  const [a, b] = participants(mid, results)
  const state = matchState(mid, results, snaps)
  const recorded = results[mid]

  const flag =
    state === 'orphan' || state === 'conflict' ? state : taint.has(mid) ? 'tainted' : null
  const pickable = admin && isReady(mid, results, snaps)

  const classes = [
    'lc-box',
    match.route.startsWith('Decides') ? 'decider' : '',
    isReady(mid, results, snaps) && !recorded ? 'live' : '',
    flag ?? '',
  ].filter(Boolean).join(' ')

  const title =
    `${match.label} — ${match.route}` +
    (slot ? `\n${slot.day} ${slot.time} · ${slot.court}` : '')

  return (
    <div className={classes} title={title}>
      <div className="lc-head">
        <b>{match.display}</b>
        <span className="lc-head-right">
          <span>{slot?.time ?? ''}</span>
          {admin && recorded && (
            <button
              type="button"
              className="lc-x"
              title="Clear this result (later matches are kept, but flagged)"
              aria-label={`Clear the result of ${match.display}`}
              onClick={e => { e.stopPropagation(); onClear(mid) }}
            >
              ✕
            </button>
          )}
        </span>
      </div>

      {([['a', a], ['b', b]] as const).map(([key, player]) => {
        // A conflicted box shows no win/lose marks: the recorded winner refers
        // to players who are no longer the ones in the slots.
        const mark = recorded && state !== 'conflict' ? (recorded === key ? ' win' : ' lose') : ''
        return (
          <button
            key={key}
            type="button"
            className={`lc-slot${player.known ? '' : ' tbd'}${mark}`}
            disabled={!pickable}
            aria-label={pickable ? `Record ${player.name} as the winner of ${match.display}` : undefined}
            onClick={() => onPick(mid, key)}
          >
            <span>{player.name}</span>
          </button>
        )
      })}

      {flag && <div className="lc-flag">{FLAG_TEXT[flag]}</div>}
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
export function Schedule() {
  const days = ['Saturday', 'Sunday'] as const

  const rows = (day: string) => {
    const byTime = new Map<string, Record<string, string>>()
    for (const [mid, slot] of Object.entries(SCHEDULE)) {
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
                      <td key={court}>{courts[court] ? <ScheduleCell mid={courts[court]} /> : null}</td>
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

function ScheduleCell({ mid }: { mid: string }) {
  const match = MATCHES[mid]
  const slot = SCHEDULE[mid]
  const decides = match.route.startsWith('Decides')

  const describe = (side: typeof match.a) => {
    const [type, val] = side
    if (type === 'name') return val
    if (type === 'bye') return 'BYE'
    return `${type === 'W' ? 'Winner' : 'Loser'} of ${MATCHES[val].display}`
  }

  return (
    <div className={`lc-match${decides ? ' final-rank' : ''}`}>
      <strong>
        {match.display}
        {slot.src !== 'printed' && (
          <span className={`lc-tag ${slot.src}`}>{SRC_LABEL[slot.src]}</span>
        )}
      </strong>
      <div>{describe(match.a)} vs {describe(match.b)}</div>
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
