import { inject, Ref } from "vue"
import { FormSubmitStatus } from "./useForm"

export default function useFormButton () {
  const numberOfChanges = inject<Ref<boolean>>('numberOfChanges')
  const formValid = inject<Ref<boolean>>('formValid')
  const submitStatus = inject<Ref<FormSubmitStatus>>('formStatus')

  return {
    formValid,
    numberOfChanges,
    submitStatus
  }
}