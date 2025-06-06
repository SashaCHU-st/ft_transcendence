import React, { useMemo, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { UserInfo } from "../../pages/Profile/types/UserInfo";
import { addToFavorites } from "../../pages/Profile/AddFavorites";
import { deleteFromFavorites } from "../../pages/Profile/DeleteFavorites";
import { OverlayWrapper } from "../../pong/components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayButton,
} from "../../pong/components/Overlays/OverlayComponents";
import Avatar from "../../pages/Profile/Avatar";
import { calculateUserStats } from "../../pages/Profile/types/UserInfo";
import { useEscapeKey } from "../../pong/hooks/useEscapeKey";
import StatsBlock from "./StatsBlock";
import RecentGamesList from "./RecentGamesList";


interface ChatProfileModalProps {
  user: UserInfo;
  onClose: () => void;
  blocked?: boolean;
  onToggleBlock?: () => void;
}

const ChatProfileModal: React.FC<ChatProfileModalProps> = ({
  user,
  onClose,
  blocked = false,
  onToggleBlock,
}) => {
  const recentHistory = useMemo(() => user.history.slice(-5).reverse(), [user.history]);
  const [isFriend, setIsFriend] = useState(false);
  const handleAddFavorite = useCallback(async () => {
    try {
      await addToFavorites(user.username);
      toast.success(`${user.username} added to favorites`);
      setIsFriend(true);
    } catch (err) {
      console.error("Failed to add favorite:", err);
      toast.error("Failed to add to favorites");
    }
  }, [user.username]);

  const handleRemoveFavorite = useCallback(async () => {
    try {
      await deleteFromFavorites(user.username);
      toast.success(`${user.username} removed from favorites`);
      setIsFriend(false);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      toast.error("Failed to remove from favorites");
    }
  }, [user.username]);

  useEscapeKey(onClose);

  const { winRate, latestDate, winsToday, lossesToday } = useMemo(
    () => calculateUserStats(user.wins, user.losses, user.history),
    [user.wins, user.losses, user.history]
  );
  return (
    <OverlayWrapper onBackdropClick={onClose}>
      <OverlayCard
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-profile-title"
        className="w-[90%] max-w-lg mx-4 pb-10 text-white font-ubuntu overflow-hidden text-left bg-gray-800/10 backdrop-blur-md p-0"
      >
        <div className="relative z-10 bg-gray-950 pb-6 flex flex-col md:flex-row items-center gap-6 border-b-2 border-blue-400/50">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400">
              <Avatar
                user={{ avatar: user.avatar, username: user.username }}
                className="w-24 h-24"
              />
            </div>
            {user.online && (
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-gray-800" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 id="chat-profile-title" className="text-2xl font-bold text-white font-orbitron">
              {user.username}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className="text-blue-300">
                Games {user.wins + user.losses}
              </span>
              <div className="w-1 h-1 rounded-full bg-blue-300" />
              <span
                className={user.online ? "text-green-300" : "text-gray-400"}
              >
                {user.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-2 right-4 text-[#0A7FC9] hover:text-pink-500 text-lg font-bold font-orbitron"
          >
            ✕
          </button>
        </div>
          <div className="relative z-10 p-6 space-y-6">
            <StatsBlock winRate={winRate} latestDate={latestDate} winsToday={winsToday} lossesToday={lossesToday} totalMatches={user.wins + user.losses} totalWins={user.wins} />

          <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center font-orbitron">
              <i className="fa-solid fa-id-card mr-2" />
              Personal data
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Real name:</span>
                <span className="text-white font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Email:</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OverlayButton
              color="blue"
              onClick={isFriend ? handleRemoveFavorite : handleAddFavorite}
              className="w-full flex items-center justify-center"
            >
              <i
                className={`fa-solid ${isFriend ? 'fa-user-minus' : 'fa-user-plus'} mr-2`}
              />
              {isFriend ? 'Remove friend' : 'Add friend'}
            </OverlayButton>
            {onToggleBlock && (
              <OverlayButton
                onClick={onToggleBlock}
                className="w-full flex items-center justify-center"
              >
                <i
                  className={`fa-solid ${blocked ? "fa-unlock" : "fa-ban"} mr-2`}
                />
                {blocked ? "Unblock" : "Block User"}
              </OverlayButton>
            )}
          </div>
        </div>
          <RecentGamesList history={recentHistory} />
      </OverlayCard>
    </OverlayWrapper>
  );
};

export default ChatProfileModal;
