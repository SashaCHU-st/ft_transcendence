import { sendChatMessage } from "../../types/api";
export const sendViaSocket = (
  socket: WebSocket | null,
  toId: string | number,
  text: string,
): boolean => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  socket.send(
    JSON.stringify({
      type: 'chat',
      toId,
      text,
    }),
  );
  return true;
};

export { sendChatMessage as sendViaHttp } from '../../types/api';

export const sendMessage = async (
  socket: WebSocket | null,
  fromId: number,
  toId: number,
  text: string,
) => {
  const sentViaSocket = sendViaSocket(socket, toId, text);
  if (!sentViaSocket) {
    await sendChatMessage(fromId, toId, text);
  }
};
