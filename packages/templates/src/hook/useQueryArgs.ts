import { ref, readonly, onBeforeMount } from "vue"
import { useRouter } from "vue-router"

interface UseQueryArgs {
  routeMode?: boolean
}

export interface QueryArgs {
  after?: string
  before?: string
  filters: any
  first?: number | string
  order?: string
  orderBy?: string
  last?: number | string
  search?: string
}
const topLevelKeys: (keyof QueryArgs)[] = [
  "after",
  "before",
  "first",
  "last",
  "order",
  "orderBy",
  "search"
]

export default (opts: UseQueryArgs) => {
  const router = useRouter()
  const updateQueryArgs = (args: Partial<QueryArgs>) => {
    Object.keys(args).forEach((key) => {
      const k = key as keyof QueryArgs

      if (k == 'filters') {
        Object.keys(args[k]).forEach((key) => {
          if (!args[k][key]) {
            delete variables.value.filters[key] 
          } else {
            variables.value.filters[key] = args[k][key]
          }
        })
      } else if (args[k] === undefined || args[k] === '') {
        delete variables.value[k]
      } else {
        variables.value[k] = args[k] as string
      }
    })
    if (opts.routeMode) {
      const query = {
        ...variables.value,
        ...variables.value.filters
      }
      delete query.filters
      router.push({
        query
      })
    }
    return variables.value
  }
  const variables = ref<QueryArgs>({
    filters: {}
  })

  onBeforeMount(() => {
    Object.keys(router.currentRoute.value.query).forEach((key: any) => {
      if (topLevelKeys.includes(key as any)) {
        const k = key as keyof QueryArgs
        variables.value[k] = router.currentRoute.value.query[k]
      } else {
        variables.value.filters[key] = router.currentRoute.value.query[key]
      }
    })
  })

  return {
    updateQueryArgs,
    variables: readonly(variables)
  }
}