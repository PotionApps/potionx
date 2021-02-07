import { computed, defineComponent, PropType, ref, watch } from "vue";
import { isEqual } from 'lodash'
import useField from "../useField";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

export type FieldCheckboxOption = {
  label: string
  value: any
}

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    options: {
      required: true,
      type: Array as PropType<FieldCheckboxOption[]>
    },
    type: String
  },
  setup (props, ctx) {
    const focused = ref(false)
    const internalValue = ref<any[]>([])
    const {
      blur,
      change,
      errors,
      hasBlurred,
      hasSubmitted,
      val
    } = useField({
      name: computed(() => props.name)
    })
    const onBlur = (e: Event) => {
      focused.value = false
      blur?.(props.name)
    }
    const onChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      const index = internalValue.value.findIndex(v => isEqual(v, value)) 
      if (~index) {
        internalValue.value.splice(index, 1)
      } else {
        internalValue.value.push(value)
      }
      change?.(props.name, internalValue.value)
    }
    watch(val, (updatedVal) => {
      if (updatedVal !== internalValue.value && !focused.value) {
        internalValue.value = updatedVal
      }
    }, { immediate: true})
    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      {ctx.slots.default && ctx.slots.default()}
      {
        props.options.map(opt => {
          return <label>
            <input
              checked={internalValue.value.includes(opt.value)}
              onBlur={onBlur}
              onChange={onChange}
              type="checkbox"
              value={opt.value}
            />
            <span>{opt.label}</span>
          </label>
        })
      }
      {
        (hasBlurred.value || hasSubmitted.value) &&
        !props.disableErrors &&
        errors.value.length &&
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})