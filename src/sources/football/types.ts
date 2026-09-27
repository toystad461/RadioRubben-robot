export type FootballMatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled"
  | "unknown";

export interface FootballTeam {
  id?: string;
  name: string;
}

export interface FootballScore {
  home: number | null;
  away: number | null;
}

export interface FootballMatch {
  sourceId: string;
  competition?: string;
  kickoff: string;
  venue?: string;
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
  score: FootballScore;
  status: FootballMatchStatus;
  sourceUrl?: string;
}
