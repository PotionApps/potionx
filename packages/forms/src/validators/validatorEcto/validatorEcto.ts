import { Field } from '../../Field'
import { Validation } from '../../Validation'
import { Validator } from '../Validator'
import * as validatorFunctions from './validatorEctoFunctions'
import validatorMessages from './validatorMessages'

const checkValidation = (validation: Validation, value: any, data: any) : string[] => {
  const name = validation.name as keyof typeof validatorFunctions
  if (validation.fn) {
    return validation.fn(validation, value, data)
  }
  if (validatorFunctions[name] && !validatorFunctions[name](validation, value, data)) {
    return [validatorMessages[name]?.(validation)]
  }
  return []
}

const validatorEcto : Validator = (data, fields) => {
  return fields.reduce((acc: {[key: string]: string[]}, field) => {
    acc[field.name] = validate(field, data)
    return acc
  }, {})
}

const validate = (field: Field, data: any) : string[] => {
  const errors : string[] = []
  if (!field.validations) {
    return errors
  }
  const isOptional = !field.validations.find(v => v.name === "required")
  const value = data[field.name]

  if (isOptional && (value === undefined || value === null || value === "")) {
    return errors
  }
  return field.validations.reduce((acc: string[], validation) => {
    return acc.concat(checkValidation(validation, data[field.name], data))
  }, [])
}

export default validatorEcto