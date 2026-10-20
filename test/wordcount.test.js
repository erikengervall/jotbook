import { test } from "node:test";
import assert from "node:assert/strict";
import wordcount from "../plugins/wordcount.js";

test("jot count totals words across notes", async () => {
  const lines = [];
  const ctx = { listNotes: async () => [{ text: "one two" }, { text: " three " }], log: (line) => lines.push(line) };
  await wordcount.commands.count.run([], ctx);
  assert.deepEqual(lines, ["3 words in 2 notes"]);
});
