import { useEffect } from "react";
import { OverlayWrapper, NeonCard, NeonButton } from "./OverlayComponents";

interface MatchResultOverlayProps {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  isFinal: boolean;
  nextPair?: string;
  onContinue: () => void;
}

export function MatchResultOverlay({
  winner,
  loser,
  winnerScore,
  loserScore,
  isFinal,
  nextPair,
  onContinue,
}: MatchResultOverlayProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onContinue]);
  return (
    <OverlayWrapper className="z-50">
      <NeonCard
        borderColor="border-yellow-400"
        from="from-green-900"
        via="via-yellow-800"
        to="to-amber-900"
      >
        <h2
          className="
            mb-2
            text-2xl
            font-bold
            text-yellow-300
          "
        >
          Match result
        </h2>
        <p
          className="
            mb-4
            text-lg
            text-white
          "
        >
          Winner: {winner}
          <br />
          Loser: {loser}
          <br />
          Score: {winnerScore}:{loserScore}
        </p>
        {isFinal ? (
          <p
            className="
              mb-4
              text-lg
              text-green-300
            "
          >
            This was final!
          </p>
        ) : nextPair ? (
          <p
            className="
              mb-4
              text-md
              text-gray-300
            "
          >
            Next match: {nextPair}
          </p>
        ) : (
          <p
            className="
              mb-4
              text-md
              text-gray-300
            "
          >
            Next match is coming...
          </p>
        )}
        <NeonButton borderColor="border-yellow-400" onClick={onContinue} autoFocus>
          Continue
        </NeonButton>
      </NeonCard>
    </OverlayWrapper>
  );
}
