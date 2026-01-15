import type { FighterType } from './types';

export interface CardEffect {
  // All multipliers compound (multiply together)
  damageMultiplier?: { type: FighterType | 'all'; value: number };
  healthMultiplier?: { type: FighterType | 'all'; value: number };
  speedMultiplier?: number;
  attackSpeedMultiplier?: number;
  rangeMultiplier?: { type: FighterType | 'all'; value: number };
  spawnWeight?: { type: FighterType; multiplier: number };
  // Status effect chances/multipliers
  burnMultiplier?: number;
  freezeChance?: number;
  poisonMultiplier?: number;
  lifestealPercent?: number;
  splashMultiplier?: number;
  critChance?: number;
  thornsMultiplier?: number;
  regenMultiplier?: number;
  // Ability unlocks
  archerFanAbility?: boolean;
  swordsmanSweepAbility?: boolean;
  knightTauntAbility?: boolean;
  mageConflagrationAbility?: boolean;
}

export interface Card {
  id: number;
  name: string;
  description: string;
  effect: CardEffect;
  color: string;
}

export const ALL_CARDS: Card[] = [
  // Damage multipliers
  { id: 1, name: "Sharp Arrows", description: "+20% Archer damage", effect: { damageMultiplier: { type: 'archer', value: 1.2 } }, color: '#ef4444' },
  { id: 2, name: "Honed Blades", description: "+20% Swordsman damage", effect: { damageMultiplier: { type: 'swordsman', value: 1.2 } }, color: '#ef4444' },
  { id: 3, name: "Inferno Staff", description: "+20% Mage damage", effect: { damageMultiplier: { type: 'mage', value: 1.2 } }, color: '#ef4444' },
  { id: 4, name: "Heavy Strikes", description: "+20% Knight damage", effect: { damageMultiplier: { type: 'knight', value: 1.2 } }, color: '#ef4444' },
  { id: 5, name: "War Fury", description: "+15% all damage", effect: { damageMultiplier: { type: 'all', value: 1.15 } }, color: '#ef4444' },

  // Health multipliers
  { id: 6, name: "Thick Armor", description: "+25% Swordsman health", effect: { healthMultiplier: { type: 'swordsman', value: 1.25 } }, color: '#22c55e' },
  { id: 7, name: "Fortress Shield", description: "+30% Knight health", effect: { healthMultiplier: { type: 'knight', value: 1.3 } }, color: '#22c55e' },
  { id: 8, name: "Arcane Barrier", description: "+25% Mage health", effect: { healthMultiplier: { type: 'mage', value: 1.25 } }, color: '#22c55e' },
  { id: 9, name: "Fortitude", description: "+15% all health", effect: { healthMultiplier: { type: 'all', value: 1.15 } }, color: '#22c55e' },
  { id: 10, name: "Ranger Endurance", description: "+25% Archer health", effect: { healthMultiplier: { type: 'archer', value: 1.25 } }, color: '#22c55e' },

  // Speed multipliers
  { id: 11, name: "Swift Feet", description: "+25% movement speed", effect: { speedMultiplier: 1.25 }, color: '#3b82f6' },
  { id: 12, name: "Battle Frenzy", description: "+20% attack speed", effect: { attackSpeedMultiplier: 1.2 }, color: '#3b82f6' },
  { id: 13, name: "Lightning Reflexes", description: "+15% speed & attack speed", effect: { speedMultiplier: 1.15, attackSpeedMultiplier: 1.15 }, color: '#3b82f6' },

  // Range multipliers
  { id: 14, name: "Eagle Eye", description: "+30% Archer range", effect: { rangeMultiplier: { type: 'archer', value: 1.3 } }, color: '#a855f7' },
  { id: 15, name: "Far Sight", description: "+30% Mage range", effect: { rangeMultiplier: { type: 'mage', value: 1.3 } }, color: '#a855f7' },
  { id: 16, name: "Extended Reach", description: "+20% all range", effect: { rangeMultiplier: { type: 'all', value: 1.2 } }, color: '#a855f7' },

  // Additional combat cards
  { id: 17, name: "Piercing Shots", description: "+25% Archer damage", effect: { damageMultiplier: { type: 'archer', value: 1.25 } }, color: '#ef4444' },
  { id: 18, name: "Arcane Power", description: "+25% Mage damage", effect: { damageMultiplier: { type: 'mage', value: 1.25 } }, color: '#a855f7' },
  { id: 19, name: "Iron Will", description: "+20% all health", effect: { healthMultiplier: { type: 'all', value: 1.2 } }, color: '#22c55e' },
  { id: 20, name: "Bloodlust", description: "+25% damage, -10% health", effect: { damageMultiplier: { type: 'all', value: 1.25 }, healthMultiplier: { type: 'all', value: 0.9 } }, color: '#dc2626' },
  { id: 21, name: "Sniper Training", description: "+40% Archer range", effect: { rangeMultiplier: { type: 'archer', value: 1.4 } }, color: '#3b82f6' },

  // Status effects (percentage-based, compounding)
  { id: 22, name: "Burning Weapons", description: "+10% burn damage on hit", effect: { burnMultiplier: 1.1 }, color: '#f59e0b' },
  { id: 23, name: "Frost Touch", description: "+15% freeze chance", effect: { freezeChance: 1.15 }, color: '#06b6d4' },
  { id: 24, name: "Poison Tips", description: "+10% poison damage on hit", effect: { poisonMultiplier: 1.1 }, color: '#84cc16' },
  { id: 25, name: "Vampiric Strike", description: "+20% lifesteal", effect: { lifestealPercent: 1.2 }, color: '#dc2626' },
  { id: 26, name: "Shattering Blow", description: "+15% splash damage", effect: { splashMultiplier: 1.15 }, color: '#ec4899' },

  // Special effects
  { id: 27, name: "Critical Mastery", description: "+15% crit chance", effect: { critChance: 1.15 }, color: '#fbbf24' },
  { id: 28, name: "Thorns Aura", description: "+15% thorns damage", effect: { thornsMultiplier: 1.15 }, color: '#10b981' },
  { id: 29, name: "Regeneration", description: "+20% regen rate", effect: { regenMultiplier: 1.2 }, color: '#14b8a6' },

  // More cards
  { id: 30, name: "Glass Cannon", description: "+40% damage, -20% health", effect: { damageMultiplier: { type: 'all', value: 1.4 }, healthMultiplier: { type: 'all', value: 0.8 } }, color: '#f43f5e' },
  { id: 31, name: "Berserker Rage", description: "+30% attack speed", effect: { attackSpeedMultiplier: 1.3 }, color: '#ef4444' },
  { id: 32, name: "Fortified Armor", description: "+30% Knight health", effect: { healthMultiplier: { type: 'knight', value: 1.3 } }, color: '#6b7280' },
  { id: 33, name: "Deadly Precision", description: "+25% crit chance", effect: { critChance: 1.25 }, color: '#fbbf24' },
  { id: 34, name: "Infernal Touch", description: "+20% burn damage", effect: { burnMultiplier: 1.2 }, color: '#f97316' },
  { id: 35, name: "Arctic Chill", description: "+25% freeze chance", effect: { freezeChance: 1.25 }, color: '#06b6d4' },
  { id: 36, name: "Toxic Coating", description: "+20% poison damage", effect: { poisonMultiplier: 1.2 }, color: '#84cc16' },
  { id: 37, name: "Soul Drain", description: "+30% lifesteal", effect: { lifestealPercent: 1.3 }, color: '#7c3aed' },
  { id: 38, name: "Explosive Force", description: "+25% splash damage", effect: { splashMultiplier: 1.25 }, color: '#ec4899' },
  { id: 39, name: "Sword Mastery", description: "+30% Swordsman damage", effect: { damageMultiplier: { type: 'swordsman', value: 1.3 } }, color: '#3b82f6' },
  { id: 40, name: "Knight's Valor", description: "+25% Knight damage", effect: { damageMultiplier: { type: 'knight', value: 1.25 } }, color: '#f59e0b' },
  { id: 41, name: "Marathon Runner", description: "+35% movement speed", effect: { speedMultiplier: 1.35 }, color: '#14b8a6' },
  { id: 42, name: "Mage Supremacy", description: "+35% Mage damage, +20% range", effect: { damageMultiplier: { type: 'mage', value: 1.35 }, rangeMultiplier: { type: 'mage', value: 1.2 } }, color: '#a855f7' },

  // Ability cards
  { id: 43, name: "Arrow Storm", description: "Archers fire fan of 5 arrows every 5 attacks", effect: { archerFanAbility: true }, color: '#22c55e' },
  { id: 44, name: "Whirlwind Slash", description: "Swordsmen sweep all nearby enemies every 3 attacks", effect: { swordsmanSweepAbility: true }, color: '#3b82f6' },
  { id: 45, name: "Guardian's Call", description: "Knights taunt enemies and become invulnerable (6s cooldown)", effect: { knightTauntAbility: true }, color: '#f59e0b' },
  { id: 46, name: "Conflagration", description: "Mages cause chain-reaction fire every 10 attacks", effect: { mageConflagrationAbility: true }, color: '#ef4444' },
];

