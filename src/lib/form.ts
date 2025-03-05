import {
	type FieldMetadata,
	getInputProps as getConformInputProps,
} from '@conform-to/react'

import { type FieldProps } from '@/components/ui/field'

export const getFieldProps = (field: FieldMetadata) => {
	return {
		error: field.errors?.at(0),
		required: field.required,
	} satisfies FieldProps
}

export type GetInputPropsOptions = Parameters<typeof getConformInputProps>[1]

export const getInputProps = (
	field: FieldMetadata,
	options: GetInputPropsOptions,
) => {
	// Omit id and required as they're already handled by Field component
	const { id, required, ...inputProps } = getConformInputProps(field, {
		...options,
		ariaAttributes: false,
	})

	return inputProps satisfies React.ComponentPropsWithoutRef<'input'>
}
