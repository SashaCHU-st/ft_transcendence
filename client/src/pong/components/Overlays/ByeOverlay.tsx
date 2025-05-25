import { useEffect } from "react";
import { OverlayWrapper, NeonCard, NeonButton } from "./OverlayComponents";

interface ByeOverlayProps {
  winner: string;
  nextPair?: string;
  onContinue: () => void;
}

export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
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
        from="from-purple-900"
        via="via-indigo-800"
        to="to-pink-900"
      >
        <h2
          className={`
            mb-4
            text-2xl
            font-bold
            text-yellow-300
          `}
        >
          BYE Match
        </h2>
        <p
          className={`
            mb-4
            text-lg
            text-white
          `}
        >
          Player <b>{winner}</b> gets a pass to next round!
        </p>
        {nextPair && (
          <p
            className={`
              mb-4
              text-md
              text-gray-300
            `}
          >
            Next match: {nextPair}
          </p>
        )}
        <NeonButton borderColor="border-yellow-400" onClick={onContinue} autoFocus>
          Continue
        </NeonButton>
      </NeonCard>
    </OverlayWrapper>
  );
}
