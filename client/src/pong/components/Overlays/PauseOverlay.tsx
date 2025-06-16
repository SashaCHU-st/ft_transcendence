import { OverlayWrapper } from "./OverlayWrapper";

interface PauseOverlayProps {
  waitingStart: boolean;
  onSettings?: () => void;
}

export function PauseOverlay({ waitingStart, onSettings }: PauseOverlayProps) {
  return (
    <OverlayWrapper>
      {onSettings && waitingStart && (
        <button
          onClick={onSettings}

          className="absolute top-4 right-4 text-[#0A7FC9] hover:text-cyan-200 text-4xl"
          aria-label="Settings"
        >
          <i className="fa-solid fa-gear text-shadow-[0_0_15px_rgba(0,255,255,0.7)]" />

        </button>
      )}
      {waitingStart ? (
        <div className="space-y-4 text-center relative">
          <div className="text-4xl font-bold text-cyan-300 text-shadow-[0_0_4px_rgba(0,255,255,0.6)]">
            Press any key to start
          </div>
          <div className="text-lg text-white">
            <p>Controls:</p>
            <p>Player 1: W / S</p>
            <p>Player 2: ↑ / ↓</p>
            <p>Single player: ↑ / ↓</p>
          </div>
        </div>
      ) : (
        <div className="text-4xl font-bold text-cyan-300 text-shadow-[0_0_4px_rgba(0,255,255,0.6)]">
          PAUSED
        </div>
      )}
    </OverlayWrapper>
  );
}
