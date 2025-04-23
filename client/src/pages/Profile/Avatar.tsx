
import React, { useEffect, useState } from 'react';

interface AvatarProps {
  src: string;
  username: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, username, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setIsImageLoaded(true);
  }, [src]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          rounded-full
          border-2
          border-white
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
            alt={username}
            className="w-full h-full object-cover"
            onError={() => setIsImageLoaded(false)}
          />
        ) : (
          <span className="text-sm font-semibold px-2">{username}</span>
        )}
      </div>
    </div>
  );
};

export default Avatar;
