import React from "react";

interface MatchResultOverlayProps {
  winner: string;
  loser: string;
  isFinal: boolean;
  nextPair?: string;
  onContinue: () => void;
}

export function MatchResultOverlay({
  winner,
  loser,
  isFinal,
  nextPair,
  onContinue,
}: MatchResultOverlayProps) {
  return (
    <div className="absolute inset-0 z-[55] flex items-center justify-center bg-black bg-opacity-80">
      <div className="rounded border-2 border-yellow-400 p-4 text-center">
        <h2 className="mb-2 text-2xl text-yellow-300">Match result</h2>
        <p className="mb-4 text-lg">
          Winner: {winner}
          <br />
          Loser: {loser}
        </p>

        {isFinal ? (
          <p className="mb-4 text-lg text-green-300">This was final!</p>
        ) : nextPair ? (
          <p className="text-md mb-4 text-gray-300">Next match: {nextPair}</p>
        ) : (
          <p className="text-md mb-4 text-gray-300">Next match is coming...</p>
        )}

        <button
          onClick={onContinue}
          className="rounded border border-white px-6 py-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
