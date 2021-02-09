import { computed, defineComponent, ref, watch } from "vue";
import useField from "../../useField";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useFieldTextarea from "./useFieldTextarea";

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
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
      classes,
      internalValue,
      onInput
    } = useFieldTextarea({
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