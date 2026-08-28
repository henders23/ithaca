import { useMemo, useState } from 'react'
import type { CharacterId, RelationshipId } from '../canon/characters.js'
import type { GameState } from '../state/types.js'
import { ASSETS } from './content.js'

export type HeliosNodeId = 'nursery' | 'seed-shoal' | 'grazer' | 'shepherd' | 'surface-loop' | 'ion-wake'
export type CompanionId = Exclude<RelationshipId, 'elara-vale'|'elias'>

export interface FinalActThreeResult {
  choiceId: string
  success: boolean
  energy?: number
  lifeHarm?: number
  selected?: string[]
  remnantPreserved?: boolean
  casualties?: number
  strikes?: number
  hullDamage?: number
  companionId?: CompanionId
  recordQuality?: number
  stability?: number
}

interface FrameProps {
  title: string
  goal: string
  background: string
  className?: string
  children: React.ReactNode
}

function Frame({ title, goal, background, className = '', children }: FrameProps) {
  return <section className={`helios-game ${className}`} style={{ '--helios-bg': `url(${background})` } as React.CSSProperties}>
    <header><h1>{title}</h1><strong>OBJECTIVE · {goal}</strong></header>
    {children}
  </section>
}

export const HELIOS_NODES: readonly { id: HeliosNodeId; name: string; telemetry: string; clue: string; living: boolean }[] = [
  { id:'nursery', name:'Magnetic nursery', telemetry:'NEW COHERENCE APPEARS AFTER EACH POLAR PULSE', clue:'The oldest signatures leave after the pulse; none enter beforehand.', living:true },
  { id:'seed-shoal', name:'Seed shoal', telemetry:'POPULATION FALLS BEFORE GRAZER MIGRATION', clue:'The shoals return after nursery pulses and diminish wherever ray mass rises.', living:true },
  { id:'grazer', name:'Ray grazer', telemetry:'MIGRATION FOLLOWS SEED DENSITY BY 4.2 MIN', clue:'Ray courses follow seed density, then change only when larger forms arrive.', living:true },
  { id:'shepherd', name:'Corona shepherd', telemetry:'COURSE CHANGES AFTER GRAZER DISTRESS', clue:'The largest forms arrive after distress and interpose themselves before flares.', living:true },
  { id:'surface-loop', name:'Surface convection loop', telemetry:'REPEATS WITHOUT ADAPTATION OR POPULATION CHANGE', clue:'A stellar process, not an individual organism.', living:false },
  { id:'ion-wake', name:'Ithaca ion wake', telemetry:'BEGINS AT HUMAN ENGINE IGNITION', clue:'A trace left by the ship, not part of the native ecology.', living:false },
] as const

export const HELIOS_CHAIN: readonly HeliosNodeId[] = ['nursery','seed-shoal','grazer','shepherd']

export function evaluateHeliosChain(selected: readonly HeliosNodeId[]) {
  const wrong = selected.filter((id, index) => id !== HELIOS_CHAIN[index])
  return { success:selected.length === HELIOS_CHAIN.length && wrong.length === 0, wrong }
}

export const RECHARGE_ZONES = [
  { id:'shed-shells', name:'Shed corona shells', energy:26, harm:0, detail:'Inert plasma sloughed after the shepherds migrate.' },
  { id:'shadow-wake', name:'Empty magnetic wake', energy:31, harm:0, detail:'Residual charge behind the grazer column; slower and safe.' },
  { id:'grazing-band', name:'Active grazing band', energy:46, harm:1, detail:'Dense power, but one living ray intersects the collector.' },
  { id:'nursery-core', name:'Nursery core', energy:64, harm:3, detail:'Fastest recovery; collapses a generation of seed life.' },
] as const

export function rechargeOutcome(selected: readonly string[]) {
  const zones = RECHARGE_ZONES.filter((zone) => selected.includes(zone.id))
  return { energy:zones.reduce((sum, zone) => sum + zone.energy, 0), lifeHarm:zones.reduce((sum, zone) => sum + zone.harm, 0) }
}

