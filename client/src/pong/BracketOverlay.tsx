
// /** Single bracket match */
// export interface BracketMatch {
//   p1: string; // 'Player X' or '(pred) Player X'
//   p2: string;
//   winner: string | null; // name of winner if match played
// }

// /** Round: array of matches */
// export type BracketRound = BracketMatch[];

// interface BracketOverlayProps {
//   rounds: BracketRound[];
//   onClose: () => void;
// }

// export default function BracketOverlay({
//   rounds,
//   onClose,
// }: BracketOverlayProps) {
//   function parsePredName(name: string) {
//     const prefix = "(pred) ";
//     if (name.startsWith(prefix)) {
//       return {
//         isPred: true,
//         display: name.slice(prefix.length),
//       };
//     }
//     return {
//       isPred: false,
//       display: name,
//     };
//   }

//   /**
//    * Simplified labels:
//    * - if rounds.length=1 => Final
//    * - if rounds.length=2 => R1=Semifinals, R2=Final
//    * - if rounds.length=3 => R1=Quarterfinals, R2=Semifinals, R3=Final
//    */
//   function getRoundLabel(rIndex: number, totalRounds: number): string {
//     if (totalRounds === 1) {
//       return "Final";
//     } else if (totalRounds === 2) {
//       if (rIndex === 0) return "Semifinals";
//       return "Final";
//     } else if (totalRounds === 3) {
//       if (rIndex === 0) return "Quarterfinals";
//       if (rIndex === 1) return "Semifinals";
//       return "Final";
//     } else {
//       return `Round ${rIndex + 1}`;
//     }
//   }

//   const totalRounds = rounds.length;

//   return (
//     <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80">
//       <div className="relative h-[90%] w-[90%] overflow-auto rounded border-2 border-blue-500 p-4 text-white">
//         <h2 className="mb-4 text-center text-2xl text-blue-300">
//           Single-Elimination Bracket
//         </h2>

//         <div className="flex justify-center gap-8">
//           {rounds.map((round, rIndex) => {
//             const label = getRoundLabel(rIndex, totalRounds);

//             return (
//               <div key={rIndex} className="flex flex-col items-center">
//                 <h3 className="mb-2 text-lg">{label}</h3>

//                 {round.map((match, mIndex) => {
//                   const p1 = parsePredName(match.p1);
//                   const p2 = parsePredName(match.p2);

//                   return (
//                     <div
//                       key={mIndex}
//                       className="mb-4 flex min-w-[130px] flex-col items-center rounded border border-gray-300 bg-gray-700 p-2"
//                     >
//                       <div
//                         className={p1.isPred ? "italic text-orange-300" : ""}
//                       >
//                         {p1.display}
//                       </div>
//                       <div className="text-sm text-gray-300">vs</div>
//                       <div
//                         className={p2.isPred ? "italic text-orange-300" : ""}
//                       >
//                         {p2.display}
//                       </div>

//                       {match.winner && (
//                         <div className="mt-2 text-sm text-green-300">
//                           Winner: {match.winner}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           })}
//         </div>

//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 rounded border border-white px-4 py-2 hover:bg-gray-600"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }


import { SpaceBackground } from "./components/SpaceBackground";

/** Single bracket match */
export interface BracketMatch {
	p1: string; // 'Player X' or '(pred) Player X'
	p2: string;
	winner: string | null; // name of winner if match played
}

/** Round: array of matches */
export type BracketRound = BracketMatch[];

interface BracketOverlayProps {
	rounds: BracketRound[];
	onClose: () => void;
}

