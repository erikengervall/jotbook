export default {
  name: "wordcount",
  description: "Counts the words across all your notes.",
  commands: {
    count: {
      usage: "jot count",
      run: async (_args, ctx) => {
        const notes = await ctx.listNotes();
        const words = notes.reduce((total, note) => total + note.text.split(/\s+/).filter(Boolean).length, 0);
        ctx.log(`${words} words in ${notes.length} notes`);
      },
    },
  },
};
