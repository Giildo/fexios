# Audit — fexios

> Comparaison avec `immersup/front` (référence la plus récente et la plus outillée)
>
> - analyse des dépendances et des vulnérabilités.
>
> **Date** : 2026-11-24 · **Statut** : ✅ exécuté (voir §8)
>
> Contexte : `fexios` est une **lib** (Vite lib mode, ESM-only, zéro dep runtime),
> pas un app. On n'a donc **pas** importé les deps Vue/Playwright/Stryker de la
> référence — seulement ce qui est pertinent pour une lib.

---

## TL;DR — les actions qui comptent

| #   | Action                                                                                              | Impact                                        | Effort    |
| --- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------- |
| 1   | Supprimer 3 deps mortes (`@eslint/js`, `globals`, `jiti`)                                           | -de bruit                                     | 🟢 faible |
| 2   | Upgrader `oxfmt` → `^0.67.0`                                                                        | corrige **2 vulns critical** (tinypool)       | 🟢 faible |
| 3   | Ajouter `typescript` en dep explicite                                                               | supprime la fragilité (transitif aujourd'hui) | 🟢 faible |
| 4   | Upgrader `oxlint` + `eslint-plugin-oxlint` → `~1.82.0`                                              | aligne l'écosystème ox                        | 🟢 faible |
| 5   | Upgrader `vitest` + `@vitest/*` → `^5`                                                              | major                                         | 🟠 moyen  |
| 6   | Corriger les vulns du package `docs` (override vite)                                                | -9 vulns (high/moderate)                      | 🟠 moyen  |
| 7   | Aligner les configs (`.editorconfig`, `lefthook`, `.gitignore`, `.gitattributes`, `packageManager`) | hygiène                                       | 🟢 faible |

---

## 1. Config à upgrade

| Config                | Actuel (fexios)                                                  | Référence (immersup)                                                  | Reco                                               | Pourquoi                                                                              |
| --------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `.editorconfig`       | `max_line_length = 100`, cible `[*]`                             | `max_line_length = 120`, cibles typées                                | **Aligner à 120**                                  | Incohérent avec `oxfmt.printWidth = 120`.                                             |
| `lefthook.yml`        | 4 commandes parallèles, dont `stylelint` sur `packages/**/*.css` | Logique branch-based                                                  | **Supprimer le hook `stylelint` mort**             | fexios n'a **ni stylelint ni CSS ni dossier `packages/`** → le hook ne matche jamais. |
| `.oxlintrc.json`      | pas de `ignorePatterns`                                          | `ignorePatterns: [dist, coverage, …]`                                 | **Ajouter `ignorePatterns`**                       | Évite de linter `dist/`/`coverage/` si oxlint est lancé seul.                         |
| `.gitignore`          | manque `coverage`, `*.tsbuildinfo`                               | les a                                                                 | **Ajouter `coverage` + `*.tsbuildinfo`**           | Vitest génère `coverage/` ; TS génère `*.tsbuildinfo`.                                |
| `.gitattributes`      | **absent**                                                       | `* text=auto eol=lf`                                                  | **Créer**                                          | Force les fins de ligne LF cross-plateforme.                                          |
| `package.json`        | pas de `packageManager` ; `engines.node: >=22.0.0`               | `packageManager: pnpm@12.x` ; `engines.node: ^22.18.0 \|\| >=24.12.0` | **Ajouter `packageManager`** ; resserrer `engines` | `packageManager` (corepack) verrouille la version pnpm.                               |
| `pnpm-workspace.yaml` | pas de `catalog:`                                                | versions centralisées en `catalog:`                                   | **Adopter les `catalog:`**                         | Cohérence avec les autres projets unistra.                                            |

> [!note]
> Le `tsconfig.json` de fexios (fichier unique) est **correct pour une lib**.
> Le setup multi-tsconfig de la référence n'a de sens que quand on a des tests
>
> - un app. On le reverra **si on ajoute des tests**.

---

## 2. Deps à upgrade

| Dep                     | Déclaré (fexios) | Référence  | Reco                       | Note                                           |
| ----------------------- | ---------------- | ---------- | -------------------------- | ---------------------------------------------- |
| `oxfmt`                 | `^0.54.0`        | `^0.67.0`  | **→ `^0.67.0`**            | 🔴 corrige 2 vulns **critical** (tinypool).    |
| `oxlint`                | `~1.69.0`        | `~1.82.0`  | **→ `~1.82.0`**            | Avec `eslint-plugin-oxlint` (même écosystème). |
| `eslint-plugin-oxlint`  | `~1.69.0`        | `~1.82.0`  | **→ `~1.82.0`**            | En synchro avec oxlint.                        |
| `vitest`                | `^4.1.9`         | `^5.1.1`   | **→ `^5.1.1`**             | ⚠️ **major** (4 → 5).                          |
| `@vitest/coverage-v8`   | `^4.1.9`         | `^5.x`     | **→ aligner sur vitest 5** | Doit matcher la major de vitest.               |
| `@vitest/eslint-plugin` | `^1.6.20`        | `^1.6.28`  | **→ `^1.6.28`**            | Mineur.                                        |
| `vite`                  | `^8.0.16`        | `^8.3.8`   | → `^8.3.8`                 | Hygiène (range).                               |
| `eslint`                | `^10.5.0`        | `^10.15.0` | → `^10.15.0`               | Hygiène (range).                               |
| `lefthook`              | `^2.1.9`         | `^2.2.2`   | → `^2.2.2`                 | Hygiène (range).                               |
| `@types/node`           | `^26.0.0`        | `^26.6.6`  | → `^26.6.6`                | Hygiène (range).                               |
| `npm-run-all2`          | `^9.0.2`         | `^9.1.0`   | → `^9.1.0`                 | Hygiène (range).                               |

> [!note]
> Les 5 dernières lignes étaient déjà bumpées par un `pnpm update` avant l'audit ;
> elles sont reprises dans le `catalog:` pour figer les versions.

---

## 3. Deps à supprimer

> [!warning]
> **Correction après exécution** : `@microsoft/api-extractor` n'est **PAS** morte.
> `vite-plugin-dts` avec `bundleTypes: true` l'exige (peer dep de build) — le build
> échoue sans elle : `Failed to load '@microsoft/api-extractor'`. Elle est **gardée**.
> Mon grep initial ne la voyait pas : ce n'est pas une référence dans le code, mais
> une exigence de build. (La vuln `minimatch` qui passait par elle est corrigée via
> un `overrides` au lieu de supprimer la dep.)

Aucune de ces 3 deps n'est référencée dans le code (vérifié par grep sur
`src/`, `types/`, et toutes les configs).

