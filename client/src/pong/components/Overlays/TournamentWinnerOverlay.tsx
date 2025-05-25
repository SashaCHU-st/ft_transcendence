import { useEffect } from "react";
import { OverlayWrapper, NeonCard, NeonButton } from "./OverlayComponents";

interface TournamentWinnerOverlayProps {
  winner: string;
  onClose: () => void;
}

export function TournamentWinnerOverlay({
  winner,
  onClose,
}: TournamentWinnerOverlayProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <OverlayWrapper className="z-50">
      <NeonCard
        borderColor="border-green-500"
        from="from-green-900"
        via="via-teal-800"
        to="to-blue-900"
      >
        <h2
          className="
            mb-4
            text-3xl
            font-bold
            text-green-300
          "
        >
          TOURNAMENT WINNER
        </h2>
        <p
          className="
            mb-4
            text-xl
            text-white
          "
        >
          {winner}
        </p>
        <NeonButton borderColor="border-green-500" onClick={onClose} autoFocus>
          OK
        </NeonButton>
      </NeonCard>
    </OverlayWrapper>
  );
}
