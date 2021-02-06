import { Field } from "../../Field"
import validatorEcto from './validatorEcto'
import validatorMessages from "./validatorMessages"

const fields : Field[] = [
  {
    name: "exclusion",
    type: "text",
    validations: [
      {
        name: "exclusion",
        params: {
          values: ["bad"]
        }
      }
    ]
  },
  {
    name: "format",
    type: "text",
    validations: [
      {
        name: "format",
        params: {
          pattern: "^[A-Za-z0-9\._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$"
        }
      }
    ]
  },
  {
    name: "inclusion",
    type: "text",
    validations: [
      {
        name: "inclusion",
        params: {
          values: ["good"]
        }
      }
    ]
  },
  {
    name: "length",
    type: "text",
    validations: [
      {
        name: "length",
        params: {
          max: 5,
          min: 2
        }
      }
    ]
  },
  {
    name: "number",
    type: "text",
    validations: [
      {
        name: "number",
        params: {
          greater_than_or_equal_to: 1,
          less_than_or_equal_to: 10
        }
      }
    ]
  },
  {
    name: "required",
    type: "text",
    validations: [{
      name: 'required'
    }]
  },
  {
    name: "subset",
    type: "text",
    validations: [{
      name: "subset",
      params: {
        values: ["good", "better"]
      }
    }]
  }
]

test('Properly outputs errors for fields', () => {
  const data = {
    exclusion: "bad",
    format: "bad",
    inclusion: "bad",
    length: "a",
    number: 20,
    required: undefined,
    subset: ["bad"]
  }
  expect(
    validatorEcto(data, fields)
  ).toEqual(
    fields.reduce((acc: any, field) => {
      acc[field.name] = [validatorMessages[field.name as keyof typeof validatorMessages](field.validations![0])]
      return acc
    }, {})
  )
})

test('Properly passes tests for fields', () => {
  const data = {
    exclusion: "good",
    format: "test@example.com",
    inclusion: "good",
    length: "good",
    number: 10,
    required: "good",
    subset: ["good"]
  }
  expect(
    validatorEcto(data, fields)
  ).toEqual(
    fields.reduce((acc: any, field) => {
      acc[field.name] = []
      return acc
    }, {})
  )
})