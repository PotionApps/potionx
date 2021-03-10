import { computed, defineComponent, watch, watchEffect } from 'vue'
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, useForm } from '@potionapps/forms'
import { RootQueryType, RootMutationType__model__MutationArgs, RootMutationType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery, useMutation } from "@urql/vue";
import { useRoute, useRouter } from 'vue-router'
import AdminBody from 'components/AdminBody/AdminBody'
import AdminFooter from 'components/AdminFooter/AdminFooter'
import AdminHeader from 'components/AdminHeader/AdminHeader'
import AdminHeaderBtnWrap from 'components/AdminHeaderBtnWrap/AdminHeaderBtnWrap';
import AdminMain from 'components/AdminMain/AdminMain';
import AdminHeaderTitle from 'components/AdminHeaderTitle/AdminHeaderTitle'
import BtnIcon from 'components/Btn/BtnIcon';
import BtnMobileMenu from 'components/Btn/BtnMobileMenu'
import BtnSmallPrimary from 'components/Btn/BtnSmallPrimary';
import BtnSmallSecondary from 'components/Btn/BtnSmallSecondary';
import BtnSubmit from 'components/Btn/BtnSubmit'
import FieldCheckbox from 'components/FieldCheckbox/FieldCheckbox';
import FieldInput from 'components/FieldInput/FieldInput';
import FieldRadio from 'components/FieldRadio/FieldRadio';
import FieldSelect from 'components/FieldSelect/FieldSelect';
import FieldTextarea from 'components/FieldTextarea/FieldTextarea';
import mutation from 'shared/models/__context__/__model__/__model_graphql_case__Mutation.gql'
import schema from 'shared/models/__context__/__model__/__model_graphql_case__.json'
import single from 'shared/models/__context__/__model__/__model_graphql_case__Single.gql'

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
      if (route.params.id === "new") return {}
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
            btns: () => <div class="flex">
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
            </div>
          }}
        >
          <div class="flex">
            <BtnIcon
              class="mr-2 s1050m:hidden"
              icon={faArrowLeft}
              to={{name: routeNames.__model_graphql_case__List}}
            />
            <AdminHeaderTitle>
              {title.value}
            </AdminHeaderTitle>
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
            icon={faArrowLeft}
            label="Back"
            to={{name: routeNames.__model_graphql_case__List}}
          />
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