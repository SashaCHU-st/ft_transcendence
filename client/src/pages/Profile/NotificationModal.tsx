import React from "react";

interface Notification{
	user_id: string;
	username: string;
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
			<div className="bg-gray-800  bg-opacity-70 rounded-xl border border-blue-500 p-6 
							shadow-[0_0_15px_#60a5fa] text-center text-blue-200 w-full max-w-md max-h-[80vh] 
							overflow-y-auto space-y-6">
				<h2 className="text-xl text-blue-500 font-orbitron font-bold mb-4">
				CHALLENGE REQUESTS
				</h2>
				{notifications.map((notif) => (
				<div
					key={notif.user_id}
					className="border border-blue-200 rounded-lg p-4 bg-gray shadow"
				>
					<div className="flex justify-center gap-2">
						<p className="mb-4 font-orbitron text-lg">
						{notif.username} has challenged you to a game!
						</p>
					</div>
					<div className="flex justify-center gap-2">
					<button
						onClick={() => onAccept(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-emerald-600 text-white rounded hover:bg-emerald-500"
					>
						ACCEPT
					</button>
					<button
						onClick={() => onDecline(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-pink-700 text-white rounded hover:bg-pink-500"
					>
						DECLINE
					</button>
					</div>
				</div>
				))}
			</div>
    	</div>
	);
};

export default NotificationModal;