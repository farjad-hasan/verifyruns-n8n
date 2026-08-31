# n8n-nodes-verifyruns

An [n8n](https://n8n.io) community node for [VerifyRuns](https://github.com/farjad-hasan/verifyruns) — *your automation said Done; VerifyRuns checks if that's true.*

Drop the **VerifyRuns** node at the end of a workflow. It tells VerifyRuns the run finished and how many records it wrote; VerifyRuns re-reads the destination and answers PASS or FAIL. With *Wait for Verdict* on, a FAIL turns the n8n execution red with VerifyRuns' own sentence as the error:

```
VerifyRuns: Run reported success, but your workflow said it wrote 3 records; the destination gained 0.
```

## Node parameters

| Parameter | Default | Meaning |
|---|---|---|
| Webhook URL | — | The Check's secret webhook URL (`https://<host>/api/hook/<secret>`), copied from the Check page. Stored as a password field. |
| Report What Was Written | on | Send `{"wrote": N}` so the verdict reconciles the workflow's own count against the destination |
| Records Written | 0 | `0` = the number of items reaching this node |
| Wait for Verdict (seconds) | 30 | `0` = ping and continue; up to 60 waits for the verdict |
| Fail This Execution on FAIL | on | Throw on a FAIL verdict (only when waiting) |

The node runs once per execution and outputs one item: the VerifyRuns response (`run_id`, `verdict`, `diff_message`) plus the `wrote` it sent.

## Install

n8n → Settings → Community Nodes → Install → `n8n-nodes-verifyruns` ([on npm](https://www.npmjs.com/package/n8n-nodes-verifyruns), published with provenance). Manual alternative: clone, `npm install && npm pack`, then in n8n's user folder `cd ~/.n8n/nodes && npm install /path/to/n8n-nodes-verifyruns-0.1.0.tgz` and restart n8n (this is the path that was validated).

## Status — read this

- Compiles (`npm run build`) and the request/verdict logic is unit-tested (`npm test`, Node's built-in runner).
- **Validated in n8n 2.35.7 (2026-08-28)** against the live VerifyRuns API: installed from `npm pack` output into `~/.n8n/nodes`, run via `n8n execute`. Default settings turned the execution red with `VerifyRuns: Run reported success, but your workflow said it wrote 1 records; the destination gained 0.`; with *Report What Was Written* off the same Check passed. Also validated through the editor UI on 2026-08-29: node picker, parameter panel, a red execution with the FAIL sentence and a green one with *Report What Was Written* off.
- Zero runtime dependencies, MIT — written to meet n8n's community-node verification rules; not yet submitted.

## Credentials

None. The Check's secret webhook URL is the credential; the node stores it as a password-typed field, and it never leaves the request to your VerifyRuns host.

## Compatibility

Validated in **n8n 2.35.7** (editor UI and `n8n execute`, 2026-08-28/29). Requires a VerifyRuns backend with webhook-wait support (`POST /api/hook/<secret>?wait=N`, August 2026 or later) — the hosted app at [verifyruns.pages.dev](https://verifyruns.pages.dev) qualifies. Zero runtime dependencies.

## Usage

Put the node **last** in the workflow, after the step that writes to your destination. Leave defaults on and every execution reconciles "what the workflow believes it wrote" against "what the destination actually gained" — a mismatch turns the execution red, so your existing error workflow fires too. For fire-and-forget, set *Wait for Verdict* to `0`. An importable example lives in [`examples/`](examples/).

## Resources

- [VerifyRuns](https://verifyruns.pages.dev) — create a Check, copy its webhook URL
- [n8n setup guide](https://github.com/farjad-hasan/verifyruns/blob/main/docs/n8n.md)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

- **0.1.0** — initial release: report the run, claim the written count, wait for the verdict, fail the execution on FAIL.

## Develop

```bash
npm install
npm test          # builds, then runs test/ with node --test
npm run lint      # tsc + n8n's community-node linter (eslint-plugin-n8n-nodes-base)
```
