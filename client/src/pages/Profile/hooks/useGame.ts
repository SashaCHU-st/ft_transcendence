/**
 * Hook for handling game-related logic, including initiating a game against a bot
 * and saving the game result to the server.
 */

import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "../types/UserInfo";
import { saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

// Hook for managing game interactions
export const useGame = (
  user: UserInfo | null, // Current user information
  headers: Record<string, string>, // Authentication headers for API requests
  selectedBot: (typeof bots)[0] | null, // Selected bot opponent
  reloadUser: () => Promise<void> // Function to reload user data
) => {
  // Handles game completion, saving results and updating user data
  const gameEnd = useCallback(
    async (result: "win" | "loss", opponent: string) => {
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(new Date());
      const payload: MatchResult = { date: today, weekday, result };
      try {
        await saveGameResult(payload, headers);
        toast.success(`Game over! You ${result} against ${opponent}!`);
        await reloadUser();
      } catch {
        toast.error("Failed to save game result");
      }
    },
    [user, headers, reloadUser]
  );

  // Initiates a game against a bot with a random outcome
  const play = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";
    gameEnd(result, opponent.name);
  }, [selectedBot, gameEnd]);

  // Expose the play function for external use
  return { play };
};