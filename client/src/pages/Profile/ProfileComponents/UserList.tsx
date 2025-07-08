import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { CardWrapper } from '../../../types/ui';
import { UserInfo } from '../../../types/UserInfo';
import { askForChallenge } from '../../../types/api'
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
    const username = user.username;

    try {
      const response = await fetch('https://localhost:3000/statisticsUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const responseData = await response.json();
      
      if (!response.ok) throw new Error('Cannot find user');
      setUserStats((prev) => ({
        ...prev,
        [username]: responseData.statUser,
      }));
    } catch (err) {
      console.error('Error', err);
    }

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
