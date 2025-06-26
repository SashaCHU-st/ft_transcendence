import db from '../database/database.js';
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  PADDLE_SPEED,
  BALL_SPEED,
  BALL_SIZE,
  WINNING_SCORE,
} from '../../shared/constants.js';
import { createStateMessage, createEndMessage } from '../../shared/messages.js';
import { DEFAULT_EFFECTS } from '../../shared/powerups.js';
import { updatePowerUps, activatePowerUp as sharedActivatePowerUp } from '../../shared/powerupHelpers.js';
import {
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
} from 'node:timers';


function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function hitPaddle(ballX, ballZ, paddleX, paddleZ, scale = 1) {
  return (
    Math.abs(ballZ - paddleZ) < 1.5 * scale + 0.0 &&
    Math.abs(ballX - paddleX) < 1.0
  );
}

export function updateStats(
  winnerId,
  loserId,
  winnerScore = 0,
  loserScore = 0,
  challengeId = null,
) {
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

  let chId = challengeId;
  if (chId === null && winnerId && loserId) {
    const ch = db
      .prepare(
        `SELECT id FROM challenge WHERE ((user_id = ? AND friends_id = ?) OR (user_id = ? AND friends_id = ?)) AND confirmReq = 1 ORDER BY id DESC LIMIT 1`,
      )
      .get(winnerId, loserId, loserId, winnerId);
    if (ch) chId = ch.id;
  }

  db.prepare(
    `INSERT INTO game (challenge_id, win_user_id, losses_user_id, win_score, lose_score, date)` +
      ` VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(chId, winnerId ?? 0, loserId ?? 0, winnerScore, loserScore, new Date().toISOString());
  db.prepare(`UPDATE challenge SET game_end = 1 WHERE id = ? `).run(chId)
}

export class Game {
  constructor(ws1, ws2, options = {}) {
    this.players = [ws1, ws2];
    this.leftInput = 0;
    this.rightInput = 0;
    this.leftZ = 0;
    this.rightZ = 0;
    this.ballX = 0;
    this.ballZ = 0;
    this.ballSpeed = options.ballSpeed ?? BALL_SPEED;
    this.ballSize = options.ballSize ?? BALL_SIZE;
    this.ballDX = this.ballSpeed;
    this.ballDZ = this.ballSpeed;
    this.leftScore = 0;
    this.rightScore = 0;
    this.winningScore = options.winningScore ?? WINNING_SCORE;
    this.powerUpsEnabled = options.powerUps ?? false;
    this.powerUps = { active: { left: null, right: null }, available: [] };
    this.powerUpEffects = {
      speed: { left: DEFAULT_EFFECTS.speed, right: DEFAULT_EFFECTS.speed },
      scale: { left: DEFAULT_EFFECTS.scale, right: DEFAULT_EFFECTS.scale },
      powerShot: {
        left: DEFAULT_EFFECTS.powerShot,
        right: DEFAULT_EFFECTS.powerShot,
      },
    };
    this.ballPowered = false;
    this.interval = null;
    this.startTimeout = null;
    this.ballSpawnTimeout = null;
    this.ended = false;
  }



  activatePowerUp(side, type, duration) {
    if (!this.powerUpsEnabled) return;
    sharedActivatePowerUp(this, side, type, duration);
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

    updatePowerUps(this, 1 / 60);

    if (
      !this.powerUpEffects.powerShot.left &&
      !this.powerUpEffects.powerShot.right &&
      this.ballPowered
    ) {
      this.ballDX = Math.sign(this.ballDX) * this.ballSpeed;
      this.ballDZ = Math.sign(this.ballDZ) * this.ballSpeed;
      this.ballPowered = false;
    }

    const leftSpeed = this.powerUpEffects.speed.left;
    const rightSpeed = this.powerUpEffects.speed.right;

    this.leftZ = clamp(
      this.leftZ + this.leftInput * PADDLE_SPEED * leftSpeed,
      -FIELD_HEIGHT + 1.5,
      FIELD_HEIGHT - 1.5,
    );
    this.rightZ = clamp(
      this.rightZ + this.rightInput * PADDLE_SPEED * rightSpeed,
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

    if (
      hitPaddle(
        this.ballX,
        this.ballZ,
        -FIELD_WIDTH + 1.5,
        this.leftZ,
        this.powerUpEffects.scale.left,
      ) &&
      this.ballDX < 0
    ) {
      this.ballDX = Math.abs(this.ballDX);
      if (this.powerUpEffects.powerShot.left && !this.ballPowered) {
        this.ballDX = Math.sign(this.ballDX) * this.ballSpeed * 2;
        this.ballDZ = Math.sign(this.ballDZ) * this.ballSpeed * 2;
        this.ballPowered = true;
      }
    }
    if (
      hitPaddle(
        this.ballX,
        this.ballZ,
        FIELD_WIDTH - 1.5,
        this.rightZ,
        this.powerUpEffects.scale.right,
      ) &&
      this.ballDX > 0
    ) {
      this.ballDX = -Math.abs(this.ballDX);
      if (this.powerUpEffects.powerShot.right && !this.ballPowered) {
        this.ballDX = Math.sign(this.ballDX) * this.ballSpeed * 2;
        this.ballDZ = Math.sign(this.ballDZ) * this.ballSpeed * 2;
        this.ballPowered = true;
      }
    }

    const state = {
      leftPaddleZ: this.leftZ,
      rightPaddleZ: this.rightZ,
      ballX: this.ballX,
      ballZ: this.ballZ,
      leftScore: this.leftScore,
      rightScore: this.rightScore,
      activeLeft: this.powerUps.active.left ? this.powerUps.active.left.type : null,
      activeRight: this.powerUps.active.right ? this.powerUps.active.right.type : null,
    };

    for (const p of this.players) {
      p.send(JSON.stringify(createStateMessage(state)));
    }

    if (
      this.leftScore >= this.winningScore ||
      this.rightScore >= this.winningScore
    ) {
      const winnerSide = this.leftScore > this.rightScore ? 'left' : 'right';
      const winnerIndex = winnerSide === 'left' ? 0 : 1;
      const loserIndex = winnerSide === 'left' ? 1 : 0;

      this.ended = true;

      const winnerWs = this.players[winnerIndex];
      const loserWs = this.players[loserIndex];

      const winnerId = winnerWs.user_id ?? winnerWs.id;
      const loserId = loserWs.user_id ?? loserWs.id;
      const winnerScore = winnerSide === 'left' ? this.leftScore : this.rightScore;
      const loserScore = winnerSide === 'left' ? this.rightScore : this.leftScore;
      updateStats(winnerId, loserId, winnerScore, loserScore);

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
    this.ballPowered = false;
    if (this.ballSpawnTimeout) clearTimeout(this.ballSpawnTimeout);
    this.ballSpawnTimeout = setTimeout(() => {
      this.ballDX = this.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
      this.ballDZ = this.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }, 1000);
  }
}
