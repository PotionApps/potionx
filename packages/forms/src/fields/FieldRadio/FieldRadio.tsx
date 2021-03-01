import { computed, defineComponent, PropType } from "vue";
import useField from "../../useField";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useFieldRadio from "./useFieldRadio";

export type FieldRadioOption = {
  label: string
  value: any
}

export interface FieldRadioProps {
  label: string
  name: string
  options: FieldRadioOption
  unstyled: boolean
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
      type: Array as PropType<FieldRadioOption[]>
    },
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      internalValue,
      onChange
    } = useFieldRadio({
      change,
      name: props.name,
      showErrors,
      val
    })

    const classes = computed(() => {
      const base = "border-gray-300 text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
      return base + (showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
    })
   
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
             class={
                !props.unstyled && classes.value
              }
              onBlur={onBlur}
              checked={opt.value === internalValue.value}
              onChange={onChange}
              type="radio"
              value={opt.value}
            />
            <span class="ml-2">{opt.label}</span>
          </label>
        })
      }
       {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})