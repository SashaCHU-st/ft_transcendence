import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../types/api";

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<{ user_id: string; username: string }[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const notificationsRef = useRef(notifications);
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

    //   if (data.notification && Array.isArray(data.notification)) {
    //     const newNotifications = data.notification.filter(
    //       (notif: any) =>
    //         !notificationsRef.current.some(n => n.user_id === notif.user_id)
    //     ).map((notif: any) => ({
    //       user_id: notif.user_id,
    //       username: notif.username
    //     }));
	  console.log("Existing notifications:", notificationsRef.current);
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
    } catch (err) {
      console.error("Notification check failed:", err);
    }
  }, [userId]);
  console.log("Notification length: ", notifications.length);

   useEffect(() => {
    if (!userId) return;

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
      await api.post("/acceptRequest", {
        user_id: userId,
        friends_id: friendId,
      });
      toast.success("Challenge accepted!");
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
      toast.success("Challenge declined.");
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
  };
}
