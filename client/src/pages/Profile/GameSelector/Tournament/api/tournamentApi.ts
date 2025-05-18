/**
 * Thin wrapper around the mock DB.  All data‑access logic lives here so
 * we can swap the implementation later without touching UI code.
 */
import { mockDb } from './mockDb';

export const fetchPlayers = async (): Promise<string[]> => {
  try {
    return mockDb.players;
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
}

export const fetchWinners = async (): Promise<{ round: number; pair: number; winner: string }[]> => {
  try {
    return Promise.resolve(mockDb.winners);
  } catch (error) {
    console.error('Error loading winners:', error);
    return [];
  }
};

export const saveWinner = async (round: number, pair: number, winner: string): Promise<void> => {
  try {
    mockDb.winners.push({ round, pair, winner });
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving winner:', error);
    throw error;
  }
};