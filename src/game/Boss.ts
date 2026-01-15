import { Fighter } from './Fighter';
import { SpriteRenderer } from './SpriteRenderer';
import { SoundManager } from './SoundManager';
import { DamageNumberManager } from './DamageNumber';
import type { Team, FighterType } from './types';

export class Boss extends Fighter {
  private attackAnimation: number = 0;
  private slamCooldown: number = 0;
  private readonly SLAM_INTERVAL: number = 5000; // Ground slam every 5 seconds

  constructor(team: Team, x: number, canvasHeight: number) {
    super(team, x, canvasHeight);
    this.health = 2000;
    this.maxHealth = 2000;
    this.baseSpeed = 0.3;
    this.speed = 0.3;
    this.baseDamage = 40;
    this.damage = 40;
    this.baseAttackRange = 35;
    this.attackRange = 35;
    this.baseAttackCooldown = 1200;
    this.attackCooldown = 1200;
    this.width = 24;
    this.height = 32;

    // Position at the tower location
    this.y = team === 'top' ? 70 : canvasHeight - 70;
  }

  getColor(): string {
    return this.team === 'top' ? '#1e40af' : '#991b1b';
  }

  getType(): FighterType {
    return 'knight'; // Treated as knight for targeting
  }

  update(enemies: Fighter[], deltaTime: number, _allies?: Fighter[]): void {
    if (this.isDead) return;

    // Process status effects
    this.processStatusEffectsPublic(deltaTime);

    // Check if frozen
    if (Date.now() < this.statusEffects.frozenUntil) {
      return;
    }

    // Regeneration (boss has built-in regen)
    const regenPerFrame = (5 * deltaTime) / 1000;
    this.health = Math.min(this.maxHealth, this.health + regenPerFrame);

    this.animationTimer += deltaTime;
    if (this.animationTimer > 200) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }

    // Ground slam cooldown
    this.slamCooldown -= deltaTime;
    if (this.slamCooldown <= 0 && enemies.length > 0) {
      this.groundSlam(enemies);
      this.slamCooldown = this.SLAM_INTERVAL;
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

  private processStatusEffectsPublic(_deltaTime: number): void {
    // Boss takes reduced status effect damage
    const now = Date.now();
    const lastTick = (this as any).lastStatusTick || 0;
    if (now - lastTick < 1000) return;
    (this as any).lastStatusTick = now;

    if (this.statusEffects.burning > 0) {
      const burnDamage = Math.floor(this.statusEffects.burning * 0.5); // 50% reduced
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

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      SoundManager.playDeath();
    }
  }

  private groundSlam(enemies: Fighter[]): void {
    SoundManager.playExplosion();
    this.attackAnimation = 30;

    // Damage all enemies in a large radius
    const slamRadius = 80;
    const slamDamage = 25;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= slamRadius) {
        enemy.takeDamage(slamDamage, this);
        // Knock back
        const knockback = 20;
        const angle = Math.atan2(dy, dx);
        enemy.x += Math.cos(angle) * knockback;
        enemy.y += Math.sin(angle) * knockback;
      }
    }
  }

  protected attack(_target: Fighter, allEnemies?: Fighter[]): void {
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      this.attackAnimation = 15;

      // Boss cleave attack - hits multiple targets
      const cleaveRadius = 30;
      for (const enemy of allEnemies || []) {
        if (enemy.isDead) continue;
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= this.attackRange + cleaveRadius) {
          const isCrit = Math.random() < 0.1; // 10% crit chance
          const damage = isCrit ? this.damage * 2 : this.damage;
          enemy.takeDamage(damage, this, isCrit);
        }
      }

      this.lastAttackTime = now;
    }
  }

  takeDamage(amount: number, attacker?: Fighter, isCrit: boolean = false): void {
    // Boss takes reduced damage
    const reducedAmount = Math.floor(amount * 0.8);
    super.takeDamage(reducedAmount, attacker, isCrit);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDead) return;

    // Draw ground slam indicator when about to slam
    if (this.slamCooldown < 500 && this.slamCooldown > 0) {
      const warningAlpha = (500 - this.slamCooldown) / 500;
      ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw slam shockwave
    if (this.attackAnimation > 20) {
      const progress = (30 - this.attackAnimation) / 10;
      const radius = 80 * progress;
      ctx.strokeStyle = `rgba(255, 100, 0, ${1 - progress})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawStatusEffects(ctx);
    SpriteRenderer.drawBoss(ctx, this.x, this.y, this.team, this.animationFrame);
    this.drawHealthBar(ctx);
  }

  protected drawHealthBar(ctx: CanvasRenderingContext2D): void {
    // Bigger health bar for boss
    const barWidth = 50;
    const barHeight = 6;
    const barX = this.x - barWidth / 2;
    const barY = this.y - 38;

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }
}