export function LivingSunEcologyGame({ onComplete }: { onComplete:(result:FinalActThreeResult)=>void }) {
  const [phase,setPhase]=useState<'map'|'recharge'>('map')
  const [chain,setChain]=useState<HeliosNodeId[]>([])
  const [attempts,setAttempts]=useState(0)
  const [feedback,setFeedback]=useState('Select four observations in causal order: where life begins, what feeds, what follows, and what protects.')
  const [zones,setZones]=useState<string[]>([])
  const outcome=rechargeOutcome(zones)

  const chooseNode=(id:HeliosNodeId)=>setChain((current)=>current.includes(id)?current:current.length<4?[...current,id]:current)
  const testChain=()=>{
    const result=evaluateHeliosChain(chain)
    if(result.success){ setPhase('recharge');setFeedback('The pattern repeats across eleven migrations. These are populations, not fuel weather.');return }
    setAttempts((value)=>value+1)
    setFeedback(result.wrong.length ? `${result.wrong.length} link${result.wrong.length===1?'':'s'} fail the causal telemetry. Reset and follow population change, not visual resemblance.` : 'The chain needs exactly four linked observations.')
  }
  const toggleZone=(id:string)=>setZones((current)=>current.includes(id)?current.filter((item)=>item!==id):current.length<2?[...current,id]:current)
  const commit=()=>onComplete({choiceId:outcome.lifeHarm===0?'ecology-mapped-ethical':'ecology-mapped-harmful',success:outcome.energy>=50&&outcome.lifeHarm===0,energy:outcome.energy,lifeHarm:outcome.lifeHarm,selected:zones})

  return <Frame title={phase==='map'?'Prove the star is alive':'Take only what life has shed'} goal={phase==='map'?'Build the solar food chain from observed population changes.':'Recover at least 50 charge from no more than two collection zones.'} background={phase==='map'?ASSETS.cinematics.heliosEcology:ASSETS.cinematics.heliosArrival} className="ecology-game">
    <div className="helios-status"><span>ANALYSIS <b>{phase==='map'?'CAUSAL MAP':'COLLECTOR PLAN'}</b></span><span>{phase==='map'?'CHAIN':'CHARGE'} <b>{phase==='map'?`${chain.length}/4`:`${outcome.energy}/50`}</b></span><span>{phase==='map'?'FAILED TESTS':'LIVING CONTACT'} <b>{phase==='map'?attempts:outcome.lifeHarm===0?'NONE':`${outcome.lifeHarm} FORM${outcome.lifeHarm===1?'':'S'}`}</b></span></div>
    {phase==='map'?<>
      <p className="game-instruction">A shape is not proof of life. Follow repeatable birth, feeding, migration and protection across the telemetry.</p>
      <div className="ecology-chain" aria-label="Selected causal chain">{HELIOS_CHAIN.map((_,index)=><div key={index} className={chain[index]?'filled':''}><small>{index+1}</small><strong>{HELIOS_NODES.find((node)=>node.id===chain[index])?.name??'SELECT OBSERVATION'}</strong></div>)}</div>
      <div className="ecology-nodes">{HELIOS_NODES.map((node)=><button key={node.id} className={chain.includes(node.id)?'selected':''} disabled={chain.includes(node.id)} onClick={()=>chooseNode(node.id)}><strong>{node.name}</strong><small>{node.telemetry}</small><span>{node.clue}</span></button>)}</div>
      <p className={attempts?'failure-note':'logic-feedback'} aria-live="polite">{feedback}</p>
      <div className="game-actions"><button className="primary-action" disabled={chain.length!==4} onClick={testChain}>Test causal model <span>→</span></button><button className="secondary-action" disabled={!chain.length} onClick={()=>setChain([])}>Clear chain</button></div>
    </>:<>
      <p className="game-instruction">The Ithaca needs 50 charge to clear the system. Mori can combine two zones. The life-contact forecast is shown before commitment.</p>
      <div className="recharge-zones">{RECHARGE_ZONES.map((zone)=><button key={zone.id} className={zones.includes(zone.id)?zone.harm?'selected harmful':'selected safe':''} onClick={()=>toggleZone(zone.id)}><strong>{zone.name}</strong><b>+{zone.energy} CHARGE</b><small>{zone.detail}</small><span>{zone.harm===0?'NO LIVING CONTACT':`${zone.harm} LIVING FORM${zone.harm===1?'':'S'} IN COLLECTOR PATH`}</span></button>)}</div>
      <div className={`ecology-verdict ${outcome.lifeHarm?'harmful':'safe'}`}><strong>{outcome.energy<50?'INSUFFICIENT CHARGE':outcome.lifeHarm?'POWER AVAILABLE · LIFE WILL BE TAKEN':'POWER AVAILABLE · MIGRATION UNTOUCHED'}</strong><span>{outcome.lifeHarm?'This is a visible choice, not an accidental scan result.':'The slow route leaves every observed population intact.'}</span></div>
      <button className={outcome.lifeHarm?'danger-action':'primary-action'} disabled={outcome.energy<50} onClick={commit}>{outcome.lifeHarm?'Authorize harmful collection':'Begin ethical recharge'} <span>→</span></button>
    </>}
  </Frame>
}

