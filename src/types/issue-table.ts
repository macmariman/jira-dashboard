export interface IssueRow {
  createdDate: Date
  resolvedDate?: Date
  important: boolean
  summary: string
  type: string
  status: string
  sprints: string[]
}