| Dep          | Version   | Raison                                                               |
| ------------ | --------- | -------------------------------------------------------------------- |
| `@eslint/js` | `^10.0.1` | Morte — `eslint.config.ts` utilise `eslint/config`, pas `@eslint/js` |
| `globals`    | `^17.6.0` | Morte — non importée dans `eslint.config.ts`                         |
| `jiti`       | `^2.7.0`  | Redondante — c'est une dep **transitive** d'`eslint`                 |

---

## 4. Deps à ajouter

| Dep          | Version   | Raison                                                                                                   | Priorité     |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------- | ------------ |
| `typescript` | `~6.0.3`  | Aujourd'hui **transitif** (via `typescript-eslint`) → `tsc` marche par chance. À déclarer explicitement. | 🔴 haute     |
| `knip`       | `^6.42.1` | Détecte deps/exports/fichiers morts. Très utile pour une **lib**.                                        | 🟢 optionnel |

> [!note]
> Pas de `stylelint`, `playwright`, `stryker`, `vitest-axe`, `vue-*` : ce sont
> des outils d'**app**, pas de lib. On ne les importe pas.

---

## 5. Inventaire des deps (usage)

fexios n'a **aucune dependency runtime** (zéro dep — c'est le point fort de la lib).
Tout est en `devDependencies`.

