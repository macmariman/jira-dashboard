import Papa from 'papaparse'
import type { DataAdapter } from './types'
import type { IssueRow } from '@/types/issue-table'

export const csvAdapter: DataAdapter = {
  parse(content: string): IssueRow[] {
    const { data, meta } = Papa.parse<Record<string, string>>(content, {
      header: true,
      skipEmptyLines: true,
    })

    const sprintColumns = meta.fields?.filter((f) => /^Sprint/i.test(f)) ?? []

    return data.map((row) => {
      const sprints = sprintColumns
        .map((col) => row[col]?.trim())
        .filter(Boolean) as string[]

      const issue: IssueRow = {
        createdDate: new Date(row.Creada),
        important: row.Importante === 'Sí',
        summary: row.Resumen ?? '',
        type: row.Tipo ?? '',
        status: row.Estado ?? '',
        sprints,
      }

      if (row.Resuelta) {
        issue.resolvedDate = new Date(row.Resuelta)
      }

      return issue
    })
  },
}
