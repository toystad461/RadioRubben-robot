export type EditorialStatus =
  | "new"
  | "review"
  | "ready"
  | "published"
  | "archived";

export type VerificationStatus =
  | "unverified"
  | "verified"
  | "conflict";

export interface SourceReference {
  name: string;
  url?: string;
  fetchedAt: string;
}

export interface RREvent<TFacts extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: string;
  occurredAt: string;
  createdAt: string;
  source: SourceReference;
  localRelevance: string[];
  entities: string[];
  facts: TFacts;
  verificationStatus: VerificationStatus;
  editorialStatus: EditorialStatus;
}
