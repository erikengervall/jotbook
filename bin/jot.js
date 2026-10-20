#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { addNote, listNotes } from "../src/store.js";
import { commandsOf, loadPlugins } from "../src/plugins.js";

const pluginDir = fileURLToPath(new URL("../plugins", import.meta.url));
const ctx = { addNote, listNotes, log: (line) => console.log(line) };

const builtins = new Map([
  ["add", { usage: "jot add <text>", run: async (args) => ctx.log(`Saved note ${(await addNote(args.join(" "))).id}`) }],
  ["list", { usage: "jot list", run: async () => (await listNotes()).forEach((note) => ctx.log(`${note.id}. ${note.title ?? note.text.split("\n")[0]}`)) }],
]);

const [name, ...args] = process.argv.slice(2);
try {
  const commands = new Map([...builtins, ...commandsOf(await loadPlugins(pluginDir))]);
  const command = commands.get(name);
  if (!command) {
    ctx.log("Usage:");
    for (const { usage } of commands.values()) ctx.log(`  ${usage}`);
    process.exit(name ? 1 : 0);
  }
  await command.run(args, ctx);
} catch (error) {
  console.error(`jot: ${error.message}`);
  process.exit(1);
}
