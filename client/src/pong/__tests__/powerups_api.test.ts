import { describe, it, expect, beforeEach, vi } from 'vitest';

// Reuse simple mocks for scene and babylon engine
vi.mock('../scene', () => {
  function mesh() {
    return {
      position: {
        x: 0,
        y: 0,
        z: 0,
        set(x: number, y: number, z: number) {
          this.x = x;
          this.y = y;
          this.z = z;
        },
      },
    };
  }
  return {
    createScene: vi.fn(() => ({
      scene: {},
      camera: {},
      leftPaddle: mesh(),
      rightPaddle: mesh(),
      ball: mesh(),
    })),
    fitFieldToCamera: vi.fn(),
    boom: vi.fn(),
    bigBoom: vi.fn(),
  };
});

vi.mock('@babylonjs/core', () => {
  class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    clone() {
      return new Vector3(this.x, this.y, this.z);
    }
  }

  return {
    Engine: class {
      scenes = [{}];
      runRenderLoop() {}
      stopRenderLoop() {}
      dispose() {}
      resize() {}
      getDeltaTime() {
        return 16;
      }
    },
    Vector3,
    Animation: class { static ANIMATIONTYPE_VECTOR3=0; static ANIMATIONLOOPMODE_CONSTANT=0; setKeys() {} },
  };
});

import { initGame } from '../pong';
import type { GameAPI, GameState } from '../pong';
import { PowerUpType, updatePowerUps, DEFAULT_EFFECTS } from '../powerups';

let api: GameAPI & { __state: GameState };

beforeEach(() => {
  const canvas = document.createElement('canvas');
  api = initGame(canvas) as GameAPI & { __state: GameState };
});

describe('setPowerUpsEnabled', () => {
  it('clears active power-ups when disabled', () => {
    api.usePowerUp?.('left', { type: PowerUpType.Speed, duration: 1 });
    updatePowerUps(api.__state, 0.5);
    expect(api.__state.powerUps.active.left?.timer).toBeCloseTo(0.5);
    api.setPowerUpsEnabled?.(false);
    expect(api.__state.powerUps.active.left).toBeNull();
  });

  it('clears effects and icons when disabled', () => {
    let last: [PowerUpType | null, PowerUpType | null] | null = null;
    const canvas = document.createElement('canvas');
    api = initGame(canvas, {
      onPowerUpUpdate: (l, r) => {
        last = [l, r];
      },
    }) as GameAPI & { __state: GameState };

    api.__state.powerUps.available.push({
      type: PowerUpType.Speed,
      duration: 1,
    });
    api.usePowerUp?.('left', { type: PowerUpType.Speed, duration: 1 });

    expect(api.__state.powerUps.active.left?.type).toBe(PowerUpType.Speed);
    expect(api.__state.powerUpEffects.speed.left).toBe(2);
    expect(api.__state.powerUps.available.length).toBe(1);
    expect(last).toEqual([PowerUpType.Speed, null]);

    api.setPowerUpsEnabled?.(false);

    expect(api.__state.powerUps.active.left).toBeNull();
    expect(api.__state.powerUps.available).toEqual([]);
    expect(api.__state.powerUpEffects.speed.left).toBe(DEFAULT_EFFECTS.speed);
    expect(last).toEqual([null, null]);
  });
});

describe('starting a match clears scoreboard power-up icons', () => {
  it('calls onPowerUpUpdate with nulls when starting a new match', () => {
    let last: [PowerUpType | null, PowerUpType | null] | null = null;
    const canvas = document.createElement('canvas');
    api = initGame(canvas, {
      onPowerUpUpdate: (l, r) => {
        last = [l, r];
      },
    }) as GameAPI & { __state: GameState };

    api.usePowerUp?.('left', { type: PowerUpType.Speed, duration: 1 });
    expect(last).toEqual([PowerUpType.Speed, null]);

    api.startLocal2P();
    expect(last).toEqual([null, null]);
  });
});
