
// import React, { useEffect, useState } from 'react';
// import { UserInfo } from './types/UserInfo';

// interface AvatarProps {
//   user: Pick<UserInfo, "avatar" | "username">;
//   className?: string;
// }

// const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
//   const [imgSrc, setImgSrc] = useState<string>("/prof_img/avatar1.png");
//   const [isImageLoaded, setIsImageLoaded] = useState(true);

//   useEffect(() => {
//     console.log(`Avatar for ${user.username}: ${user.avatar}`);
//     if (!user.avatar || !user.avatar.startsWith("data:image/")) {
//       console.warn(`Invalid avatar format for ${user.username}: ${user.avatar}`);
//       setImgSrc("/prof_img/avatar1.png");
//       setIsImageLoaded(false);
//     } else {
//       setImgSrc(user.avatar);
//       setIsImageLoaded(true);
//     }
//   }, [user.avatar, user.username]);

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className={`
//           rounded-full border-2 border-white overflow-hidden
//           flex items-center justify-center bg-gray-800 text-white text-center ${className}`}
//       >
//         {isImageLoaded ? (
//           <img
//             src={imgSrc}
//             alt={user.username}
//             className="w-full h-full object-cover"
//             onError={() => {
//               console.log(`Failed to load image for ${user.username}, using fallback`);
//               setImgSrc("/prof_img/avatar1.png");
//               setIsImageLoaded(false);
//             }}
//           />
//         ) : (
//           <span className="text-sm font-semibold px-2">{user.username}</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Avatar;


import React, { useEffect, useState } from 'react';
import { UserInfo } from './types/UserInfo';

interface AvatarProps {
  user: Pick<UserInfo, "avatar" | "username">;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className }) => {
  const [imgSrc, setImgSrc] = useState<string>("/prof_img/avatar1.png");
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  useEffect(() => {
    console.log(`Avatar for ${user.username}: ${user.avatar}`);
    if (!user.avatar || !user.avatar.startsWith("data:image/")) {
      console.warn(`Invalid avatar format for ${user.username}: ${user.avatar}`);
      setImgSrc("/prof_img/avatar1.png");
      setIsImageLoaded(false);
    } else {
      setImgSrc(user.avatar);
      setIsImageLoaded(true);
    }
  }, [user.avatar, user.username]);

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
        {/* Conditional rendering based on image loading status */}
        {isImageLoaded ? (
          <img
            src={imgSrc}
            alt={user.username}
            className="
              w-full
              h-full
              object-cover
            "
            onError={() => {
              console.log(`Failed to load image for ${user.username}, using fallback`);
              setImgSrc("/prof_img/avatar1.png");
              setIsImageLoaded(false);
            }}
          />
        ) : (
          <span className="
            text-sm
            font-semibold
            px-2
          ">{user.username}</span>
        )}
      </div>
    </div>
  );
};

export default Avatar;