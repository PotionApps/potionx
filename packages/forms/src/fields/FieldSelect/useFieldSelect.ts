import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldSelectArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldSelectArgs) => {
  const internalValue = ref<any>('')

  const onChange = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }
  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true})

  return {
    internalValue,
    onChange
  }
}