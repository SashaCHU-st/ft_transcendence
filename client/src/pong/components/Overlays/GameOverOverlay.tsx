
import { useEffect } from "react";
import { OverlayWrapper, NeonCard, NeonButton } from "./OverlayComponents";

interface GameOverOverlayProps {
  winnerName: string;
  playerScore: number;
  aiScore: number;
  onOk: () => void;
}

export function GameOverOverlay({
  winnerName,
  playerScore,
  aiScore,
  onOk,
}: GameOverOverlayProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onOk();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onOk]);
  return (
    <OverlayWrapper className="z-40">
      <NeonCard
        borderColor="border-pink-500"
        from="from-pink-900"
        via="via-red-800"
        to="to-purple-900"
      >
        <h2
          className={`
            mb-4
            text-3xl
            font-bold
            text-pink-300
          `}
        >
          GAME OVER
        </h2>
        <p
          className={`
            mb-4
            text-xl
            text-white
          `}
        >
          Winner: {winnerName}
          <br />
          Score: {playerScore}:{aiScore}
        </p>
        <NeonButton borderColor="border-pink-500" onClick={onOk}
        >
          OK
        </NeonButton>
      </NeonCard>
    </OverlayWrapper>
  );
}
