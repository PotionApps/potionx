import { computed, defineComponent, PropType } from "vue";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";
import { useField, useFieldCheckbox } from "@potionapps/forms";

export type FieldCheckboxOption = {
  label: string
  value: any
}

export default defineComponent({
  name: "FieldCheckbox",
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
      onChange,
    } = useFieldCheckbox({
      change,
      name: props.name,
      showErrors,
      val
    })

    const classes = computed(() => {
      const base = "rounded text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
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
              checked={internalValue.value.includes(opt.value)}
              class={!props.unstyled && classes.value}
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
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})