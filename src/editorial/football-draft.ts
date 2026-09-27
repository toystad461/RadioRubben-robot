import type { RREvent } from "../core/events.js";
import type { FinishedMatchFacts } from "../sources/football/import.js";

export interface EditorialDraft {
  id: string;
  eventId: string;
  status: "review";
  title: string;
  body: string;
  sourceUrl: string;
  notes: string[];
}

export function draftFinishedMatch(event: RREvent<FinishedMatchFacts>): EditorialDraft {
  if (event.type !== "football.match.finished") throw new Error("Krever ferdig kamp.");
  const { match } = event.facts;
  if (match.score.home === null || match.score.away === null) throw new Error("Mangler resultat.");
  const result = `${match.score.home}–${match.score.away}`;
  const venue = match.venue ? ` på ${match.venue}` : "";
  return {
    id: `draft:${event.id}`,
    eventId: event.id,
    status: "review",
    title: `${match.homeTeam.name}–${match.awayTeam.name} ${result}`,
    body: `${match.homeTeam.name} og ${match.awayTeam.name} spilte ${result}${venue}. Kampen er registrert som slutt hos Fotball.no.`,
    sourceUrl: event.source.url ?? "",
    notes: ["Kontroller resultat og kampstatus mot kilden før publisering.", "Ingen hendelser, sitater eller kampforløp er importert."]
  };
}
