interface ModelRow {
  id: string
  description?: string
  image?: string
  subtitle?: string
  title?: string
}

interface ModelTable {
  checkboxClick?: (row: ModelRow) => void,
  excludeTimestamps?: boolean
  headingConfig?: {key: string, label: string}[]
  rows: ModelRow[]
}