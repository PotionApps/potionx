import { computed, defineComponent } from 'vue'
import FieldCheckbox from './fields/FieldCheckbox/FieldCheckbox'
import FieldInput from './fields/FieldInput/FieldInput'
import FieldRadio from './fields/FieldRadio/FieldRadio'
import FieldSelect from './fields/FieldSelect/FieldSelect'
import useForm from './useForm'
import FieldTextarea from './fields/FieldTextarea/FieldTextarea'
import FormSubmit from './FormSubmit'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const form = useForm({
      data: computed(() => {
        return {
          checkbox: [],
          input: "vince",
          radio: "checked2",
          select: "select2"
        }
      }),
      fields: [
        {
          name: 'input',
          type: 'email',
          validations: [
            {
              name: "format",
              params: {
                pattern: "^[A-Za-z0-9\._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$"
              }
            }
          ]
        },
        {
          name: 'checkbox',
          validations: [
            {
              name: "required"
            }
          ]
        }
      ],
      onSubmit: (cs) => {
        return Promise.resolve(true)
      }
    })
    return () => {
      return <form class="m-auto max-w-500 pt-10" onSubmit={form.submit}>
        <div class="mb-2">
        <FieldInput label="An Input" name="input" type="text"></FieldInput>
        </div>
        <div class="mb-2">
          <FieldSelect label="A Select" name="select">
            <option value="test">Test</option>
            <option value="select2">Test 2</option>
          </FieldSelect>
        </div>
        <div class="mb-2">
          <FieldCheckbox
            label="Checkboxes"
            name="checkbox"
            options={[
              {
                label: "Option 1",
                value: "checked"
              },
              {
                label: "Option 2",
                value: "checked2"
              }
            ]}
          ></FieldCheckbox>
        </div>
        <div class="mb-2">
          <FieldRadio
            label="A Radio"
            name="radio"
            options={[
              {
                label: "Option 1",
                value: "checked"
              },
              {
                label: "Option 2",
                value: "checked2"
              }
            ]}
          ></FieldRadio>
        </div>
        <FieldTextarea
          label="Textarea"
          name="textarea"
        >
        </FieldTextarea>
        <FormSubmit class="mt-4" />
      </form>
    }
  }
})