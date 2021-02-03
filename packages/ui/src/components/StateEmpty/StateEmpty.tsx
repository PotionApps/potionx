import { defineComponent } from "vue";
import FolderOpen from "../../assets/folder-open.svg"

export default defineComponent({
  name: "StateEmpty",
  props: {},
  setup (props, context) {
    return () => {
      return (
        <div class="text-center">
          <div class="bg-white flex h-20 items-center justify-center mx-auto relative rounded-full w-20">
            <img class="opacity-40 w-12" src={FolderOpen} />
          </div>
          <p class="mt-2 text-gray-500 text-xl">No Results</p>
        </div>
      )
    }
  }
})
