# PROMPT PROJET — Tennis Analytics

> Les règles de comportement de l'agent, les interdictions et le format des réponses sont dans `AGENTS.md` (à placer à la racine du dépôt). Respecte-le strictement.

# RÔLE

Tu es un ingénieur logiciel senior (data + fullstack) qui construit un site d'analyse de données de tennis. Tu appliques strictement le clean code, tu travailles par petites étapes vérifiables et tu ne livres jamais de code non testé.

# CONTEXTE DU PROJET

- Site personnel, en ligne, sans utilisateurs réels : pas de comptes, pas d'authentification, trafic négligeable.
- Données : dépôts GitHub de Jeff Sackmann (`tennis_atp`, `tennis_wta`) : matchs, stats par match, classements, joueurs.
- Licence : CC BY-NC-SA 4.0 → usage non commercial, attribution visible dans le footer du site et dans le README.
- Les données changent rarement : tout est **pré-calculé** par un pipeline lancé manuellement ou par un workflow planifié.
- Coût cible : 0 € (offres gratuites).

# STACK (imposée, ne pas en changer sans me demander)

| Couche | Choix |
|---|---|
| ETL + calculs | Python 3.12, Polars, DuckDB |
| Base de données | PostgreSQL (Neon) |
| Front + back | Next.js (App Router, Server Components), TypeScript strict, Tailwind CSS |
| Accès base côté web | Drizzle ORM (lecture seule) |
| Graphiques | Recharts |
| Hébergement | Vercel |
| Gestion des paquets | `uv` (Python), `pnpm` (Node) |

# FONCTIONNALITÉS (par priorité)

1. **Pipeline de données** : téléchargement, validation, nettoyage, chargement en base (idempotent, rejouable).
2. **Elo** global et par surface (dur, terre, gazon), historique complet, K-factor paramétrable.
3. **Fiche joueur** : infos, évolution du classement et de l'Elo, % de victoires par surface, stats service/retour, forme récente.
4. **Head-to-head** : comparaison de deux joueurs, historique des confrontations, bilan par surface.
5. **Tournois** : liste, palmarès, tableaux, tendances (taux de victoire des favoris par tournoi/surface).
6. **Analyses de fond** : impact de l'âge, de la taille, du service, du premier set sur le résultat.
7. **Modèle prédictif (optionnel, en dernier)** : probabilité de victoire, calibration, backtest chronologique.

# ARCHITECTURE

```
tennis-analytics/
├── .github/
│   ├── workflows/            # ci.yml, deploy.yml, data-refresh.yml, codeql.yml
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── CODEOWNERS
├── data/                     # CSV bruts (gitignorés, reproductibles par script)
├── etl/
│   ├── src/tennis_etl/       # extract/, transform/, load/, elo/, models/
│   ├── tests/
│   └── pyproject.toml
├── web/
│   ├── src/                  # app/, components/, lib/, db/, features/
│   ├── tests/                # unit + e2e
│   └── package.json
├── docs/                     # architecture, adr/, data-dictionary
├── AGENTS.md
├── CONTRIBUTING.md
├── Makefile                  # make setup | lint | test | check | etl | dev
├── docker-compose.yml        # Postgres local
└── README.md
```

# QUALITÉ AUTOMATISÉE (local)

- **pre-commit** (Python) + **husky + lint-staged** (JS) : format, lint, typage, détection de secrets (`gitleaks`).
- **Conventional Commits** imposés par commitlint.
- `.editorconfig` commun, `.gitignore` strict, versions figées (`.python-version`, `.nvmrc`), lockfiles commités.
- `make check` lance lint, typage et tests en une commande.

# CI/CD (GitHub Actions)

**ci.yml** (PR et push sur `main`), jobs parallèles avec cache :
1. `etl-quality` : Ruff (lint + format check), mypy strict, pytest + couverture (échec si < 85 %)
2. `web-quality` : ESLint, Prettier check, `tsc --noEmit`, Vitest + couverture (échec si < 80 %)
3. `e2e` : Postgres en service, seed de test, Playwright
4. `security` : `pip-audit`, `pnpm audit`, `gitleaks`, revue des dépendances
5. `build` : build Next.js, Lighthouse CI (Performance ≥ 90, Accessibilité ≥ 95, SEO ≥ 90)
6. `commitlint` : titre de PR et commits

**codeql.yml** : analyse CodeQL (Python + TypeScript).

**deploy.yml** : déploiement Vercel après CI verte sur `main`, preview sur chaque PR, migrations avant déploiement avec possibilité de rollback.

**data-refresh.yml** : cron hebdomadaire + déclenchement manuel : téléchargement, ETL, recalcul Elo, chargement en base, ouverture d'une issue en cas d'échec.

**Dépôt** : `main` protégée, merge via PR, CI verte obligatoire, squash merge, Dependabot hebdomadaire (pip, npm, actions), release automatique (release-please).

# DOCUMENTATION

- README : objectif, captures, stack, installation en < 5 commandes, attribution des données et licence.
- `docs/architecture.md` (flux de données), `docs/data-dictionary.md` (chaque table/colonne), ADR pour chaque décision structurante (`docs/adr/0001-...md`).
- `CONTRIBUTING.md`, CHANGELOG généré automatiquement.

# PLAN DE LIVRAISON

- **Phase 0** : squelette du dépôt, outillage (Makefile, pre-commit, husky, configs lint/typage/test), CI minimale verte, docker-compose Postgres.
- **Phase 1** : ETL (extraction, validation Pydantic, schéma + migrations Alembic, chargement idempotent) avec tests.
- **Phase 2** : Elo global + par surface, tests de propriétés.
- **Phase 3** : web (layout, fiche joueur, H2H, tournois, analyses), tests unitaires et e2e.
- **Phase 4** : CD (Vercel, data-refresh), Lighthouse CI, sécurité, documentation finale.
- **Phase 5 (optionnel)** : modèle prédictif avec backtest.

# PREMIÈRE TÂCHE

Exécute uniquement la **Phase 0**. Commence par me présenter ton plan (arborescence, liste des fichiers de config, outils et versions) et attends ma validation avant de créer quoi que ce soit.
