import { computed, defineComponent } from 'vue'
import { Field, useForm } from '@potionapps/forms'
import { routeNames } from 'root/routes/routeNames'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from "@urql/vue";
import { RootQueryType, RootMutationTypeUserMutationArgs, RootMutationType } from "shared/types";
import AdminBody from 'root/components/AdminBody/AdminBody'
import AdminFooter from 'root/components/AdminFooter/AdminFooter'
import AdminHeader from 'root/components/AdminHeader/AdminHeader'
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminTitle from 'root/components/AdminTitle/AdminTitle'
import Btn from 'root/components/Btn/Btn'
import BtnMobileMenu from 'root/components/Btn/BtnMobileMenu'
import BtnPrimary from 'root/components/Btn/BtnPrimary';
import BtnSubmit from 'root/components/Btn/BtnSubmit'
import FieldCheckbox from 'root/components/FieldCheckbox/FieldCheckbox';
import FieldInput from 'root/components/FieldInput/FieldInput';
import FieldRadio from 'root/components/FieldRadio/FieldRadio';
import FieldSelect from 'root/components/FieldSelect/FieldSelect';
import FieldTextarea from 'root/components/FieldTextarea/FieldTextarea';
import mutation from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_caseMutation.gql.ts'
import schema from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_case.json'
import single from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_caseSingle.gql.ts'
import AdminHeaderBtnWrap from 'root/components/AdminHeaderBtnWrap/AdminHeaderBtnWrap';

export default defineComponent({
  setup () {
    const deleteEntry = () => {

    }

    const route = useRoute()
    const router = useRouter()
    const { data } = useQuery<RootQueryType>({
      pause: computed(() => {
        return route.params.id === 'new'
      }),
      query: single,
      variables: computed(() => {
        return {filters: {id: route.params.id}}
      })
    })

    const model = computed(() => {
      return data.value?.userSingle
    })

    const newEntryLink = {
      name: routeNames.TEMP_model_graphql_caseEdit,
      params: {
        id: 'new'
      }
    }

    const { executeMutation } = useMutation<RootMutationType>(mutation)
    const form = useForm({
      data: model,
      fields: schema,
      onSubmit: (cs) => {
        const params : RootMutationTypeUserMutationArgs = {
          changes: {
            ...cs.changes
          }
        }
        if (route.params.id !== 'new') {
          params.filters = { id: route.params.id as string }
        }
        return executeMutation(params)
          .then(res => {
            if (res.error || res.data?.userMutation?.errorsFields?.length) {
              if (res.data?.userMutation?.errorsFields?.length) {
                res.data?.userMutation?.errorsFields.forEach(err => {
                  form.setServerError(err?.field, err?.message)
                })
              }
              return false
            } else {
              if (route.params.id === 'new') {
                router.push({
                  name: route.name!,
                  params: { id: res.data!.userMutation!.node!.id }
                })
              }
              return true
            }
          })
      }
    })

    const title = computed(() => {
      if (route.params.id === "new") return "New TEMP_model"
      return model.value?.title || "TEMP_model"
    })

    return () => {
      return <AdminShell>
        <AdminHeader
          v-slots={{
            btns: () => <>
              <AdminHeaderBtnWrap>
                <Btn
                  class="s1050m:hidden"
                  click={deleteEntry}
                  label="Delete User"
                />
              </AdminHeaderBtnWrap>
              <AdminHeaderBtnWrap>
                <BtnPrimary
                  class="s1050m:hidden"
                  label="Add User"
                  to={newEntryLink}
                />
              </AdminHeaderBtnWrap>
            </>
          }}
        >
          <AdminTitle>
            {title.value}
          </AdminTitle>
        </AdminHeader>
        <AdminBody>
          <form class="m-auto max-w-500 w-full pt-10" onSubmit={form.submit}>
          {
            schema.map((s: Field) => {
              let component
              switch (s.type) {
                case "string":
                  component = <FieldInput label={s.label || s.name} name={s.name} />
                  break;
                case "checkbox":
                  component =
                    <FieldCheckbox
                      label={s.label || s.name}
                      name={s.name}
                      options={s.options?.map((value: any) => ({value, label: value}))}
                    />
                  break;
                case "radio":
                  component =
                    <FieldRadio
                      label={s.label || s.name}
                      name={s.name}
                      options={s.options?.map((value: any) => ({value, label: value}))}
                    />
                  break;
                case "select":
                  component =
                    <FieldSelect
                      label={s.label || s.name}
                      name={s.name}
                    />
                    break;
                case "select":
                  component =
                    <FieldTextarea
                      label={s.label || s.name}
                      name={s.name}
                    />
                    break;
                default: 
                  return null
              }

              return <div class="mb-3">
                {component}
              </div>
            })
          }
          <BtnSubmit />
        </form>
        </AdminBody>
        <AdminFooter>
          <BtnMobileMenu
            label="New TEMP_model"
            to={newEntryLink}
          />
        </AdminFooter>
      </AdminShell>
    }
  }
})