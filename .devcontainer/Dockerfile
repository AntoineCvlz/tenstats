# Single development image: Python 3.12 (ETL) + Node 22 (web) + make.
# Rationale: one toolchain for both stacks so no language runtime is installed
# on the host. See docs/adr/0002-containerised-development-environment.md.
FROM python:3.12-bookworm

ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# uv is the Python package manager (pinned image tag keeps builds reproducible).
COPY --from=ghcr.io/astral-sh/uv:0.9-bookworm /usr/local/bin/uv /usr/local/bin/uvx /usr/local/bin/

# Node is copied from the official image rather than installed from a third-party
# APT repository: fewer moving parts and an exact, auditable origin.
COPY --from=node:22-bookworm /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    make \
    git \
    postgresql-client \
  && rm -rf /var/lib/apt/lists/* \
  && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
  && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
  && ln -s /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack \
  && corepack enable pnpm \
  && groupadd --gid ${USER_GID} ${USERNAME} \
  && useradd --uid ${USER_UID} --gid ${USER_GID} --create-home --shell /bin/bash ${USERNAME} \
  && git config --system --add safe.directory /workspace

# Playwright system libraries. Installed in the image because every
# `docker compose run` starts a fresh container, which would lose APT state.
# Keep the version aligned with @playwright/test in web/package.json.
RUN npx --yes playwright@1.64.0 install-deps chromium \
  && rm -rf /var/lib/apt/lists/* /root/.npm

# Dependency trees live in named volumes owned by the dev user (see
# docker-compose.yml); bind-mounting them from Windows would be slow and
# would mix host and container binaries.
RUN mkdir -p /workspace/etl/.venv /workspace/web/node_modules \
       /home/${USERNAME}/.cache /home/${USERNAME}/.local/share/pnpm \
  && chown -R ${USER_UID}:${USER_GID} /workspace /home/${USERNAME}

ENV PNPM_HOME=/home/${USERNAME}/.local/share/pnpm \
    PATH=/home/${USERNAME}/.local/share/pnpm:/workspace/etl/.venv/bin:$PATH \
    UV_PROJECT_ENVIRONMENT=/workspace/etl/.venv \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/home/${USERNAME}/.cache/ms-playwright

USER ${USERNAME}
WORKDIR /workspace

CMD ["sleep", "infinity"]
