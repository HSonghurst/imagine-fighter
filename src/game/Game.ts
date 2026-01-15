import { Fighter } from './Fighter';
import { DamageNumberManager } from './DamageNumber';
import { Swordsman } from './Swordsman';
import { Archer } from './Archer';
import { Mage } from './Mage';
import { Knight } from './Knight';
import { Healer } from './Healer';
import { XPOrb } from './XPOrb';
import { Tower } from './Tower';
import { Building, BUILDING_TYPES } from './Building';
import { ALL_CARDS, TeamModifiers } from './Card';
import type { Card } from './Card';
import type { BuildingChoice } from './Building';
import type { Team, FighterType } from './types';

type SelectionType = 'card' | 'building';
type SelectionItem = Card | BuildingChoice;

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private topTeam: Fighter[] = [];
  private bottomTeam: Fighter[] = [];
  private topBuildings: (Building | null)[] = new Array(10).fill(null);
  private bottomBuildings: (Building | null)[] = new Array(10).fill(null);
  private topTower: Tower | null = null;
  private bottomTower: Tower | null = null;
  private xpOrbs: XPOrb[] = [];
  private topRespawnTimers: Map<FighterType, number> = new Map();
  private bottomRespawnTimers: Map<FighterType, number> = new Map();
  private respawnDelay: number = 0; // Instant respawn
  private topKills: number = 0;
  private bottomKills: number = 0;
  private topXP: number = 0;
  private bottomXP: number = 0;
  private topLevel: number = 1;
  private bottomLevel: number = 1;
  private running: boolean = false;
  private lastTime: number = 0;
  private updateCountsCallback: () => void;
  private onWinnerCallback: (team: Team) => void;
  private onSelectionCallback: (team: Team, items: SelectionItem[], type: SelectionType) => void;
  private topModifiers: TeamModifiers = new TeamModifiers();
  private bottomModifiers: TeamModifiers = new TeamModifiers();
  private selectingForTeam: Team | null = null;
  private selectionType: SelectionType | null = null;
  private pendingSelections: { team: Team; type: SelectionType }[] = [];
  private singlePlayerMode: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    updateCounts: () => void,
    onWinner: (team: Team) => void,
    onSelection: (team: Team, items: SelectionItem[], type: SelectionType) => void
  ) {
    this.canvas = canvas;
    this.canvas.width = 900;
    this.canvas.height = 550;
    this.ctx = canvas.getContext('2d')!;
    this.updateCountsCallback = updateCounts;
    this.onWinnerCallback = onWinner;
    this.onSelectionCallback = onSelection;
    this.clear();
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    // Create towers
    this.topTower = new Tower('top', this.canvas.width, this.canvas.height);
    this.bottomTower = new Tower('bottom', this.canvas.width, this.canvas.height);
    // Each team starts with building selection
    this.triggerSelection('top', 'building');
    this.triggerSelection('bottom', 'building');
    this.gameLoop();
  }

  reset(): void {
    this.running = false;
    this.topTeam = [];
    this.bottomTeam = [];
    this.topBuildings = new Array(10).fill(null);
    this.bottomBuildings = new Array(10).fill(null);
    this.topTower = null;
    this.bottomTower = null;
    this.xpOrbs = [];
    this.topKills = 0;
    this.bottomKills = 0;
    this.topXP = 0;
    this.bottomXP = 0;
    this.topLevel = 1;
    this.bottomLevel = 1;
    this.topModifiers = new TeamModifiers();
    this.bottomModifiers = new TeamModifiers();
    this.topRespawnTimers = new Map();
    this.bottomRespawnTimers = new Map();
    this.selectingForTeam = null;
    this.selectionType = null;
    this.pendingSelections = [];
    DamageNumberManager.clear();
    this.clear();
    this.updateCountsCallback();
  }

  isGameRunning(): boolean {
    return this.running;
  }

  getTeamCount(team: Team): number {
    const fighters = team === 'top' ? this.topTeam : this.bottomTeam;
    return fighters.filter(f => !f.isDead).length;
  }

  getBuildingCount(team: Team): number {
    const buildings = team === 'top' ? this.topBuildings : this.bottomBuildings;
    return buildings.filter(b => b !== null).length;
  }

  getKills(team: Team): number {
    return team === 'top' ? this.topKills : this.bottomKills;
  }

  getModifiers(team: Team): TeamModifiers {
    return team === 'top' ? this.topModifiers : this.bottomModifiers;
  }

  isSelectingCard(): boolean {
    return this.selectingForTeam !== null;
  }

  setSinglePlayerMode(enabled: boolean): void {
    this.singlePlayerMode = enabled;
  }

  selectCard(card: Card): void {
    if (!this.selectingForTeam || this.selectionType !== 'card') return;

    const modifiers = this.selectingForTeam === 'top' ? this.topModifiers : this.bottomModifiers;
    modifiers.applyCard(card);

    this.processNextSelection();
  }

  selectBuilding(building: BuildingChoice): void {
    if (!this.selectingForTeam || this.selectionType !== 'building') return;

    const buildings = this.selectingForTeam === 'top' ? this.topBuildings : this.bottomBuildings;
    const emptySlot = buildings.findIndex(b => b === null);

    if (emptySlot !== -1) {
      buildings[emptySlot] = new Building(
        this.selectingForTeam,
        emptySlot,
        building.type,
        this.canvas.width,
        this.canvas.height
      );
    }

    this.processNextSelection();
  }

  private processNextSelection(): void {
    if (this.pendingSelections.length > 0) {
      const next = this.pendingSelections.shift()!;
      this.selectingForTeam = next.team;
      this.selectionType = next.type;
      this.showSelection(next.team, next.type);
    } else {
      this.selectingForTeam = null;
      this.selectionType = null;
    }
  }

  private createFighter(team: Team, type: FighterType, x: number): Fighter {
    const modifiers = team === 'top' ? this.topModifiers : this.bottomModifiers;
    let fighter: Fighter;

    switch (type) {
      case 'archer':
        fighter = new Archer(team, x, this.canvas.height);
        break;
      case 'mage':
        fighter = new Mage(team, x, this.canvas.height);
        break;
      case 'knight':
        fighter = new Knight(team, x, this.canvas.height);
        break;
      case 'healer':
        fighter = new Healer(team, x, this.canvas.height);
        break;
      default:
        fighter = new Swordsman(team, x, this.canvas.height);
    }

    fighter.applyModifiers(modifiers);
    return fighter;
  }

  private gameLoop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    if (!this.selectingForTeam) {
      this.update(deltaTime);
    }
    this.draw();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    // Check win condition
    if (this.topTower?.isDead) {
      this.running = false;
      this.onWinnerCallback('bottom');
      return;
    }
    if (this.bottomTower?.isDead) {
      this.running = false;
      this.onWinnerCallback('top');
      return;
    }

    // Spawn units up to building cap
    this.spawnUnitsUpToCap('top', deltaTime);
    this.spawnUnitsUpToCap('bottom', deltaTime);

    // Update fighters - include enemy tower as a target
    const aliveTop = this.topTeam.filter(f => !f.isDead);
    const aliveBottom = this.bottomTeam.filter(f => !f.isDead);

    // Create target lists that include towers
    const topTargets: (Fighter | Tower)[] = [...aliveTop];
    const bottomTargets: (Fighter | Tower)[] = [...aliveBottom];
    if (this.topTower && !this.topTower.isDead) topTargets.push(this.topTower as unknown as Fighter);
    if (this.bottomTower && !this.bottomTower.isDead) bottomTargets.push(this.bottomTower as unknown as Fighter);

    for (const fighter of this.topTeam) {
      fighter.update(bottomTargets as Fighter[], deltaTime, aliveTop);
    }
    for (const fighter of this.bottomTeam) {
      fighter.update(topTargets as Fighter[], deltaTime, aliveBottom);
    }

    // Update towers (shoot at enemies)
    if (this.topTower && !this.topTower.isDead) {
      this.topTower.update(aliveBottom);
    }
    if (this.bottomTower && !this.bottomTower.isDead) {
      this.bottomTower.update(aliveTop);
    }

    // Update XP orbs
    for (const orb of this.xpOrbs) {
      const wasCollected = orb.collected;
      orb.update(deltaTime, this.canvas.height);

      if (!wasCollected && orb.collected) {
        this.collectXP(orb.targetTeam, orb.value);
      }
    }
    this.xpOrbs = this.xpOrbs.filter(o => !o.collected);

    // Process deaths
    this.processDeaths();

    // Update damage numbers
    DamageNumberManager.update(deltaTime);

    // Clean up dead fighters periodically
    this.topTeam = this.topTeam.filter(f => !f.isDead || !('processed' in f));
    this.bottomTeam = this.bottomTeam.filter(f => !f.isDead || !('processed' in f));

    this.updateCountsCallback();
  }

  private spawnUnitsUpToCap(team: Team, deltaTime: number): void {
    const buildings = team === 'top' ? this.topBuildings : this.bottomBuildings;
    const fighters = team === 'top' ? this.topTeam : this.bottomTeam;
    const respawnTimers = team === 'top' ? this.topRespawnTimers : this.bottomRespawnTimers;

    // Sum up caps by type (each building has its own cap value)
    const buildingCounts = new Map<FighterType, number>();
    for (const building of buildings) {
      if (building) {
        buildingCounts.set(building.type, (buildingCounts.get(building.type) || 0) + building.cap);
      }
    }

    // Count alive fighters by type
    const aliveCounts = new Map<FighterType, number>();
    for (const fighter of fighters) {
      if (!fighter.isDead) {
        const type = fighter.getType();
        aliveCounts.set(type, (aliveCounts.get(type) || 0) + 1);
      }
    }

    // Update respawn timers and spawn units
    for (const [type, cap] of buildingCounts) {
      const alive = aliveCounts.get(type) || 0;
      if (alive < cap) {
        // Check/update respawn timer
        const timer = respawnTimers.get(type) || 0;
        if (timer <= 0) {
          // Spawn unit
          const x = 100 + Math.random() * (this.canvas.width - 200);
          const fighter = this.createFighter(team, type, x);
          fighters.push(fighter);
          // Reset timer for next spawn
          respawnTimers.set(type, this.respawnDelay);
        } else {
          respawnTimers.set(type, timer - deltaTime);
        }
      }
    }
  }

  private processDeaths(): void {
    for (const fighter of this.topTeam) {
      if (fighter.isDead && !('processed' in fighter)) {
        (fighter as Fighter & { processed: boolean }).processed = true;
        this.bottomKills++;
        this.spawnXPOrb(fighter, 'bottom');
      }
    }
    for (const fighter of this.bottomTeam) {
      if (fighter.isDead && !('processed' in fighter)) {
        (fighter as Fighter & { processed: boolean }).processed = true;
        this.topKills++;
        this.spawnXPOrb(fighter, 'top');
      }
    }
  }

  private spawnXPOrb(fighter: Fighter, forTeam: Team): void {
    const orb = new XPOrb(fighter.x, fighter.y, forTeam, 10);
    this.xpOrbs.push(orb);
  }

  private getXPRequired(level: number): number {
    return Math.round(20 * Math.pow(1.2, level - 1));
  }

  private collectXP(team: Team, amount: number): void {
    if (team === 'top') {
      this.topXP += amount;
      const required = this.getXPRequired(this.topLevel);
      if (this.topXP >= required) {
        this.topXP = 0;
        this.topLevel++;
        this.onLevelUp('top', this.topLevel);
      }
    } else {
      this.bottomXP += amount;
      const required = this.getXPRequired(this.bottomLevel);
      if (this.bottomXP >= required) {
        this.bottomXP = 0;
        this.bottomLevel++;
        this.onLevelUp('bottom', this.bottomLevel);
      }
    }
  }

  private onLevelUp(team: Team, level: number): void {
    // Card selection every level
    this.triggerSelection(team, 'card');

    if (level <= 10) {
      // Levels 1-10: add new building slots
      this.triggerSelection(team, 'building');
    } else {
      // Levels 11+: increase building caps, cycling through buildings
      const buildings = team === 'top' ? this.topBuildings : this.bottomBuildings;
      const slotIndex = (level - 11) % 10; // Cycle through 10 slots
      const building = buildings[slotIndex];
      if (building && building.cap < 5) {
        building.cap++;
      } else {
        // Find next building that can be upgraded
        for (let i = 0; i < 10; i++) {
          const idx = (slotIndex + i) % 10;
          const b = buildings[idx];
          if (b && b.cap < 5) {
            b.cap++;
            break;
          }
        }
      }
    }
  }

  private triggerSelection(team: Team, type: SelectionType): void {
    // Check if team has available slots for buildings
    if (type === 'building') {
      const buildings = team === 'top' ? this.topBuildings : this.bottomBuildings;
      if (buildings.every(b => b !== null)) return; // No slots available
    }

    if (this.selectingForTeam) {
      this.pendingSelections.push({ team, type });
    } else {
      this.selectingForTeam = team;
      this.selectionType = type;
      this.showSelection(team, type);
    }
  }

  private showSelection(team: Team, type: SelectionType): void {
    // In single player mode, auto-select for blue team (top)
    if (this.singlePlayerMode && team === 'top') {
      if (type === 'card') {
        const cards = this.getRandomCards(3, team);
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        this.topModifiers.applyCard(randomCard);
      } else {
        const buildings = this.getRandomBuildings(3);
        const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];
        const emptySlot = this.topBuildings.findIndex(b => b === null);
        if (emptySlot !== -1) {
          this.topBuildings[emptySlot] = new Building(
            'top',
            emptySlot,
            randomBuilding.type,
            this.canvas.width,
            this.canvas.height
          );
        }
      }
      this.processNextSelection();
      return;
    }

    if (type === 'card') {
      const cards = this.getRandomCards(3, team);
      this.onSelectionCallback(team, cards, 'card');
    } else {
      const buildings = this.getRandomBuildings(3);
      this.onSelectionCallback(team, buildings, 'building');
    }
  }

  private getRandomCards(count: number, team?: Team): Card[] {
    const modifiers = team === 'top' ? this.topModifiers : this.bottomModifiers;

    // Filter out ability cards we already have
    const availableCards = ALL_CARDS.filter(card => {
      const e = card.effect;
      if (e.archerFanAbility && modifiers.archerFanAbility) return false;
      if (e.swordsmanSweepAbility && modifiers.swordsmanSweepAbility) return false;
      if (e.knightTauntAbility && modifiers.knightTauntAbility) return false;
      if (e.mageConflagrationAbility && modifiers.mageConflagrationAbility) return false;
      return true;
    });

    const shuffled = availableCards.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private getRandomBuildings(count: number): BuildingChoice[] {
    const shuffled = [...BUILDING_TYPES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private draw(): void {
    this.clear();

    // Draw building slots
    this.drawBuildingSlots();

    // Draw buildings
    for (const building of this.topBuildings) {
      if (building) building.draw(this.ctx);
    }
    for (const building of this.bottomBuildings) {
      if (building) building.draw(this.ctx);
    }

    // Draw battlefield line
    const ctx = this.ctx;
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, this.canvas.height / 2);
    ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw XP orbs
    for (const orb of this.xpOrbs) {
      orb.draw(ctx);
    }

    // Draw towers
    if (this.topTower) this.topTower.draw(ctx);
    if (this.bottomTower) this.bottomTower.draw(ctx);

    // Draw fighters
    for (const fighter of this.topTeam) {
      fighter.draw(ctx);
    }
    for (const fighter of this.bottomTeam) {
      fighter.draw(ctx);
    }

    // Draw damage numbers
    DamageNumberManager.draw(ctx);

    // Draw XP bars
    this.drawXPBar('top');
    this.drawXPBar('bottom');
  }

  private drawBuildingSlots(): void {
    const ctx = this.ctx;
    const slotWidth = this.canvas.width / 10;

    // Draw empty slots
    for (let i = 0; i < 10; i++) {
      const x = slotWidth * i + slotWidth / 2;

      // Top slots
      if (!this.topBuildings[i]) {
        ctx.strokeStyle = 'rgba(74, 144, 217, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x - 20, 8, 40, 35);
        ctx.setLineDash([]);
      }

      // Bottom slots
      if (!this.bottomBuildings[i]) {
        ctx.strokeStyle = 'rgba(217, 74, 74, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x - 20, this.canvas.height - 43, 40, 35);
        ctx.setLineDash([]);
      }
    }
  }

  private drawXPBar(team: Team): void {
    const ctx = this.ctx;
    const xp = team === 'top' ? this.topXP : this.bottomXP;
    const level = team === 'top' ? this.topLevel : this.bottomLevel;
    const modifiers = team === 'top' ? this.topModifiers : this.bottomModifiers;
    const buildingCount = this.getBuildingCount(team);
    const required = this.getXPRequired(level);
    const y = team === 'top' ? 50 : this.canvas.height - 58;
    const barWidth = this.canvas.width - 40;
    const barHeight = 8;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(20, y, barWidth, barHeight);

    // XP progress
    const progress = xp / required;
    ctx.fillStyle = team === 'top' ? '#4a90d9' : '#d94a4a';
    ctx.fillRect(20, y, barWidth * progress, barHeight);

    // Border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, y, barWidth, barHeight);

    // Level & building count text
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv ${level} | Cap: ${buildingCount}`, this.canvas.width / 2, y + 7);

    // Draw ability icons on the right side
    const abilities: { has: boolean; color: string; label: string }[] = [
      { has: modifiers.archerFanAbility, color: '#22c55e', label: 'A' },
      { has: modifiers.swordsmanSweepAbility, color: '#3b82f6', label: 'S' },
      { has: modifiers.knightTauntAbility, color: '#f59e0b', label: 'K' },
      { has: modifiers.mageConflagrationAbility, color: '#ef4444', label: 'M' },
    ];

    let iconX = this.canvas.width - 30;
    const iconY = y + 4;
    const iconSize = 12;

    for (const ability of abilities) {
      if (ability.has) {
        // Draw ability icon background
        ctx.fillStyle = ability.color;
        ctx.beginPath();
        ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw ability letter
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ability.label, iconX, iconY);

        iconX -= iconSize + 4;
      }
    }
    ctx.textBaseline = 'alphabetic'; // Reset
  }

  private clear(): void {
    const ctx = this.ctx;

    // Draw grassy background
    ctx.fillStyle = '#228B22'; // Forest green base
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add grass texture with darker patches
    ctx.fillStyle = '#1e7b1e';
    for (let i = 0; i < 80; i++) {
      const x = (i * 37) % this.canvas.width;
      const y = (i * 23) % this.canvas.height;
      ctx.fillRect(x, y, 15, 8);
    }

    // Add lighter grass highlights
    ctx.fillStyle = '#32CD32';
    for (let i = 0; i < 60; i++) {
      const x = (i * 41 + 10) % this.canvas.width;
      const y = (i * 29 + 5) % this.canvas.height;
      ctx.fillRect(x, y, 6, 3);
    }

    // Draw base areas (dirt paths near towers)
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(this.canvas.width / 2 - 60, 40, 120, 60); // Top base area
    ctx.fillRect(this.canvas.width / 2 - 60, this.canvas.height - 100, 120, 60); // Bottom base area
  }
}
