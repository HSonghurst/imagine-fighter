import { Fighter } from './Fighter';
import { Arrow } from './Arrow';
import { SpriteRenderer } from './SpriteRenderer';
import { SoundManager } from './SoundManager';
import type { Team, FighterType } from './types';

export class Archer extends Fighter {
  arrows: Arrow[] = [];
  private attackCount: number = 0;

  constructor(team: Team, x: number, canvasHeight: number) {
    super(team, x, canvasHeight);
    this.health = 80;
    this.maxHealth = 80;
    this.baseSpeed = 0.5;
    this.speed = 0.5;
    this.baseDamage = 45;
    this.damage = 45;
    this.baseAttackRange = 65;
    this.attackRange = 65;
    this.baseAttackCooldown = 1500;
    this.attackCooldown = 1500;
  }

  getColor(): string {
    return this.team === 'top' ? '#60a5fa' : '#f87171';
  }

  getType(): FighterType {
    return 'archer';
  }

  protected attack(target: Fighter, allEnemies?: Fighter[]): void {
    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      this.attackCount++;

      // Check for fan ability (every 5 attacks)
      if (this.modifiers?.archerFanAbility && this.attackCount % 5 === 0 && allEnemies) {
        this.fireFanOfArrows(target, allEnemies);
      } else {
        this.arrows.push(new Arrow(this.x, this.y, target, this.damage, this.team, this));
      }

      SoundManager.playArrowShot();
      this.lastAttackTime = now;
    }
  }

  private fireFanOfArrows(primaryTarget: Fighter, allEnemies: Fighter[]): void {
    // Get angle to primary target
    const dx = primaryTarget.x - this.x;
    const dy = primaryTarget.y - this.y;
    const baseAngle = Math.atan2(dy, dx);

    // Fire 5 arrows in a fan pattern (spread of 60 degrees total)
    const spreadAngle = Math.PI / 3; // 60 degrees
    const aliveEnemies = allEnemies.filter(e => !e.isDead);

    for (let i = 0; i < 5; i++) {
      const angle = baseAngle - spreadAngle / 2 + (spreadAngle * i) / 4;

      // Find closest enemy in this direction, or use primary target
      let bestTarget = primaryTarget;
      let bestScore = Infinity;

      for (const enemy of aliveEnemies) {
        const ex = enemy.x - this.x;
        const ey = enemy.y - this.y;
        const enemyAngle = Math.atan2(ey, ex);
        const angleDiff = Math.abs(enemyAngle - angle);
        const dist = Math.sqrt(ex * ex + ey * ey);
        const score = angleDiff * 100 + dist; // Prefer enemies closer to the arrow's angle

        if (score < bestScore && dist < this.attackRange * 2) {
          bestScore = score;
          bestTarget = enemy;
        }
      }

      this.arrows.push(new Arrow(this.x, this.y, bestTarget, this.damage, this.team, this));
    }
  }

  update(enemies: Fighter[], deltaTime: number, allies?: Fighter[]): void {
    super.update(enemies, deltaTime, allies);

    for (const arrow of this.arrows) {
      arrow.update();
    }

    this.arrows = this.arrows.filter(arrow => !arrow.isDead);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const arrow of this.arrows) {
      arrow.draw(ctx);
    }

    if (this.isDead) return;

    this.drawStatusEffects(ctx);
    SpriteRenderer.drawArcher(ctx, this.x, this.y, this.team, this.animationFrame);
    this.drawHealthBar(ctx);
  }
}
