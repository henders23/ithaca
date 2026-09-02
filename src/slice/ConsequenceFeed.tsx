import { useCallback, useEffect, useRef, useState } from 'react'
import type { CampaignEffect } from '../state/types.js'
import { describeEffects, type ConsequenceNotice } from './consequences.js'

interface LiveNotice extends ConsequenceNotice {
  key: number
}

const NOTICE_LIFE_MS = 4600
const STAGGER_MS = 260

/** Queues the visible acknowledgement for a batch of campaign effects. */
export function useConsequenceFeed() {
  const [notices, setNotices] = useState<LiveNotice[]>([])
  const sequence = useRef(0)
  const timers = useRef(new Set<number>())

  useEffect(() => () => {
    for (const timer of timers.current) window.clearTimeout(timer)
  }, [])

  const push = useCallback((effects: readonly CampaignEffect[]) => {
    if (typeof window === 'undefined') return
    describeEffects(effects).forEach((notice, index) => {
      const key = ++sequence.current
      const show = window.setTimeout(() => {
        timers.current.delete(show)
        setNotices((current) => [...current, { ...notice, key }])
        const hide = window.setTimeout(() => {
          timers.current.delete(hide)
          setNotices((current) => current.filter((item) => item.key !== key))
        }, NOTICE_LIFE_MS)
        timers.current.add(hide)
      }, index * STAGGER_MS)
      timers.current.add(show)
    })
  }, [])

  return { notices, push }
}

export function ConsequenceFeed({ notices }: { notices: readonly LiveNotice[] }) {
  if (!notices.length) return null
  return (
    <aside className="consequence-feed" aria-live="polite" aria-label="Consequences">
      {notices.map((notice) => (
        <div key={notice.key} className={`consequence tone-${notice.tone}`}>
          <i aria-hidden="true" />
          <strong>{notice.title}</strong>
          <span>{notice.detail}</span>
        </div>
      ))}
    </aside>
  )
}
