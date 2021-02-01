import { defineComponent } from "vue";

interface ModelRow {
  id: string
  description?: string
  image?: string
  subtitle?: string
  title?: string
}

export interface ModelTableProps {
  checkboxClick?: (row: ModelRow) => void,
  columnOrder?: string[]
  excludeTimestamps?: boolean
  headingLabels?: {key: string, label: string}[]
  rows: ModelRow[]
}

export default defineComponent({
  setup () {
    return () => null
  }
})