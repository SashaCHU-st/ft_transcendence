// import React from "react";
// import { stripPredTag } from "../../utils/utils";

// interface ByeOverlayProps {
//   winner: string;
//   nextPair?: string;
//   onContinue: () => void;
// }

// export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
//   return (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//       <div className="rounded border-2 border-yellow-400 p-4 text-center">
//         <h2 className="mb-4 text-2xl text-yellow-200">BYE Match</h2>
//         <p className="mb-4 text-lg">
//           Player <b>{stripPredTag(winner)}</b> gets a pass to next round!
//         </p>
//         {nextPair && (
//           <p className="text-md mb-4 text-gray-300">Next match: {nextPair}</p>
//         )}
//         <button
//           onClick={onContinue}
//           className="rounded border border-white px-6 py-2"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }


interface ByeOverlayProps {
  winner: string;
  nextPair?: string;
  onContinue: () => void;
}

export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
  return (
    <div className={`
        absolute
        inset-0
        z-50
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
          border-yellow-400
          p-6
          text-center
          bg-gradient-to-br
          from-purple-900
          via-indigo-800
          to-pink-900
          shadow-neon-lg
        `}
      >
        <h2 className={`
            mb-4
            text-2xl
            font-bold
            text-yellow-300
          `}
        >
          BYE Match
        </h2>
        <p className={`
            mb-4
            text-lg
            text-white
          `}
        >
          Player <b>{winner}</b> gets a pass to next round!
        </p>
        {nextPair && (
          <p className={`
              mb-4
              text-md
              text-gray-300
            `}
          >
            Next match: {nextPair}
          </p>
        )}
        <button
          onClick={onContinue}
          className={`
            mt-2
            px-6
            py-2
            rounded-lg
            border-2
            border-yellow-400
            shadow-neon-button
            hover:scale-105
            transition
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
