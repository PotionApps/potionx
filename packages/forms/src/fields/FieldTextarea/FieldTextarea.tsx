import { computed, defineComponent, ref, watch } from "vue";
import useField from "../../useField";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useFieldTextarea from "./useFieldTextarea";

export interface FieldTextareaProps {
  label?: string
  name: string
  unstyled?: boolean
}

export default defineComponent({
  name: "FieldTextarea",
  props: {
    label: String,
    name: {
      required: true,
      type: String
    },
    unstyled: Boolean
  },
  setup (props: FieldTextareaProps, ctx) {
    const {
      change,
      errors,
      formSubmit,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      internalValue,
      onInput,
      onKeydown
    } = useFieldTextarea({
      change,
      formSubmit,
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
      <textarea
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        onKeydown={onKeydown}
        name={props.name}
        {...ctx.attrs}
      >
        {internalValue.value}
      </textarea>
      {
        showErrors.value &&
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})