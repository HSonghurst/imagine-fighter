import { Fighter } from './Fighter';
import { Ghost } from './Ghost';
import { SpriteRenderer } from './SpriteRenderer';
import { SoundManager } from './SoundManager';
import { DamageNumberManager } from './DamageNumber';
import type { Team, FighterType } from './types';

interface GhostChain {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  currentTarget: Fighter | null;
  hitEnemies: Set<Fighter>;
  progress: number;
  damage: number;
}

export class Wraith extends Fighter {
  private attackAnimation: number = 0;
  private reapCooldown: number = 0;
  private readonly REAP_INTERVAL: number = 4000; // Soul reap every 4 seconds
  private attackCount: number = 0;
  ghosts: Ghost[] = [];
  private ghostChains: GhostChain[] = [];

  constructor(team: Team, x: number, canvasHeight: number) {
    super(team, x, canvasHeight);
    this.health = 1500;
    this.maxHealth = 1500;
    this.baseSpeed = 0.5; // Faster than ogre
    this.speed = 0.5;
    this.baseDamage = 50; // Higher single target damage
    this.damage = 50;
    this.baseAttackRange = 40;
    this.attackRange = 40;
    this.baseAttackCooldown = 1000;
    this.attackCooldown = 1000;
    this.width = 20;
    this.height = 28;

    // Position at the tower location
    this.y = team === 'top' ? 70 : canvasHeight - 70;
  }

  getColor(): string {
    return this.team === 'top' ? '#4b0082' : '#8b0000';
  }

  getType(): FighterType {
    return 'mage'; // Treated as mage for targeting
  }

  update(enemies: Fighter[], deltaTime: number, _allies?: Fighter[]): void {
    if (this.isDead) return;

    // Update ghosts
    for (const ghost of this.ghosts) {
      ghost.update(enemies);
    }
    this.ghosts = this.ghosts.filter(g => !g.isDead);

    // Update ghost chains
    this.updateGhostChains(enemies);

    // Process status effects
    this.processStatusEffectsPublic(deltaTime);

    // Check if frozen
    if (Date.now() < this.statusEffects.frozenUntil) {
      return;
    }

    // Wraith has slower regen but life steal
    const regenPerFrame = (2 * deltaTime) / 1000;
    this.health = Math.min(this.maxHealth, this.health + regenPerFrame);

    this.animationTimer += deltaTime;
    if (this.animationTimer > 150) { // Faster animation for ghostly effect
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }

    // Soul reap cooldown
    this.reapCooldown -= deltaTime;
    if (this.reapCooldown <= 0 && enemies.length > 0) {
      this.soulReap(enemies);
      this.reapCooldown = this.REAP_INTERVAL;
    }

    this.findTarget(enemies);

    if (this.target && !this.target.isDead) {
      const distance = this.getDistanceTo(this.target);

      if (distance > this.attackRange) {
        this.moveTowards(this.target);
      } else {
        this.attack(this.target, enemies);
      }
    } else {
      this.moveForward();
    }

    if (this.attackAnimation > 0) {
      this.attackAnimation--;
    }
  }

  private updateGhostChains(allEnemies: Fighter[]): void {
    for (const chain of this.ghostChains) {
      chain.progress += 0.12; // Speed of ghost chain

      if (chain.progress >= 1 && chain.currentTarget) {
        // Hit the current target
        if (!chain.hitEnemies.has(chain.currentTarget) && !chain.currentTarget.isDead) {
          chain.hitEnemies.add(chain.currentTarget);
          chain.currentTarget.takeDamage(chain.damage, this);
          // Apply death DoT
          chain.currentTarget.statusEffects.death += 5;

          // Find next target to chain to
          let nextTarget: Fighter | null = null;
          let closestDist = 70; // Chain range

          for (const enemy of allEnemies) {
            if (enemy.isDead || chain.hitEnemies.has(enemy)) continue;
            const dx = enemy.x - chain.currentTarget.x;
            const dy = enemy.y - chain.currentTarget.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist) {
              closestDist = dist;
              nextTarget = enemy;
            }
          }

          if (nextTarget) {
            chain.x = chain.currentTarget.x;
            chain.y = chain.currentTarget.y;
            chain.targetX = nextTarget.x;
            chain.targetY = nextTarget.y;
            chain.currentTarget = nextTarget;
            chain.progress = 0;
            chain.damage *= 0.85; // Reduce damage per chain
          } else {
            chain.currentTarget = null; // End the chain
          }
        } else {
          // Target is dead or already hit - end the chain
          chain.currentTarget = null;
        }
      }
    }

