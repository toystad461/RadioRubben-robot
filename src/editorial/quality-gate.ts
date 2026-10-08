import { EDITORIAL_RULES_VERSION, editorialPrompt } from "./editorial-rules.js";
import { createHash } from "node:crypto";

export const AI_POLICY_VERSION = "1.0.0";

export interface VerifiedMatchFacts {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  homeGoals: number;
  awayGoals: number;
  status: "finished";
  names: readonly string[];
  substitutions: readonly { playerIn: string; playerOut: string }[];
}

export interface ArticleDraft {
  title: string;
  body: string;
}

export interface ReviewResult {
  article: ArticleDraft;
  findings: readonly string[];
  rulesVersion: string;
  aiPolicyVersion: string;
  articleSha256: string;
  factsSha256: string;
  readyForEditorialApproval: boolean;
  publishable: false;
}

export type LanguageReviewer = (input: {
  article: ArticleDraft;
  facts: VerifiedMatchFacts;
  instructions: string;
}) => Promise<ArticleDraft>;

function textOf(article: ArticleDraft): string {
  return `${article.title}\n${article.body}`;
}

function check(article: ArticleDraft, facts: VerifiedMatchFacts): string[] {
  const text = textOf(article);
  const findings: string[] = [];
  if (!article.title.trim() || !article.body.trim()) findings.push("Tittel eller brødtekst mangler.");
  if (!text.includes(facts.homeTeam) || !text.includes(facts.awayTeam)) findings.push("Lagnavn mangler eller avviker.");
  if (!text.includes(`${facts.homeGoals}–${facts.awayGoals}`) &&
      !text.includes(`${facts.homeGoals}-${facts.awayGoals}`)) {
    findings.push("Verifisert sluttresultat mangler.");
  }
  if (!text.includes(facts.matchDate)) findings.push("Verifisert kampdato mangler.");
  for (const name of facts.names) {
    if (!text.includes(name)) findings.push(`Verifisert navn mangler: ${name}`);
  }
  for (const substitution of facts.substitutions) {
    const mentions = text.includes(substitution.playerIn) || text.includes(substitution.playerOut);
    if (mentions && !text.includes(`${substitution.playerIn} kom inn for ${substitution.playerOut}`)) {
      findings.push(`Kontroller spillerbytte: ${substitution.playerIn} / ${substitution.playerOut}`);
    }
  }
  if (/Som det framgår av [^.!?\n,]+\s+(?:ble|er|var|har|fikk|kan|vil)\b/iu.test(text)) {
    findings.push("Kontroller komma etter innledende «Som det framgår av …».");
  }
  return findings;
}

/**
 * Technical review only. This repository has no authenticated human approval
 * or publishing boundary. A successful review must never grant publication.
 * Hashes identify reviewed inputs; they do not prove source truth or approval.
 */
export async function reviewArticle(
  draft: ArticleDraft,
  facts: VerifiedMatchFacts,
  reviewer: LanguageReviewer
): Promise<ReviewResult> {
  if (facts.status !== "finished" || !Number.isInteger(facts.homeGoals) ||
      !Number.isInteger(facts.awayGoals) || facts.homeGoals < 0 || facts.awayGoals < 0) {
    throw new Error("Kampdata er ikke verifisert som ferdigspilt.");
  }
  const article = await reviewer({
    article: draft,
    facts,
    instructions: `${editorialPrompt()}\nSpråkvask tittel og brødtekst. Rett tegnsetting, tvetydighet, repetisjoner og unaturlig AI-språk. Kontroller alle spillerbytter mot playerIn/playerOut. Sammenlign navn, dato og resultat med faktagrunnlaget. Returner bare revidert tittel og brødtekst. Ved usikkerhet: behold faktum og la kontrollen stoppe publisering.`
  });
  const findings = check(article, facts);
  const sha256 = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  return { article, findings, rulesVersion: EDITORIAL_RULES_VERSION,
    aiPolicyVersion: AI_POLICY_VERSION, articleSha256: sha256(article), factsSha256: sha256(facts),
    readyForEditorialApproval: findings.length === 0, publishable: false };
}
