import { computed, defineComponent, ref, PropType, onMounted, onBeforeUnmount } from "vue";
import { useField } from "@potionapps/forms";
import FieldError from "../FieldError/FieldError";
import FieldLabel from "../FieldLabel/FieldLabel";
import BtnSmallSecondary from "../Btn/BtnSmallSecondary";
import { FontAwesomeIcon } from "@potionapps/utils";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import FieldFileChosen from "./FieldFileChosen";

export interface FieldFile {
  accept: string[],
  fileIcons?: any,
  label?: string
  multiple?: boolean
  name: string
  type?: string
  unstyled?: boolean
}

export default defineComponent({
  name: "FieldFile",
  props: {
    accept: {
      required: true,
      type: Array as PropType<FieldFile['accept']>
    },
    fileIcons: Object,
    label: String,
    multiple: Boolean,
    name: {
      required: true,
      type: String
    },
    unstyled: Boolean
  },
  setup (props: FieldFile, ctx) {
    const defaultIcon = faFileAlt
    const isDraggedOver = ref(false)

    const clear = () => {
      change?.(
        props.name,
        null
      )
    }
    const fileInput = ref<HTMLInputElement | null>(null)

    const filterFiles = (files: File[]) => {
      return files.filter(f => {
        const type = (f.type || '').split('/').pop()
        return props.accept.includes('.' + type)
      })
    }

    const icon = computed(() => {
      const type = (val.value?.type || '').split('/').pop()
      return type && props.fileIcons?.[type] || defaultIcon
    })


    const {
      change,
      errors,
      onBlur,
      showErrors,
      val
    } = useField({
      name: computed(() => props.name)
    })

    const onDragleave = (e: DragEvent) => {
      isDraggedOver.value = false
    }
    const onDragover = (e: DragEvent) => {
      e.preventDefault()
      isDraggedOver.value = true
    }
    const onPaste = (e: any) => {
      if (e.dataTransfer) {
        e.preventDefault()
      }
      if (e.clipboardData || e.dataTransfer) {
        const items : any[] = e.clipboardData?.items || e.dataTransfer.items;
        if (!items) return;
        const files = filterFiles(
          Array.from(items)
            .map(i => i.getAsFile())
        ) 
        if (files.length) {
          change?.(
            props.name,
            props.multiple ? files : files[0]
          )
        }
      }
      isDraggedOver.value = false
    }

    const onFileChange = () => {
      const files = filterFiles(
        Array.from(fileInput.value!.files || [])
      ) 

      if (files.length) {
        change?.(
          props.name,
          props.multiple ? files : files
        )
        fileInput.value!.value = ''
      }
    }

    const triggerFileInput = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      fileInput.value!.click()
    }

    onBeforeUnmount(() => {
      document.body.removeEventListener('paste', onPaste, false)
    })
    onMounted(() => {
      document.body.addEventListener('paste', onPaste, false);
    })

    return () => { 
      return <>
        {
          props.label &&
          <FieldLabel>{props.label}</FieldLabel>
        }
        <div
          class={[
            isDraggedOver.value ? "bg-gray-100" : "bg-white",
            isDraggedOver.value ? "border-blue-700" : "border-gray-300",
            "border-2",
            "border-dashed",
            "cursor-pointer", 
            "hover:border-blue-700",
            "px-4",
            "py-8",
            "rounded",
            "flex",
            "flex-col",
            "items-center",
            "justify-center"
          ]}
          onDragleave={onDragleave}
          onClick={triggerFileInput}
          onDragover={onDragover}
          onDrop={onPaste}
        >
          {
            !props.multiple &&
            val.value &&
            <FieldFileChosen
              class="mb-3"
              icon={icon.value}
              remove={clear}
              title={val.value?.name}
            />
          }
          <BtnSmallSecondary class="s550:px-8" >
            <span class="mr-2">
              {
                !props.multiple && val.value ? "Replace File" : "Add File"
              }
            </span>
            <FontAwesomeIcon class="text-gray-500" icon={faFileAlt} />
          </BtnSmallSecondary>
          <div class="mt-1 text-gray-400 text-xs">
            Click or Drag &amp; Drop. Accepts: {props.accept.join(', ')}
          </div>
        </div>
        <input
          accept={props.accept.join(', ')}
          class="absolute hidden opacity-0"
          onChange={onFileChange}
          name={props.name}
          {...ctx.attrs}
          multiple={props.multiple}
          ref={fileInput}
          type="file"
        />
        {
          showErrors.value &&
          <FieldError>{errors.value.join(", ")}</FieldError>
        }
      </>
    }
  }
})