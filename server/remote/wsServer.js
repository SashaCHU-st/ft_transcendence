import { WebSocketServer } from 'ws';
import { updateStats } from './gameLogic.js';
import PlayerQueue from './playerQueue.js';
import { createEndMessage } from '../../shared/messages.js';
import { startGame } from './gameStarter.js';
import { broadcastSystemMessage } from '../chatWsServer.js';
import { randomUUID } from 'crypto';
import { SYSTEM_MESSAGE_TTL_MS } from '../../shared/chatConstants.js';
import wsAuth from '../utils/wsAuth.js';
import { URLSearchParams } from 'node:url';
import { setInterval, clearInterval } from 'node:timers';

export function initWsServer() {
  const wss = new WebSocketServer({ noServer: true });
  const waiting = new PlayerQueue();
  const refreshInterval = SYSTEM_MESSAGE_TTL_MS - 1000;

  wss.on('connection', (ws, req) => {
    let token;
    const queryIdx = req.url.indexOf('?');
    if (queryIdx !== -1) {
      const params = new URLSearchParams(req.url.slice(queryIdx));
      token = params.get('token');
    }

    const info = wsAuth(req);
    if (token && !info) {
      ws.close();
      return;
    }
    if (info) {
      ws.user_id = info.userId;
      if (info.username) ws.username = info.username;
    }
    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }
      const game = ws.game;
      if (!game || msg.type !== 'input') return;
      if (typeof msg.dir !== 'number' || ![-1, 0, 1].includes(msg.dir)) return;
      game.handleInput(ws.side, msg.dir);
    });

    ws.on('close', () => {
      // Remove from waiting queue if still waiting
      waiting.remove(ws);
      if (ws.waitingMessage) {
        broadcastSystemMessage(ws.waitingMessage, { remove: true });
        ws.waitingMessage = null;
        if (ws.waitingRefresh) clearInterval(ws.waitingRefresh);
        ws.waitingRefresh = null;
      }

      const game = ws.game;
      if (!game || game.ended) return;

      game.ended = true;
      const leaverIndex = game.players.indexOf(ws);
      const winnerIndex = leaverIndex === 0 ? 1 : 0;
      const winnerSide = leaverIndex === 0 ? 'right' : 'left';
      const winnerWs = game.players[winnerIndex];

      const state = {
        leftPaddleZ: game.leftZ,
        rightPaddleZ: game.rightZ,
        ballX: game.ballX,
        ballZ: game.ballZ,
        leftScore: game.leftScore,
        rightScore: game.rightScore,
      };

      const winnerId = winnerWs.user_id ?? winnerWs.id;
      const loserId = ws.user_id ?? ws.id;
      updateStats(winnerId, loserId);

        try {
          winnerWs.send(
            JSON.stringify(createEndMessage(winnerSide, state, 'opponent_left')),
          );
          winnerWs.close();
        } catch {
          // Ignore errors if the winner disconnects early
        }

      game.stop();
    });

    if (waiting.size > 0) {
      const other = waiting.dequeue();
      if (other) {
        if (other.waitingMessage) {
          broadcastSystemMessage(other.waitingMessage, { remove: true });
          other.waitingMessage = null;
          if (other.waitingRefresh) clearInterval(other.waitingRefresh);
          other.waitingRefresh = null;
        }
        startGame(other, ws);
      } else {
        waiting.enqueue(ws);
        const name = ws.username || `Player-${ws.user_id ?? ws.id}`;
        ws.waitingMessage = {
          id: randomUUID(),
          type: 'waiting',
          text: `${name} is waiting for an opponent`,
        };
        broadcastSystemMessage(ws.waitingMessage);
        ws.waitingRefresh = setInterval(() => {
          if (ws.waitingMessage) {
            broadcastSystemMessage(ws.waitingMessage);
          } else if (ws.waitingRefresh) {
            clearInterval(ws.waitingRefresh);
          }
        }, refreshInterval);
      }
    } else {
      waiting.enqueue(ws);
      const name = ws.username || `Player-${ws.user_id ?? ws.id}`;
      ws.waitingMessage = {
        id: randomUUID(),
        type: 'waiting',
        text: `${name} is waiting for an opponent`,
      };
      broadcastSystemMessage(ws.waitingMessage);
      ws.waitingRefresh = setInterval(() => {
        if (ws.waitingMessage) {
          broadcastSystemMessage(ws.waitingMessage);
        } else if (ws.waitingRefresh) {
          clearInterval(ws.waitingRefresh);
        }
      }, refreshInterval);
    }
  });

  return wss;
}
