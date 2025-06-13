import { describe, it, expect, beforeEach, vi } from 'vitest';
// Define mocks before importing tested modules
vi.mock('../sound', () => ({
  playPaddleSound: vi.fn(),
}));


vi.mock('../scene', () => ({
  boom: vi.fn(),
  bigBoom: vi.fn(),
}));

vi.mock('../physics', async () => {
  const actual: any = await vi.importActual('../physics');
  return {
    ...actual,
    predictImpactZ: vi.fn(actual.predictImpactZ),
  };
});
import * as physics from '../physics';
const { stepPhysics, resetBall, resetScores, resetPositions, predictImpactZ } = physics;
import { GameMode } from '../pong';
import type { GameState } from '../pong';
import type { SceneObjects } from '../scene';
import { bigBoom } from '../scene';
import { playPaddleSound } from '../sound';
import type { Animation } from '@babylonjs/core';
import { setupKeyListeners } from '../utils';
import { AI_KEYS } from '../ai';


function createState(): GameState {
  return {
    physics: {
      FIELD_WIDTH: 10,
      FIELD_HEIGHT: 5,
      PADDLE_SPEED: 1,
      AI_SPEED: 0,
      AI_REACTION: 1,
      AI_ERROR: 0,
      BALL_SPEED: 1,
      WINNING_SCORE: 3,
    },
    match: {
      playerScore: 0,
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
      ballDX: 0,
      ballDZ: 0,
      dramaPhase: 0,
    },
    FIXED_DT: 0,
    accumulator: 0,
    gameStarted: true,
    currentMode: GameMode.AI,
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
    scaling: {
      x: 1,
      y: 1,
      z: 1,
      clone() {
        return { x: this.x, y: this.y, z: this.z };
      },
    },
    animations: [] as Animation[],
  };
}

function createObjs(): SceneObjects {
  return {
    scene: { beginAnimation: vi.fn() },
    leftPaddle: mesh(),
    rightPaddle: mesh(),
    ball: mesh(),
  };
}

describe('stepPhysics', () => {
  let state: GameState;
  let objs: ReturnType<typeof createObjs>;

  beforeEach(() => {
    state = createState();
    objs = createObjs();
    vi.clearAllMocks();
  });

  it('bounces ball off vertical bounds', () => {
    state.input.ballDZ = 1;
    objs.ball.position.z = state.physics.FIELD_HEIGHT - 0.5;
      stepPhysics(state, objs, 0.016);
    expect(state.input.ballDZ).toBe(-1);
    expect(objs.ball.position.z).toBeCloseTo(state.physics.FIELD_HEIGHT - 0.5);
  });

  it('plays sound when ball hits paddle', () => {
    state.input.ballDX = -0.2;
    objs.leftPaddle.position.x = 0;
    objs.ball.position.x = 0.5;
      stepPhysics(state, objs, 0.016);
    expect(playPaddleSound).toHaveBeenCalled();
  });

  it('plays sound when remote ball bounces', () => {
    state.currentMode = GameMode.Remote2P;
    state.remotePrevBallDX = -0.2;
    state.remoteBallDX = 0.2;
    state.remoteState = {
      ballX: -state.physics.FIELD_WIDTH + 1.5,
      ballZ: 0,
      leftPaddleZ: 0,
      rightPaddleZ: 0,
      leftScore: 0,
      rightScore: 0,
    };
      stepPhysics(state, objs, 0.016);
    expect(playPaddleSound).toHaveBeenCalled();
  });

  it('increments ai score when ball exits left', () => {
    vi.useFakeTimers();
    objs.ball.position.x = -state.physics.FIELD_WIDTH - 1;
      stepPhysics(state, objs, 0.016);
    expect(state.match.aiScore).toBe(1);
    expect(bigBoom).toHaveBeenCalledTimes(1);
    expect(state.paused).toBe(true);
    expect(objs.ball.position.x).toBe(-state.physics.FIELD_WIDTH - 1);
    vi.runAllTimers();
    expect(objs.ball.position.x).toBe(0);
    expect(state.paused).toBe(false);
    vi.useRealTimers();
  });

  it('increments player score when ball exits right', () => {
    vi.useFakeTimers();
    objs.ball.position.x = state.physics.FIELD_WIDTH + 1;
      stepPhysics(state, objs, 0.016);
    expect(state.match.playerScore).toBe(1);
    expect(bigBoom).toHaveBeenCalledTimes(1);
    expect(state.paused).toBe(true);
    expect(objs.ball.position.x).toBe(state.physics.FIELD_WIDTH + 1);
    vi.runAllTimers();
    expect(objs.ball.position.x).toBe(0);
    expect(state.paused).toBe(false);
    vi.useRealTimers();
  });

  it('updates ai target once per second and dispatches movement keys', () => {
    state.physics.AI_SPEED = 0.5;
    const original = physics.predictImpactZ;
    const spy = vi.fn().mockReturnValue(2);
    physics.__setPredictImpactZ(spy);
    setupKeyListeners(state, { up: 'w', down: 's' }, AI_KEYS);
    const kd = state.keyDownHandler!;
    const kdSpy = vi.fn((e: KeyboardEvent) => kd(e));
    state.keyDownHandler = kdSpy;

    // First half second - no call
    stepPhysics(state, objs, 0.5);
    expect(spy).not.toHaveBeenCalled();
    expect(state.input.aiTimer).toBeCloseTo(0.5);

    // Second half second triggers prediction
    stepPhysics(state, objs, 0.5);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(state.input.aiTimer).toBe(0);
    expect(kdSpy).toHaveBeenCalledWith(expect.objectContaining({ key: AI_KEYS.up }));
    expect(state.input.playerDzRight).toBe(state.physics.PADDLE_SPEED);

    // Next frame accumulates timer again without new prediction
    kdSpy.mockClear();
    stepPhysics(state, objs, 0.5);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(kdSpy).toHaveBeenCalledTimes(1);
    expect(state.input.aiTimer).toBeCloseTo(0.5);
    physics.__setPredictImpactZ(original);
  });

  it('Steady Chef recenters after hitting the ball', () => {
    state.bot = { name: 'Steady Chef' } as any;
    objs.rightPaddle.position.z = 2;
    objs.rightPaddle.position.x = state.physics.FIELD_WIDTH - 1.5;
    objs.ball.position.x = objs.rightPaddle.position.x - 0.5;
    objs.ball.position.z = 2;
    state.input.ballDX = 0.2;
    stepPhysics(state, objs, 0.016);
    expect(state.input.aiTargetZ).toBe(0);
  });

  it('applies drama oscillation with amplitude 1', () => {
    const original = physics.predictImpactZ;
    const spy = vi.fn().mockReturnValue(1);
    physics.__setPredictImpactZ(spy);
    state.bot = { name: 'Drama Bot' } as any;
    state.physics.AI_ERROR = 0;
    state.input.dramaPhase = 0.25;
    stepPhysics(state, objs, 1);
    const expected = 1 + Math.sin(state.input.dramaPhase * 8) * 1;
    expect(state.input.aiTargetZ).toBeCloseTo(expected);
    physics.__setPredictImpactZ(original);
  });

  it('ends game when winning score reached', () => {
    state.match.playerScore = state.physics.WINNING_SCORE - 1;
    objs.ball.position.x = state.physics.FIELD_WIDTH + 1;
      stepPhysics(state, objs, 0.016);
    expect(state.gameStarted).toBe(false);
    expect(state.match.playerScore).toBe(state.physics.WINNING_SCORE);
  });
});

