import { tokenize, runProgram, makeExample } from "hippo-lang";

/* ...existing code... */
const editor = document.getElementById("editor");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const emojiInput = document.getElementById("emojiInput");
const insertEmoji = document.getElementById("insertEmoji");
const exampleBlock = document.getElementById("exampleBlock");
/* ...existing code... */

insertEmoji.addEventListener("click", () => {
  const emoji = emojiInput.value.trim();
  if (!emoji) {
    alert("Paste the seahorse emoji into the Emoji token field, then click Insert.");
    return;
  }
  const toInsert = emoji + emoji + " "; // helpful double
  insertAtCursor(editor, toInsert);
});

runBtn.addEventListener("click", async () => {
  output.textContent = "";
  const emoji = emojiInput.value.trim() || detectFirst(editor.value);
  if (!emoji) {
    output.textContent = "Error: No emoji token found. Paste the seahorse emoji into the Emoji token field.";
    return;
  }
  const nums = tokenize(editor.value, emoji);
  try {
    const res = runProgram(nums, {
      readNum: () => prompt("Input number:", "0"),
      write: s => (output.textContent += `${s}\n`)
    });
    if (res && !output.textContent.includes(res)) output.textContent += res;
  } catch (e) {
    output.textContent = `Runtime error: ${e?.message || e}`;
  }
});

resetBtn.addEventListener("click", () => {
  editor.value = "";
  output.textContent = "";
});

function detectFirst(str) {
  for (const ch of Array.from(str)) if (!/\s/.test(ch)) return ch;
  return "";
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = before + text + after;
  const pos = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  textarea.focus();
}

/* initialize example block when emoji provided */
emojiInput.addEventListener("input", () => {
  const emoji = emojiInput.value.trim();
  exampleBlock.textContent = emoji ? makeExample(emoji) : "Paste the seahorse emoji into the input above to see an example.";
});
exampleBlock.textContent = "Paste the seahorse emoji into the input above to see an example.";
/* ...existing code... */

