import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProfileActionsProps {
	username: string;
	online: boolean;
	onProfileClick: () => void;
  }
  

const ProfileActions: React.FC<ProfileActionsProps> = ({ username, online, onProfileClick }) => {
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
				onClick={onProfileClick}
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
