import { computed, inject, Ref } from "vue";
import { FormBlurred, FormData, FormErrors } from "./useForm";

export interface UseFieldArgs {
  name: string
}

export default function useField (args: UseFieldArgs) {
  const formBlur = inject('formBlur')
  const formBlurred = inject<FormBlurred>('formBlurred')
  const formChange = inject('formChange')
  const formData = inject<FormData>('formData')
  const formErrors = inject<FormErrors>('formErrors')
  const formSubmitted = inject<Ref<boolean>>('formSubmitted')

  return {
    blur: formBlur,
    change: formChange,
    errors: computed(() => {
      return formErrors?.[args.name] || []
    }),
    hasBlurred: computed(() => {
      return formBlurred?.[args.name]
    }),
    hasSubmitted: formSubmitted!,
    val: computed(() => {
      return formData?.[args.name]
    })
  }
}