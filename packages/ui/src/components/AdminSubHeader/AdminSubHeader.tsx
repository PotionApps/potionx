import { defineComponent } from "vue";

export interface PropsAdminSubHeader {
  
}

export default defineComponent({
  name: "AdminSubHeader",
  props: {
  },
  setup (props, context) {
    return () => {
      return (
        <div>
          subheader
        </div>
      )
    }
  }
})
