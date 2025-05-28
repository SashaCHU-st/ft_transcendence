import { SpaceBackground } from "../SpaceBackground";
import { useEnterKey } from "../../hooks/useEnterKey";
import { OverlayCard, OverlayButton } from "./OverlayComponents";

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
  useEnterKey(onContinue);
  return (
    <SpaceBackground>
      <OverlayCard>
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
        <OverlayButton onClick={onContinue}>Continue</OverlayButton>
      </OverlayCard>
    </SpaceBackground>
  );
}
