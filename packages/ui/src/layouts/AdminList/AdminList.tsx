import { defineComponent } from "vue"
import { faFilter, faSortAmountDown, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Pagination from '../../components/Pagination/Pagination'
import Pill from '../../components/Pill/Pill'
import Search from '../../components/Search/Search'
import StateEmpty from "../../components/StateEmpty/StateEmpty"
import StateLoading from "../../components/StateLoading/StateLoading"

export interface AdminListProps {
  
}

export default defineComponent({
  name: "AdminList",
  props: {
    searchValue: Object
  },
  setup (props, context) {

    return () => {
      return (
        <div class="px-4 py-6 s1050:px-8 s1450:px-12">
          <div class="flex s650m:flex-wrap mb-2">
            <Search 
              change={() => {}}
              class="mb-2"
              focusOnMount={false}
              placeholder="Search..."
              val={props.searchValue}
            />
            <div class="flex-fit s650m:pr-1 s650m:w-1/2 s650:ml-2">
              <div class="bg-white border-1 border-gray-300 cursor-pointer flex items-center p-2 rounded-md  transition hover:border-blue-400">
                <FontAwesomeIcon class="mr-1 text-gray-400 text-base" icon={faSortAmountDown} />
                <span>Oldest</span>
              </div>
            </div>
            <div class="flex-fit mb-2 s650m:pl-1 s650m:w-1/2 s650:ml-2">
              <div class="bg-white border-1 border-gray-300 cursor-pointer flex items-center p-2 rounded-md  transition hover:border-blue-400">
                <FontAwesomeIcon class="mr-1 text-gray-400 text-base" icon={faFilter} />
                <span>Sort</span>
              </div>
            </div>
          </div>
          <div class="flex">
            <Pill 
              class="mb-2 mr-2"
              icon={faTag}
              label="Category"
              remove={() => {}}
            />
          </div>
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
      )
    }
  }
})
