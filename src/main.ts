import './style.css';
import { inject } from '@vercel/analytics';
import { Game } from './game/Game';
import type { Team } from './game/types';
import type { Card } from './game/Card';
import type { BuildingChoice } from './game/Building';

// Initialize Vercel Analytics
inject();

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const topCount = document.getElementById('top-count')!;
const bottomCount = document.getElementById('bottom-count')!;
const topKills = document.getElementById('top-kills')!;
const bottomKills = document.getElementById('bottom-kills')!;
const winnerDisplay = document.getElementById('winner-display')!;

// Selection modal elements
const cardModal = document.getElementById('card-modal')!;
const cardModalTitle = document.getElementById('card-modal-title')!;
const cardChoices = document.getElementById('card-choices')!;

// Stat panel elements
const topStatList = document.getElementById('top-stat-list')!;
const bottomStatList = document.getElementById('bottom-stat-list')!;

const startBattle = document.getElementById('start-battle') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

function updateCounts(): void {
  topCount.textContent = `Units: ${game.getTeamCount('top')}`;
  bottomCount.textContent = `Units: ${game.getTeamCount('bottom')}`;
  topKills.textContent = `Kills: ${game.getKills('top')}`;
  bottomKills.textContent = `Kills: ${game.getKills('bottom')}`;
}

function updateButtonStates(): void {
  startBattle.disabled = game.isGameRunning();
}

function onWinner(team: Team): void {
  const teamName = team === 'top' ? 'Blue Team' : 'Red Team';
  const color = team === 'top' ? '#4a90d9' : '#d94a4a';
  winnerDisplay.textContent = `${teamName} Wins!`;
  winnerDisplay.style.color = color;
  updateButtonStates();
}

function updateStatPanels(): void {
  updateStatPanel('top', topStatList);
  updateStatPanel('bottom', bottomStatList);
}

