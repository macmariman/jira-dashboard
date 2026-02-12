import type { JiraIssue, JiraIssueWithDates, DateCount, LineChartData, StatusCount, SprintInfo } from '@/types/jira'

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

export function parseJiraXmlWithDates(xmlString: string): JiraIssueWithDates[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')
  const items = doc.querySelectorAll('item')

  const issues: JiraIssueWithDates[] = []

  items.forEach((item) => {
    const key = item.querySelector('key')?.textContent ?? ''
    const summary = item.querySelector('summary')?.textContent ?? ''
    const status = item.querySelector('status')?.textContent ?? ''
    const statusCategoryEl = item.querySelector('statusCategory')
    const statusCategory = (statusCategoryEl?.getAttribute('key') ?? 'new') as JiraIssue['statusCategory']
    const assignee = item.querySelector('assignee')?.textContent ?? 'Sin asignar'
    const type = item.querySelector('type')?.textContent ?? ''
    const priority = item.querySelector('priority')?.textContent ?? ''

    const createdStr = item.querySelector('created')?.textContent ?? ''
    const resolvedStr = item.querySelector('resolved')?.textContent ?? ''
    const label = item.querySelector('labels > label')?.textContent ?? undefined
    const parent = item.querySelector('parent')?.textContent ?? undefined

    const createdDate = new Date(createdStr)

    const issue: JiraIssueWithDates = {
      key,
      summary,
      status,
      statusCategory,
      assignee,
      type,
      priority,
      createdDate,
      label,
      parent,
    }

    if (resolvedStr) {
      issue.resolvedDate = new Date(resolvedStr)
    }

    issues.push(issue)
  })

  return issues
}

export function groupByDate(
  issues: JiraIssueWithDates[],
  dateField: 'created' | 'resolved'
): DateCount[] {
  const dateMap = new Map<string, number>()

  issues.forEach((issue) => {
    const date = dateField === 'created' ? issue.createdDate : issue.resolvedDate
    if (!date) return

    const dateKey = date.toISOString().split('T')[0]
    dateMap.set(dateKey, (dateMap.get(dateKey) ?? 0) + 1)
  })

  const result: DateCount[] = []
  dateMap.forEach((count, date) => {
    result.push({ date, count })
  })

  return result.sort((a, b) => a.date.localeCompare(b.date))
}

export function prepareLineChartData(
  createdIssues: JiraIssueWithDates[],
  closedIssues: JiraIssueWithDates[]
): LineChartData[] {
  const createdByDate = groupByDate(createdIssues, 'created')
  const closedByDate = groupByDate(closedIssues, 'resolved')

  const createdMap = new Map(createdByDate.map((d) => [d.date, d.count]))
  const closedMap = new Map(closedByDate.map((d) => [d.date, d.count]))

  const allDates = new Set([...createdMap.keys(), ...closedMap.keys()])

  if (allDates.size === 0) return []

  const sortedDates = [...allDates].sort()
  const minDate = new Date(sortedDates[0])
  const maxDate = new Date(sortedDates[sortedDates.length - 1])

  const result: LineChartData[] = []
  const current = new Date(minDate)
  let cumulativeCreated = 0
  let cumulativeClosed = 0

  while (current <= maxDate) {
    const dateKey = current.toISOString().split('T')[0]
    cumulativeCreated += createdMap.get(dateKey) ?? 0
    cumulativeClosed += closedMap.get(dateKey) ?? 0
    result.push({
      date: dateKey,
      created: cumulativeCreated,
      closed: cumulativeClosed,
    })
    current.setDate(current.getDate() + 1)
  }

  return result
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
