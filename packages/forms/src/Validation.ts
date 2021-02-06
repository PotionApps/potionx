export interface Validation {
  name: string,
  params?: object,
  fn?: ValidationFn
}
export type ValidationFn = (value: string, params: any, cs: any) => boolean