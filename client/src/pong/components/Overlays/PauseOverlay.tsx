import { OverlayWrapper } from "./OverlayWrapper";

interface PauseOverlayProps {
  waitingStart: boolean;
}

export function PauseOverlay({ waitingStart }: PauseOverlayProps) {
  return (
    <OverlayWrapper>
      {waitingStart ? (
        <div className="space-y-4 text-center">
          <div
            className="text-4xl font-bold text-cyan-300 text-shadow-[0_0_4px_rgba(0,255,255,0.6)]"
          >
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
        <div
          className="text-4xl font-bold text-cyan-300 text-shadow-[0_0_4px_rgba(0,255,255,0.6)]"
        >
          PAUSED
        </div>
      )}
    </OverlayWrapper>
  );
}
