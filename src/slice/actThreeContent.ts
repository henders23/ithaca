import { ASSETS, type DialogueSceneData, type InterludeData } from './content.js'
import type { GameState } from '../state/types.js'

export const ACT_THREE_INTERLUDES={
 'interlude-18':{id:'interlude-18',incomingBeat:18,chapter:'THE CHOIR IN THE DARK',headline:'The first voice on TIRESIAS’s road sounds like the person each listener has lost.',elapsed:'SHIPBOARD DAY 96 · 22:17',location:'CHOIR REACH · PILGRIM DRIFT',background:ASSETS.cinematics.choirInDark,recap:'The Ithaca leaves the Mourning Archive carrying the true Gate record, Elara’s uncertain message and a route that begins inside an intelligent transmission. TIRESIAS warned that the Choir does not deceive by lying. It finds the truest private desire in every listener and removes the reasons to resist it.',situation:['Pilgrim ships are drifting toward the signal with crews alive and engines obedient.','Every Ithaca officer hears a different promise in the same transmission.','The route to the Twin Terrors exists inside one layer of the song.'],objective:'Learn what the Choir has offered the crew, isolate the route-bearing carrier without silencing it completely, and avoid destroying enthralled pilgrims.',continueLabel:'Let the crew describe the song'},
 'interlude-19':{id:'interlude-19',incomingBeat:19,chapter:'THE SILENT PASSAGE',headline:'To map the road, one person must keep listening after everyone else goes deaf.',elapsed:'CHOIR TRANSIT · EXTERNAL CLOCK UNRELIABLE',location:'ITHACA BRIDGE · COMMAND AUDIO ONLY',background:ASSETS.cinematics.silentPassage,recap:'The filter protected most of the crew, but the route carrier responds only to the mind that ordered the Tide Gate attack. Vale remains connected while every other station goes silent. The Choir now controls what the bridge appears to show him.',situation:['False controls feel smoother and more complete than damaged real systems.','The Choir can reproduce Elara’s voice but not Ithaca’s physical inertia.','A useful route must be separated from the personal promise carrying it.'],objective:'Navigate using damaged facts instead of perfect reassurance, extract the route constraints, and leave the counterfeit home behind.',continueLabel:'Disconnect the crew'},
 'interlude-20':{id:'interlude-20',incomingBeat:20,chapter:'THE TWIN TERRORS',headline:'The route is real. It passes between two things that have never needed to negotiate.',elapsed:'SHIPBOARD DAY 99 · 04:02',location:'SCYLLA–CHARYBDIS CORRIDOR',background:ASSETS.cinematics.twinTerrors,recap:'Vale escaped the Choir with four route constraints and one temptation that still knows his voice. Ahead, Charybdis pulls the corridor sideways while Scylla waits at the only distance where the singularity cannot reach it. The safe path exists only as a moving balance between them.',situation:['A wide course risks Charybdis taking the entire ship.','A close Scylla course guarantees that exposed compartments can be reached.','The Tidefather’s signal is closing from behind.'],objective:'Choose what kind of risk the crew accepts, balance the ship through the gravity corridor, and break Scylla’s grasp without trying to kill either terror.',continueLabel:'Call the senior officers'},
 'interlude-21':{id:'interlude-21',incomingBeat:21,chapter:'THE SIX TAKEN',headline:'Scylla did not take six crew. It took Sato, Rao, Amari, Noah, Vega and Tamsin.',elapsed:'NINETY-THREE SECONDS AFTER PASSAGE',location:'SCYLLA INTERIOR · RESCUE TELEMETRY',background:ASSETS.cinematics.scyllaRescue,recap:'The Ithaca crossed the corridor, but six living signals remain inside Scylla. Their suit channels are open. The Tidefather’s advance ships will reach weapons range during any rescue attempt, and every tether pulse makes the ship easier to locate.',situation:['All six captives are alive and can hear the command discussion.','The rescue drones have only six powered tether pulses.','Withdrawing immediately preserves the ship but makes the loss a decision, not an accident.'],objective:'Hear each trapped person, choose whether to risk the rescue, and make every recovered or abandoned life persist beyond this scene.',continueLabel:'Open the six channels'},
} as const satisfies Record<string,InterludeData>

