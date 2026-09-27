import { readFile, writeFile, rename } from "node:fs/promises";
import { dirname, basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import { importFinishedMatch } from "../sources/football/import.js";
import { draftFinishedMatch } from "../editorial/football-draft.js";

const [output, ...inputs] = process.argv.slice(2);
if (!output || inputs.length === 0) {
  console.error("Bruk: npm run export:studio -- privat/robot-inbox.json kamp1.json [kamp2.json ...]");
  process.exitCode = 1;
} else {
  try {
    const items = new Map<string, {
      event: ReturnType<typeof importFinishedMatch>;
      draft: ReturnType<typeof draftFinishedMatch>;
    }>();
    for (const file of inputs) {
      const snapshot: unknown = JSON.parse(await readFile(file, "utf8"));
      const event = importFinishedMatch(snapshot);
      items.set(event.id, { event, draft: draftFinishedMatch(event) });
    }
    const feed = { schemaVersion: 1, generatedAt: new Date().toISOString(), items: [...items.values()] };
    const temp = join(dirname(output), `.${basename(output)}.${randomUUID()}.tmp`);
    try {
      await writeFile(temp, JSON.stringify(feed, null, 2) + "\n", { encoding: "utf8", flag: "wx", mode: 0o600 });
      await rename(temp, output);
    } catch (error) {
      const { unlink } = await import("node:fs/promises");
      await unlink(temp).catch(() => {});
      throw error;
    }
    console.log(`Eksporterte ${items.size} kamp(er) til ${output}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
