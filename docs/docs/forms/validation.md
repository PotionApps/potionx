# Validation

The ```@potionapps/forms``` package includes a ```ValidatorEcto``` module by default which contains validation rules meant to work with Ecto. The validation rules have the same names as [Ecto validation rules](https://hexdocs.pm/ecto/Ecto.Changeset.html), but in camel case.

The useForm hook accepts a ```fields``` argument which accepts fields in the form:
```tsx
export interface Field {
  label?: string,
  name: string,
  options?: any[]
  type?: string,
  validations?: Validation[]
}
```

Where a ```Validation``` is defined as:

```tsx
export interface Validation {
  name: string,
  params?: {[key: string]: any},
  fn?: ValidationFnCustom
}

export type ValidationFnCustom = (validation: Validation, params: any, data: any) => string[]
export type ValidationFn = (validation: Validation, params: any, data: any) => boolean
```

Example of a set of fields for use in ```useForm```:
```json
[
  {
    "name": "deletedAt",
    "type": "utc_datetime",
    "validations": []
  },
  {
    "name": "email",
    "type": "string",
    "validations": [
      {
        "name": "email"
      },
      {
        "name": "email"
      }
    ]
  },
  {
    "name": "roles",
    "options": [
      "admin",
      "guest"
    ],
    "type": "checkbox",
    "validations": [
      {
        "name": "roles",
        "params": {
          "values": [
            "admin",
            "guest"
          ]
        }
      }
    ]
  }
]
```

## Custom Validator
If you'd like to use a validator other than ```ValidatorEcto```, the ```useForm``` hook accepts a ```validator``` argument that will be used to validate your data. 

Your validator must adhere to the validator convention:
```tsx
export type Validator = (data: object, fields: Field[]) => {[key: string]: string[]}
```




