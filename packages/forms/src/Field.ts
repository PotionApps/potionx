import { Validation } from "./validators/Validator";

export interface Field {
  name: string,
  type: string,
  validations?: Validation[]
}