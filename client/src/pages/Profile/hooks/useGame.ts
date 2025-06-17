import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bots } from "../types/botsData";


export function useGame() {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const navigate = useNavigate();

  const handlePlay = useCallback(() => {
    if (selectedBot) {
      localStorage.setItem("selectedBot", JSON.stringify(selectedBot));
    } else {
      localStorage.removeItem("selectedBot");
    }
    navigate("/pong?mode=ai");
  }, [selectedBot, navigate]);

  return { selectedBot, setSelectedBot, handlePlay };
}
