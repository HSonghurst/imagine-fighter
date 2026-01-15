import { Fighter } from './Fighter';
import { Fireball } from './Fireball';
import { SpriteRenderer } from './SpriteRenderer';
import type { Team, FighterType } from './types';

interface ChainFire {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  damage: number;
  hitEnemies: Set<Fighter>;
  currentTarget: Fighter | null;
}

export class Mage extends Fighter {
  fireballs: Fireball[] = [];
  private castAnimation: number = 0;
  private attackCount: number = 0;
  private chainFires: ChainFire[] = [];

  constructor(team: Team, x: number, canvasHeight: number) {
    super(team, x, canvasHeight);
    this.health = 60;
    this.maxHealth = 60;
    this.baseSpeed = 0.4;
    this.speed = 0.4;
    this.baseDamage = 35;
    this.damage = 35;
    this.baseAttackRange = 60;
    this.attackRange = 60;
    this.baseAttackCooldown = 800;
    this.attackCooldown = 800;
  }

  getColor(): string {
    return this.team === 'top' ? '#a855f7' : '#f472b6';
  }

  getType(): FighterType {
    return 'mage';
  }

  protected attack(target: Fighter, allEnemies?: Fighter[]): void {
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      this.attackCount++;

      // Check for conflagration ability (every 10 attacks)
      if (this.modifiers?.mageConflagrationAbility && this.attackCount % 10 === 0 && allEnemies) {
        this.startConflagration(target, allEnemies);
      } else {
        this.fireballs.push(new Fireball(this.x, this.y, target, this.damage, this.team, this));
      }

      this.lastAttackTime = now;
      this.castAnimation = 20;
    }
  }

  private startConflagration(startTarget: Fighter, _allEnemies: Fighter[]): void {
    // Start a chain fire from the mage to the target
    this.chainFires.push({
      x: this.x,
      y: this.y,
      targetX: startTarget.x,
      targetY: startTarget.y,
      progress: 0,
      damage: this.damage * 1.5, // Conflagration does 150% damage
      hitEnemies: new Set(),
      currentTarget: startTarget
    });
  }

  private updateChainFires(allEnemies: Fighter[]): void {
    for (const fire of this.chainFires) {
      fire.progress += 0.15; // Speed of chain fire

      if (fire.progress >= 1 && fire.currentTarget) {
        // Hit the current target
        if (!fire.hitEnemies.has(fire.currentTarget) && !fire.currentTarget.isDead) {
          fire.hitEnemies.add(fire.currentTarget);
          fire.currentTarget.takeDamage(fire.damage, this);
          fire.currentTarget.statusEffects.burning += 5; // Strong burn

          // Find next target to chain to
          let nextTarget: Fighter | null = null;
          let closestDist = 80; // Chain range

          for (const enemy of allEnemies) {
            if (enemy.isDead || fire.hitEnemies.has(enemy)) continue;
            const dx = enemy.x - fire.currentTarget.x;
            const dy = enemy.y - fire.currentTarget.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist) {
              closestDist = dist;
              nextTarget = enemy;
            }
          }

          if (nextTarget) {
            fire.x = fire.currentTarget.x;
            fire.y = fire.currentTarget.y;
            fire.targetX = nextTarget.x;
            fire.targetY = nextTarget.y;
            fire.currentTarget = nextTarget;
            fire.progress = 0;
            fire.damage *= 0.8; // Reduce damage per chain
          } else {
            fire.currentTarget = null; // End the chain
          }
        } else {
          // Target is dead or already hit - end the chain
          fire.currentTarget = null;
        }
      }
    }

    // Remove finished chain fires
    this.chainFires = this.chainFires.filter(f => f.currentTarget !== null);
  }

  update(enemies: Fighter[], deltaTime: number, allies?: Fighter[]): void {
    super.update(enemies, deltaTime, allies);

    for (const fireball of this.fireballs) {
      fireball.update(enemies);
    }

    this.fireballs = this.fireballs.filter(f => !f.isDead);

    // Update chain fires
    this.updateChainFires(enemies);

    if (this.castAnimation > 0) {
      this.castAnimation--;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const fireball of this.fireballs) {
      fireball.draw(ctx);
    }

    // Draw chain fires
    for (const fire of this.chainFires) {
      this.drawChainFire(ctx, fire);
    }

    if (this.isDead) return;

    this.drawStatusEffects(ctx);
    SpriteRenderer.drawMage(ctx, this.x, this.y, this.team, this.castAnimation > 0 ? this.animationFrame + 1 : this.animationFrame);
    this.drawHealthBar(ctx);
  }

  private drawChainFire(ctx: CanvasRenderingContext2D, fire: ChainFire): void {
    const currentX = fire.x + (fire.targetX - fire.x) * fire.progress;
    const currentY = fire.y + (fire.targetY - fire.y) * fire.progress;

    // Draw fire trail
    ctx.save();

    // Draw line from source to current position
    const gradient = ctx.createLinearGradient(fire.x, fire.y, currentX, currentY);
    gradient.addColorStop(0, 'rgba(255, 100, 0, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 200, 50, 1)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fire.x, fire.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Draw fire head
    const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
    headGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    headGradient.addColorStop(0.4, 'rgba(255, 200, 0, 1)');
    headGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fillStyle = headGradient;
    ctx.fill();

    ctx.restore();
  }
}
