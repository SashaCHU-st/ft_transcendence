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
      /* Main container: Centers the avatar vertically and horizontally */
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
        /* Avatar wrapper: Styles the circular avatar with border, background, and custom size */
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
            /* Avatar image: Ensures the image fills the circular container and covers it */
            onError={() => setIsImageLoaded(false)}
          />
        ) : (
          <span
            className={`
              text-sm
              font-semibold
              px-2
            `}
            /* Fallback text: Displays username in small, bold text when image fails to load */
          >
            {user.username}
          </span>
        )}
      </div>
    </div>
  );
};

export default Avatar;