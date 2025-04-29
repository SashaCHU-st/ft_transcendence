// import React from "react";
// import Avatar from "./Avatar";
// import { UserInfo, calculateUserStats, MatchResult } from "./types/UserInfo";

// interface UserHeaderProps {
//   user: Pick<UserInfo, "username" | "avatar" | "wins" | "losses" | "history">;
//   className?: string;
// }

// const UserHeader: React.FC<UserHeaderProps> = ({
//   user,
//   className,
// }) => {
//   const { winRate, latestDate, winsToday, lossesToday } = calculateUserStats(
//     user.wins,
//     user.losses,
//     user.history
//   );

//   return (
//     <div
//       className={`
//         flex
//         flex-col
//         items-center
//         text-center
//         gap-3
//         ${className ?? ""}
//       `}
//     >
//       <Avatar
// 		user={{ avatar: user.avatar, username: user.username }}
//         className="
//           w-32
//           h-32
//           sm:w-40
//           sm:h-40
//           md:w-44
//           md:h-44
//           xl:w-48
//           xl:h-48
//         "
//       />
//       <h1
//         className="
//           text-xl
//           sm:text-2xl
//           font-bold
//         "
//       >
//         {user.username}
//       </h1>
//       <p
//         className="
//           text-gray-300
//           text-sm
//           sm:text-base
//         "
//       >
//         Wins: {user.wins} | Winrate: {winRate}%
//       </p>
//       {latestDate && (
//         <p
//           className="
//             text-sm
//             text-purple-300
//           "
//         >
//           Last Game: {latestDate} — Wins: {winsToday}, Losses: {lossesToday}
//         </p>
//       )}
//     </div>
//   );
// };

// export default UserHeader;



// /Users/olegoman/WORK/HIVE/ft_transendense/client/src/pages/Profile/UserHeader.tsx

import React from "react";
import Avatar from "./Avatar";
import { UserInfo, calculateUserStats } from "./types/UserInfo";

interface UserHeaderProps {
  user: Pick<UserInfo, "username" | "avatar" | "wins" | "losses" | "history">;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const { winRate, latestDate, winsToday, lossesToday } = calculateUserStats(
    user.wins,
    user.losses,
    user.history
  );

  return (
    <div
      className="
        flex
        flex-col
        items-center
        gap-4
        w-full
        max-w-md
        mx-auto
        text-center
      "
    >
      <Avatar user={user} className="w-24 h-24 sm:w-32 sm:h-32" />
      <h2 className="text-xl sm:text-2xl font-bold">{user.username}</h2>
      <div className="text-sm sm:text-base space-y-1">
        <p>
          Wins: <span className="text-green-400">{user.wins}</span> | Losses:{" "}
          <span className="text-red-400">{user.losses}</span>
        </p>
        <p>
          Win Rate: <span className="text-cyan-400">{winRate}%</span>
        </p>
        {latestDate && (
          <p>
            Last Game: {latestDate} — Wins:{" "}
            <span className="text-green-400">{winsToday}</span>, Losses:{" "}
            <span className="text-red-400">{lossesToday}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserHeader;