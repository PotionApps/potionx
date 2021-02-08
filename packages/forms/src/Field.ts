import { Validation } from "./Validation";

export interface Field {
  name: string,
  type?: string,
  validations?: Validation[]
}