export class TeamModifiers {
  // All multipliers start at 1.0 and compound
  damageMultiplier: Map<FighterType | 'all', number> = new Map();
  healthMultiplier: Map<FighterType | 'all', number> = new Map();
  rangeMultiplier: Map<FighterType | 'all', number> = new Map();
  spawnWeights: Map<FighterType, number> = new Map();
  speedMultiplier: number = 1;
  attackSpeedMultiplier: number = 1;
  burnMultiplier: number = 1;
  freezeChance: number = 1;
  poisonMultiplier: number = 1;
  lifestealPercent: number = 1;
  splashMultiplier: number = 1;
  critChance: number = 1;
  thornsMultiplier: number = 1;
  regenMultiplier: number = 1;
  // Ability unlocks
  archerFanAbility: boolean = false;
  swordsmanSweepAbility: boolean = false;
  knightTauntAbility: boolean = false;
  mageConflagrationAbility: boolean = false;

  applyCard(card: Card): void {
    const e = card.effect;

    // All effects compound (multiply)
    if (e.damageMultiplier) {
      const current = this.damageMultiplier.get(e.damageMultiplier.type) || 1;
      this.damageMultiplier.set(e.damageMultiplier.type, current * e.damageMultiplier.value);
    }
    if (e.healthMultiplier) {
      const current = this.healthMultiplier.get(e.healthMultiplier.type) || 1;
      this.healthMultiplier.set(e.healthMultiplier.type, current * e.healthMultiplier.value);
    }
    if (e.rangeMultiplier) {
      const current = this.rangeMultiplier.get(e.rangeMultiplier.type) || 1;
      this.rangeMultiplier.set(e.rangeMultiplier.type, current * e.rangeMultiplier.value);
    }
    if (e.spawnWeight) {
      const current = this.spawnWeights.get(e.spawnWeight.type) || 1;
      this.spawnWeights.set(e.spawnWeight.type, current * e.spawnWeight.multiplier);
    }
    if (e.speedMultiplier) this.speedMultiplier *= e.speedMultiplier;
    if (e.attackSpeedMultiplier) this.attackSpeedMultiplier *= e.attackSpeedMultiplier;
    if (e.burnMultiplier) this.burnMultiplier *= e.burnMultiplier;
    if (e.freezeChance) this.freezeChance *= e.freezeChance;
    if (e.poisonMultiplier) this.poisonMultiplier *= e.poisonMultiplier;
    if (e.lifestealPercent) this.lifestealPercent *= e.lifestealPercent;
    if (e.splashMultiplier) this.splashMultiplier *= e.splashMultiplier;
    if (e.critChance) this.critChance *= e.critChance;
    if (e.thornsMultiplier) this.thornsMultiplier *= e.thornsMultiplier;
    if (e.regenMultiplier) this.regenMultiplier *= e.regenMultiplier;
    // Ability unlocks
    if (e.archerFanAbility) this.archerFanAbility = true;
    if (e.swordsmanSweepAbility) this.swordsmanSweepAbility = true;
    if (e.knightTauntAbility) this.knightTauntAbility = true;
    if (e.mageConflagrationAbility) this.mageConflagrationAbility = true;
  }

  getDamageMultiplier(type: FighterType): number {
    return (this.damageMultiplier.get(type) || 1) * (this.damageMultiplier.get('all') || 1);
  }

  getHealthMultiplier(type: FighterType): number {
    return (this.healthMultiplier.get(type) || 1) * (this.healthMultiplier.get('all') || 1);
  }

  getRangeMultiplier(type: FighterType): number {
    return (this.rangeMultiplier.get(type) || 1) * (this.rangeMultiplier.get('all') || 1);
  }

  getSpawnWeight(type: FighterType): number {
    return this.spawnWeights.get(type) || 1;
  }
}
