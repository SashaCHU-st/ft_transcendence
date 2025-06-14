import { describe, it, expect, vi } from 'vitest';
import {
  updatePowerUps,
  activatePowerUp,
  deactivatePowerUp,
  resetPowerUps,
  POWER_UPS,
  PowerUpType,
  DEFAULT_EFFECTS,
  applyEffects,
  createDefaultPowerUpState,
} from '../powerups';
import type { PowerUpState } from '../powerups';
import type { Side } from '../types';

function createState(): {
  powerUps: PowerUpState;
  powerUpEffects: {
    speed: Record<Side, number>;
    scale: Record<Side, number>;
    powerShot: Record<Side, boolean>;
  };
  onPowerUpUpdate?: (l: PowerUpType | null, r: PowerUpType | null) => void;
  powerUpsEnabled: boolean;
} {
  return { ...createDefaultPowerUpState(), powerUpsEnabled: true };
}

describe('updatePowerUps', () => {
  it('decrements timers and clamps at zero', () => {
    const state = createState();
    state.powerUps.active.left = { type: PowerUpType.Speed, timer: 1 };
    state.powerUps.active.right = { type: PowerUpType.MegaPaddle, timer: 0.1 };
    updatePowerUps(state, 0.3);
    expect(state.powerUps.active.left?.timer).toBeCloseTo(0.7);
    expect(state.powerUps.active.right).toBeNull();
  });

  it('clears active power-up when timer expires exactly', () => {
    const state = createState();
    state.powerUps.active.right = { type: PowerUpType.PowerShot, timer: 0.5 };
    updatePowerUps(state, 0.5);
    expect(state.powerUps.active.right).toBeNull();
  });

  it('does not decrement timer when power-ups are disabled', () => {
    const state = createState();
    state.powerUps.active.left = { type: PowerUpType.Speed, timer: 1 };
    state.powerUpsEnabled = false;
    updatePowerUps(state, 0.4);
    expect(state.powerUps.active.left?.timer).toBe(1);
  });
});

describe('activate/deactivate', () => {
  it('activates and overwrites existing power-up', () => {
    const state = createState();
    activatePowerUp(state, 'left', { type: PowerUpType.Speed, duration: 2 });
    expect(state.powerUps.active.left).toEqual({ type: PowerUpType.Speed, timer: 2 });
    activatePowerUp(state, 'left', { type: PowerUpType.MegaPaddle, duration: 1 });
    expect(state.powerUps.active.left).toEqual({ type: PowerUpType.MegaPaddle, timer: 1 });
  });

  it('deactivates power-up', () => {
    const state = createState();
    activatePowerUp(state, 'right', { type: PowerUpType.PowerShot, duration: 3 });
    deactivatePowerUp(state, 'right');
    expect(state.powerUps.active.right).toBeNull();
  });

  it('does not trigger callback when slot already empty', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    deactivatePowerUp(state, 'left');
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('triggers callback when activating a power-up', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    activatePowerUp(state, 'left', { type: PowerUpType.Speed, duration: 1 });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(PowerUpType.Speed, null);
  });

  it('triggers callback when replacing an active power-up', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    activatePowerUp(state, 'left', { type: PowerUpType.Speed, duration: 1 });
    activatePowerUp(state, 'left', { type: PowerUpType.MegaPaddle, duration: 1 });
    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(onUpdate).toHaveBeenLastCalledWith(PowerUpType.MegaPaddle, null);
  });

  it('ignores activation with non-positive duration', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    activatePowerUp(state, 'left', { type: PowerUpType.Speed, duration: 0 });
    activatePowerUp(state, 'right', { type: PowerUpType.MegaPaddle, duration: -1 });
    expect(state.powerUps.active.left).toBeNull();
    expect(state.powerUps.active.right).toBeNull();
    expect(onUpdate).not.toHaveBeenCalled();
  });
});

describe('onPowerUpUpdate from updatePowerUps', () => {
  it('triggers callback when a power-up expires', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    state.powerUps.active.left = { type: PowerUpType.Speed, timer: 0.1 };
    state.powerUps.active.right = { type: PowerUpType.PowerShot, timer: 1 };
    updatePowerUps(state, 0.2);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(null, PowerUpType.PowerShot);
  });
});

describe('resetPowerUps', () => {
  it('clears active power-ups, effects and available list', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;

    state.powerUps.active.left = { type: PowerUpType.Speed, timer: 2 };
    state.powerUps.active.right = { type: PowerUpType.MegaPaddle, timer: 3 };
    // Apply effects manually to mimic active power-ups
    applyEffects(state as any, 'left', POWER_UPS[PowerUpType.Speed].effect);
    applyEffects(state as any, 'right', POWER_UPS[PowerUpType.MegaPaddle].effect);

    state.powerUps.available.push({ type: PowerUpType.PowerShot, duration: 1 });

    resetPowerUps(state);

    expect(state.powerUps.active.left).toBeNull();
    expect(state.powerUps.active.right).toBeNull();
    expect(state.powerUps.available).toEqual([]);
    expect(state.powerUpEffects).toEqual({
      speed: { left: DEFAULT_EFFECTS.speed, right: DEFAULT_EFFECTS.speed },
      scale: { left: DEFAULT_EFFECTS.scale, right: DEFAULT_EFFECTS.scale },
      powerShot: { left: DEFAULT_EFFECTS.powerShot, right: DEFAULT_EFFECTS.powerShot },
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(null, null);
  });
});

describe('edge cases', () => {
  it('resetPowerUps can be called on empty state', () => {
    const state = createState();
    resetPowerUps(state);
    expect(state.powerUps.active.left).toBeNull();
    expect(state.powerUps.active.right).toBeNull();
    resetPowerUps(state);
    expect(state.powerUps.active.left).toBeNull();
    expect(state.powerUps.active.right).toBeNull();
  });

  it('updatePowerUps with no active power-ups triggers no update', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    updatePowerUps(state, 0.5);
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('deactivatePowerUp triggers callback when clearing slot', () => {
    const onUpdate = vi.fn();
    const state = createState();
    state.onPowerUpUpdate = onUpdate;
    activatePowerUp(state, 'left', { type: PowerUpType.Speed, duration: 1 });
    onUpdate.mockClear();
    deactivatePowerUp(state, 'left');
    expect(onUpdate).toHaveBeenCalledWith(null, null);
  });
});
