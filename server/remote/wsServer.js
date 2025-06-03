import { WebSocketServer } from 'ws';
import { updateStats } from './gameLogic.js';
import PlayerQueue from './playerQueue.js';
import { createEndMessage } from '../../shared/messages.js';
import { startGame } from './gameStarter.js';
import db from '../database/database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'kuku';

export function initWsServer() {
  const wss = new WebSocketServer({ noServer: true });
  const waiting = new PlayerQueue();

  wss.on('connection', (ws, req) => {
    const queryIdx = req.url.indexOf('?');
    if (queryIdx !== -1) {
      const params = new URLSearchParams(req.url.slice(queryIdx));
      const idParam = params.get('user_id');
      const token = params.get('token');
      if (token) {
        try {
          const payload = jwt.verify(token, JWT_SECRET);
          const idFromToken = payload.id;
          const parsedId = parseInt(idParam || '', 10);
          if (idFromToken && (!idParam || parsedId === idFromToken)) {
            ws.user_id = idFromToken;
            const row = db
              .prepare('SELECT username FROM users WHERE id = ?')
              .get(ws.user_id);
            if (row) ws.username = row.username;
          } else {
            ws.close();
            return;
          }
        } catch {
          ws.close();
          return;
        }
      } else if (idParam) {
        ws.user_id = parseInt(idParam, 10);
        try {
          const row = db
            .prepare('SELECT username FROM users WHERE id = ?')
            .get(ws.user_id);
          if (row) ws.username = row.username;
        } catch {}
      }
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
      } catch {}

      game.stop();
    });

    if (waiting.size > 0) {
      const other = waiting.dequeue();
      if (other) startGame(other, ws);
      else waiting.enqueue(ws);
    } else {
      waiting.enqueue(ws);
    }
  });

  return wss;
}
