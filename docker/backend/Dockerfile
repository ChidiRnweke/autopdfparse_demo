FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

COPY ./backend/pyproject.toml ./backend/uv.lock ./


ENV UV_COMPILE_BYTECODE=1

ENV UV_LINK_MODE=copy

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev



RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

COPY ./backend /app


ENV PATH="/app/.venv/bin:$PATH"

ENTRYPOINT []


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]