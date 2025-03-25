/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'

import { PasswordInput } from './password-input'

test('PasswordInput supports uncontrolled visible state', async () => {
	render(<PasswordInput aria-label="test-input" defaultVisible />)

	const input = screen.getByLabelText(/test-input/i)
	expect(input).toHaveAttribute('type', 'text')

	const hidePasswordBtn = screen.getByRole('button', {
		name: /hide password/,
	})
	await userEvent.click(hidePasswordBtn)

	expect(input).toHaveAttribute('type', 'password')

	const showPasswordBtn = screen.getByRole('button', {
		name: /show password/,
	})
	await userEvent.click(showPasswordBtn)

	expect(input).toHaveAttribute('type', 'text')
})

const ComponentUnderTest = () => {
	const [visible, setVisible] = useState(true)

	return (
		<>
			<PasswordInput
				aria-label="test-input"
				visible={visible}
				onVisibleChange={setVisible}
			/>
			{visible ? <span>visible</span> : null}
		</>
	)
}

test('PasswordInput supports controlled visible state', async () => {
	render(<ComponentUnderTest />)

	const input = screen.getByLabelText(/test-input/i)
	expect(input).toHaveAttribute('type', 'text')
	expect(screen.getByText('visible')).toBeInTheDocument()

	const hidePasswordBtn = screen.getByRole('button', {
		name: /hide password/,
	})
	await userEvent.click(hidePasswordBtn)

	expect(input).toHaveAttribute('type', 'password')
	expect(screen.queryByText('visible')).not.toBeInTheDocument()

	const showPasswordBtn = screen.getByRole('button', {
		name: /show password/,
	})
	await userEvent.click(showPasswordBtn)

	expect(input).toHaveAttribute('type', 'text')
	expect(screen.getByText('visible')).toBeInTheDocument()
})

test(`PasswordInput should hide toggle visible button when it's disabled`, async () => {
	render(<PasswordInput aria-label="test-input" disabled />)

	expect(
		screen.queryByRole('button', { name: /show password/ }),
	).not.toBeInTheDocument()
})
