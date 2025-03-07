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
		confirmPassword: z.string({
			required_error: 'Confirm password is required',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})
