import { ValidatorFunction } from "../Validator";

export const required : ValidatorFunction = (validation, value, data) => {
  return value !== undefined && value !== null
}

// export const required : ValidatorFunction = (validation, value, data) => {
//   return value !== undefined && value !== null
// }