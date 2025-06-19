import React from "react";
//import Avatar from "./Avatar";

interface Notification{
	user_id: string;
	username: string;
	//avatar: string;
};

interface NotificationModalProps{
	notifications: Notification[];
	onAccept: (userId: string) => void;
	onDecline: (userId: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
	notifications,
	onAccept,
	onDecline,
}) => {
	if (!notifications.length)
		return null;
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-xl p-6 text-center text-black w-full max-w-md max-h-[80vh] overflow-y-auto space-y-6">
				<h2 className="text-lg text-indigo-950 font-orbitron font-bold mb-4">
				CHALLENGE REQUESTS
				</h2>
				{notifications.map((notif) => (
				<div
					key={notif.user_id}
					className="border border-indigo-200 rounded-lg p-4 bg-white shadow"
				>
					<div className="flex justify-center gap-2">
						{/* <Avatar
							user={{ avatar: notif.avatar || "/prof_img/avatar1.png", username: notif.username }}
							className="w-10 h-10"
						/>	 */}
						<p className="mb-4 font-orbitron">
						{notif.username} has challenged you to a game!
						</p>
					</div>
					<div className="flex justify-center gap-2">
					<button
						onClick={() => onDecline(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-pink-700 text-white rounded hover:bg-pink-500"
					>
						DECLINE
					</button>
					<button
						onClick={() => onAccept(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-emerald-600 text-white rounded hover:bg-emerald-500"
					>
						ACCEPT
					</button>
					</div>
				</div>
				))}
			</div>
    	</div>
	);
};

export default NotificationModal;