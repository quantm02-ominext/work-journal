/**
 * @vitest-environment jsdom
 */

import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { z } from 'zod'

import { getFieldProps, getInputProps } from './form'

const getTestField = () => {
	const schema = z.object({
		testField: z.string(),
	})

	const { result } = renderHook(() =>
		useForm({
			constraint: getZodConstraint(schema),
			onValidate({ formData }) {
				return parseWithZod(formData, { schema })
			},
		}),
	)

	const [, fields] = result.current

	return fields.testField
}

test(`getFieldProps should return correct Field props`, () => {
	const field = getTestField()
	const fieldProps = getFieldProps(field)

	expect(fieldProps.required).toBe(field.required)
	expect(fieldProps.error).toBe(field.errors?.at(0))
})

test(`getInputProps should return correct input props`, () => {
	const field = getTestField()
	const TYPE = 'text'
	const fieldProps = getInputProps(field, { type: TYPE })

	expect(fieldProps).toEqual({
		name: field.name,
		form: field.formId,
		type: TYPE,
	})
})
