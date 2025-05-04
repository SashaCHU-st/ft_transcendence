import React from "react";
import { UserInfo } from "./types/UserInfo";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "./types/api";

interface ProfileActionsProps {
	user: Pick<UserInfo, "username" | "online" | "email">;
	onProfileClick: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ user, onProfileClick }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const response = await fetch("http://localhost:3000/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
				body: JSON.stringify({ email: user.email }),
			});
			if (!response.ok) throw new Error("Failed to logout");
			toast.success("Logged out successfully!");
			localStorage.removeItem("token");
			navigate("/login");
		} catch (err) {
			console.error("Logout error:", err);
			toast.error("Failed to logout. Please try again.");
		}
	};

	return (
		<div
			className={`
        flex
        items-center
        gap-4
      `}
		/* Actions container: Aligns username and buttons horizontally with spacing */
		>
			<span
				className={`
          text-sm
          font-bold
          ${user.online ? "text-green-400" : "text-gray-400"}
        `}
			/* Username: Displays the username with color indicating online status */
			>
				{user.username}
			</span>
			<button
				onClick={onProfileClick}
				className={`
          px-4
          py-2
          rounded-2xl
          text-base
          font-bold
          bg-transparent
          outline-3
          outline-offset-2
          outline-double
          border
          border-emerald-200
          text-white
          transition-all
          duration-300
          ease-in-out
          hover:scale-110
        `}
				style={{
					textShadow: `
            0 0 4px rgba(102, 0, 255, 0.9),
            0 0 8px rgba(102, 0, 255, 0.7),
            0 0 16px rgba(102, 0, 255, 0.5),
            0 0 32px rgba(102, 0, 255, 0.3)
          `,
				}}
			/* Profile button: Styles the profile button with neon effects and hover scaling */
			>
				Profile
			</button>
			<button
				onClick={handleLogout}
				className={`
          px-4
          py-2
          rounded-2xl
          text-base
          font-bold
          bg-transparent
          outline-3
          outline-offset-2
          outline-double
          border
          border-emerald-200
          text-white
          transition-all
          duration-300
          ease-in-out
          hover:scale-110
        `}
				style={{
					textShadow: `
            0 0 4px rgba(102, 0, 255, 0.9),
            0 0 8px rgba(102, 0, 255, 0.7),
            0 0 16px rgba(102, 0, 255, 0.5),
            0 0 32px rgba(102, 0, 255, 0.3)
          `,
				}}
			/* Logout button: Styles the logout button with neon effects and hover scaling */
			>
				LogOut
			</button>
		</div>
	);
};

export default ProfileActions;