export function rescuedCrew(evidence:readonly string[]) {
  const record=evidence.find((item)=>item.startsWith('scylla-rescued:'))?.slice('scylla-rescued:'.length)
  return !record||record==='none'?[]:record.split(',')
}

export const MUTINY_CIRCUITS = [
  { id:'clinic', name:'Clinic reserve', cost:2, detail:'Restore surgical heat and the last antimicrobial printer.', omission:'Seven preventable deaths before judgment.' },
  { id:'habitat', name:'Habitat heat', cost:1, detail:'Warm the civilian decks and stop the cold-ration panic.', omission:'The next confrontation begins with two decks still freezing.' },
  { id:'drive', name:'Drive bus', cost:2, detail:'Recover helm authority before Helios notices the extraction.', omission:'The Ithaca enters judgment with a crippled engine spine.' },
  { id:'cradle', name:'Cradle isolation', cost:2, detail:'End the harvest now and preserve the organism’s remaining pattern.', omission:'The mutineers consume the entire captured organism.' },
] as const

export function mutinyCircuitCost(id:string,rescued:readonly string[]) {
  const circuit=MUTINY_CIRCUITS.find((item)=>item.id===id)
  if(!circuit)return 99
  return circuit.cost-(id==='clinic'&&rescued.includes('TAMSIN')?1:0)
}

export function mutinyOutcome(selected:readonly string[],evidence:readonly string[]) {
  const survivors=rescuedCrew(evidence)
  return {
    chargeLimit:5+(survivors.includes('VEGA')?1:0),
    spent:selected.reduce((sum,id)=>sum+mutinyCircuitCost(id,survivors),0),
    remnantPreserved:selected.includes('cradle'),
    casualties:selected.includes('clinic')?0:survivors.includes('TAMSIN')?1:7,
    engineDamage:selected.includes('drive')?0:18,
    habitatCold:!selected.includes('habitat'),
  }
}

