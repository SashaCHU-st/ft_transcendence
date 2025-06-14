import type { Side } from './types';
import { SIDES } from './types';

export enum PowerUpType {
  /** Doubles paddle speed */
  Speed = 'speed',
  /** Increases paddle length */
  MegaPaddle = 'mega',
  /** Doubles ball speed when hitting */
  PowerShot = 'power',
}

export interface PowerUpInfo {
  icon: string;
  label: string;
  /** Used when no custom duration is provided */
  defaultDuration: number;
  /** Values to apply while the power-up is active */
  effect: Partial<EffectValues>;
}

export const DEFAULT_EFFECTS = {
  speed: 1,
  scale: 1,
  powerShot: false,
} as const;

export type EffectValues = typeof DEFAULT_EFFECTS;

export const POWER_UPS = {
  [PowerUpType.Speed]: {
    icon: '⚡',
    label: 'Speed boost: doubles paddle speed',
    defaultDuration: 8,
    effect: { speed: 2 },
  },
  [PowerUpType.MegaPaddle]: {
    icon: '🛡',
    label: 'Mega paddle: increases paddle length',
    defaultDuration: 12,
    effect: { scale: 1.5 },
  },
  [PowerUpType.PowerShot]: {
    icon: '💥',
    label: 'Power shot: doubles ball speed on hit',
    defaultDuration: 10,
    effect: { powerShot: true },
  },
} as const satisfies Record<PowerUpType, PowerUpInfo>;

export function applyEffects(
  state: PowerUpContext,
  side: Side,
  effect: Partial<EffectValues>,
) {
  if (effect.speed !== undefined)
    state.powerUpEffects.speed[side] = effect.speed;
  if (effect.scale !== undefined)
    state.powerUpEffects.scale[side] = effect.scale;
  if (effect.powerShot !== undefined)
    state.powerUpEffects.powerShot[side] = effect.powerShot;
}

export function removeEffects(
  state: PowerUpContext,
  side: Side,
  effect: Partial<EffectValues>,
) {
  if (effect.speed !== undefined)
    state.powerUpEffects.speed[side] = DEFAULT_EFFECTS.speed;
  if (effect.scale !== undefined)
    state.powerUpEffects.scale[side] = DEFAULT_EFFECTS.scale;
  if (effect.powerShot !== undefined)
    state.powerUpEffects.powerShot[side] = DEFAULT_EFFECTS.powerShot;
}

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
  const duration = powerUp.duration;
  if (duration <= 0 || !Number.isFinite(duration)) return;

  clearActivePowerUp(state, side);
  const active: ActivePowerUp = { type: powerUp.type, timer: duration };
  state.powerUps.active[side] = active;
  applyEffects(state, side, POWER_UPS[powerUp.type].effect);
  notifyUpdate(state);
}

export function updatePowerUps(state: PowerUpContext, dt: number) {
  if (state.powerUpsEnabled === false) return;
  let changed = false;
  for (const side of SIDES) {
    const active = state.powerUps.active[side];
    if (!active) continue;
    active.timer = Math.max(active.timer - dt, 0);
    if (active.timer === 0) {
      changed = clearActivePowerUp(state, side) || changed;
    }
  }
  if (changed) {
    notifyUpdate(state);
  }
}

export function resetPowerUps(state: PowerUpContext) {
  let changed = false;
  for (const side of SIDES) {
    changed = clearActivePowerUp(state, side) || changed;
  }
  state.powerUps.available = [];
  if (changed) {
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
