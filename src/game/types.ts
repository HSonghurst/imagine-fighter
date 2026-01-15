export type Team = 'top' | 'bottom';
export type FighterType = 'swordsman' | 'archer' | 'mage' | 'knight' | 'healer';

export interface Position {
  x: number;
  y: number;
}

export interface FighterConfig {
  team: Team;
  x: number;
}