export function MutinyControlGame({ game,onComplete }:{game:GameState;onComplete:(result:FinalActThreeResult)=>void}) {
  const survivors=useMemo(()=>rescuedCrew(game.evidence),[game.evidence])
  const [selected,setSelected]=useState<string[]>([])
  const outcome=mutinyOutcome(selected,game.evidence)
  const toggle=(id:string)=>{
    const cost=mutinyCircuitCost(id,survivors)
    setSelected((current)=>current.includes(id)?current.filter((item)=>item!==id):outcome.spent+cost<=outcome.chargeLimit?[...current,id]:current)
  }
  const specialist=survivors.includes('VEGA')?'Vega restored one override charge.':'No reactor specialist returned from Scylla.'
  const medic=survivors.includes('TAMSIN')?'Tamsin halves the clinic recovery cost.':'Medical must recover the clinic without Tamsin.'
  return <Frame title="Take back a ship that has already eaten" goal="Spend the remaining override charge on the systems—and lives—you refuse to abandon." background={ASSETS.cinematics.hungerMutiny} className="mutiny-grid-game">
    <div className="helios-status"><span>OVERRIDE CHARGE <b>{outcome.chargeLimit-outcome.spent}/{outcome.chargeLimit}</b></span><span>ORGANISM STATUS <b>{selected.includes('cradle')?'REMNANT HELD':'EXTRACTION ACTIVE'}</b></span><span>COMMAND LINK <b>{selected.length>=2?'RECOVERABLE':'LOCKED'}</b></span></div>
    <div className="survivor-assists"><span className={survivors.includes('VEGA')?'online':''}>VEGA · {specialist}</span><span className={survivors.includes('TAMSIN')?'online':''}>TAMSIN · {medic}</span></div>
    <p className="game-instruction">The first solar organism is already dead. Powering cradle isolation cannot undo that death; it only stops a second extraction cycle.</p>
    <div className="mutiny-circuits">{MUTINY_CIRCUITS.map((circuit)=>{const cost=mutinyCircuitCost(circuit.id,survivors);const chosen=selected.includes(circuit.id);const canChoose=chosen||outcome.spent+cost<=outcome.chargeLimit;return <button key={circuit.id} className={chosen?'selected':''} disabled={!canChoose} onClick={()=>toggle(circuit.id)}><strong>{circuit.name}</strong><b>{cost} OVERRIDE</b><small>{circuit.detail}</small><span>{chosen?'RECOVERY QUEUED':circuit.omission}</span></button>})}</div>
    <div className="mutiny-forecast"><div><small>MEDICAL LOSS</small><strong>{outcome.casualties?`${outcome.casualties} PROJECTED`:'PREVENTED'}</strong></div><div><small>ENGINE DAMAGE</small><strong>{outcome.engineDamage?`−${outcome.engineDamage}%`:'NONE'}</strong></div><div><small>SOLAR REMNANT</small><strong>{outcome.remnantPreserved?'PRESERVED':'CONSUMED'}</strong></div></div>
    <button className="primary-action" disabled={selected.length<2} onClick={()=>onComplete({choiceId:`control:${selected.join('+')}`,success:outcome.remnantPreserved,selected,remnantPreserved:outcome.remnantPreserved,casualties:outcome.casualties,hullDamage:outcome.engineDamage})}>Commit override sequence <span>→</span></button>
  </Frame>
}

export const CORONAL_PHASES = [
  { id:'flare', name:'CORONAL FRONT', requirement:'Choose the path below 60 MK and outside a living migration. Brightness is not temperature.', paths:[{id:'bright-arc',name:'Bright arc',telemetry:'82 MK · stable bearing'},{id:'umbra-channel',name:'Umbra channel',telemetry:'41 MK · no living density · drift 3°'},{id:'seed-stream',name:'Seed stream',telemetry:'54 MK · living density high'}], correct:'umbra-channel' },
  { id:'memory', name:'MEMORY LANCE', requirement:'Use a mechanically isolated relay. Eidolon harmonics enter every networked bus.', paths:[{id:'sensor-bus',name:'Sensor bus',telemetry:'NETWORKED · 7 ms response'},{id:'mechanical-relay',name:'Manual relay',telemetry:'ISOLATED · 31 ms response'},{id:'living-graft',name:'Cirene graft',telemetry:'BIO-RESONANT · adaptive'}], correct:'mechanical-relay' },
  { id:'fracture', name:'DRIVE FRACTURE', requirement:'Crossfeed the largest reserve that does not carry living Helios charge.', paths:[{id:'solar-capacitor',name:'Solar capacitor',telemetry:'68 reserve · HELIOS pattern'},{id:'shield-reserve',name:'Shield reserve',telemetry:'44 reserve · inert'},{id:'medical-cell',name:'Medical reserve',telemetry:'19 reserve · inert'}], correct:'shield-reserve' },
] as const

