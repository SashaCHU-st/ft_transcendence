import React from "react";
import { FriendRequest } from "../../../types/UserInfo";

interface FriendRequestListProps {
  requests: FriendRequest[];
  onConfirm: (username: string) => void;
  onDecline: (username: string) => void;
}

const FriendRequestList: React.FC<FriendRequestListProps> = ({
  requests,
  onConfirm,
  onDecline,
  
}) => {
  
  return (
    <div className="p-8 ">
      <div className="bg-opacity-20 bg-purple-500 w-80 rounded-md">
        <h2 className="text-md xl:text-lg  font-orbitron text-purple-200 mb-4 text-center tracking-[.20em]">
          FRIEND REQUESTS
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No friend requests</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded-md bg-gray-800 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={req.avatar}
                    alt={req.username}
                    className="w-8 h-8 rounded-full border"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      req.online ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{req.username}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onConfirm(req.username)}
                   className="px-2 py-1 text-sm bg-emerald-700 text-white border border-emerald-400 rounded hover:bg-emerald-500 hover:text-white"
                  >
                  ACCEPT
                </button>
                <button
                  onClick={() => onDecline(req.username)}
                  className="px-2 py-1 text-sm text-white border bg-pink-700 border-pink-400 rounded hover:bg-pink-500 hover:text-white"
                >
                  DECLINE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequestList;
