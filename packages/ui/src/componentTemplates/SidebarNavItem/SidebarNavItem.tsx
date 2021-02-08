import { defineComponent, PropType, computed } from "vue";
import { RouteLocationRaw } from "vue-router";

export default defineComponent({
  props: {
    to: {
      type: [Object, String] as PropType<RouteLocationRaw>
    }
  },
  setup (props, ctx) {
    const classes = computed(() => {
      return "flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity text-gray-100"
    })
    return () => {
      if (!props.to) {
        return <div class={classes.value}>
          {ctx.slots.default && ctx.slots.default()}
        </div>
      }
      return <router-link class={classes.value} to={props.to}>
        {ctx.slots.default && ctx.slots.default()}
      </router-link>
    }
  }
})