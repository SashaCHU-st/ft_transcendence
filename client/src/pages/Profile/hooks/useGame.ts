import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MatchResult, UserInfo } from "../types/UserInfo";
import { saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

export function useGame(user: UserInfo | null, fetchAllUsers: () => Promise<void>, authHeaders: any) {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const navigate = useNavigate();

  const handleGameEnd = useCallback(async (result: "win" | "loss", opponent: string) => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());
    const matchResult: MatchResult = { date: today, weekday, result };

    try {
      await saveGameResult(matchResult, authHeaders);
      await fetchAllUsers();
      toast.success(`Game over! You ${result} against ${opponent}!`);
    } catch {
      toast.error("Failed to save game result. Please try again.");
    }
  }, [user, authHeaders, fetchAllUsers]);

  const handlePlay = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";

    handleGameEnd(result, opponent.name);
    if (!selectedBot) 
		setSelectedBot(null);
    navigate("/pong?mode=ai");
  }, [selectedBot, handleGameEnd, navigate]);

  return { selectedBot, setSelectedBot, handlePlay };
}