    // Remove finished ghost chains
    this.ghostChains = this.ghostChains.filter(c => c.currentTarget !== null);
  }

  private startGhostChain(startTarget: Fighter, _allEnemies: Fighter[]): void {
    // Start a ghost chain from the wraith to the target
    this.ghostChains.push({
      x: this.x,
      y: this.y,
      targetX: startTarget.x,
      targetY: startTarget.y,
      currentTarget: startTarget,
      hitEnemies: new Set(),
      progress: 0,
      damage: this.damage * 1.2, // Ghost chain does 120% damage
    });
  }

  private processStatusEffectsPublic(_deltaTime: number): void {
    // Wraith takes reduced status effect damage
    const now = Date.now();
    const lastTick = (this as any).lastStatusTick || 0;
    if (now - lastTick < 1000) return;
    (this as any).lastStatusTick = now;

    if (this.statusEffects.burning > 0) {
      const burnDamage = Math.floor(this.statusEffects.burning * 0.5);
      this.health -= burnDamage;
      DamageNumberManager.spawn(this.x, this.y - 20, burnDamage, '#ff6600');
      this.statusEffects.burning = Math.max(0, this.statusEffects.burning - 1);
    }

    if (this.statusEffects.poison > 0) {
      const poisonDamage = Math.floor(this.statusEffects.poison * 0.5);
      this.health -= poisonDamage;
      DamageNumberManager.spawn(this.x, this.y - 20, poisonDamage, '#22c55e');
      this.statusEffects.poison = Math.max(0, this.statusEffects.poison - 0.5);
    }

    if (this.statusEffects.void > 0) {
      const voidDamage = Math.floor(this.statusEffects.void * 0.5);
      this.health -= voidDamage;
      DamageNumberManager.spawn(this.x, this.y - 20, voidDamage, '#a855f7');
      this.statusEffects.void = Math.max(0, this.statusEffects.void - 1.2);
    }

    if (this.statusEffects.death > 0) {
      const deathDamage = Math.floor(this.statusEffects.death * 0.5);
      this.health -= deathDamage;
      DamageNumberManager.spawn(this.x, this.y - 20, deathDamage, '#e5e5e5');
      this.statusEffects.death = Math.max(0, this.statusEffects.death - 1);
    }

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      SoundManager.playDeath();
    }
  }

  private soulReap(enemies: Fighter[]): void {
    SoundManager.playFireball();
    this.attackAnimation = 25;

    // Damage enemies in a cone and heal self
    const reapRadius = 60;
    const reapDamage = 35;
    let totalHealed = 0;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= reapRadius) {
        enemy.takeDamage(reapDamage, this);
        // Apply death DoT on soul reap
        enemy.statusEffects.death += 3;
        totalHealed += 15; // Heal per target hit
      }
    }

    // Heal wraith
    if (totalHealed > 0) {
      this.health = Math.min(this.maxHealth, this.health + totalHealed);
      DamageNumberManager.spawn(this.x, this.y - 30, totalHealed, '#22c55e');
    }
  }

  protected attack(target: Fighter, allEnemies?: Fighter[]): void {
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      this.attackAnimation = 12;
      this.attackCount++;

      // Check for ghost swarm ability (every 8 attacks)
      if (this.attackCount % 8 === 0 && allEnemies) {
        this.startGhostChain(target, allEnemies);
        SoundManager.playFreeze();
      } else {
        // Normal ghost projectile attack
        this.ghosts.push(new Ghost(this.x, this.y, target, this.damage, this.team, this));
      }

      this.lastAttackTime = now;
    }
  }

  takeDamage(amount: number, attacker?: Fighter, isCrit: boolean = false): void {
    // Wraith takes slightly reduced damage (ethereal)
    const reducedAmount = Math.floor(amount * 0.85);
    super.takeDamage(reducedAmount, attacker, isCrit);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Draw ghosts
    for (const ghost of this.ghosts) {
      ghost.draw(ctx);
    }

    // Draw ghost chains
    for (const chain of this.ghostChains) {
      this.drawGhostChain(ctx, chain);
    }

    if (this.isDead) return;

    // Draw soul reap indicator when about to reap
    if (this.reapCooldown < 500 && this.reapCooldown > 0) {
      const warningAlpha = (500 - this.reapCooldown) / 500;
      ctx.fillStyle = `rgba(75, 0, 130, ${warningAlpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw reap shockwave
    if (this.attackAnimation > 15) {
      const progress = (25 - this.attackAnimation) / 10;
      const radius = 60 * progress;
      ctx.strokeStyle = `rgba(148, 0, 211, ${1 - progress})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawStatusEffects(ctx);
    SpriteRenderer.drawWraith(ctx, this.x, this.y, this.team, this.animationFrame);
    this.drawHealthBar(ctx);
  }

  private drawGhostChain(ctx: CanvasRenderingContext2D, chain: GhostChain): void {
    const currentX = chain.x + (chain.targetX - chain.x) * chain.progress;
    const currentY = chain.y + (chain.targetY - chain.y) * chain.progress;

    // Draw ghostly trail
    ctx.save();

    // Draw line from source to current position (white/ghostly colors)
    const gradient = ctx.createLinearGradient(chain.x, chain.y, currentX, currentY);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(220, 220, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(chain.x, chain.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Draw ghost head at current position
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(currentX, currentY - 2, 5, Math.PI, 0, false);
    ctx.lineTo(currentX + 5, currentY + 4);
    ctx.quadraticCurveTo(currentX + 3, currentY + 2, currentX + 2, currentY + 5);
    ctx.quadraticCurveTo(currentX, currentY + 3, currentX - 2, currentY + 5);
    ctx.quadraticCurveTo(currentX - 3, currentY + 2, currentX - 5, currentY + 4);
    ctx.lineTo(currentX - 5, currentY - 2);
    ctx.fill();

    // Ghost eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(currentX - 2, currentY - 1, 1, 0, Math.PI * 2);
    ctx.arc(currentX + 2, currentY - 1, 1, 0, Math.PI * 2);
    ctx.fill();

    // Outer glow
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();

    ctx.restore();
  }

  protected drawHealthBar(ctx: CanvasRenderingContext2D): void {
    // Health bar for wraith
    const barWidth = 45;
    const barHeight = 5;
    const barX = this.x - barWidth / 2;
    const barY = this.y - 35;

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = '#9333ea'; // Purple health bar
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }
}
