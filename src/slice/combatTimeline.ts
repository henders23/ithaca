/** Combat consequences run on simulation time. Reading, pausing and backgrounding cannot spend it. */
export class CombatTimeline {
  private pending: { at: number; run: () => void }[] = []

  schedule(now: number, delay: number, run: () => void) {
    this.pending.push({ at: now + delay, run })
  }

  advance(now: number) {
    const due = this.pending.filter(event => event.at <= now).sort((a, b) => a.at - b.at)
    this.pending = this.pending.filter(event => event.at > now)
    for (const event of due) event.run()
  }

  clear() { this.pending = [] }
}
