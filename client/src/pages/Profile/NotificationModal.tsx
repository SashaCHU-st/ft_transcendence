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
			<div className="bg-white rounded-xl p-6 text-center text-black w-full max-w-md max-h-[80vh] overflow-y-auto space-y-6">
				<h2 className="text-lg text-indigo-950 font-orbitron font-bold mb-4">
				CHALLENGE REQUESTS
				</h2>
				{notifications.map((notif) => (
				<div
					key={notif.user_id}
					className="border border-indigo-200 rounded-lg p-4 bg-white shadow"
				>
					<p className="mb-4 font-orbitron">
					{notif.username} ({notif.user_id}) has challenged you to a game!
					</p>
					<div className="flex justify-center gap-2">
					<button
						onClick={() => onDecline(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
					>
						DECLINE
					</button>
					<button
						onClick={() => onAccept(notif.user_id)}
						className="px-4 py-2 font-orbitron bg-green-500 text-white rounded hover:bg-green-600"
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