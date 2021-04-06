import { useQuery } from "@urql/vue"
import { computed } from "vue"

export default (model: String) => {
  const res = useQuery({
    query: `
    {
      __type(name: "${model}") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
    `
  })

  return {
    fields: computed(() => {
      return (res.data?.value?.__type?.fields || [])
        .map((f: any) => {
          return {
            ...f,
            label: f.name.replace(/[A-Z]/g, (x: string) => " " + x.toLowerCase())
          }
        })
    })
  }
}