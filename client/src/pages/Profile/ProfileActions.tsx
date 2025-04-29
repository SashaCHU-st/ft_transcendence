
import React from 'react';
import { UserInfo } from './types/UserInfo';

interface ProfileActionsProps {
  user: Pick<UserInfo, "username" | "online">;
  onProfileClick: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ user, onProfileClick }) => {
  const handleLogout = () => alert('Logging out...');

  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-bold ${user.online ? 'text-green-400' : 'text-gray-400'}`}>
        {user.username}
      </span>
      {/* PROFILE */}
      <button
        onClick={onProfileClick}
        className="px-4 py-2 rounded-2xl text-base font-bold bg-transparent outline-3 outline-offset-2 outline-double border border-emerald-200 text-white transition-all duration-300 ease-in-out hover:scale-110"
        style={{
          textShadow: `
            0 0 4px rgba(102, 0, 255, 0.9),
            0 0 8px rgba(102, 0, 255, 0.7),
            0 0 16px rgba(102, 0, 255, 0.5),
            0 0 32px rgba(102, 0, 255, 0.3)
          `,
        }}
      >
        Profile
      </button>
      {/* LogOut */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-2xl text-base font-bold bg-transparent outline-3 outline-offset-2 outline-double border border-emerald-200 text-white transition-all duration-300 ease-in-out hover:scale-110"
        style={{
          textShadow: `
            0 0 4px rgba(102, 0, 255, 0.9),
            0 0 8px rgba(102, 0, 255, 0.7),
            0 0 16px rgba(102, 0, 255, 0.5),
            0 0 32px rgba(102, 0, 255, 0.3)
          `,
        }}
      >
        LogOut
      </button>
    </div>
  );
};

export default ProfileActions;