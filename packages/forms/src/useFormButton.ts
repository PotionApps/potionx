import { inject, Ref } from "vue"
import { FormSubmitStatus, FormSubmit } from "./useForm"

export default function useFormButton () {
  const formNumberOfChanges = inject<Ref<boolean>>('formNumberOfChanges')
  const formSubmit = inject<FormSubmit>('formSubmit')
  const formValid = inject<Ref<boolean>>('formValid')
  const formSubmitStatus = inject<Ref<FormSubmitStatus>>('formStatus')

  return {
    formNumberOfChanges,
    formSubmit,
    formSubmitStatus,
    formValid
  }
}