export const ACT_THREE_SCENES:Record<string,DialogueSceneData>={
 'b18-promises':{beat:'BEAT 18',chapter:'THE CHOIR IN THE DARK',title:'The same transmission knows seven different definitions of home',background:ASSETS.cinematics.choirInDark,lines:[
  {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS',text:'It is not translating. It is listening first, then becoming the sentence we would least want interrupted.'},
  {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Mine says the missing scan survived. It offers the answer that would prove I could have stopped the Gate.'},
  {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Mine offers a war with a clean enemy. I know exactly why that is tempting. Keep me away from weapons control.'},
  {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'I hear the casualty deck breathing. Every patient. Even the ones I left outside surgery.'},
  {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Elara says she forgives me. The real Elara never promised that. Build the filter before knowing that stops mattering.'},
 ],continueLabel:'Open signal filtration'},
 'b18-aftermath':{beat:'BEAT 18 · AFTERMATH',chapter:'THE CHOIR IN THE DARK',title:'Silence protects the crew but does not make them forget what answered',background:ASSETS.cinematics.choirInDark,lines:[
  {speaker:'narrator',name:'PILGRIM DRIFT',text:'The Ithaca’s counter-signal spreads. Three pilgrim ships cut thrust. Two continue toward the light.'},
  {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS',text:'The route carrier remains. It will only stabilise around the mind that gave the Gate order.'},
  {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Then Vale listens alone. That is a tactical requirement, not a restoration of the secrecy TIRESIAS warned us about.'},
  {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'We disconnect by his order and reconnect by yours. Two keys. No heroic exceptions.'},
  {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Agreed. If I say I can see Earth, assume the Choir has stopped needing subtlety.'},
 ],continueLabel:'Enter the Silent Passage'},
 'b19-aftermath':{beat:'BEAT 19 · AFTERMATH',chapter:'THE SILENT PASSAGE',title:'Vale returns with a route and no proof that every voice left with it',background:ASSETS.cinematics.silentPassage,lines:[
  {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Choir first. Twin hazards next. Fuel beyond them. The living sun is not to be harvested.'},
  {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'State the part you did not put in the route file.'},
  {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Elara was waiting on the bridge. I knew she was false. I still asked what she would forgive.'},
  {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'Knowing a voice is false does not stop the need it found from being real.'},
  {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Proximity alarm. Two contacts large enough to bend the map. We can discuss ghosts after surviving geography.'},
 ],continueLabel:'Reveal the Twin Terrors'},
 'b20-choice':{beat:'BEAT 20',chapter:'THE TWIN TERRORS',title:'There is no safe course—only a choice about who bears the known risk',background:ASSETS.cinematics.twinTerrors,lines:[
  {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'Wide course gives Charybdis a one-in-five chance of taking everything. Close course exposes six compartments to Scylla.'},
  {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Six exposed compartments are a loss we can defend against. A singularity does not care how brave the broadside was.'},
  {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Say it accurately. You prefer a certain risk borne by named people over a smaller chance borne by everyone.'},
  {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'The ship cannot vote as one body when only six decks become the shield.'},
  {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Then the exposed decks hear the choice before I make it.'},
 ],choices:[{id:'scylla-close',label:'Take the close corridor',detail:'Accept certain exposure across six compartments to reduce the risk of losing the entire ship.'},{id:'charybdis-wide',label:'Risk the wide corridor',detail:'Keep Scylla at range but accept a substantial probability that Charybdis takes everybody.'}]},
 'b21-voices':{beat:'BEAT 21',chapter:'THE SIX TAKEN',title:'Six channels open before strategy can turn them into a number',background:ASSETS.cinematics.scyllaRescue,lines:[
  {speaker:'narrator',name:'SATO · NAVIGATION',text:'I can see the passage from inside it. If the drone reaches me, I can guide the others.'},
  {speaker:'narrator',name:'RAO · DRONE WITNESS',text:'Do not save me because I survived once already. Save me if the risk is mine to accept.'},
  {speaker:'narrator',name:'AMARI · PILOT',text:'Noah is two chambers below me. His suit light is still moving.'},
  {speaker:'narrator',name:'NOAH · PASSENGER',text:'Mum said the captain always comes back for the small ships. Does a suit count as a small ship?'},
  {speaker:'narrator',name:'VEGA · REACTOR CHIEF',text:'My tether pack still holds a live cell. Recover me and I can recharge two drones. That is not a request to put me first.'},
  {speaker:'narrator',name:'TAMSIN · MEDIC',text:'I have pressure on both injuries. If my channel goes quiet, it means my hands are still where they need to be.'},
  {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'They can hear us. Whatever we decide, do not discuss acceptable losses as if the channels were closed.'},
  {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Host intercept in four minutes. I can hold a corridor, not stop the war arriving through it. Launch now; every pulse returns with a name or a reason we stopped.'},
 ],continueLabel:'Launch rescue drones'},
}

function decision(game: GameState, beatId: string, activityId: string) {
  return [...game.decisions].reverse().find((item) => item.beatId === beatId && item.activityId === activityId)?.choiceId
}

function evidenceList(game: GameState, prefix: string) {
  const value = [...game.evidence].reverse().find((item) => item.startsWith(prefix))?.slice(prefix.length)
  return !value || value === 'none' ? [] : value.split(',')
}

export function choirAftermathScene(game: GameState): DialogueSceneData {
  const carrierChoice = decision(game, '18-choir-dark', 'filter-choir')
  const carrier = carrierChoice?.startsWith('choir-carrier-')
    ? carrierChoice.replace('choir-carrier-', '').toUpperCase()
    : game.evidence.includes('elara-message-private') ? 'HOME' : game.evidence.includes('elara-message-shared') ? 'TRUTH' : 'PURPOSE'
  const overexposed = game.flags.includes('choir-filter-overexposed')
  return {
    ...ACT_THREE_SCENES['b18-aftermath'],
    lines: [
      { speaker:'narrator', name:'PILGRIM DRIFT', text: overexposed ? 'N’Dala’s emergency lock breaks the nearest pilgrim drives free. Two ships continue toward the light, carrying the cost of the failed counter-phase.' : 'The phase inversion reaches the pilgrim drift. Five engine signatures fall out of formation without a hull being opened.' },
      { speaker:'kiara-ndala', name:'N’DALA', station:'COMMUNICATIONS', text:`The ${carrier} carrier remains audible. We saved the route by leaving one private need inside the circuit.` },
      { speaker:'helen-morozova', name:'MOROZOVA', station:'SCIENCE / XO', text:'Then Vale listens alone. That is a tactical requirement, not a restoration of the secrecy TIRESIAS warned us about.' },
      { speaker:'gabriel-cross', name:'CROSS', station:'TACTICAL', text:'We disconnect by his order and reconnect by yours. Two keys. No heroic exceptions.' },
      { speaker:'alexander-vale', name:'VALE', station:'COMMAND', text:'Agreed. If I say I can see Earth, assume the Choir has stopped needing subtlety.' },
    ],
  }
}

export function silentPassageAftermathScene(game: GameState): DialogueSceneData {
  const compromised = game.flags.includes('choir-navigation-compromised')
  return {
    ...ACT_THREE_SCENES['b19-aftermath'],
    lines: [
      { speaker:'alexander-vale', name:'VALE', station:'COMMAND', text:'Choir first. Twin hazards next. Fuel beyond them. The living sun is not to be harvested.' },
      ...(compromised ? [{ speaker:'lena-mori' as const, name:'MORI', station:'ENGINEERING', text:'The route arrived with an uncommanded correction in the sensor stack. I can isolate it, but the Twin Terrors will see us carrying four percent less hull than the display claims.' }] : []),
      { speaker:'helen-morozova', name:'MOROZOVA', station:'SCIENCE / XO', text:'State the part you did not put in the route file.' },
      { speaker:'alexander-vale', name:'VALE', station:'COMMAND', text:'Elara was waiting on the bridge. I knew she was false. I still asked what she would forgive.' },
      { speaker:'isabella-corelli', name:'CORELLI', station:'MEDICAL', text:'Knowing a voice is false does not stop the need it found from being real.' },
      { speaker:'gabriel-cross', name:'CROSS', station:'TACTICAL', text:'Proximity alarm. Two contacts large enough to bend the map. We can discuss ghosts after surviving geography.' },
    ],
  }
}

export function scyllaRescueInterlude(game: GameState): InterludeData {
  const wide = game.flags.includes('charybdis-wide-course')
  return {
    ...ACT_THREE_INTERLUDES['interlude-21'],
    recap: wide
      ? 'Vale chose the wide course. Charybdis rolled the Ithaca hard enough to tear an evacuation blister free; the correction kept the ship from the singularity and threw six suited people across Scylla’s outer reach. Their channels are still open.'
      : 'Vale chose the close course. The Ithaca crossed beneath Scylla’s grasp, and the exposed compartments paid the risk the officers had named in advance. Six living signals remain inside the creature. Their channels are still open.',
    situation: wide
      ? ['Six captives are alive inside Scylla after the wide-course shear.','Sato can shorten later tether routes; Vega can restore two drone pulses.','The wide course left less time before the pursuing Host reaches weapons range.']
      : ['Six captives are alive inside Scylla after the close passage.','Sato can shorten later tether routes; Vega can restore two drone pulses.','Every additional operation reduces the time before Host intercept and exposes the hull.'],
  }
}

export function rescueAftermathScene(game: GameState): DialogueSceneData {
  const rescued = evidenceList(game, 'scylla-rescued:')
  const abandoned = evidenceList(game, 'scylla-abandoned:')
  const allSaved = rescued.length === 6
  const noneSaved = rescued.length === 0
  const returned = rescued.length ? rescued.join(', ') : 'none'
  const remaining = abandoned.length ? abandoned.join(', ') : 'none'
  return {
    beat:'BEAT 21 · AFTERMATH', chapter:'THE SIX TAKEN', title: allSaved ? 'Six names cross the airlock before the Host opens fire' : 'The rescue ledger has two columns, and neither can be called an accident', background:ASSETS.cinematics.scyllaRescue,
    lines:[
      { speaker:'narrator', name:'RESCUE CONTROL', text:`Returned: ${returned}. Still inside Scylla: ${remaining}. The command log preserves both lists without abbreviation.` },
      ...(allSaved ? [{ speaker:'narrator' as const, name:'NOAH · AIRLOCK TWO', text:'The small ship came back. Tell the captain I counted every light until it did.' }] : []),
      ...(!allSaved && !noneSaved ? [{ speaker:'narrator' as const, name:`LAST OPEN CHANNEL · ${abandoned[0]}`, text:'The tether lights are moving away. I can see who made it. Keep their names in the order you found us.' }] : []),
      ...(noneSaved ? [{ speaker:'narrator' as const, name:'SIX CHANNELS · SIGNAL LOST', text:'Sato, Rao, Amari, Noah, Vega and Tamsin vanish from telemetry one after another. The log keeps the silence between each name.' }] : []),
      { speaker:'isabella-corelli', name:'CORELLI', station:'MEDICAL', text: allSaved ? 'They are alive. That does not make the time we spent free; prepare for the casualties arriving from the hull breach.' : 'Do not let “intercept” become the subject of every sentence. People were left, and the ship was also in danger. Both facts survive.' },
      { speaker:'gabriel-cross', name:'CROSS', station:'TACTICAL', text:`Host weapons range. The rescue cost us time, ${rescued.length} returned lives, and a firing solution the enemy will use immediately.` },
      { speaker:'alexander-vale', name:'VALE', station:'COMMAND', text: allSaved ? 'Record the six as recovered, not saved. Each of them made the sequence possible.' : `Record every returned name. Record every name still inside. Do not replace either list with “six taken.”` },
    ], continueLabel:'Carry the names toward Helios',
  }
}
