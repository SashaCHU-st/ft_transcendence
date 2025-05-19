import React from "react";

interface TournamentWinnerOverlayProps {
  winner: string;
  onClose: () => void;
}

export function TournamentWinnerOverlay({
  winner,
  onClose,
}: TournamentWinnerOverlayProps) {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-80">
      <div className="rounded border-2 border-green-500 p-4 text-center">
        <h2 className="mb-4 text-3xl">TOURNAMENT WINNER</h2>
        <p className="mb-4 text-xl">{winner}</p>
        <button
          onClick={onClose}
          className="rounded border border-white px-6 py-2"
        >
          OK
        </button>
      </div>
    </div>
  );
}
