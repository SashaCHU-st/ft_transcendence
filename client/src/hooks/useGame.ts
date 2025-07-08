import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bots } from "../types/botsData";

export function useGame() {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const navigate = useNavigate();

  const handlePlay = useCallback(() => {
    if (!selectedBot) {
      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      setSelectedBot(randomBot);
      localStorage.setItem("selectedBot", JSON.stringify(randomBot));
      setIsRandomizing(true);
      setTimeout(() => {
        setIsRandomizing(false);
        navigate("/pong?mode=ai");
      }, 600);
    } else {
      localStorage.setItem("selectedBot", JSON.stringify(selectedBot));
      navigate("/pong?mode=ai");
    }
  }, [selectedBot, navigate]);

  return { selectedBot, setSelectedBot, handlePlay, isRandomizing };
}
