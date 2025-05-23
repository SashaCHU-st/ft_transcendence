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
			className={`
        flex
        flex-col
        items-center
        gap-4
        w-full
        max-w-md
        mx-auto
        text-center
      `}
		/* Header container: Centers user info vertically with constrained width */
		>
			<Avatar
				user={user}
				className={`
          w-32
          h-32
          sm:w-40
          sm:h-40
        `}
			/* Avatar: Displays a responsive user avatar with larger size on sm screens */
			/>
			<h2
				className={`
          text-xl
          sm:text-2xl
          font-bold
        `}
			/* Username: Styles the user's username with responsive font size */
			>
				{user.username}
			</h2>
			<div
				className={`
          text-sm
          sm:text-base
          space-y-1
        `}
			/* Stats container: Groups user statistics with responsive text size */
			>
				<p>
					Wins: <span
						className={`
              text-green-400
            `}
					/* Wins count: Highlights the number of wins in green */
					>
						{user.wins}
					</span> | Losses: <span
						className={`
              text-red-400
            `}
					/* Losses count: Highlights the number of losses in red */
					>
						{user.losses}
					</span>
				</p>
				<p>
					Win Rate: <span
						className={`
              text-cyan-400
            `}
					/* Win rate: Highlights the win rate percentage in cyan */
					>
						{winRate}%
					</span>
				</p>
				{latestDate && (
					<p>
						Last Game: {latestDate} — Wins: <span
							className={`
                text-green-400
              `}
						/* Today's wins: Highlights today's wins in green */
						>
							{winsToday}
						</span>, Losses: <span
							className={`
                text-red-400
              `}
						/* Today's losses: Highlights today's losses in red */
						>
							{lossesToday}
						</span>
					</p>
				)}
			</div>
		</div>
	);
};

export default UserHeader;