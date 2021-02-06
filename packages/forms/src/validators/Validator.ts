import { Field } from "../Field";
import { Validation } from "../Validation";

export type Validator = (data: object, fields: Field[]) => {[key: string]: string[]}
export type ValidatorFunction = (validation: Validation, value: any, data: object) => boolean