import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { commandsOf, loadPlugins } from "../src/plugins.js";

test("every shipped plugin loads and its commands have usage and run", async () => {
  const plugins = await loadPlugins(fileURLToPath(new URL("../plugins", import.meta.url)));
  assert.ok(plugins.length > 0);
  for (const [name, command] of commandsOf(plugins)) {
    assert.equal(typeof command.run, "function", name);
    assert.match(command.usage, new RegExp(`^jot ${name}`));
  }
});

test("two plugins defining the same command is an error", () => {
  const plugin = (name) => ({ name, commands: { go: { usage: "jot go", run: async () => {} } } });
  assert.throws(() => commandsOf([plugin("a"), plugin("b")]), /Two plugins define "jot go"/);
});
