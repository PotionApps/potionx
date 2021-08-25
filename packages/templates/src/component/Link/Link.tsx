import { computed, defineComponent, PropType } from "vue";
import { RouteLocationRaw, useLink } from "vue-router";

export default defineComponent({
  props: {
    activeClass: String,
    exactActiveClass: String,
    inactiveClass: String,
    to: {
      default: "/",
      type: Object as PropType<RouteLocationRaw | null>
    }
  },
  setup (props, ctx) {
    const link = useLink({
      to: computed(() => props.to || "/")
    })

    const click = (e: MouseEvent) => {
      if (isExternalLink.value) return
      link.navigate(e)
    }

    const isExternalLink = computed(
      () => typeof props.to === 'string' && (props.to.startsWith('http') || props.to.startsWith('//'))
    )

    return () => {
      return <a
      class={[
        link.isActive.value && props.activeClass,
        link.isExactActive.value && props.exactActiveClass,
        !link.isExactActive.value && (!link.isActive.value || props.exactActiveClass) && props.inactiveClass
      ]}
      href={link.href.value}
      onClick={click}
      rel={isExternalLink.value && "noopener noreferrer" || ""}
      target={isExternalLink.value && "_blank" || ""}
    >{ctx.slots.default && ctx.slots.default()}</a>
    }
  }
})