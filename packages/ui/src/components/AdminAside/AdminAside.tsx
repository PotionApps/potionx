import { defineComponent } from "vue";


export default defineComponent({
  name: "AdminAside",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="w-full desktop:max-w-200 desktopm:bg-white">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
