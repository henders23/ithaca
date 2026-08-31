import type { GameState } from '../state/types.js'
import { ASSETS, type DialogueSceneData, type InterludeData, type SliceScreenId } from './content.js'
import { companionDisplayName, rescuedCrew, type CompanionId } from './ActThreeFinalGames.js'

export const ACT_THREE_FINAL_INTERLUDES: Record<'interlude-22'|'interlude-23'|'interlude-24'|'interlude-25',InterludeData> = {
  'interlude-22': {id:'interlude-22',incomingBeat:22,chapter:'THE LIVING SUN',headline:'After the teeth, a light that behaves like mercy.',elapsed:'SHIPBOARD DAY 437 · 03:12 AFTER SCYLLA',location:'HELIOS SYSTEM · INNER MAGNETIC SHELF',background:ASSETS.cinematics.heliosArrival,recap:'The Ithaca escaped the Twin Terrors and carried a ledger of returned and abandoned names into the system TIRESIAS identified as the final fuel point. The ship is damaged, the pursuing Host is close, and the star ahead contains enough energy to end every material shortage.',situation:['Coherent plasma forms migrate through the corona in repeating generations.','The surviving fuel reserve cannot sustain both life support and another jump.','TIRESIAS gave one absolute constraint: the living sun must not be consumed.'],objective:'Determine what is alive, find a non-lethal source of charge, and make the prohibition understandable before hunger tests it.',continueLabel:'Enter the Helios system'},
  'interlude-23': {id:'interlude-23',incomingBeat:23,chapter:'THE HUNGER MUTINY',headline:'Understanding the rule did not warm the ship.',elapsed:'SIX DAYS IN HELIOS SHADOW · RATION CYCLE 03',location:'CSV ITHACA · HABITAT DECKS BELOW 6°C',background:ASSETS.cinematics.hungerMutiny,recap:'The science team proved that the solar forms are born, feed, migrate and protect their young. Vale prohibited harvesting them. Six days later the slow ethical recharge is incomplete, the clinic reserve is failing, and every officer asking for patience is standing in a compartment that still has heat.',situation:['A lower-deck team has captured one small grazer inside the fuel cradle.','Vale is recovering from Choir exposure and command authority has been spoofed.','The first extraction pulse has already killed the organism; further cycles are imminent.'],objective:'Recover ship control, decide which human systems receive the remaining override charge, and confront responsibility without inventing an innocent version.',continueLabel:'Answer the lower-deck alarm'},
  'interlude-24': {id:'interlude-24',incomingBeat:24,chapter:'JUDGMENT OF THE STAR',headline:'Every world in the system turns toward the wound.',elapsed:'00:04:09 AFTER FIRST EXTRACTION',location:'HELIOS CORONA · HOST INTERCEPT RANGE',background:ASSETS.cinematics.heliosJudgment,recap:'A solar organism has been consumed aboard the Ithaca. Whether Vale stopped the later extraction, condemned the mutineers or accepted command responsibility, the first death remains visible to the intelligence distributed through Helios. The star is reorganising its entire ecology around the ship.',situation:['Helios has sealed every ordinary route with coordinated coronal life.','The Tidefather has entered the system behind the Ithaca with the Eidolon Host.','Combat can open a corridor, but another strike on the solar nurseries would repeat the crime.'],objective:'Face two claims of vengeance, disable only what blocks escape, and keep one drive path alive through the corona.',continueLabel:'Receive both accusers'},
  'interlude-25': {id:'interlude-25',incomingBeat:25,chapter:'THE LAST COMPANION',headline:'The ship escaped judgment. The drive did not.',elapsed:'00:02:44 AFTER CORONAL EXIT',location:'CSV ITHACA · DRIVE CORE MANUAL ACCESS',background:ASSETS.cinematics.failingDrive,recap:'The Ithaca crossed between Helios and the Eidolon Host with most of its alien modifications burned away. The hull is a crippled core, casualties fill the unpowered decks, and the Gate-altered drive is collapsing around a manual interlock no remote system can reach.',situation:['One person must remain inside the lethal field for the emergency jump.','Every qualified companion understands the assignment and its certain outcome.','The remaining control decisions determine ship damage and whether the final voice survives.'],objective:'Choose who remains, balance the failing drive without hiding the cost, and let the crew hear what this voyage has made of the relationship.',continueLabel:'Open the manual-access briefing'},
}

