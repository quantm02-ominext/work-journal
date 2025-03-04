'use client'

import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import Form from 'next/form'
import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { schema, signup } from './actions'

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
			<Field label="Email" required>
				<Input type="email" placeholder="Enter your email" className="h-10" />
			</Field>

			<Field label="Password" required>
				<Input
					type="password"
					placeholder="Create a strong password"
					className="h-10"
				/>
			</Field>

			<Field label="Confirm Password" required>
				<Input
					type="password"
					placeholder="Confirm your password"
					className="h-10"
				/>
			</Field>

			<Button className="w-full" size={'lg'}>
				Create Account
			</Button>
		</Form>
	)
}
