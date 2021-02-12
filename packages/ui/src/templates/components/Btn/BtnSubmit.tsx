import { defineComponent, computed } from "vue";
import { FormSubmitStatus, useFormButton } from "@potionapps/forms";
import Btn from './Btn'

export default defineComponent({
  setup () {
    const {
      formSubmitStatus
    } = useFormButton()

    const disabled = computed(() => {
     return formSubmitStatus?.value === FormSubmitStatus.loading
    })

    return (_props, ctx) => {
      return <Btn
        disabled={disabled.value}
      >
        {ctx.slots.default && ctx.slots.default() || "Submit"}
      </Btn>
    }
  }
})