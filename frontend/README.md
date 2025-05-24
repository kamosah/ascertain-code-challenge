# Frontend for Ascertain Code Challenge

This is the frontend application for the Ascertain Code Challenge, built with React, TypeScript, and Vite.

## Technology Stack

- React 19 with TypeScript
- Vite for building and development
- Mantine UI for component library and styling
- TanStack React Query for data fetching
- React Router for navigation
- Vitest and Testing Library for testing
- Storybook for component documentation

## Project Structure

The frontend follows a clean, organized structure that separates concerns and promotes maintainability:

```text
src/
├── App.css
├── App.tsx
├── assets/                     # Static assets
├── components/                 # Reusable components
│   ├── index.ts               # Component exports
│   ├── layout/                # Layout components
│   │   ├── index.ts
│   │   └── Layout.tsx
│   ├── patients/              # Patient-specific components
│   │   ├── index.ts
│   │   └── PatientRow.tsx
│   └── ui/                    # General UI components
│       ├── index.ts
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── LoadingState.tsx
│       ├── NoResultsState.tsx
│       ├── PatientTable.tsx
│       └── ThemeToggle.tsx
├── providers/                  # React context providers
├── queries/                   # API queries and data fetching
├── stories/                   # Storybook stories
├── styles/                    # Global styles and utilities
├── test/                      # Test utilities and setup
├── views/                     # Page-level components
│   ├── index.ts
│   └── patients/              # Patient views
│       ├── __tests__/         # View-specific tests
│       ├── index.ts
│       ├── PatientDetails.tsx
│       └── PatientList.tsx
└── vite-env.d.ts
```

### Path Aliases

The project uses path aliases for cleaner imports:

- `@` → `src/`
- `@components` → `src/components/`
- `@views` → `src/views/`
- `@ui` → `src/components/ui/`
- `@layout` → `src/components/layout/`
- `@queries` → `src/queries/`
- `@types` → `src/types/`
- `@test` → `src/test/`

### Architecture Decisions

- **Views vs Components**: Page-level components are in `views/`, reusable components are in `components/`
- **UI Components**: Generic UI components are centralized in `components/ui/`
- **Feature Organization**: Related components are grouped by feature (e.g., `patients/`)
- **Index Files**: Each directory has an `index.ts` for clean exports and imports
- **Test Co-location**: Tests are placed near the components they test

## Development Setup

### Prerequisites

- Node.js (v20+)
- pnpm (v9+)

### Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview the production build
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm storybook` - Start Storybook for component development
- `pnpm build-storybook` - Build Storybook for deployment

## Docker Deployment

The frontend can be run in a Docker container. See the root `docker-compose.yml` for configuration details.
