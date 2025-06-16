// client/src/pong/pong.ts
import * as BABYLON from "@babylonjs/core";
import { createScene, fitFieldToCamera, type SceneObjects } from "./scene";
import { stepPhysics, resetScores, resetPositions } from "./physics";
import type { PhysicsParams, MatchInfo, InputState, Side } from "./types";
import type { RemoteSettings } from "../../../shared/messages.js";
import { MessageTypes } from "../../../shared/messages.js";
import type { PowerUpState } from "./powerups";
import {
  activatePowerUp,
  deactivatePowerUp,
  PowerUpType,
  POWER_UPS,
  resetPowerUps,
  createDefaultPowerUpState,
} from "./powerups";
import {
  startSinglePlayerAI,
  startLocal2P,
  startTournamentLocal2P,
  startRemote2P as startRemote2PMode,
} from "./modes";
import { removeAllKeyListeners } from "./utils";
import { setSoundEnabled } from "./sound";
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  PADDLE_SPEED,
  BALL_SPEED,
  BALL_SIZE,
  WINNING_SCORE,
} from "../../../shared/constants.js";

export enum GameMode {
  AI = "ai",
  Local2P = "local2p",
  Tournament = "tournament",
  Remote2P = "remote2p",
}

export interface GameState {
  physics: PhysicsParams;
  match: MatchInfo;
  input: InputState;

  /** Selected bot configuration for AI mode */
  bot?: BotInfo | null;

  FIXED_DT: number;
  accumulator: number;

  gameStarted: boolean;
  currentMode: GameMode;
  paused: boolean;
  /** Whether the pause was initiated by the player */
  manualPaused: boolean;
  escMenuOpen: boolean;

