import { computed, inject, Ref } from "vue";
import { FormData, FormErrors } from "./useForm";

export interface UseFieldArgs {
  name: string
}

export default function useField (args: UseFieldArgs) {
  const formChange = inject('formChange')
  const formData = inject<FormData>('formData')
  const formErrors = inject<FormErrors>('formErrors')
  const formSubmitted = inject<Ref<boolean>>('formSubmitted')

  return {
    change: formChange,
    errors: computed(() => {
      return formErrors?.[args.name] || []
    }),
    hasSubmitted: formSubmitted!,
    val: computed(() => {
      return formData?.[args.name]
    })
  }
}