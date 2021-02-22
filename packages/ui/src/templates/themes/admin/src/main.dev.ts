import router from "./main"
import RouteEdit from 'root/crudRoutes/RouteEdit'
import RouteList from 'root/crudRoutes/RouteList'
import useAdminNavPrimary from './useAdminNavPrimary'

// add routes
router.addRoute({
  component: RouteEdit,
  name: "TEMP_model_graphql_caseEdit",
  path: "/edit/:id"
})
router.addRoute({
  component: RouteList,
  name: "list",
  path: "/list"
})

// add nav
useAdminNavPrimary().value.push({
  label: "List",
  to: {
    name: "list"
  }
})