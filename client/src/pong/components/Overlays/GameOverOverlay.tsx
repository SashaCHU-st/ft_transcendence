import { OverlayWrapper } from "./OverlayWrapper";
import { useEnterKey } from "../../hooks/useEnterKey";
import {
  OverlayCard,
  OverlayButton,
  OverlayHeading,
  OverlayText,
} from "./OverlayComponents";

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
  useEnterKey(onOk);
  return (
    <OverlayWrapper>
      <OverlayCard>
        <OverlayHeading className="text-3xl">GAME OVER</OverlayHeading>
        <OverlayText className="text-xl">
          Winner: <b className="text-[#74C0FC]">{winnerName}</b>
          <br />
          Score: {playerScore}:{aiScore}
        </OverlayText>
        <OverlayButton onClick={onOk}>OK</OverlayButton>
      </OverlayCard>
    </OverlayWrapper>
  );
}
