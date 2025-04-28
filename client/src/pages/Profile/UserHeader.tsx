import React from "react";
import Avatar from "./Avatar";
import { UserInfo, calculateUserStats, MatchResult } from "./types/UserInfo";

interface UserHeaderProps {
  user: Pick<UserInfo, "username" | "avatar" | "wins" | "losses" | "history">;
  className?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  className,
}) => {
  const { winRate, latestDate, winsToday, lossesToday } = calculateUserStats(
    user.wins,
    user.losses,
    user.history
  );

  return (
    <div
      className={`
        flex
        flex-col
        items-center
        text-center
        gap-3
        ${className ?? ""}
      `}
    >
      <Avatar
		user={{ avatar: user.avatar, username: user.username }}
        className="
          w-32
          h-32
          sm:w-40
          sm:h-40
          md:w-44
          md:h-44
          xl:w-48
          xl:h-48
        "
      />
      <h1
        className="
          text-xl
          sm:text-2xl
          font-bold
        "
      >
        {user.username}
      </h1>
      <p
        className="
          text-gray-300
          text-sm
          sm:text-base
        "
      >
        Wins: {user.wins} | Winrate: {winRate}%
      </p>
      {latestDate && (
        <p
          className="
            text-sm
            text-purple-300
          "
        >
          Last Game: {latestDate} — Wins: {winsToday}, Losses: {lossesToday}
        </p>
      )}
    </div>
  );
};

export default UserHeader;