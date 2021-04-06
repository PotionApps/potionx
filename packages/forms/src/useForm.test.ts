import { computed, createApp, defineComponent, h, onMounted, nextTick } from 'vue';
import useForm, { FormSubmitStatus } from './useForm'

beforeEach(() => {
  document.body.innerHTML = "<div id='app'></div>"
})

test('Properly tracks changes made to form with existing data', () => {
  const comp = defineComponent({
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
     
      onMounted(() => {
        nextTick(() => {
          expect(formHooks.fieldsNotInDomWithErrors.value).toEqual(["name"])
          formHooks.change('name', 'updatedName')
          formHooks.change('noChange', 'noChange')
          expect(formHooks.consolidated.value.name).toEqual("updatedName")
          expect(formHooks.numberOfChanges.value).toEqual(1)
          expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.empty)
          formHooks.submit()
          expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.success)
          expect(formHooks.numberOfChanges.value).toEqual(0)
        })
      })

      return () => h('div')
    }
  })
  createApp({
    render () {
      return h(comp)
    }
  }).mount("#app")
});

test('Properly updates errors and serverErrors', () => {
  const comp = 
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
        onMounted(() => {
          formHooks.setError('error', 'error')
          formHooks.setServerError('error', 'server error')
          expect(formHooks.consolidatedErrors.value.error).toEqual(["error", "server error"])
          expect(formHooks.consolidatedErrors.value.name).toEqual(["This field is required"])
          expect(formHooks.isValid.value).toEqual(false)
          formHooks.reset()
          expect(formHooks.consolidatedErrors.value.name).toEqual(["This field is required"])
        })

        return () => h('div')
      }
    })
  createApp({
    render () {
      return h(comp)
    }
  }).mount("#app")
});

test('Properly updates submitStatus', () => {
  const comp = defineComponent({
    setup () {
      let result = false
      const formHooks = useForm({
        fields: [],
        onSubmit: (cs) => Promise.resolve(result)
      })
      onMounted(() => {
        formHooks.submit()
        nextTick(() => {
          expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.success)
          formHooks.change('name', 'updatedName2')
          expect(formHooks.submitStatus.value).toEqual(FormSubmitStatus.empty)
        })
      })

      return () => h('div')
    }
  })

  createApp({
    render () {
      return h(comp)
    }
  }).mount("#app")
})