import React from "react";
import ProfileModal from "./ProfileModal";
import Header from "./Header";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import BotSelector from "./BotSelector";
import { useProfile } from "./hooks/useProfile";

const Profile: React.FC = () => {
	const {
		user,
		friends,
		players,
		selectedBot,
		isModalOpen,
		isLoading,
		setSelectedBot,
		setIsModalOpen,
		handleSaveProfile,
		handlePlay,
	} = useProfile();

	if (isLoading) {
		return (
			<div
				className={`
          min-h-screen
          w-full
          flex
          items-center
          justify-center
          text-white
        `}
			/* Loading screen: Centers a loading message on a full-screen background */
			>
				Loading data, please wait...
			</div>
		);
	}

	if (!user) {
		return (
			<div
				className={`
          min-h-screen
          w-full
          flex
          items-center
          justify-center
          text-white
        `}
			/* Error screen: Centers an error message when user data fails to load */
			>
				Failed to load user data.
			</div>
		);
	}

	return (
		<>
			<div
				className={`
          min-h-screen
          w-full
          text-white
          flex
          flex-col
          overflow-y-auto
          justify-between
        `}
			/* Main container: Creates a full-screen, scrollable layout for the profile page */
			>
				<Header
					user={{
						username: user.username,
						online: user.online,
						email: user.email,
					}}
					onProfileClick={() => setIsModalOpen(true)}
				/>
				<DesktopLayout
					user={user}
					friends={friends}
					players={players}
					selectedBot={selectedBot}
					handlePlay={handlePlay}
				/>
				<MobileLayout
					user={user}
					friends={friends}
					players={players}
					selectedBot={selectedBot}
					handlePlay={handlePlay}
				/>
				<BotSelector
					selectedBot={selectedBot}
					setSelectedBot={setSelectedBot}
				/>
			</div>

			{isModalOpen && (
				<ProfileModal
					onClose={() => setIsModalOpen(false)}
					userData={{
						avatar: user.avatar,
						username: user.username,
						name: user.name,
					}}
					onSave={handleSaveProfile}
				/>
			)}
		</>
	);
};

export default Profile;