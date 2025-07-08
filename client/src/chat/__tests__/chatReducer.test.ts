import { describe, it, expect } from 'vitest';
import { chatReducer } from '../context/ChatContext.js';
import { MAX_SYSTEM_MESSAGES } from '../../../../shared/chatConstants.js';

interface SystemMessage {
  id: string;
  type: string;
  text: string;
}

function baseState() {
  return {
    selected: null,
    conversations: {},
    connected: false,
    blockedByMe: [],
    systemMessages: new Map<string, SystemMessage>(),
  };
}

describe('chatReducer', () => {
  it('adds system message by id', () => {
    const msg: SystemMessage = { id: '1', type: 'info', text: 'hello' };
    const state = baseState();
    const next = chatReducer(state, { type: 'addSystemMessage', payload: msg });
    expect(next.systemMessages.get('1')).toEqual(msg);
  });

  it('removes system message by id', () => {
    const msg: SystemMessage = { id: '1', type: 'info', text: 'bye' };
    const state = baseState();
    state.systemMessages.set('1', msg);
    const next = chatReducer(state, { type: 'removeSystemMessage', payload: '1' });
    expect(next.systemMessages.has('1')).toBe(false);
  });

  it('trims system messages beyond limit', () => {
    let state = baseState();
    for (let i = 0; i < MAX_SYSTEM_MESSAGES + 1; i++) {
      const msg: SystemMessage = {
        id: String(i),
        type: 'info',
        text: 'hi',
      };
      state = chatReducer(state, { type: 'addSystemMessage', payload: msg });
    }
    expect(state.systemMessages.size).toBe(MAX_SYSTEM_MESSAGES);
    expect(state.systemMessages.has('0')).toBe(false);
  });

  it('replaces system messages map', () => {
    const state = baseState();
    const newMap = new Map<string, SystemMessage>();
    newMap.set('x', { id: 'x', type: 'info', text: 'hi' });
    const next = chatReducer(state, { type: 'setSystemMessages', payload: newMap });
    expect(next.systemMessages).toBe(newMap);
  });
});
