import { Game } from './gameLogic.js';
import { createInitMessage } from '../../shared/messages.js';

/**
 * Create a new `Game` instance and send initial messages to both players.
 * This helper keeps the setup logic separate from the WebSocket server code.
 * @param {import('ws').WebSocket} ws1 Left player socket
 * @param {import('ws').WebSocket} ws2 Right player socket
 * @returns {Game}
 */
export function startGame(ws1, ws2, settings) {
  const game = new Game(ws1, ws2, settings);
  ws1.side = 'left';
  ws2.side = 'right';
  ws1.game = game;
  ws2.game = game;

  const leftName = ws1.username || `Player-${ws1.user_id ?? 1}`;
  const rightName = ws2.username || `Player-${ws2.user_id ?? 2}`;
  const serverTime = Date.now();
  const startTime = serverTime + 5000;

  const initLeft = JSON.stringify(
    createInitMessage(
      'left',
      leftName,
      rightName,
      startTime,
      serverTime,
      settings,
    ),
  );
  const initRight = JSON.stringify(
    createInitMessage(
      'right',
      leftName,
      rightName,
      startTime,
      serverTime,
      settings,
    ),
  );

  ws1.send(initLeft);
  ws2.send(initRight);
  game.start(startTime);

  return game;
}

