import { computed, defineComponent } from 'vue'
import FieldCheckbox from './fields/FieldCheckbox'
import FieldInput from './fields/FieldInput'
import FieldRadio from './fields/FieldRadio'
import FieldSelect from './fields/FieldSelect'
import useForm from './useForm'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const form = useForm<{checkbox: string[], input: string, radio: string, test: string}>({
      data: computed(() => {
        return {
          checkbox: ["checked"],
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
        }
      ],
      onSubmit: (cs) => {
        return Promise.resolve(true)
      }
    })
    return () => {
      return <form  onSubmit={form.submit}>
        <FieldInput label="An Input" name="input" type="text"></FieldInput>
        <FieldSelect name="select">
          <option value="test">Test</option>
          <option value="select2">Test 2</option>
        </FieldSelect>
        <FieldCheckbox
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
        <FieldRadio
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
      </form>
    }
  }
})