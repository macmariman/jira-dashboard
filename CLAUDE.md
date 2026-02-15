# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript type-check (tsc -b) + Vite production build
npm run lint       # ESLint (flat config)
npm run preview    # Preview production build locally
```

No test runner is configured.

## Architecture

React 19 + TypeScript + Vite app that visualizes Jira issue trends. Users drag-and-drop two Jira XML exports (created issues, closed issues) and see a cumulative trend chart plus an output analysis table.

### Data flow

```
XML file → DataAdapter.parse() → IssueRow[] → chart/analysis components
```

- **Adapter pattern** (`src/adapters/`): `DataAdapter` interface with `parse(content: string): IssueRow[]`. Currently only `jiraXmlAdapter` exists. New data sources (CSV, Excel) only need a new adapter — no component changes.
- **`IssueRow`** (`src/types/issue-table.ts`): Source-agnostic intermediate format that all adapters produce and all consumers depend on.
- **`JiraIssueWithDates`** (`src/types/jira.ts`): Internal to the XML parser only — components should never import this directly.

### Key modules

- `src/lib/jira-parser.ts` — XML parsing (`parseJiraXmlWithDates`), date grouping, cumulative chart data preparation
- `src/App.tsx` — State management, file loading orchestration, conditional rendering (drop zone vs results)
- `src/components/TrendLineChart.tsx` — Recharts line chart (created vs closed cumulative)
- `src/components/OutputAnalysis.tsx` — Filters closed issues by label ("Inactiva" → Importantes, "Tarea" → Todo lo demás)
- `src/components/DualFileDropZone.tsx` — Dual drag-and-drop file upload UI

### UI stack

shadcn/ui (Radix primitives) + Tailwind CSS 4 + Recharts. Path alias `@/*` maps to `./src/*`.

## Conventions

- All code, comments, and documentation must be written in **English**, even when the UI text is in Spanish.
- TypeScript strict mode is enabled with no unused locals/parameters.
