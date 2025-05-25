// import React from "react";

// interface TournamentWinnerOverlayProps {
//   winner: string;
//   onClose: () => void;
// }

// export function TournamentWinnerOverlay({
//   winner,
//   onClose,
// }: TournamentWinnerOverlayProps) {
//   return (
//     <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-80">
//       <div className="rounded border-2 border-green-500 p-4 text-center">
//         <h2 className="mb-4 text-3xl">TOURNAMENT WINNER</h2>
//         <p className="mb-4 text-xl">{winner}</p>
//         <button
//           onClick={onClose}
//           className="rounded border border-white px-6 py-2"
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// }


interface TournamentWinnerOverlayProps {
  winner: string;
  onClose: () => void;
}

export function TournamentWinnerOverlay({
  winner,
  onClose,
}: TournamentWinnerOverlayProps) {
  return (
    <div className="
        absolute
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black
        bg-opacity-90
      "
    >
      <div className="
          rounded-2xl
          border-2
          border-green-500
          p-6
          text-center
          bg-gradient-to-br
          from-green-900
          via-teal-800
          to-blue-900
          shadow-neon-lg
        "
      >
        <h2 className="
            mb-4
            text-3xl
            font-bold
            text-green-300
          "
        >
          TOURNAMENT WINNER
        </h2>
        <p className="
            mb-4
            text-xl
            text-white
          "
        >
          {winner}
        </p>
        <button
          onClick={onClose}
          className="
            mt-2
            px-6
            py-2
            rounded-lg
            border-2
            border-green-500
            shadow-neon-button
            hover:scale-105
            transition
          "
        >
          OK
        </button>
      </div>
    </div>
  );
}
