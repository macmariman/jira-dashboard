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
