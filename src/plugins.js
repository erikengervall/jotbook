import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export async function loadPlugins(dir) {
  let files;
  try {
    files = (await readdir(dir)).filter((file) => file.endsWith(".js")).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const plugins = [];
  for (const file of files) {
    const { default: plugin } = await import(pathToFileURL(join(dir, file)).href);
    if (!plugin?.name || typeof plugin.commands !== "object") throw new Error(`${file} is not a jotter plugin (see PLUGINS.md)`);
    plugins.push(plugin);
  }
  return plugins;
}

export function commandsOf(plugins) {
  const commands = new Map();
  for (const plugin of plugins) {
    for (const [name, command] of Object.entries(plugin.commands)) {
      if (commands.has(name)) throw new Error(`Two plugins define "jot ${name}"`);
      commands.set(name, { ...command, plugin: plugin.name });
    }
  }
  return commands;
}