  onScoreUpdate?: (plScore: number, aiScore: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onEscMenuChange?: (show: boolean) => void;
  onMatchOver?: (
    mode: GameMode,
    winnerName: string,
    plScore: number,
    aiScore: number,
    message?: string,
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;
  onPowerUpUpdate?: (
    left: PowerUpType | null,
    right: PowerUpType | null,
  ) => void;

  /** Remote play events */
  onRemoteWaitingChange?: (status: 'waiting' | 'preparing' | null) => void;
  onRemoteCountdown?: (seconds: number) => void;
  onRemoteError?: () => void;
  onRemoteSettings?: (settings: RemoteSettings) => void;

  onMatchEndCallback?: (
    winner: string,
    loser: string,
    winnerScore: number,
    loserScore: number,
  ) => void;

  keyDownHandler: ((e: KeyboardEvent) => void) | null;
  keyUpHandler: ((e: KeyboardEvent) => void) | null;

  goalTimeout: ReturnType<typeof setTimeout> | null;
  /** Delay timer for ball movement after spawn */
  ballSpawnTimeout: ReturnType<typeof setTimeout> | null;

  /** Remote play fields */
  ws?: WebSocket;
  playerSide?: Side;
  remoteState?: {
    ballX: number;
    ballZ: number;
    leftPaddleZ: number;
    rightPaddleZ: number;
    leftScore: number;
    rightScore: number;
    activeLeft?: string | null;
    activeRight?: string | null;
  } | null;
  remoteBallDX?: number;
  remotePrevBallDX?: number;
  remoteCleanup?: () => void;

  /** Active and available power-ups */
  powerUps: PowerUpState;

  /** Current modifiers from active power-ups */
  powerUpEffects: {
    speed: Record<Side, number>;
    scale: Record<Side, number>;
    powerShot: Record<Side, boolean>;
  };

  /** Whether power-ups can be used */
  powerUpsEnabled: boolean;
}

import type { BotInfo } from "../pages/Profile/types/botsData";

export interface GameAPI {
  startSinglePlayerAI: (bot?: BotInfo) => void;
  startLocal2P: () => void;
  startRemote2P: (url?: string, onHost?: () => void) => void;
  startTournamentMatch: (
    p1Name: string,
    p2Name: string,
    isFinal: boolean,
    onMatchEnd: (
      winner: string,
      loser: string,
      winnerScore: number,
      loserScore: number,
    ) => void,
  ) => void;
  backToMenu: () => void;

  restartCurrentMatch?: () => void;
  unpause?: () => void;
  usePowerUp?: (
    side: Side,
    pu: { type: PowerUpType; duration?: number },
  ) => void;
  setPowerUpsEnabled?: (v: boolean) => void;
  setBallSpeed?: (v: number) => void;
  setBallSize?: (v: number) => void;
  setWinningScore?: (v: number) => void;
  setPaddleColor?: (side: Side, color: string) => void;
  setSoundEnabled?: (v: boolean) => void;
  dispose: () => void;
}

export interface PongCallbacks {
  onScoreUpdate?: (plScore: number, aiScore: number) => void;
  onPauseChange?: (paused: boolean) => void;
  onEscMenuChange?: (show: boolean) => void;
  onMatchOver?: (
    mode: GameMode,
    winnerName: string,
    plScore: number,
    aiScore: number,
    message?: string,
  ) => void;
  onPlayersUpdate?: (leftName: string, rightName: string) => void;
  onPowerUpUpdate?: (
    left: PowerUpType | null,
    right: PowerUpType | null,
  ) => void;
  onRemoteWaitingChange?: (status: 'waiting' | 'preparing' | null) => void;
  onRemoteCountdown?: (seconds: number) => void;
  onRemoteError?: () => void;
  onRemoteSettings?: (settings: RemoteSettings) => void;
}

export function initGame(
  canvas: HTMLCanvasElement,
  callbacks?: PongCallbacks,
  powerUpsEnabled = true,
): GameAPI {
  const engine = new BABYLON.Engine(canvas, true);

  const state: GameState = {
    physics: {
      FIELD_WIDTH,
      FIELD_HEIGHT,
      PADDLE_SPEED,
      AI_SPEED: PADDLE_SPEED,
      AI_REACTION: 1,
      AI_ERROR: 0,
      BALL_SPEED,
      BALL_SIZE,
      WINNING_SCORE,
    },
    match: {
      playerScore: 0,
      aiScore: 0,
      leftName: "PLAYER",
      rightName: "AI",
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
      ballBaseSpeed: BALL_SPEED,
      ballPowered: false,
      dramaPhase: 0,
    },

    FIXED_DT: 1 / 60,
    accumulator: 0,

    gameStarted: false,
    currentMode: GameMode.AI,
    paused: false,
    manualPaused: false,
    escMenuOpen: false,

    onScoreUpdate: callbacks?.onScoreUpdate,
    onPauseChange: callbacks?.onPauseChange,
    onEscMenuChange: callbacks?.onEscMenuChange,
    onMatchOver: callbacks?.onMatchOver,
    onPlayersUpdate: callbacks?.onPlayersUpdate,
    onPowerUpUpdate: callbacks?.onPowerUpUpdate,
    onRemoteWaitingChange: callbacks?.onRemoteWaitingChange,
    onRemoteCountdown: callbacks?.onRemoteCountdown,
    onRemoteError: callbacks?.onRemoteError,
    onRemoteSettings: callbacks?.onRemoteSettings,

    onMatchEndCallback: undefined,

    keyDownHandler: null,
    keyUpHandler: null,
    goalTimeout: null,
    ballSpawnTimeout: null,

    ws: undefined,
    playerSide: undefined,
    remoteState: null,
    remoteBallDX: 0,
    remotePrevBallDX: 0,
    remoteCleanup: undefined,
    bot: null,
    ...createDefaultPowerUpState(),
    powerUpsEnabled,
  };

  const sceneObjects: SceneObjects = createScene(engine, canvas, state.physics);

  state.input.ballBaseSpeed = state.physics.BALL_SPEED;
  state.input.ballDX = state.input.ballBaseSpeed;
  state.input.ballDZ = state.input.ballBaseSpeed;

  engine.runRenderLoop(() => {
    const dt = engine.getDeltaTime() / 1000;
    state.accumulator += dt;
    while (state.accumulator >= state.FIXED_DT) {
      stepPhysics(state, sceneObjects, state.FIXED_DT);
      state.accumulator -= state.FIXED_DT;
    }
    engine.scenes[0]?.render();
  });

  const resizeHandler = () => {
    engine.resize();
    fitFieldToCamera(
      sceneObjects.camera,
      state.physics.FIELD_WIDTH,
      state.physics.FIELD_HEIGHT,
    );
  };
  window.addEventListener("resize", resizeHandler);

  // ESC / Space
  const keydownHandler = (e: KeyboardEvent) => {
    if (!state.gameStarted) return;
    if (e.key === "Escape") {
      if (state.currentMode === GameMode.Remote2P) {
        state.escMenuOpen = !state.escMenuOpen;
        state.onEscMenuChange?.(state.escMenuOpen);
        return;
      }
      if (!state.escMenuOpen) {
        state.escMenuOpen = true;
        state.paused = true;
        state.manualPaused = true;
        state.onPauseChange?.(true);
        state.onEscMenuChange?.(true);
      } else {
        if (state.goalTimeout) return; // keep paused until goal reset
        state.escMenuOpen = false;
        state.paused = false;
        state.manualPaused = false;
        state.onPauseChange?.(false);
        state.onEscMenuChange?.(false);
      }
      return;
    }
    if (e.code === "Space") {
      if (state.currentMode === GameMode.Remote2P) return;
      if (state.escMenuOpen) return;
      if (state.goalTimeout) {
        state.manualPaused = true;
        return;
      }
      state.paused = !state.paused;
      state.manualPaused = state.paused;
      state.onPauseChange?.(state.paused);
    }
  };
  window.addEventListener("keydown", keydownHandler);

  const api: GameAPI = {
    startSinglePlayerAI: (bot?: BotInfo) => {
      startSinglePlayerAI(state, sceneObjects, bot);
      state.manualPaused = true;
    },
    startLocal2P: () => {
      startLocal2P(state, sceneObjects);
      state.manualPaused = true;
    },
    startRemote2P: (url, onHost) => {
      void startRemote2PMode(state, sceneObjects, url, onHost);
      state.manualPaused = true;
    },
    startTournamentMatch: (p1, p2, isF, cb) => {
      startTournamentLocal2P(state, sceneObjects, p1, p2, isF, cb);
      state.manualPaused = true;
    },
    backToMenu: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      resetPositions(state, sceneObjects);
      if (state.remoteCleanup) {
        state.remoteCleanup();
        state.remoteCleanup = undefined;
        } else if (state.ws) {
          try {
            state.ws.close();
          } catch {
            /* ignore close errors */
          }
        state.ws = undefined;
      }
      state.gameStarted = false;
      state.paused = false;
      state.manualPaused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);
    },
    restartCurrentMatch: () => {
      removeAllKeyListeners(state);
      resetScores(state);
      state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
      resetPositions(state, sceneObjects);

      state.gameStarted = true;
      state.paused = true;
      state.manualPaused = true;
      state.escMenuOpen = false;
      state.onPauseChange?.(true);
      state.onEscMenuChange?.(false);

      if (state.currentMode === GameMode.Remote2P && state.remoteCleanup) {
        state.remoteCleanup();
        state.remoteCleanup = undefined;
      }

      if (state.currentMode === GameMode.AI) {
        startSinglePlayerAI(state, sceneObjects, state.bot ?? undefined);
      } else if (state.currentMode === GameMode.Local2P) {
        startLocal2P(state, sceneObjects);
      } else if (state.currentMode === GameMode.Remote2P) {
        void startRemote2PMode(state, sceneObjects);
      }
    },
    usePowerUp: (side, pu) => {
      if (state.powerUpsEnabled) {
        const duration = pu.duration ?? POWER_UPS[pu.type].defaultDuration;
        if (state.currentMode === GameMode.Remote2P && state.ws) {
          try {
            if (state.ws.readyState === WebSocket.OPEN) {
              state.ws.send(
                JSON.stringify({
                  type: MessageTypes.POWER,
                  power: pu.type,
                  duration,
                }),
              );
            }
          } catch {}
        } else {
          activatePowerUp(state, side, { type: pu.type, duration });
        }
      }
    },
    setPowerUpsEnabled: (v: boolean) => {
      state.powerUpsEnabled = v;
      if (!v) {
        resetPowerUps(state);
      }
    },
    setBallSpeed: (v: number) => {
      state.physics.BALL_SPEED = v;
      state.input.ballBaseSpeed = v;
      if (state.ballSpawnTimeout) {
        clearTimeout(state.ballSpawnTimeout);
        const dx = v * (Math.random() > 0.5 ? 1 : -1);
        const dz = v * (Math.random() > 0.5 ? 1 : -1);
        state.ballSpawnTimeout = setTimeout(() => {
          state.input.ballDX = dx;
          state.input.ballDZ = dz;
          state.ballSpawnTimeout = null;
        }, 1000);
      } else {
        if (state.input.ballDX !== 0)
          state.input.ballDX = Math.sign(state.input.ballDX) * v;
        if (state.input.ballDZ !== 0)
          state.input.ballDZ = Math.sign(state.input.ballDZ) * v;
      }
    },
    setBallSize: (v: number) => {
      sceneObjects.ball.scaling.set(v, v, v);
      state.physics.BALL_SIZE = v;
    },
    setWinningScore: (v: number) => {
      state.physics.WINNING_SCORE = v;
    },
    setPaddleColor: (side: Side, color: string) => {
      const mat =
        side === 'left'
          ? (sceneObjects.leftPaddle.material as BABYLON.StandardMaterial)
          : (sceneObjects.rightPaddle.material as BABYLON.StandardMaterial);
      mat.emissiveColor = BABYLON.Color3.FromHexString(color);
    },
    setSoundEnabled: (v: boolean) => {
      setSoundEnabled(v);
    },
    unpause: () => {
      if (state.goalTimeout) return;
      state.paused = false;
      state.manualPaused = false;
      state.escMenuOpen = false;
      state.onPauseChange?.(false);
      state.onEscMenuChange?.(false);
    },
    dispose: () => {
      engine.stopRenderLoop();
      engine.dispose();
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keydownHandler);
      removeAllKeyListeners(state);
      if (state.remoteCleanup) {
        state.remoteCleanup();
        state.remoteCleanup = undefined;
      }
    },
  };

  // Expose internal state for tests
  (api as GameAPI & { __state: GameState }).__state = state;

  return api;
}
