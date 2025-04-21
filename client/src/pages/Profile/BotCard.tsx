

import React from 'react';

interface BotCardProps {
  name: string;
  image: string;
  strengths: string;
  weaknesses: string;
  onSelect: () => void;
  selected: boolean;
}

const BotCard: React.FC<BotCardProps> = ({
  name,
  image,
  strengths,
  weaknesses,
  onSelect,
  selected
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        cursor-pointer
        bg-gray-800
        bg-opacity-70
        hover:bg-gray-700
        transition
        rounded-xl
        flex
        items-center
        gap-4
        px-4
        py-4
        h-auto
        min-h-[150px]
        sm:min-h-[170px]
        lg:min-h-[180px]
        xl:min-h-[190px]
        overflow-hidden
        ${selected ? 'ring-2 ring-purple-400' : ''}
      `}
    >
      <img
        src={image}
        alt={name}
        className="
          w-20
          h-20
          sm:w-24
          sm:h-24
          lg:w-28
          lg:h-28
          rounded-full
          object-cover
          flex-shrink-0
        "
      />
      <div
        className="
          text-left
          flex
          flex-col
          justify-center
          overflow-hidden
        "
      >
        <h3 className="
          font-bold
          text-base
          sm:text-lg
          lg:text-xl
          leading-tight
          mb-1
          break-words
        ">
          {name}
        </h3>
        <p className="text-sm sm:text-base text-green-300 mb-1 break-words">
          + {strengths}
        </p>
        <p className="text-sm sm:text-base text-red-300 break-words">
          − {weaknesses}
        </p>
      </div>
    </div>
  );
};

export default BotCard;
