import { useEffect } from "react";
import { SpaceBackground } from "../SpaceBackground";

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
    <SpaceBackground>
      <div
        className="
          relative
          z-10
          rounded-2xl
          border-2
          border-[#0A7FC9]
          p-6
          text-center
          bg-black
          bg-opacity-30
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
        "
      >
        <h2
          className="
            mb-2
            text-2xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
        >
          Match result
        </h2>
        <p
          className="
            mb-4
            text-lg
            text-[#D3E0FB]
          "
        >
          Winner: <b className="text-[#74C0FC]">{winner}</b>
          <br />
          Loser: <b className="text-[#743b91]">{loser}</b>
          <br />
          Score: {winnerScore}:{loserScore}
        </p>
        {isFinal ? (
          <p
            className="
              mb-4
              text-lg
              text-[#74C0FC]
              drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]
            "
          >
            This was final!
          </p>
        ) : nextPair ? (
          <p
            className="
              mb-4
              text-md
              text-[#743b91]
              drop-shadow-[0_0_5px_rgba(147,51,234,0.6)]
            "
          >
            Next match: {nextPair}
          </p>
        ) : (
          <p
            className="
              mb-4
              text-md
              text-[#743b91]
              drop-shadow-[0_0_5px_rgba(147,51,234,0.6)]
            "
          >
            Next match is coming...
          </p>
        )}
        <button
          onClick={onContinue}
          className="
            mt-2
            px-6
            py-2
            rounded-xl
            border-2
            border-[#BD0E86]
            bg-black
            bg-opacity-30
            text-[#832264]
            shadow-[0_0_15px_rgba(255,29,153,0.7)]
            hover:scale-105
            transition
          "
        >
          Continue
        </button>
      </div>
    </SpaceBackground>
  );
}