describe('reset helpers', () => {
  let state: GameState;
  let objs: ReturnType<typeof createObjs>;

  beforeEach(() => {
    state = createState();
    objs = createObjs();
    vi.clearAllMocks();
  });

  it('resetBall centers ball and randomizes direction', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);
      resetBall(state, objs);
    expect(objs.ball.position.x).toBe(0);
    expect(objs.ball.position.y).toBe(0.5);
    expect(objs.ball.position.z).toBe(0);
    expect(state.input.ballDX).toBe(0);
    expect(state.input.ballDZ).toBe(0);
    vi.runAllTimers();
    expect(state.input.ballDX).toBe(state.physics.BALL_SPEED);
    expect(state.input.ballDZ).toBe(-state.physics.BALL_SPEED);
    vi.useRealTimers();
  });

  it('resetBall clears aiTimer', () => {
    vi.useFakeTimers();
    state.input.aiTimer = 1;
    resetBall(state, objs);
    expect(state.input.aiTimer).toBe(0);
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('resetBall resets aiTargetZ to 0', () => {
    vi.useFakeTimers();
    state.bot = { name: 'Drama Bot' } as any;
    state.input.aiTargetZ = 5;
    resetBall(state, objs);
    expect(state.input.aiTargetZ).toBe(0);
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('resetScores zeros both scores', () => {
    state.match.playerScore = 2;
    state.match.aiScore = 1;
    resetScores(state);
    expect(state.match.playerScore).toBe(0);
    expect(state.match.aiScore).toBe(0);
  });

  it('resetPositions moves paddles to start and resets ball', () => {
    objs.leftPaddle.position.x = 5;
    objs.rightPaddle.position.x = 5;
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
      resetPositions(state, objs);
    expect(objs.leftPaddle.position.x).toBe(-state.physics.FIELD_WIDTH + 1.5);
    expect(objs.rightPaddle.position.x).toBe(state.physics.FIELD_WIDTH - 1.5);
    expect(objs.ball.position.x).toBe(0);
  });
});

describe('predictImpactZ', () => {
  it('returns z0 when vx is zero', () => {
    const z = predictImpactZ(0, 2, 0, 1, 5, 4.5);
    expect(z).toBe(2);
  });

  it('returns z0 when ball has no vertical speed', () => {
    const z = predictImpactZ(0, 3, 1, 0, 5, 4.5);
    expect(z).toBe(3);
  });

  it('does not return NaN when ball is stationary', () => {
    const z = predictImpactZ(1, 1, 0, 0, 5, 4.5);
    expect(z).toBe(1);
  });
});
