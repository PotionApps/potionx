import { ComputedRef } from "vue"
import { QueryArgs } from "./useQueryArgs"

export interface UsePaginationArgs {
  limit: number
  pageInfo?: ComputedRef<{
    endCursor?: string | null
    startCursor?: string | null
  } | null | undefined>
  updateQueryArgs: (args: Partial<QueryArgs>) => void
}

export default (opts: UsePaginationArgs) => {
  const goToFirst = (args?: Partial<QueryArgs>) => {
    return opts.updateQueryArgs({
      after: undefined,
      before: undefined,
      first: opts.limit,
      last: undefined,
      ...(args || {})
    })
  }

  const goToLast =  (args?: Partial<QueryArgs>) => {
    return opts.updateQueryArgs({
      after: undefined,
      before: undefined,
      first: undefined,
      last: opts.limit,
      ...(args || {})
    })
  }

  const next = () => {
    return opts.updateQueryArgs({
      after: opts.pageInfo?.value?.endCursor || undefined,
      before: undefined,
      first: opts.limit,
      last: undefined
    })
  }

  const prev = () => {
    return opts.updateQueryArgs({
      after: undefined,
      before: opts.pageInfo?.value?.startCursor || undefined,
      first: undefined,
      last: opts.limit
    })
  }

  return {
    goToFirst,
    goToLast,
    next, 
    prev
  }
}
