import test from "node:test";
import assert from "node:assert/strict";
import { editorialPrompt } from "../editorial/editorial-rules.js";
import { reviewArticle, type VerifiedMatchFacts } from "../editorial/quality-gate.js";

const facts: VerifiedMatchFacts = {
  homeTeam: "Bremnes", awayTeam: "Viggo", matchDate: "25. september 2026",
  homeGoals: 2, awayGoals: 1, status: "finished",
  names: ["Ola Olsen", "Per Pedersen"],
  substitutions: [{ playerIn: "Ola Olsen", playerOut: "Per Pedersen" }]
};
const good = {
  title: "Bremnes slo Viggo 2–1",
  body: "25. september 2026: Ola Olsen kom inn for Per Pedersen. Som det framgår av kampdataene, vant Bremnes 2–1 over Viggo."
};

test("reglene sendes til språkvask og godkjent tekst får versjon", async () => {
  const result = await reviewArticle(good, facts, async ({ instructions }) => {
    assert.match(instructions, /spillerbytter/);
    assert.match(editorialPrompt(), /Som det framgår av/);
    return good;
  });
  assert.equal(result.publishable, true);
  assert.equal(result.rulesVersion, "1.0.0");
});

test("tvetydig spillerbytte og feil resultat stopper publisering", async () => {
  const result = await reviewArticle(good, facts, async () => ({
    title: "Bremnes slo Viggo 3–1", body: "25. september 2026: Ola Olsen erstattet Per Pedersen. Bremnes slo Viggo 3–1."
  }));
  assert.equal(result.publishable, false);
  assert.match(result.findings.join(" "), /sluttresultat/);
  assert.match(result.findings.join(" "), /spillerbytte/);
});

test("språkvaskfeil og uferdig kamp får ingen publiseringsklar tekst", async () => {
  await assert.rejects(reviewArticle(good, facts, async () => { throw new Error("API-feil"); }), /API-feil/);
  await assert.rejects(reviewArticle(good, { ...facts, status: "live" as "finished" }, async () => good), /ferdigspilt/);
});
