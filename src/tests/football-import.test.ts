import test from "node:test";
import assert from "node:assert/strict";
import { importFinishedMatch } from "../sources/football/import.js";
import { draftFinishedMatch } from "../editorial/football-draft.js";

const sample = {
  source: "fotball.no", sourceId: "8985491",
  sourceUrl: "https://www.fotball.no/fotballdata/kamp/?fiksId=8985491",
  observedAt: "2026-09-27T10:30:00Z", kickoff: "2026-09-25T17:00:00Z",
  status: "finished", homeTeam: "Bremnes", awayTeam: "Viggo", homeScore: 2, awayScore: 2
};

test("stable finished event and factual review draft", () => {
  const event = importFinishedMatch(sample);
  assert.equal(event.id, "football:fotball.no:8985491:finished");
  assert.equal(event.occurredAt, sample.observedAt);
  assert.equal(event.verificationStatus, "unverified");
  assert.equal(draftFinishedMatch(event).status, "review");
  assert.match(draftFinishedMatch(event).body, /2–2/);
});

test("score alone cannot establish finished status", () => {
  assert.throws(() => importFinishedMatch({ ...sample, status: "live" }), /eksplisitt finished/);
  assert.throws(() => importFinishedMatch({ ...sample, sourceUrl: "https://example.org/" }), /Kilde-URL/);
  assert.throws(() => importFinishedMatch({ ...sample, homeScore: null }), /Ugyldig homeScore/);
});
