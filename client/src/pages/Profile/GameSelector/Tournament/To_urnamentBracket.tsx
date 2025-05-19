
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// // Тип для state в useLocation
// interface LocationState {
//   players?: string[];
//   winner?: string; // Победитель пары с /game
// }

// // Описание слота (участник или PlayerX)
// interface Slot {
//   name: string;
//   isPlayerX: boolean;
// }

// // Случайно перемешиваем массив
// const shuffleArray = <T,>(array: T[]): T[] => {
//   const shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// };

// // Градиенты для подсветки пар
// const gradients = [
//   'from-pink-300/80 via-rose-300/60 to-red-500/80',
//   'from-green-300/80 via-lime-300/60 to-emerald-300/80',
//   'from-teal-400/80 via-cyan-300/60 to-blue-400/80',
//   'from-fuchsia-400/80 via-pink-500/60 to-red-400/80',
//   'from-red-300/80 via-orange-300/60 to-amber-300/80',
//   'from-blue-400/80 via-indigo-300/60 to-purple-400/80',
//   'from-yellow-300/80 via-lime-400/60 to-green-400/80',
//   'from-amber-300/80 via-yellow-400/60 to-orange-500/80',
// ];

// // Имитация базы данных (временное хранилище для заглушек)
// const mockDb = {
//   players: [] as string[],
//   winners: [] as { round: number; pair: number; winner: string }[],
// };

// // Заглушки для API
// const fetchPlayers = async (): Promise<string[]> => {
//   try {
//     return Promise.resolve(mockDb.players.length > 0 ? mockDb.players : ['Игрок1', 'Игрок2', 'Игрок3', 'Игрок4']);
//   } catch (error) {
//     console.error('Ошибка загрузки игроков:', error);
//     return [];
//   }
// };

// const fetchWinners = async (): Promise<{ round: number; pair: number; winner: string }[]> => {
//   try {
//     return Promise.resolve(mockDb.winners);
//   } catch (error) {
//     console.error('Ошибка загрузки победителей:', error);
//     return [];
//   }
// };

// const saveWinner = async (round: number, pair: number, winner: string): Promise<void> => {
//   try {
//     mockDb.winners.push({ round, pair, winner });
//     return Promise.resolve();
//   } catch (error) {
//     console.error('Ошибка сохранения победителя:', error);
//     throw error;
//   }
// };

// const TournamentBracket: React.FC = () => {
//   const { state } = useLocation() as { state: LocationState };
//   const navigate = useNavigate();

//   const [players, setPlayers] = useState<string[]>([]);
//   const [winners, setWinners] = useState<{ round: number; pair: number; winner: string }[]>([]);
//   const [rounds, setRounds] = useState<Slot[][]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tournamentStarted, setTournamentStarted] = useState(false);

//   // Инициализация игроков из .db
//   useEffect(() => {
//     const initPlayers = async () => {
//       setLoading(true);
//       let fetchedPlayers = await fetchPlayers();
      
//       if (state?.players && state.players.length >= 3 && state.players.length <= 8) {
//         mockDb.players = state.players;
//         fetchedPlayers = state.players;
//       }

//       if (fetchedPlayers.length >= 3 && fetchedPlayers.length <= 8) {
//         setPlayers(fetchedPlayers);
//       }
//       setLoading(false);
//     };
//     initPlayers();
//   }, [state?.players]);

//   // Загрузка победителей из .db
//   useEffect(() => {
//     const loadWinners = async () => {
//       const fetchedWinners = await fetchWinners();
//       setWinners(fetchedWinners);
//     };
//     loadWinners();
//   }, []);

//   // Генерация турнирной сетки
//   useEffect(() => {
//     if (players.length < 3) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     const shuffledPlayers = shuffleArray(players);
//     let allRounds: Slot[][] = [];

//     // Инициализация первого раунда
//     let firstRound: Slot[] = shuffledPlayers.map(p => ({ name: p, isPlayerX: false }));
//     if (players.length === 3 || players.length === 5 || players.length === 7) {
//       firstRound.push({ name: 'PlayerX', isPlayerX: true });
//     }
//     allRounds.push(firstRound);

//     // Инициализация пустых раундов
//     const maxRounds = players.length <= 4 ? 2 : 3;
//     for (let i = 1; i < maxRounds; i++) {
//       const slotsCount = Math.ceil(allRounds[i - 1].length / 2);
//       allRounds.push(Array(slotsCount).fill({ name: '', isPlayerX: false }));
//     }
//     allRounds.push([{ name: '', isPlayerX: false }]);

//     // Заполнение сетки из winners
//     const updatedRounds = allRounds.map((round, roundIdx) => {
//       if (roundIdx === 0) return round;
//       const newRound = [...round];
//       winners
//         .filter(w => w.round === roundIdx)
//         .forEach(w => {
//           const slotIdx = w.pair * (roundIdx < maxRounds - 1 ? 2 : 1);
//           if (newRound[slotIdx]) {
//             newRound[slotIdx] = { name: w.winner, isPlayerX: false };
//           }
//         });
//       return newRound;
//     });

