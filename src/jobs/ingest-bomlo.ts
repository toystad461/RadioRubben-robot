import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { dirname, basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { RREvent } from "../core/events.js";
import { fetchBomloRss, parseBomloRss } from "../sources/rss/bomlo.js";

export interface NewsStore { schemaVersion: 1; updatedAt: string; events: RREvent[]; }

export function mergeNews(existing: NewsStore, incoming: RREvent[], now: string): { store: NewsStore; added: number } {
  if (existing.schemaVersion !== 1 || !Array.isArray(existing.events)) throw new Error("Ukjent lagringsformat.");
  const items = new Map(existing.events.map(event => [event.id, event]));
  const before = items.size;
  for (const event of incoming) if (!items.has(event.id)) items.set(event.id, event);
  return { store: { schemaVersion: 1, updatedAt: now, events: [...items.values()] }, added: items.size - before };
}

async function run(): Promise<void> {
  const output = process.argv[2];
  if (!output) throw new Error("Bruk: npm run ingest:bomlo -- data/bomlo-news.json");
  const { xml, fetchedAt } = await fetchBomloRss();
  const incoming = parseBomloRss(xml, fetchedAt);
  let existing: NewsStore = { schemaVersion: 1, updatedAt: fetchedAt, events: [] };
  try { existing = JSON.parse(await readFile(output, "utf8")) as NewsStore; }
  catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  const { store, added } = mergeNews(existing, incoming, fetchedAt);
  const temp = join(dirname(output), `.${basename(output)}.${randomUUID()}.tmp`);
  try {
    await writeFile(temp, JSON.stringify(store, null, 2) + "\n", { mode: 0o600, flag: "wx" });
    await rename(temp, output);
  } catch (error) { await unlink(temp).catch(() => {}); throw error; }
  console.log(`Bømlo kommune: ${incoming.length} i RSS, ${added} nye, ${store.events.length} lagret i ${output}.`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  run().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
}
