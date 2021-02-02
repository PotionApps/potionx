import { defineComponent, PropType, computed } from "vue";

type HeadingLabel = {
  key: string, 
  label: string
}

export interface ModelRow {
  id: string
  description?: string
  image?: string
  insertedAt?: string
  subtitle?: string
  title?: string
  updatedAt?: string
}

export interface ModelTableProps {
  checkboxClick?: (row: ModelRow) => void,
  columnOrder?: string[]
  excludeTimestamps?: boolean
  headingLabels?: HeadingLabel[]
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
    const defaults = [
      'image',
      'id',
      'title',
      'description'
    ]
    const times = ['insertedAt', 'updatedAt']
    const columnOrder = computed(() => {
      return props.columnOrder ||
       defaults.filter(field => {
        return !!fields.value!.find(({ key }) => key === field)
      })
      .concat(
        fields.value!.reduce((acc: string[], field) => {
          if (defaults.concat(times).includes(field.key)) {
            return acc
          } else {
            return acc.concat([field.key])
          }
        }, [])
      )
      .concat(
        times
      )
    })
    const fields = computed<ModelTableProps['headingLabels']>(() => {
      return props.headingLabels ||
        Object.keys(props.rows?.[0] || {}).map(key => {
          return {
            key,
            label: key
          }
        })
    })

    const fieldsOrdered = computed<ModelTableProps['headingLabels']>(() => {
      return columnOrder.value.reduce((acc: HeadingLabel[], key) => {
        const field = fields.value!.find(field => field.key === key)
        if (field) {
          acc.push(field)
        }
        return acc
      }, [])
    })
    return () => <table class="table-auto">
      <thead>
        {
          fieldsOrdered.value!.map(({ key, label }) => {
            if (key === "image") return <th></th>
            return <th class="text-gray-500 text-sm text-left px-4 capitalize">
              {label}
            </th>
          })
        }
      </thead>
      <tbody>
        {
          props.rows.map(row => {

            return <tr>
              {
                fieldsOrdered.value!.map((field) => {
                  const key = field.key as keyof ModelRow
                  let rowData : any
                  switch (key) {
                    case "image":
                      rowData = <img class="rounded-lg max-w-50" src={row[key]} /> 
                      break;
                    case "title": 
                      rowData = <p class="w-36">{row[key]}</p>
                      break;
                    case "insertedAt":
                    case "updatedAt":
                      rowData = row[key] && new Date(row[key]!).toLocaleString() 
                      break;
                    default:
                      const val = row[key]
                      if (Array.isArray(val)) {
                        rowData = val.join(", ")
                      } else {
                        rowData = val
                      }
                  }
                  return <td class="px-4"><span class="hidden">{field.label}</span>{rowData}</td>
                })
              }
            </tr>
          })
        }
      </tbody>
    </table>
  }
})