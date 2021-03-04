import { computed, defineComponent } from "vue";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useField from "../../useField";
import useFieldInput from "./useFieldInput";

export interface FieldInputProps {
  label?: string
  name: string
  type?: string
  unstyled?: boolean
}

export default defineComponent({
  name: "FieldInput",
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    type: {
      default: "text",
      type: String
    },
    unstyled: Boolean
  },
  setup (props: FieldInputProps, ctx) {
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
      onInput
    } = useFieldInput({
      change,
      name: props.name,
      showErrors,
      val
    })

    const classes = computed(() => {
      const base = "rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
      return base + (showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
    })

    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      <input
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
        type={props.type}
        value={internalValue.value}
      />
      {
        showErrors.value &&
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})