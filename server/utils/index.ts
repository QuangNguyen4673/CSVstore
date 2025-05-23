export const parseBrokenCSVRow = (
  row: Record<string, string>
): Record<string, string> => {
  const [rawKeys] = Object.keys(row)
  const [rawValues] = Object.values(row)

  const keys = rawKeys.split(';')
  const values = rawValues.split(';')

  const parsed: Record<string, string> = {}
  keys.forEach((key, index) => {
    parsed[key] = values[index]
  })

  return parsed
}
