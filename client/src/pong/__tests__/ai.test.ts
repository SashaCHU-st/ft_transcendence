import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateAI, calcTargetZ } from '../ai';
import { predictImpactZ } from '../physics';

vi.mock('../physics', async () => {
  const actual: any = await vi.importActual('../physics');
  return {
    ...actual,
    predictImpactZ: vi.fn(actual.predictImpactZ),
  };
});
import type { SceneObjects } from '../scene';
import type { GameState } from '../pong';
import { PowerUpType } from '../powerups';
import { setupKeyListeners } from '../utils';
import { AI_KEYS } from '../ai';

beforeEach(() => {
  vi.clearAllMocks();
});

function createState(): GameState {
  return {
    physics: {
      FIELD_WIDTH: 10,
      FIELD_HEIGHT: 5,
      PADDLE_SPEED: 1,
      AI_SPEED: 0.5,
      AI_REACTION: 1,
      AI_ERROR: 0,
      BALL_SPEED: 1,
      WINNING_SCORE: 3,
    },
    match: {
      playerScore: 1,
      aiScore: 0,
      leftName: '',
      rightName: '',
      isFinalMatch: false,
    },
    input: {
      playerDzLeft: 0,
      playerDzRight: 0,
      aiTimer: 0,
      aiTargetZ: 0,
      aiPrevBallX: 0,
      aiPrevBallZ: 0,
      ballDX: 0.2,
      ballDZ: 0,
      dramaPhase: 0,
    },
    FIXED_DT: 0,
    accumulator: 0,
    gameStarted: true,
    currentMode: 0 as any,
    paused: false,
    manualPaused: false,
    escMenuOpen: false,
    keyDownHandler: null,
    keyUpHandler: null,
    goalTimeout: null,
    ballSpawnTimeout: null,
    remoteState: null,
    remoteBallDX: 0,
    remotePrevBallDX: 0,
    bot: null,
    powerUps: { available: [], activeLeft: null, activeRight: null },
  };
}

function mesh() {
  return {
    position: { x: 0, y: 0.5, z: 0, set() {} },
  };
}

function createObjs(): SceneObjects {
  return { scene: {}, leftPaddle: mesh(), rightPaddle: mesh(), ball: mesh() } as any;
}

describe('AI power-up usage', () => {
  it('activates speed power-up when available and losing', () => {
    const state = createState();
    const objs = createObjs();
    state.powerUps.available.push({ type: PowerUpType.Speed, duration: 1 });
    updateAI(state, objs, 1);
    expect(state.powerUps.activeRight?.type).toBe(PowerUpType.Speed);
    expect(state.powerUps.available.length).toBe(0);
  });
});

describe('calcTargetZ helper', () => {
  it('bounces off the left wall before aiming at the right', () => {
    const spy = predictImpactZ as unknown as vi.Mock;
    spy.mockClear();
    calcTargetZ(0, 0, -1, 0, 1, 10, 4.5);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][4]).toBe(-10 + 1.5);
    const last = spy.mock.calls[spy.mock.calls.length - 1] as any;
    expect(last[4]).toBe(10 - 1.5);
  });

  it('returns prevZ when elapsed is zero', () => {
    const spy = predictImpactZ as unknown as vi.Mock;
    spy.mockClear();
    const result = calcTargetZ(1, 2, 0.5, 0.1, 0, 10, 4.5);
    expect(result).toBe(2);
    expect(spy).not.toHaveBeenCalled();
  });

  it('handles negative dx by bouncing off the left wall', () => {
    const prevX = 0;
    const prevZ = 1;
    const dx = -2;
    const dz = 1;
    const elapsed = 1;
    const fieldWidth = 10;
    const limit = 4.5;
    const leftX = -fieldWidth + 1.5;
    const bounceZ = predictImpactZ(
      prevX,
      prevZ,
      dx / elapsed,
      dz / elapsed,
      leftX,
      limit,
    );
    const expected = predictImpactZ(
      leftX,
      bounceZ,
      -(dx / elapsed),
      dz / elapsed,
      fieldWidth - 1.5,
      limit,
    );
    const result = calcTargetZ(
      prevX,
      prevZ,
      dx,
      dz,
      elapsed,
      fieldWidth,
      limit,
    );
    expect(result).toBeCloseTo(expected);
  });
});

describe('overshoot behavior', () => {
  it('adjusts prediction relative to paddle position', () => {
    const state = createState();
    const objs = createObjs();
    state.bot = { overshoot: 1 } as any;
    (predictImpactZ as unknown as vi.Mock).mockReturnValue(2);
    objs.rightPaddle.position.z = 3;
    objs.ball.position.x = 1;
    updateAI(state, objs, 1);
    expect(state.input.aiTargetZ).toBe(1);
  });
});

describe('updateAI key events', () => {
  it('dispatches keydown/up to control paddle', () => {
    const state = createState();
    const objs = createObjs();
    setupKeyListeners(state, { up: 'w', down: 's' }, AI_KEYS);
    const kd = state.keyDownHandler!;
    const ku = state.keyUpHandler!;
    const kdSpy = vi.fn((e: KeyboardEvent) => kd(e));
    const kuSpy = vi.fn((e: KeyboardEvent) => ku(e));
    state.keyDownHandler = kdSpy;
    state.keyUpHandler = kuSpy;
    state.input.aiTargetZ = 1;
    objs.rightPaddle.position.z = 0;
    updateAI(state, objs, 0);
    expect(kdSpy).toHaveBeenCalledTimes(1);
    const kdEvt = kdSpy.mock.calls[0][0] as KeyboardEvent;
    expect(kdEvt.key).toBe(AI_KEYS.up);
    expect(kuSpy).toHaveBeenCalledWith(expect.objectContaining({ key: AI_KEYS.down }));
    expect(state.input.playerDzRight).toBe(1);

    // diff small -> should release keys
    kdSpy.mockClear();
    kuSpy.mockClear();
    objs.rightPaddle.position.z = state.input.aiTargetZ;
    updateAI(state, objs, 0);
    expect(kdSpy).not.toHaveBeenCalled();
    expect(kuSpy).toHaveBeenCalledTimes(2);
    expect(state.input.playerDzRight).toBe(0);
  });
});
