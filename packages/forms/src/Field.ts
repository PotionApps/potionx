import { Validation } from "./Validation";

export interface Field {
  label?: string,
  name: string,
  type?: string,
  validations?: Validation[]
}