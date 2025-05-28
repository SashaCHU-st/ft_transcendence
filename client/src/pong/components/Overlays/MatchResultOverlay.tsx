import { OverlayWrapper } from "./OverlayWrapper";
import { useEnterKey } from "../../hooks/useEnterKey";
import {
  OverlayCard,
  OverlayButton,
  OverlayHeading,
  OverlayText,
} from "./OverlayComponents";

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
    <OverlayWrapper>
      <OverlayCard>
        <OverlayHeading className="mb-2 text-2xl">Match result</OverlayHeading>
        <OverlayText className="text-lg">
          Winner: <b className="text-[#74C0FC]">{winner}</b>
          <br />
          Loser: <b className="text-[#743b91]">{loser}</b>
          <br />
          Score: {winnerScore}:{loserScore}
        </OverlayText>
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
    </OverlayWrapper>
  );
}
