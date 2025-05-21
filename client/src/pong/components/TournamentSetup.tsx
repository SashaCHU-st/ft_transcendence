// import React from "react";

// interface TournamentSetupProps {
//   players: string[];
//   onChangePlayerName: (index: number, value: string) => void;
//   onAddPlayer: () => void;
//   onStartTournament: () => void;
// }

// export function TournamentSetup({
//   players,
//   onChangePlayerName,
//   onAddPlayer,
//   onStartTournament,
// }: TournamentSetupProps) {
//   return (
//     <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
//       <div className="rounded-lg border-2 border-pink-500 p-8 text-center">
//         <h2 className="mb-4 text-2xl text-pink-300">Tournament setup</h2>
//         <div className="flex flex-col space-y-2">
//           {players.map((alias, i) => (
//             <input
//               key={i}
//               className="w-72 rounded-md px-2 py-1 text-center text-black"
//               value={alias}
//               onChange={(e) => onChangePlayerName(i, e.target.value)}
//             />
//           ))}
//         </div>
//         <div className="mt-4 flex justify-center gap-4">
//           <button
//             onClick={onAddPlayer}
//             className="rounded border-2 border-gray-400 px-4 py-2 text-gray-200 hover:bg-gray-700"
//           >
//             + Add player
//           </button>
//           <button
//             onClick={onStartTournament}
//             className="glow rounded-lg border-2 border-pink-400 bg-transparent px-8 py-2 text-xl text-pink-300 transition-all duration-300 hover:bg-pink-900 hover:bg-opacity-30"
//           >
//             START
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//!



import { StarryBackground } from "./StarryBackground";

interface TournamentSetupProps {
  players: string[];
  onChangePlayerName: (index: number, value: string) => void;
  onAddPlayer: () => void;
  onStartTournament: () => void;
}

export function TournamentSetup({
  players,
  onChangePlayerName,
  onAddPlayer,
  onStartTournament,
}: TournamentSetupProps) {
  return (
    <div
      className="
        absolute
        inset-0
        z-[80]
        bg-gradient-to-b
        from-[#050A15]
        to-[#132553]
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >
      {/* animated starry backdrop */}
      <StarryBackground />

      {/* decorative elements (click-through), now with lower z-index and scaled down */}
      <div
        className="
          pointer-events-none
          z-0
        "
      >
        {/* pink radial glow at upper right */}
        <div
          className="
            absolute
            top-1/3
            left-2/3
            w-[900px]
            h-[900px]
            rounded-full
            transform
            -translate-x-1/2
            -translate-y-1/2
            bg-[radial-gradient(circle_at_center,rgba(179,4,126,0.2)_0%,rgba(12,23,50,0)_70%)]
            scale-50
          "
        />

        {/* purple radial glow at bottom right */}
        <div
          className="
            absolute
            bottom-1/3
            right-0
            w-[750px]
            h-[750px]
            rounded-full
            transform
            translate-x-1/2
            translate-y-1/2
            bg-[radial-gradient(circle_at_center,rgba(126,67,154,0.3)_0%,rgba(14,28,63,0)_70%)]
            scale-50
          "
        />

        {/* blue radial glow at upper left */}
        <div
          className="
            absolute
            top-1
            left-1
            w-[700px]
            h-[700px]
            rounded-full
            transform
            -translate-x-1/2
            -translate-y-1/4
            bg-[radial-gradient(circle_at_center,rgba(24,96,246,0.5)_0%,rgba(6,11,24,0.9)_70%)]
            opacity-30
            scale-50
          "
        />
      </div>

      {/* interactive panel (inputs & buttons) with higher z-index */}
      <div
        className="
          relative
          z-10
          pointer-events-auto
          rounded-lg
          border-2
          border-[#0A7FC9]
          bg-black
          bg-opacity-30
          p-12
          text-center
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
          w-[80%]
          max-w-[800px]
        "
      >
        <h2
          className="
            mb-6
            text-4xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
        >
          Tournament setup
        </h2>

        <div className="flex flex-col space-y-4 items-center">
          {players.map((alias, i) => (
            <div key={i} className="flex justify-center w-full">
              <input
                value={alias}
                onChange={(e) => onChangePlayerName(i, e.target.value)}
                placeholder={`Player ${i + 1}`}
                className="
                  w-96
                  rounded-xl
                  border-2
                  border-[#297db1]
                  bg-black
                  bg-opacity-50
                  px-4
                  py-2
                  text-center
                  text-[#D3E0FB]
                  shadow-[0_0_8px_rgba(0,255,255,0.5)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0A7FC9]
                  transition
                "
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={onAddPlayer}
            className="
              rounded-xl
              border-2
              border-[#9010CE]
              bg-black
              bg-opacity-30
              px-6
              py-3
              text-xl
              font-semibold
              text-[#743b91]
              shadow-[0_0_12px_rgba(192,38,211,0.7)]
              hover:scale-105
              transition
            "
          >
            + Add player
          </button>
          <button
            onClick={onStartTournament}
            className="
              rounded-xl
              border-2
              border-[#BD0E86]
              bg-black
              bg-opacity-30
              px-10
              py-3
              text-2xl
              font-semibold
              text-[#832264]
              shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
              hover:scale-105
              transition
            "
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
