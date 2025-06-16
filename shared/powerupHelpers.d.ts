import type { EffectValues } from './powerups.js';

export interface ActivePowerUp {
  type: string;
  timer: number;
}

export interface PowerUpContext {
  powerUps: {
    active: {
      left: ActivePowerUp | null;
      right: ActivePowerUp | null;
    };
    available: any[];
  };
  powerUpEffects: {
    speed: { left: number; right: number };
    scale: { left: number; right: number };
    powerShot: { left: boolean; right: boolean };
  };
  powerUpsEnabled: boolean;
  onPowerUpUpdate?: (left: string | null, right: string | null) => void;
}

export function applyEffects(
  state: PowerUpContext,
  side: 'left' | 'right',
  effect: Partial<EffectValues>,
): void;

export function removeEffects(
  state: PowerUpContext,
  side: 'left' | 'right',
  effect: Partial<EffectValues>,
): void;

export function activatePowerUp(
  state: PowerUpContext,
  side: 'left' | 'right',
  type: string,
  duration: number,
): boolean;

export function updatePowerUps(state: PowerUpContext, dt: number): void;

export function resetPowerUps(state: PowerUpContext): void;
