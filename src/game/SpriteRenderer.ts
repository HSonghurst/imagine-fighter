import type { Team } from './types';

// Pixel art sprite renderer for units
export class SpriteRenderer {
  // Draw a pixel at a specific position (scaled)
  private static pixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
  }

  static drawTower(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team): void {
    const p = 3; // pixel size for tower (larger)
    const baseX = x - 6 * p;
    const baseY = y - 10 * p;

    const stone = team === 'top' ? '#4a5568' : '#78716c';
    const stoneDark = team === 'top' ? '#2d3748' : '#57534e';
    const stoneLight = team === 'top' ? '#718096' : '#a8a29e';
    const accent = team === 'top' ? '#3b82f6' : '#ef4444';
    const accentDark = team === 'top' ? '#1d4ed8' : '#b91c1c';
    const window = '#1a1a2e';

    // Tower top battlements
    this.pixel(ctx, baseX + 0*p, baseY, p, stoneDark);
    this.pixel(ctx, baseX + 1*p, baseY, p, stone);
    this.pixel(ctx, baseX + 3*p, baseY, p, stoneDark);
    this.pixel(ctx, baseX + 4*p, baseY, p, stone);
    this.pixel(ctx, baseX + 6*p, baseY, p, stoneDark);
    this.pixel(ctx, baseX + 7*p, baseY, p, stone);
    this.pixel(ctx, baseX + 9*p, baseY, p, stoneDark);
    this.pixel(ctx, baseX + 10*p, baseY, p, stone);

    // Second row battlements
    this.pixel(ctx, baseX + 0*p, baseY + p, p, stone);
    this.pixel(ctx, baseX + 1*p, baseY + p, p, stoneLight);
    this.pixel(ctx, baseX + 3*p, baseY + p, p, stone);
    this.pixel(ctx, baseX + 4*p, baseY + p, p, stoneLight);
    this.pixel(ctx, baseX + 6*p, baseY + p, p, stone);
    this.pixel(ctx, baseX + 7*p, baseY + p, p, stoneLight);
    this.pixel(ctx, baseX + 9*p, baseY + p, p, stone);
    this.pixel(ctx, baseX + 10*p, baseY + p, p, stoneLight);

    // Flag pole and flag
    this.pixel(ctx, baseX + 5*p, baseY - 3*p, p, '#8B4513');
    this.pixel(ctx, baseX + 5*p, baseY - 2*p, p, '#8B4513');
    this.pixel(ctx, baseX + 5*p, baseY - p, p, '#8B4513');
    this.pixel(ctx, baseX + 6*p, baseY - 3*p, p, accent);
    this.pixel(ctx, baseX + 7*p, baseY - 3*p, p, accent);
    this.pixel(ctx, baseX + 6*p, baseY - 2*p, p, accentDark);

    // Main tower body
    for (let row = 2; row < 12; row++) {
      this.pixel(ctx, baseX + p, baseY + row*p, p, stoneDark);
      for (let col = 2; col < 10; col++) {
        const isLightRow = row % 2 === 0;
        const isLightCol = col % 2 === 0;
        const color = (isLightRow === isLightCol) ? stone : stoneLight;
        this.pixel(ctx, baseX + col*p, baseY + row*p, p, color);
      }
      this.pixel(ctx, baseX + 10*p, baseY + row*p, p, stoneDark);
    }

    // Windows
    this.pixel(ctx, baseX + 4*p, baseY + 4*p, p, window);
    this.pixel(ctx, baseX + 7*p, baseY + 4*p, p, window);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p, p, window);
    this.pixel(ctx, baseX + 7*p, baseY + 5*p, p, window);

    // Door
    this.pixel(ctx, baseX + 5*p, baseY + 9*p, p, accentDark);
    this.pixel(ctx, baseX + 6*p, baseY + 9*p, p, accentDark);
    this.pixel(ctx, baseX + 5*p, baseY + 10*p, p, accent);
    this.pixel(ctx, baseX + 6*p, baseY + 10*p, p, accent);
    this.pixel(ctx, baseX + 5*p, baseY + 11*p, p, accent);
    this.pixel(ctx, baseX + 6*p, baseY + 11*p, p, accent);

    // Base foundation
    this.pixel(ctx, baseX, baseY + 12*p, p, stoneDark);
    for (let col = 1; col < 11; col++) {
      this.pixel(ctx, baseX + col*p, baseY + 12*p, p, stoneDark);
    }
    this.pixel(ctx, baseX + 11*p, baseY + 12*p, p, stoneDark);
  }

  static drawSwordsman(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team, frame: number): void {
    const p = 2; // pixel size
    const baseX = x - 5 * p;
    const baseY = y - 6 * p;
    const bobOffset = Math.sin(frame * Math.PI / 2) * 1;

    const skin = '#ffd5b5';
    const armor = team === 'top' ? '#3b82f6' : '#ef4444';
    const armorDark = team === 'top' ? '#1d4ed8' : '#b91c1c';
    const sword = '#c0c0c0';
    const swordHilt = '#8B4513';

    // Helmet
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, armorDark);

    // Face
    this.pixel(ctx, baseX + 3*p, baseY + p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, armor);

    // Body
    for (let i = 0; i < 3; i++) {
      this.pixel(ctx, baseX + 3*p, baseY + (2+i)*p + bobOffset, p, armorDark);
      this.pixel(ctx, baseX + 4*p, baseY + (2+i)*p + bobOffset, p, armor);
      this.pixel(ctx, baseX + 5*p, baseY + (2+i)*p + bobOffset, p, armor);
      this.pixel(ctx, baseX + 6*p, baseY + (2+i)*p + bobOffset, p, armorDark);
    }

    // Legs
    this.pixel(ctx, baseX + 3*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, armorDark);

    // Sword (animated)
    const swordOffset = frame % 2 === 0 ? 0 : p;
    this.pixel(ctx, baseX + 8*p, baseY + 2*p + bobOffset - swordOffset, p, sword);
    this.pixel(ctx, baseX + 8*p, baseY + 1*p + bobOffset - swordOffset, p, sword);
    this.pixel(ctx, baseX + 8*p, baseY + bobOffset - swordOffset, p, sword);
    this.pixel(ctx, baseX + 8*p, baseY + 3*p + bobOffset - swordOffset, p, swordHilt);
  }

  static drawArcher(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team, frame: number): void {
    const p = 2;
    const baseX = x - 5 * p;
    const baseY = y - 6 * p;
    const bobOffset = Math.sin(frame * Math.PI / 2) * 1;

    const skin = '#ffd5b5';
    const cloth = team === 'top' ? '#22c55e' : '#f97316';
    const clothDark = team === 'top' ? '#15803d' : '#c2410c';
    const hair = '#5c3317';
    const bow = '#8B4513';

    // Hair/Hood
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, clothDark);
    this.pixel(ctx, baseX + 4*p, baseY + bobOffset, p, cloth);
    this.pixel(ctx, baseX + 5*p, baseY + bobOffset, p, cloth);
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, clothDark);

    // Face
    this.pixel(ctx, baseX + 3*p, baseY + p + bobOffset, p, hair);
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, hair);

    // Body (slimmer)
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, cloth);
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, cloth);
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, clothDark);
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, clothDark);

    // Legs
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, clothDark);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, clothDark);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, '#3d2817');
    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, '#3d2817');

    // Bow
    this.pixel(ctx, baseX + 7*p, baseY + 1*p + bobOffset, p, bow);
    this.pixel(ctx, baseX + 8*p, baseY + 2*p + bobOffset, p, bow);
    this.pixel(ctx, baseX + 8*p, baseY + 3*p + bobOffset, p, bow);
    this.pixel(ctx, baseX + 7*p, baseY + 4*p + bobOffset, p, bow);
  }

  static drawMage(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team, frame: number): void {
    const p = 2;
    const baseX = x - 5 * p;
    const baseY = y - 6 * p;
    const bobOffset = Math.sin(frame * Math.PI / 2) * 1;

    const skin = '#ffd5b5';
    const robe = team === 'top' ? '#a855f7' : '#f472b6';
    const robeDark = team === 'top' ? '#7c3aed' : '#db2777';
    const staff = '#8B4513';
    const orb = '#fbbf24';

    // Hat point
    this.pixel(ctx, baseX + 4*p, baseY - p + bobOffset, p, robeDark);
    this.pixel(ctx, baseX + 5*p, baseY - p + bobOffset, p, robeDark);

    // Hat brim
    this.pixel(ctx, baseX + 2*p, baseY + bobOffset, p, robe);
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, robe);
    this.pixel(ctx, baseX + 4*p, baseY + bobOffset, p, robe);
    this.pixel(ctx, baseX + 5*p, baseY + bobOffset, p, robe);
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, robe);
    this.pixel(ctx, baseX + 7*p, baseY + bobOffset, p, robe);

    // Face
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, skin);

    // Robe body
    this.pixel(ctx, baseX + 3*p, baseY + 2*p + bobOffset, p, robeDark);
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 6*p, baseY + 2*p + bobOffset, p, robeDark);

    this.pixel(ctx, baseX + 2*p, baseY + 3*p + bobOffset, p, robeDark);
    this.pixel(ctx, baseX + 3*p, baseY + 3*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 6*p, baseY + 3*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 7*p, baseY + 3*p + bobOffset, p, robeDark);

    // Robe bottom
    this.pixel(ctx, baseX + 3*p, baseY + 4*p + bobOffset, p, robeDark);
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, robe);
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, robeDark);

    // Staff with orb
    this.pixel(ctx, baseX + 8*p, baseY + 2*p + bobOffset, p, staff);
    this.pixel(ctx, baseX + 8*p, baseY + 3*p + bobOffset, p, staff);
    this.pixel(ctx, baseX + 8*p, baseY + 4*p + bobOffset, p, staff);

    // Glowing orb (animated)
    const glowColor = frame % 2 === 0 ? orb : '#fcd34d';
    this.pixel(ctx, baseX + 8*p, baseY + p + bobOffset, p, glowColor);
  }

  static drawKnight(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team, frame: number): void {
    const p = 2;
    const baseX = x - 5 * p;
    const baseY = y - 6 * p;
    const bobOffset = Math.sin(frame * Math.PI / 2) * 1;

    const armor = team === 'top' ? '#6b7280' : '#78716c';
    const armorLight = team === 'top' ? '#9ca3af' : '#a8a29e';
    const armorDark = team === 'top' ? '#374151' : '#44403c';
    const plume = team === 'top' ? '#2563eb' : '#dc2626';
    const shield = '#fbbf24';

    // Helmet plume
    this.pixel(ctx, baseX + 4*p, baseY - p + bobOffset, p, plume);
    this.pixel(ctx, baseX + 5*p, baseY - p + bobOffset, p, plume);

    // Helmet
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, armorDark);

    // Visor
    this.pixel(ctx, baseX + 3*p, baseY + p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, '#1a1a2e');
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, '#1a1a2e');
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, armorDark);

    // Body (bulky)
    this.pixel(ctx, baseX + 2*p, baseY + 2*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 3*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, armorLight);
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, armorLight);
    this.pixel(ctx, baseX + 6*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + 2*p + bobOffset, p, armorDark);

    this.pixel(ctx, baseX + 2*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 3*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + 3*p + bobOffset, p, armorDark);

    // Legs
    this.pixel(ctx, baseX + 3*p, baseY + 4*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, armorDark);

    this.pixel(ctx, baseX + 3*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, armorDark);

    // Shield
    this.pixel(ctx, baseX + p, baseY + 2*p + bobOffset, p, shield);
    this.pixel(ctx, baseX + p, baseY + 3*p + bobOffset, p, shield);
    this.pixel(ctx, baseX, baseY + 2*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX, baseY + 3*p + bobOffset, p, armorDark);
  }

  static drawHorseman(ctx: CanvasRenderingContext2D, x: number, y: number, team: Team, frame: number, direction: 'up' | 'down' | 'left' | 'right' = 'right'): void {
    const p = 2; // pixel size
    const bobOffset = Math.sin(frame * Math.PI / 2) * 1;

    // Colors
    const skin = '#ffd5b5';
    const armor = team === 'top' ? '#3b82f6' : '#ef4444';
    const armorDark = team === 'top' ? '#1d4ed8' : '#b91c1c';
    const armorLight = team === 'top' ? '#60a5fa' : '#f87171';
    const cape = team === 'top' ? '#1e40af' : '#991b1b';
    const horse = '#8b4513';
    const horseDark = '#5c3317';
    const horseLight = '#a0522d';
    const mane = '#2d1810';
    const crown = '#fbbf24';
    const crownDark = '#d97706';

    if (direction === 'right') {
      this.drawHorsemanRight(ctx, x, y, p, bobOffset, frame, skin, armor, armorDark, armorLight, cape, horse, horseDark, horseLight, mane, crown, crownDark);
    } else if (direction === 'left') {
      this.drawHorsemanLeft(ctx, x, y, p, bobOffset, frame, skin, armor, armorDark, armorLight, cape, horse, horseDark, horseLight, mane, crown, crownDark);
    } else if (direction === 'up') {
      this.drawHorsemanUp(ctx, x, y, p, bobOffset, frame, skin, armor, armorDark, armorLight, cape, horse, horseDark, horseLight, mane, crown, crownDark);
    } else {
      this.drawHorsemanDown(ctx, x, y, p, bobOffset, frame, skin, armor, armorDark, armorLight, cape, horse, horseDark, horseLight, mane, crown, crownDark);
    }
  }

  private static drawHorsemanRight(ctx: CanvasRenderingContext2D, x: number, y: number, p: number, bobOffset: number, frame: number,
    skin: string, armor: string, armorDark: string, armorLight: string, cape: string,
    horse: string, horseDark: string, horseLight: string, mane: string, crown: string, crownDark: string): void {
    const baseX = x - 8 * p;
    const baseY = y - 10 * p;

    // === RIDER ===
    // Crown
    this.pixel(ctx, baseX + 7*p, baseY - p + bobOffset, p, crownDark);
    this.pixel(ctx, baseX + 8*p, baseY - 2*p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 9*p, baseY - p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 10*p, baseY - 2*p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 11*p, baseY - p + bobOffset, p, crownDark);

    // Head
    this.pixel(ctx, baseX + 8*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 9*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 10*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 10*p, baseY + bobOffset, p, '#333'); // Eye

    // Body/Armor
    this.pixel(ctx, baseX + 7*p, baseY + p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 8*p, baseY + p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 9*p, baseY + p + bobOffset, p, armorLight);
    this.pixel(ctx, baseX + 10*p, baseY + p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 11*p, baseY + p + bobOffset, p, armorDark);

    this.pixel(ctx, baseX + 7*p, baseY + 2*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 8*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 9*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 10*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 11*p, baseY + 2*p + bobOffset, p, armorDark);

    // Cape (flowing behind)
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, cape);

    // Legs on horse
    this.pixel(ctx, baseX + 7*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 11*p, baseY + 3*p + bobOffset, p, armorDark);

    // === HORSE ===
    // Horse head (facing right)
    this.pixel(ctx, baseX + 14*p, baseY + 3*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 15*p, baseY + 3*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 16*p, baseY + 3*p + bobOffset, p, horseDark);

    this.pixel(ctx, baseX + 14*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 15*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 16*p, baseY + 4*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 17*p, baseY + 4*p + bobOffset, p, horseDark);

    // Horse eye
    this.pixel(ctx, baseX + 16*p, baseY + 3*p + bobOffset, p, '#111');

    // Horse mane
    this.pixel(ctx, baseX + 13*p, baseY + 2*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 13*p, baseY + 3*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 14*p, baseY + 2*p + bobOffset, p, mane);

    // Horse body
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 7*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 8*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 9*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 10*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 11*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 12*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 13*p, baseY + 4*p + bobOffset, p, horseLight);

    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 7*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 8*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 9*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 10*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 11*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 12*p, baseY + 5*p + bobOffset, p, horseDark);

    // Saddle
    this.pixel(ctx, baseX + 8*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 9*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 10*p, baseY + 3*p + bobOffset, p, armorDark);

    // Horse legs (animated)
    const legOffset = frame % 2 === 0 ? 0 : p;
    // Front legs
    this.pixel(ctx, baseX + 12*p, baseY + 6*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 12*p, baseY + 7*p + bobOffset + legOffset, p, horse);
    this.pixel(ctx, baseX + 12*p, baseY + 8*p + bobOffset + legOffset, p, '#333');

    this.pixel(ctx, baseX + 13*p, baseY + 6*p + bobOffset - legOffset, p, horseDark);
    this.pixel(ctx, baseX + 13*p, baseY + 7*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 13*p, baseY + 8*p + bobOffset - legOffset, p, '#333');

    // Back legs
    this.pixel(ctx, baseX + 6*p, baseY + 6*p + bobOffset - legOffset, p, horseDark);
    this.pixel(ctx, baseX + 6*p, baseY + 7*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 8*p + bobOffset - legOffset, p, '#333');

    this.pixel(ctx, baseX + 7*p, baseY + 6*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 7*p, baseY + 7*p + bobOffset + legOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 8*p + bobOffset + legOffset, p, '#333');

    // Horse tail
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 4*p, baseY + 6*p + bobOffset, p, mane);
  }

  private static drawHorsemanLeft(ctx: CanvasRenderingContext2D, x: number, y: number, p: number, bobOffset: number, frame: number,
    skin: string, armor: string, armorDark: string, armorLight: string, cape: string,
    horse: string, horseDark: string, horseLight: string, mane: string, crown: string, crownDark: string): void {
    const baseX = x - 8 * p;
    const baseY = y - 10 * p;

    // === RIDER ===
    // Crown
    this.pixel(ctx, baseX + 5*p, baseY - p + bobOffset, p, crownDark);
    this.pixel(ctx, baseX + 6*p, baseY - 2*p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 7*p, baseY - p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 8*p, baseY - 2*p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 9*p, baseY - p + bobOffset, p, crownDark);

    // Head
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 7*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 8*p, baseY + bobOffset, p, skin);
    this.pixel(ctx, baseX + 6*p, baseY + bobOffset, p, '#333'); // Eye

    // Body/Armor
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + p + bobOffset, p, armorLight);
    this.pixel(ctx, baseX + 8*p, baseY + p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 9*p, baseY + p + bobOffset, p, armorDark);

    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 6*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 8*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 9*p, baseY + 2*p + bobOffset, p, armorDark);

    // Cape (flowing behind)
    this.pixel(ctx, baseX + 11*p, baseY + p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 11*p, baseY + 2*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 12*p, baseY + 2*p + bobOffset, p, cape);

    // Legs on horse
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 9*p, baseY + 3*p + bobOffset, p, armorDark);

    // === HORSE ===
    // Horse head (facing left)
    this.pixel(ctx, baseX + p, baseY + 3*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 2*p, baseY + 3*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 3*p, baseY + 3*p + bobOffset, p, horseLight);

    this.pixel(ctx, baseX, baseY + 4*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + p, baseY + 4*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 2*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 3*p, baseY + 4*p + bobOffset, p, horse);

    // Horse eye
    this.pixel(ctx, baseX + p, baseY + 3*p + bobOffset, p, '#111');

    // Horse mane
    this.pixel(ctx, baseX + 3*p, baseY + 2*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, mane);

    // Horse body
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 8*p, baseY + 4*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 9*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 10*p, baseY + 4*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 11*p, baseY + 4*p + bobOffset, p, horseDark);

    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 8*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 9*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 10*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 11*p, baseY + 5*p + bobOffset, p, horseDark);

    // Saddle
    this.pixel(ctx, baseX + 6*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 7*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 8*p, baseY + 3*p + bobOffset, p, armorDark);

    // Horse legs (animated)
    const legOffset = frame % 2 === 0 ? 0 : p;
    // Front legs
    this.pixel(ctx, baseX + 4*p, baseY + 6*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 4*p, baseY + 7*p + bobOffset + legOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 8*p + bobOffset + legOffset, p, '#333');

    this.pixel(ctx, baseX + 5*p, baseY + 6*p + bobOffset - legOffset, p, horseDark);
    this.pixel(ctx, baseX + 5*p, baseY + 7*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 5*p, baseY + 8*p + bobOffset - legOffset, p, '#333');

    // Back legs
    this.pixel(ctx, baseX + 10*p, baseY + 6*p + bobOffset - legOffset, p, horseDark);
    this.pixel(ctx, baseX + 10*p, baseY + 7*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 10*p, baseY + 8*p + bobOffset - legOffset, p, '#333');

    this.pixel(ctx, baseX + 11*p, baseY + 6*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 11*p, baseY + 7*p + bobOffset + legOffset, p, horse);
    this.pixel(ctx, baseX + 11*p, baseY + 8*p + bobOffset + legOffset, p, '#333');

    // Horse tail
    this.pixel(ctx, baseX + 12*p, baseY + 4*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 13*p, baseY + 5*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 13*p, baseY + 6*p + bobOffset, p, mane);
  }

  private static drawHorsemanUp(ctx: CanvasRenderingContext2D, x: number, y: number, p: number, bobOffset: number, frame: number,
    _skin: string, _armor: string, _armorDark: string, _armorLight: string, cape: string,
    horse: string, horseDark: string, horseLight: string, mane: string, crown: string, crownDark: string): void {
    const baseX = x - 5 * p;
    const baseY = y - 10 * p;

    // === HORSE (from behind, going up) ===
    // Horse ears
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + bobOffset, p, horse);

    // Horse head (back of head)
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, horseDark);

    // Horse mane
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, mane);

    // === RIDER ===
    // Crown (back view)
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, crownDark);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 6*p, baseY + 2*p + bobOffset, p, crownDark);

    // Head (back)
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, '#5c3317');
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, '#5c3317');
    this.pixel(ctx, baseX + 6*p, baseY + 3*p + bobOffset, p, '#5c3317');

    // Cape (prominent from behind)
    this.pixel(ctx, baseX + 3*p, baseY + 4*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 7*p, baseY + 4*p + bobOffset, p, cape);

    this.pixel(ctx, baseX + 3*p, baseY + 5*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, cape);
    this.pixel(ctx, baseX + 7*p, baseY + 5*p + bobOffset, p, cape);

    // Horse body (from behind)
    this.pixel(ctx, baseX + 2*p, baseY + 6*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 3*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 6*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 5*p, baseY + 6*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 6*p, baseY + 6*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 7*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 8*p, baseY + 6*p + bobOffset, p, horseDark);

    this.pixel(ctx, baseX + 2*p, baseY + 7*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 3*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 5*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 8*p, baseY + 7*p + bobOffset, p, horseDark);

    // Horse legs (animated)
    const legOffset = frame % 2 === 0 ? 0 : p;
    this.pixel(ctx, baseX + 2*p, baseY + 8*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 2*p, baseY + 9*p + bobOffset + legOffset, p, '#333');

    this.pixel(ctx, baseX + 4*p, baseY + 8*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 9*p + bobOffset - legOffset, p, '#333');

    this.pixel(ctx, baseX + 6*p, baseY + 8*p + bobOffset - legOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 9*p + bobOffset - legOffset, p, '#333');

    this.pixel(ctx, baseX + 8*p, baseY + 8*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 8*p, baseY + 9*p + bobOffset + legOffset, p, '#333');

    // Horse tail
    this.pixel(ctx, baseX + 5*p, baseY + 8*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 5*p, baseY + 9*p + bobOffset, p, mane);
    this.pixel(ctx, baseX + 5*p, baseY + 10*p + bobOffset, p, mane);
  }

  private static drawHorsemanDown(ctx: CanvasRenderingContext2D, x: number, y: number, p: number, bobOffset: number, frame: number,
    skin: string, armor: string, armorDark: string, armorLight: string, _cape: string,
    horse: string, horseDark: string, horseLight: string, mane: string, crown: string, crownDark: string): void {
    const baseX = x - 5 * p;
    const baseY = y - 10 * p;

    // === RIDER ===
    // Crown
    this.pixel(ctx, baseX + 3*p, baseY + bobOffset, p, crownDark);
    this.pixel(ctx, baseX + 4*p, baseY - p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 5*p, baseY + bobOffset, p, crown);
    this.pixel(ctx, baseX + 6*p, baseY - p + bobOffset, p, crown);
    this.pixel(ctx, baseX + 7*p, baseY + bobOffset, p, crownDark);

    // Head (front view)
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 5*p, baseY + p + bobOffset, p, skin);
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, skin);
    // Eyes
    this.pixel(ctx, baseX + 4*p, baseY + p + bobOffset, p, '#333');
    this.pixel(ctx, baseX + 6*p, baseY + p + bobOffset, p, '#333');

    // Body/Armor
    this.pixel(ctx, baseX + 3*p, baseY + 2*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + 2*p + bobOffset, p, armorLight);
    this.pixel(ctx, baseX + 6*p, baseY + 2*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + 2*p + bobOffset, p, armorDark);

    this.pixel(ctx, baseX + 3*p, baseY + 3*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 4*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 5*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + 3*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 7*p, baseY + 3*p + bobOffset, p, armorDark);

    // Legs on saddle
    this.pixel(ctx, baseX + 2*p, baseY + 4*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 8*p, baseY + 4*p + bobOffset, p, armorDark);

    // === HORSE ===
    // Horse head (front)
    this.pixel(ctx, baseX + 4*p, baseY + 8*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 5*p, baseY + 8*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 6*p, baseY + 8*p + bobOffset, p, horse);

    this.pixel(ctx, baseX + 4*p, baseY + 9*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 5*p, baseY + 9*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 9*p + bobOffset, p, horseDark);

    // Horse eyes
    this.pixel(ctx, baseX + 4*p, baseY + 8*p + bobOffset, p, '#111');
    this.pixel(ctx, baseX + 6*p, baseY + 8*p + bobOffset, p, '#111');

    // Horse ears
    this.pixel(ctx, baseX + 3*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 7*p + bobOffset, p, horse);

    // Horse mane
    this.pixel(ctx, baseX + 5*p, baseY + 7*p + bobOffset, p, mane);

    // Saddle
    this.pixel(ctx, baseX + 4*p, baseY + 4*p + bobOffset, p, armorDark);
    this.pixel(ctx, baseX + 5*p, baseY + 4*p + bobOffset, p, armor);
    this.pixel(ctx, baseX + 6*p, baseY + 4*p + bobOffset, p, armorDark);

    // Horse body (front view)
    this.pixel(ctx, baseX + 2*p, baseY + 5*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 3*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 5*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 6*p, baseY + 5*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 7*p, baseY + 5*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 8*p, baseY + 5*p + bobOffset, p, horseDark);

    this.pixel(ctx, baseX + 2*p, baseY + 6*p + bobOffset, p, horseDark);
    this.pixel(ctx, baseX + 3*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 5*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 6*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 7*p, baseY + 6*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 8*p, baseY + 6*p + bobOffset, p, horseDark);

    this.pixel(ctx, baseX + 3*p, baseY + 7*p + bobOffset, p, horse);
    this.pixel(ctx, baseX + 4*p, baseY + 7*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 5*p, baseY + 7*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 6*p, baseY + 7*p + bobOffset, p, horseLight);
    this.pixel(ctx, baseX + 7*p, baseY + 7*p + bobOffset, p, horse);

    // Horse legs (animated) - front view shows 2 legs
    const legOffset = frame % 2 === 0 ? 0 : p;
    this.pixel(ctx, baseX + 3*p, baseY + 10*p + bobOffset + legOffset, p, horseDark);
    this.pixel(ctx, baseX + 3*p, baseY + 11*p + bobOffset + legOffset, p, '#333');

    this.pixel(ctx, baseX + 7*p, baseY + 10*p + bobOffset - legOffset, p, horseDark);
    this.pixel(ctx, baseX + 7*p, baseY + 11*p + bobOffset - legOffset, p, '#333');
  }
}
