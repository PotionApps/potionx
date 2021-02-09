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
      type: Array as PropType<FieldCheckboxOption[]>
    },
    type: String,
    unstyled: Boolean
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

    const classes = computed(() => {
      if (props.unstyled) return ""
      const base = "rounded text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
      return base + (showErrors.value ? "border-red-300 text-red-800" : "border-gray-300")
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

    const showErrors = computed(() => {
      return (hasBlurred.value || hasSubmitted.value) &&
      !props.disableErrors &&
      !!errors.value.length
    })

    watch(val, (updatedVal) => {
      if (updatedVal !== internalValue.value && !focused.value) {
        internalValue.value.splice(0, internalValue.value.length)
        internalValue.value.push(...(updatedVal || []))
      }
    }, { immediate: true})
    
    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      {ctx.slots.default && ctx.slots.default({
        onBlur,
        onChange,
        value: internalValue.value
      })}
      {
        props.options?.map(opt => {
          return <label class="block">
            <input
              checked={internalValue.value.includes(opt.value)}
              class={classes.value}
              name={props.name}
              onBlur={onBlur}
              onChange={onChange}
              type="checkbox"
              value={opt.value}
            />
            <span class="ml-2">{opt.label}</span>
          </label>
        })
      }
      {
        showErrors.value &&
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})