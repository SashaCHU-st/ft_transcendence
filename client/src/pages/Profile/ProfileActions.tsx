import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProfileActionsProps {
  username: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ username }) => {
  const handleProfileClick = () => alert('Edit profile...');
  const handleLogout = () => alert('Logging out...'); 

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-bold text-green-400">{username}</span>
      <button
        onClick={handleProfileClick}
        className="px-4 py-1 rounded bg-gray-300 text-black hover:bg-gray-400 text-sm"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-1 rounded bg-gray-300 text-black hover:bg-gray-400 text-sm"
      >
        LOG OUT
      </button>
    </div>
  );
};

export default ProfileActions;
