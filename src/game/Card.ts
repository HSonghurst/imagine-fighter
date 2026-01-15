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
  // Damage multipliers (reduced by 75%)
  { id: 1, name: "Sharp Arrows", description: "+5% Archer damage", effect: { damageMultiplier: { type: 'archer', value: 1.05 } }, color: '#ef4444' },
  { id: 2, name: "Honed Blades", description: "+5% Swordsman damage", effect: { damageMultiplier: { type: 'swordsman', value: 1.05 } }, color: '#ef4444' },
  { id: 3, name: "Inferno Staff", description: "+5% Mage damage", effect: { damageMultiplier: { type: 'mage', value: 1.05 } }, color: '#ef4444' },
  { id: 4, name: "Heavy Strikes", description: "+5% Knight damage", effect: { damageMultiplier: { type: 'knight', value: 1.05 } }, color: '#ef4444' },
  { id: 5, name: "War Fury", description: "+4% all damage", effect: { damageMultiplier: { type: 'all', value: 1.04 } }, color: '#ef4444' },

  // Health multipliers
  { id: 6, name: "Thick Armor", description: "+6% Swordsman health", effect: { healthMultiplier: { type: 'swordsman', value: 1.06 } }, color: '#22c55e' },
  { id: 7, name: "Fortress Shield", description: "+8% Knight health", effect: { healthMultiplier: { type: 'knight', value: 1.08 } }, color: '#22c55e' },
  { id: 8, name: "Arcane Barrier", description: "+6% Mage health", effect: { healthMultiplier: { type: 'mage', value: 1.06 } }, color: '#22c55e' },
  { id: 9, name: "Fortitude", description: "+4% all health", effect: { healthMultiplier: { type: 'all', value: 1.04 } }, color: '#22c55e' },
  { id: 10, name: "Ranger Endurance", description: "+6% Archer health", effect: { healthMultiplier: { type: 'archer', value: 1.06 } }, color: '#22c55e' },

  // Speed multipliers
  { id: 11, name: "Swift Feet", description: "+6% movement speed", effect: { speedMultiplier: 1.06 }, color: '#3b82f6' },
  { id: 12, name: "Battle Frenzy", description: "+5% attack speed", effect: { attackSpeedMultiplier: 1.05 }, color: '#3b82f6' },
  { id: 13, name: "Lightning Reflexes", description: "+4% speed & attack speed", effect: { speedMultiplier: 1.04, attackSpeedMultiplier: 1.04 }, color: '#3b82f6' },

  // Range multipliers
  { id: 14, name: "Eagle Eye", description: "+8% Archer range", effect: { rangeMultiplier: { type: 'archer', value: 1.08 } }, color: '#a855f7' },
  { id: 15, name: "Far Sight", description: "+8% Mage range", effect: { rangeMultiplier: { type: 'mage', value: 1.08 } }, color: '#a855f7' },
  { id: 16, name: "Extended Reach", description: "+5% all range", effect: { rangeMultiplier: { type: 'all', value: 1.05 } }, color: '#a855f7' },

  // Additional combat cards
  { id: 17, name: "Piercing Shots", description: "+6% Archer damage", effect: { damageMultiplier: { type: 'archer', value: 1.06 } }, color: '#ef4444' },
  { id: 18, name: "Arcane Power", description: "+6% Mage damage", effect: { damageMultiplier: { type: 'mage', value: 1.06 } }, color: '#a855f7' },
  { id: 19, name: "Iron Will", description: "+5% all health", effect: { healthMultiplier: { type: 'all', value: 1.05 } }, color: '#22c55e' },
  { id: 20, name: "Bloodlust", description: "+6% damage, -2% health", effect: { damageMultiplier: { type: 'all', value: 1.06 }, healthMultiplier: { type: 'all', value: 0.98 } }, color: '#dc2626' },
  { id: 21, name: "Sniper Training", description: "+10% Archer range", effect: { rangeMultiplier: { type: 'archer', value: 1.1 } }, color: '#3b82f6' },

  // Status effects (percentage-based, compounding)
  { id: 22, name: "Burning Weapons", description: "+2% burn damage on hit", effect: { burnMultiplier: 1.025 }, color: '#f59e0b' },
  { id: 23, name: "Frost Touch", description: "+4% freeze chance", effect: { freezeChance: 1.04 }, color: '#06b6d4' },
  { id: 24, name: "Poison Tips", description: "+2% poison damage on hit", effect: { poisonMultiplier: 1.025 }, color: '#84cc16' },
  { id: 25, name: "Vampiric Strike", description: "+5% lifesteal", effect: { lifestealPercent: 1.05 }, color: '#dc2626' },
  { id: 26, name: "Shattering Blow", description: "+4% splash damage", effect: { splashMultiplier: 1.04 }, color: '#ec4899' },

  // Special effects
  { id: 27, name: "Critical Mastery", description: "+4% crit chance", effect: { critChance: 1.04 }, color: '#fbbf24' },
  { id: 28, name: "Thorns Aura", description: "+4% thorns damage", effect: { thornsMultiplier: 1.04 }, color: '#10b981' },
  { id: 29, name: "Regeneration", description: "+5% regen rate", effect: { regenMultiplier: 1.05 }, color: '#14b8a6' },

  // More cards
  { id: 30, name: "Glass Cannon", description: "+10% damage, -5% health", effect: { damageMultiplier: { type: 'all', value: 1.1 }, healthMultiplier: { type: 'all', value: 0.95 } }, color: '#f43f5e' },
  { id: 31, name: "Berserker Rage", description: "+8% attack speed", effect: { attackSpeedMultiplier: 1.08 }, color: '#ef4444' },
  { id: 32, name: "Fortified Armor", description: "+8% Knight health", effect: { healthMultiplier: { type: 'knight', value: 1.08 } }, color: '#6b7280' },
  { id: 33, name: "Deadly Precision", description: "+6% crit chance", effect: { critChance: 1.06 }, color: '#fbbf24' },
  { id: 34, name: "Infernal Touch", description: "+5% burn damage", effect: { burnMultiplier: 1.05 }, color: '#f97316' },
  { id: 35, name: "Arctic Chill", description: "+6% freeze chance", effect: { freezeChance: 1.06 }, color: '#06b6d4' },
  { id: 36, name: "Toxic Coating", description: "+5% poison damage", effect: { poisonMultiplier: 1.05 }, color: '#84cc16' },
  { id: 37, name: "Soul Drain", description: "+8% lifesteal", effect: { lifestealPercent: 1.08 }, color: '#7c3aed' },
  { id: 38, name: "Explosive Force", description: "+6% splash damage", effect: { splashMultiplier: 1.06 }, color: '#ec4899' },
  { id: 39, name: "Sword Mastery", description: "+8% Swordsman damage", effect: { damageMultiplier: { type: 'swordsman', value: 1.08 } }, color: '#3b82f6' },
  { id: 40, name: "Knight's Valor", description: "+6% Knight damage", effect: { damageMultiplier: { type: 'knight', value: 1.06 } }, color: '#f59e0b' },
  { id: 41, name: "Marathon Runner", description: "+9% movement speed", effect: { speedMultiplier: 1.09 }, color: '#14b8a6' },
  { id: 42, name: "Mage Supremacy", description: "+9% Mage damage, +5% range", effect: { damageMultiplier: { type: 'mage', value: 1.09 }, rangeMultiplier: { type: 'mage', value: 1.05 } }, color: '#a855f7' },

  // Ability cards (unchanged - these are boolean toggles)
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
