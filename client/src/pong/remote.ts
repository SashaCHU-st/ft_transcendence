import type {
  RemoteState,
  InitMessage,
  StateMessage,
  EndMessage,
  ServerMessage,
} from "../../../shared/messages.js";
import { MessageTypes } from "../../../shared/messages.js";
import type { SceneObjects } from "./scene";
import { spawnBall } from "./physics";
import type { GameState } from "./pong";
import { removeAllKeyListeners } from "./utils";

const COUNTDOWN_INTERVAL_MS = 250;

export function connect(
  state: GameState,
  url: string,
  objs: SceneObjects,
): () => void {
  const ws = new WebSocket(url);
  state.ws = ws;
  let receivedInit = false;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;
  let cleaned = false;

  const clearCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  const sendInput = (dir: number) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'input', dir }));
    }
  };

  const handleInitMessage = (msg: InitMessage) => {
    receivedInit = true;
    clearCountdown();
    state.playerSide = msg.side;
    if (msg.leftName && msg.rightName) {
      state.match.leftName = msg.leftName;
      state.match.rightName = msg.rightName;
      state.onPlayersUpdate?.(msg.leftName, msg.rightName);
    }
    state.onRemoteWaitingChange?.(false);

    const serverTime =
      typeof msg.serverTime === 'number' ? msg.serverTime : Date.now();
    const startTime =
      typeof msg.startTime === 'number'
        ? Date.now() + (msg.startTime - serverTime)
        : Date.now();

    const tick = () => {
      const diff = startTime - Date.now();
      const remaining = Math.ceil(diff / 1000);
      if (diff > 0) {
        state.onRemoteCountdown?.(remaining);
      } else {
        clearCountdown();
        state.onRemoteCountdown?.(0);
        spawnBall(state, objs);
        state.paused = false;
        state.manualPaused = false;
        state.onPauseChange?.(false);
      }
    };

    tick();
    countdownInterval = setInterval(tick, COUNTDOWN_INTERVAL_MS);
  };

  const handleStateMessage = (msg: StateMessage) => {
    const newState = msg.state as RemoteState;
    if (state.remoteState) {
      state.remotePrevBallDX = state.remoteBallDX;
      state.remoteBallDX = newState.ballX - state.remoteState.ballX;
    } else {
      state.remotePrevBallDX = 0;
      state.remoteBallDX = 0;
    }
    state.remoteState = newState;
  };

  const handleEndMessage = (msg: EndMessage) => {
    state.remoteState = msg.state as RemoteState;
    state.gameStarted = false;
    state.paused = false;

    const winnerName =
      msg.winner === 'left' ? state.match.leftName : state.match.rightName;

    const message =
      msg.reason === 'opponent_left' ? 'Opponent left the match' : undefined;

    state.onMatchOver?.(
      state.currentMode,
      winnerName,
      msg.state.leftScore,
      msg.state.rightScore,
      message,
    );
  };

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    state.gameStarted = false;
    state.paused = false;
    state.onRemoteWaitingChange?.(false);
    state.onRemoteCountdown?.(0);
    clearCountdown();
    removeAllKeyListeners(state);
    if (
      ws.readyState !== WebSocket.CLOSED &&
      ws.readyState !== WebSocket.CLOSING
    ) {
      ws.close();
    }
  };

  ws.onopen = () => {
    state.onRemoteWaitingChange?.(true);
  };

  ws.onmessage = (ev) => {
    let msg: ServerMessage;
    try {
      msg = JSON.parse(ev.data) as ServerMessage;
    } catch {
      return;
    }
    switch (msg.type) {
      case MessageTypes.INIT:
        handleInitMessage(msg as InitMessage);
        break;
      case MessageTypes.STATE:
        handleStateMessage(msg as StateMessage);
        break;
      case MessageTypes.END:
        handleEndMessage(msg as EndMessage);
        break;
    }
  };

  ws.onclose = () => {
    if (!receivedInit) {
      state.onRemoteError?.();
    }
    cleanup();
  };

  ws.onerror = () => {
    if (!receivedInit) {
      state.onRemoteError?.();
    }
    cleanup();
    state.onMatchOver?.(
      state.currentMode,
      state.match.leftName,
      state.match.playerScore,
      state.match.aiScore,
      'Connection lost',
    );
  };

  state.keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      sendInput(1);
    } else if (e.key === 'ArrowDown') {
      sendInput(-1);
    }
  };
  state.keyUpHandler = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      sendInput(0);
    }
  };

  window.addEventListener('keydown', state.keyDownHandler);
  window.addEventListener('keyup', state.keyUpHandler);

  return cleanup;
}