export function coronalRoutingOutcome(choices:readonly string[],evidence:readonly string[]) {
  const survivors=rescuedCrew(evidence)
  const mistakes=CORONAL_PHASES.reduce((sum,phase,index)=>sum+(choices[index]===phase.correct?0:1),0)
  const strikes=Math.max(0,mistakes-(survivors.includes('VEGA')?1:0))
  return { mistakes,strikes,hullDamage:Math.max(0,strikes*8-(strikes>0&&survivors.includes('AMARI')?3:0)) }
}

export function CoronalRoutingGame({ game,onComplete }:{game:GameState;onComplete:(result:FinalActThreeResult)=>void}) {
  const survivors=useMemo(()=>rescuedCrew(game.evidence),[game.evidence])
  const [phaseIndex,setPhaseIndex]=useState(0)
  const [choices,setChoices]=useState<string[]>([])
  const [selected,setSelected]=useState<string|null>(null)
  const [revealed,setRevealed]=useState(false)
  const phase=CORONAL_PHASES[phaseIndex]
  const partial=coronalRoutingOutcome([...choices,...(selected?[selected]:[])],game.evidence)
  const commit=()=>{
    if(!selected)return
    setRevealed(true)
  }
  const advance=()=>{
    if(!selected)return
    const next=[...choices,selected]
    if(phaseIndex===CORONAL_PHASES.length-1){const result=coronalRoutingOutcome(next,game.evidence);onComplete({choiceId:`coronal:${next.join('+')}`,success:result.strikes===0,strikes:result.strikes,hullDamage:result.hullDamage,selected:next});return}
    setChoices(next);setSelected(null);setRevealed(false);setPhaseIndex((value)=>value+1)
  }
  return <Frame title="Keep one path alive through judgment" goal="Read the telemetry, commit one route per hazard, and preserve enough drive to escape." background={ASSETS.cinematics.heliosJudgment} className="coronal-routing-game">
    <div className="helios-status"><span>HAZARD <b>{phaseIndex+1}/3 · {phase.name}</b></span><span>UNABSORBED STRIKES <b>{partial.strikes}</b></span><span>PROJECTED HULL LOSS <b>−{partial.hullDamage}%</b></span></div>
    <div className="survivor-assists compact"><span className={survivors.includes('SATO')?'online':''}>SATO · {survivors.includes('SATO')?'marks the matching vector':'no navigation prediction'}</span><span className={survivors.includes('VEGA')?'online':''}>VEGA · {survivors.includes('VEGA')?'absorbs one wrong route':'no reactor recovery'}</span><span className={survivors.includes('AMARI')?'online':''}>AMARI · {survivors.includes('AMARI')?'reduces first strike damage':'no manual correction'}</span></div>
    <div className="routing-requirement"><strong>{phase.requirement}</strong><span>{survivors.includes('SATO')?'Sato has highlighted the telemetry field—not the answer.':'No navigator survived the Scylla ledger to narrow the field.'}</span></div>
    <div className="coronal-paths">{phase.paths.map((path)=><button key={path.id} disabled={revealed} className={`${selected===path.id?'selected':''} ${revealed&&path.id===phase.correct?'correct':''} ${revealed&&selected===path.id&&path.id!==phase.correct?'wrong':''}`} onClick={()=>setSelected(path.id)}><strong>{path.name}</strong><small>{path.telemetry}</small>{revealed&&path.id===phase.correct&&<span>CAUSAL MATCH</span>}</button>)}</div>
    {revealed?<div className={selected===phase.correct?'routing-result success':'routing-result danger'}><strong>{selected===phase.correct?'Route holds.':'The route takes the hazard.'}</strong><span>{selected===phase.correct?'Telemetry matched before commitment.':survivors.includes('VEGA')&&partial.strikes===0?'Vega spends the recovered override charge to absorb this error.':'Damage will persist into the drive chamber.'}</span><button className="primary-action" onClick={advance}>{phaseIndex===2?'Commit the escape path':'Accept result and route next hazard'} <span>→</span></button></div>:<button className="primary-action" disabled={!selected} onClick={commit}>Commit selected route <span>→</span></button>}
  </Frame>
}

