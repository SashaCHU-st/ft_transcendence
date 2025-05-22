// import React from "react";

// interface MatchResultOverlayProps {
//   winner: string;
//   loser: string;
//   isFinal: boolean;
//   nextPair?: string;
//   onContinue: () => void;
// }

// export function MatchResultOverlay({
//   winner,
//   loser,
//   isFinal,
//   nextPair,
//   onContinue,
// }: MatchResultOverlayProps) {
//   return (
//     <div className="absolute inset-0 z-[55] flex items-center justify-center bg-black bg-opacity-80">
//       <div className="rounded border-2 border-yellow-400 p-4 text-center">
//         <h2 className="mb-2 text-2xl text-yellow-300">Match result</h2>
//         <p className="mb-4 text-lg">
//           Winner: {winner}
//           <br />
//           Loser: {loser}
//         </p>

//         {isFinal ? (
//           <p className="mb-4 text-lg text-green-300">This was final!</p>
//         ) : nextPair ? (
//           <p className="text-md mb-4 text-gray-300">Next match: {nextPair}</p>
//         ) : (
//           <p className="text-md mb-4 text-gray-300">Next match is coming...</p>
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