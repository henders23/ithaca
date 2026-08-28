import { useMemo, useState } from 'react'

export interface ArchiveGameResult { choiceId: string; success: boolean }

function Frame({ title, goal, children }: { title: string; goal: string; children: React.ReactNode }) {
  return <section className="archive-game"><header><h1>{title}</h1><strong>OBJECTIVE · {goal}</strong></header>{children}</section>
}

export function RunDarkGame({ onComplete }: { onComplete: (result: ArchiveGameResult) => void }) {
  const systems = ['REACTOR', 'LIFE SUPPORT', 'NEURAL NET', 'DRIVE WAKE'] as const
  const safeOrder = ['DRIVE WAKE', 'REACTOR', 'NEURAL NET', 'LIFE SUPPORT']
  const [order, setOrder] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const silence = order.length * 25
  const select = (system: string) => { if (!order.includes(system)) setOrder([...order, system]) }
  const verify = () => {
    const success = order.every((item, index) => item === safeOrder[index])
    if (success || attempts >= 1) onComplete({ choiceId: success ? 'entered-as-dead' : 'wardens-alerted', success })
    else { setAttempts(1); setOrder([]) }
  }
  return <Frame title="Silence the living ship" goal="Shut four signatures down without leaving the crew unconscious before navigation goes dark.">
    <div className="archive-status"><span>SIGNATURE SILENCE <b>{silence}%</b></span><span>CREW WINDOW <b>{Math.max(0, 94 - order.length * 19)} SEC</b></span><span>WARDEN NOTICE <b>{attempts ? 'RISING' : 'DORMANT'}</b></span></div>
    <p className="game-instruction">Mori’s rule: remove what travels far before what keeps people alive. The neural net must fall before life support or eight hundred sleeping minds remain visible.</p>
    <div className="sequence-rail">{[0,1,2,3].map((slot) => <div key={slot}><small>{slot + 1}</small><strong>{order[slot] ?? 'SELECT SIGNATURE'}</strong></div>)}</div>
    <div className="archive-options">{systems.map((system) => <button disabled={order.includes(system)} onClick={() => select(system)} key={system}><strong>{system}</strong><small>{system === 'DRIVE WAKE' ? 'Visible across the system' : system === 'REACTOR' ? 'Leaves a thermal heartbeat' : system === 'NEURAL NET' ? 'Eight hundred active patterns' : 'Ninety-four seconds of reserve'}</small></button>)}</div>
    <button className="primary-action" disabled={order.length < 4} onClick={verify}>{attempts ? 'Commit emergency descent' : 'Test death profile'} <span>→</span></button>
  </Frame>
}

const testimony = [
  { id:'nursery', title:'Sanctuary telemetry', detail:'Cell-division pattern logged 11 minutes before firing.' },
  { id:'edit', title:'Intelligence revision', detail:'“Civilian probability” removed after Morozova’s objection.' },
  { id:'order', title:'Admiralty order', detail:'Vale is told the Gate is arming a strategic weapon.' },
  { id:'shot', title:'Vale’s fire order', detail:'The first pylon is destroyed before a second scan.' },
]
export function GateEvidenceGame({ onComplete }: { onComplete: (result: ArchiveGameResult) => void }) {
  const correct = ['nursery','edit','order','shot']
  const [chain,setChain] = useState<string[]>([])
  const [checked,setChecked] = useState(false)
  const match = chain.filter((id,index)=>id===correct[index]).length
  const add=(id:string)=>{if(!chain.includes(id)){setChain([...chain,id]);setChecked(false)}}
  return <Frame title="Reconstruct the crime before memory becomes argument" goal="Order four records by cause—not by the official timestamps that were rewritten.">
    <div className="archive-status"><span>CAUSAL LINKS <b>{checked ? `${match}/4` : 'UNVERIFIED'}</b></span><span>RECORDS <b>{chain.length}/4</b></span><span>OFFICIAL ACCOUNT <b>{checked && match===4 ? 'FALSIFIED' : 'INTACT'}</b></span></div>
    <div className="sequence-rail evidence">{[0,1,2,3].map((slot)=><div key={slot}><small>CAUSE {slot+1}</small><strong>{testimony.find(x=>x.id===chain[slot])?.title ?? 'EMPTY'}</strong></div>)}</div>
    <div className="archive-options">{testimony.map(item=><button disabled={chain.includes(item.id)} onClick={()=>add(item.id)} key={item.id}><strong>{item.title}</strong><small>{item.detail}</small></button>)}</div>
    {checked && match<4 && <p className="failure-note">The chain contradicts itself. The Archive releases the records again; no testimony is lost.</p>}
    <div className="game-actions"><button className="secondary-action" onClick={()=>{setChain([]);setChecked(false)}}>Clear chain</button><button className="primary-action" disabled={chain.length<4} onClick={()=> checked && match===4 ? onComplete({choiceId:'gate-crime-reconstructed',success:true}) : setChecked(true)}>{checked && match===4 ? 'Enter the testimony' : 'Test causal chain'} <span>→</span></button></div>
  </Frame>
}