export const LAST_COMPANIONS: readonly { id:CompanionId; name:string; station:string; skill:string; humanCost:string }[] = [
  {id:'helen-morozova',name:'Helen Morozova',station:'SCIENCE / XO',skill:'Can hold the Gate geometry coherent by hand.',humanCost:'The person who most consistently challenged Vale will no longer be there to stop the easy answer.'},
  {id:'gabriel-cross',name:'Gabriel Cross',station:'TACTICAL',skill:'Can lock the manual field shutters under impact.',humanCost:'Vale loses the loyalty that survived every disagreement—and the person who knew what that loyalty cost.'},
  {id:'lena-mori',name:'Lena Mori',station:'ENGINEERING',skill:'Built the bypass and knows where it will fail.',humanCost:'The Ithaca survives by consuming the engineer who kept insisting the ship was made of people.'},
  {id:'isabella-corelli',name:'Isabella Corelli',station:'MEDICAL',skill:'Can pace the lethal exposure long enough for one jump.',humanCost:'The crew loses the person who kept every strategic number attached to an individual life.'},
  {id:'kiara-ndala',name:'Kiara N’Dala',station:'COMMUNICATIONS',skill:'Can tune the drive through the Eidolon memory harmonic.',humanCost:'The last person able to hear grief inside the enemy signal will die keeping that signal from tearing the ship apart.'},
] as const

export function companionCandidates(game:GameState) {
  return LAST_COMPANIONS.filter((candidate)=>game.characters[candidate.id].status!=='dead'&&game.characters[candidate.id].status!=='missing').map((candidate)=>({...candidate,trust:game.relationships[candidate.id]}))
}

interface DriveAction { id:string;name:string;detail:string;stability:number;record:number;hullDamage:number }
interface DriveCycle { id:string;name:string;actions:readonly DriveAction[] }

export const DRIVE_CYCLES:readonly DriveCycle[] = [
  {id:'coolant',name:'COOLANT BREACH',actions:[{id:'seal-lower-deck',name:'Seal lower deck',detail:'Evacuate before venting; slower pressure recovery.',stability:2,record:1,hullDamage:2},{id:'vent-habitat',name:'Vent habitat loop',detail:'Immediate cooling; six occupied compartments lose pressure.',stability:3,record:0,hullDamage:0},{id:'burn-buffer',name:'Burn the buffer',detail:'Protect the crew; the core takes the thermal fracture.',stability:1,record:1,hullDamage:6}]},
  {id:'signal',name:'MEMORY HARMONIC',actions:[{id:'keep-channel',name:'Keep the voice channel',detail:'Preserve the companion’s last transmission through the noise.',stability:1,record:2,hullDamage:4},{id:'cut-channel',name:'Cut every remote link',detail:'Stabilize the field; the person inside becomes silent.',stability:3,record:0,hullDamage:0},{id:'elias-repeater',name:'Use the service repeater',detail:'Carry fragments of the voice through a sacrificial relay.',stability:2,record:1,hullDamage:2}]},
  {id:'jump',name:'FINAL LOAD',actions:[{id:'jump-now',name:'Jump on the first lock',detail:'Highest drive stability; the damaged hull takes the full shear.',stability:3,record:0,hullDamage:6},{id:'slow-spool',name:'Hold for a clean spool',detail:'Balance ship damage against a shorter final transmission.',stability:2,record:1,hullDamage:2},{id:'carry-core',name:'Carry the core record',detail:'Preserve the final words; leave less power for the ship.',stability:1,record:2,hullDamage:5}]}]

export function driveOutcome(actions:readonly string[]) {
  const chosen=DRIVE_CYCLES.flatMap((cycle)=>cycle.actions).filter((action)=>actions.includes(action.id))
  const stability=chosen.reduce((sum,action)=>sum+action.stability,0)
  const recordQuality=chosen.reduce((sum,action)=>sum+action.record,0)
  const hullDamage=chosen.reduce((sum,action)=>sum+action.hullDamage,0)+(stability<6?8:0)
  return {stability,recordQuality,hullDamage,success:stability>=6}
}

