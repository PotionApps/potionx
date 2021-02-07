import { inject, Ref } from "vue"
import { FormSubmitStatus } from "./useForm"

export default function useFormButton () {
  const formNumberOfChanges = inject<Ref<boolean>>('formNumberOfChanges')
  const formValid = inject<Ref<boolean>>('formValid')
  const formSubmitStatus = inject<Ref<FormSubmitStatus>>('formStatus')

  return {
    formValid,
    formNumberOfChanges,
    formSubmitStatus
  }
}