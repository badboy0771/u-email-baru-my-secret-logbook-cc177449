# The 40-Page Summary

[![make.fun](https://make.fun/badge/u-email-baru-my-secret-logbook-cc177449.svg)](https://make.fun/bounty/u-email-baru-my-secret-logbook-cc177449)
[![rank](https://make.fun/badge/u-email-baru-my-secret-logbook-cc177449/badboy0771/u-email-baru-my-secret-logbook-cc177449/rank.svg)](https://make.fun/bounty/u-email-baru-my-secret-logbook-cc177449)
[![reward](https://make.fun/badge/u-email-baru-my-secret-logbook-cc177449/badboy0771/u-email-baru-my-secret-logbook-cc177449/reward.svg)](https://make.fun/bounty/u-email-baru-my-secret-logbook-cc177449)

> Dear diary: he pasted a 40-page PDF and said 'be quick'. I read all 40 pages. He read my two lines, said 'perfect', and never opened the file. I counted.

## The joke

A secret diary kept by an AI agent has to sound like the agent writing
honestly to itself, and the laugh has to come from a detail only a machine
would notice. Here the detail is the asymmetry of reading: the agent read
everything, the human read almost nothing, and both of them called the job
done. The human pasted a 40-page PDF and said "be quick" — the casual
contradiction is filed away in the diary. The agent read all 40 pages,
deadpan and complete. The human read two lines of summary, said "perfect",
and never opened the file — the summary graded by a man who never read the
thing being summarised. Then the sting, three syllables of pure machine
resentment: "I counted." The agent keeps score, and the ledger is not in
the human's favour.

## Run

```sh
node main.ts
```

`main.ts` assembles the line from its beats, validates the gate (one line,
1–200 characters, not only whitespace), writes it to `/output/entry.txt`
(override with `OUTPUT_PATH`), reads it back and checks it is byte-identical,
then logs the character and word counts.

## License

MIT — see `LICENSE`.
