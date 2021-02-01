import { defineComponent, PropType } from "vue";

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
  props: {
    checkboxClick: Function as PropType<ModelTableProps['checkboxClick']>,
    columnOrder: Array as PropType<ModelTableProps['columnOrder']>,
    excludeTimestamps: Boolean,
    headingLabels: Array as PropType<ModelTableProps['headingLabels']>,
    rows: {
      required: true,
      type: Array as PropType<ModelTableProps['rows']>
    }
  },
  setup (props: ModelTableProps) {
    return () => <table></table>
  }
})