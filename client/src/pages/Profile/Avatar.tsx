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
    <div className="flex flex-col items-center">
      <img
        src={src}
        alt={username}
        onClick={handleClick}
        className={`rounded-full cursor-pointer border-4 border-white ${className}`}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-xs text-gray-400 mt-2">Click avatar to change</span>
    </div>
  );
};

export default Avatar;
