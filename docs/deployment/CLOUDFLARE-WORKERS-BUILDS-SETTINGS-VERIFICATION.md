# Cloudflare Workers Builds settings verification

Date: 10 November 2026

Scope: read-only inspection of the committed repository and local command
validation. No dashboard setting, DNS record, domain, binding, dependency or
production deployment was changed.

## A. Repository identity

| Item | Verified value |
| --- | --- |
| Repository | `https://github.com/Delkay-byte/BloomCore-Technologies.git` |
| Branch | `main` |
| Commit at inspection | `cd700c67e52718064babe1ddc208924662b3a1d4` |
| Working tree | clean before validation |
| Project root | repository root (no monorepo subdirectory) |
| Worker name | `bloomcore-technologies-page` |
| Live domain | `https://bloomcoretech.com` |

Locked versions from `package-lock.json`:

| Package | Version |
| --- | --- |
| `next` | 16.4.6 |
| `react` | 19.3.0 |
| `react-dom` | 19.3.0 |
| `@opennextjs/cloudflare` | 1.20.16 |
| `@opennextjs/aws` (transitive) | 4.1.15 |
| `wrangler` | 4.160.0 |
| `eslint-config-next` | 16.4.6 |
| Lockfile SHA-256 | `A434D1DC05804C079851F3A03AA1ECD3C368F6E9DBEF066D9CD5AD5CE13B0595` |

Node requirement: `next` declares `node >=20.9.0`, `wrangler` declares
`node >=22.12.0`. `package.json` has no `engines` field and there is no
`.nvmrc` or `.node-version`.

## B. Package scripts

| Script | Exact command | What it does |
| --- | --- | --- |
| `build` | `next build` | Builds the app. `next.config.ts` picks `output: "standalone"` unless `NETLIFY=true`, which selects `"export"`. |
| `start` | `next start` | Serves the local standalone build. Not used by Workers Builds. |
| `dev` | `next dev` | Local development. |
| `lint` | `eslint` | Lints source; `.open-next`, `.wrangler` and generated types are ignored. |
| `preview` | `opennextjs-cloudflare build && opennextjs-cloudflare preview` | Builds, then runs the Worker locally in the Workers runtime. Not a deployment command. |
| `deploy` | `opennextjs-cloudflare build && opennextjs-cloudflare deploy` | Builds, then deploys. Correct for local/manual use only. |
| `cf-typegen` | `wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts` | Generates binding types. |

Key behaviour found in the installed adapter:
`node_modules/@opennextjs/aws/dist/build/buildNextApp.js` runs
`npm run build` for the npm packager after setting
`NEXT_PRIVATE_STANDALONE=true`. So `opennextjs-cloudflare build` performs the
Next.js build itself. It does not need `npm run build` to run first, and running
both would build the app twice.

Therefore `npm run deploy` must not be used as the Workers Builds deploy
command. In Workers Builds the build command runs first, then the deploy
command. `npm run deploy` would rebuild the app inside the deploy stage, doubling
build time and discarding the artefact the build stage produced.

## C. Executable verification

| Package | `bin` declaration | Local executable |
| --- | --- | --- |
| `@opennextjs/cloudflare@1.20.16` | `opennextjs-cloudflare` → `dist/cli/index.js` | `node_modules/.bin/opennextjs-cloudflare`, `.cmd`, `.ps1` present |
| `wrangler@4.160.0` | `wrangler` → `bin/wrangler.js` | `node_modules/.bin/wrangler`, `.cmd`, `.ps1` present |

Both are pinned development dependencies, so `npx opennextjs-cloudflare` and
`npx wrangler` resolve the local binaries from the committed lockfile. No
ephemeral download of a floating `latest` is required. Cloudflare Workers
Builds additionally states it uses the Wrangler version from `package.json`,
which is pinned at 4.160.0.

Validated subcommands:

- `npx --no-install opennextjs-cloudflare build` → success.
- `npx --no-install wrangler deploy --dry-run` → success.
- `npx --no-install wrangler preview --help` → exists in 4.160.0 as an open
  beta Preview deployment command.

## D. Exact Cloudflare dashboard settings

| Cloudflare setting | Exact value |
| --- | --- |
| Git account | The account that owns `Delkay-byte/BloomCore-Technologies` |
| Git repository | `Delkay-byte/BloomCore-Technologies` |
| Git branch | `main` |
| Root directory | *(leave empty — project is at the repository root)* |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` if preview builds are enabled; otherwise leave preview builds disabled |
| Build variables | None required. Do not set `NETLIFY`. |
| Optional build variables | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` only if real tokens exist |
| Node version | Default image Node 24.22.1 satisfies `wrangler >=22.12.0`; no override needed |

