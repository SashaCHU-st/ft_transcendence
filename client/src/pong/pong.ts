// client/src/pong/pong.ts
import * as BABYLON from "@babylonjs/core";
import { createScene, fitFieldToCamera, type SceneObjects } from "./scene";
import { stepPhysics, resetScores, resetPositions } from "./physics";
import type { PhysicsParams, MatchInfo, InputState } from "./types";
import {
  startSinglePlayerAI,
  startLocal2P,
  startTournamentLocal2P,
  startRemote2P as startRemote2PMode,
} from "./modes";
import { removeAllKeyListeners } from "./utils";
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  PADDLE_SPEED,
  BALL_SPEED,
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

  /** Remote play events */
  onRemoteWaitingChange?: (waiting: boolean) => void;
  onRemoteCountdown?: (seconds: number) => void;

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
  playerSide?: "left" | "right";
  remoteState?: {
    ballX: number;
    ballZ: number;
    leftPaddleZ: number;
    rightPaddleZ: number;
    leftScore: number;
    rightScore: number;
  } | null;
  remoteBallDX?: number;
  remotePrevBallDX?: number;
  remoteCleanup?: () => void;
}

export interface GameAPI {
  startSinglePlayerAI: () => void;
  startLocal2P: () => void;
  startRemote2P: (url?: string) => void;
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
  onRemoteWaitingChange?: (waiting: boolean) => void;
  onRemoteCountdown?: (seconds: number) => void;
}

export function initGame(
  canvas: HTMLCanvasElement,
  callbacks?: PongCallbacks,
): GameAPI {
  const engine = new BABYLON.Engine(canvas, true);

  const state: GameState = {
    physics: {
      FIELD_WIDTH,
      FIELD_HEIGHT,
      PADDLE_SPEED,
      AI_SPEED: 0.3,
      BALL_SPEED,
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
      ballDX: 0,
      ballDZ: 0,
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
    onRemoteWaitingChange: callbacks?.onRemoteWaitingChange,
    onRemoteCountdown: callbacks?.onRemoteCountdown,

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
  };

  const sceneObjects: SceneObjects = createScene(engine, canvas, state.physics);

  state.input.ballDX = state.physics.BALL_SPEED;
  state.input.ballDZ = state.physics.BALL_SPEED;

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
    startSinglePlayerAI: () => {
      startSinglePlayerAI(state, sceneObjects);
      state.manualPaused = true;
    },
    startLocal2P: () => {
      startLocal2P(state, sceneObjects);
      state.manualPaused = true;
    },
    startRemote2P: (url) => {
      void startRemote2PMode(state, sceneObjects, url);
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
        } catch {}
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
        startSinglePlayerAI(state, sceneObjects);
      } else if (state.currentMode === GameMode.Local2P) {
        startLocal2P(state, sceneObjects);
      } else if (state.currentMode === GameMode.Remote2P) {
        void startRemote2PMode(state, sceneObjects);
      }
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
  (api as any).__state = state;

  return api;
}
