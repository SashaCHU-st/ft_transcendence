// import React from "react";
// import { useNavigate } from "react-router-dom";
// import GameModeSelector from "./GameModeSelector";
// import TournamentModal from "./Tournament/components/TournamentModal";
// import { useGameSelector } from "./useGameSelector";

// const GameSelector: React.FC = () => {
//   // Hook for navigation
//   const navigate = useNavigate();

//   // Manage tournament modal state and player name inputs
//   const {
//     isTournamentOpen,
//     openTournament,
//     closeTournament,
//     names,
//     updateName,
//     canStart
//   } = useGameSelector();

//   // Called when "Start" is clicked: filter out empty entries and proceed
//   const handleStart = () => {
//     const playersList = names.filter(n => n.trim());
//     console.log("Tournament names:", playersList);
//     navigate('/tournament', { state: { players: playersList } });
//     closeTournament();
//   };

//   // Stub handlers for other game modes
//   const handleSingle = () => alert("Single Player clicked");
//   const handleMulti  = () => alert("Multiplayer clicked");

//   return (
//     <>
//       {/* Buttons to choose game mode */}
//       <GameModeSelector
//         onSingleClick={handleSingle}
//         onMultiClick={handleMulti}
//         onTournamentClick={openTournament}
//       />

//       {/* Modal for entering up to 8 player names */}
//       <TournamentModal
//         isOpen={isTournamentOpen}
//         onClose={closeTournament}
//         names={names}
//         updateName={updateName}
//         onStart={handleStart}
//         canStart={canStart()}
//       />
//     </>
//   );
// };

// export default GameSelector;


//! 19.05


import React from "react";
import { useNavigate } from "react-router-dom";
import GameModeSelector from "./GameModeSelector";
import TournamentModal from "./Tournament/components/TournamentModal";
import { useGameSelector } from "./useGameSelector";


interface GameSelectorProps {
  onSingleClick?: () => void;
  onMultiClick?: () => void;
  // onTournamentClick?: () => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
  onSingleClick,
  onMultiClick,
  // onTournamentClick,
}) => {
  const navigate = useNavigate();

  // Manage tournament modal state and player name inputs
  const {
    isTournamentOpen,
    openTournament,
    closeTournament,
    names,
    updateName,
    canStart,
  } = useGameSelector();

  // Called when "Start" is clicked: filter out empty entries and proceed
  const handleStart = () => {
    const playersList = names.filter((n) => n.trim());
    console.log("Tournament names:", playersList);
    navigate("/tournament", { state: { players: playersList } });
    closeTournament();
  };

  // Handlers for other game modes, using external callbacks if provided
  const handleSingle = () => {
    if (onSingleClick) return onSingleClick();
    alert("Single Player clicked");
  };

  const handleMulti = () => {
    if (onMultiClick) return onMultiClick();
    alert("Multiplayer clicked");
  };

  const handleTournamentClick = () => {
    // if (onTournamentClick) return onTournamentClick();
    openTournament();
  };

  return (
    <>
      {/* Buttons to choose game mode */}
      <GameModeSelector
        onSingleClick={handleSingle}
        onMultiClick={handleMulti}
        onTournamentClick={handleTournamentClick}
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