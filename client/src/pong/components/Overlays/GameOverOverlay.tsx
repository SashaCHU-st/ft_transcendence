import { useEffect } from "react";
import { SpaceBackground } from "../SpaceBackground";

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
            mb-4
            text-3xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
        >
          GAME OVER
        </h2>
        <p
          className="
            mb-4
            text-xl
            text-[#D3E0FB]
          "
        >
          Winner: <b className="text-[#74C0FC]">{winnerName}</b>
          <br />
          Score: {playerScore}:{aiScore}
        </p>
        <button
          onClick={onOk}
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
          OK
        </button>
      </div>
    </SpaceBackground>
  );
}
