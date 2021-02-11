import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldRadioArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldRadioArgs) => {
  const internalValue = ref<any>('')
  const classes = computed(() => {
    const base = "border-gray-300 text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

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
    classes,
    internalValue,
    onChange
  }
}