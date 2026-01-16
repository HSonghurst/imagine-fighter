import { Fighter } from './Fighter';
import { SoundManager } from './SoundManager';
import type { Team } from './types';

export class Ghost {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number = 4; // Slower, more ghostly movement
  damage: number;
  team: Team;
  target: Fighter;
  shooter: Fighter | null;
  isDead: boolean = false;
  angle: number;
  wobbleOffset: number = 0;
  trailParticles: { x: number; y: number; alpha: number }[] = [];

  constructor(x: number, y: number, target: Fighter, damage: number, team: Team, shooter?: Fighter) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.targetX = target.x;
    this.targetY = target.y;
    this.damage = damage;
    this.team = team;
    this.shooter = shooter || null;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.angle = Math.atan2(dy, dx);
  }

  update(enemies: Fighter[]): void {
    if (this.isDead) return;

    // Add trail particle
    if (Math.random() < 0.5) {
      this.trailParticles.push({
        x: this.x + (Math.random() - 0.5) * 6,
        y: this.y + (Math.random() - 0.5) * 6,
        alpha: 0.8
      });
    }

    // Update trail particles
    this.trailParticles = this.trailParticles
      .map(p => ({ ...p, alpha: p.alpha - 0.05 }))
      .filter(p => p.alpha > 0);

    // Wobble for ghostly movement
    this.wobbleOffset += 0.3;

    if (!this.target.isDead) {
      this.targetX = this.target.x;
      this.targetY = this.target.y;
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      this.angle = Math.atan2(dy, dx);
    }

    // Add wobble to movement
    const wobbleX = Math.sin(this.wobbleOffset) * 1.5;
    const wobbleY = Math.cos(this.wobbleOffset * 1.3) * 1.5;

    this.x += Math.cos(this.angle) * this.speed + wobbleX * 0.3;
    this.y += Math.sin(this.angle) * this.speed + wobbleY * 0.3;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 15) {
      this.impact(enemies);
    }

    if (this.x < -50 || this.x > 1000 || this.y < -50 || this.y > 700) {
      this.isDead = true;
    }
  }

  private impact(_enemies: Fighter[]): void {
    this.isDead = true;
    SoundManager.playFreeze(); // Eerie sound

    if (!this.target.isDead) {
      // Deal damage
      const isCrit = Math.random() < 0.1;
      const finalDamage = isCrit ? this.damage * 2 : this.damage;
      this.target.takeDamage(finalDamage, this.shooter || undefined, isCrit);

      // Apply death DoT
      this.target.statusEffects.death += 5;

      // Life steal for the wraith
      if (this.shooter) {
        const healAmount = Math.floor(finalDamage * 0.15);
        this.shooter.health = Math.min(this.shooter.maxHealth, this.shooter.health + healAmount);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDead) return;

    // Draw trail particles
    for (const particle of this.trailParticles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.5})`;
      ctx.fill();
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Outer ethereal glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(220, 220, 255, 0.6)');
    gradient.addColorStop(0.6, 'rgba(180, 180, 220, 0.3)');
    gradient.addColorStop(1, 'rgba(150, 150, 200, 0)');

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Ghost body (small, cute ghost shape)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(0, -2, 5, Math.PI, 0, false); // Head
    ctx.lineTo(5, 4);
    // Wavy bottom
    ctx.quadraticCurveTo(3, 2, 2, 5);
    ctx.quadraticCurveTo(0, 3, -2, 5);
    ctx.quadraticCurveTo(-3, 2, -5, 4);
    ctx.lineTo(-5, -2);
    ctx.fill();

    // Eyes (dark, hollow)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-2, -1, 1.5, 0, Math.PI * 2);
    ctx.arc(2, -1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (small O shape)
    ctx.beginPath();
    ctx.arc(0, 2, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
