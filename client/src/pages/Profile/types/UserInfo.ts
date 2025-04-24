export type MatchResult = {
	date: string;         // например: '2025-04-24'
	weekday: string;      // например: 'Thu'
	result: 'win' | 'loss';
  };
  
  export type UserInfo = {
	username: string;
	avatar: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	wins: number;
	losses: number;
	online: boolean;
	history: MatchResult[];
  };
  