//     setRounds(updatedRounds);
//     setLoading(false);
//   }, [players, winners]);

//   // Автоматическое продвижение против PlayerX
//   useEffect(() => {
//     if (rounds.length === 0 || !tournamentStarted) return;

//     const handlePlayerX = async () => {
//       const firstRound = rounds[0];
//       for (let i = 0; i < firstRound.length; i += 2) {
//         const slot1 = firstRound[i];
//         const slot2 = firstRound[i + 1];
//         if (slot1.isPlayerX && slot2 && !slot2.isPlayerX) {
//           await saveWinner(1, i / 2, slot2.name);
//         } else if (slot2?.isPlayerX && slot1 && !slot1.isPlayerX) {
//           await saveWinner(1, i / 2, slot1.name);
//         }
//       }
//       const updatedWinners = await fetchWinners();
//       setWinners(updatedWinners);
//     };

//     handlePlayerX();
//   }, [rounds, tournamentStarted]);

//   // Обработка полуфинала с тремя игроками
//   useEffect(() => {
//     if (rounds.length < 3 || !tournamentStarted) return;

//     const semiFinal = rounds[1];
//     if (semiFinal.length === 3) {
//       const realPlayers = semiFinal.filter(slot => !slot.isPlayerX && slot.name);
//       if (realPlayers.length === 3) {
//         const randomIndex = Math.floor(Math.random() * realPlayers.length);
//         const finalist = realPlayers[randomIndex];
//         saveWinner(2, 0, finalist.name).then(async () => {
//           const updatedWinners = await fetchWinners();
//           setWinners(updatedWinners);
//         });
//       }
//     }
//   }, [rounds, tournamentStarted]);

//   // Обработка результата игры
//   useEffect(() => {
//     if (state?.winner && tournamentStarted) {
//       const saveAndUpdate = async () => {
//         const currentRound = rounds.findIndex(r => r.some(s => s.name === '' && !s.isPlayerX));
//         if (currentRound > 0 && state.winner) {
//           const pairIdx = Math.floor(
//             rounds[currentRound - 1].findIndex(s => s.name === state.winner) / 2
//           );
//           try {
//             await saveWinner(currentRound, pairIdx, state.winner);
//             const updatedWinners = await fetchWinners();
//             setWinners(updatedWinners);
//           } catch (error) {
//             console.error('Не удалось сохранить победителя:', error);
//           }
//         }
//       };
//       saveAndUpdate();
//     }
//   }, [state?.winner, tournamentStarted, rounds]);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-main-neon animate-pulse text-white">
//         Загрузка турнирной сетки…
//       </div>
//     );
//   }

//   if (players.length < 3) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-main-neon text-white">
//         <p className="text-xl mb-4">Недостаточно игроков для турнира (минимум 3)</p>
//         <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
//           Назад
//         </button>
//       </div>
//     );
//   }

//   // Считаем пары и оффсеты для градиентов
//   const pairsCount = rounds.slice(0, -1).map(r => Math.ceil(r.length / 2));
//   const offsets: number[] = [];
//   pairsCount.reduce((acc, cur, idx) => {
//     offsets[idx] = acc;
//     return acc + cur;
//   }, 0);

