import { createHash } from "node:crypto";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { RREvent } from "../../core/events.js";

export const BOMLO_RSS_URL = "https://www.bomlo.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=26&Spraak=Nynorsk";
const MAX_BYTES = 1_000_000;

export interface MunicipalityNewsFacts extends Record<string, unknown> {
  title: string;
  summary: string;
  articleUrl: string;
  publishedAt: string;
  sourceGuid: string;
}

const stringValue = (value: unknown): string => typeof value === "string" ? value.trim() : "";

export function parseBomloRss(xml: string, fetchedAt: string): RREvent<MunicipalityNewsFacts>[] {
  if (Buffer.byteLength(xml) > MAX_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("RSS-strømmen er for stor eller inneholder DTD.");
  if (XMLValidator.validate(xml) !== true) throw new Error("Ugyldig RSS XML.");
  const parsed: unknown = new XMLParser({ ignoreAttributes: true, parseTagValue: false }).parse(xml);
  if (!parsed || typeof parsed !== "object" || !("rss" in parsed)) throw new Error("Forventet RSS-format.");
  const channel = (parsed as { rss: { channel?: { item?: unknown } } }).rss?.channel;
  if (!channel || typeof channel !== "object") throw new Error("Mangler RSS-kanal.");
  const entries = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
  const seen = new Set<string>();
  const events: RREvent<MunicipalityNewsFacts>[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const title = stringValue(item.title);
    const link = stringValue(item.link);
    const guid = stringValue(item.guid) || link;
    const published = new Date(stringValue(item.pubDate));
    let url: URL;
    try { url = new URL(link); } catch { continue; }
    if (!title || !guid || Number.isNaN(published.getTime()) || url.protocol !== "https:"
        || url.hostname !== "www.bomlo.kommune.no"
        || !url.pathname.startsWith("/aktuelt-og-kunngjeringar/")) continue;
    const id = `news:bomlo-kommune:${createHash("sha256").update(guid).digest("hex").slice(0, 24)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const summary = stringValue(item.description).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    events.push({
      id,
      type: "news.item.discovered",
      occurredAt: published.toISOString(),
      createdAt: fetchedAt,
      source: { name: "Bømlo kommune – Aktuelt og kunngjeringar", url: link, fetchedAt },
      localRelevance: ["Bømlo"],
      entities: ["Bømlo kommune"],
      facts: { title, summary, articleUrl: link, publishedAt: published.toISOString(), sourceGuid: guid },
      verificationStatus: "unverified",
      editorialStatus: "new"
    });
  }
  return events;
}

export async function fetchBomloRss(): Promise<{ xml: string; fetchedAt: string }> {
  const response = await fetch(BOMLO_RSS_URL, {
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    headers: { "Accept": "application/rss+xml, application/xml;q=0.9", "User-Agent": "RadioRubben-RRRobot/0.1 (+https://www.radiorubben.no/)" }
  });
  if (!response.ok || !/\b(?:rss\+xml|xml)\b/i.test(response.headers.get("content-type") ?? ""))
    throw new Error(`RSS svarte ${response.status} med uventet format.`);
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (!response.body) throw new Error("Tom RSS-respons.");
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > MAX_BYTES) throw new Error("RSS-responsen er for stor.");
    chunks.push(chunk);
  }
  return { xml: Buffer.concat(chunks).toString("utf8"), fetchedAt: new Date().toISOString() };
}