export const ACT_THREE_FINAL_SCENES = {
  'b22-arrival': {beat:'BEAT 22 · ARRIVAL',chapter:'THE LIVING SUN',title:'The first thing the star does is make room',background:ASSETS.cinematics.heliosArrival,lines:[
    {speaker:'narrator',name:'FORWARD OBSERVATION',cue:'CORONAL SHELF · MAGNETIC CALM',text:'After Scylla, the windows fill with gold. Thousands of luminous forms part around the Ithaca and close the gap behind it without touching the hull.',cutaway:{image:ASSETS.cinematics.heliosArrival,label:'HELIOS SYSTEM',caption:'No human chart distinguishes the star from the populations moving across it.'}},
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'The passive collectors are climbing. If this is weather, it can feed us before the cold decks lose another ten degrees.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Weather does not slow for its young. That large form just moved across a flare to shadow the shoal behind it.'},
    {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'The six from Scylla need heat, marrow stimulant and a clinic that is not deciding which beds can freeze.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Then we learn the difference between what Helios gives off and what lives inside it. Nobody opens a collector until the distinction is proven.'},
    {speaker:'helios',name:'HELIOS · PATTERN UNTRANSLATED',station:'DISTRIBUTED SOLAR INTELLIGENCE',text:'A migration the size of a continent turns one degree toward the ship. N’Dala records the movement as attention, not threat.'},
  ],continueLabel:'Map the living system'},
  'b22-prohibition': {beat:'BEAT 22 · RECOGNITION',chapter:'THE LIVING SUN',title:'A rule the hungry can understand',background:ASSETS.cinematics.heliosEcology,lines:[
    {speaker:'narrator',name:'SCIENCE RECORD',text:'Birth. Feeding. Distress. Protection. The four events repeat across eleven migrations, and the word resource disappears from Morozova’s report.',cutaway:{image:ASSETS.cinematics.heliosEcology,label:'OBSERVATION DECK',caption:'The smallest seed shoals hide in the wake of the returning Ithaca collectors.'}},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Eleven migrations. Grazers feed. Shepherds move the young out of flares. The largest body just changed course to shade the smallest. Mark the system inhabited.'},
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'The empty wake can charge us slowly. Six days, if habitat accepts cold rationing. Four hours if I lower a collector into the nursery.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Say the second number on every deck. If command conceals the easy route, rumour will discover it before the rule.'},
    {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'And say what six days means in the clinic. A prohibition earns trust only when it names who is being asked to suffer for it.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Then this order goes out with the ecology and the ration ledger. No living solar form will be used as fuel.'},
  ],choices:[
    {id:'publish-prohibition',label:'Publish the proof and the cost',detail:'Give every deck the ecology, the six-day ration forecast and the absolute ban on living harvest.'},
    {id:'ratify-prohibition',label:'Ask the crew to ratify it',detail:'Keep the ban active, but make the suffering and enforcement plan a recorded crew decision.'},
    {id:'command-prohibition',label:'Issue a direct command ban',detail:'Protect Helios immediately while withholding operational details that could enable a later breach.'},
  ]},
  'b23-crisis': {beat:'BEAT 23 · SIX DAYS LATER',chapter:'THE HUNGER MUTINY',title:'The alarm begins in a room without heat',background:ASSETS.cinematics.hungerMutiny,lines:[
    {speaker:'narrator',name:'HABITAT DECK NINE',cue:'TEMPERATURE 5.8°C · CLINIC RESERVE 11%',text:'A child’s ration cup has frozen to the table. The lower-deck broadcast shows the cup for eight seconds before it shows the captive light in the fuel cradle.',cutaway:{image:ASSETS.cinematics.hungerMutiny,label:'LOWER DECK FEED',caption:'Security and engineers face one another across a pressure door neither side wants opened by force.'}},
    {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'The clinic lost two patients while command slept. Do not call everyone behind that door irrational because they counted the bodies differently.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'They cloned Vale’s command token, seized engineering and put a living organism in the reactor. Desperation explains the breach. It does not make the weapon disappear.'},
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'First extraction already happened. The organism’s coherence is collapsing, and its energy is keeping the lower decks warm.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'We taught them this was life. We also taught them the officers would decide whose cold mattered. Both lessons arrived at the cradle.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Can we save it?'},
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'No. We can only decide whether its death becomes one act or our new fuel policy. Take back the network before the second pulse.'},
  ],continueLabel:'Recover the power network'},
  'b24-two-accusers': {beat:'BEAT 24 · CONTACT',chapter:'JUDGMENT OF THE STAR',title:'Two claims of vengeance share one channel',background:ASSETS.cinematics.heliosJudgment,lines:[
    {speaker:'narrator',name:'EXTERNAL FEED',cue:'SOLAR COHERENCE EVENT · HOST ARRIVAL',text:'Every corona organism turns toward the Ithaca. Behind the ship, space opens around the Tidefather’s living dreadnought.',cutaway:{image:ASSETS.cinematics.heliosJudgment,label:'THREE-SIDED CONTACT',caption:'The Ithaca occupies the only point where Helios and the Eidolon Host refuse to fire through one another.'}},
    {speaker:'helios',name:'HELIOS · N’DALA TRANSLATION',station:'LIVING STAR',text:'Small hunger entered. Small hunger named the light empty. One child-form ended inside the dark machine.'},
    {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS / XENOLOGY',text:'It is not calling the organism property. The nearest translation is child-form—or future that had begun.'},
    {speaker:'tidefather',name:'TIDEFATHER',station:'EIDOLON HOST',text:'Now another world knows the shape of your necessity, Alexander Vale. Tell it how quickly remorse becomes fuel.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'Host anchors aft. Coronal lances ahead. I can disable both, but the solar nursery sits inside the firing solution.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Then the nursery is not a target. If protecting it makes escape harder, that difficulty is part of what accountability means.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Mark every living shoal protected. Open a corridor, not a grave.'},
  ],continueLabel:'Enter the judgment corridor'},
  'b25-volunteers': {beat:'BEAT 25 · MANUAL ACCESS',chapter:'THE LAST COMPANION',title:'Nobody waits to be ordered',background:ASSETS.cinematics.failingDrive,lines:[
    {speaker:'narrator',name:'DRIVE CORE',cue:'REMOTE PATHS LOST · ONE MANUAL STATION',text:'The schematic stops pretending. A single figure must remain at the centre while the jump field closes around them.',cutaway:{image:ASSETS.cinematics.failingDrive,label:'MANUAL INTERLOCK',caption:'The safe-side pressure door cannot reopen after the first stabilisation cycle.'}},
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'One clean jump is still possible. The interlock has to be held through all three load changes. Radiation is lethal before the second.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'I can hold a shutter. Do not turn this into a speech about whose station is indispensable.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'And do not let a relationship score make the choice invisibly. Every qualified person should be named with the exact loss.'},
    {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'There is no treatment after exposure. Whoever goes in is not being risked. They are being asked to die.'},
    {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS',text:'The field can carry a final channel if the ship spends stability to preserve it. Silence is safer. It is not neutral.'},
    {speaker:'elias',name:'ELIAS',station:'SHIP INTELLIGENCE',text:'The Gate scar rejects synthetic control after 0.7 seconds. I can preserve the record, Captain. I cannot replace the person at the interlock.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Show me every volunteer. Show the crew what each choice costs before I make it.'},
  ],continueLabel:'Review the volunteers'},
} as const satisfies Partial<Record<SliceScreenId,DialogueSceneData>>

function evidenceNumber(game:GameState,prefix:string,defaultValue=0){const value=game.evidence.find((item)=>item.startsWith(prefix))?.slice(prefix.length);return value?Number(value):defaultValue}
function choiceFor(game:GameState,activityId:string){return [...game.decisions].reverse().find((decision)=>decision.activityId===activityId)?.choiceId}

export function livingSunInterlude(game:GameState):InterludeData {
  const rescued=rescuedCrew(game.evidence)
  const abandoned=game.evidence.find((item)=>item.startsWith('scylla-abandoned:'))?.slice('scylla-abandoned:'.length)??'none'
  return {...ACT_THREE_FINAL_INTERLUDES['interlude-22'],recap:`The Ithaca escaped the Twin Terrors with ${rescued.length} of six captives returned. ${abandoned==='none'?'No rescue channel was left behind.':`The ledger still carries ${abandoned.replaceAll(',', ', ')} inside Scylla.`} The route now reaches the living sun TIRESIAS forbade the crew to consume.`,situation:[`${rescued.length} rescued specialist${rescued.length===1?' is':'s are'} aboard; their abilities can still change later survival.`,ACT_THREE_FINAL_INTERLUDES['interlude-22'].situation[1],ACT_THREE_FINAL_INTERLUDES['interlude-22'].situation[2]]}
}

export function mutinyConfrontationScene(game:GameState):DialogueSceneData {
  const remnant=game.flags.includes('helios-remnant-preserved')
  const casualties=evidenceNumber(game,'hunger-casualties:')
  return {beat:'BEAT 23 · CONFRONTATION',chapter:'THE HUNGER MUTINY',title:remnant?'The cradle is closed around what remains':'The cradle is empty and the lower decks are warm',background:ASSETS.cinematics.hungerMutiny,lines:[
    {speaker:'narrator',name:'ENGINEERING JUNCTION',text:`Command authority returns. ${remnant?'Cradle isolation holds a fading remnant of the organism’s pattern.':'The second extraction finishes before the override reaches the cradle.'} ${casualties?`${casualties} clinic death${casualties===1?'':'s'} remain in the recovery ledger.`:'The clinic reserve is restored.'}`},
    {speaker:'narrator',name:'CREW DELEGATE · IMANI ROOK',text:'We heard the ecology lesson. We also heard people coughing in rooms command had stopped entering. I opened the door. Forty-one people helped me keep it open.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'You copied a command token and seized a reactor. Give me the names of everyone who touched the access chain.'},
    {speaker:'isabella-corelli',name:'CORELLI',station:'MEDICAL',text:'The names include my orderlies. They watched a patient die beside enough energy to heat a world, and they made the life outside count less.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:'Vale made the prohibition visible. He did not make its burden shared. That is not permission for what happened; it is part of its cause.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'The organism was alive. People aboard were dying. Neither fact erases the other. What enters the record now?'},
  ],choices:[
    {id:'accept-command-failure',label:'Accept command’s share of the failure',detail:'Stop further harvest, pardon the network and record that unequal suffering made the breach foreseeable.'},
    {id:'condemn-harvest-leaders',label:'Condemn the people who opened the cradle',detail:'Preserve the prohibition through confinement, while recording hunger as context rather than innocence.'},
    {id:'share-judgment-with-crew',label:'Submit judgment to a crew tribunal',detail:'Keep the accused confined temporarily and let every deck hear the evidence before punishment is decided.'},
  ]}
}

export function heliosAwakensScene(game:GameState):DialogueSceneData {
  const judgment=choiceFor(game,'mutiny-confrontation')
  const remnant=game.flags.includes('helios-remnant-preserved')
  return {beat:'BEAT 23 · CONSEQUENCE',chapter:'THE HUNGER MUTINY',title:'The star does not distinguish the hand from the ship',background:ASSETS.cinematics.heliosJudgment,lines:[
    {speaker:'narrator',name:'CORONAL TELEMETRY',text:'The migration stops. Not slows—stops. Across eleven million kilometres, every living vector aligns with the Ithaca.'},
    {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS',text:remnant?'The preserved pattern is transmitting distress. Helios can hear exactly how long we kept taking after it began.':'The cradle is silent, but the extraction waste carries a population signature. Helios is reconstructing what ended here.'},
    {speaker:'helios',name:'HELIOS · FIRST TRANSLATION',station:'LIVING STAR',text:'One dark body. Many hands. Hunger spoke through all of them.'},
    {speaker:'helen-morozova',name:'MOROZOVA',station:'SCIENCE / XO',text:judgment==='accept-command-failure'?'It heard the part of the record where command included itself. That is not forgiveness. It is at least the correct number of responsible people.':'It is treating the Ithaca as one organism because that is how our power and orders reached the cradle.'},
    {speaker:'gabriel-cross',name:'CROSS',station:'TACTICAL',text:'The corona is closing. Host contacts are entering behind us. We have four minutes before grief arrives from both directions.'},
  ],continueLabel:'Face the awakened star'}
}

export function judgmentAftermathScene(game:GameState):DialogueSceneData {
  const strikes=evidenceNumber(game,'coronal-strikes:')
  const survivors=rescuedCrew(game.evidence)
  const remnant=game.flags.includes('helios-remnant-preserved')
  return {beat:'BEAT 24 · AFTERMATH',chapter:'JUDGMENT OF THE STAR',title:'Survival has stopped resembling victory',background:ASSETS.cinematics.heliosJudgment,lines:[
    {speaker:'narrator',name:'DAMAGE CONTROL',text:`The Ithaca clears the corona with ${strikes} routing strike${strikes===1?'':'s'}. Most alien modifications burn away. The hull reports itself as a ship only because the command core still answers.`},
    ...(survivors.includes('TAMSIN')?[{speaker:'narrator' as const,name:'TAMSIN · MEDICAL LINK',text:'Tamsin reaches the exposed decks before the pressure wave. Nine people who would have entered the casualty count remain alive.'}]:[{speaker:'isabella-corelli' as const,name:'CORELLI',station:'MEDICAL',text:'The exposed-deck casualties arrived without Tamsin. I need command to hear the names before engineering gives us another number.'}]),
    {speaker:'lena-mori',name:'MORI',station:'ENGINEERING',text:'Drive core is still turning, but the manual interlock has fused open. One jump, if someone holds the field from inside.'},
    {speaker:'kiara-ndala',name:'N’DALA',station:'COMMUNICATIONS',text:remnant?'Helios took the preserved remnant from our wake. It carries the pattern back toward the nursery.':'Helios follows, but one nursery shoal survived the corridor. The life we did not fire on is still moving.'},
    {speaker:'tidefather',name:'TIDEFATHER · FADING CARRIER',station:'EIDOLON HOST',text:'You have learned to preserve one child while carrying the death of another. Continue, Alexander Vale. Learn whether that is change.'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:'Seal the combat log. Open the drive core. No victory announcement.'},
  ],continueLabel:'Go to the failing drive'}
}

const WORDS:Record<CompanionId,{trust:string;mixed:string;wounded:string}> = {
  'helen-morozova':{trust:'You finally let the cost be visible before the choice. Keep doing that when I am not there to demand it.',mixed:'Do not make my death evidence that you were right. Make it the last decision nobody aboard had to misunderstand.',wounded:'You listened when the answer could no longer save me. Learn to arrive earlier for the people who remain.'},
  'gabriel-cross':{trust:'I followed because loyalty could still mean telling you no. Do not surround yourself with people who only remember the first half.',mixed:'We survived every enemy except the part of command that needed certainty. Let the next captain doubt sooner.',wounded:'I gave you obedience until it became easier than judgment. Do not call that friendship after I am gone.'},
  'lena-mori':{trust:'The ship was always us, Alex. If you get them home, let them leave it without owing the metal anything.',mixed:'Stop calling a system saved until you have counted who stayed inside it. That is the whole lesson.',wounded:'You kept spending the ship after I told you it was people. I hope this is the last time the metaphor needs a body.'},
  'isabella-corelli':{trust:'You know every life cannot be saved. The test was whether each life stayed singular while you chose. Keep them singular.',mixed:'Do not triage your grief into useful and useless. Let this hurt without turning it into an order.',wounded:'You learned my patients’ names when their deaths became strategy. Learn the living ones before they become necessary.'},
  'kiara-ndala':{trust:'The Tidefather was grief before he was an enemy. You were grief before you were a captain. Keep translating both.',mixed:'A signal is not understood because you can repeat it. Answer what it asked of you when you reach home.',wounded:'You heard every warning and kept choosing when it would become real. Let the next voice change you before it has to die.'},
}

export function lastWordsScene(game:GameState):DialogueSceneData {
  const choice=choiceFor(game,'failing-drive')??'last-companion:lena-mori'
  const id=choice.slice('last-companion:'.length) as CompanionId
  const name=companionDisplayName(id)
  const relation=game.relationships[id]
  const words=relation>=3?WORDS[id].trust:relation<=-2?WORDS[id].wounded:WORDS[id].mixed
  const record=game.flags.includes('last-companion-record-preserved')
  return {id:'b25-last-words',beat:'BEAT 25 · FINAL TRANSMISSION',chapter:'THE LAST COMPANION',title:record?`${name} remains on the channel`:'Only fragments cross the closing field',location:'DRIVE CORE · MANUAL INTERLOCK',sceneType:'private',background:ASSETS.cinematics.failingDrive,lines:[
    {speaker:'narrator',name:'MANUAL INTERLOCK',text:`The pressure door seals with ${name} inside. The radiation badge crosses lethal exposure before the second load cycle.`,shot:'wide'},
    {speaker:id,name:name.toUpperCase(),station:'DRIVE CORE · MANUAL STATION',text:record?words:'The carrier breaks the sentence into light, breath and one surviving word: “home.”',emotion:'exhausted',pause:'held',shot:'close'},
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:`${name.split(' ')[0]}—the field is stable. Come back to the door.`,emotion:'grieving'},
    {speaker:id,name:name.toUpperCase(),station:'DRIVE CORE · MANUAL STATION',text:record?'No. Don’t make the last order a lie. Commit the jump.':'The response is mostly static. A hand remains visible on the manual interlock.',emotion:'exhausted',pause:'silence'},
    {speaker:'narrator',name:'DRIVE CONTROL',text:'The jump field closes. The manual station disappears inside white light. The Ithaca moves again with one fewer voice aboard.',pause:'silence',shot:'wide'},
  ],moments:[{id:'last-channel',afterLine:1,prompt:`There is still a live channel to ${name}. Vale has time for one sentence.`,choices:[
    {id:'say-i-am-here',label:'“I’m here.”',detail:'Offer presence without turning the last seconds into another command.',character:id,axis:'intimacy',delta:1,response:{speaker:id,name:name.toUpperCase(),station:'DRIVE CORE',text:'I know.',emotion:'exhausted',pause:'silence',shot:'close'}},
    {id:'ask-for-telemetry',label:'Ask for the field reading',detail:'Keep both of them inside the work because the personal sentence will not come.',character:id,axis:'resentment',delta:1,response:{speaker:id,name:name.toUpperCase(),station:'DRIVE CORE',text:'Stable enough. You can stop being captain for five seconds.',emotion:'exhausted'}},
    {id:'use-first-name',label:`Say “${name.split(' ')[0]}”`,detail:'Say only the name and let the person decide what it means.',character:id,axis:'trust',delta:1,response:{speaker:'narrator',name:'COMMAND CHANNEL',text:`Vale says “${name.split(' ')[0]}.” Nothing follows it.`,pause:'silence',shot:'reaction'}},
  ]}],continueLabel:'Record the death'}
}

export function companionMemorialScene(game:GameState):DialogueSceneData {
  const choice=choiceFor(game,'failing-drive')??'last-companion:lena-mori'
  const id=choice.slice('last-companion:'.length) as CompanionId
  const name=companionDisplayName(id)
  const medicalWitness=id==='isabella-corelli'
    ? {speaker:'lena-mori' as const,name:'MORI',station:'ENGINEERING',text:'Nobody call this a clean exchange. The drive is turning. That does not make the person inside it into fuel we were entitled to spend.'}
    : {speaker:'isabella-corelli' as const,name:'CORELLI',station:'MEDICAL',text:'Nobody say “gave their life” as if we received something simple. They were asked. They answered. We continue with the debt intact.'}
  const commandWitness=id==='helen-morozova'
    ? {speaker:'gabriel-cross' as const,name:'CROSS',station:'TACTICAL',text:'Her station remains dark. Nobody moves a new name into it before we have learned what her disagreement was protecting.'}
    : {speaker:'helen-morozova' as const,name:'MOROZOVA',station:'SCIENCE / XO',text:'We will not turn the last words into doctrine. They belonged to one relationship at one ending.'}
  return {beat:'BEAT 25 · AFTERMATH',chapter:'THE LAST COMPANION',title:'The crew leaves one place unfilled',background:ASSETS.cinematics.lastCompanionMemorial,lines:[
    {speaker:'narrator',name:'OBSERVATION DECK',text:`No formal service is possible. The crew places ${name}’s empty jacket beside an extinguished work lamp and stands until the deck loses heat.`,cutaway:{image:ASSETS.cinematics.lastCompanionMemorial,label:'NO CEREMONY',caption:'The command log holds forty-seven seconds of silence after the final name is entered.'}},
    medicalWitness,
    commandWitness,
    {speaker:'alexander-vale',name:'VALE',station:'COMMAND',text:`Enter ${name} as dead. Not missing. Not presumed. I was there.`},
    {speaker:'narrator',name:'AFT WINDOW',text:'A thin golden filament moves beyond the cracked glass. Helios recedes. Ahead, an impossible blue ocean appears where empty space should be.'},
  ],continueLabel:'Follow the impossible ocean'}
}