//   return (
//     <div className="w-full h-screen bg-main-neon">
//       <style>
//         {`
//           .winner-glow {
//             position: relative;
//             animation: color-glow 3s infinite ease-in-out;
//           }
//           @keyframes color-glow {
//             0% {
//               box-shadow: 0 0 10px rgba(0, 255, 255, 0.8),
//                           0 0 20px rgba(0, 255, 255, 0.6),
//                           0 0 30px rgba(0, 255, 255, 0.4);
//             }
//             50% {
//               box-shadow: 0 0 15px rgba(255, 0, 255, 0.8),
//                           0 0 30px rgba(255, 0, 255, 0.6),
//                           0 0 45px rgba(255, 0, 255, 0.4);
//             }
//             100% {
//               box-shadow: 0 0 10px rgba(255, 255, 0, 0.8),
//                           0 0 20px rgba(255, 255, 0, 0.6),
//                           0 0 30px rgba(255, 255, 0, 0.4);
//             }
//           }
//           .winner-glow::before,
//           .winner-glow::after,
//           .winner-glow > span::before,
//           .winner-glow > span::after {
//             content: '';
//             position: absolute;
//             width: 8px;
//             height: 8px;
//             border-radius: 50%;
//             animation: firework-spark 1.5s infinite linear;
//           }
//           .winner-glow::before {
//             background: rgba(0, 255, 255, 0.8);
//             top: 50%;
//             left: -10px;
//             animation-delay: 0s;
//             transform: translateY(-50%);
//             --spark-x: -80px;
//             --spark-y: 0;
//           }
//           .winner-glow::after {
//             background: rgba(255, 0, 255, 0.8);
//             top: 50%;
//             right: -10px;
//             animation-delay: 0.3s;
//             transform: translateY(-50%);
//             --spark-x: 80px;
//             --spark-y: 0;
//           }
//           .winner-glow > span::before {
//             background: rgba(255, 255, 0, 0.8);
//             top: -10px;
//             left: 50%;
//             animation-delay: 0.6s;
//             transform: translateX(-50%);
//             --spark-x: 0;
//             --spark-y: -80px;
//           }
//           .winner-glow > span::after {
//             background: rgba(255, 255, 255, 0.8);
//             bottom: -10px;
//             left: 50%;
//             animation-delay: 0.9s;
//             transform: translateX(-50%);
//             --spark-x: 0;
//             --spark-y: 80px;
//           }
//           @keyframes firework-spark {
//             0% {
//               opacity: 1;
//               transform: translate(0, 0) scale(1);
//             }
//             100% {
//               opacity: 0;
//               transform: translate(var(--spark-x), var(--spark-y)) scale(0);
//             }
//           }
//           .neon-button {
//             animation: pulse-neon 1.5s infinite ease-in-out;
//           }
//           @keyframes pulse-neon {
//             0%, 100% {
//               box-shadow: 0 0 10px rgba(34, 197, 94, 0.5),
//                           0 0 20px rgba(34, 197, 94, 0.3);
//             }
//             50% {
//               box-shadow: 0 0 20px rgba(34, 197, 94, 0.8),
//                           0 0 40px rgba(34, 197, 94, 0.6);
//             }
//           }
//         `}
//       </style>
//       <div className="relative w-full h-screen bg-main-neon">
//         <button
//           onClick={() => {}}
//           className="fixed top-[15%] left-1/2 transform -translate-x-1/2 px-16 py-8 bg-green-500 hover:bg-green-600 text-white rounded-lg text-2xl sm:text-3xl font-bold neon-button transition z-10"
//         >
//           Start
//         </button>
//         <div className="flex flex-col items-center justify-center h-full px-2 sm:px-4">
//           <div
//             className="grid gap-4 sm:gap-6 mx-auto w-[66.67%] min-h-[50vh]"
//             style={{
//               gridTemplateColumns: `repeat(${rounds.length}, minmax(150px, 1fr))`,
//             }}
//           >
//             {rounds.map((slots, rndIdx) => (
//               <div
//                 key={rndIdx}
//                 className="flex flex-col items-center justify-center min-h-[50vh]"
//               >
//                 <h3 className="text-lg sm:text-xl text-center text-cyan-300 mb-4">
//                   {rndIdx === 0
//                     ? players.length >= 5
//                       ? 'Четвертьфинал'
//                       : 'Полуфинал'
//                     : rndIdx === 1
//                     ? players.length >= 5
//                       ? 'Полуфинал'
//                       : 'Финал'
//                     : rndIdx === rounds.length - 1
//                     ? 'Победитель'
//                     : 'Финал'}
//                 </h3>
//                 <div className="flex flex-col space-y-12 w-full">
//                   {rndIdx < rounds.length - 1
//                     ? Array.from({ length: Math.ceil(slots.length / 2) }).map(
//                         (_, pairIdx) => {
//                           const slot1 = slots[pairIdx * 2];
//                           const slot2 = slots[pairIdx * 2 + 1];
//                           const gradIdx = offsets[rndIdx] + pairIdx;
//                           const gradient = gradients[gradIdx % gradients.length];

//                           return (
//                             <div
//                               key={pairIdx}
//                               className="flex flex-col space-y-2 w-full"
//                             >
//                               <div
//                                 className={`p-3 sm:p-4 rounded-lg text-center italic text-lg sm:text-xl text-white bg-gradient-to-br ${gradient} drop-shadow-[0_0_12px_rgba(0,255,200,0.5)] transition-transform transform w-full h-[60px] sm:h-[80px] flex items-center justify-center`}
//                               >
//                                 {slot1?.isPlayerX ? 'PlayerX' : slot1?.name || '—'}
//                               </div>
//                               {slot2 && (
//                                 <div
//                                   className={`p-3 sm:p-4 rounded-lg text-center italic text-lg sm:text-xl text-white bg-gradient-to-br ${gradient} drop-shadow-[0_0_12px_rgba(0,255,200,0.5)] transition-transform transform w-full h-[60px] sm:h-[80px] flex items-center justify-center`}
//                                 >
//                                   {slot2.isPlayerX ? 'PlayerX' : slot2.name || '—'}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         }
//                       )
//                     : slots.map((slot, i) => (
//                         <div key={i} className="flex flex-col space-y-12 w-full">
//                           <div
//                             className="p-3 sm:p-4 rounded-lg text-center italic text-xl sm:text-2xl text-gray-900 bg-gradient-to-r from-green-400 to-teal-400 winner-glow w-full h-[60px] sm:h-[80px] flex items-center justify-center"
//                           >
//                             <span>{slot.isPlayerX ? 'PlayerX' : slot.name || '—'}</span>
//                           </div>
//                         </div>
//                       ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={() => navigate(-1)}
//             className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base sm:text-lg transition"
//           >
//             ← Назад
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TournamentBracket;