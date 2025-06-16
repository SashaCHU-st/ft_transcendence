import { WebSocketServer } from 'ws';
import { updateStats } from './gameLogic.js';
import { POWER_UPS } from '../../shared/powerups.js';
import PlayerQueue from './playerQueue.js';
import { createEndMessage, MessageTypes } from '../../shared/messages.js';
import { startGame } from './gameStarter.js';
import { broadcastSystemMessage } from '../chatWsServer.js';
import { randomUUID } from 'crypto';
import { SYSTEM_MESSAGE_TTL_MS } from '../../shared/chatConstants.js';
import wsAuth from '../utils/wsAuth.js';
import { URLSearchParams } from 'node:url';
import { setInterval, clearInterval } from 'node:timers';

// Track active WebSocket connections by user id so that a single user
// cannot start multiple remote games at once.
const activeUsers = new Map();

export function initWsServer() {
  const wss = new WebSocketServer({ noServer: true });
  const waiting = new PlayerQueue();
  const refreshInterval = SYSTEM_MESSAGE_TTL_MS - 1000;

  function tryPairing(hostWs) {
    if (!hostWs.ready) return false;
    for (let i = 0; i < waiting.queue.length; i++) {
      const cand = waiting.queue[i].ws;
      if (cand === hostWs) continue;
      if (cand.user_id === hostWs.user_id) continue;
      waiting.queue.splice(i, 1);
      waiting.remove(hostWs);
      if (hostWs.waitingMessage) {
        broadcastSystemMessage(hostWs.waitingMessage, { remove: true });
        hostWs.waitingMessage = null;
        if (hostWs.waitingRefresh) clearInterval(hostWs.waitingRefresh);
        hostWs.waitingRefresh = null;
      }
      if (cand.waitingMessage) {
        broadcastSystemMessage(cand.waitingMessage, { remove: true });
        cand.waitingMessage = null;
        if (cand.waitingRefresh) clearInterval(cand.waitingRefresh);
        cand.waitingRefresh = null;
      }
      startGame(hostWs, cand, hostWs.settings);
      return true;
    }
    return false;
  }

  wss.on('connection', (ws, req) => {
    ws.id = randomUUID();
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

    if (ws.user_id !== undefined) {
      const existing = activeUsers.get(ws.user_id);
      if (existing) {
        if (existing.game && !existing.game.ended) {
          // Refuse new connection while an active game exists
          ws.close();
          return;
        }
        try {
          existing.close();
        } catch {}
        activeUsers.delete(ws.user_id);
      }
      activeUsers.set(ws.user_id, ws);
    }
    ws.on('message', (data) => {
      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }
      if (msg.type === 'settings' && typeof msg.settings === 'object') {
        ws.settings = msg.settings;
        ws.ready = true;
        tryPairing(ws);
        return;
      }
      const game = ws.game;
      if (!game) return;
      if (msg.type === 'input') {
        if (typeof msg.dir !== 'number' || ![-1, 0, 1].includes(msg.dir)) return;
        game.handleInput(ws.side, msg.dir);
      } else if (msg.type === MessageTypes.POWER) {
        if (typeof msg.power !== 'string') return;
        const dur =
          typeof msg.duration === 'number'
            ? msg.duration
            : undefined;
        game.activatePowerUp(ws.side, msg.power, dur ?? POWER_UPS[msg.power]?.defaultDuration);
      }
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

      if (ws.user_id !== undefined && activeUsers.get(ws.user_id) === ws) {
        activeUsers.delete(ws.user_id);
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

    const readyHostIndex = waiting.queue.findIndex(
      (p) => p.ws.ready && p.ws.user_id !== ws.user_id,
    );
    if (readyHostIndex !== -1) {
      const host = waiting.queue.splice(readyHostIndex, 1)[0].ws;
      if (host.waitingMessage) {
        broadcastSystemMessage(host.waitingMessage, { remove: true });
        host.waitingMessage = null;
        if (host.waitingRefresh) clearInterval(host.waitingRefresh);
        host.waitingRefresh = null;
      }
      startGame(host, ws, host.settings);
    } else {
      ws.ready = waiting.size > 0; // non-host players are ready
      waiting.enqueue(ws);
      const name = ws.username || `Player-${ws.user_id ?? ws.id}`;
      ws.waitingMessage = {
        id: randomUUID(),
        type: 'waiting',
        text: `${name} is waiting for an opponent`,
        userId: ws.user_id,
      };
      broadcastSystemMessage(ws.waitingMessage, { excludeUsers: ws.user_id !== undefined ? [ws.user_id] : [] });
      ws.waitingRefresh = setInterval(() => {
        if (ws.waitingMessage) {
          broadcastSystemMessage(ws.waitingMessage, { excludeUsers: ws.user_id !== undefined ? [ws.user_id] : [] });
        } else if (ws.waitingRefresh) {
          clearInterval(ws.waitingRefresh);
        }
      }, refreshInterval);
      const hostWaiting = waiting.queue.find(
        (p) => p.ws !== ws && !p.ws.ready,
      );
      if (hostWaiting) {
        try {
          ws.send(JSON.stringify({ type: MessageTypes.WAIT }));
        } catch {}
      }
    }
  });

  return wss;
}
