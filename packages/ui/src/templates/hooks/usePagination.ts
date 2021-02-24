import { ref, watch, ComputedRef } from "vue"
import { useRouter } from "vue-router"

export interface UsePaginationArgs {
  limit: number
  pageInfo?: ComputedRef<{
    endCursor?: string | null
    startCursor?: string | null
  } | null | undefined>
  routeMode?: boolean
}

type Variables = {
  after?: string | null,
  before?: string | null,
  first?: number,
  last?: number
}

export default (opts: UsePaginationArgs) => {
  const keys : (keyof Variables)[] = ['after', 'before', 'first', 'last']
  const router = useRouter()
  const variables = ref<Variables>({
    first: opts.limit
  })

  const clearKeys = () => {
    keys.forEach(k => delete variables.value[k])
  }

  const goToFirst = () => {
    clearKeys()
    variables.value.first = opts.limit
  }

  const goToLast = () => {
    clearKeys()
    variables.value.last = opts.limit
  }

  const next = () => {
    clearKeys()
    variables.value.after = opts.pageInfo?.value?.endCursor
    variables.value.first = opts.limit
  }

  const prev = () => {
    clearKeys()
    variables.value.before = opts.pageInfo?.value?.startCursor
    variables.value.last = opts.limit
  }

  if (opts.routeMode) {
    watch(
      variables,
      (nextVariables) => {
        const query = {...router.currentRoute.value.query}
        keys.forEach(key => {
          if (nextVariables[key] !== undefined)  {
            query[key] = nextVariables[key]! + ''
          } else {
            delete query[key]
          }
        })
        router.push({
          query
        })
      }, {
        deep: true
      }
    )
    const query = router.currentRoute.value.query
    keys.forEach(key => {
      if (query[key] === undefined)  return

      if(key == "first" || key == "last") {
        variables.value[key] = parseInt((query[key] as string))
      } else {
        variables.value[key] = query[key] as string
      }
    })
  }

  return {
    goToFirst,
    goToLast,
    next, 
    prev,
    variables
  }
}
