import { computed, defineComponent, ref } from 'vue'
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Field, useForm } from '@potionapps/forms'
import { RootQueryType, RootMutationType__model__MutationArgs, RootMutationType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery, useMutation } from "@urql/vue";
import { useRoute, useRouter } from 'vue-router'
import AdminBody from 'components/AdminBody/AdminBody'
import AdminFooter from 'components/AdminFooter/AdminFooter'
import AdminForm from 'components/AdminForm/AdminForm';
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
import mutationDelete from 'shared/models/__context__/__model__/__model_graphql_case__Delete.gql'
import schema from 'shared/models/__context__/__model__/__model_graphql_case__.json'
import single from 'shared/models/__context__/__model__/__model_graphql_case__Single.gql'

export default defineComponent({
  setup () {
    const serverError = ref('')

    const deleteEntry = async () => {
      if (fetchingDelete.value) return
      const res = await executeDeleteMutation({
        filters: {
          id: route.params.id as string
        }
      })
      if (res.data?.__model_graphql_case__Delete?.node?.id) {
        router.push({
          name: routeNames.__model_graphql_case__List
        })
      }
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
      if (route.params.id === "new") return null
      return data.value?.__model_graphql_case__Single
    })

    const newEntryLink = {
      name: routeNames.__model_graphql_case__Edit,
      params: {
        id: 'new'
      }
    }

    const { executeMutation } = useMutation<RootMutationType>(mutation)
    const { executeMutation: executeDeleteMutation, fetching: fetchingDelete } = useMutation<RootMutationType>(mutationDelete)
    const form = useForm({
      data: model,
      fields: schema,
      onSubmit: (cs) => {
        serverError.value = ''
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
              if (res.error) serverError.value = res.error.message
              return false
            } else {
              if (route.params.id === 'new') {
                router.push({
                  name: route.name!,
                  params: { id: res.data!.__model_graphql_case__Mutation!.node!.id }
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
               {
                route.params.id !== 'new' &&
                <AdminHeaderBtnWrap>
                  <BtnSmallSecondary
                    click={deleteEntry}
                    icon={faTrash}
                    label="Delete __model__"
                  />
                </AdminHeaderBtnWrap>
              }
              <AdminHeaderBtnWrap>
                <BtnSmallPrimary
                  label="New __model__"
                  icon={faPlus}
                  to={newEntryLink}
                />
              </AdminHeaderBtnWrap>
            </div>
          }}
        >
          <div class="flex items-center">
            <BtnIcon
              class="mr-2 s1050m:hidden"
              icon={faArrowLeft}
              to={{name: routeNames.__model_graphql_case__List}}
            />
            <div>
              <AdminHeaderTitle>{title.value}</AdminHeaderTitle>
            </div>
          </div>
        </AdminHeader>
        <AdminBody>
          <AdminForm class="m-auto max-w-500 s750:pt-6" submit={form.submit}>
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
                case "textarea":
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
          <BtnSubmit class="mt-6">
            {route.params.id === "new" ? "Create" : "Save"}
          </BtnSubmit>
          {
            form.fieldsNotInDomWithErrors.value.map(key => {
              return <p class='border border-red-600 bg-red-100 px-4 py-3 rounded text-red-800 text-sm mt-4' key={name}>
                <strong class="font-bold">Error "{key}" field:</strong> {form.errors[key].join(', ')}
              </p>
            })
          }
          {
            serverError.value &&
            <p class='border border-red-600 bg-red-100 px-4 py-3 rounded text-red-800 text-sm mt-4'>
              <strong class="font-bold">Error:</strong> {serverError.value}
            </p>
          }
        </AdminForm>
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