import { describe, it, expect, beforeEach, vi } from 'vitest';
import { stepPhysics, resetBall, resetScores, resetPositions } from '../physics';
import { GameMode } from '../pong';
import type { GameState } from '../pong';
import { boom } from '../scene';

const playPaddleSound = vi.fn();

vi.mock('../sound', () => ({
  playPaddleSound,
}));

vi.mock('../scene', async () => {
  const actual = await vi.importActual<any>('../scene');
  return {
    ...actual,
    boom: vi.fn(), 
  };
});

function createState(): GameState {
  return {
    physics: {
      FIELD_WIDTH: 10,
      FIELD_HEIGHT: 5,
      PADDLE_SPEED: 1,
      AI_SPEED: 0,
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
      ballDX: 0,
      ballDZ: 0,
    },
    FIXED_DT: 0,
    accumulator: 0,
    gameStarted: true,
    currentMode: GameMode.AI,
    paused: false,
    escMenuOpen: false,
    keyDownHandler: null,
    keyUpHandler: null,
    goalTimeout: null,
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
    animations: [] as any[],
  };
}

function createObjs() {
  return {
    scene: {},
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
    stepPhysics(state, objs as any, 0.016);
    expect(state.input.ballDZ).toBe(-1);
    expect(objs.ball.position.z).toBeCloseTo(state.physics.FIELD_HEIGHT - 0.5);
  });

  it('plays sound when ball hits paddle', () => {
    state.input.ballDX = -0.2;
    objs.leftPaddle.position.x = 0;
    objs.ball.position.x = 0.5;
    stepPhysics(state, objs as any, 0.016);
    expect(playPaddleSound).toHaveBeenCalled();
  });

  it('increments ai score when ball exits left', () => {
    vi.useFakeTimers();
    objs.ball.position.x = -state.physics.FIELD_WIDTH - 1;
    stepPhysics(state, objs as any, 0.016);
    expect(state.match.aiScore).toBe(1);
    expect(boom).toHaveBeenCalledTimes(1);
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
    stepPhysics(state, objs as any, 0.016);
    expect(state.match.playerScore).toBe(1);
    expect(boom).toHaveBeenCalledTimes(1);
    expect(state.paused).toBe(true);
    expect(objs.ball.position.x).toBe(state.physics.FIELD_WIDTH + 1);
    vi.runAllTimers();
    expect(objs.ball.position.x).toBe(0);
    expect(state.paused).toBe(false);
    vi.useRealTimers();
  });

  it('ends game when winning score reached', () => {
    state.match.playerScore = state.physics.WINNING_SCORE - 1;
    objs.ball.position.x = state.physics.FIELD_WIDTH + 1;
    stepPhysics(state, objs as any, 0.016);
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
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.8).mockReturnValueOnce(0.2);
    resetBall(state, objs as any);
    expect(objs.ball.position.x).toBe(0);
    expect(objs.ball.position.y).toBe(0.5);
    expect(objs.ball.position.z).toBe(0);
    expect(state.input.ballDX).toBe(state.physics.BALL_SPEED);
    expect(state.input.ballDZ).toBe(-state.physics.BALL_SPEED);
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
    resetPositions(state, objs as any);
    expect(objs.leftPaddle.position.x).toBe(-state.physics.FIELD_WIDTH + 1.5);
    expect(objs.rightPaddle.position.x).toBe(state.physics.FIELD_WIDTH - 1.5);
    expect(objs.ball.position.x).toBe(0);
  });
});
