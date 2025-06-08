import db from '../database/database.js';
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  PADDLE_SPEED,
  BALL_SPEED,
  WINNING_SCORE,
} from '../../shared/constants.js';
import { createStateMessage, createEndMessage } from '../../shared/messages.js';
import {
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
} from 'node:timers';

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function hitPaddle(ballX, ballZ, paddleX, paddleZ) {
  return Math.abs(ballZ - paddleZ) < 2.5 && Math.abs(ballX - paddleX) < 1.0;
}

export function updateStats(winnerId, loserId) {
  if (winnerId) {
    const row = db.prepare('SELECT wins FROM users WHERE id = ?').get(winnerId);
    if (row) {
      db.prepare('UPDATE users SET wins = ? WHERE id = ?').run(row.wins + 1, winnerId);
    }
  }

  if (loserId) {
    const row = db.prepare('SELECT losses FROM users WHERE id = ?').get(loserId);
    if (row) {
      db.prepare('UPDATE users SET losses = ? WHERE id = ?').run(row.losses + 1, loserId);
    }
  }
}

export class Game {
  constructor(ws1, ws2) {
    this.players = [ws1, ws2];
    this.leftInput = 0;
    this.rightInput = 0;
    this.leftZ = 0;
    this.rightZ = 0;
    this.ballX = 0;
    this.ballZ = 0;
    this.ballDX = BALL_SPEED;
    this.ballDZ = BALL_SPEED;
    this.leftScore = 0;
    this.rightScore = 0;
    this.interval = null;
    this.startTimeout = null;
    this.ballSpawnTimeout = null;
    this.ended = false;
  }

  /**
   * Stop all running timers associated with the game instance.
   */
  stop() {
    clearInterval(this.interval);
    if (this.startTimeout) clearTimeout(this.startTimeout);
    if (this.ballSpawnTimeout) clearTimeout(this.ballSpawnTimeout);
  }

  start(startTime) {
    this.startTimeout = setTimeout(() => {
      this.resetBall();
      this.interval = setInterval(() => this.tick(), 1000 / 60);
    }, startTime - Date.now());
  }

  handleInput(side, dir) {
    if (side === 'left') this.leftInput = dir;
    else this.rightInput = dir;
  }

  tick() {
    if (this.ended) return;

    this.leftZ = clamp(
      this.leftZ + this.leftInput * PADDLE_SPEED,
      -FIELD_HEIGHT + 1.5,
      FIELD_HEIGHT - 1.5,
    );
    this.rightZ = clamp(
      this.rightZ + this.rightInput * PADDLE_SPEED,
      -FIELD_HEIGHT + 1.5,
      FIELD_HEIGHT - 1.5,
    );

    this.ballX += this.ballDX;
    this.ballZ += this.ballDZ;

    if (Math.abs(this.ballZ) > FIELD_HEIGHT - 0.5) {
      this.ballZ = Math.sign(this.ballZ) * (FIELD_HEIGHT - 0.5);
      this.ballDZ *= -1;
    }

    if (this.ballX < -FIELD_WIDTH) {
      this.rightScore++;
      this.resetBall();
    } else if (this.ballX > FIELD_WIDTH) {
      this.leftScore++;
      this.resetBall();
    }

    if (hitPaddle(this.ballX, this.ballZ, -FIELD_WIDTH + 1.5, this.leftZ) && this.ballDX < 0) {
      this.ballDX = Math.abs(this.ballDX);
    }
    if (hitPaddle(this.ballX, this.ballZ, FIELD_WIDTH - 1.5, this.rightZ) && this.ballDX > 0) {
      this.ballDX = -Math.abs(this.ballDX);
    }

    const state = {
      leftPaddleZ: this.leftZ,
      rightPaddleZ: this.rightZ,
      ballX: this.ballX,
      ballZ: this.ballZ,
      leftScore: this.leftScore,
      rightScore: this.rightScore,
    };

    for (const p of this.players) {
      p.send(JSON.stringify(createStateMessage(state)));
    }

    if (this.leftScore >= WINNING_SCORE || this.rightScore >= WINNING_SCORE) {
      const winnerSide = this.leftScore > this.rightScore ? 'left' : 'right';
      const winnerIndex = winnerSide === 'left' ? 0 : 1;
      const loserIndex = winnerSide === 'left' ? 1 : 0;

      this.ended = true;

      const winnerWs = this.players[winnerIndex];
      const loserWs = this.players[loserIndex];

      const winnerId = winnerWs.user_id ?? winnerWs.id;
      const loserId = loserWs.user_id ?? loserWs.id;
      updateStats(winnerId, loserId);

      for (const p of this.players) {
        p.send(JSON.stringify(createEndMessage(winnerSide, state)));
        p.close();
      }
      this.stop();
    }
  }

  resetBall() {
    this.ballX = 0;
    this.ballZ = 0;
    this.ballDX = 0;
    this.ballDZ = 0;
    if (this.ballSpawnTimeout) clearTimeout(this.ballSpawnTimeout);
    this.ballSpawnTimeout = setTimeout(() => {
      this.ballDX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
      this.ballDZ = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    }, 1000);
  }
}
