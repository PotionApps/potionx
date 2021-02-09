import { computed, inject, Ref, ref } from "vue";
import { FormBlur, FormBlurred, FormChange, FormData, FormErrors } from "./useForm";

export interface UseFieldArgs {
  name: Ref<string>
}

export default function useField (args: UseFieldArgs) {
  const focused = ref(false)
  const formBlur = inject<FormBlur>('formBlur')
  const formBlurred = inject<FormBlurred>('formBlurred')
  const formChange = inject<FormChange>('formChange')
  const formData = inject<FormData>('formData')
  const formErrors = inject<FormErrors>('formErrors')
  const formSubmitted = inject<Ref<boolean>>('formSubmitted')

  const errors = computed(() => {
    return formErrors?.value?.[args.name.value] || []
  })

  const hasBlurred = computed(() => {
    return formBlurred?.[args.name.value]
  })

  return {
    blur: formBlur,
    change: formChange,
    errors,
    focused,
    hasBlurred,
    hasSubmitted: formSubmitted!,
    onBlur: (e: Event) => {
      focused.value = false
      formBlur?.(args.name.value)
    },
    showErrors: computed(() => {
      return !!(
        (hasBlurred.value || formSubmitted?.value) &&
        !!errors?.value.length
      )
    }),
    val: computed(() => {
      return formData?.value?.[args.name.value]
    })
  }
}