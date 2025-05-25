// import React from "react";

// interface GameOverOverlayProps {
//   winnerName: string;
//   playerScore: number;
//   aiScore: number;
//   onOk: () => void;
// }

// export function GameOverOverlay({
//   winnerName,
//   playerScore,
//   aiScore,
//   onOk,
// }: GameOverOverlayProps) {
//   return (
//     <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80">
//       <div className="rounded border-2 border-pink-500 p-4 text-center">
//         <h2 className="mb-4 text-3xl">GAME OVER</h2>
//         <p className="mb-4 text-xl">
//           Winner: {winnerName}
//           <br />
//           Score: {playerScore}:{aiScore}
//         </p>
//         <button
//           onClick={onOk}
//           className="rounded border border-white px-6 py-2"
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// }



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
  return (
    <div className={`
        absolute
        inset-0
        z-40
        flex
        items-center
        justify-center
        bg-black
        bg-opacity-90
      `}
    >
      <div className={`
          rounded-2xl
          border-2
          border-pink-500
          p-6
          text-center
          bg-gradient-to-br
          from-pink-900
          via-red-800
          to-purple-900
          shadow-neon-lg
        `}
      >
        <h2 className={`
            mb-4
            text-3xl
            font-bold
            text-pink-300
          `}
        >
          GAME OVER
        </h2>
        <p className={`
            mb-4
            text-xl
            text-white
          `}
        >
          Winner: {winnerName}
          <br />
          Score: {playerScore}:{aiScore}
        </p>
        <button
          onClick={onOk}
          className={`
            mt-2
            px-6
            py-2
            rounded-lg
            border-2
            border-pink-500
            shadow-neon-button
            hover:scale-105
            transition
          `}
        >
          OK
        </button>
      </div>
    </div>
  );
}
