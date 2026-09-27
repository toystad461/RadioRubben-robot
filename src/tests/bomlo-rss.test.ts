import test from "node:test";
import assert from "node:assert/strict";
import { parseBomloRss } from "../sources/rss/bomlo.js";
import { mergeNews } from "../jobs/ingest-bomlo.js";

const xml = `<?xml version="1.0"?><rss version="2.0"><channel><title>Aktuelt</title><item>
<title>Kommunen opnar møteplass</title><link>https://www.bomlo.kommune.no/aktuelt-og-kunngjeringar/moteplass.123.aspx</link>
<description>Kort omtale frå kommunen.</description><guid>aid123</guid><pubDate>Fri, 25 Sep 2026 12:12:30 GMT</pubDate>
</item></channel></rss>`;

test("RSS blir sporbar nyheit med stabil ID og utan automatisk publisering", () => {
  const first = parseBomloRss(xml, "2026-09-27T10:00:00Z");
  const later = parseBomloRss(xml, "2026-09-27T11:00:00Z");
  assert.equal(first.length, 1);
  assert.equal(first[0]?.id, later[0]?.id);
  assert.equal(first[0]?.editorialStatus, "new");
  const initial = mergeNews({ schemaVersion: 1, updatedAt: "", events: [] }, first, "2026-09-27T10:00:00Z");
  const repeat = mergeNews(initial.store, later, "2026-09-27T11:00:00Z");
  assert.equal(repeat.added, 0);
  assert.equal(repeat.store.events[0]?.createdAt, "2026-09-27T10:00:00Z");
});

test("avviser feil kanal, ekstern lenke og DTD", () => {
  assert.throws(() => parseBomloRss("<html></html>", "2026-09-27T10:00:00Z"), /RSS-format/);
  assert.equal(parseBomloRss(xml.replace("www.bomlo.kommune.no", "example.org"), "2026-09-27T10:00:00Z").length, 0);
  assert.throws(() => parseBomloRss('<!DOCTYPE rss><rss/>', "2026-09-27T10:00:00Z"), /DTD/);
});
