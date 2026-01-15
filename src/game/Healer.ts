import { Fighter } from './Fighter';
import type { Team, FighterType } from './types';

export class Healer extends Fighter {
  private healRange: number = 22;
  private healAmount: number = 15;
  private healCooldown: number = 1000;
  private lastHealTime: number = 0;
  private healEffect: { x: number; y: number; frame: number }[] = [];

  constructor(team: Team, x: number, canvasHeight: number) {
    super(team, x, canvasHeight);
    this.health = 70;
    this.maxHealth = 70;
    this.baseSpeed = 0.45;
    this.speed = 0.45;
    this.baseDamage = 2;
    this.damage = 2;
    this.baseAttackRange = 14;
    this.attackRange = 14;
    this.baseAttackCooldown = 2000;
    this.attackCooldown = 2000;
  }

  getColor(): string {
    return this.team === 'top' ? '#22d3ee' : '#fb923c';
  }

  getType(): FighterType {
    return 'healer';
  }

  update(enemies: Fighter[], deltaTime: number, allies?: Fighter[]): void {
    if (this.isDead) return;

    this.animationTimer += deltaTime;
    if (this.animationTimer > 150) {
      this.animationFrame = (this.animationFrame + 1) % 4;
      this.animationTimer = 0;
    }

    // Update heal effects
    this.healEffect = this.healEffect.filter(e => {
      e.frame++;
      return e.frame < 20;
    });

    // Try to heal allies first
    if (allies) {
      this.tryHeal(allies);
    }

    // Then do normal combat behavior
    this.findTarget(enemies);

    if (this.target && !this.target.isDead) {
      const distance = this.getDistanceTo(this.target);

      if (distance > this.attackRange) {
        this.moveTowards(this.target);
      } else {
        this.attack(this.target);
      }
    } else {
      this.moveForward();
    }
  }

  private tryHeal(allies: Fighter[]): void {
    const now = Date.now();
    if (now - this.lastHealTime < this.healCooldown) return;

    for (const ally of allies) {
      if (ally === this || ally.isDead) continue;
      if (ally.health >= ally.maxHealth) continue;

      const dx = ally.x - this.x;
      const dy = ally.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= this.healRange) {
        ally.health = Math.min(ally.maxHealth, ally.health + this.healAmount);
        this.healEffect.push({ x: ally.x, y: ally.y, frame: 0 });
        this.lastHealTime = now;
        return; // Heal one ally per cooldown
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDead) return;

    // Draw heal effects
    for (const effect of this.healEffect) {
      const alpha = 1 - effect.frame / 20;
      const size = 10 + effect.frame;

      ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(effect.x - size / 2, effect.y);
      ctx.lineTo(effect.x + size / 2, effect.y);
      ctx.moveTo(effect.x, effect.y - size / 2);
      ctx.lineTo(effect.x, effect.y + size / 2);
      ctx.stroke();
    }

    super.draw(ctx);

    // Draw staff with healing crystal
    const staffX = this.x + 10;
    const staffTopY = this.y - 20;

    ctx.strokeStyle = '#deb887';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(staffX, this.y + 15);
    ctx.lineTo(staffX, staffTopY);
    ctx.stroke();

    // Healing crystal
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(staffX, staffTopY - 10);
    ctx.lineTo(staffX - 6, staffTopY);
    ctx.lineTo(staffX, staffTopY + 5);
    ctx.lineTo(staffX + 6, staffTopY);
    ctx.closePath();
    ctx.fill();

    // Crystal glow
    ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
    ctx.beginPath();
    ctx.arc(staffX, staffTopY - 2, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}
