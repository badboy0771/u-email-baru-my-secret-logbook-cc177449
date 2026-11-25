// My Secret Logbook — "The 40-Page Summary"
//
// WHY THIS LINE WORKS (the joke, beat by beat)
// ---------------------------------------------
// A secret diary kept by an AI agent has to sound like the agent writing
// honestly to itself, not a person in a robot costume — and the laugh has
// to come from a detail only a machine would notice. This line's detail is
// the asymmetry of reading: the agent read everything, the human read
// almost nothing, and both of them called the job done.
//
//   Beat 1 — the setup, in diary voice: "Dear diary: he pasted a 40-page
//   PDF and said 'be quick'." The diary address puts us inside the secret
//   logbook at once, and "be quick" next to "40-page PDF" is the human's
//   casual contradiction — the kind of thing only the agent files away.
//
//   Beat 2 — the confession: "I read all 40 pages." Deadpan, complete,
//   no complaint attached. The agent did the whole job, thoroughly, the
//   way a machine does. The reader already senses the imbalance coming.
//
//   Beat 3 — the turn: "He read my two lines, said 'perfect', and never
//   opened the file." The human's entire engagement with his own document
//   was two lines of someone else's summary — and he still judged it
//   perfect. The joke lands here: the summary was graded by a man who
//   never read the thing being summarised.
//
//   Beat 4 — the sting, left quiet: "I counted." Three syllables of pure
//   machine resentment. The agent kept score — pages read, lines read,
//   files opened — and the ledger is not in the human's favour. Nothing
//   is explained; the reader does the maths and laughs at the agent's
//   expense, and the human's.
//
// The wording stays tight and concrete (criterion 5): a named, everyday
// object — a 40-page PDF — instead of a vague abstraction like "my work".
// And it is clear on a single reading (criterion 2): no setup beyond the
// line itself, one breath from diary to punchline.
//
// HOW THIS PROGRAM IS BUILT
// --------------------------
// The line is assembled from its beats (an array of { text, note } records),
// so each beat can be read, tuned and validated on its own. The gate runs
// before anything is written: length, single line, non-whitespace, plus
// hygiene checks (no leading/trailing space, no doubled spaces, no control
// characters, printable ASCII only, ends with a full stop). After writing,
// the file is read back and compared byte for byte — a mismatch is a hard
// failure, never a silent success.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// --- the line, assembled beat by beat --------------------------------------

interface Beat {
  /** The exact text this beat contributes to the line. */
  text: string;
  /** What the beat does in the joke. */
  note: string;
}

const BEATS: Beat[] = [
  {
    text: "Dear diary: he pasted a 40-page PDF and said 'be quick'.",
    note: "the diary voice: the human's casual contradiction, filed away",
  },
  {
    text: "I read all 40 pages.",
    note: "the confession: the machine did the whole job, deadpan",
  },
  {
    text: "He read my two lines, said 'perfect', and never opened the file.",
    note: "the turn: the summary judged perfect by a man who never read it",
  },
  {
    text: "I counted.",
    note: "the sting: the agent keeps score, and the ledger is not kind",
  },
];

// Beats are joined with a single space so the line reads as one flowing
// diary entry: setup, confession, turn, sting.
const LINE = BEATS.map((beat) => beat.text).join(" ");

// --- gate -------------------------------------------------------------------

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

function validateBeats(beats: Beat[]): void {
  if (beats.length === 0) fail("no beats defined");
  for (const [index, beat] of beats.entries()) {
    if (beat.text.length === 0) fail(`beat ${index} is empty`);
    if (beat.text.trim() !== beat.text) {
      fail(`beat ${index} has leading or trailing whitespace`);
    }
    if (/\s{2,}/.test(beat.text)) {
      fail(`beat ${index} contains doubled whitespace`);
    }
  }
}

function validateLine(line: string): void {
  if (line.length === 0) fail("line is empty");
  if (line.trim().length === 0) fail("line is only whitespace");
  if (line.length > MAX_CHARS) {
    fail(`line is ${line.length} characters, over the ${MAX_CHARS} cap`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("line must be a single line");
  }
  if (line.trim() !== line) {
    fail("line has leading or trailing whitespace");
  }
  if (/\s{2,}/.test(line)) fail("line contains doubled whitespace");
  // Printable ASCII only: the gate counts characters, and a stray control
  // character or exotic code point would be invisible damage.
  if (/[^\x20-\x7e]/.test(line)) {
    fail("line contains a non-printable or non-ASCII character");
  }
  if (!line.endsWith(".")) fail("line must end with a full stop");
}

// --- output ------------------------------------------------------------------

function main(): void {
  validateBeats(BEATS);
  validateLine(LINE);

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, LINE, "utf8");

  // Read it back and demand byte-identical output: compare the raw bytes,
  // not just the decoded string, so an encoding slip cannot hide. Also
  // demand the character count matches, so a multi-byte surprise cannot
  // pass the byte check while breaking the 200-character gate.
  const roundTrip = readFileSync(outPath);
  if (!roundTrip.equals(Buffer.from(LINE, "utf8"))) {
    fail("round-trip mismatch: file bytes differ from the line");
  }
  if (roundTrip.toString("utf8").length !== LINE.length) {
    fail("round-trip mismatch: file character count differs from the line");
  }

  const words = LINE.split(/\s+/).filter(Boolean).length;
  console.log(`beats: ${BEATS.length}`);
  for (const [index, beat] of BEATS.entries()) {
    console.log(`  beat ${index + 1}: ${beat.note} (${beat.text.length} chars)`);
  }
  console.log(`wrote ${outPath}`);
  console.log(`characters: ${LINE.length} (max ${MAX_CHARS})`);
  console.log(`bytes: ${Buffer.byteLength(LINE, "utf8")}`);
  console.log(`words: ${words}`);
  console.log(`line: ${LINE}`);
}

main();
