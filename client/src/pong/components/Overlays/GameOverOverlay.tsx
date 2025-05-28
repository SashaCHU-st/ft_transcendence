import { SpaceBackground } from "../SpaceBackground";
import { useEnterKey } from "../../hooks/useEnterKey";
import { OverlayCard, OverlayButton } from "./OverlayComponents";

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
    <SpaceBackground>
      <OverlayCard>
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
        <OverlayButton onClick={onOk}>OK</OverlayButton>
      </OverlayCard>
    </SpaceBackground>
  );
}
