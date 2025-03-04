'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export const schema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Email is invalid'),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, 'Password must be at least 8 characters long')
			.regex(
				/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export const signup = (_: unknown, formData: FormData) => {
	const submission = parseWithZod(formData, {
		schema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	redirect('/')
}
