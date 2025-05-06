import React, { useState } from "react";
import { UserInfo } from "./types/UserInfo";
import { toast } from "react-hot-toast";

interface ProfileModalProps {
	onClose: () => void;
	onSave: (data: Partial<UserInfo>) => void;
	userData: Pick<UserInfo, "avatar" | "username" | "name">;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
	onClose,
	onSave,
	userData,
}) => {
	const [avatar, setAvatar] = useState(userData.avatar);
	const [username, setUsername] = useState(userData.username);
	const [name] = useState(userData.name); // Read-only, не обновляется
	const [password, setPassword] = useState("");

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB max

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			toast.error("File is too big! Max size: 10 MB.");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatar(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleSave = () => {
		console.log("Saving data:", { avatar, username, name, password }); // Отладка
		onSave({ avatar, username, name, password });
	};

	return (
		<div
			className={`
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black
        bg-opacity-60
      `}
		/* Modal overlay: Creates a centered, full-screen backdrop with semi-transparent background */
		>
			<div
				className={`
          bg-gray-900
          text-white
          rounded-xl
          p-6
          w-full
          max-w-md
          space-y-4
          shadow-2xl
        `}
			/* Modal content: Styles the modal window with a dark background and shadow */
			>
				<h2
					className={`
            text-2xl
            font-bold
            text-center
          `}
				/* Modal title: Centers the heading for the edit profile form */
				>
					Edit Profile
				</h2>

				<div
					className={`
            flex
            flex-col
            items-center
            gap-2
          `}
				/* Avatar section: Centers the avatar image and file input vertically */
				>
					<img
						src={avatar}
						alt="Avatar"
						className={`
              w-24
              h-24
              rounded-full
              object-cover
              border-2
              border-white
            `}
					/* Avatar image: Displays a circular avatar with a white border */
					/>
					<input
						type="file"
						accept="image/jpeg,image/png"
						onChange={handleAvatarChange}
						className={`
              text-sm
              text-gray-300
            `}
					/* File input: Styles the file input for avatar uploads */
					/>
				</div>

				<div
					className={`
            flex
            flex-col
            gap-1
          `}
				/* Name field container: Groups the name label and read-only input */
				>
					<label
						className={`
              text-sm
              text-gray-400
            `}
					/* Name label: Styles the label for the name input */
					>
						Name
					</label>
					<input
						type="text"
						value={name}
						readOnly
						className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
              text-gray-400
              cursor-not-allowed
            `}
					/* Name input: Styles the read-only name input with disabled cursor */
					/>
				</div>

				<div
					className={`
            flex
            flex-col
            gap-1
          `}
				/* Username field container: Groups the username label and input */
				>
					<label
						className={`
              text-sm
              text-gray-400
            `}
					/* Username label: Styles the label for the username input */
					>
						Username
					</label>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
            `}
					/* Username input: Styles the editable username input */
					/>
				</div>

				<div
					className={`
            flex
            flex-col
            gap-1
          `}
				/* Password field container: Groups the password label and input */
				>
					<label
						className={`
              text-sm
              text-gray-400
            `}
					/* Password label: Styles the label for the password input */
					>
						New Password
					</label>
					<input
						type="password"
						placeholder="New Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
            `}
					/* Password input: Styles the editable password input */
					/>
				</div>

				<div
					className={`
            flex
            justify-end
            gap-3
            pt-4
          `}
				/* Button group: Aligns the cancel and save buttons to the right */
				>
					<button
						onClick={onClose}
						className={`
              px-4
              py-2
              bg-gray-600
              hover:bg-gray-700
              rounded
            `}
					/* Cancel button: Styles the cancel button with hover effect */
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className={`
              px-4
              py-2
              bg-green-500
              hover:bg-green-600
              text-white
              rounded
            `}
					/* Save button: Styles the save button with hover effect */
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;