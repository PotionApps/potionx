import { routeNames } from "./playground/routeNames";
import { faClipboard, faEnvelope, faFile, faInbox, faPlus, faTags, faUsers, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

import { ref, Ref } from 'vue'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'

const nav : Ref<SidebarNavItemProps[]> = ref([
  {
    icon: faFile,
    label: "Content",
    to: {
      name: routeNames.test
    }
  },
  {
    icon: faInbox,
    label: "Inbox",
    notification: 1,
    to: {
      name: routeNames.home
    }
  },
  {
    icon: faPlus,
    label: "New Message",
    notification: 14,
    parentId: "Inbox",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faTags,
    label: "Categories",
    parentId: "Inbox",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faWindowMaximize,
    label: "Websites",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faPlus,
    label: "New Website",
    parentId: "websites",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faTags,
    label: "Categories",
    parentId: "Websites",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faClipboard,
    label: "Forms",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faUsers,
    label: "People",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faPlus,
    label: "Invite User",
    parentId: "People",
    to: {
      name: routeNames.login
    }
  },
  {
    icon: faEnvelope,
    label: "Invites",
    notification: 8,
    parentId: "People",
    to: {
      name: routeNames.login
    }
  }
])

export default () => {
  return nav
}
