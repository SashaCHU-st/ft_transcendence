import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../types/api";
import { useNavigate } from "react-router-dom";

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<{ user_id: string; username: string }[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [redirectToGame, setRedirectToGame] = useState<{ friendId: string } | null>(null);
  const [declinedChallenge, setDeclinedChallenge] = useState<string | null>(null);

  const notificationsRef = useRef(notifications);
  const navigate = useNavigate();
 
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
  setIsNotificationModalOpen(true);
}, []);

  const checkNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.post("/notification", { user_id: userId });
      const data = res.data;

   	console.log("Backend notifications:", data.notification);
		
		if (data.notification && Array.isArray(data.notification)) {
        // Extract unique new notifications by friends_id
        const newNotifications = data.notification.filter((notif: any) => {
			console.log("Notif userId: ", notif.user_id);
          return !notificationsRef.current.some(n => n.user_id === notif.user_id);
        }).map((notif: any) => ({
          user_id: notif.user_id,
          username: notif.username
        }));

        if (newNotifications.length > 0) {
          setNotifications(prev => [...prev, ...newNotifications]);
          setIsNotificationModalOpen(true);
        }
      }

        if (data.acceptedUsers && Array.isArray(data.acceptedUsers)) {
        const accepted = data.acceptedUsers.find((ch: any) =>
          //String(ch.friends_id) === userId // I'm the one who sent the challenge
        String(ch.user_id) === userId && ch.ok === 0
        );
        
        if (accepted && !redirectToGame) {
          console.log("✅ Your challenge was accepted by:", accepted.username);
          // console.log("All info of accepted: ", accepted);
          console.log("Accepted Friends Id: ",accepted.friends_id);
          
          setRedirectToGame({ friendId: String(accepted.friends_id) });
          navigate("/pong?mode=remote2p");
        }

        if (data.notAcceptedUsers && Array.isArray(data.notAcceptedUsers)) {
        const declined = data.notAcceptedUsers.find((ch: any) => 
          String(ch.user_id) === userId && ch.ok === 0
        );

        if (declined) {
          setDeclinedChallenge(declined.partner?.username || 'Unknown');
          setIsNotificationModalOpen(true); // or show a separate modal
        }
      }
    }

    } catch (err) {
      console.error("Notification check failed:", err);
    }
  }, [userId]);

   useEffect(() => {
    if (!userId) 
      return;

    // Check immediately on mount
    checkNotifications();

    // Poll every 10 seconds
    const interval = setInterval(() => {
      checkNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [userId, checkNotifications]);

  const handleAcceptChallenge = useCallback(async (friendId: string) => {
    if (!userId) return;
    try {
      const res = await api.post("/acceptRequest", {
        user_id: userId,
        friends_id: friendId,
      });
      if (res.data?.challenge_id) {
        localStorage.setItem("challenge_id", String(res.data.challenge_id));
      }
      toast.success("Challenge accepted!");
      navigate("/pong?mode=remote2p");
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setNotifications(prev => prev.filter(n => n.user_id !== friendId));
      if (notifications.length <= 1) setIsNotificationModalOpen(false);
    }
  }, [userId, notifications, navigate]);

  const handleDeclineChallenge = useCallback(async (friendId: string) => {
    if (!userId) return;
    try {
      await api.post("/declineRequest", {
        user_id: userId,
        friends_id: friendId,
      });
      toast.success("Challenge declined.");
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setNotifications(prev => prev.filter(n => n.user_id !== friendId));
      if (notifications.length <= 1) setIsNotificationModalOpen(false);
    }
  }, [userId, notifications]);

  return {
    notifications,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    checkNotifications,
    handleAcceptChallenge,
    handleDeclineChallenge,
    redirectToGame,
    setRedirectToGame,
    declinedChallenge,
    setDeclinedChallenge
  };
}
