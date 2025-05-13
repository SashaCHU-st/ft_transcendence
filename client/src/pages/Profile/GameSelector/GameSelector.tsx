import React from "react";
import GameModeSelector from "./GameModeSelector";
import TournamentModal from "./TournamentModal";
import { useGameSelector } from "./useGameSelector";

const GameSelector: React.FC = () => {
  // Manage tournament modal state and player name inputs
  const {
    isTournamentOpen,
    openTournament,
    closeTournament,
    names,
    updateName,
    canStart
  } = useGameSelector();

  // Called when "Start" is clicked: filter out empty entries and proceed
  const handleStart = () => {
    const players = names.filter(n => n.trim());
    console.log("Tournament names:", players);
    // TODO: navigate to tournament setup or bracket view
    closeTournament();
  };

  // Stub handlers for other game modes
  const handleSingle = () => alert("Single Player clicked");
  const handleMulti  = () => alert("Multiplayer clicked");

  return (
    <>
      {/* Buttons to choose game mode */}
      <GameModeSelector
        onSingleClick={handleSingle}
        onMultiClick={handleMulti}
        onTournamentClick={openTournament}
      />

      {/* Modal for entering up to 8 player names */}
      <TournamentModal
        isOpen={isTournamentOpen}
        onClose={closeTournament}
        names={names}
        updateName={updateName}
        onStart={handleStart}
        canStart={canStart()}
      />
    </>
  );
};

export default GameSelector;
