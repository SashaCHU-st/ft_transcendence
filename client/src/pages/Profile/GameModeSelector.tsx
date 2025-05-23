// import React from "react";

// const modes = [
//   {
//     name: "Single Player",
//     img: "/button_img/single.png",
//   },
//   {
//     name: "Multiplayer",
//     img: "/button_img/mlti.png",
//   },
//   {
//     name: "Tournament",
//     img: "/button_img/tourn.png",
//   },
// ];

// const GameModeSelector: React.FC = () => {
//   return (
//     <div
//       className="
//         flex
//         flex-col
//         items-center
//         gap-9
//       "
//     >
//       {modes.map((mode, index) => (
//         <button
//           key={index}
//           onClick={() => alert(`${mode.name} clicked!`)}
//           className="
//             bg-transparent
//             rounded-xl
//             shadow-md
//             overflow-hidden
//             transform
//             transition
//             duration-300
//             hover:scale-110
//             hover:shadow-[0_0_20px_#00ff7f]
//           "
//         >
//           <img
//             src={mode.img}
//             alt={mode.name}
//             className="
//               w-[240px]
//               h-auto
//               object-contain
//               block
//               transition
//               duration-300
//               hover:brightness-110
//             "
//           />
//         </button>
//       ))}
//     </div>
//   );
// };

// export default GameModeSelector;
