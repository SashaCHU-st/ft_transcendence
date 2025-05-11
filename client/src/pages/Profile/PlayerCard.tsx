
// import React from "react";
// import UserHeader from "./UserHeader";
// import { UserInfo } from "./types/UserInfo";

// interface Props {
//   user: UserInfo;
// }

// const PlayerCard: React.FC<Props> = ({ user }) => {
//   return (
//     <div
//       className="
//         bg-gray-900
//         rounded-xl
//         p-4
//         shadow-md
//         space-y-4
//         w-full
//         flex
//         flex-col
//         items-center
//       "
//     >
//       <UserHeader
//         user={{
//           username: user.username,
//           avatar: user.avatar,
//           wins: user.wins,
//           losses: user.losses,
//           history: user.history,
//         }}
//       />
//       <div
//         className="
//           flex
//           gap-3
//           justify-center
//           flex-wrap
//           pt-2
//         "
//       >
//         {/*Challenge */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             if (user.onChallenge) {
//               user.onChallenge();
//             } else {
//               console.log(`Challenging ${user.username}`);
//             }
//           }}
//           className="
//             px-4
//             py-2
//             rounded-md
//             text-sm
//             font-semibold
//             text-red-300
//             border-2
//             border-red-400
//             hover:bg-red-500
//             hover:text-black
//             transition
//             duration-300
//             shadow-[0_0_12px_#ff0000]
//             hover:shadow-[0_0_18px_#ff0000]
//           "
//           style={{
//             textShadow: '0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.6)',
//             boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
//           }}
//         >
//           Challenge
//         </button>

//         {/* Add/Remove */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             if (user.onRemove) {
//               user.onRemove();
//             } else if (user.onAdd) {
//               user.onAdd();
//             } else {
//               console.log(`Adding ${user.username} as a friend`);
//             }
//           }}
//           className="
//             px-4
//             py-2
//             rounded-md
//             text-sm
//             font-semibold
//             text-green-300
//             border-2
//             border-green-400
//             hover:bg-green-500
//             hover:text-black
//             transition
//             duration-300
//             shadow-[0_0_12px_#00ff00]
//             hover:shadow-[0_0_18px_#00ff00]
//           "
//           style={{
//             textShadow: '0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6)',
//             boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
//           }}
//         >
//           {user.onRemove ? "Remove" : "Add"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PlayerCard;


import React from "react";
import UserHeader from "./UserHeader";
import { UserInfo } from "./types/UserInfo";

interface Props {
  user: UserInfo;
}

const PlayerCard: React.FC<Props> = ({ user }) => {
  /* true — show button Remove, false — Add */
  const isRemove = !!user.onRemove;

  return (
    <div
      className="
        bg-gray-900
        rounded-xl
        p-4
        shadow-md
        space-y-4
        w-full
        flex
        flex-col
        items-center
      "
    >
      <UserHeader
        user={{
          username: user.username,
          avatar:   user.avatar,
          wins:     user.wins,
          losses:   user.losses,
          history:  user.history,
        }}
      />

      {/* --- ACTION BUTTONS ------------------------------------------ */}
      <div
        className="
          flex
          gap-3
          justify-center
          flex-wrap
          pt-2
        "
      >
        {/* -------- Challenge (RED) ---------- */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            user.onChallenge
              ? user.onChallenge()
              : console.log(`Challenging ${user.username}`);
          }}
          className="
            px-4
            py-2
            rounded-md
            text-sm
            font-semibold
            text-red-300
            border-2
            border-red-400
            hover:bg-red-500
            hover:text-black
            transition
            duration-300
            shadow-[0_0_12px_#ff0000]
            hover:shadow-[0_0_18px_#ff0000]
          "
          style={{
            textShadow: `
              0 0 10px rgba(255, 0, 0, 0.8),
              0 0 20px rgba(255, 0, 0, 0.6)
            `,
            boxShadow:  `
              0 0 15px rgba(255, 0, 0, 0.5)
            `,
          }}
        >
          Challenge
        </button>

        {/* -------- Add / Remove (Green and Blue) ---------- */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isRemove && user.onRemove)   user.onRemove();
            else if (user.onAdd)             user.onAdd();
            else console.log(`Adding ${user.username} as a friend`);
          }}
          className={`
            px-4
            py-2
            rounded-md
            text-sm
            font-semibold
            ${isRemove ? "text-blue-300"   : "text-green-300"}
            border-2
            ${isRemove ? "border-blue-400" : "border-green-400"}
            ${isRemove ? "hover:bg-blue-500"  : "hover:bg-green-500"}
            hover:text-black
            transition
            duration-300
            ${isRemove
              ? "shadow-[0_0_12px_#00bfff] hover:shadow-[0_0_18px_#00bfff]"
              : "shadow-[0_0_12px_#00ff00] hover:shadow-[0_0_18px_#00ff00]"
            }
          `}
          style={{
            textShadow: isRemove
              ? `
                  0 0 10px rgba(0, 191, 255, 0.8),
                  0 0 20px rgba(0, 191, 255, 0.6)
                `
              : `
                  0 0 10px rgba(0, 255, 0, 0.8),
                  0 0 20px rgba(0, 255, 0, 0.6)
                `,
            boxShadow: isRemove
              ? "0 0 15px rgba(0, 191, 255, 0.5)"
              : "0 0 15px rgba(0, 255, 0, 0.5)",
          }}
        >
          {isRemove ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
