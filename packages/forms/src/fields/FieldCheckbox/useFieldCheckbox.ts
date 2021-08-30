import { ref, watch, ComputedRef, Ref } from "vue"
import isEqual from "../../isEqual"

export interface UseFieldCheckboxArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldCheckboxArgs) => {
  const internalValue = ref<any[]>([])

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
    internalValue,
    onChange
  }
}