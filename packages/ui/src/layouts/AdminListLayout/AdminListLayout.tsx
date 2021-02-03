import AdminAside from "../../components/AdminAside/AdminAside";
import { defineComponent } from "vue";
import Pagination from '../../components/Pagination/Pagination'
import Search from '../../components/Search/Search'
import StateEmpty from "../../components/StateEmpty/StateEmpty";
import StateLoading from "../../components/StateLoading/StateLoading";

export default defineComponent({
  name: "AdminList",
  props: {
    searchValue: Object
  },
  setup (props, context) {

    return () => {
      return (
        <div class="flex justify-center p-4">
          <AdminAside class="desktopm:hidden">
            {context.slots.aside && context.slots.aside()}
          </AdminAside>
          <div class="mx-auto max-w-900 w-full">
            <Search 
              change={() => {}}
              focusOnMount={false}
              placeholder="Search..."
              val={props.searchValue}
            />
            <StateEmpty />
            <StateLoading />
            <div class="border-gray-300 border-t-1 overflow-hidden s750:border-l-1 s750:border-r-1 s750m:-mx-4 s750:rounded-md s750:shadow-md">
              {context.slots.default && context.slots.default()}
            </div>
            <Pagination class="py-6" />
          </div>
        </div>
      )
    }
  }
})
