import { ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldTextareaArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldTextareaArgs) => {
  const internalValue = ref<string>('')

  const onInput = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }

  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true })

  return {
    internalValue,
    onInput
  }
}