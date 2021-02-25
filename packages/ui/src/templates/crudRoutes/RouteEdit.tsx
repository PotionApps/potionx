import { computed, defineComponent } from 'vue'
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, useForm } from '@potionapps/forms'
import { RootQueryType, RootMutationType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery, useMutation } from "@urql/vue";
import { useRoute, useRouter } from 'vue-router'
import AdminBody from 'root/components/AdminBody/AdminBody'
import AdminFooter from 'root/components/AdminFooter/AdminFooter'
import AdminHeader from 'root/components/AdminHeader/AdminHeader'
import AdminHeaderBtnWrap from 'root/components/AdminHeaderBtnWrap/AdminHeaderBtnWrap';
import AdminMain from 'root/components/AdminMain/AdminMain';
import AdminTitle from 'root/components/AdminTitle/AdminTitle'
import BtnMobileMenu from 'root/components/Btn/BtnMobileMenu'
import BtnSmallPrimary from 'root/components/Btn/BtnSmallPrimary';
import BtnSmallSecondary from 'root/components/Btn/BtnSmallSecondary';
import BtnSubmit from 'root/components/Btn/BtnSubmit'
import FieldCheckbox from 'root/components/FieldCheckbox/FieldCheckbox';
import FieldInput from 'root/components/FieldInput/FieldInput';
import FieldRadio from 'root/components/FieldRadio/FieldRadio';
import FieldSelect from 'root/components/FieldSelect/FieldSelect';
import FieldTextarea from 'root/components/FieldTextarea/FieldTextarea';
import mutation from 'shared/models/__context__/__model__/__model_graphql_case__Mutation.gql'
import schema from 'shared/models/__context__/__model__/__model_graphql_case__.json'
import single from 'shared/models/__context__/__model__/__model_graphql_case__Single.gql'
import BtnIcon from 'root/components/Btn/BtnIcon';

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
      return data.value?.__model_graphql_case__Single
    })

    const newEntryLink = {
      name: routeNames.__model_graphql_case__Edit,
      params: {
        id: 'new'
      }
    }

    const { executeMutation } = useMutation<RootMutationType>(mutation)
    const form = useForm({
      data: model,
      fields: schema,
      onSubmit: (cs) => {
        const params : RootMutationType__model__MutationArgs = {
          changes: {
            ...cs.changes
          }
        }
        if (route.params.id !== 'new') {
          params.filters = { id: route.params.id as string }
        }
        return executeMutation(params)
          .then(res => {
            if (res.error || res.data?.__model_graphql_case__Mutation?.errorsFields?.length) {
              if (res.data?.__model_graphql_case__Mutation?.errorsFields?.length) {
                res.data?.__model_graphql_case__Mutation?.errorsFields.forEach(err => {
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
      if (route.params.id === "new") return "New __model__"
      return model.value?.title || "__model__"
    })

    return () => {
      return <AdminMain>
        <AdminHeader
          v-slots={{
            btns: () => <>
              <AdminHeaderBtnWrap>
                <BtnSmallSecondary
                  click={deleteEntry}
                  icon={faTrash}
                  label="Delete __model__"
                />
              </AdminHeaderBtnWrap>
              <AdminHeaderBtnWrap class="s1050m:hidden">
                <BtnSmallPrimary
                  label="New __model__"
                  icon={faPlus}
                  to={newEntryLink}
                />
              </AdminHeaderBtnWrap>
            </>
          }}
        >
          <div class="flex">
            <BtnIcon
              class="mr-2"
              click={() => {}}
              icon={faArrowLeft}
            />
            <AdminTitle>
              {title.value}
            </AdminTitle>
          </div>
        </AdminHeader>
        <AdminBody>
          <form class="m-auto max-w-500 w-full s750:pt-6" onSubmit={form.submit}>
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
          <BtnSubmit class="mt-6" />
        </form>
        </AdminBody>
        <AdminFooter>
          <BtnMobileMenu
            icon={faPlus}
            label="New __model__"
            to={newEntryLink}
          />
        </AdminFooter>
      </AdminMain>
    }
  }
})