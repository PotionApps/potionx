import { defineComponent, PropType, computed } from "vue";

type CheckboxClick = (row: ModelRowProps) => void
type HeadingLabelProps = {
  name: string, 
  label: string
}
export interface ModelRowProps {
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
  checkboxClick?: CheckboxClick,
  columnOrder?: string[]
  excludeTimestamps?: boolean
  headingLabels?: HeadingLabelProps[]
  rows?: ModelRowProps[]
}

export default defineComponent({
  name: "ModelTable",
  props: {
    checkboxClick: Function as PropType<CheckboxClick>,
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
      return columnOrder.value.reduce((acc: HeadingLabelProps[], key) => {
        const field = fields.value!.find(field => field.key === key)
        if (field) {
          acc.push(field)
        }
        return acc
      }, [])
    })
    return () => {
      return <div class="s750:overflow-x-auto max-w-full">
        <table class="table-auto w-full">
          <thead class="bg-gray-100">
            {
              fieldsOrdered.value!.map(({ key, label }) => {
                if (key === "image") return <th class="border-gray-300 border-b-1 border-t-1"></th>
                return <th class="border-gray-300 border-b-1 border-t-1 font-normal px-3 py-3 s750:first:pl-8 s750:last:pr-8 text-gray-500 text-left text-sm capitalize s750m:hidden whitespace-nowrap">
                  {label}
                </th>
              })
            }
          </thead>
          <tbody class="bg-white s750m:border-t-1 s750m:border-gray-300">
            {
              props.rows?.map(row => {
                return <tr
                  class="cursor-pointer relative focus:shadow-negative-xl hover:shadow-negative-xl transition hover:z-2"
                  onClick={() => props.checkboxClick?.(row)}
                >
                  {
                    fieldsOrdered.value!.map((field) => {
                      const key = field.key as keyof ModelRowProps
                      let rowData : any
                      switch (key) {
                        case "icon":
                          if (row[key]) {
                            rowData = <img class="w-6 min-w-6" src={row[key]!} /> 
                          }
                          break;
                        case "image":
                          if (row[key]) {
                            rowData = <img class="object-cover h-8 min-w-8 rounded-full w-6" src={row[key]!} /> 
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
                            rowData = val === null ? "-" : JSON.stringify(val)
                          }
                      }
                      return <td class="s750m:last:border-b-1 s750m:last:border-gray-300  s750:border-b-1 s750:border-gray-300 s750m:flex s750m:items-start px-4 py-1 s750m:last:pb-6 s750m:first:pt-6 s750:first:pl-8 s750:last:pr-8 s750:py-4">
                        <span class="flex-fit font-semibold max-w-2/5 s450:max-w-150 text-gray-500 text-sm capitalize w-full s750:hidden">{field.label}</span>
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
  }
})