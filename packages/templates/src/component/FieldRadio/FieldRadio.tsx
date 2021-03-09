import { computed, defineComponent, PropType } from "vue";
import { useField, useFieldRadio } from "@potionapps/forms";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";

export type FieldRadioOptionProps = {
  label: string
  value: any
}

export interface FieldRadioProps {
  label?: string
  name: string
  options?: FieldRadioOptionProps[]
  unstyled?: boolean
}

export default defineComponent({
  name: "FieldRadio",
  props: {
    label: String,
    name: {
      required: true,
      type: String
    },
    options: Array as PropType<FieldRadioOptionProps[]>,
    unstyled: Boolean
  },
  setup (props: FieldRadioProps, ctx) {
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
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})