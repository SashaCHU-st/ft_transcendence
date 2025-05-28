import { useState } from "react";

export type MatchPhase = "idle" | "playing" | "bye" | "result" | "ended";

export function useMatchPhase(initial: MatchPhase = "idle") {
  const [phase, setPhase] = useState<MatchPhase>(initial);
  return { phase, setPhase } as const;
}
