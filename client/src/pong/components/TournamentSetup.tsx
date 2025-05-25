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


// import React, { useEffect, useRef } from "react";

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
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const stars: { x: number; y: number; radius: number; alpha: number; fading: boolean }[] = [];
//     const numStars = 100;

//     // Initialize stars
//     for (let i = 0; i < numStars; i++) {
//       stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 1.5 + 0.5,
//         alpha: Math.random(),
//         fading: Math.random() > 0.5,
//       });
//     }

//     // Animation loop
//     const animate = () => {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       stars.forEach((star) => {
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
//         ctx.fill();

//         // Update alpha for fading effect
//         star.alpha += star.fading ? -0.02 : 0.02;
//         if (star.alpha <= 0) {
//           star.fading = false;
//           star.alpha = 0;
//         } else if (star.alpha >= 1) {
//           star.fading = true;
//           star.alpha = 1;
//         }

//         // Occasionally reposition star
//         if (Math.random() < 0.01) {
//           star.x = Math.random() * canvas.width;
//           star.y = Math.random() * canvas.height;
//           star.radius = Math.random() * 1.5 + 0.5;
//           star.alpha = Math.random();
//           star.fading = Math.random() > 0.5;
//         }
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 z-[-1]"
//       />
//       {/* Neon dialog */}
//       <div
//         className="
//           relative
//           bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
//           rounded-3xl
//           p-10
//           border-4 border-pink-400
//           shadow-neon-lg
//           text-center
//           max-w-md w-full
//         "
//       >
//         {/* Title */}
//         <h2
//           className="
//             text-2xl md:text-3xl
//             font-bold
//             text-transparent
//             bg-clip-text bg-gradient-to-r from-pink-300 via-red-400 to-purple-500
//             glow
//             mb-6
//           "
//         >
//           Tournament setup
//         </h2>

//         {/* Input list */}
//         <div className="flex flex-col space-y-3 mb-6">
//           {players.map((alias, i) => (
//             <input
//               key={i}
//               value={alias}
//               onChange={(e) => onChangePlayerName(i, e.target.value)}
//               placeholder={`Player ${i + 1}`}
//               className="
//                 w-full
//                 bg-black bg-opacity-20
//                 border-2 border-pink-400
//                 rounded-lg
//                 px-4 py-2
//                 text-white
//                 placeholder-pink-300
//                 focus:outline-none focus:ring-2 focus:ring-pink-500
//                 transition
//               "
//             />
//           ))}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-center gap-6">
//           <button
//             onClick={onAddPlayer}
//             className="
//               glow
//               neon-button
//               border-2 border-pink-300
//               rounded-xl
//               px-5 py-2
//               text-pink-300
//               bg-transparent
//               hover:bg-pink-900 hover:bg-opacity-30
//               transition-transform duration-200
//               hover:scale-105
//             "
//           >
//             + Add player
//           </button>

//           <button
//             onClick={onStartTournament}
//             className="
//               glow
//               neon-button
//               border-2 border-pink-400
//               rounded-xl
//               px-8 py-3
//               text-xl text-pink-300
//               bg-transparent
//               hover:bg-pink-900 hover:bg-opacity-30
//               transition-transform duration-200
//               hover:scale-105
//             "
//           >
//             START
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




//!

// import { useEffect, useRef } from "react";

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
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const stars: { x: number; y: number; radius: number; alpha: number; fading: boolean }[] = [];
//     const numStars = 100;

//     // Initialize stars
//     for (let i = 0; i < numStars; i++) {
//       stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 1.5 + 0.5,
//         alpha: Math.random(),
//         fading: Math.random() > 0.5,
//       });
//     }

//     // Animation loop
//     const animate = () => {
//       ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       stars.forEach((star) => {
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
//         ctx.fill();

//         // Update alpha for fading effect
//         star.alpha += star.fading ? -0.02 : 0.02;
//         if (star.alpha <= 0) {
//           star.fading = false;
//           star.alpha = 0;
//         } else if (star.alpha >= 1) {
//           star.fading = true;
//           star.alpha = 1;
//         }

