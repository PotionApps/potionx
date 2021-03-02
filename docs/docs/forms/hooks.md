# Forms (@potionapps/forms)

The Potionx toolkit relies on the ```@potionapps/forms``` package for its code generation and comes with it installed by default.

```@potionapps/forms``` is a set of Vue 3 composition API hooks for building forms.

## useField
Provides functions and variables necessary for all form fields.

```tsx
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
```

Example usage: 
```tsx
import { computed, defineComponent } from "vue";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useField from "../../useField";
import useFieldInput from "./useFieldInput";

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    type: {
      default: "text",
      type: String
    },
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })

    const {
      classes,
      internalValue,
      onInput
    } = useFieldInput({
      change,
      name: props.name,
      showErrors,
      val
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <input
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
        type={props.type}
        value={internalValue.value}
      />
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## useFieldCheckbox
Provides convenience functions for checkboxes

```tsx
import { computed, ref, watch, ComputedRef, Ref } from "vue"
import { isEqual } from 'lodash'

export interface UseFieldCheckboxArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldCheckboxArgs) => {
  const internalValue = ref<any[]>([])
  const classes = computed(() => {
    const base = "rounded text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    const index = internalValue.value.findIndex(v => isEqual(v, value)) 
    if (~index) {
      internalValue.value.splice(index, 1)
    } else {
      internalValue.value.push(value)
    }
    args.change?.(args.name, internalValue.value)
  }

  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value.splice(0, internalValue.value.length)
      internalValue.value.push(...(updatedVal || []))
    }
  }, { immediate: true})

  return {
    classes,
    internalValue,
    onChange
  }
}
```

Example usage:
```tsx
import { computed, defineComponent, PropType } from "vue";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";
import { useField, useFieldCheckbox } from "@potionapps/forms";

export type FieldCheckboxOptionProps = {
  label: string
  value: any
}

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    options: {
      type: Array as PropType<FieldCheckboxOptionProps[]>
    },
    type: String,
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      classes,
      internalValue,
      onChange,
    } = useFieldCheckbox({
      change,
      name: props.name,
      showErrors,
      val
    })
    
    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      {ctx.slots.default && ctx.slots.default({
        onBlur,
        onChange,
        value: internalValue.value
      })}
      {
        props.options?.map(opt => {
          return <label class="block">
            <input
              checked={internalValue.value.includes(opt.value)}
              class={!props.unstyled && classes.value}
              name={props.name}
              onBlur={onBlur}
              onChange={onChange}
              type="checkbox"
              value={opt.value}
            />
            <span class="ml-2">{opt.label}</span>
          </label>
        })
      }
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## useFieldInput
Provides convenience functions for a text-based input

```tsx
import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldCheckboxArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldCheckboxArgs) => {
  const internalValue = ref<string>('')
  const classes = computed(() => {
    const base = "rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onInput = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }

  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true })

  return {
    classes,
    internalValue,
    onInput
  }
}
```

Example usage:
```tsx
import { computed, defineComponent } from "vue";
import FieldError from "../FieldError";
import FieldLabel from "../FieldLabel";
import useField from "../../useField";
import useFieldInput from "./useFieldInput";

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    type: {
      default: "text",
      type: String
    },
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })

    const {
      classes,
      internalValue,
      onInput
    } = useFieldInput({
      change,
      name: props.name,
      showErrors,
      val
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <input
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
        type={props.type}
        value={internalValue.value}
      />
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## UseFieldRadio
Provides convenience functions for a radio input

```tsx
import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldRadioArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldRadioArgs) => {
  const internalValue = ref<any>('')
  const classes = computed(() => {
    const base = "border-gray-300 text-blue-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onChange = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }
  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true})

  return {
    classes,
    internalValue,
    onChange
  }
}
```

Example usage:
```tsx
import { computed, defineComponent, PropType } from "vue";
import { useField, useFieldRadio } from "@potionapps/forms";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";

