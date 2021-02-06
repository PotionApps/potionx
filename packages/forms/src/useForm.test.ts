import { computed, defineComponent } from 'vue';
import useForm, { FormSubmitStatus } from './useForm'

test('Properly tracks changes made to form with existing data', () => {
  defineComponent({
    setup () {
      const data = computed(() => {
        return {
          name: "name",
          noChange: "noChange"
        }
      })
      const formHooks = useForm({
        data,
        fields: [],
        onSubmit: (cs) => Promise.resolve(true)
      })
      formHooks.change('name', 'updatedName')
      formHooks.change('noChange', 'noChange')
      expect(formHooks.consolidated.value.name).toEqual("updatedName")
      expect(formHooks.numberOfChanges.value).toEqual(1)
      formHooks.submit()
      expect(formHooks.numberOfChanges.value).toEqual(0)
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.success)
      formHooks.change('name', 'updatedName')
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.empty)
    }
  })
});

test('Properly updates errors and serverErrors', () => {
  defineComponent({
    setup () {
      const formHooks = useForm({
        fields: [{
          name: "name",
          type: "text",
          validations: [{
            name: "required"
          }]
        }],
        onSubmit: (cs) => Promise.resolve(false)
      })
      formHooks.setError('error', 'error')
      formHooks.setServerError('error', 'server error')
      expect(formHooks.consolidatedErrors.value.error).toEqual(["error", "server error"])
      expect(formHooks.consolidatedErrors.value.name).toEqual(["This field is required22"])
      expect(formHooks.isValid.value).toEqual(false)
      formHooks.reset()
      expect(formHooks.consolidatedErrors.value).toEqual({})
      expect(formHooks.isValid.value).toEqual(true)
      formHooks.submit()
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.error)
    }
  })
});

test('Properly updates submitStatus', () => {
  defineComponent({
    setup () {
      let result = false
      const formHooks = useForm({
        fields: [],
        onSubmit: (cs) => Promise.resolve(result)
      })
      formHooks.change('name', 'updatedName')
      formHooks.submit()
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.error)
      result = true
      formHooks.submit()
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.success)
      formHooks.change('name', 'updatedName2')
      expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.empty)
    }
  })
})