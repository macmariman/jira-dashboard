import type { JiraIssue, StatusCount, SprintInfo } from '@/types/jira'

export function parseJiraXml(xmlString: string): JiraIssue[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')
  const items = doc.querySelectorAll('item')

  const issues: JiraIssue[] = []

  items.forEach((item) => {
    const key = item.querySelector('key')?.textContent ?? ''
    const summary = item.querySelector('summary')?.textContent ?? ''
    const status = item.querySelector('status')?.textContent ?? ''
    const statusCategoryEl = item.querySelector('statusCategory')
    const statusCategory = (statusCategoryEl?.getAttribute('key') ?? 'new') as JiraIssue['statusCategory']
    const assignee = item.querySelector('assignee')?.textContent ?? 'Sin asignar'
    const type = item.querySelector('type')?.textContent ?? ''
    const priority = item.querySelector('priority')?.textContent ?? ''

    issues.push({
      key,
      summary,
      status,
      statusCategory,
      assignee,
      type,
      priority,
    })
  })

  return issues
}

export function groupByStatus(issues: JiraIssue[]): StatusCount[] {
  const statusMap = new Map<string, { count: number; category: string }>()

  issues.forEach((issue) => {
    const existing = statusMap.get(issue.status)
    if (existing) {
      existing.count++
    } else {
      statusMap.set(issue.status, { count: 1, category: issue.statusCategory })
    }
  })

  const result: StatusCount[] = []
  statusMap.forEach((value, status) => {
    result.push({ status, count: value.count, category: value.category })
  })

  // Sort by count descending
  return result.sort((a, b) => b.count - a.count)
}

export function getSprintInfo(xmlString: string): SprintInfo {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')

  const issueEl = doc.querySelector('issue')
  const totalIssues = parseInt(issueEl?.getAttribute('total') ?? '0', 10)

  // Get sprint name from first item's customfield
  const sprintField = doc.querySelector('customfield[id="customfield_10020"] customfieldvalue')
  const sprintName = sprintField?.textContent ?? 'Sprint'

  return { name: sprintName, totalIssues }
}
