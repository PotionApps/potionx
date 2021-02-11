import { defineComponent, computed, Ref, ref, onMounted, watch } from "vue";
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@potionapps/utils';


export interface SearchProps {
  change: (s: string) => void
  focusOnMount: boolean
  placeholder?: string
  val: Ref<string>
}

export default defineComponent({
  name: "Search",
  props: {
    change: {
      required: true,
      type: Function
    },
    focusOnMount: Boolean,
    placeholder: String,
    val: {
      type: Object
    }
  },
  setup (props, context) {

    const blur = () => {
      focused.value = false
    }
    const clear = () => {
      searchText.value = ''
      props.change('')
    }
    const focused = ref(false)
    const focus = () => {
      focused.value = true
    }

    const $input = ref<any>(null)
    const onChange = (e: Event) => {
      searchText.value = (e.target as HTMLInputElement).value
      props.change(searchText.value)
    }
    onMounted(() => {
      if (props.focusOnMount) {
        $input.value!.focus()
      }
    })

    const placeholder = computed(() => {
      return props.placeholder
    })
      
    const searchText = ref('')
    if (props.val) {
      watch(props.val, (next: any, prev: any) => {
        if (!focused.value && next !== searchText.value) {
          searchText.value = next
        }
      }, { immediate: true })
    }

    return () => {
      return (
        <div class={["relative", "w-full"]}>
          <div class={["absolute", "right-3", "top-2/4", "transform", "-translate-y-1/2", searchText.value && "cursor-pointer"]} onClick={clear}>
            <FontAwesomeIcon class={["opacity-50", searchText.value ? "w-4" : "w-5"]} icon={searchText.value ? faTimes : faSearch} />
          </div>
          <input 
            class="bg-white border-1 border-gray-300 focus:border-blue-400 focus:bg-gray-100 outline-none py-2 pl-3 pr-10 rounded-md transition w-full"
            onBlur={blur}
            onFocus={focus}
            onInput={onChange}
            placeholder={placeholder.value}
            ref={$input}
            value={searchText.value}
          />
        </div>
      )
    }
  }
})
