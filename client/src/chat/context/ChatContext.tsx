import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { UserInfo } from '../../pages/Profile/types/UserInfo';
import {
  ChatMessage,
  fetchChatMessages,
  blockUserRequest,
  unblockUserRequest,
  fetchBlockedUsers,
} from '../../pages/Profile/types/api';
import { sendMessage as sendChat, sendViaSocket } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { useChatSocket } from '../hooks/useChatSocket';
import {
  SYSTEM_MESSAGE_TTL_MS,
  MAX_SYSTEM_MESSAGES,
} from '../../../../shared/chatConstants.js';
import type { SystemNotification } from '../../../../shared/chatConstants.js';

interface SystemMessage extends SystemNotification {}

interface ChatState {
  selected: UserInfo | null;
  /**
   * Store conversation history per other user.
   * Key is the other user's id and value is the array of chat messages.
   */
  conversations: Record<number, ChatMessage[]>;
  connected: boolean;
  /** Users this client has blocked */
  blockedByMe: number[];
  /** System notifications to show in chat */
  systemMessages: Map<string, SystemMessage>;
  }

type Action =
  | { type: 'select'; payload: UserInfo | null }
  | { type: 'setMessages'; userId: number; payload: ChatMessage[] }
  | { type: 'addMessage'; userId: number; payload: ChatMessage }
  | { type: 'setConnected'; payload: boolean }
  | { type: 'blockByMe'; userId: number }
  | { type: 'unblockByMe'; userId: number }
  | { type: 'setBlockedByMe'; ids: number[] }
  | { type: 'setSystemMessages'; payload: Map<string, SystemMessage> }
  | { type: 'addSystemMessage'; payload: SystemMessage }
  | { type: 'removeSystemMessage'; payload: string };

interface ChatContextType {
  state: ChatState;
  selectUser: (user: UserInfo | null) => void;
  sendMessage: (text: string) => Promise<void>;
  blockUser: (id: number) => Promise<void>;
  unblockUser: (id: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'select':
      return { ...state, selected: action.payload };
    case 'setMessages': {
      return {
        ...state,
        conversations: { ...state.conversations, [action.userId]: action.payload },
      };
    }
    case 'addMessage': {
      const existing = state.conversations[action.userId] || [];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.userId]: [...existing, action.payload],
        },
      };
    }
    case 'setConnected':
      return { ...state, connected: action.payload };
    case 'blockByMe':
      if (state.blockedByMe.includes(action.userId)) return state;
      return { ...state, blockedByMe: [...state.blockedByMe, action.userId] };
    case 'unblockByMe':
      return {
        ...state,
        blockedByMe: state.blockedByMe.filter((id) => id !== action.userId),
      };
    case 'setBlockedByMe':
      return { ...state, blockedByMe: action.ids };
    case 'setSystemMessages':
      return { ...state, systemMessages: action.payload };
    case 'addSystemMessage': {
      const msgs = new Map(state.systemMessages);
      msgs.set(action.payload.id, action.payload);
      if (msgs.size > MAX_SYSTEM_MESSAGES) {
        const firstKey = msgs.keys().next().value;
        msgs.delete(firstKey);
      }
      return { ...state, systemMessages: msgs };
    }
    case 'removeSystemMessage': {
      const msgs = new Map(state.systemMessages);
      msgs.delete(action.payload);
      return { ...state, systemMessages: msgs };
    }
    default:
      return state;
  }
}

