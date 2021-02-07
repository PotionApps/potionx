import { computed, inject, Ref } from "vue";
import { FormBlur, FormBlurred, FormChange, FormData, FormErrors } from "./useForm";

export interface UseFieldArgs {
  name: Ref<string>
}

export default function useField (args: UseFieldArgs) {
  const formBlur = inject<FormBlur>('formBlur')
  const formBlurred = inject<FormBlurred>('formBlurred')
  const formChange = inject<FormChange>('formChange')
  const formData = inject<FormData>('formData')
  const formErrors = inject<FormErrors>('formErrors')
  const formSubmitted = inject<Ref<boolean>>('formSubmitted')

  return {
    blur: formBlur,
    change: formChange,
    errors: computed(() => {
      return formErrors?.value?.[args.name.value] || []
    }),
    hasBlurred: computed(() => {
      return formBlurred?.[args.name.value]
    }),
    hasSubmitted: formSubmitted!,
    val: computed(() => {
      return formData?.value?.[args.name.value]
    })
  }
}