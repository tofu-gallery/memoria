# Tofu gallery copy

This repository is Tofu's copy of **xp4u1/memoria** (licence: AGPL-3.0), listed in Tofu's app gallery as **memoria**: a private diary made for a phone. Write a reflection for each day and short memories with their own titles, see the week at a glance, and look back through every entry, newest first, with a search.

- `main` mirrors the upstream repository and is never committed to by Tofu.
- `tofu` carries Tofu's own changes; tags named `pin/<date>` mark the versions the gallery points to.
- A visitor who chooses this app gets a private snapshot of the pinned version in their own Tofu account. Their copy does not follow upstream updates.

## Where the diary is kept

**In the browser of whoever opens the copy, and nowhere else.** Entries live in that browser's IndexedDB (the PouchDB database `memoria`, stored as `_pouch_memoria`) and the app's few settings in its `localStorage`. Nothing is shared, nothing is sent to a server, and the copy has no server, database or accounts of its own.

- Everyone who opens the copy's address gets their own empty diary in their own browser. The owner's entries are never visible to anyone else, and nobody else's reach the owner.
- Another browser, another device or a private window shows a different, empty diary.
- Clearing the site's data (or a browser that clears it by itself) deletes the diary, and the app has no export.
- The pages say so: the footer of the home page and the top of **Settings** read "Your diary is kept only in this browser. Nothing is shared or sent to a server, and clearing this site's data deletes it." in each of the app's four languages.

## How Tofu runs it

