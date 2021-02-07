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
    const internalValue = ref('')
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
      internalValue.value = (e.target as HTMLInputElement).value
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
              onBlur={onBlur}
              checked={opt.value === internalValue.value}
              onChange={onChange}
              type="radio"
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