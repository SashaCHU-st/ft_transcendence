
import { useState } from "react";
import { bots } from "../types/botsData";

/**
 * Hook that stores selected bot.
 */
export const useBots = () => {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  return { selectedBot, setSelectedBot } as const;
};
