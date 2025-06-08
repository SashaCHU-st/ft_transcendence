import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

let callbacks: { onSystemMessage?: (msg: any) => void; onSystemRemove?: (id: string) => void } = {};

vi.mock('../hooks/useChatSocket', () => ({
  useChatSocket: (
    _userId: string,
    _onChatMessage: any,
    _onStatusChange: any,
    _onError: any,
    onSystemMessage?: (msg: any) => void,
    onSystemRemove?: (id: string) => void,
  ) => {
    callbacks.onSystemMessage = onSystemMessage;
    callbacks.onSystemRemove = onSystemRemove;
    return null;
  },
}));

import { ChatProvider, useChatContext } from '../context/ChatContext';
import { SYSTEM_MESSAGE_TTL_MS, MAX_SYSTEM_MESSAGES } from '../../../../shared/chatConstants.js';

let container: HTMLElement;
let root: ReturnType<typeof createRoot>;
let state: any;

function Consumer() {
  const ctx = useChatContext();
  state = ctx.state;
  return null;
}

beforeEach(() => {
  vi.useFakeTimers();
  callbacks = {};
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(
      <ChatProvider currentUserId="1">
        <Consumer />
      </ChatProvider>,
    );
  });
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  vi.useRealTimers();
});


describe('ChatProvider handleSystem', () => {
  it('replaces existing timer for same id', () => {
    const first = { id: 'a', type: 'info', text: 'one' };
    act(() => {
      callbacks.onSystemMessage!(first);
    });
    expect(state.systemMessages.get('a').text).toBe('one');

    act(() => {
      vi.advanceTimersByTime(SYSTEM_MESSAGE_TTL_MS / 2);
    });

    const second = { id: 'a', type: 'info', text: 'two' };
    act(() => {
      callbacks.onSystemMessage!(second);
    });
    expect(state.systemMessages.get('a').text).toBe('two');

    act(() => {
      vi.advanceTimersByTime(SYSTEM_MESSAGE_TTL_MS / 2 + 1);
    });
    expect(state.systemMessages.has('a')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(SYSTEM_MESSAGE_TTL_MS);
    });
    expect(state.systemMessages.has('a')).toBe(false);
  });

  it('cancels timer for trimmed message', () => {
    const start = vi.getTimerCount();
    for (let i = 0; i < MAX_SYSTEM_MESSAGES; i++) {
      const msg = { id: String(i), type: 'info', text: 'msg' };
      act(() => {
        callbacks.onSystemMessage!(msg);
      });
    }
    expect(state.systemMessages.size).toBe(MAX_SYSTEM_MESSAGES);
    expect(vi.getTimerCount() - start).toBe(MAX_SYSTEM_MESSAGES);

    const extra = { id: 'x', type: 'info', text: 'extra' };
    act(() => {
      callbacks.onSystemMessage!(extra);
    });

    expect(state.systemMessages.size).toBe(MAX_SYSTEM_MESSAGES);
    expect(state.systemMessages.has('0')).toBe(false);
    expect(vi.getTimerCount() - start).toBe(MAX_SYSTEM_MESSAGES);

    act(() => {
      vi.advanceTimersByTime(SYSTEM_MESSAGE_TTL_MS);
    });

    expect(state.systemMessages.size).toBe(0);
  });

  it('handles rapid successive messages', () => {
    const start = vi.getTimerCount();
    for (let i = 0; i < MAX_SYSTEM_MESSAGES * 2; i++) {
      const msg = { id: String(i), type: 'info', text: 'msg' };
      act(() => {
        callbacks.onSystemMessage!(msg);
      });
    }
    expect(state.systemMessages.size).toBe(MAX_SYSTEM_MESSAGES);
    expect(vi.getTimerCount() - start).toBe(MAX_SYSTEM_MESSAGES);

    act(() => {
      vi.advanceTimersByTime(SYSTEM_MESSAGE_TTL_MS);
    });

    expect(state.systemMessages.size).toBe(0);
  });
});
