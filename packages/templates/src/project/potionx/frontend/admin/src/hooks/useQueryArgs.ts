import { ref, readonly } from "vue"
import { useRouter } from "vue-router"

interface UseQueryArgs {
  defaults?: any
  limit?: number
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

  opts = {
    defaults: {
      first: 100
    },
    ...opts
  }

  const ensureRelayParamsAreValid = (vars: QueryArgs) => {
    if (!vars.first && !vars.last) {
      vars.first = opts.limit || 100
    }
  
    if (vars.first) {
      vars.first = parseInt(vars.first + '', 10)
    }
    if (vars.last) {
      vars.last = parseInt(vars.last + '', 10)
    }
    return vars
  }

  const initializeVarsFromRoute = () => {
    Object.keys(router.currentRoute.value.query || {}).forEach((key: any) => {
      if (topLevelKeys.includes(key as any)) {
        const k = key as keyof QueryArgs
        variables.value[k] = router.currentRoute.value.query[k]
      } else {
        variables.value.filters[key] = router.currentRoute.value.query[key]
      }
    })
  }

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
        variables.value[k] = args[k] + ''
      }
    })
    if (opts.routeMode) {
      updateRouteQuery()
    }
    variables.value = ensureRelayParamsAreValid(variables.value)
    return variables.value
  }

  const updateRouteQuery = () => {
    const query = {
      ...variables.value,
      ...variables.value.filters
    }
    delete query.filters

    Object.keys(opts.defaults)
      .forEach((k: any) => {
        if (query[k as keyof QueryArgs] + '' === opts.defaults[k] + '') {
          delete query[k]
        }
      })

    router.push({
      query
    })
  }

  const variables = ref<QueryArgs>({
    filters: {}
  })

  if (opts.routeMode) {
    initializeVarsFromRoute()
  }
  ensureRelayParamsAreValid(variables.value)

  return {
    updateQueryArgs,
    variables: readonly(variables)
  }
}