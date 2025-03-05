'use client'

import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import Form from 'next/form'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getFieldProps, getInputProps } from '@/lib/form'

import { signup } from './actions'
import { schema } from './schema'

export const SignUpForm = () => {
	const [lastResult, action] = useActionState(signup, undefined)
	const [form, fields] = useForm({
		lastResult,
		constraint: getZodConstraint(schema),
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
	})

	return (
		<Form className="space-y-4" action={action} {...getFormProps(form)}>
			<Field label="Email" {...getFieldProps(fields.email)}>
				<Input
					placeholder="Enter your email"
					className="h-10"
					{...getInputProps(fields.email, { type: 'email' })}
				/>
			</Field>

			<Field label="Password" {...getFieldProps(fields.password)}>
				<Input
					placeholder="Create a strong password"
					className="h-10"
					{...getInputProps(fields.password, { type: 'password' })}
				/>
			</Field>

			<Field
				label="Confirm Password"
				{...getFieldProps(fields.confirmPassword)}
			>
				<Input
					placeholder="Confirm your password"
					className="h-10"
					{...getInputProps(fields.confirmPassword, { type: 'password' })}
				/>
			</Field>

			<Button className="w-full" size={'lg'}>
				Create Account
			</Button>
		</Form>
	)
}