function updateStatPanel(team: Team, element: HTMLElement): void {
  const mods = game.getModifiers(team);
  const stats: string[] = [];

  const types = ['swordsman', 'archer', 'mage', 'knight', 'healer'] as const;

  // Damage multipliers
  for (const type of types) {
    const mult = mods.getDamageMultiplier(type);
    if (mult > 1) {
      stats.push(`<div class="stat-item"><span class="stat-name">${capitalize(type)} Dmg:</span> <span class="stat-value">+${Math.round((mult - 1) * 100)}%</span></div>`);
    }
  }

  // Health multipliers
  for (const type of types) {
    const mult = mods.getHealthMultiplier(type);
    if (mult > 1) {
      stats.push(`<div class="stat-item"><span class="stat-name">${capitalize(type)} HP:</span> <span class="stat-value">+${Math.round((mult - 1) * 100)}%</span></div>`);
    }
  }

  // Range multipliers
  for (const type of types) {
    const mult = mods.getRangeMultiplier(type);
    if (mult > 1) {
      stats.push(`<div class="stat-item"><span class="stat-name">${capitalize(type)} Range:</span> <span class="stat-value">+${Math.round((mult - 1) * 100)}%</span></div>`);
    }
  }

  // Speed multipliers
  if (mods.speedMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Move Speed:</span> <span class="stat-value">+${Math.round((mods.speedMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.attackSpeedMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Attack Speed:</span> <span class="stat-value">+${Math.round((mods.attackSpeedMultiplier - 1) * 100)}%</span></div>`);
  }

  // Class-specific on-hit unlocks
  if (mods.archerPoisonOnHit) {
    stats.push(`<div class="stat-item"><span class="stat-name">Archer Poison:</span> <span class="stat-value">Active</span></div>`);
  }
  if (mods.swordsmanFireOnHit) {
    stats.push(`<div class="stat-item"><span class="stat-name">Swordsman Fire:</span> <span class="stat-value">Active</span></div>`);
  }
  if (mods.knightFrostOnHit) {
    stats.push(`<div class="stat-item"><span class="stat-name">Knight Frost:</span> <span class="stat-value">Active</span></div>`);
  }

  // Status effect DoT/duration multipliers
  if (mods.fireDoTMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Fire DoT:</span> <span class="stat-value">+${Math.round((mods.fireDoTMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.poisonDoTMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Poison DoT:</span> <span class="stat-value">+${Math.round((mods.poisonDoTMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.frostDurationMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Frost Duration:</span> <span class="stat-value">+${Math.round((mods.frostDurationMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.voidDoTMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Void DoT:</span> <span class="stat-value">+${Math.round((mods.voidDoTMultiplier - 1) * 100)}%</span></div>`);
  }

  // Other effects
  if (mods.lifestealPercent > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Lifesteal:</span> <span class="stat-value">+${Math.round((mods.lifestealPercent - 1) * 100)}%</span></div>`);
  }
  if (mods.critChance > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Crit:</span> <span class="stat-value">+${Math.round((mods.critChance - 1) * 100)}%</span></div>`);
  }
  if (mods.splashMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Splash:</span> <span class="stat-value">+${Math.round((mods.splashMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.thornsMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Thorns:</span> <span class="stat-value">+${Math.round((mods.thornsMultiplier - 1) * 100)}%</span></div>`);
  }
  if (mods.regenMultiplier > 1) {
    stats.push(`<div class="stat-item"><span class="stat-name">Regen:</span> <span class="stat-value">+${Math.round((mods.regenMultiplier - 1) * 100)}%</span></div>`);
  }

  element.innerHTML = stats.length > 0 ? stats.join('') : 'No modifiers yet';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isCard(item: Card | BuildingChoice): item is Card {
  return 'effect' in item;
}

function onSelection(team: Team, items: (Card | BuildingChoice)[], type: 'card' | 'building'): void {
  const teamName = team === 'top' ? 'Blue Team' : 'Red Team';
  const teamColor = team === 'top' ? '#4a90d9' : '#d94a4a';

  if (type === 'card') {
    cardModalTitle.textContent = `${teamName} - Choose a Card`;
  } else {
    cardModalTitle.textContent = `${teamName} - Choose a Building`;
  }
  cardModalTitle.style.color = teamColor;

  // Clear previous choices
  cardChoices.innerHTML = '';

  // Create choice elements
  for (const item of items) {
    const choiceEl = document.createElement('div');
    choiceEl.className = 'card';

    if (isCard(item)) {
      choiceEl.style.borderColor = item.rarityColor;
      choiceEl.style.boxShadow = `0 0 10px ${item.rarityColor}40`;
      choiceEl.innerHTML = `
        <div class="card-rarity" style="background-color: ${item.rarityColor}">${item.rarity.toUpperCase()}</div>
        <div class="card-name" style="color: ${item.color}">${item.name}</div>
        <div class="card-description">${item.description}</div>
      `;
      choiceEl.addEventListener('click', () => {
        game.selectCard(item);
        updateStatPanels();
        if (!game.isSelectingCard()) {
          cardModal.classList.add('hidden');
        }
      });
    } else {
      choiceEl.style.borderColor = item.color;
      choiceEl.innerHTML = `
        <div class="card-name" style="color: ${item.color}">${item.name}</div>
        <div class="card-description">${item.description}</div>
      `;
      choiceEl.addEventListener('click', () => {
        game.selectBuilding(item);
        if (!game.isSelectingCard()) {
          cardModal.classList.add('hidden');
        }
      });
    }

    cardChoices.appendChild(choiceEl);
  }

  cardModal.classList.remove('hidden');
}

const game = new Game(canvas, updateCounts, onWinner, onSelection);

// Enable single player mode - player controls Red Team, Blue Team is AI
game.setSinglePlayerMode(true);

startBattle.addEventListener('click', () => {
  winnerDisplay.textContent = '';
  game.start();
  updateButtonStates();
});

resetButton.addEventListener('click', () => {
  winnerDisplay.textContent = '';
  cardModal.classList.add('hidden');
  game.reset();
  updateButtonStates();
  updateStatPanels();
});

updateCounts();
