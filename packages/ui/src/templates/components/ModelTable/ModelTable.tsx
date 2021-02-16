import { defineComponent, PropType, computed } from "vue";

type HeadingLabel = {
  key: string, 
  label: string
}

export interface ModelRow {
  id: string | null
  description?: string | null
  icon?: string | null
  image?: string | null
  insertedAt?: string | null
  subtitle?: string | null
  title?: string | null
  updatedAt?: string | null
}

export interface ModelTableProps {
  checkboxClick?: (row: ModelRow) => void,
  columnOrder?: string[]
  excludeTimestamps?: boolean
  headingLabels?: HeadingLabel[]
  rows?: ModelRow[]
}

export default defineComponent({
  props: {
    checkboxClick: Function as PropType<ModelTableProps['checkboxClick']>,
    columnOrder: Array as PropType<ModelTableProps['columnOrder']>,
    excludeTimestamps: Boolean,
    headingLabels: Array as PropType<ModelTableProps['headingLabels']>,
    rows: {
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
          } else if (field.key.includes("__")) {
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
    return () => <div class="s750:overflow-x-auto">
      <table class="table-auto w-full">
        <thead class="bg-gray-100">
          {
            fieldsOrdered.value!.map(({ key, label }) => {
              if (key === "image") return <th></th>
              return <th class="border-gray-300 border-b-1 border-t-1 px-4 py-4 text-gray-500 text-left text-sm uppercase s750m:hidden">
                {label}
              </th>
            })
          }
        </thead>
        <tbody>
          {
            props.rows?.map(row => {
              return <tr
                class="border-gray-300 border-b-1 cursor-pointer relative transition hover:shadow-negative-xl hover:z-2"
                onClick={() => props.checkboxClick?.(row)}
              >
                {
                  fieldsOrdered.value!.map((field) => {
                    const key = field.key as keyof ModelRow
                    let rowData : any
                    switch (key) {
                      case "image":
                        if (row[key]) {
                          rowData = <img class="rounded-lg max-w-50" src={row[key]!} /> 
                        }
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
                    return <td class="px-4 py-1 s750m:last:pb-6 s750m:first:pt-6 s750:py-4 s750m:flex s750m:items-start s1250:py-6">
                      <span class="flex-fit font-semibold max-w-2/5 s450:max-w-150 text-gray-800 text-sm s550:text-base w-full s750:hidden">{field.label}</span>
                      <p class="text-gray-900 text-sm">{rowData}</p>
                    </td>
                  })
                }
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  }
})