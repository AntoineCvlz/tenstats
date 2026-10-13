# All targets are meant to run INSIDE the development container.
# From a host shell use the wrapper: ./dev.ps1 <target> or ./dev.sh <target>.
.DEFAULT_GOAL := help
.PHONY: help setup lint format typecheck test test-e2e build check dev clean \
        etl-lint etl-format etl-typecheck etl-test \
        web-lint web-format web-typecheck web-test web-e2e web-build

ETL_DIR := etl
WEB_DIR := web
PNPM := pnpm --dir $(WEB_DIR)

help: ## Show the available targets
	@grep -hE '^[a-z0-9-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk 'BEGIN {FS = ":.*?## "} {printf "  %-12s %s\n", $$1, $$2}'

setup: ## Install every dependency and the git hooks
	pnpm install
	pnpm run prepare
	cd $(ETL_DIR) && uv sync --all-groups
	$(PNPM) install
	$(PNPM) exec playwright install chromium

lint: etl-lint web-lint ## Lint both stacks

format: etl-format web-format ## Format both stacks in place

typecheck: etl-typecheck web-typecheck ## Type-check both stacks

test: etl-test web-test ## Run unit tests with coverage thresholds

test-e2e: web-e2e ## Run the Playwright end-to-end suite

build: web-build ## Build the production bundle

check: lint typecheck test ## Lint, type-check and test everything

dev: ## Start the Next.js development server on port 3000
	$(PNPM) dev

clean: ## Remove local caches and build output
	rm -rf $(ETL_DIR)/.ruff_cache $(ETL_DIR)/.mypy_cache $(ETL_DIR)/.pytest_cache \
	       $(ETL_DIR)/.coverage $(ETL_DIR)/coverage.xml \
	       $(WEB_DIR)/.next $(WEB_DIR)/coverage \
	       $(WEB_DIR)/playwright-report $(WEB_DIR)/test-results

# --- ETL ---------------------------------------------------------------------

etl-lint:
	cd $(ETL_DIR) && uv run ruff check .
	cd $(ETL_DIR) && uv run ruff format --check .

etl-format:
	cd $(ETL_DIR) && uv run ruff check --fix .
	cd $(ETL_DIR) && uv run ruff format .

etl-typecheck:
	cd $(ETL_DIR) && uv run mypy .

etl-test:
	cd $(ETL_DIR) && uv run pytest

# --- Web ---------------------------------------------------------------------

web-lint:
	$(PNPM) lint
	$(PNPM) format:check

web-format:
	$(PNPM) format

web-typecheck:
	$(PNPM) typecheck

web-test:
	$(PNPM) test:coverage

web-e2e:
	$(PNPM) test:e2e

web-build:
	$(PNPM) build
