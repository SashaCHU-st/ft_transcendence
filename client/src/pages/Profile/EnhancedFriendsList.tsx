// import React, { useState } from "react";
// import { UserInfo } from "./types/UserInfo";
// import PlayerCard from "./PlayerCard";
// import { CardWrapper } from "./types/ui";

// interface Props {
// 	friends: UserInfo[];
// }

// const EnhancedFriendsList: React.FC<Props> = ({ friends }) => {
// 	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

// 	const toggleExpand = (index: number) => {
// 		setExpandedIndex((prev) => (prev === index ? null : index));
// 	};

// 	return (
// 		<div
// 			className={`
//         flex
//         flex-col
//         gap-2
//         overflow-y-auto
//         max-h-[500px]
//         pr-1
//         scrollbar-thin
//         scrollbar-thumb-white/60
//         scrollbar-track-transparent
//       `}
// 		/* Main container: Displays a scrollable list of friends with a fixed maximum height */
// 		>
// 			{friends.map((friend, index) => {
// 				const isExpanded = expandedIndex === index;

// 				return (
// 					<CardWrapper key={index} onClick={() => toggleExpand(index)}>
// 						<div
// 							className={`
//                 flex
//                 justify-between
//                 items-center
//               `}
// 						/* Friend header: Aligns username and online status horizontally */
// 						>
// 							<div
// 								className={`
//                   font-bold
//                   text-base
//                 `}
// 							/* Username: Styles the friend’s username with bold text */
// 							>
// 								{friend.username}
// 							</div>
// 							<div
// 								className={`
//                   text-sm
//                   ${friend.online ? "text-green-400" : "text-gray-400"}
//                 `}
// 							/* Online status: Displays online/offline status with color coding */
// 							>
// 								{friend.online ? "Online" : "Offline"}
// 							</div>
// 						</div>
// 						<div
// 							className={`
//                 transition-all
//                 duration-300
//                 overflow-hidden
//                 ${isExpanded ? "max-h-[600px] mt-3" : "max-h-0"}
//               `}
// 						/* Expandable content: Toggles visibility of the player card with smooth animation */
// 						>
// 							<PlayerCard user={friend} />
// 						</div>
// 					</CardWrapper>
// 				);
// 			})}
// 		</div>
// 	);
// };

// export default EnhancedFriendsList;