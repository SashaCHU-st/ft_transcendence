import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import api from '../types/api';
import { getAuthHeaders } from '../types/api';
import { UserInfo} from '../types/UserInfo';

const isValidBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

export type FriendRequest = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
};

export function useUserData() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const [chatList, setChatList] = useState<UserInfo[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [declinedFriendRequest, setDeclinedFriendRequest] = useState<string[] | null>(null);
 
  const authHeaders = useMemo(() => getAuthHeaders(), []);
  
  const fetchAllUsers = useCallback(async () => {
    try {
      const currentUserId = localStorage.getItem("id");
      if (!currentUserId) 
		    return;

      const { data } = await api.get(`/users?t=${Date.now()}`, {
        headers: authHeaders,
      });
      
      let currentUser: UserInfo | null = null;

      const mappedUsers: UserInfo[] = data.users.map((u: any) => {
        let avatar = "/prof_img/avatar1.png";
        if (u.image) {
          	if (typeof u.image === "string" && isValidBase64(u.image)) {
            avatar = `data:image/jpeg;base64,${u.image}`;
         	 } else if (u.image?.data) {
			const dataArray = u.image.data;
			let binary = "";
			for (let i = 0; i < dataArray.length; i++) {
				binary += String.fromCharCode(dataArray[i]);
      		}
      		avatar = `data:image/jpeg;base64,${btoa(binary)}`;
          }
        };

        const userInfo: UserInfo = {
          id: String(u.id),
          username: u.username || "Unknown",
          avatar,
          email: u.email || "",
          name: u.name || "",
          password: "",
          wins: u.wins || 0,
          losses: u.losses || 0,
          online: !!u.online,
          history: [],
        };

        if (userInfo.id === currentUserId) 
			currentUser = userInfo;

        return userInfo;
      });

      const friendsRes = await api.post("/myfriends", { user_id: currentUserId });
      const confirmedFriendIds = friendsRes.data.myfriends.map((f: any) =>
        f.user_id === Number(currentUserId) ? f.friends_id : f.user_id
      );

      const confirmedFriends = mappedUsers.filter((u) =>
        confirmedFriendIds.includes(Number(u.id))
      );

      const playersList = mappedUsers
        .filter((u) => u.id !== currentUserId)
        .filter((u) => !confirmedFriendIds.includes(Number(u.id)))
        .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1));

      const chatList = mappedUsers
        .filter((u) => u.id !== currentUserId)
        .sort((a, b) => (a.online === b.online ? 0 : a.online ? -1 : 1));

      setUser(currentUser);
      setFriends(confirmedFriends);
      setPlayers(playersList);
      setChatList(chatList);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      toast.error(err.message || "Failed to load users.");
    }
  }, [authHeaders]);


const fetchFriendRequests = useCallback(async () => {
  try {
    const user_id = localStorage.getItem('id');
    if (!user_id) 
      return [];

    const { data } = await api.post('/request', { user_id });

    let requests: FriendRequest[] = [];

    if (data.checkRequest) {
      requests = data.checkRequest.map((u: any) => {
        let avatar = '/prof_img/avatar1.png';
        if (u.image) {
          if (typeof u.image === 'string' && isValidBase64(u.image)) {
            avatar = `data:image/jpeg;base64,${u.image}`;
          } else if (u.image?.data) {
            const binary = String.fromCharCode(...u.image.data);
            avatar = `data:image/jpeg;base64,${btoa(binary)}`;
          }
        }
        return {
          id: String(u.id),
          username: u.username || 'Unknown',
          avatar,
          online: !!u.online,
        };
      });
    }

    const notifRes = await api.post('/notificationFriend', { user_id });
    const declinedUsernames = notifRes.data.usernamesDeclined?.map((d: any) => d.username) || [];

    const filtered = requests.filter(req => !declinedUsernames.includes(req.username));
    setFriendRequests(filtered);
    if (declinedUsernames.length > 0) {
      setDeclinedFriendRequest(declinedUsernames);
    }
    return filtered;
  } catch (err: any) {
    console.error('Failed to fetch friend requests:', err);
    return [];
  }
}, []);

  return {
    user,
    friends,
    players,
    chatList,
    fetchAllUsers,
    fetchFriendRequests,
    setFriends,
    setPlayers,
    setChatList,
    setUser,
    friendRequests,
    setFriendRequests,
    declinedFriendRequest,
    setDeclinedFriendRequest  
  };
}
