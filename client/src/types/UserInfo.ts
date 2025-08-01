export type MatchResult = {
	date: string;
	weekday: string;
	result: "win" | "loss";
  };

  export type FriendRequest = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
};
  
  export type UserInfo = {
	id: string;
	username: string;
	avatar: string;
	email: string;
	name: string;
	password: string;
	wins: number;
	losses: number;
	online: boolean;
	history: MatchResult[];
	onRemove?: () => void;
	onChallenge?: () => void;
	onAdd?: () => void;
  };
  
  // *** Block: Calculate User Stats ***
  export const calculateUserStats = (
	wins: number,
	losses: number | string,
	history: MatchResult[] = []
  ) => {
	// calculating the total matches and win rate here.
	const totalMatches = typeof losses === "number" ? wins + losses : 0;
	const winRate = totalMatches ? Math.round((wins / totalMatches) * 100) : 0;
  
	// finding the latest game date by sorting the history in descending order.
	const latestDate = [...history]
	  .sort((a, b) => b.date.localeCompare(a.date))
	  .find(Boolean)?.date;
  
	return {
	  winRate,
	  latestDate,
	};
  };