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
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
  setIsNotificationModalOpen(true);
}, []);
  const navigate = useNavigate();

  const checkNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.post("/notification", { user_id: userId });
      const data = res.data;

	  	if (data.notification && Array.isArray(data.notification)) {
        const newNotifications = data.notification.filter((notif: any) => {
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
            String(ch.user_id) === userId && ch.ok === 0
          );
          
        if (accepted && !redirectToGame) {
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
    checkNotifications();

    const interval = setInterval(() => {
      checkNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, [userId, checkNotifications]);

  const handleAcceptChallenge = useCallback(async (friendId: string) => {
    if (!userId) return;
    try {
      await api.post("/acceptRequest", {
        user_id: userId,
        friends_id: friendId,
      });
      navigate("/pong?mode=remote2p");
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setNotifications(prev => prev.filter(n => n.user_id !== friendId));
      if (notifications.length <= 1) setIsNotificationModalOpen(false);
    }
  }, [userId, notifications.length]);

  const handleDeclineChallenge = useCallback(async (friendId: string) => {
    if (!userId) return;
    try {
      await api.post("/declineRequest", {
        user_id: userId,
        friends_id: friendId,
      });
    } catch (err: any) {
      console.error(err);
      throw err;
    } finally {
      setNotifications(prev => prev.filter(n => n.user_id !== friendId));
      if (notifications.length <= 1) setIsNotificationModalOpen(false);
    }
  }, [userId, notifications.length]);

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
