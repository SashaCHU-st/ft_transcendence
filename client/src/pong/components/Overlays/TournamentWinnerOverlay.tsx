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


//! vareant odin


// import { SpaceBackground } from "../SpaceBackground";
// import crownIcon from "../../png_icons/crown.png";

// interface TournamentWinnerOverlayProps {
//   winner: string;
//   onClose: () => void;
// }

// export function TournamentWinnerOverlay({
//   winner,
//   onClose,
// }: TournamentWinnerOverlayProps) {
//   return (
//     <SpaceBackground>
//       {/* Firework Particles */}
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         {[...Array(70)].map((_, i) => (
//           <div
//             key={i}
//             className="
//               absolute w-3 h-3 rounded-full
//               bg-gradient-to-r from-yellow-400 to-red-500
//               animate-firework
//             "
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Winner panel with enhanced neon border */}
//       <div
//         className="
//           relative z-10
//           flex flex-col items-center space-y-4
//           rounded-xl
//           border-4 border-transparent
//           bg-black bg-opacity-20
//           px-10 py-8
//           animate-[neon-border_3s_linear_infinite,pulse-slow_1.5s_ease-in-out_infinite]
//         "
//       >
//         {/* Spinning Crown */}
//         <img
//           src={crownIcon}
//           alt="Crown"
//           className="
//             w-1/2 max-w-[600px]
//             drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]
//             animate-crown-spin
//           "
//         />

//         <h2
//           className="
//             text-4xl font-extrabold
//             text-[#FFD700]
//             drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]
//           "
//         >
//           TOURNAMENT WINNER
//         </h2>

//         <p
//           className="
//             text-2xl text-[#FF69B4]
//             drop-shadow-[0_0_10px_rgba(255,105,180,0.8)]
//           "
//         >
//           {winner}
//         </p>

//         <button
//           onClick={onClose}
//           className="
//             flex items-center justify-center
//             rounded-xl
//             border-2 border-[#FF1493]
//             bg-black bg-opacity-20
//             px-8 py-3
//             text-xl font-semibold text-[#FF69B4]
//             shadow-[0_0_15px_rgba(255,20,147,0.9),0_0_30px_rgba(255,20,147,0.6)]
//             hover:bg-opacity-40
//             hover:scale-110
//             transition
//           "
//         >
//           OK
//         </button>
//       </div>

//       {/* Keyframes for firework, crown spin, pulse, and neon border */}
//       <style>{`
//         @keyframes firework {
//           0% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(2); opacity: 0.7; }
//           100% { transform: scale(0); opacity: 0; }
//         }
//         .animate-firework {
//           animation: firework 2s infinite;
//         }

//         @keyframes crown-spin {
//           from { transform: perspective(400px) rotateY(0deg); }
//           to   { transform: perspective(400px) rotateY(360deg); }
//         }
//         .animate-crown-spin {
//           animation: crown-spin 4s linear infinite;
//           transform-style: preserve-3d;
//           backface-visibility: visible;
//         }

//         @keyframes neon-border {
//           0% { 
//             border-color: #FFD700;
//             box-shadow: 0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,20,147,0.7), 0 0 60px rgba(0,255,255,0.5);
//           }
//           33% { 
//             border-color: #FF1493;
//             box-shadow: 0 0 20px rgba(255,20,147,0.9), 0 0 40px rgba(0,255,255,0.7), 0 0 60px rgba(255,215,0,0.5);
//           }
//           66% { 
//             border-color: #00FFFF;
//             box-shadow: 0 0 20px rgba(0,255,255,0.9), 0 0 40px rgba(255,215,0,0.7), 0 0 60px rgba(255,20,147,0.5);
//           }
//           100% { 
//             border-color: #FFD700;
//             box-shadow: 0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,20,147,0.7), 0 0 60px rgba(0,255,255,0.5);
//           }
//         }

//         @keyframes pulse-slow {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.03); }
//         }
//       `}</style>
//     </SpaceBackground>
//   );
// }



//! vareant dva


import { SpaceBackground } from "../SpaceBackground";
import crownIcon from "../../png_icons/crown.png";
import "./TournamentWinnerOverlay.css";

interface TournamentWinnerOverlayProps {
  winner: string;
  onClose: () => void;
}

export function TournamentWinnerOverlay({
  winner,
  onClose,
}: TournamentWinnerOverlayProps) {
  return (
    <SpaceBackground>
      {/* Fireworks */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(70)].map((_, i) => (
          <div
            key={i}
            className="animate-firework"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-4">
        <img
          src={crownIcon}
          alt="Crown"
          className="w-1/2 max-w-[400px] drop-shadow-[0_0_25px_rgba(255,215,0,1)] animate-crown-spin"
        />

        <h2 className="
            text-5xl md:text-6xl font-extrabold
            bg-clip-text text-transparent
            bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300
            drop-shadow-[0_0_30px_rgba(255,215,0,0.8),0_0_40px_rgba(255,105,180,0.6)]
            animate-pulse-slow
          ">
          TOURNAMENT WINNER
        </h2>

        <p className="text-3xl md:text-4xl font-semibold text-[#69ff6c] drop-shadow-[0_0_15px_rgba(105,255,108,0.8)]">
          {winner}
        </p>

        <button
          onClick={onClose}
          className="
            px-8 py-4 text-xl md:text-2xl font-bold rounded-full bg-transparent
            animate-neon-border
            drop-shadow-[0_0_20px_rgba(255,20,147,0.9),0_0_40px_rgba(0,255,255,0.6)]
            hover:scale-110 transition-transform
          "
        >
          OK
        </button>
      </div>
    </SpaceBackground>
  );
}
