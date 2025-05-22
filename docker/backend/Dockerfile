FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

COPY ./backend/pyproject.toml ./backend/uv.lock ./

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# First sync dependencies without installing the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-install-project --no-dev

# Then sync with locked dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Copy application code
COPY ./backend /app

ENV PATH="/app/.venv/bin:$PATH"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]