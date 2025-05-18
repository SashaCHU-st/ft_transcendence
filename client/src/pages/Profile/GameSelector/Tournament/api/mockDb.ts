/**
 * In‑memory store that imitates a real backend.
 * Replace this with real API calls once the server side is ready.
 */
export const mockDb = {
  players: [] as string[],
  winners: [] as { round: number; pair: number; winner: string }[],
};