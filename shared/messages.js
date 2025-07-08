/**
 * Shared message helpers and JSDoc type declarations for the remote pong game.
 * This module contains small helper functions for constructing messages so that
 * both server and client rely on the same schema.
 * The accompanying `messages.d.ts` file provides TypeScript typings.
 */

/**
 * @typedef {'left' | 'right'} Side
 */

/**
 * @typedef {object} RemoteState
 * @property {number} ballX
 * @property {number} ballZ
 * @property {number} leftPaddleZ
 * @property {number} rightPaddleZ
 * @property {number} leftScore
 * @property {number} rightScore
 * @property {string | null} [activeLeft]
 * @property {string | null} [activeRight]
 */

/**
 * @typedef {object} InitMessage
 * @property {'init'} type
 * @property {Side} side
 * @property {string} [leftName]
 * @property {string} [rightName]
 * @property {number} [startTime]
 * @property {number} [serverTime]
 */

/**
 * @typedef {object} StateMessage
 * @property {'state'} type
 * @property {RemoteState} state
 */

/**
 * @typedef {object} EndMessage
  * @property {'end'} type
  * @property {Side} winner
  * @property {RemoteState} state
  * @property {'opponent_left'} [reason]
 */

/**
 * @typedef {object} PowerMessage
 * @property {'power'} type
 * @property {string} power
 * @property {number} [duration]
 */

/**
 * @typedef {InitMessage | StateMessage | EndMessage | PowerMessage} ServerMessage
 */

/**
 * Enum-like object with message type strings used for server-client
 * communication. This allows both client and server to avoid
 * "magic strings" when working with WebSocket messages.
 */
export const MessageTypes = {
  INIT: 'init',
  STATE: 'state',
  END: 'end',
  POWER: 'power',
  WAIT: 'wait',
};

/**
 * Create an init message.
 * @param {Side} side
 * @param {string} [leftName]
 * @param {string} [rightName]
 * @param {number} [startTime]
 * @param {number} [serverTime]
 * @returns {InitMessage}
 */
export function createInitMessage(
  side,
  leftName,
  rightName,
  startTime,
  serverTime,
  settings,
) {
  const msg = { type: 'init', side };
  if (leftName) msg.leftName = leftName;
  if (rightName) msg.rightName = rightName;
  if (typeof startTime === 'number') msg.startTime = startTime;
  if (typeof serverTime === 'number') msg.serverTime = serverTime;
  if (settings) msg.settings = settings;
  return msg;
}

/**
 * Create a state message.
 * @param {RemoteState} state
 * @returns {StateMessage}
 */
export function createStateMessage(state) {
  return { type: 'state', state };
}

/**
 * Create an end message.
 * @param {Side} winner
 * @param {RemoteState} state
 * @param {'opponent_left'} [reason]
 * @returns {EndMessage}
 */
export function createEndMessage(winner, state, reason) {
  return reason
    ? { type: 'end', winner, state, reason }
    : { type: 'end', winner, state };
}
