# AGENTS.md — fexios (lib)

## Contexte

**fexios** est une **lib** (pas une app) : un client AJAX minimaliste et type-safe, construit sur l'API native `fetch`. ESM-only, zéro dep runtime.

- **Ce qu'elle fait** : wrappe `fetch` avec une API ergonomique — base URL, headers par défaut, modificateurs fluents (`.credentials`, `.text`), réponses entièrement typées.
- **Principe clé** : **pas de throw sur erreur HTTP** — les erreurs 4xx/5xx sont **retournées** (dans `data` comme `ApiException`, `ok: false`), pas levées. L'appelant garde le contrôle.
- **Nuance** : une **erreur réseau** (fetch qui refuse, ex. hors-ligne) **lève** (pas de `try/catch` autour de `fetch`). Seules les erreurs **HTTP** sont retournées.
- **Cible** : navigateurs modernes + Node ≥ 22 (fetch natif).

## Stack technique

- **TypeScript strict**, **ESM natif** (pas de CommonJS).
- **Vite** en **lib mode** (format ES uniquement) + `vite-plugin-dts` (`bundleTypes: true` → **exige** `@microsoft/api-extractor`).
- **pnpm** (workspaces : racine + `docs/`).
- **Tests** : **Vitest (unitaires uniquement)**. Pas de E2E, pas d'a11y (c'est une lib, pas une UI).
- **Qualité** : ESLint + oxlint, oxfmt.
- **Docs** : VitePress dans `docs/` (package workspace séparé).

> [!note]
> **Zéro dep runtime** : tout est en `devDependencies`. Le package publié n'a **aucune** dépendance.

## Architecture & API

- `src/Fexios.ts` — la classe `Fexios` (méthodes `get`/`post`/`patch`/`put`/`delete`, modificateurs `.credentials`/`.text`).
- `src/FexiosResponse.ts` — `FexiosResponseImpl` (implémentation concrète de la réponse).
- `src/index.ts` — **entrée publique** (exporte `Fexios`). C'est le contrat d'API.
- `types/index.d.ts` — **types publics** (écrits à la main, copiés au build via `copyDtsFiles: true`).

**Le type central** : `FexiosResponse<D, E> = FexiosResponseOK<D> | FexiosResponseError<E>` — union **discriminée par `ok`**. C'est le cœur du typage : l'appelant narrow sur `ok` pour accéder à `data`.

**Comportement à connaître** : les modificateurs `.credentials` / `.text` sont **one-shot** — ils s'appliquent au prochain appel puis sont réinitialisés (`#reset()`). Ce n'est pas un état persistant.

**Aliases** : `@` → `src/`, `#` → `types/` (configurés dans `vite.config.ts` + `tsconfig.json`).

## Conventions de travail

- **Stabilité de l'API publique** : l'API = ce qui est exporté par `src/index.ts` + les types de `types/index.d.ts`. Tout changement est potentiellement **breaking** → à trancher avec l'humain.
- **Typage strict** : pas de `any`, pas de `as` inutile. Le discriminated union `FexiosResponse` est sacré.
- **ESM-only** : jamais de CommonJS.
- **Zéro dep runtime** : ne jamais ajouter une `dependency` (tout est `devDependency`).
- **Pas de throw sur erreur HTTP** : les erreurs HTTP sont retournées, pas levées. C'est le principe de design — ne pas le casser.
- **Tests déterministes** : stubber `fetch` (pas d'appel réseau réel), données en fixture, pas de `sleep`.
- **Notation de test** : `test(...)` plutôt que `it(...)` (préférence projet).
- **Callouts de doc** : syntaxe Markdown standard `> [!tip]` et `> [!note]`.
- **Git** : aucune commande git en écriture sans validation préalable (les commandes de lecture type `git log` sont OK).

## Commandes utiles

```sh
pnpm install          # installation des dépendances
pnpm dev              # dev server (Vite)
pnpm build            # type-check (tsc) + build production (vite build)
pnpm test:unit        # tests unitaires (Vitest)
pnpm type-check       # type-check seul (tsc)
pnpm lint             # lint (oxlint + eslint)
pnpm format           # formatage (oxfmt)
pnpm docs:dev         # docs (VitePress, dev)
pnpm docs:build       # docs (VitePress, build)
```

## Commits (gitmoji)

> [!warning]
> **Ne commiter QUE si l'utilisateur me le dit expressément.**
> Pas de commit « par opportunité », pas de commit en fin de tâche sans demande explicite.
> L'autorisation doit être claire et explicite (« committe ça », « fais le commit », « committe les changements »…).
> En cas de doute, je demande avant de commiter.

Quand l'autorisation est donnée, format exact :

```
<emoji> (part): commit message

Message si nécessaire pour détailler le contenu du commit
```

- `<emoji>` → **emoji Unicode** gitmoji, **un seul**. Pas de shortcode `:tada:` (non affiché dans `git log`).
- `(part)` → scope : la partie du codebase concernée (ex. `api`, `types`, `docs`, `build`, `deps`).
- `commit message` → impératif, minuscule, < 72 caractères, pas de point final.
- Body (ligne vide + texte) → seulement si le « pourquoi » n'est pas évident.
- **Langue** : le message (header) **et** le corps du commit sont **toujours en anglais**.
- **Correction de revue** : si le commit corrige un finding de la revue S3nt1n3l (`.agents/reviews/`), on le **cite dans le body** (ID du finding + date de la revue, ex. « résout le M1 de la revue 2026-11-24 »).

## Release (npm)

> [!warning]
> **Ne faire une release QUE si l'utilisateur me le demande expressément.**
> Pas de release « par opportunité ». L'autorisation doit être claire et explicite.

fexios est publiée sur **npm** (`publishConfig.access: public`). Pas d'outil de changelog configuré (pas de git-cliff) — le changelog est optionnel / manuel.

### Process de release (version `X.Y.Z`)

1. **Bump de version** — changer `"version"` dans `package.json` en `X.Y.Z`.
2. **Commit** — `🔖 (release): bump version to X.Y.Z`.
3. **Build** — `pnpm build` (vérifier que `dist/` est à jour).
4. **Publish** — `pnpm publish`.

> [!tip]
> Pas de tag git ni de changelog automatique pour l'instant. Si on veut un changelog généré, on peut ajouter **git-cliff** (comme immersup) — à trancher avec l'humain.
