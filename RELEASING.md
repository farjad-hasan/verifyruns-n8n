# Releasing & getting verified

The path from this (private) repo to a verified node in n8n's in-app panel, per
n8n's requirements as of 2026-08 (checked 2026-08-31):

1. **Make this repo public.** Verification requires npm provenance, and provenance
   requires publishing from a public repo's GitHub Actions.
2. **npm account** with this package's publish rights. Prefer configuring
   [trusted publishing](https://docs.npmjs.com/trusted-publishers) for
   `n8n-nodes-verifyruns` pointing at this repo's `publish.yml`; otherwise create a
   granular automation token and store it as the `NPM_TOKEN` repo secret.
3. **Enable the workflow trigger.** `.github/workflows/publish.yml` is
   `workflow_dispatch`-only on purpose; add `on: push: tags: ['v*']` once 1–2 are done.
   It already publishes with `--provenance`.
4. **Pre-flight** (all green as of 2026-08-31): `npm test` (8/8), `npm run lint`
   (tsc + `eslint-plugin-n8n-nodes-base`, clean), zero runtime dependencies,
   `n8n-community-node-package` keyword, README with the sections the review expects.
5. **Tag and publish:** `git tag v0.1.0 && git push --tags`.
6. **Submit** at the [n8n Creator Portal](https://creators.n8n.io/nodes).

After publishing, fix the install instructions in the main repo if they still say
"once published": `README.md` and `docs/n8n.md` reference this node — the package
name users install is `n8n-nodes-verifyruns` (the repo name `verifyruns-n8n` is not
the npm name).
