import { isEqual } from 'lodash'
import { reactive, computed, ref, Ref, watch, provide, ComputedRef } from "vue";
import { Field } from './Field';
import { Validator } from './validators/Validator';
import validatorEcto from './validators/validatorEcto/validatorEcto';

export interface Changeset<Model extends object = {}> {
  changes: Partial<{[k in keyof Model]: string[]}>,
  data: Partial<Model>
  errors: {[key: string]: string[]},
  isValid: boolean,
  numberOfChanges: number
}

export type FormBlur = (key: string) => void
export type FormBlurred = {[key: string]: boolean}
export type FormChange = (key: string, value: any) => void
export type FormData = Ref<{[key: string]: any}>
export type FormErrors = Ref<{[key: string]: string[]}>
export type FormSubmit = (e?: Event) => void
export enum FormSubmitStatus {
  empty = "empty",
  error = "error",
  loading = "loading",
  success = "success"
}

export interface UseFormArgs {
  clearAfterSuccess?: boolean
  data?: ComputedRef<any>
  defaultValues?: Partial<{[key: string]: string[]}>
  fields: Field[]
  onSubmit: (cs: Changeset<any>) => Promise<boolean>
  validator?: Validator
}

export default function useForm(args: UseFormArgs) {
  let blurred = reactive<FormBlurred>({})
  let changes = reactive<any>({})
  let errors = reactive<{[key: string]: string[]}>({})
  const hasSubmitted = ref(false)
  let serverErrors = reactive<Partial<{[key: string]: string[]}>>({})
  const submitStatus = ref<FormSubmitStatus>(FormSubmitStatus.empty)
  const validator = args.validator || validatorEcto

  const blur : FormBlur = (key: string) => {
    blurred[key] = true
  }

  const change : FormChange = (key: string, value: any) => {
    submitStatus.value = FormSubmitStatus.empty
    changes[key] = value
    return changes
  }

  const clearBlurred = () => {
    for (const prop of Object.getOwnPropertyNames(blurred)) {
      delete blurred[prop];
    }
  }

  const clearErrors = () => {
    for (const prop of Object.getOwnPropertyNames(errors)) {
      delete errors[prop];
    }
  }

  const consolidated = computed(() => {
    return Object.assign(
      {},
      data.value,
      Object.keys(changes).reduce((acc: any, k) => {
        if (changes[k] !== undefined) {
          acc[k] = changes[k]
        }
        return acc
      }, {})
    )
  })

  const consolidatedErrors = computed(() => {
    return [
      ...new Set(
        Object.keys(errors).concat(
          Object.keys(serverErrors)
        )
      )
    ].reduce((acc: {[key: string]: string[]}, key) => {
      acc[key] = (errors[key] || []).concat((serverErrors[key] || []))
      return acc
    }, {})
  })

  const data = computed<any>(() => {
    return args.data?.value || {}
  })

  const isValid = computed(() => {
    return Object.values(errors as {[key: string]: string[]})
      .every((e: string[]) => e.length === 0) &&
      Object.values(serverErrors as {[key: string]: string[]})
      .every((e: string[]) => e.length === 0)
  })

  const numberOfChanges = computed(() => {
    return Object.keys(changes).reduce(
      (acc: any, k: string) => {
        if (changes[k] !== undefined && !isEqual(changes[k], data.value[k])) {
          acc += 1
        }
        return acc
      },
      0
    )
  })
  
  const reset = () => {
    clearBlurred()
    clearErrors()
    for (const prop of Object.getOwnPropertyNames(changes)) {
      delete changes[prop];
    }
    for (const prop of Object.getOwnPropertyNames(serverErrors)) {
      delete serverErrors[prop];
    }
    hasSubmitted.value = false
  }

  const resetField = (key: string) => {
    delete changes[key]
    return changes
  }

  const runValidation = () => {
    clearErrors()
    Object.assign(errors, validator(consolidated.value, args.fields))
  }

  const setError = (key: string, value: string) => {
    errors[key] = (errors[key] || []).concat([value])
  }
  const setServerError = (key: string, value: string) => {
    serverErrors[key] = (serverErrors[key] || []).concat([value])
  }

  const submit : FormSubmit = (e?: Event) => {
    if (e) e.preventDefault()
    hasSubmitted.value = true
    if (!numberOfChanges.value || submitStatus.value === FormSubmitStatus.loading) return
    submitStatus.value = FormSubmitStatus.loading
    args.onSubmit(toChangeset())
      .then((res: boolean) => {
        if (res) {
          submitStatus.value = FormSubmitStatus.success
          reset()
        } else {
          submitStatus.value = FormSubmitStatus.error
        }
      })
  }

  const toChangeset = () : Changeset => {
    return {
      changes,
      data: Object.assign({}, data.value),
      errors: Object.assign({}, errors),
      isValid: false,
      numberOfChanges: numberOfChanges.value
    }
  }

  provide('formBlur', blur)
  provide('formBlurred', blurred)
  provide('formChange', change)
  provide('formData', consolidated)
  provide('formErrors', consolidatedErrors)
  provide('formNumberOfChanges', numberOfChanges)
  provide('formStatus', submitStatus)
  provide('formSubmit', submit)
  provide('formSubmitted', hasSubmitted)
  provide('formValid', isValid)
  

  watch(consolidated, () => {
    runValidation()
  }, {deep: true, immediate: true})

  return {
    change,
    changes,
    consolidated,
    consolidatedErrors,
    data,
    errors,
    hasSubmitted,
    isValid,
    numberOfChanges,
    reset,
    resetField,
    serverErrors,
    setError,
    setServerError,
    submit,
    submitStatus
  }
}