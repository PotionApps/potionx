import { ValidatorFunction } from "../Validator";

export const emailFormat : ValidatorFunction = (validation, value, data) => {
  if (typeof value !== "string") return false
  return (new RegExp("^[A-Za-z0-9\._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$")).test(value)
}

export const exclusion : ValidatorFunction = (validation, value, data) => {
  return !validation.params!.values.includes(value)
}

export const format : ValidatorFunction = (validation, value, data) => {
  if (typeof value !== "string") return false
  return (new RegExp(validation.params!.pattern)).test(value)
}

export const inclusion : ValidatorFunction = (validation, value, data) => {
  return validation.params!.values.includes(value)
}

export const length : ValidatorFunction = (validation, value, data) => {
  if (typeof value !== "string" && !Array.isArray(value)) return false

  return Object.keys(validation.params!)
    .reduce((valid: boolean, key) => {
      switch (key) {
        case "is":
          return value.length === validation.params![key] && valid
        case "max":
          return value.length <= validation.params![key] && valid
        case "min":
          return value.length >= validation.params![key] && valid
      }
      return valid
    }, true)
}

export const number : ValidatorFunction = (validation, value, data) => {
  if (typeof value !== "number") return false

  return Object.keys(validation.params!)
    .reduce((valid: boolean, key) => {
      switch (key) {
        case "less_than":
          return value < validation.params![key] && valid
        case "greater_than":
          return value > validation.params![key] && valid
        case "less_than_or_equal_to":
          return value <= validation.params![key] && valid
        case "greater_than_or_equal_to":
          return value >= validation.params![key] && valid
        case "equal_to":
          return value === validation.params![key]
        case "not_equal_to":
          return value === validation.params![key]
      }
      return valid
    }, true)
}

export const required : ValidatorFunction = (validation, value, data) => {
  if (Array.isArray(value)) return !!value.length
  return value !== undefined && value !== null && value !== ""
}

export const subset : ValidatorFunction = (validation, value, data) => {
  return Array.isArray(value) && value.every(v => validation.params!.values.includes(v))
}