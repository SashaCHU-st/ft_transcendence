import React from "react";
import ProfileActions from "./ProfileActions";
import { UserInfo } from "./types/UserInfo";

interface HeaderProps {
	user: Pick<UserInfo, "username" | "online" | "email">;
	onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick }) => {
	return (
		<div
			className={`
        flex
        justify-between
        items-center
        px-6
        py-4
      `}
		/* Main container: Aligns the title and profile actions horizontally with padding */
		>
			<div
				className={`
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-red-400
          via-indigo-300
          to-green-300
          text-2xl
          sm:text-3xl
          font-bold
          transition-transform
          duration-300
          ease-in-out
          hover:scale-110
        `}
				style={{
					textShadow:
						"0 0 20px rgba(255, 255, 255, 0.3), 0 0 32px rgba(255, 0, 255, 0.3)",
				}}
			/* Title: Styles the "NEON PONG" logo with a gradient, hover effect, and custom shadow */
			>
				NEON PONG
			</div>
			<ProfileActions user={user} onProfileClick={onProfileClick} />
		</div>
	);
};

export default Header;