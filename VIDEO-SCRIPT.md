# Verification video — click-by-click script

Target: under 4 minutes, screen-recorded (no voiceover needed; n8n reviews the actions,
not narration — but a sentence or two of narration never hurts). Record at a comfortable
window size; the same recording, trimmed, becomes the marketing demo GIF.

## Prep (off camera, ~5 minutes)

1. **A demo Check** on https://verifyruns.pages.dev (logged in):
   - New Check → name `n8n-demo` → connector **HTTP / JSON**
   - GET URL: `https://jsonplaceholder.typicode.com/posts` (any stable public JSON
     array works — this one never grows, which is exactly what we want)
   - Expectations: set **Min new records to 0** (growth optional). Leave the rest empty.
   - Create, then copy the Check's **webhook URL** to a scratchpad.
   - Why this shape: with growth optional, a bare ping **PASSes**; a ping claiming
     `{"wrote": 1}` **FAILs** ("workflow said it wrote 1 records; the destination
     gained 0") — a verdict flip you can trigger from inside n8n with one toggle.
2. **A clean n8n instance** (so the install-from-npm step is honest):
   ```
   npx n8n
   ```
   then open http://localhost:5678 and create the local owner account. If the
   Community Nodes install option is missing, restart with
   `N8N_COMMUNITY_PACKAGES_ENABLED=true npx n8n`.
3. Have this file open on a second screen/phone.
4. Optional, for the AI-tool scene: an n8n credential for any chat model
   (OpenAI/Anthropic/Gemini). Skip the scene if you don't want to add one.

## The recording

**Scene 1 — install from npm (~40s)**
- Settings → Community Nodes → Install a community node
- Type `n8n-nodes-verifyruns`, tick the risk acknowledgement, Install.
- Wait for it to appear in the installed list — **hover so the version (0.1.1) is
  visible**; the reviewers check that it matches the submitted version.

**Scene 2 — insert the node (~30s)**
- New workflow. Add **Manual Trigger**, then add **VerifyRuns** after it
  (search "VerifyRuns" in the node picker — linger a beat so the icon and
  description are on screen).

**Scene 3 — config works (~30s)**
- Open the node. Paste the Check's webhook URL into **Webhook URL** (it renders
  masked — that's the credential-handling story: password-typed field).
- Leave defaults: *Report What Was Written* on, *Records Written* 0,
  *Wait for Verdict* 30, *Fail This Execution on FAIL* on.

**Scene 4 — the money shot (~60s)**
- **Execute workflow** → the execution turns **red**, and the error on the node reads:
  `VerifyRuns: Run reported success, but your workflow said it wrote 1 records; the
  destination gained 0.`
  (Pause on this. It's both the review's "demonstrate functionality" and our pitch.)
- Open the node, toggle **Report What Was Written → off**, execute again → **green**,
  and the output item shows `verdict: PASS` with the run id.
  (This is the flip: same node, same Check — the claim is what changed.)

**Scene 5 — usable as a tool (~40s, recommended since the node declares it)**
- New workflow: add an **AI Agent** node (with any chat-model credential), then
  under its **Tools**, add **VerifyRuns** — paste the same webhook URL.
- Run the agent with the prompt: `Verify my sync landed and tell me the verdict.`
- Show the agent calling the VerifyRuns tool and reporting PASS in its answer.
  (n8n's guidance: one example action as a tool suffices. If you skip this scene,
  the video is still complete — the tool wiring is visible in scene 2's node details.)

**End card (~5s)** — the VerifyRuns dashboard with the demo Check's timeline showing
the red square from scene 4 followed by green. Nice-to-have, not required.

## Afterwards

- Upload the video on the Creator Portal page (creators.n8n.io → Nodes →
  n8n-nodes-verifyruns) — drag into the upload box, no format gymnastics needed.
- Trim scene 4 (red run → toggle → green run) into a ~20s GIF for the landing page
  and the launch posts: this is `docs/media/forced-fail.gif`'s successor with the
  real node instead of a raw webhook.
