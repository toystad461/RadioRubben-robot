import { EDITORIAL_RULES_VERSION, editorialPrompt } from "./editorial-rules.js";

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
  publishable: boolean;
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
 * Reviews a generated article before any WordPress write. The caller must pass
 * independently verified facts and publish only if publishable is true.
 * A failed or unavailable reviewer blocks publication instead of passing the draft through.
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
  return { article, findings, rulesVersion: EDITORIAL_RULES_VERSION, publishable: findings.length === 0 };
}
