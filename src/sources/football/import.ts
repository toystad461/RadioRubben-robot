import type { RREvent } from "../../core/events.js";
import type { FootballMatch } from "./types.js";

export interface ReviewedMatchSnapshot {
  source: "fotball.no";
  sourceId: string;
  sourceUrl: string;
  observedAt: string;
  status: "finished";
  kickoff: string;
  competition?: string;
  venue?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface FinishedMatchFacts extends Record<string, unknown> {
  match: FootballMatch;
  statusObservedAt: string;
  statusEvidence: "explicit_finished_status";
  importMethod: "reviewed_snapshot";
}

const validDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value)) &&
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(value);

export function importFinishedMatch(raw: unknown): RREvent<FinishedMatchFacts> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Snapshot må være et objekt.");
  const data = raw as Record<string, unknown>;
  if (data.source !== "fotball.no" || data.status !== "finished")
    throw new Error("Kilden må være fotball.no og kampstatus eksplisitt finished.");
  if (typeof data.sourceId !== "string" || !/^\d{5,12}$/.test(data.sourceId))
    throw new Error("Ugyldig FIKS-ID.");
  const canonicalUrl = `https://www.fotball.no/fotballdata/kamp/?fiksId=${data.sourceId}`;
  if (data.sourceUrl !== canonicalUrl) throw new Error("Kilde-URL må stemme med FIKS-ID.");
  if (!validDate(data.observedAt) || !validDate(data.kickoff)) throw new Error("Ugyldig tidspunkt.");
  if (Date.parse(data.observedAt) < Date.parse(data.kickoff)) throw new Error("Sluttstatus kan ikke observeres før kampstart.");
  for (const key of ["homeTeam", "awayTeam"] as const) {
    if (typeof data[key] !== "string" || !data[key].trim()) throw new Error(`Mangler ${key}.`);
  }
  for (const key of ["homeScore", "awayScore"] as const) {
    if (!Number.isSafeInteger(data[key]) || (data[key] as number) < 0)
      throw new Error(`Ugyldig ${key}.`);
  }
  const match: FootballMatch = {
    sourceId: data.sourceId,
    kickoff: data.kickoff,
    homeTeam: { name: (data.homeTeam as string).trim() },
    awayTeam: { name: (data.awayTeam as string).trim() },
    score: { home: data.homeScore as number, away: data.awayScore as number },
    status: "finished",
    sourceUrl: canonicalUrl
  };
  if (typeof data.competition === "string" && data.competition.trim()) match.competition = data.competition.trim();
  if (typeof data.venue === "string" && data.venue.trim()) match.venue = data.venue.trim();
  return {
    id: `football:fotball.no:${match.sourceId}:finished`,
    type: "football.match.finished",
    // Actual final whistle time is unknown; this is when finished status was observed.
    occurredAt: data.observedAt,
    createdAt: new Date().toISOString(),
    source: { name: "fotball.no", url: canonicalUrl, fetchedAt: data.observedAt },
    localRelevance: match.homeTeam.name === "Bremnes" || match.awayTeam.name === "Bremnes" ? ["Bømlo"] : [],
    entities: [match.homeTeam.name, match.awayTeam.name],
    facts: { match, statusObservedAt: data.observedAt, statusEvidence: "explicit_finished_status", importMethod: "reviewed_snapshot" },
    verificationStatus: "unverified",
    editorialStatus: "review"
  };
}
