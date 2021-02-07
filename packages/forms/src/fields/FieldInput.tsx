import { computed, defineComponent, ref, watch } from "vue";
import useField from "../useField";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

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
    const focused = ref(false)
    const internalValue = ref('')
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
    
    const onBlur = (e: Event) => {
      focused.value = false
      blur?.(props.name)
    }
    const onInput = (e: Event) => {
      internalValue.value = (e.target as HTMLInputElement).value
      change?.(props.name, internalValue.value)
    }
    watch(val, (updatedVal) => {
      if (updatedVal !== internalValue.value && !focused.value) {
        internalValue.value = updatedVal
      }
    }, { immediate: true })

    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      <input
        class={
          !props.unstyled &&
          "rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        }
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
        type={props.type}
        value={internalValue.value}
      />
      {
        (hasBlurred.value || hasSubmitted.value) &&
        !props.disableErrors &&
        errors.value.length !== 0 &&
        <FieldError>{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})