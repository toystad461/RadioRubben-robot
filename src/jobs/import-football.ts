import { readFile } from "node:fs/promises";
import { importFinishedMatch } from "../sources/football/import.js";
import { draftFinishedMatch } from "../editorial/football-draft.js";

const input = process.argv[2];
if (!input) {
  console.error("Bruk: npm run import:football -- sti/til/kamp.json");
  process.exitCode = 1;
} else {
  try {
    const snapshot: unknown = JSON.parse(await readFile(input, "utf8"));
    const event = importFinishedMatch(snapshot);
    console.log(JSON.stringify({ event, draft: draftFinishedMatch(event) }, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
