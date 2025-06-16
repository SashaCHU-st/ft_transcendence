import { POWER_UPS, DEFAULT_EFFECTS } from './powerups.js';

const SIDES = ['left', 'right'];

function getActive(state, side) {
  return state.powerUps.active[side];
}

function setActive(state, side, value) {
  state.powerUps.active[side] = value;
}

export function applyEffects(state, side, effect) {
  if (effect.speed !== undefined) state.powerUpEffects.speed[side] = effect.speed;
  if (effect.scale !== undefined) state.powerUpEffects.scale[side] = effect.scale;
  if (effect.powerShot !== undefined)
    state.powerUpEffects.powerShot[side] = effect.powerShot;
}

export function removeEffects(state, side, effect) {
  if (effect.speed !== undefined)
    state.powerUpEffects.speed[side] = DEFAULT_EFFECTS.speed;
  if (effect.scale !== undefined)
    state.powerUpEffects.scale[side] = DEFAULT_EFFECTS.scale;
  if (effect.powerShot !== undefined)
    state.powerUpEffects.powerShot[side] = DEFAULT_EFFECTS.powerShot;
}

export function activatePowerUp(state, side, type, duration) {
  if (!(duration > 0 && Number.isFinite(duration))) return false;
  const info = POWER_UPS[type];
  if (!info) return false;

  const active = getActive(state, side);
  if (active) removeEffects(state, side, POWER_UPS[active.type].effect);

  setActive(state, side, { type, timer: duration });
  applyEffects(state, side, info.effect);

  return true;
}

export function updatePowerUps(state, dt) {
  if (state.powerUpsEnabled === false) return;
  let changed = false;
  for (const side of SIDES) {
    const active = getActive(state, side);
    if (!active) continue;
    active.timer = Math.max(active.timer - dt, 0);
    if (active.timer === 0) {
      removeEffects(state, side, POWER_UPS[active.type].effect);
      setActive(state, side, null);
      changed = true;
    }
  }
  if (changed && typeof state.onPowerUpUpdate === 'function') {
    state.onPowerUpUpdate(
      getActive(state, 'left')?.type ?? null,
      getActive(state, 'right')?.type ?? null,
    );
  }
}

export function resetPowerUps(state) {
  let changed = false;
  for (const side of SIDES) {
    const active = getActive(state, side);
    if (active) {
      removeEffects(state, side, POWER_UPS[active.type].effect);
      setActive(state, side, null);
      changed = true;
    }
  }
  if (state.powerUps && 'available' in state.powerUps) {
    state.powerUps.available = [];
  }
  if (changed && typeof state.onPowerUpUpdate === 'function') {
    state.onPowerUpUpdate(
      getActive(state, 'left')?.type ?? null,
      getActive(state, 'right')?.type ?? null,
    );
  }
}
