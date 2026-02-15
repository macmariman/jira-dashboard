import type { IssueRow } from '@/types/issue-table'

export interface DataAdapter {
  parse(content: string): IssueRow[]
}
