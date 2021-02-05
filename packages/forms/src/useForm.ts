import { reactive, computed, ref, Ref } from "vue";
import isEqual from 'lodash.isequal'

export interface Changeset<Model extends object = {}> {
  changes: Partial<{[k in keyof Model]: string[]}>,
  data: Partial<Model>
  errors: {[key: string]: string[]},
  isValid: boolean,
  numberOfChanges: number
}

export enum FormStatus {
  default = "default",
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
  const data = reactive<any>({})
  let errors = reactive<{[key: string]: string[]}>({})
  const hasSubmitted = ref(false)
  let serverErrors = reactive<Partial<{[key: string]: string[]}>>({})
  const status = ref<FormStatus>(FormStatus.default)

  const change = (key: string, value: any) => {
    changes[key] = value
    return changes
  }

  const consolidated = computed(() => {
    return Object.assign(
      data,
      Object.keys(changes).reduce((acc: any, k) => {
        if (changes[k] !== undefined) {
          acc[k] = changes[k]
        }
        return acc
      }, {})
    )
  })

  const consolidatedErrors = computed(() => {
    [
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

  const isValid = computed(() => {
    return Object.values(errors as {[key: string]: string[]})
      .every((e: string[]) => e.length === 0) &&
      Object.values(serverErrors as {[key: string]: string[]})
      .every((e: string[]) => e.length === 0)
  })

  const numberOfChanges = computed(() => {
    return Object.keys(changes).reduce(
      (acc: any, k: string) => {
        if (changes[k] !== undefined && !isEqual(changes[k], data[k])) {
          acc += 1
        }
        return acc
      },
      0
    )
  })
  
  const reset = () => {
    changes = reactive({})
    errors = reactive({})
    serverErrors = reactive({})
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
    hasSubmitted.value = true
    args.onSubmit(toChangeset())
      .then((res: boolean) => {
        if (true) {
          reset()
        }
      })
  }

  const toChangeset = () : Changeset<Model> => {
    return {
      changes,
      data: Object.assign({}, data),
      errors: Object.assign({}, errors),
      isValid: false,
      numberOfChanges: numberOfChanges.value
    }
  }

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
    status,
    submit
  }
}