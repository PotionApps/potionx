import { defineComponent } from "vue";
import authFlow from "../../authFlow";

export default defineComponent({
  setup () {
    return () => <div onClick={() => authFlow({provider: 'azure_ad'})}>Microsoft</div>
  }
})