| Dep                        | Usage                                                   | Statut final                 |
| -------------------------- | ------------------------------------------------------- | ---------------------------- |
| `vite`                     | Build (lib mode, format ES)                             | ✅ keep                      |
| `vite-plugin-dts`          | Génère les `.d.ts` (bundle)                             | ✅ keep (cœur de la lib)     |
| `@microsoft/api-extractor` | **Requise** par `vite-plugin-dts` (`bundleTypes: true`) | ✅ keep (peer de build)      |
| `vitest`                   | Runner de tests unitaires                               | ⬆️ → 5.1.1                   |
| `@vitest/coverage-v8`      | Provider de coverage vitest                             | ⬆️ → 5.1.1                   |
| `@vitest/eslint-plugin`    | Règles ESLint pour les tests                            | ⬆️ → 1.6.28                  |
| `eslint`                   | Linter principal                                        | ✅ keep                      |
| `typescript`               | `tsc` (type-check)                                      | ➕ **add** explicite (6.0.3) |
| `typescript-eslint`        | Config ESLint pour TS (type-aware)                      | ✅ keep                      |
| `eslint-config-prettier`   | Désactive les règles de format dans ESLint              | ✅ keep                      |
| `eslint-plugin-oxlint`     | Pont règles oxlint → ESLint                             | ⬆️ → 1.82.0                  |
| `oxlint`                   | Linter rapide (1er passe)                               | ⬆️ → 1.82.0                  |
| `oxfmt`                    | Formatteur                                              | ⬆️ → 0.67.0 (🔴 vulns)       |
| `lefthook`                 | Git hooks (pre-commit)                                  | ✅ keep                      |
| `npm-run-all2`             | `run-s` / `run-p` dans les scripts                      | ✅ keep                      |
| `@types/node`              | Types Node pour TS                                      | ✅ keep                      |
| `knip`                     | Détection de code mort                                  | ➕ **add**                   |
| `@eslint/js`               | —                                                       | ❌ **supprimée**             |
| `globals`                  | —                                                       | ❌ **supprimée**             |
| `jiti`                     | —                                                       | ❌ **supprimée**             |

---

## 6. Sécurité (`pnpm audit`)

**Avant** : 12 vulnérabilités (2 critical · 1 high · 8 moderate · 1 low).

| Sév.                       | Paquet             | Via                        | Fix appliqué                                |
| -------------------------- | ------------------ | -------------------------- | ------------------------------------------- |
| 🔴 critical (×2)           | `tinypool`         | `oxfmt`                    | `oxfmt` → `^0.67.0`                         |
| 🟠 high + 🟡 moderate (×7) | `vite` / `esbuild` | `docs > vitepress > …`     | `overrides` `vitepress>vite` → `>=6.4.4 <7` |
| 🟡 moderate                | `minimatch`        | `@microsoft/api-extractor` | `overrides` `minimatch` → `>=11.0.1`        |
| 🟢 low                     | `vite`             | `docs > vitepress > …`     | idem (override vite)                        |

> [!note]
> Le gros du problème (1 high + 8 moderate) venait du **package `docs`** :
> `vitepress@1.6.4` (dernière dispo) tire un `vite` 5.x vulnérable. Corrigé par un
> `overrides` ciblé qui force un `vite` 6.x patché **uniquement** pour le package
> docs, sans toucher au `vite@8.x` de la racine. Le build docs passe toujours.

---

## 7. Décisions (exécutées ✅)

- [x] **D1** — Supprimer 3 deps mortes (`@eslint/js`, `globals`, `jiti`) — ⚠️ `@microsoft/api-extractor` **gardée** (requise par `bundleTypes`)
- [x] **D2** — Upgrader `oxfmt` → `^0.67.0` (corrige les 2 critical)
- [x] **D3** — Ajouter `typescript` en dep explicite (`~6.0.3`)
- [x] **D4** — Upgrader `oxlint` + `eslint-plugin-oxlint` → `~1.82.0`
- [x] **D5** — Upgrader `vitest` + `@vitest/*` → `^5`
- [x] **D6** — Corriger les vulns du package `docs` (override `vitepress>vite` → 6.x patché)
- [x] **D7** — Aligner les configs (`.editorconfig` 120, `lefthook` sans stylelint, `.gitignore`, `.gitattributes`, `packageManager`, `engines`)
- [x] **D8** — Ajouter `knip`
- [x] **D9** — Adopter les `catalog:` pnpm

---

## 8. Résultat final

- ✅ `pnpm build` (lib) passe — `dist/fexios.js` 1.72 kB
- ✅ `pnpm docs:build` passe (l'override D6 ne casse pas vitepress)
- ✅ `pnpm lint` + `pnpm format` passent
- ✅ `pnpm audit` : **0 vulnérabilité** (down de 12)
- ✅ 3 deps mortes supprimées, `typescript` + `knip` ajoutées, `api-extractor` gardée

> [!tip]
> Prochaine étape naturelle : **ajouter des tests unitaires** (vitest est en place
> mais il n'y a aucun test). C'est là que le setup gagnerait en valeur.
