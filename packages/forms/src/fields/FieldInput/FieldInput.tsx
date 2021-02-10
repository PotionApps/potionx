import { computed, defineComponent } from "vue";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useField from "../../useField";
import useFieldInput from "./useFieldInput";

export default defineComponent({
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
      classes,
      internalValue,
      onInput
    } = useFieldInput({
      change,
      name: props.name,
      showErrors,
      val
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
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
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})