// client/src/pong/modes.ts
import { resetScores, resetPositions } from "./physics";
import type { SceneObjects } from "./scene";
import { removeAllKeyListeners, setupKeyListeners } from "./utils";
import { AI_KEYS } from "./ai";
import type { GameState } from "./pong";
import { GameMode } from "./pong";
import { PADDLE_SPEED } from "../../../shared/constants.js";

/**
 * SINGLE vs AI
 */
import type { BotInfo } from "../pages/Profile/types/botsData";

export function startSinglePlayerAI(
  state: GameState,
  scene: SceneObjects,
  bot?: BotInfo,
) {
  removeAllKeyListeners(state);

  state.currentMode = GameMode.AI;
  resetScores(state);
  resetPositions(state, scene);
  state.gameStarted = true;
  state.paused = true;
  state.manualPaused = true;
  state.escMenuOpen = false;
  state.onPauseChange?.(true);
  state.onEscMenuChange?.(false);

  state.match.leftName = "YOU";
  state.match.rightName = bot?.name || "AI";
  state.bot = bot ?? null;

  state.physics.AI_SPEED = PADDLE_SPEED;
  state.physics.AI_REACTION = 1;
  state.physics.AI_ERROR = bot?.error ?? 0;
  // Notify React
  state.onPlayersUpdate?.(state.match.leftName, state.match.rightName);

  setupKeyListeners(
    state,
    { up: "ArrowUp", down: "ArrowDown" },
    AI_KEYS,
  );
}

/**
 * LOCAL 2P
 */
export function startLocal2P(state: GameState, scene: SceneObjects) {
  removeAllKeyListeners(state);

  state.currentMode = GameMode.Local2P;
  resetScores(state);
  resetPositions(state, scene);
  state.gameStarted = true;
  state.paused = true;
  state.manualPaused = true;
  state.escMenuOpen = false;
  state.onPauseChange?.(true);
  state.onEscMenuChange?.(false);

  state.match.leftName = "PLAYER 1";
  state.match.rightName = "PLAYER 2";
  state.onPlayersUpdate?.(state.match.leftName, state.match.rightName);

  setupKeyListeners(
    state,
    { up: ["w", "W"], down: ["s", "S"] },
    { up: "ArrowUp", down: "ArrowDown" },
  );
}

/**
 * REMOTE 2P
 */
export async function startRemote2P(
  state: GameState,
  scene: SceneObjects,
  url = "wss://localhost:3000/ws",
) {
  removeAllKeyListeners(state);

  state.currentMode = GameMode.Remote2P;
  resetScores(state);
  // Reset scores for React so the UI starts from 0:0
  state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
  resetPositions(state, scene, false);
  // Clear any stale remote game data from previous sessions
  state.remoteState = null;
  state.remoteBallDX = 0;
  state.remotePrevBallDX = 0;
  state.gameStarted = true;
  state.paused = true;
  state.manualPaused = true;
  state.escMenuOpen = false;
  state.onPauseChange?.(true);
  state.onEscMenuChange?.(false);

  state.match.leftName = "YOU";
  state.match.rightName = "OPPONENT";
  state.onPlayersUpdate?.(state.match.leftName, state.match.rightName);

  // Connection handled in remote.ts
  const { connect } = await import("./remote");
  let connectUrl = url;
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  if (id) {
    connectUrl += url.includes("?") ? `&user_id=${id}` : `?user_id=${id}`;
  }
  if (token) {
    connectUrl += connectUrl.includes("?") ? `&token=${token}` : `?token=${token}`;
  }
  state.remoteCleanup = connect(state, connectUrl, scene);
}

/**
 * TOURNAMENT match (p1Name, p2Name)
 */
export function startTournamentLocal2P(
  state: GameState,
  scene: SceneObjects,
  p1Name: string,
  p2Name: string,
  isFinal: boolean,
  onMatchEnd: (
    winnerName: string,
    loserName: string,
    winnerScore: number,
    loserScore: number,
  ) => void,
) {
  removeAllKeyListeners(state);

  state.currentMode = GameMode.Tournament;
  resetScores(state);
  // Reset scores for React
  state.onScoreUpdate?.(state.match.playerScore, state.match.aiScore);
  resetPositions(state, scene);

  state.gameStarted = true;
  state.paused = true;
  state.manualPaused = true;
  state.escMenuOpen = false;
  state.onPauseChange?.(true);
  state.onEscMenuChange?.(false);

  state.match.leftName = p1Name;
  state.match.rightName = p2Name;
  state.onPlayersUpdate?.(state.match.leftName, state.match.rightName);

  state.match.isFinalMatch = isFinal;
  state.onMatchEndCallback = onMatchEnd;

  // Controls same as local2p
  setupKeyListeners(
    state,
    { up: ["w", "W"], down: ["s", "S"] },
    { up: "ArrowUp", down: "ArrowDown" },
  );
}
