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

  const classes = computed(() => {
    const base = "block rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
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