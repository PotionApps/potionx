import { Validation } from "../../Validation";

export default {
  exclusion: (validation: Validation) => `This field should not be one of: ${validation.params!.values.join(',')}`,
  format: (validation: Validation) => `This field should match pattern: ${validation.params!.pattern}`,
  inclusion: (validation: Validation) => `This field should be one of: ${validation.params!.values.join(',')}`,
  length: (validation: Validation) => {
    if (validation.params!.is) {
      `This field should have length: ${validation.params!.is}` 
    }
    const minMax : string[] = []
    if (typeof validation.params!.min === 'number') {
      minMax.push(
        `more than or equal to ${validation.params!.min}` 
      )
    }
    if (typeof validation.params!.max === 'number') { 
      minMax.push(
        `less than or equal to ${validation.params!.max}` 
      )
    }
    return `This field should be: ${minMax.join(' and ')}`
  },
  number: (validation: Validation) => {
    return "The field should be: " + 
      Object.keys(validation.params!)
      .reduce((acc: string[], key) => {
        switch (key) {
          case "less_than":
            acc.push(`less than ${validation.params![key]}`)
            break;
          case "greater_than":
            acc.push(`greater than ${validation.params![key]}`)
            break;
          case "less_than_or_equal_to":
            acc.push(`less than or equal to ${validation.params![key]}`)
            break;
          case "greater_than_or_equal_to":
            acc.push(`greater than or equal to ${validation.params![key]}`)
            break;
          case "equal_to":
            acc.push(`equal to ${validation.params![key]}`)
            break;
          case "not_equal_to":
            acc.push(`not equal to ${validation.params![key]}`)
            break;
        }
        return acc
      }, []).join(' and ')
  },
  required: (validation: Validation) => "This field is required",
  subset: (validation: Validation) => `This field should contain a subset of: ${validation.params!.values.join(',')}`
}