export type FieldCheckboxOptionProps = {
  label: string
  value: any
}

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    options: {
      type: Array as PropType<FieldCheckboxOptionProps[]>
    },
    type: String,
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      classes,
      internalValue,
      onChange
    } = useFieldRadio({
      change,
      name: props.name,
      showErrors,
      val
    })
   
    return () => <>
      {
        props.label &&
        <FieldLabel>{props.label}</FieldLabel>
      }
      {ctx.slots.default && ctx.slots.default({
        onBlur,
        onChange,
        value: internalValue.value
      })}
      {
        props.options?.map(opt => {
          return <label class="block">
            <input
             class={
                !props.unstyled && classes.value
              }
              onBlur={onBlur}
              checked={opt.value === internalValue.value}
              onChange={onChange}
              type="radio"
              value={opt.value}
            />
            <span class="ml-2">{opt.label}</span>
          </label>
        })
      }
       {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## useFieldSelect
Provides convenience functions for a select input

```tsx
import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldSelectArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldSelectArgs) => {
  const internalValue = ref<any>('')

  const classes = computed(() => {
    const base = "block rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onChange = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }
  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true})

  return {
    classes,
    internalValue,
    onChange
  }
}
```

Example usage:
```tsx
import { computed, defineComponent } from "vue";
import { useField, useFieldSelect } from "@potionapps/forms";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    type: String,
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      classes,
      internalValue,
      onChange
    } = useFieldSelect({
      change,
      name: props.name,
      showErrors,
      val
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <select
        class={classes.value}
        onBlur={onBlur}
        onChange={onChange}
        name={props.name}
        {...ctx.attrs}
        value={internalValue.value}
      >
        {ctx.slots.default && ctx.slots.default()}
      </select>
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## useFieldTextarea
Provides convenience functions for a textarea

```tsx
import { computed, ref, watch, ComputedRef, Ref } from "vue"

export interface UseFieldTextareaArgs {
  change?: (name: string, value: any) => void
  focused?: ComputedRef<boolean>
  name: string
  showErrors?: ComputedRef<boolean>
  val: Ref<any>
}
export default (args: UseFieldTextareaArgs) => {
  const internalValue = ref<string>('')
  const classes = computed(() => {
    const base = "rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full "
    return base + (args.showErrors?.value ? "border-red-300 text-red-800" : "border-gray-300")
  })

  const onInput = (e: Event) => {
    internalValue.value = (e.target as HTMLInputElement).value
    args.change?.(args.name, internalValue.value)
  }

  watch(args.val, (updatedVal) => {
    if (updatedVal !== internalValue.value && !args.focused?.value) {
      internalValue.value = updatedVal
    }
  }, { immediate: true })

  return {
    classes,
    internalValue,
    onInput
  }
}
```

Example usage:
```tsx
import { computed, defineComponent } from "vue";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";
import { useField, useFieldTextarea } from "@potionapps/forms";

export default defineComponent({
  props: {
    disableErrors: Boolean,
    label: String,
    name: {
      required: true,
      type: String
    },
    type: String,
    unstyled: Boolean
  },
  setup (props, ctx) {
    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })
    
    const {
      classes,
      internalValue,
      onInput
    } = useFieldTextarea({
      change,
      name: props.name,
      showErrors,
      val
    })

    return () => <>
      {
        props.label &&
        <FieldLabel class="block mb-1">{props.label}</FieldLabel>
      }
      <textarea
        class={classes.value}
        onBlur={onBlur}
        onInput={onInput}
        name={props.name}
        {...ctx.attrs}
      >
        {internalValue.value}
      </textarea>
      {
        showErrors.value &&
        <FieldError class="mt-1">{errors.value.join(", ")}</FieldError>
      }
    </>
  }
})
```
<br />

## useForm
Sets up all variables needed by useField, holds form state and handles form validation and submission.

Source code omitted for brevity, but can be seen here: [https://github.com/PotionApps/potionx/blob/main/packages/forms/src/useForm.ts](https://github.com/PotionApps/potionx/blob/main/packages/forms/src/useForm.ts)

Example usage:
```tsx
  const form = useForm({
    data: model,
    // where model is a computed property pointing to the entry
    fields: schema,
    // where schema is a list of fields adhering to the spec listed below
    onSubmit: (cs) => {
      const params = {
        changes: {
          ...cs.changes
        }
      }
      // handle submission...
    }
  })

  return () =>  <form class="m-auto max-w-500 w-full pt-10" onSubmit={form.submit}></form>
```

Options: 
```tsx
export interface UseFormArgs {
  clearAfterSuccess?: boolean
  // whether to clear changeset after a successful save
  // defaults to true
  data?: ComputedRef<any>
  // a computed ref pointing to the
  // latest version of the saved entry
  fields: Field[]
  // a list of fields and validation rules to pass to the validator
  onSubmit: (cs: Changeset<any>) => Promise<boolean>
  // a function that receives a changeset
  // and will fire when a form with changes
  // and no errors is submitted
  validator?: Validator
  // an option to provide your own validation function
  // defaults to Validator Ecto
}
```
<br />

## useFormButton
Provides convenience properties for use in a form submit button:
```tsx
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
```

Example usage:
```tsx
import { defineComponent, computed } from "vue";
import { FormSubmitStatus, useFormButton } from "@potionapps/forms";
import Btn from './Btn'

export default defineComponent({
  setup (props, ctx) {
    const {
      formSubmitStatus
    } = useFormButton()

    const disabled = computed(() => {
     return formSubmitStatus?.value === FormSubmitStatus.loading
    })

    return () => {
      return <Btn
        disabled={disabled.value}
      >
        {ctx.slots.default && ctx.slots.default() || "Submit"}
      </Btn>
    }
  }
})
```
<br />

## FormSubmitStatus
An enum containing the possible form states:
```tsx
export enum FormSubmitStatus {
  empty = "empty",
  error = "error",
  loading = "loading",
  success = "success"
}
```
