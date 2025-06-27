import React, { useEffect, useState } from 'react';
import { UserInfo } from './types/UserInfo';

interface AvatarProps {
  user: Pick<UserInfo, "avatar" | "username">;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
  const [imgSrc, setImgSrc] = useState(user.avatar);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  useEffect(() => {
    setImgSrc(user.avatar);
    setIsImageLoaded(true);
  }, [user.avatar]);

  return (
    <div
      className={`
        flex
        flex-col
        items-center
      `}
    >
      <div
        className={`
          rounded-full
          border-2
          overflow-hidden
          flex
          items-center
          justify-center
          bg-gray-800
          text-white
          text-center
          ${className}
        `}
      >
        {isImageLoaded ? (
          <img
            src={imgSrc}
            alt={user.username}
            className={`
              w-full
              h-full
              object-cover
            `}
            onError={() => setIsImageLoaded(false)}
          />
        ) : (
          <span
            className={`
              text-sm
              font-semibold
              px-2
            `}
          >
            {user.username}
          </span>
        )}
      </div>
    </div>
  );
};

export default Avatar;