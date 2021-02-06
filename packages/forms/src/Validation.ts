export interface Validation {
  name: string,
  params?: {[key: string]: any},
  fn?: ValidationFnCustom
}

export type ValidationFnCustom = (validation: Validation, params: any, data: any) => string[]
export type ValidationFn = (validation: Validation, params: any, data: any) => boolean