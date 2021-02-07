import { defineComponent } from "vue";
import useFormButton from "./useFormButton";
import { FormSubmitStatus } from "./useForm";

export default defineComponent({
  setup () {
    const {
      formNumberOfChanges,
      formSubmitStatus
    } = useFormButton()
    return () => {
      return <button
        class="bg-gray-600 text-white rounded"
        disabled={!formNumberOfChanges?.value || formSubmitStatus?.value === FormSubmitStatus.loading}
      >
        Submit
      </button>
    }
  }
})