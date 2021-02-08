import { defineComponent, computed } from "vue";
import useFormButton from "./useFormButton";
import { FormSubmitStatus } from "./useForm";

export default defineComponent({
  setup () {
    const {
      formSubmitStatus
    } = useFormButton()

    const disabled = computed(() => {
     return formSubmitStatus?.value === FormSubmitStatus.loading
    })

    return () => {
      return <button
        class={"bg-gray-600 px-6 py-2 text-white rounded"}
        disabled={disabled.value}
      >
        Submit
      </button>
    }
  }
})