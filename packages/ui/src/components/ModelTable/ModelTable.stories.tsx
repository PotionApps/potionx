import { defineComponent } from "vue";
import Cat from '../../assets/cat.jpg'
import ModelTable, { ModelRow } from "./ModelTable";

export default defineComponent(
  () => () => <ModelTable
    rows={
      [
        {
          id: "1",
          description: "Creates an async component that will be loaded only when it's necessary.",
          icon: Cat,
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