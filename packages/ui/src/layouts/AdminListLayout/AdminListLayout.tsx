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
        <div class="flex justify-center px-4 py-6">
          <AdminAside class="desktopm:hidden">
            {context.slots.aside && context.slots.aside()}
          </AdminAside>
          <div class="mx-auto w-full">
            <Search 
              change={() => {}}
              class="mb-2"
              focusOnMount={false}
              placeholder="Search..."
              val={props.searchValue}
            />
            {
              false && <StateEmpty class="pb-2 pt-4" />
            }
            {
              false && <StateLoading class="pb-2 pt-4"/>
            }
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
