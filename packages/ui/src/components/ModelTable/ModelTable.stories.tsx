import { defineComponent } from "vue";
import Cat from '../../assets/cat.jpg'
import ModelTable from "./ModelTable";

export default defineComponent(
  () => () => <ModelTable
    rows={
      [
        {
          id: "1",
          description: "Creates an async component that will be loaded only when it's necessary.",
          image: Cat,
          subtitle: "Developer and Cofounder",
          title: "John Smith",
          insertedAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString()
        } 
      ]
    }
  />
)