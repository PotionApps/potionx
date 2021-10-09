import { Validation } from "./Validation";

export interface Field {
  label?: string,
  name: string,
  options?: any[]
  placeholder?: string
  type?: string,
  validations?: Validation[]
}