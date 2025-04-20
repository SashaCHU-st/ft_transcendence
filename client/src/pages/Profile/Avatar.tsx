import React from 'react';

interface AvatarProps {
  src: string;
  username: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, username, className }) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(true);

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
            src={src}
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
