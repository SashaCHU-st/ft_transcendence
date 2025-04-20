import React from 'react';

interface ProfileActionsProps {
	username: string;
	online: boolean;
  }
  

const ProfileActions: React.FC<ProfileActionsProps> = ({ username, online }) => {
	const handleProfileClick = () => alert('Edit profile...');
	const handleLogout = () => alert('Logging out...');

	return (
		<div className="flex
                    items-center
                    gap-4">
			<span className={`text-sm
                  font-bold
                  ${online ? 'text-green-400' : 'text-gray-400'}`}>
				{username}
			</span>
				
			{/* PROFILE */}
			<button
				onClick={handleProfileClick}
				className="px-4
                   py-1
                   rounded
                   bg-gray-300
                   text-black
                   hover:bg-gray-400
                   text-sm">
				Profile
			</button>
			
			{/* LogOut */}
			<button
				onClick={handleLogout}
				className="px-4
                   py-1
                   rounded
                   bg-gray-300
                   text-black
                   hover:bg-gray-400
                   text-sm">
				LOG OUT
			</button>
		</div>
	);
};

export default ProfileActions;
