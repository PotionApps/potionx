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