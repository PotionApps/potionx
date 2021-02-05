import { isEqual } from 'lodash'
import { reactive, computed, ref, Ref, watch, provide } from "vue";

export interface Changeset<Model extends object = {}> {
  changes: Partial<{[k in keyof Model]: string[]}>,
  data: Partial<Model>
  errors: {[key: string]: string[]},
  isValid: boolean,
  numberOfChanges: number
}

export enum FormSubmitStatus {
  empty = "empty",
  error = "error",
  loading = "loading",
  success = "success"
}

export interface UseFormArgs<Model extends object> {
  clearAfterSuccess?: boolean
  data?: Ref<Readonly<Partial<Model>>>
  defaultValues?: Partial<{[k in keyof Model]: string[]}>
  onSubmit: (cs: Changeset<Model>) => Promise<boolean>
}

export default function useForm<Model extends object = {}>(args: UseFormArgs<Model>) {
  let changes = reactive<any>({})
  let errors = reactive<{[key: string]: string[]}>({})
  const hasSubmitted = ref(false)
  let serverErrors = reactive<Partial<{[key: string]: string[]}>>({})
  const submitStatus = ref<FormSubmitStatus>(FormSubmitStatus.empty)

  const change = (key: string, value: any) => {
    submitStatus.value = FormSubmitStatus.empty
    changes[key] = value
    return changes
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
    return args.data || {}
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
    for (const prop of Object.getOwnPropertyNames(changes)) {
      delete changes[prop];
    }
    for (const prop of Object.getOwnPropertyNames(errors)) {
      delete errors[prop];
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

  const setError = (key: string, value: string) => {
    errors[key] = (errors[key] || []).concat([value])
  }
  const setServerError = (key: string, value: string) => {
    serverErrors[key] = (serverErrors[key] || []).concat([value])
  }

  const submit = () => {
    if (!numberOfChanges.value) return
    hasSubmitted.value = true
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

  const toChangeset = () : Changeset<Model> => {
    return {
      changes,
      data: Object.assign({}, data.value),
      errors: Object.assign({}, errors),
      isValid: false,
      numberOfChanges: numberOfChanges.value
    }
  }

  provide('formChange', change)
  provide('formData', consolidated)
  provide('formErrors', consolidatedErrors)
  provide('formStatus', submitStatus)
  provide('formSubmitted', hasSubmitted)
  provide('formValid', isValid)

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