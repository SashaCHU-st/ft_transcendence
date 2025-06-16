import type { Side } from './types';
import type { PowerUpInfo, EffectValues } from '../../../shared/powerups.js';
import {
  POWER_UPS as SHARED_POWER_UPS,
  DEFAULT_EFFECTS as SHARED_DEFAULT_EFFECTS,
} from '../../../shared/powerups.js';

export enum PowerUpType {
  /** Doubles paddle speed */
  Speed = 'speed',
  /** Increases paddle length */
  MegaPaddle = 'mega',
  /** Doubles ball speed when hitting */
  PowerShot = 'power',
}

export type { PowerUpInfo, EffectValues } from '../../../shared/powerups.js';
export const DEFAULT_EFFECTS = SHARED_DEFAULT_EFFECTS;
export const POWER_UPS: Record<PowerUpType, PowerUpInfo> = SHARED_POWER_UPS;

import {
  applyEffects,
  removeEffects,
  updatePowerUps,
  resetPowerUps,
  activatePowerUp as sharedActivatePowerUp,
} from '../../../shared/powerupHelpers.js';
export { applyEffects, removeEffects, updatePowerUps, resetPowerUps };


export interface PowerUp {
  type: PowerUpType;
  duration: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  timer: number;
}

export interface PowerUpState {
  available: PowerUp[];
  active: Record<Side, ActivePowerUp | null>;
}

export interface PowerUpContext {
  powerUps: PowerUpState;
  powerUpEffects: {
    speed: Record<Side, number>;
    scale: Record<Side, number>;
    powerShot: Record<Side, boolean>;
  };
  onPowerUpUpdate?: (left: PowerUpType | null, right: PowerUpType | null) => void;
  powerUpsEnabled: boolean;
}

function notifyUpdate(state: PowerUpContext) {
  state.onPowerUpUpdate?.(
    state.powerUps.active.left?.type ?? null,
    state.powerUps.active.right?.type ?? null,
  );
}

export function clearActivePowerUp(
  state: PowerUpContext,
  side: Side,
): boolean {
  const active = state.powerUps.active[side];
  if (active) {
    removeEffects(state, side, POWER_UPS[active.type].effect);
    state.powerUps.active[side] = null;
    return true;
  }
  return false;
}

export function deactivatePowerUp(state: PowerUpContext, side: Side) {
  if (clearActivePowerUp(state, side)) {
    notifyUpdate(state);
  }
}

export function activatePowerUp(
  state: PowerUpContext,
  side: Side,
  powerUp: PowerUp,
) {
  if (sharedActivatePowerUp(state as any, side, powerUp.type, powerUp.duration)) {
    notifyUpdate(state);
  }
}



export function createDefaultPowerUpState() {
  return {
    powerUps: { available: [], active: { left: null, right: null } },
    powerUpEffects: {
      speed: { left: DEFAULT_EFFECTS.speed, right: DEFAULT_EFFECTS.speed },
      scale: { left: DEFAULT_EFFECTS.scale, right: DEFAULT_EFFECTS.scale },
      powerShot: { left: DEFAULT_EFFECTS.powerShot, right: DEFAULT_EFFECTS.powerShot },
    },
  };
}
