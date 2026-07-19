# Contributing to CampusOS

Welcome! We appreciate your help in making CampusOS better.

## Coding Conventions
* **Frontend**: React 19, TypeScript, Tailwind CSS. Use functional components and hooks. Avoid default exports where possible. Use `lucide-react` for icons.
* **Backend**: FastAPI, Python 3.10+. Use type hints strictly. All database queries must use SQLAlchemy ORM (avoid raw SQL strings).
* **Linting**: We enforce `oxlint` on the frontend and `mypy` on the backend.

## Branching Strategy
We follow a simplified Git Flow:
* `main`: Production-ready code.
* `dev`: Integration branch for active work.
* Feature branches: `feat/feature-name` (branch off from `dev`).
* Bugfix branches: `fix/bug-name`.

## Commit Message Format
Please use Conventional Commits:
* `feat: added student dashboard view`
* `fix: resolved infinite render in transport map`
* `docs: updated readme instructions`
* `test: added pytest for chatbot`

## Pull Request Checklist
1. Branch from `dev`.
2. Ensure tests pass (`npm run test` / `pytest`).
3. Ensure no linting errors.
4. Update documentation if necessary.
5. Request a review from at least one core maintainer.

## Local Development Workflow
See `README.md` for full local setup instructions.