export const ChatProvider = ({ children, currentUserId }: { children: ReactNode; currentUserId: string }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    selected: null,
    conversations: {},
    connected: false,
    blockedByMe: [],
    systemMessages: new Map<string, SystemMessage>(),
  });

  const systemTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const systemMessagesRef = useRef(state.systemMessages);

  useEffect(() => {
    systemMessagesRef.current = state.systemMessages;
  }, [state.systemMessages]);


  const handleIncoming = useCallback(
    (msg: ChatMessage) => {
      const otherId = msg.sender_id === Number(currentUserId) ? msg.receiver_id : msg.sender_id;
      dispatch({ type: 'addMessage', userId: otherId, payload: msg });
    },
    [currentUserId],
  );

  const handleStatus = useCallback((connected: boolean) => {
    dispatch({ type: 'setConnected', payload: connected });
  }, []);

  const handleSystem = useCallback((msg: SystemNotification) => {
    const msgs = new Map(systemMessagesRef.current);
    const existingTimer = systemTimers.current.get(msg.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      systemTimers.current.delete(msg.id);
    } else if (msgs.size >= MAX_SYSTEM_MESSAGES && !msgs.has(msg.id)) {
      const firstKey = msgs.keys().next().value as string;
      msgs.delete(firstKey);
      const oldTimer = systemTimers.current.get(firstKey);
      if (oldTimer) {
        clearTimeout(oldTimer);
        systemTimers.current.delete(firstKey);
      }
    }

    msgs.set(msg.id, msg);
    systemMessagesRef.current = msgs;
    dispatch({ type: 'setSystemMessages', payload: msgs });

    const timer = setTimeout(() => {
      systemTimers.current.delete(msg.id);
      const updated = new Map(systemMessagesRef.current);
      updated.delete(msg.id);
      systemMessagesRef.current = updated;
      dispatch({ type: 'setSystemMessages', payload: updated });
    }, SYSTEM_MESSAGE_TTL_MS);
    systemTimers.current.set(msg.id, timer);
  }, []);

  const handleSystemRemove = useCallback((id: string) => {
    const timer = systemTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      systemTimers.current.delete(id);
    }
    const msgs = new Map(systemMessagesRef.current);
    msgs.delete(id);
    systemMessagesRef.current = msgs;
    dispatch({ type: 'setSystemMessages', payload: msgs });
  }, []);

  const socket = useChatSocket(
    currentUserId,
    handleIncoming,
    handleStatus,
    undefined,
    handleSystem,
    handleSystemRemove,
  );

  const selectUser = useCallback((user: UserInfo | null) => {
    dispatch({ type: 'select', payload: user });
  }, []);

  useEffect(() => {
    fetchBlockedUsers()
      .then((ids) => dispatch({ type: 'setBlockedByMe', ids }))
      .catch(() => {});
  }, [currentUserId]);

  const loadMessages = useCallback(
    (otherId: number) => {
      fetchChatMessages(Number(currentUserId), otherId, Number(currentUserId))
        .then((msgs) => dispatch({ type: 'setMessages', userId: otherId, payload: msgs }))
        .catch(() => dispatch({ type: 'setMessages', userId: otherId, payload: [] }));
    },
    [currentUserId],
  );

  useEffect(() => {
    if (!state.selected) return;
    const otherId = Number(state.selected.id);
    loadMessages(otherId);
  }, [state.selected, loadMessages]);

  useEffect(() => {
    return () => {
      systemTimers.current.forEach((t) => clearTimeout(t));
      systemTimers.current.clear();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!state.selected) return;
      const message: ChatMessage = {
        id: Date.now(),
        sender_id: Number(currentUserId),
        receiver_id: Number(state.selected.id),
        text,
        created_at: new Date().toISOString(),
      };

      const sent = sendViaSocket(socket, state.selected.id, text);
      if (!sent) {
        try {
          await sendChat(
            socket,
            Number(currentUserId),
            Number(state.selected.id),
            text,
          );
          dispatch({
            type: 'addMessage',
            userId: Number(state.selected.id),
            payload: message,
          });
        } catch (err) {
          toast.error('Failed to send message');
        }
      }
    },
    [socket, state.selected, currentUserId]
  );

  const blockUser = useCallback(
    async (id: number) => {
      try {
        await blockUserRequest(id);
        dispatch({ type: 'blockByMe', userId: id });
      } catch {
        // ignore errors
      }
    },
    [currentUserId]
  );

  const unblockUser = useCallback(
    async (id: number) => {
      try {
        await unblockUserRequest(id);
        dispatch({ type: 'unblockByMe', userId: id });
      } catch {
        // ignore errors
      }
    },
    [currentUserId]
  );

  const value = { state, selectUser, sendMessage, blockUser, unblockUser };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};