export function DroneMemoryGame({ onComplete }: { onComplete: (result: ArchiveGameResult) => void }) {
  const nodes=[['VOICE','Rao singing off-key'],['ORDER','Hold the port battery'],['PAIN','Impact without death'],['SELF','I am still here']]
  const [linked,setLinked]=useState<string[]>([])
  const complete=linked.length===4
  return <Frame title="Separate a person from the weapon still obeying for them" goal="Recover four human memory anchors without reconnecting the drone’s fire-control compulsion.">
    <div className="archive-status"><span>PERSONHOOD ANCHORS <b>{linked.length}/4</b></span><span>FIRE CONTROL <b>ISOLATED</b></span><span>VOICE COHERENCE <b>{20+linked.length*20}%</b></span></div>
    <div className="memory-nodes">{nodes.map(([id,detail])=><button className={linked.includes(id)?'linked':''} key={id} onClick={()=>!linked.includes(id)&&setLinked([...linked,id])}><i/><strong>{id}</strong><small>{detail}</small></button>)}</div>
    <blockquote>{linked.length===0 ? '…battery seven awaiting command…' : linked.length<3 ? 'Captain—do not give me another target. I remember enough to be afraid of one.' : 'My name was Anika Rao. The weapon is waiting. I am not.'}</blockquote>
    <button className="primary-action" disabled={!complete} onClick={()=>onComplete({choiceId:'rao-consciousness-recovered',success:true})}>Open a channel to Rao <span>→</span></button>
  </Frame>
}

export function MessageAssemblyGame({ onComplete }: { onComplete: (result: ArchiveGameResult) => void }) {
  const bands=['VOICE','IMAGE','DATE','AUTHENTICITY']
  const [aligned,setAligned]=useState<string[]>([])
  return <Frame title="Bring one message home from the noise" goal="Align the four damaged signal bands while preserving gaps the Archive cannot honestly reconstruct.">
    <div className="archive-status"><span>LOCKED BANDS <b>{aligned.length}/4</b></span><span>FALSE DETAIL <b>0%</b></span><span>SOURCE DISTANCE <b>UNKNOWN</b></span></div>
    <div className="signal-bands">{bands.map((band,index)=><button className={aligned.includes(band)?'aligned':''} onClick={()=>!aligned.includes(band)&&setAligned([...aligned,band])} key={band}><span style={{'--wave':`${18+index*9}px`} as React.CSSProperties}/><strong>{band}</strong><small>{aligned.includes(band)?'PHASE LOCKED':'Follow the repeating human cadence'}</small></button>)}</div>
    <p className="message-preview">{aligned.length<2 ? '…Dad… if this reaches…' : aligned.length<4 ? 'Dad, they teach the Gate at school now. Grandmother said the story was wrong…' : 'Dad, Grandmother died believing you would come back. I don’t know which version of you I’m waiting for. Come home alive enough to tell me the truth.'}</p>
    <button className="primary-action" disabled={aligned.length<4} onClick={()=>onComplete({choiceId:'elara-message-restored',success:true})}>Play the recovered message <span>→</span></button>
  </Frame>
}

export function ProbabilityGame({ onComplete }: { onComplete: (result: ArchiveGameResult) => void }) {
  const futures=[
    {id:'choir',label:'THE CHOIR',facts:['route','crew']},
    {id:'scylla',label:'TWIN TERRORS',facts:['route','loss']},
    {id:'helios',label:'LIVING SUN',facts:['fuel','warning']},
    {id:'home',label:'EARTH',facts:['route','truth']},
  ]
  const [selected,setSelected]=useState<string[]>([])
  const viable=useMemo(()=>selected.includes('choir')&&selected.includes('scylla')&&selected.includes('helios')&&!selected.includes('home'),[selected])
  const toggle=(id:string)=>setSelected(value=>value.includes(id)?value.filter(x=>x!==id):[...value,id])
  return <Frame title="Find the future that does not contradict itself" goal="Select the three events that can share one route; direct Earth is the comforting impossibility.">
    <div className="archive-status"><span>ACTIVE FUTURES <b>{selected.length}</b></span><span>CONTRADICTIONS <b>{selected.includes('home') ? 2 : selected.length===3&&!viable ? 1 : 0}</b></span><span>SURVIVAL RANGE <b>{viable?'11–37%':'UNRESOLVED'}</b></span></div>
    <p className="game-instruction">Constraints: the route must find fuel after the twin hazard; the Choir is encountered before any living star; Earth cannot be reached before the captain loses command of the present course.</p>
    <div className="future-cards">{futures.map(f=><button className={selected.includes(f.id)?'selected':''} key={f.id} onClick={()=>toggle(f.id)}><small>POSSIBLE EVENT</small><strong>{f.label}</strong><span>{f.facts.join(' · ')}</span></button>)}</div>
    <button className="primary-action" disabled={!viable} onClick={()=>onComplete({choiceId:'probable-route-found',success:true})}>Accept the survivable route <span>→</span></button>
  </Frame>
}
