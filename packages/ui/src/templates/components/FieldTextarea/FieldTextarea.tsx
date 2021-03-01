import { computed, defineComponent } from "vue";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";
import { useField, useFieldTextarea } from "@potionapps/forms";

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
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      internalValue,
      onInput
    } = useFieldTextarea({
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
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <textarea
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
      >
        {internalValue.value}
      </textarea>
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})