import { computed, defineComponent } from "vue";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useField from "../../useField";
import useFieldSelect from "./useFieldSelect";

export interface FieldSelectProps {
  name: string
  label: string
  unstyled: boolean
}


export default defineComponent({
  props: {
    label: String,
    name: {
      required: true,
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
      internalValue,
      onChange
    } = useFieldSelect({
      change,
      name: props.name,
      showErrors,
      val
    })
 
    const classes = computed(() => {
      const base = "block rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
      return base + (showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <select
        class={classes.value}
        onBlur={onBlur}
        onChange={onChange}
        name={props.name}
        {...ctx.attrs}
        value={internalValue.value}
      >
        {ctx.slots.default && ctx.slots.default()}
      </select>
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})