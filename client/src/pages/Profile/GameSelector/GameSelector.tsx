import React from "react";
import GameModeSelector from "./GameModeSelector";
import { useNavigate } from "react-router-dom";

const GameSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSingle = () => navigate("/pong?mode=ai");
  const handleMulti = () => navigate("/pong?mode=local2p");
  const handleTournament = () => navigate("/pong?mode=tournament");

  return (
    <GameModeSelector
      onSingleClick={handleSingle}
      onMultiClick={handleMulti}
      onTournamentClick={handleTournament}
    />
  );
};

export default GameSelector;
