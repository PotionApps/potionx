import { computed, defineComponent, onMounted, ref } from "vue";
import { useField, useFieldInput } from "@potionapps/forms";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";

export interface FieldInputProps {
  label?: string
  name: string
  type?: string
  unstyled?: boolean
}

export default defineComponent({
  name: "FieldInput",
  props: {
    disabled: Boolean,
    disableAutocomplete: Boolean,
    focusOnMount: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    placeholder: String,
    small: Boolean,
    showClearIcon: Boolean,
    type: {
      default: "text",
      type: String
    },
    unstyled: Boolean
  },
  setup (props, ctx) {
    const $el = ref<HTMLElement | null>(null)
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

    onMounted(() => {
      if (props.focusOnMount) {
        $el.value?.focus()
      }
      if (($el.value as HTMLInputElement)?.value) {
        change(props.name, ($el.value as HTMLInputElement).value)
      }
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
        placeholder={props.placeholder}
        ref={$el}
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