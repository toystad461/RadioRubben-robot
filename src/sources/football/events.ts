import type { RREvent } from "../../core/events.js";
import type { FootballMatch } from "./types.js";

export interface FootballMatchFacts extends Record<string, unknown> {
  match: FootballMatch;
}

export function createFootballMatchEvent(
  match: FootballMatch,
  sourceName: string,
  fetchedAt: string
): RREvent<FootballMatchFacts> {
  const createdAt = new Date().toISOString();

  return {
    id: `football:${match.sourceId}:${match.status}`,
    type: `football.match.${match.status}`,
    occurredAt: match.kickoff,
    createdAt,
    source: {
      name: sourceName,
      url: match.sourceUrl,
      fetchedAt
    },
    localRelevance: [],
    entities: [match.homeTeam.name, match.awayTeam.name],
    facts: { match },
    verificationStatus: "unverified",
    editorialStatus: "new"
  };
}