- **Framework preset:** `vite`. It is a single-package Vite app with an npm lockfile building to `dist/`, so on the Free plan Tofu's static hosting builds it: `staticBuildPlanForSnapshot` reads it as eligible and the safety check passes (see **Verification**). A copy in an account on a paid plan or the Pro trial is a new app there, and Tofu builds it on its server hosting (Vercel) with the same `vite` preset; `vercel.json` gives that build the static hosting's install command and the routes below.
- **Root folder:** the repository root.
- **Install:** `npm ci --ignore-scripts --no-audit --no-fund` from `package-lock.json`, on both hostings: it is the static build's own command, and on server hosting `vercel.json` names it, so no dependency's install script runs there either (one would download the Cypress test runner's program, which no build uses). **Build:** `npm run build`, which is `tsc && vite build`. **Output:** `dist/` (85 files, about 2.7 MB).
- **Settings:** one, public and optional: `VITE_SOURCE_URL`, the address the **Source code** links open (see below). Nothing else is read.
- **Database, server, accounts, secrets:** none.
- **Pages:** `/` (the lock page, which passes straight on in a browser), `/home`, `/writer/<entry>`, `/database` and `/settings` are routes of one page, and each of them answers with `index.html` on both hostings: Tofu's static hosting does so for any page visit, and on server hosting `vercel.json` rewrites exactly these four routes (`/` is `index.html` itself). So a reload, a phone browser reopening a tab it had put away, or a Home Screen icon saved on any page opens the diary. A file that does not exist still answers 404.

## Source code link

- **Setting:** `VITE_SOURCE_URL`, read when the app is built (`src/sourceCode.ts`). When it is unset, empty or not an `http(s)` address, the links open `https://github.com/tofu-gallery/memoria/tree/pin/2026-10-28`. When Tofu's gallery copies this app into an account, it saves `VITE_SOURCE_URL` as `https://github.com/tofu-gallery/memoria/tree/<commit>`, the exact version that copy runs.
- **What it shows:** a **Source code** link in the footer of the home page, which is the first page anyone sees, and at the bottom of **Settings**, next to the licence's name. There is no sign-in, so everyone who opens the copy can reach it.
- **If you change the code:** publish your changed source where anyone can read it and set `VITE_SOURCE_URL` to that address, then deploy again. AGPL-3.0 section 13 asks that everyone who uses the app can get the source of the version they use.

## What Tofu changed, and why

On the `tofu` branch, on 2026-10-28, on top of upstream commit `ce4618c9cf67831524ce36c439cf06acd7382cb1` ("chore(release): version 1.2.2", 2026-09-13):

1. **Native app shells, the sample sync server and CI removed.** `android/` and `ios/` are the Capacitor projects for the app stores; a copy is the web app only. `ios/` holds file names with `~`, which Tofu's static build refuses, and `android/` a committed Gradle wrapper jar. `database/` is a sample CouchDB server for Docker whose compose file and setup script carry a sample password (`test`); a copy has no CouchDB and Tofu runs no container beside it. `.github/workflows/` ran pnpm and the native builds, which this branch no longer carries.
2. **npm instead of pnpm.** `pnpm-lock.yaml` and `pnpm-workspace.yaml` are removed (Tofu's static build refuses an app that carries them) and `package-lock.json` (lockfile version 3) is added. It was made with `npm install --package-lock-only --ignore-scripts --before=2026-09-14T00:00:00Z` with no `node_modules` present, so it resolves what upstream's pnpm lock held on its last update: every direct dependency at the same version except one test library, `@testing-library/dom` 10.4.2 instead of 10.4.1. Every entry names its `registry.npmjs.org` address and integrity hash, and the Linux builds a build machine needs (`@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`) are in it. (The first lockfile, in commit `995e241`, was made over an installed `node_modules` and lacked those two fields; commit `26d0e47` made it again.)
3. **`overrides` in `package.json`.** `@ionic/react-router` 9.0.3 asks for `react-router` and `react-router-dom` below 7, while the app uses 8.3 and 7.18; pnpm installed it beside them anyway, and the override makes npm do the same without `--legacy-peer-deps`, which would need a `.npmrc` (Tofu's upload refuses one). The same for `eslint-plugin-react`'s `eslint` peer, a lint tool the build does not run.
4. **The plain Vite config.** `vite.config.ts` now holds only the React plugin, the one shape of config Tofu's static build accepts. `@vitejs/plugin-legacy` (extra bundles for old browsers) and `vite-plugin-node-polyfills` are no longer used and leave `devDependencies`. PouchDB imports one Node module, `events`, without declaring it; it is now a dependency of the app (`events` 3.3.0, the same package the polyfills plugin brought). Upstream's test settings moved to `vitest.config.ts`.
5. **Where the diary is kept, and the source link.** The home page's footer and the top of **Settings** say the diary is kept only in this browser (above). A **Source code** link in both places opens `VITE_SOURCE_URL` or the pin (above). Two new strings in `locales/en`, `de`, `it` and `tr`: that sentence and "Source code". Files: `src/sourceCode.ts` (new), `src/vite-env.d.ts`, `src/pages/Home.tsx`, `src/pages/Home.scss`, `src/pages/Settings.tsx`, `src/pages/Settings.scss`.
6. **`vercel.json`** (new). Tofu's server hosting, where a copy in an account on a paid plan or the Pro trial runs, answers a path with no file behind it with its own 404 page, so without this file a reload on `/home` or `/writer/<entry>` of such a copy showed that page instead of the diary. It rewrites the diary's four routes to `index.html` and names the static build's install command, so both hostings install, build and route a copy the same way. The static build neither reads nor publishes it.

Left as upstream wrote them: the app's code and pages otherwise, `readme.md` (its pnpm commands and store links are about the upstream project), `.github/FUNDING.yml` and the readme's images, `contributing.md`, `capacitor.config.ts`, the Cypress tests and `scripts/bump_version.py`, none of which a Tofu build reads or runs. The app has no analytics, tracker, ads or update check, and the pages link to nothing outside the copy but the source.

## What works differently on Tofu

- **Biometric unlock** (Face ID, fingerprint) belongs to the store app. In a browser the lock page finds no biometrics and opens the home page at once, so anyone holding the unlocked phone or computer can read the diary.
- **Sync.** **Settings** still offers upstream's optional CouchDB sync. A copy comes with no CouchDB server and Tofu runs none: sync stays off until someone types the address, user and password of a CouchDB they run themselves (reachable over HTTPS and allowing the copy's address in its CORS settings). Nothing in the copy depends on it.
- **No reminders or notifications** (upstream has none either).
- **Opening the app needs a connection.** There is no service worker, so the page itself loads from the copy's address; the entries are in the browser and need no connection. "Add to Home Screen" works with the app's own manifest and icons.
- **Browsers.** Without the legacy plugin the build targets Vite 8's default, browsers from about 2023 on (Chrome and Edge 111, Firefox 114, Safari and iOS 16.4); upstream's extra bundles for older ones are gone.

## Licence

AGPL-3.0, in `license`, kept as it is with every copyright line. Each source file Tofu changed or added carries a dated note saying so (`vite.config.ts`, `vitest.config.ts`, `src/sourceCode.ts`, `src/vite-env.d.ts`, `src/pages/Home.tsx`, `src/pages/Home.scss`, `src/pages/Settings.tsx`, `src/pages/Settings.scss`); the JSON files cannot hold a comment and are listed here instead: `package.json`, `package-lock.json`, `vercel.json` (new) and the four `locales/*/translation.json`. The name **memoria** and its icons are the upstream author's. The Inter font is bundled from `@fontsource/inter` (SIL Open Font License 1.1) and the icons from Ionicons (MIT). The modified source of what Tofu hosts is this public repository at the tag the gallery pins on the `tofu` branch, `pin/2026-10-28`, and each copy's **Source code** link opens the exact commit it was made from.

## Verification

Run on 2026-10-28 on macOS (Apple silicon) with Node 22.22.3 and npm 10.9.8. Nothing was deployed.

1. **Files as Tofu delivers them:** `git archive tofu | tar -x` into a new folder, then `find . -type f -exec chmod a-x {} +` (Tofu's import keeps no file modes). Nothing in the build runs a repository file directly.
2. **Install:** `npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org` (the static build's own flags): 929 packages, deprecation warnings only.
3. **Build:** `npm run build --ignore-scripts`: `tsc` passed and `vite build` wrote `dist/` (85 files, 2.7 MB) with one warning, upstream's own (the main script is larger than 500 kB). The same build from the working tree gave the same main script. A build with `VITE_SOURCE_URL=https://github.com/tofu-gallery/memoria/tree/<40 hex>` carries that address. `npx vitest run`: 1 file, 4 tests passed.
4. **Serve:** `dist/` on 127.0.0.1 behind a small server that answers paths the way Tofu's static hosting does (the file, else `index.html` for a page visit). `/`, `/home`, `/database`, `/settings` and `/writer/<entry>` answered 200 with the app; a missing file answered 404.
5. **Browser** (headless Chromium 156, 127.0.0.1 only), at 390 by 844 (a phone, touch) and at 1200 by 750: the lock page passed on to the home page; the footer showed the sentence and the **Source code** link to the pin; a reflection for the day and a titled memory were written and saved; **Open database** listed both; after a reload both were still there; the reflection read back in the writer; **Settings** showed the sentence and the link, with no sync server set (`remote_address`, `remote_username` and `remote_password` all null); no page errors, no request left 127.0.0.1, and no page overflowed sideways at either size.
6. **Tofu's own checks** (`lane_check_r9.mts` on the QA checkout of Tofu's `main`, which imports the branch as the GitHub import does): `build: eligible` for the static lane, `safety ok (0 findings)`, 68 of 500 published files.
7. **Live check script:** `live-check.py` (kept with the gallery's QA notes) against the local server: `RESULT PASS`.

Not run: ESLint, Prettier and the Cypress tests. No Docker image was built (there is none).

## Still needs a real deploy

- The static build on Tofu's Linux machine with Node 24, from `package-lock.json` (here macOS with Node 22).
- A reload on `/home` or `/writer/<entry>` on the live address answering the app.
- The diary kept across visits in Safari on an iPhone and Chrome on Android, and "Add to Home Screen" there.
- On a copy made by Tofu's gallery, the **Source code** link opening that copy's commit.
