'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'

import { schema } from './schema'

export const login = async (_: unknown, formData: FormData) => {
	const submission = parseWithZod(formData, {
		schema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
	}

	redirect('/')
}
