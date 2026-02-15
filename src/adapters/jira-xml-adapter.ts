import type { DataAdapter } from './types'
import type { IssueRow } from '@/types/issue-table'
import { parseJiraXmlWithDates } from '@/lib/jira-parser'

export const jiraXmlAdapter: DataAdapter = {
  parse(content: string): IssueRow[] {
    return parseJiraXmlWithDates(content)
  },
}
