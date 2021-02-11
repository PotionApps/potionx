import { defineComponent, computed } from "vue"
import routeNames from 'root/routes/routeNames'

export default defineComponent({
  setup () {
    const newEntryLink = {
      name: routeNames.<%= @model_name_graphql_case %>Edit,
      params: {
        id: 'new'
      }
    }
    const headerBtns = computed(() => [
      {
        hideBtnMobile: true,
        label: "New <%= @model_name %>",
        reverse: true,
        to: newEntryLink
      }
    ])

    const headerTabs = computed(() => [
      // {
      //   icon: faArrowLeft,
      //   label: "Entries",
      //   to: {
      //     name: routeNames.entries
      //   }
      // }
    ])

    const mobileBtns = computed(() => [
      {
        label: "New <%= @model_name %>",
        to: newEntryLink
      }
    ])

    const search = computed(() => {
      return ""
    })

    return () => <AdminShell>
      <AdminHeader tabs={headerTabs}>
        <div class="flex items-center justify-between pr-4 s1050m:flex-wrap s1050:pr-0">
          <div class="flex flex-full items-center mb-2">
            <div class="s1050:max-w-500 s1450:max-w-600">
              <p class="font-semibold text-gray-900 text-xl"><%= @model_name %> Management</p>
            </div>
          </div>
          {headerBtns.value.map(btn => {
            return <Btn
              {...btn}
              class={["
                bg-gray-200 mb-2 p-2 rounded text-gray-900 text-xs s1050m:mr-2 s1050:ml-2",
                btn.hideBtnMobile && "s1050m:hidden"
              ]}
          />})}
        </div>
      </AdminHeader>
      <AdminBody>
        <div class="flex s650m:flex-wrap mb-2">
          <Search 
            change={() => {}}
            class="mb-2"
            focusOnMount={false}
            placeholder="Search..."
            val={search}
          />
        </div>
        {
          true && <StateEmpty class="pb-2 pt-4" icon={faUsers} label="No Users Found" />
        }
        {
          true && <StateLoading class="pb-2 pt-4"/>
        }
        <AdminList>
          {[1,2,3,4].map(i => <AdminCard>Test</AdminCard>)}
        </AdminList>
      </AdminBody>
      <AdminFooter menuRoute={{name: routeNames.menu}}>
        {
          mobileBtns.value.map(btn => {
            return <Btn
              class="bg-gray-700 hover:bg-gray-600 mr-2 font-semibold text-gray-300 w-full"
              {...btn}
            />
          })
        }
      </AdminFooter>
    </AdminShell>
  }
})