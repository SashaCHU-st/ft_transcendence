import { useMemo } from "react";
import { OverlayWrapper } from "./OverlayWrapper";
import { useEnterKey } from "../../hooks/useEnterKey";
import crownIcon from "../../png_icons/crown.png";
import "./TournamentWinnerOverlay.css";

interface TournamentWinnerOverlayProps {
  winner: string;
  onClose: () => void;
}

export function TournamentWinnerOverlay({
  winner,
  onClose,
}: TournamentWinnerOverlayProps) {
  useEnterKey(onClose);

  const fireworks = useMemo<React.CSSProperties[]>(
    () =>
      Array.from({ length: 70 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
      })),
    []
  );

  return (
    <OverlayWrapper>
      {/* Fireworks */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {fireworks.map((style, i) => (
          <div key={i} className="animate-firework" style={style} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
        <img
          src={crownIcon}
          alt="Crown"
          className="w-1/2 max-w-[400px] drop-shadow-[0_0_25px_rgba(255,215,0,1)] animate-crown-spin"
        />

        <h2
          className="
            text-5xl md:text-6xl font-extrabold
            bg-clip-text text-transparent
            bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300
            drop-shadow-[0_0_30px_rgba(255,215,0,0.8),0_0_40px_rgba(255,105,180,0.6)]
            animate-pulse-slow
          "
        >
          TOURNAMENT WINNER
        </h2>

        <p className="text-3xl md:text-4xl font-semibold text-[#69ff6c] drop-shadow-[0_0_15px_rgba(105,255,108,0.8)]">
          {winner}
        </p>

        <button
          onClick={onClose}
          className="
            px-8 py-4 text-xl md:text-2xl font-bold rounded-full bg-transparent
            animate-neon-border
            drop-shadow-[0_0_20px_rgba(255,20,147,0.9),0_0_40px_rgba(0,255,255,0.6)]
            hover:scale-110 transition-transform
          "
          autoFocus
        >
          OK
        </button>
      </div>
    </OverlayWrapper>
  );
}