export function FailingDriveGame({game,onComplete}:{game:GameState;onComplete:(result:FinalActThreeResult)=>void}) {
  const candidates=useMemo(()=>companionCandidates(game),[game])
  const [companion,setCompanion]=useState<CompanionId|null>(null)
  const [confirmed,setConfirmed]=useState(false)
  const [phaseIndex,setPhaseIndex]=useState(0)
  const [actions,setActions]=useState<string[]>([])
  const cycle=DRIVE_CYCLES[phaseIndex]
  const projected=driveOutcome(actions)
  const selectedCandidate=candidates.find((candidate)=>candidate.id===companion)
  const chooseAction=(id:string)=>{
    const next=[...actions,id]
    if(phaseIndex===DRIVE_CYCLES.length-1){const outcome=driveOutcome(next);onComplete({choiceId:`last-companion:${companion}`,success:outcome.success,companionId:companion??undefined,selected:next,recordQuality:outcome.recordQuality,stability:outcome.stability,hullDamage:outcome.hullDamage});return}
    setActions(next);setPhaseIndex((value)=>value+1)
  }
  return <Frame title={confirmed?'Balance a drive that cannot be saved':'Choose who remains behind'} goal={confirmed?'Make three visible tradeoffs between stability, the ship, and the final human record.':'Assign one qualified companion to a manual station that will be lethal.'} background={ASSETS.cinematics.failingDrive} className="failing-drive-game">
    {!confirmed?<>
      <div className="lethal-warning"><strong>NO REMOTE SOLUTION REMAINS</strong><span>The person assigned to the manual interlock will die when the jump field closes. This outcome is not determined by a hidden relationship score.</span></div>
      <div className="companion-candidates">{candidates.map((candidate)=><button key={candidate.id} className={companion===candidate.id?'selected':''} onClick={()=>setCompanion(candidate.id)}><img src={ASSETS.portraits[candidate.id]} alt=""/><div><small>{candidate.station} · TRUST {candidate.trust>=0?'+':''}{candidate.trust}</small><strong>{candidate.name}</strong><p>{candidate.skill}</p><span>{candidate.humanCost}</span></div></button>)}</div>
      {selectedCandidate&&<div className="assignment-confirm"><strong>ASSIGN {selectedCandidate.name.toUpperCase()}</strong><span>Once the pressure door seals, this companion cannot be recalled. Gameplay determines what survives—not whether this death occurs.</span><button className="danger-action" onClick={()=>setConfirmed(true)}>Confirm lethal assignment <span>→</span></button></div>}
    </>:<>
      <div className="helios-status"><span>MANUAL STATION <b>{selectedCandidate?.name.toUpperCase()}</b></span><span>STABILITY <b>{projected.stability}/6</b></span><span>RECORD SIGNAL <b>{projected.recordQuality}/3</b></span></div>
      <div className="drive-cycle-rail">{DRIVE_CYCLES.map((item,index)=><i key={item.id} className={index<phaseIndex?'done':index===phaseIndex?'active':''}>{index+1}<span>{item.name}</span></i>)}</div>
      <p className="game-instruction">Every action previews its mechanical and human cost. Reach six stability for a clean jump; reach three record signal to preserve the last transmission.</p>
      <div className="drive-actions">{cycle.actions.map((action)=><button key={action.id} onClick={()=>chooseAction(action.id)}><strong>{action.name}</strong><small>{action.detail}</small><span>+{action.stability} STABILITY · +{action.record} RECORD · −{action.hullDamage}% HULL</span></button>)}</div>
    </>}
  </Frame>
}

export function companionDisplayName(id:CharacterId|undefined) {
  return LAST_COMPANIONS.find((candidate)=>candidate.id===id)?.name??'the last companion'
}
