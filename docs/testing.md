# Testing

This project uses [Vitest](https://vitest.dev/) for unit testing and [Playwright](https://playwright.dev/) for end-to-end testing. Tests run locally without requiring a full Next.js build.

## Running Tests

```bash
# Run all unit tests once
npm test

# Run unit tests in watch mode (re-runs on file save)
npm run test:watch

# Run unit tests with a coverage report
npm run test:coverage

# Run end-to-end tests
npx playwright test
```

To run the full suite of checks (type checking, linting, unit tests, and end-to-end tests) in one command:

```bash
npm run check
```

This replaces `npm run build` for local validation during development. Use `npm run build` only for deployment.

## Project Structure

Unit tests live under `tests/unit/` and Playwright tests live under `tests/playwright/`, mirroring the structure of the source files they test:

```
tests/
  unit/
    app/
      api/
        data/
          POST.test.ts        ← API route tests
  playwright/
    add-dataset.spec.ts       ← End-to-end tests
src/
  app/
    api/
      data/
        POST.ts
  components/
    PuzzleGame.tsx
```

## Writing Tests

### API Route Tests

API routes are tested by calling the handler function directly with a mock `Request` object and asserting on the response status and body. Supabase is mocked so no live database is required.

```typescript
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(),
}))

import { POST } from '@/app/api/data/POST'
import { getSupabaseClient } from '@/lib/supabase'

const makeRequest = (body: object) =>
  new Request('http://localhost/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/data', () => {
  it('returns 201 on valid input', async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: [{ id: 'abc' }], error: null }),
        }),
      })),
    } as any)

    const res = await POST(makeRequest({
      slug: 'planets-by-size',
      title: 'Planets by Size',
      description: 'Sort the planets.',
      items: [{ name: 'Mercury', order: 1 }, { name: 'Mars', order: 2 }],
    }) as any)

    expect(res.status).toBe(201)
  })
})
```

Key things to test in API routes:
- Valid input returns the expected status code and body
- Missing or invalid fields return 400
- Conflict cases (e.g. duplicate slug) return 409
- Database errors return 500

### Component Tests

Component tests use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to render components and assert on their behaviour.

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('shows an error when submitted empty', async () => {
    render(<MyComponent />)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})
```

Key things to test in components:
- Validation messages appear when expected
- Form submission calls the correct API with the correct payload
- UI state changes correctly in response to user interaction

### Mocking `fetch`

For components that call `fetch`, mock it using `vi.stubGlobal`:

```typescript
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: 'Dataset created successfully' }),
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})
```

### End-to-End Tests

Playwright tests live in `tests/playwright/` and test full user flows against a running instance of the app. They should cover critical paths like submitting the add dataset form and playing a puzzle.

```typescript
import { test, expect } from '@playwright/test'

test('user can add a dataset', async ({ page }) => {
  await page.goto('/add')
  await page.getByLabel('Title').fill('Planets by Size')
  await page.getByLabel('Description').fill('Sort the planets.')
  // ... fill in items
  await page.getByRole('button', { name: /save dataset/i }).click()
  await expect(page.getByText(/dataset added/i)).toBeVisible()
})
```

Key things to test with Playwright:
- Full form submission flows
- Error states visible to the user (e.g. duplicate slug)
- Navigation between pages

## Configuration

Vitest is configured in `vitest.config.ts` at the project root and targets `tests/unit/`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

To use `jsdom` for component tests (required for React Testing Library), add a file-level override at the top of the test file:

```typescript
// @vitest-environment jsdom
```

Playwright is configured in `playwright.config.ts` and targets `tests/playwright/`.

## What `npm run check` Covers

| Check | Command | What it catches |
|---|---|---|
| Type checking | `tsc --noEmit` | TypeScript type errors across the whole project |
| Linting | `eslint src/` | Code style issues, unused variables, React hook violations |
| Unit tests | `vitest run` | Logic errors in API routes and component behaviour |
| End-to-end tests | `npx playwright test` | Full user flows and UI behaviour in a real browser |