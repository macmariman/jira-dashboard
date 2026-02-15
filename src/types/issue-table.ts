export interface IssueRow {
  key: string
  summary: string
  status: string
  statusCategory: 'done' | 'indeterminate' | 'new'
  assignee: string
  type: string
  priority: string
  createdDate: Date
  resolvedDate?: Date
  label?: string
  parent?: string
}
