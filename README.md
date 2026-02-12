# JiraJira

A visual tool for analyzing Jira ticket trends. Upload two XML exports from Jira to compare ticket creation vs closure velocity over time.

## Features

- **Dual file upload** — Drop zones for `Creados.xml` (created tickets) and `Cerrados.xml` (closed tickets)
- **Trend line chart** — Two-line chart showing daily ticket creation (blue) and closure (green) over time
- **Date range union** — Automatically merges date ranges from both files, filling gaps with zeros
- **XML parsing** — Extracts `<created>` and `<resolved>` dates from Jira RSS/XML exports

## Getting Started

```bash
npm install
npm run dev
```

## Usage

1. Export two XML files from Jira:
   - **Creados.xml** — Tickets created in the last 30 days
   - **Cerrados.xml** — Tickets closed/resolved in the last 30 days
2. Open the app and drag each file into its corresponding drop zone
3. Once both files are loaded, the trend chart appears

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Tech Stack

- React 19 + TypeScript
- Vite
- Recharts
- Tailwind CSS 4
- shadcn/ui
