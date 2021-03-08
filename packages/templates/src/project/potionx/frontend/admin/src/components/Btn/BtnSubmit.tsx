import { defineComponent, computed } from "vue";
import { FormSubmitStatus, useFormButton } from "@potionapps/forms";
import BtnPrimary from "./BtnPrimary";

export default defineComponent({
  name: "BtnSubmit",
  setup (_, ctx) {
    const {
      formSubmitStatus
    } = useFormButton()

    const disabled = computed(() => {
     return formSubmitStatus?.value === FormSubmitStatus.loading
    })

    return () => {
      return <BtnPrimary
        class="w-full"
        disabled={disabled.value}
      >
        {ctx.slots.default && ctx.slots.default() || "Submit"}
      </BtnPrimary>
    }
  }
})