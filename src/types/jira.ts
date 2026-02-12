export interface JiraIssue {
  key: string
  summary: string
  status: string
  statusCategory: 'done' | 'indeterminate' | 'new'
  assignee: string
  type: string
  priority: string
}

export interface StatusCount {
  status: string
  count: number
  category: string
}

export interface SprintInfo {
  name: string
  totalIssues: number
}

export interface JiraIssueWithDates extends JiraIssue {
  createdDate: Date
  resolvedDate?: Date
}

export interface DateCount {
  date: string // ISO date 'YYYY-MM-DD'
  count: number
}

export interface LineChartData {
  date: string
  created: number
  closed: number
}

export type FileStatus = 'empty' | 'loading' | 'loaded' | 'error'
