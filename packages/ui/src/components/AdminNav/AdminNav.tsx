import AdminNavItem, { AdminNavItemProps } from '../AdminNavItem/AdminNavItem'
import { defineComponent, PropType } from 'vue'

export interface AdminNavProps {
  nav: AdminNavItemProps[]
}

export default defineComponent({
  name: "AdminNav",
  props: {
    nav: {
      type: Object as PropType<AdminNavItemProps[]>,
      required: true
    }
  },
  setup (props, ctx) {
    return () => {
      return <nav>
        {
          props.nav.map(n => <AdminNavItem
            class="mb-2"
            click={n.click}
            image={n.image}
            key={n.id}
            label={n.label}
            notification={n.notification}
            to={n.to}
          />)
        }
      </nav>
    }
  }
})
