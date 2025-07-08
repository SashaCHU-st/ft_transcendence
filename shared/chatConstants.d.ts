export const MAX_MESSAGE_LENGTH: number;
export const SYSTEM_MESSAGE_TTL_MS: number;
export const MAX_SYSTEM_MESSAGES: number;

export interface SystemNotification {
  id: string;
  type: 'waiting' | 'info';
  text: string;
}
