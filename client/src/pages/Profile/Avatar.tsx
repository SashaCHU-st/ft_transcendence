import React, { useRef } from 'react';

interface AvatarProps {
  src: string;
  username: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, username, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Avatar selected:', file);
    }
  };

  return (
    // Avatar container block
    <div className="flex flex-col items-center">
      {/* Circle wrapper with border */}
      <div
        onClick={handleClick}
        className={`rounded-full
                    border-2
                    border-white
                    overflow-hidden
                    cursor-pointer
                    ${className}`}
      >
        <img
          src={src}
          alt={username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <span className="text-xs text-gray-400 mt-1">
        Click avatar to change
      </span>
    </div>
  );
};

export default Avatar;
