import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export function notesPath(home = process.env.JOTTER_HOME ?? join(homedir(), ".jotter")) {
  return join(home, "notes.json");
}

export async function listNotes(path = notesPath()) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function addNote(text, meta = {}, path = notesPath()) {
  const notes = await listNotes(path);
  const note = { id: notes.length + 1, text, createdAt: new Date().toISOString(), ...meta };
  notes.push(note);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(notes, null, 2));
  return note;
}
