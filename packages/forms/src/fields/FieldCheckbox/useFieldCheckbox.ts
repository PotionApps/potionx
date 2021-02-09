import { computed, ref, watch, ComputedRef, Ref } from "vue"
import { isEqual } from 'lodash'

export interface UseFieldCheckboxArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldCheckboxArgs) => {
  const internalValue = ref<any[]>([])
  const classes = computed(() => {
    const base = "rounded text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    const index = internalValue.value.findIndex(v => isEqual(v, value)) 
    if (~index) {
      internalValue.value.splice(index, 1)
    } else {
      internalValue.value.push(value)
    }
    args.change?.(args.name, internalValue.value)
  }

  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value.splice(0, internalValue.value.length)
      internalValue.value.push(...(updatedVal || []))
    }
  }, { immediate: true})

  return {
    classes,
    internalValue,
    onChange
  }
}