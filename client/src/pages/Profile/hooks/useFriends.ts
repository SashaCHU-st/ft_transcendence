import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { UserInfo } from "../types/UserInfo";

/* ------------------------------------------------------------------ *
 * mapUser – converts a raw DB record into our strongly typed
 *           UserInfo object (without any “action” callbacks).
 * ------------------------------------------------------------------ */
const mapUser = (u: any): UserInfo => ({
  id: String(u.id),
  username: u.username || u.name || "Unknown",
  email:    u.email    || "",
  name:     u.name     || "",
  avatar:
    u.image && u.image_type
      ? `data:${u.image_type};base64,${u.image}`   // inline base64 from DB
      : "/prof_img/avatar1.png",                   // fallback avatar
  password: "",                                    // never expose
  wins:     u.wins   || 0,
  losses:   u.losses || 0,
  online:   !!u.online,
  history:  [],
});

/* Helper that pushes ONLINE users to the top of the list               */
const sortByOnline = (a: UserInfo, b: UserInfo) =>
  Number(b.online) - Number(a.online);

/* ====================================================================== */
/*  Main hook – returns two lists (friends / other players)               */
/*  plus helper callbacks to mutate and re-sync them.                     */
/* ====================================================================== */
export const useFriends = (
  user: UserInfo | null,
  headers: Record<string, string>
) => {
  /* ------------------------------------------------------------------ */
  /*  Local state                                                        */
  /* ------------------------------------------------------------------ */
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);

  /* Decorators that inject correct “remove / add” handlers ------------- */
  const withRemove = (u: UserInfo): UserInfo => ({
    ...u,
    onRemove: () => removeFriend(u),
    onAdd:    undefined,
  });
  const withAdd = (u: UserInfo): UserInfo => ({
    ...u,
    onAdd:    () => addFriend(u),
    onRemove: undefined,
  });

  /* ------------------------------------------------------------------ */
  /*  Network helpers (pure data fetchers, no state mutation)            */
  /* ------------------------------------------------------------------ */

  /** GET all confirmed friends */
  const loadFriends = useCallback(async (): Promise<UserInfo[]> => {
    if (!user) return [];

    const res  = await fetch("http://localhost:3000/myfriends", {
      method : "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body   : JSON.stringify({ user_id: Number(user.id) }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to load friends");
      return [];
    }
    return (data.myfriends || []).map(mapUser);
  }, [user, headers]);

  /** GET everyone except *me* (friends will be filtered out later) */
  const loadAllUsers = useCallback(async (): Promise<UserInfo[]> => {
    if (!user) return [];

    const res  = await fetch(`http://localhost:3000/users?t=${Date.now()}`, {
      headers: { "Content-Type": "application/json", ...headers },
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to load players");
      return [];
    }
    return (data.users || [])
      .filter((u: any) => u.id !== user.id) // exclude myself
      .map(mapUser);
  }, [user, headers]);

  /* ------------------------------------------------------------------ */
  /*  Mutations (POST / DELETE)                                          */
  /* ------------------------------------------------------------------ */

  /** Add `target` to my friend list, then refresh both lists */
  const addFriend = useCallback(
    async (target: UserInfo) => {
      if (!user) return;

      const res = await fetch("http://localhost:3000/addFriends", {
        method : "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body   : JSON.stringify({ user_id: Number(user.id), username: target.username }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add friend");
        return;
      }

      toast.success(`Added ${target.username}`);
      await syncAll();
    },
    [user, headers]
  );

  /** Remove `target` from my friend list, then refresh both lists */
  const removeFriend = useCallback(
    async (target: UserInfo) => {
      if (!user) return;

      const res = await fetch("http://localhost:3000/deletefriend", {
        method : "DELETE",
        headers: { "Content-Type": "application/json", ...headers },
        body   : JSON.stringify({ user_id: Number(user.id), username: target.username }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to remove friend");
        return;
      }

      toast.success(`Removed ${target.username}`);
      await syncAll();
    },
    [user, headers]
  );

  /* ------------------------------------------------------------------ */
  /*  syncAll – keeps `friends` and `players` in lock-step               */
  /* ------------------------------------------------------------------ */
  const syncAll = useCallback(async () => {
    if (!user) return;

    /* 1️⃣  Friends (sorted with online users first) */
    const friendArr = (await loadFriends()).sort(sortByOnline);
    setFriends(friendArr.map(withRemove));

    /* 2️⃣  Players = everyone else minus friends (+ me) */
    const allUsers   = await loadAllUsers();
    const friendIds  = new Set(friendArr.map((f: UserInfo) => f.id));
    const playersArr = allUsers
      .filter((u: UserInfo) => !friendIds.has(u.id))
      .sort(sortByOnline);

    setPlayers(playersArr.map(withAdd));
  }, [user, loadFriends, loadAllUsers]);

  /* ------------------------------------------------------------------ */
  /*  Public API returned by the hook                                   */
  /* ------------------------------------------------------------------ */
  return {
    friends,       // always sorted: online → offline
    players,       // idem
    addFriend,     // call to send POST /addFriends
    removeFriend,  // call to send DELETE /deletefriend
    syncAll,       // manual full refresh
  } as const;
};
