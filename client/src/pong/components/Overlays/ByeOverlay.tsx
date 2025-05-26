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

import { SpaceBackground } from "../SpaceBackground";

interface ByeOverlayProps {
  winner: string;
  nextPair?: string;
  onContinue: () => void;
}

export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
  return (
    <SpaceBackground>
      <div
        className="
          relative
          z-10
          rounded-2xl
          border-2
          border-[#0A7FC9]
          p-6
          text-center
          bg-black
          bg-opacity-30
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
        "
      >
        <h2
          className="
            mb-4
            text-2xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
        >
          BYE Match
        </h2>
        <p
          className="
            mb-4
            text-lg
            text-[#D3E0FB]
          "
        >
          Player <b className="text-[#74C0FC]">{winner}</b> gets a pass to next round!
        </p>
        {nextPair && (
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
        )}
        <button
          onClick={onContinue}
          className="
            mt-2
            px-6
            py-2
            rounded-xl
            border-2
            border-[#BD0E86]
            bg-black
            bg-opacity-30
            text-[#832264]
            shadow-[0_0_15px_rgba(255,29,153,0.7)]
            hover:scale-105
            transition
          "
        >
          Continue
        </button>
      </div>
    </SpaceBackground>
  );
}