import { Validation } from "./Validation";

export interface Field {
  label?: string,
  name: string,
  options?: any[]
  type?: string,
  validations?: Validation[]
}