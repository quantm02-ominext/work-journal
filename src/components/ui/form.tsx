'use client'

import { type Submission, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import NextForm, { type FormProps as NextFormProps } from 'next/form'
import { type z } from 'zod'

export type UseFormOptions<
	Schema extends z.ZodTypeAny,
	FormValue,
	FormError,
> = Parameters<typeof useForm<Schema, FormValue, FormError>>[0]

export type FormProps<
	Schema extends z.ZodTypeAny,
	FormValue = Schema,
	FormError = string[],
	FormOptions extends UseFormOptions<
		Schema,
		FormValue,
		FormError
	> = UseFormOptions<Schema, FormValue, FormError>,
> = Omit<NextFormProps, 'onSubmit' | 'defaultValue' | 'children'> &
	Omit<FormOptions, 'constraint'> & {
		schema: Schema
		children: (
			...[form, field]: ReturnType<typeof useForm<Schema, FormValue, FormError>>
		) => React.ReactNode
	}

export const Form = <
	Schema extends z.ZodTypeAny,
	FormValue = Schema,
	FormError = string[],
	FormOptions extends UseFormOptions<
		Schema,
		FormValue,
		FormError
	> = UseFormOptions<Schema, FormValue, FormError>,
>({
	id,
	lastResult,
	defaultValue,
	shouldValidate,
	shouldRevalidate,
	shouldDirtyConsider,
	onValidate,
	onSubmit,
	defaultNoValidate,
	schema,
	children,
	...formProps
}: FormProps<Schema, FormValue, FormError, FormOptions>) => {
	const [form, fields] = useForm({
		constraint: getZodConstraint(schema),
		onValidate(context) {
			onValidate?.(context)

			return parseWithZod(context.formData, { schema }) as Submission<
				Schema,
				FormError,
				FormValue
			>
		},

		id,
		lastResult,
		defaultValue,
		shouldValidate,
		shouldRevalidate,
		shouldDirtyConsider,
		onSubmit,
		defaultNoValidate,
	}) as ReturnType<typeof useForm<Schema, FormValue, FormError>>

	return <NextForm {...formProps}>{children(form, fields)}</NextForm>
}
