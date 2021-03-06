import { defineComponent } from "vue";
import ModelTable, { ModelRow } from "./ModelTable";

export default defineComponent(
  () => () => <ModelTable
    rows={
      [
        {
          id: "1",
          description: "Creates an async component.",
          subtitle: "Developer and Master of the Sea",
          roles: ["Admin", "Guck Tuckerson"],
          title: "Michael Demchuk",
          insertedAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString()
        } as ModelRow,
        {
          id: "2",
          description: "Creates an async component that will be loaded only when it's necessary.",
          subtitle: "Developer and Cofounder",
          roles: ["admin", "test"],
          title: "Vince Roy",
          insertedAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString()
        } as ModelRow
      ]
    }
  />
)