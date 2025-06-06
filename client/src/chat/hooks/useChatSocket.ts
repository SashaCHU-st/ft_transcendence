import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "../../pages/Profile/types/api";

export function useChatSocket(
  userId: string,
  onChatMessage: (msg: ChatMessage) => void,
  onStatusChange?: (connected: boolean) => void,
  onError?: (err: { code: number; message: string }) => void,
): WebSocket | null {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(false);
  const attemptsRef = useRef(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    activeRef.current = true;
    let ws: WebSocket;

    const connect = () => {
      const token = localStorage.getItem("token");
      let url = `wss://localhost:3000/chat?user_id=${userId}`;
      if (token) url += `&token=${token}`;
      ws = new WebSocket(url);
      onStatusChange?.(false);

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === "chat") {
            onChatMessage(data.message as ChatMessage);
          } else if (data.type === "error") {
            onError?.(data as { code: number; message: string });
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onopen = () => {
        attemptsRef.current = 0;
        setSocket(ws);
        onStatusChange?.(true);
      };

      ws.onclose = (ev) => {
        try {
          onStatusChange?.(false);
        } catch (err) {
          console.error("Error handling ws.onclose:", err);
        }
        if (!activeRef.current) return;
        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        if (!ev.wasClean && attemptsRef.current < MAX_RETRIES) {
          const delay = Math.min(30000, 2 ** attemptsRef.current * 1000);
          attemptsRef.current += 1;
          reconnectRef.current = setTimeout(connect, delay);
        } else if (attemptsRef.current >= MAX_RETRIES) {
          console.error("WebSocket reconnect failed: max retries reached");
        }
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {
          // ignore error
        }
      };
    };

    connect();

    return () => {
      activeRef.current = false;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      attemptsRef.current = 0;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener("open", () => ws.close());
      }
      onStatusChange?.(false);
    };
  }, [userId, onChatMessage, onStatusChange, onError]);

  return socket;
}