export default function BracketOverlay({
	rounds,
	onClose,
}: BracketOverlayProps) {
	function parsePredName(name: string) {
		const prefix = "(pred) ";
		if (name.startsWith(prefix)) {
			return {
				isPred: true,
				display: name.slice(prefix.length),
			};
		}
		return {
			isPred: false,
			display: name,
		};
	}

	/**
	 * Simplified labels:
	 * - if rounds.length=1 => Final
	 * - if rounds.length=2 => R1=Semifinals, R2=Final
	 * - if rounds.length=3 => R1=Quarterfinals, R2=Semifinals, R3=Final
	 */
	function getRoundLabel(rIndex: number, totalRounds: number): string {
		if (totalRounds === 1) {
			return "Final";
		} else if (totalRounds === 2) {
			if (rIndex === 0) return "Semifinals";
			return "Final";
		} else if (totalRounds === 3) {
			if (rIndex === 0) return "Quarterfinals";
			if (rIndex === 1) return "Semifinals";
			return "Final";
		} else {
			return `Round ${rIndex + 1}`;
		}
	}

	const totalRounds = rounds.length;

	// Main render: Returns the bracket overlay with a space background and tournament structure
	return (
		<SpaceBackground>
			{/* Main container: Displays the bracket with a semi-transparent background and scrollable content */}
			<div className="
				relative
				h-[90%]
				w-[90%]
				overflow-auto
				rounded
				border-2
				border-[#0A7FC9]
				p-4
				text-white
				flex
				flex-col
				items-center
				bg-black bg-opacity-30
				shadow-[0_0_15px_rgba(0,255,255,0.7)]">

				{/* Title: Shows the bracket title with a glowing effect */}
				<h2 className="
					mb-4
					text-center
					text-2xl
					font-extrabold
					text-[#D3E0FB]
					drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]">
					Single-Elimination Bracket
				</h2>

				{/* Rounds container: Displays all rounds, either stacked (mobile) or side-by-side (desktop) */}
				<div className="
					flex
					flex-wrap
					flex-col
					md:flex-row
					justify-center
					items-center
					gap-20
					w-full
					h-full">
					{rounds.map((round, rIndex) => {
						const label = getRoundLabel(rIndex, totalRounds);

						// Match styling: Applies different styles based on round (Quarterfinals, Semifinals, Final) 
						const matchStyle =
							label === "Quarterfinals"
								? `
							border-2 border-[#BD0E86]
							bg-black bg-opacity-30
							shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
							hover:scale-105 transition`
											: label === "Semifinals"
												? `
							border-2 border-[#9010CE]
							bg-black bg-opacity-30
							shadow-[0_0_12px_rgba(192,38,211,0.7)]
							hover:scale-105 transition`
												: `
							border-2 border-[#0A7FC9]
							bg-black bg-opacity-30
							shadow-[0_0_15px_rgba(0,255,255,0.7),0_0_24px_rgba(0,255,255,0.4)]
							hover:scale-105 transition`;

						// Round render: Returns a single round with its label and matches
						return (
							<div key={rIndex} className="
										flex
										flex-col
										items-center
										justify-center
										min-w-[150px]">
								{/* Round label: Displays the round name (e.g., Quarterfinals) */}
								<h3 className="
										mb-2
										text-lg
										font-semibold
										text-[#D3E0FB]
										drop-shadow-[0_0_5px_rgba(211,224,251,0.6)]">
									{label}
								</h3>

								{/* Matches container: Displays all matches in the round */}
								<div className="
                    				flex
                    				flex-col
                    				items-center
                    				justify-center
                    				gap-10">
									{round.map((match, mIndex) => {
										const p1 = parsePredName(match.p1);
										const p2 = parsePredName(match.p2);

										// Match render: Returns a single match with player names and winner
										return (
											<div key={mIndex} className={`
												flex
												min-w-[198px]
												flex-col
												items-center
												rounded-xl
												p-4
												${matchStyle}`}>

												{/* Player 1: Displays the first player's name, styled differently if predicted */}
												<div
													className={
														p1.isPred
															? `
												italic
												text-orange-300
												text-[24px]
												text-shadow-[0_0_4px_rgba(255,147,0,0.6)]`
																			: `
												text-[#D3E0FB]
												text-[24px]
												text-shadow-[0_0_4px_rgba(211,224,251,0.6)]`} >
													{p1.display}
												</div>

												{/* Versus: Displays "vs" between player names */}
												<div className="
												text-[21px]
												text-[#743b91]
												text-shadow-[0_0_4px_rgba(147,51,234,0.6)]">
													vs
												</div>

												{/* Player 2: Displays the second player's name, styled differently if predicted */}
												<div className={ p2.isPred
															? `
												italic
												text-orange-300
												text-[24px]
												text-shadow-[0_0_4px_rgba(255,147,0,0.6)]`
																			: `
												text-[#D3E0FB]
												text-[24px]
												text-shadow-[0_0_4px_rgba(211,224,251,0.6)]`}>
													{p2.display}
												</div>
												
												{/* Winner: Displays the winner's name if the match has a winner */}
												{match.winner && (
													<div className="
														mt-3
														text-[21px]
														text-[#74C0FC]
														text-shadow-[0_0_4px_rgba(74,222,128,0.6)]">
														Winner: {match.winner}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
				
				{/* Close button: Triggers the onClose callback to dismiss the overlay */}
				<button
					onClick={onClose}
					className="
					absolute
					right-4
					top-4
					rounded-xl
					border-2 border-[#0A7FC9]
					bg-black bg-opacity-30
					px-4 py-2
					text-[#297db1]
					shadow-[0_0_15px_rgba(0,255,255,0.7)]
					hover:scale-105 transition">
					Close
				</button>
			</div>
		</SpaceBackground>
	);
}