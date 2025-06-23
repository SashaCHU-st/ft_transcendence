import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { CardWrapper } from './types/ui';
import { UserInfo } from './types/UserInfo';
import { askForChallenge } from './Challenge';
import { toast } from 'react-hot-toast';

interface Props {
  users: UserInfo[];
  variant: 'players' | 'friends';
  expandUsername?: string;
  onAdd?: (username: string) => void;
  onRemove?: (username: string) => void;
  onChallenge?: (username: string) => void;
}

const UserList: React.FC<Props> = ({
  users,
  variant,
  expandUsername,
  onRemove,
  onAdd,
  onChallenge,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<Record<string, any>>({});
  // const [fullHistory, setFullHistory] = useState(false);

  useEffect(() => {
    if (expandUsername) {
      const idx = users.findIndex(
        (u) => u.username.toLowerCase() === expandUsername.toLowerCase()
      );
      if (idx !== -1) {
        setExpandedIndex(idx);
      }
    }
  }, [expandUsername, users]);

  const toggleExpand = async (index: number) => {
    const user = users[index];

    // console.log("IIIIII=>,", user)
    const username = user.username;
        console.log("IIIIII=>,", username)
    try {
      const response = await fetch('https://localhost:3000/statisticsUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const responseData = await response.json();
      console.log('HERE=>', responseData.statUser);
      if (!response.ok) throw new Error('Cannot find user');
      setUserStats((prev) => ({
        ...prev,
        [username]: responseData.statUser,
      }));
    } catch (err) {
      console.error('Error', err);
    }

    setExpandedIndex((prev) => (prev === index ? null : index));
    // setFullHistory(true);
  };

  const handleChallenge = async (username: string) => {
    if (onChallenge) {
      onChallenge(username);
      return;
    }
    try {
      await askForChallenge(username);
      toast.success(`You asked ${username} for challenge`);
    } catch (err: any) {
      console.error('Failed to ask for challenge:', err);
      throw err;
    }
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        flex
        flex-col
        gap-2
        overflow-y-auto
        max-h-[500px]
        pr-1
        scrollbar-hidden
      `}
    >
      {users.map((user, idx) => {
        const isExpanded = expandedIndex === idx;
        const expandedStyle = {
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          maxHeight: isExpanded ? '600px' : '0',
          marginTop: isExpanded ? '0.75rem' : '0',
        };

        const avatarSrc = user.avatar.startsWith('data:image')
          ? user.avatar
          : '/prof_img/avatar1.png';

        const userWithActions: UserInfo & {
          onRemove?: () => void;
          onChallenge?: () => void;
          onAdd?: () => void;
        } = {
          ...user,
          avatar: avatarSrc,
          onRemove:
            variant === 'friends' && onRemove
              ? () => onRemove(user.username)
              : undefined,
          onChallenge: () => handleChallenge(user.username),
          onAdd:
            variant === 'players' && onAdd
              ? () => onAdd(user.username)
              : undefined,
        };

        return (
          <CardWrapper key={user.id} onClick={() => toggleExpand(idx)}>
            {/* Header row: avatar, username, online status */}
            <div className="flex w-full items-center">
              <div className=" flex-grow flex items-center gap-2">
                 <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      user.online ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white">{user.username}</p>
                </div>
              </div>

              </div>

              <div className="w-16">
                {userWithActions.onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      userWithActions.onRemove!();
                    }}
                    className="
                      px-4
                      py-2
                      rounded-md
                      text-sm
                      font-semibold
                      text-red-400
                      border-2
                      border-red-500
                      hover:bg-red-600
                      hover:text-white
                      transition
                      duration-300
                      shadow-[0_0_12px_#ff4d4d]
                      hover:shadow-[0_0_18px_#ff4d4d]
                    "
                  >
                    <i className="fa-solid fa-heart-crack"></i>
                  </button>
                )}
              </div>
              <div className="w-16">
                {userWithActions.onAdd && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      userWithActions.onAdd!();
                    }}
                    className="
                  h-10
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-semibold
                  text-green-400
                  border-2
                  border-green-500
                  hover:bg-green-800
                  hover:text-white
                  transition
                  duration-300
                  shadow-[0_0_12px_#00ff00]
                  hover:shadow-[0_0_18px_#00ff00]
            "
                  >
                    <span className="text-xl text-green-300 drop-shadow-[0_0_3px_#00ff00]">
                      <i className="fa-solid fa-heart"></i>
                    </span>
                  </button>
                )}
              </div>
              <div className="w-16">
                {userWithActions.onChallenge && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      userWithActions.onChallenge!();
                    }}
                    className="
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-semibold
                  text-cyan-300
                  border-2
                  border-cyan-400
                  hover:bg-cyan-500
                  hover:text-black
                  transition
                  duration-300
                  shadow-[0_0_12px_#00ffff]
                  hover:shadow-[0_0_18px_#00ffff]
                "
                  >
                    <i className="fa-solid fa-gamepad fa-1.5x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Expandable content container */}
            <div style={expandedStyle}>
              <PlayerCard
                user={userWithActions}
                stats={userStats[user.username]}
              />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default UserList;
