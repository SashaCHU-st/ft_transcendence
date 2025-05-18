import { useState } from "react";

/**
 * Hook to manage game mode selection state, 
 * particularly the Tournament modal and player names.
 */
export const useGameSelector = () => {
  // Whether the tournament modal is open
  const [isTournamentOpen, setTournamentOpen] = useState(false);
  // Array of up to 8 player name inputs (empty by default)
  const [names, setNames] = useState<string[]>(Array(8).fill(""));

  // Open the tournament modal
  const openTournament = () => setTournamentOpen(true);
  // Close the tournament modal
  const closeTournament = () => setTournamentOpen(false);

  /**
   * Update the name at a given index.
   * Creates a new array to trigger state update correctly.
   */
  const updateName = (idx: number, value: string) => {
    setNames(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  /**
   * Check if we have at least 3 non-empty names,
   * which is the minimum to start the tournament.
   */
  const canStart = () => names.filter(n => n.trim()).length >= 3;

  return {
    isTournamentOpen,
    openTournament,
    closeTournament,
    names,
    updateName,
    canStart,
  };
};
