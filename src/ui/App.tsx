import { CANON_CHARACTERS, ITHACA_CREW } from '../canon/characters.js'
import { SHIP } from '../canon/world.js'
import { CAMPAIGN_BEATS } from '../campaign/beats.js'
import { campaignActivityCount } from '../state/reducer.js'
import { validateCampaign, validateCanon } from '../state/validate.js'

const ACT_TITLES = [
  'The victory that becomes a curse',
  'Strange shores',
  'The sea takes its price',
  'The long-delayed homecoming',
] as const

export function App() {
  const canon = validateCanon()
  const campaign = validateCampaign()
  const combats = CAMPAIGN_BEATS.flatMap((beat) =>
    beat.activities.filter((activity) => activity.kind === 'combat'),
  )

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">PART 1 · CANON AND ARCHITECTURE</p>
        <h1>STARSHIP <span>ITHACA</span></h1>
        <p className="lede">
          An authored space odyssey about the long return—and the crime waiting at home.
        </p>
        <div className="ship-line">
          <strong>{SHIP.name}</strong>
          <span>{SHIP.registry}</span>
          <span>{SHIP.className}</span>
        </div>
      </header>

      <section className="metrics" aria-label="Architecture summary">
        <Metric value="32" label="ordered story beats" />
        <Metric value={String(campaignActivityCount())} label="authored activities" />
        <Metric value={String(combats.filter((item) => item.kind === 'combat' && !item.conditional).length)} label="mandatory battles" />
        <Metric value={String(CANON_CHARACTERS.length)} label="canonical characters" />
      </section>

      <section className="section validation">
        <div>
          <p className="eyebrow">FOUNDATION STATUS</p>
          <h2>{canon.valid && campaign.valid ? 'The voyage is structurally sound.' : 'The registry needs attention.'}</h2>
        </div>
        <div className={canon.valid && campaign.valid ? 'status good' : 'status bad'}>
          <span aria-hidden="true">{canon.valid && campaign.valid ? '✓' : '!'}</span>
          {canon.valid && campaign.valid ? 'Canon and campaign validations pass' : [...canon.errors, ...campaign.errors].join(' · ')}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">THE PEOPLE WHO RETURN</p>
        <h2>A fixed crew, remembered across the whole campaign</h2>
        <div className="crew-grid">
          {ITHACA_CREW.map((character) => (
            <article className="crew-card" key={character.id}>
              <div className="monogram">{character.name.replace(/^(Captain|Commander|Chief|Dr|Lieutenant) /, '').split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              <div>
                <h3>{character.name}</h3>
                <p className="station">{character.station}</p>
                <p>{character.storyFunction}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">THE LONG RETURN</p>
        <h2>Four acts. Thirty-two designed set pieces.</h2>
        <div className="acts">
          {ACT_TITLES.map((title, index) => {
            const beats = CAMPAIGN_BEATS.filter((beat) => beat.act === index + 1)
            return (
              <article className="act" key={title}>
                <div className="act-heading">
                  <span>ACT {index + 1}</span>
                  <h3>{title}</h3>
                  <small>{beats.length} beats</small>
                </div>
                <ol start={beats[0]?.order}>
                  {beats.map((beat) => (
                    <li key={beat.id}>
                      <strong>{beat.title}</strong>
                      <span>{beat.activities.map((activity) => activity.kind).join(' · ')}</span>
                    </li>
                  ))}
                </ol>
              </article>
            )
          })}
        </div>
      </section>

      <footer>
        <span>Next build target</span>
        <strong>Vertical slice · Beats 1–4</strong>
      </footer>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

