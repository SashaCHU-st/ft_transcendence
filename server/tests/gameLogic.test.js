import test from 'node:test';
import assert from 'node:assert/strict';
import { Game } from '../remote/gameLogic.js';
import { DEFAULT_EFFECTS } from '../../shared/powerups.js';

function wsStub() {
  return { send() {} };
}

test('activatePowerUp ignores invalid durations', () => {
  const game = new Game(wsStub(), wsStub(), { powerUps: true });

  game.activatePowerUp('left', 'speed', Infinity);
  assert.equal(game.powerUps.active.left, null);
  assert.equal(game.powerUpEffects.speed.left, DEFAULT_EFFECTS.speed);

  game.activatePowerUp('left', 'speed', NaN);
  assert.equal(game.powerUps.active.left, null);
  assert.equal(game.powerUpEffects.speed.left, DEFAULT_EFFECTS.speed);

  game.activatePowerUp('left', 'speed', 0);
  assert.equal(game.powerUps.active.left, null);
  assert.equal(game.powerUpEffects.speed.left, DEFAULT_EFFECTS.speed);
});
