export interface Validation {
  name: string,
  params?: object,
  optional?: boolean
  fn?: ValidationFn,
  rules?: {
    [key: string]: Validation[]
  }
}
export type ValidationFn = (value: string, params: any, cs: any) => boolean
export type Validator = (data: object, validations: Validation[]) => {[key: string]: string[]}