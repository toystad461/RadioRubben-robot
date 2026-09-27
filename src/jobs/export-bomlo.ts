import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { dirname, basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { NewsStore } from "./ingest-bomlo.js";

async function run(): Promise<void> {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw new Error("Bruk: npm run export:bomlo -- data/bomlo-news.json privat/robot-news.json");
  const store: NewsStore = JSON.parse(await readFile(input, "utf8")) as NewsStore;
  if (store.schemaVersion !== 1 || !Array.isArray(store.events)) throw new Error("Ukjent lagringsformat.");
  const items = store.events.filter(event => event.type === "news.item.discovered" && event.source.name === "Bømlo kommune – Aktuelt og kunngjeringar")
    .map(event => ({
      event,
      draft: {
        id: `source-card:${event.id}`, eventId: event.id, status: "review" as const,
        title: String(event.facts.title ?? ""), body: String(event.facts.summary ?? ""),
        sourceUrl: event.source.url,
        notes: ["Kildekort fra RSS. Åpne originalen før redaksjonell bruk; teksten er ikke en Radio Rubben-artikkel."]
      }
    }));
  const feed = { schemaVersion: 1, generatedAt: new Date().toISOString(), items };
  const temp = join(dirname(output), `.${basename(output)}.${randomUUID()}.tmp`);
  try {
    await writeFile(temp, JSON.stringify(feed, null, 2) + "\n", { flag: "wx", mode: 0o600 });
    await rename(temp, output);
  } catch (error) { await unlink(temp).catch(() => {}); throw error; }
  console.log(`Eksporterte ${items.length} kommunesaker til ${output}.`);
}

run().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
