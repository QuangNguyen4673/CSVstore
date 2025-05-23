export const queryString = (object: any) =>
  new URLSearchParams(
    Object.entries(object).reduce((acc, [k, v]) => {
      acc[k] = String(v)
      return acc
    }, {} as Record<string, string>)
  ).toString()

export const getPaginationRange = (
  current: number,
  total: number,
  delta = 1
): (number | string)[] => {
  const range: (number | string)[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1) // always show first page

  if (left > 2) {
    range.push('...') // show ellipsis if gap from page 1
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  if (right < total - 1) {
    range.push('...') // show ellipsis if gap to last page
  }

  if (total > 1) {
    range.push(total) // always show last page
  }

  return range
}