//         // Occasionally reposition star
//         if (Math.random() < 0.01) {
//           star.x = Math.random() * canvas.width;
//           star.y = Math.random() * canvas.height;
//           star.radius = Math.random() * 1.5 + 0.5;
//           star.alpha = Math.random();
//           star.fading = Math.random() > 0.5;
//         }
//       });

//       requestAnimationFrame(animate);
//     };

//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 z-[-1]"
//       />
//       {/* Neon dialog */}
//       <div
//         className="
//           relative
//           bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
//           rounded-3xl
//           p-10
//           border-4 border-pink-400
//           shadow-neon-lg
//           text-center
//           max-w-md w-full
//         "
//       >
//         {/* Title */}
//         <h2
//           className="
//             text-2xl md:text-3xl
//             font-bold
//             text-transparent
//             bg-clip-text bg-gradient-to-r from-pink-300 via-red-400 to-purple-500
//             glow
//             mb-6
//           "
//         >
//           Tournament setup
//         </h2>

//         {/* Input list */}
//         <div className="flex flex-col space-y-3 mb-6">
//           {players.map((alias, i) => (
//             <input
//               key={i}
//               value={alias}
//               onChange={(e) => onChangePlayerName(i, e.target.value)}
//               placeholder={`Player ${i + 1}`}
//               className="
//                 w-full
//                 bg-black bg-opacity-20
//                 border-2 border-pink-400
//                 rounded-lg
//                 px-4 py-2
//                 text-white
//                 placeholder-pink-300
//                 focus:outline-none focus:ring-2 focus:ring-pink-500
//                 transition
//               "
//             />
//           ))}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-center gap-6">
//           <button
//             onClick={onAddPlayer}
//             className="
//               glow
//               neon-button
//               border-2 border-pink-300
//               rounded-xl
//               px-5 py-2
//               text-pink-300
//               bg-transparent
//               hover:bg-pink-900 hover:bg-opacity-30
//               transition-transform duration-200
//               hover:scale-105
//             "
//           >
//             + Add player
//           </button>

//           <button
//             onClick={onStartTournament}
//             className="
//               glow
//               neon-button
//               border-2 border-pink-400
//               rounded-xl
//               px-8 py-3
//               text-xl text-pink-300
//               bg-transparent
//               hover:bg-pink-900 hover:bg-opacity-30
//               transition-transform duration-200
//               hover:scale-105
//             "
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
    <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
      <StarryBackground />
      {/* Neon dialog */}
      <div
        className="
          relative
          bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
          rounded-3xl
          p-10
          border-4 border-pink-400
          shadow-neon-lg
          text-center
          max-w-md w-full
        "
      >
        {/* Title */}
        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            text-transparent
            bg-clip-text bg-gradient-to-r from-pink-300 via-red-400 to-purple-500
            glow
            mb-6
          "
        >
          Tournament setup
        </h2>

        {/* Input list */}
        <div className="flex flex-col space-y-3 mb-6">
          {players.map((alias, i) => (
            <input
              key={i}
              value={alias}
              onChange={(e) => onChangePlayerName(i, e.target.value)}
              className="
                w-full
                bg-black bg-opacity-20
                border-2 border-pink-400
                rounded-lg
                px-4 py-2
                text-white
                placeholder-pink-300
                focus:outline-none focus:ring-2 focus:ring-pink-500
                transition
              "
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onAddPlayer}
            className="
              glow
              neon-button
              border-2 border-pink-300
              rounded-xl
              px-5 py-2
              text-pink-300
              bg-transparent
              hover:bg-pink-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
            "
          >
            + Add player
          </button>

          <button
            onClick={onStartTournament}
            className="
              glow
              neon-button
              border-2 border-pink-400
              rounded-xl
              px-8 py-3
              text-xl text-pink-300
              bg-transparent
              hover:bg-pink-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
            "
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}