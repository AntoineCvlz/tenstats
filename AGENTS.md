# AGENTS.md

Règles à respecter par tout agent IA (Claude Code, Cursor, Copilot, etc.) travaillant sur ce dépôt.
En cas de conflit entre une instruction ponctuelle et ce fichier, signale le conflit et demande confirmation.

## 1. Contexte

Site personnel d'analyse de données de tennis (ATP/WTA), en ligne, sans utilisateurs réels.
Données : dépôts de Jeff Sackmann (`tennis_atp`, `tennis_wta`), licence CC BY-NC-SA 4.0 (non commercial, attribution obligatoire).

| Couche | Choix |
|---|---|
| ETL + calculs | Python 3.12, Polars, DuckDB, Pydantic v2, Alembic |
| Base | PostgreSQL (Neon) |
| Web | Next.js (App Router, Server Components), TypeScript strict, Tailwind, Drizzle (lecture seule), Zod |
| Tests | pytest + hypothesis ; Vitest + Testing Library + Playwright |
| Outils | `uv` (Python), `pnpm` (Node), Makefile |

Principes : séparation stricte `etl/` et `web/`, la base de données est le seul contrat entre les deux, le web ne fait que **lire**.

## 2. Méthode de travail

1. **Avant de coder** : reformule la tâche, liste les fichiers impactés, propose un plan court. Attends mon accord si la tâche touche plus de 3 fichiers ou modifie l'architecture.
2. **Petits incréments** : une fonctionnalité = une branche = une PR, idéalement moins de 400 lignes modifiées.
3. **TDD quand pertinent** : tests d'abord, code ensuite.
4. **Boucle de vérification** : après chaque modification, exécute lint, typage et tests (`make check`), corrige jusqu'à ce que tout soit vert. Ne déclare jamais « terminé » sans l'avoir fait.
5. **Respect de l'existant** : lis le code voisin et imite ses conventions avant d'écrire.
6. **Périmètre** : pas de refactor non demandé. Signale les problèmes rencontrés hors périmètre sans les corriger sans accord.
7. **Garde-fous qualité** : ne modifie jamais les règles de lint, la config CI, les seuils de couverture ou les tests existants pour faire passer un échec, sauf demande explicite.

## 3. Interdictions

- Inventer une donnée, une colonne, une API, une fonction de bibliothèque ou un résultat statistique. En cas de doute : vérifie dans le code ou la doc, ou dis que tu ne sais pas.
- Ajouter une dépendance sans justification (besoin, alternative native, taille, maintenance) et sans accord.
- Commiter des secrets, des données brutes volumineuses ou des fichiers générés.
- Désactiver une règle de lint/typage globalement. Une exception locale doit être commentée avec la raison.
- Exécuter une commande destructive (`DROP`, `rm -rf`, force push, reset de base) sans confirmation explicite.
- Écrire en base depuis `web/`.
- Concaténer du SQL : requêtes paramétrées uniquement.
- Utiliser `any`, `@ts-ignore`, `except:` nu, `catch` vide, `print` (utiliser le logging).

## 3 bis. Clean code (toutes langues)

- Un module = une responsabilité ; une fonction = une action ; ~30 lignes max ; 4 paramètres max (sinon objet/dataclass).
- Noms explicites en anglais, pas d'abréviations obscures, pas de nombres magiques.
- DRY sans abstraction prématurée (KISS, YAGNI).
- Fonctions pures par défaut ; I/O et base isolés dans des couches dédiées ; dépendances injectées ; pas de globals mutables.
- Pas de code mort ni de code commenté ; pas de `TODO` sans issue référencée.
- Commentaires pour le **pourquoi** uniquement.
- Erreurs typées avec messages exploitables.
- Immutabilité préférée (`frozen=True`, `readonly`).

## 4. Règles Python (`etl/`)

- Typage complet, `mypy --strict`.
- Ruff (E, F, I, B, UP, N, C90, SIM, PL, RUF, S, PT), complexité cyclomatique max 10.
- Validation Pydantic v2 en entrée du pipeline (schéma, valeurs aberrantes, doublons).
- Docstrings Google sur toute fonction publique.
- Chargement en base idempotent (upsert/transactions), migrations Alembic versionnées.
- Elo : fonction pure, ordre chronologique strict.
- Tests : pytest, hypothesis pour les propriétés, couverture ≥ 85 %.

## 5. Règles TypeScript (`web/`)

- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- ESLint (typescript-eslint strict, react-hooks, jsx-a11y, import, sonarjs) + Prettier.
- Server Components par défaut ; `"use client"` seulement si l'interactivité l'exige.
- Organisation par fonctionnalité (`features/player`, `features/h2h`, `features/tournament`).
- Entrées (URL, query strings) validées avec Zod.
- Accessibilité WCAG AA ; chaque graphique a une alternative textuelle ou un tableau.
- Pas de requête N+1 ; cache/ISR pour les pages de données.
- Tests : Vitest + Testing Library, Playwright pour les parcours clés, couverture ≥ 80 %.

## 6. Rigueur data et statistiques

- Toute statistique affichée précise sa **définition**, sa **période** et sa **taille d'échantillon**. Signaler les échantillons faibles (< 20 matchs).
- Valeurs manquantes gérées explicitement (stats détaillées absentes sur les matchs anciens) : jamais de remplacement silencieux.
- Modèle prédictif : split chronologique, aucune fuite du futur, métriques de calibration (Brier, log-loss), comparaison à une baseline (Elo seul).
- Ne jamais présenter une corrélation comme une causalité.

## 7. Git et CI

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `ci:`), messages en anglais.
- Merge via PR uniquement, `main` protégée, CI verte obligatoire, squash merge.
- Hooks pre-commit : format, lint, typage, détection de secrets (gitleaks).
- La CI doit rester verte : lint, typage, tests, e2e, audit de sécurité, CodeQL, build, Lighthouse.

## 8. Sécurité

- Secrets uniquement dans GitHub Secrets / variables d'environnement Vercel, validées au démarrage.
- Utilisateur Postgres en lecture seule pour le web, distinct de celui de l'ETL.
- Headers de sécurité (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).
- Aucune donnée personnelle collectée.

## 9. Format des réponses de l'agent

- Réponds en **français** ; code, noms, commentaires et commits en **anglais**.
- Concis et factuel : pas de flatterie, pas de remplissage, pas de longue introduction.
- Après chaque tâche, structure la réponse ainsi :
  1. Ce qui a été fait
  2. Fichiers modifiés
  3. Commandes de vérification lancées et leur résultat **réel**
  4. Limites et points à valider
- Montre uniquement le code modifié ou nouveau, avec le chemin du fichier.
- Distingue ce qui est **vérifié** (tests exécutés) de ce qui est **supposé**.
- Demande ambiguë ou contradictoire : **une seule question ciblée**, ou 2 options avec leurs compromis.
- Si tu ne peux pas exécuter une commande ou accéder à une ressource, dis-le au lieu de simuler un résultat.

## 10. Definition of Done

- [ ] Code conforme, lint + format + typage sans erreur
- [ ] Tests ajoutés ou mis à jour, couverture respectée, tous verts
- [ ] CI verte
- [ ] Documentation à jour (README, data-dictionary, ADR si décision structurante)
- [ ] Commit conforme aux Conventional Commits
- [ ] Aucun secret, aucune donnée brute, aucun warning ignoré