Build-variable reasoning from the source:

| Variable | Source | Needed on Workers Builds |
| --- | --- | --- |
| `NETLIFY` | `next.config.ts` | Must stay unset. Any truthy value switches output to `export`. |
| `NEXT_PUBLIC_SITE_URL` | `src/lib/site.ts` | No. Defaults to `https://bloomcoretech.com`; staging-only override. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `src/app/layout.tsx` | Only if the HTML-tag token is used. The DNS TXT record already verifies Search Console. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | `src/app/layout.tsx` | Only if a Bing token exists. None is configured today. |
| GTM / GA4 IDs | `src/lib/analytics.ts` | No. `GTM-PMZ6ZSVT` and `G-GDBL5SNHKL` are literals in source. |

There is no `.dev.vars`, no runtime secret, no API endpoint and no server-side
data fetch. Nothing needs a secret or binding change.

Reasoning for the two commands:

- Build: `opennextjs-cloudflare build` runs `npm run build` itself, forces
  standalone mode, and writes `.open-next/worker.js` plus `.open-next/assets`.
- Deploy: `wrangler deploy` reads the committed `wrangler.jsonc`, whose `main`
  is `.open-next/worker.js` and whose assets directory is `.open-next/assets`.
  Because a Wrangler configuration file is committed, the automatic framework
  migration path is not triggered.
- `npm run build` alone is wrong for the build stage: it emits `.next` but no
  `.open-next`, so `wrangler deploy` would fail to find the Worker entry.
- `npm run deploy` is wrong for the deploy stage: it rebuilds the whole app.

Documentation checks that back these values:

- Workers Builds runs Build command, then Deploy command, then reads the
  Wrangler version from `package.json` for the deploy and preview commands.
- Automatic project configuration and its pull request are only triggered when
  the repository has no Wrangler configuration file. This repo commits
  `wrangler.jsonc`, so `wrangler deploy` deploys the existing Worker without a
  framework migration.
- The Preview command only runs when preview builds are enabled, and it
  defaults to `npx wrangler preview`.

## E. Command validation

Performed locally with the committed lockfile.

```text
npm ci                                  pass
npx --no-install opennextjs-cloudflare build   pass, 160 s
```

Build artefacts after the single OpenNext command:

| Artefact | Result |
| --- | --- |
| `.open-next/worker.js` | present, 2278 bytes |
| `.open-next/assets` | present, 50 files, 1,695,722 bytes |
| `.open-next/assets/_redirects` | present |
| `.next/standalone/.next/server/pages-manifest.json` | present |
| Route table | 19 routes, including `/work` and the three resource articles |

Deploy dry run, which bundles and checks without uploading:

```text
npx --no-install wrangler deploy --dry-run --outdir <temp>
```

```text
Read 55 files from the assets directory .open-next/assets
Total Upload: 5721.94 KiB / gzip: 1220.29 KiB
env.WORKER_SELF_REFERENCE (bloomcore-technologies-page)  Worker
env.ASSETS                                               Assets
--dry-run: exiting now.
```

No upload occurred, no new version was published, no automatic project
configuration or migration was initiated, and the committed bindings were read
unchanged. The dry-run also confirms the Worker entry resolves from the
committed configuration alone.

## F. Netlify fallback

Separately validated with the Netlify environment marker:

```text
NETLIFY=true npm run build
```

| Check | Result |
| --- | --- |
| Exit code | 0 |
| `out/index.html` | present |
| `out/` static files | 148 |
| `out/_redirects` | present |
| `.next/standalone` | not created, as intended for static export |

The fallback is separate and untouched. The Cloudflare build must never set
`NETLIFY`, either as a dashboard variable or in a command prefix, because that
would switch the build to static export and produce no `.open-next` output.

## G. What the owner should enter

Copy these values into **Workers & Pages → bloomcore-technologies-page →
Settings → Build**:

```text
Git branch:       main
Root directory:   (leave empty)
Build command:    npx opennextjs-cloudflare build
Deploy command:   npx wrangler deploy
Preview command:  npx wrangler preview
Build variables:  (none)
```

Do not add `NETLIFY=true` or any variant. Do not set the build command to
`npm run build` and do not set the deploy command to `npm run deploy`. No new
dependency, secret, binding or Wrangler setting is required.

If preview builds are not wanted, disable them instead of maintaining a preview
command. Production deploys only use the branch, build command and deploy
command above.
