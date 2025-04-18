import React from 'react';

interface BotCardProps {
  name: string;
  image: string;
  strengths: string;
  weaknesses: string;
  onSelect: () => void;
}

const BotCard: React.FC<BotCardProps> = ({
  name,
  image,
  strengths,
  weaknesses,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer
                 bg-gray-800
                 bg-opacity-60
                 p-4
                 rounded-md
                 w-48
                 text-center
                 hover:bg-gray-700
                 transition"
    >
      <img
        src={image}
        alt={name}
        className="w-24
                   h-24
                   mx-auto
                   rounded-full
                   object-cover
                   mb-2"
      />
      <h3 className="font-bold
                     text-sm
                     mb-1">
        {name}
      </h3>
      <p className="text-xs
                    text-green-300">
        + {strengths}
      </p>
      <p className="text-xs
                    text-red-300">
        − {weaknesses}
      </p>
    </div>
  );
};

export default BotCard;
