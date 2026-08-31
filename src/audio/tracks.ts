/**
 * Every piece of audio the campaign can play, declared in one place so tests can
 * assert delivery and the build can fingerprint the files.
 */

export type MusicScene = 'title' | 'voyage' | 'alien' | 'combat'

export interface MusicTrack {
  /** Composition title, shown in the audio panel. */
  title: string
  src: string
  /** Mix level for this track before the player's master music volume. */
  level: number
  /** Where the track belongs in the voyage. */
  role: string
  /**
   * Encounter tracks restart from the top every time the scene is entered so a
   * battle or an alien conversation always opens on the same bar. The title and
   * voyage themes resume instead, because the voyage is continuous.
   */
  restart: boolean
}

export const MUSIC_TRACKS: Readonly<Record<MusicScene, MusicTrack>> = {
  title: { title: 'Glass Moon Relay', src: '/assets/music/glass-moon-relay.mp3', level: 0.62, role: 'Start screen', restart: false },
  voyage: { title: 'Starship Ithaca', src: '/assets/music/starship-ithaca.mp3', level: 0.46, role: 'Default voyage theme', restart: false },
  alien: { title: 'Cirene’s Ark', src: '/assets/music/cirenes-ark.mp3', level: 0.5, role: 'Alien dialogue encounters', restart: true },
  combat: { title: 'Black Banner', src: '/assets/music/black-banner.mp3', level: 0.54, role: 'Combat encounters', restart: true },
} as const

export const MUSIC_SCENES = Object.keys(MUSIC_TRACKS) as readonly MusicScene[]

export const DEFAULT_MUSIC_SCENE: MusicScene = 'voyage'

export type SfxId =
  | 'laserBeam' | 'laserCannon' | 'blaster'
  | 'smallExplosion' | 'mediumExplosion' | 'torpedoExplosion'
  | 'enemyDestroyed' | 'shipDestroyed'
  | 'enemySightedMale' | 'enemySightedFemale'
  | 'uiClick'

export const SFX_SOURCES: Readonly<Record<SfxId, string>> = {
  laserBeam: '/assets/audio/laser_beam.mp3',
  laserCannon: '/assets/audio/laser_cannon.mp3',
  blaster: '/assets/audio/blaster.mp3',
  smallExplosion: '/assets/audio/small_explosion.mp3',
  mediumExplosion: '/assets/audio/medium_explosion.mp3',
  torpedoExplosion: '/assets/audio/torpedo_explosion.mp3',
  enemyDestroyed: '/assets/audio/enemy_destroyed.mp3',
  shipDestroyed: '/assets/audio/ship_destroyed.mp3',
  enemySightedMale: '/assets/audio/enemy_sighted_m.mp3',
  enemySightedFemale: '/assets/audio/enemy_sighted_f.mp3',
  uiClick: '/assets/audio/ui_click.wav',
} as const

/** Battle sprite sheets and flash frames shared by every cinematic combat. */
export const COMBAT_FX = {
  playerBolt: '/assets/fx/player_bolt.png',
  enemyBolt: '/assets/fx/enemy_bolt.png',
  muzzlePlayer: '/assets/fx/muzzle_player.png',
  muzzleEnemy: '/assets/fx/muzzle_enemy.png',
  impactPlayer: '/assets/fx/impact_player.png',
  impactEnemy: '/assets/fx/impact_enemy.png',
  shieldHitPlayer: '/assets/fx/shield_hit_player.png',
  shieldHitEnemy: '/assets/fx/shield_hit_enemy.png',
  explosionOrange: '/assets/fx/explosion_orange.png',
  explosionRed: '/assets/fx/explosion_red.png',
  explosionCapital: '/assets/fx/explosion_capital.png',
} as const

export type ExplosionId = 'orange' | 'red' | 'capital'

export interface ExplosionSheet {
  sheet: string
  columns: number
  rows: number
  /** Milliseconds each cell is held. */
  frameMs: number
}

export const EXPLOSION_SHEETS: Readonly<Record<ExplosionId, ExplosionSheet>> = {
  orange: { sheet: COMBAT_FX.explosionOrange, columns: 8, rows: 2, frameMs: 30 },
  red: { sheet: COMBAT_FX.explosionRed, columns: 8, rows: 2, frameMs: 30 },
  capital: { sheet: COMBAT_FX.explosionCapital, columns: 8, rows: 3, frameMs: 46 },
} as const

export const AUDIO_ASSET_PATHS = [
  ...MUSIC_SCENES.map((scene) => MUSIC_TRACKS[scene].src),
  ...Object.values(SFX_SOURCES),
] as const

export const COMBAT_FX_ASSET_PATHS = Object.values(COMBAT_FX)
