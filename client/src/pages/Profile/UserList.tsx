import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { CardWrapper } from './types/ui';
import { MatchResult, UserInfo } from './types/UserInfo';
import { askForChallenge } from './Challenge';
import { toast } from 'react-hot-toast';

interface Props {
  users: UserInfo[];
  matches: MatchResult[];
  variant: 'players' | 'friends';
  expandUsername?: string;
  onAdd?: (username: string) => void;
  onRemove?: (username: string) => void;
  onChallenge?: (username: string) => void;
}

const UserList: React.FC<Props> = ({
  users,
  matches,
  variant,
  expandUsername,
  onRemove,
  onAdd,
  onChallenge,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
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

        // Создаём новый объект user с добавленными функциями

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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg lg:text-xl">
                  {user.username}
                </span>
              </div>

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
                  Remove
                </button>
              )}
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
                    💚
                  </span>
                </button>
              )}
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
                  Challenge
                </button>
              )}
              <span
                className={`text-sm
                    sm:text-sm 
                    md:text-base ${
                      user.online ? 'text-green-400' : 'text-gray-400'
                    }`}
              >
                {user.online ? (
                  <i
                    className="fa-solid fa-circle"
                    style={{ color: 'green', fontSize: '1.2em' }}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-circle"
                    style={{ color: 'red', fontSize: '1.2em' }}
                  ></i>
                )}
              </span>

              {/* Важно: проверяем userWithActions.onChallenge */}
            </div>

            {/* Expandable content container */}
            <div style={expandedStyle}>
              <PlayerCard
                user={userWithActions}
                matches={(matches || []).filter(
                  (match) =>
                    match.winner_name === user.username ||
                    match.losses_name === user.username
                )}
              />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default UserList;
