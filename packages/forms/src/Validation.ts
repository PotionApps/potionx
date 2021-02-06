export interface Validation {
  name: string,
  params?: {[key: string]: any},
  fn?: ValidationFn
}
export type ValidationFn = (validation: Validation, params: any, data: any) => boolean