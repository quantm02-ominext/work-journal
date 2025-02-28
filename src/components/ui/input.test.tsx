/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

import { Field, type FieldProps, type ElementIds } from './field'
import { Input } from './input'

test('Input can be rendered outside of Field', async () => {
	render(<Input />)

	expect(screen.getByRole('textbox')).toBeInTheDocument()
})

const ComponentUnderTest = (props: FieldProps) => {
	return (
		<Field label="label" helperText="helper text" {...props}>
			<Input />
		</Field>
	)
}

test('Input / Field should have accessible label and helper text', async () => {
	render(<ComponentUnderTest />)

	const input = screen.getByRole('textbox', {
		name: /label/i,
	})
	await userEvent.click(screen.getByLabelText(/label/i))

	expect(input).toHaveFocus()
	expect(input).toHaveAccessibleDescription(/helper text/i)
})

test('Input / Field should pass required to input and render indicator', async () => {
	render(<ComponentUnderTest required />)

	const input = screen.getByRole('textbox', {
		name: /label/i,
	})
	expect(input).toBeRequired()

	expect(screen.getByText('*')).toBeInTheDocument()
})

test('Input / Field should pass disabled to input', async () => {
	render(<ComponentUnderTest disabled />)

	const input = screen.getByRole('textbox', {
		name: /label/i,
	})
	expect(input).toBeDisabled()
})

test('Input / Field should pass readonly to input', async () => {
	render(<ComponentUnderTest readOnly />)

	const input = screen.getByRole('textbox', {
		name: /label/i,
	})

	expect(input).toHaveAttribute('readonly')
})

test('Input / Field shows accessible error message on error', async () => {
	render(<ComponentUnderTest error="error message" />)

	const input = screen.getByRole('textbox', {
		name: /label/i,
	})

	expect(input).not.toHaveAccessibleDescription(/helper text/i)
	expect(input).toHaveAccessibleDescription(/error message/i)
})

test('Input / Field can override default element IDs', async () => {
	const elementIds = {
		control: 'control',
		helperText: 'helperText',
		errorText: 'errorText',
	} satisfies ElementIds

	render(<ComponentUnderTest error="error message" elementIds={elementIds} />)

	expect(
		screen.getByRole('textbox', {
			name: /label/i,
		}),
	).toHaveAttribute('id', elementIds.control)
	expect(screen.getByText(/helper text/i)).toHaveAttribute(
		'id',
		elementIds.helperText,
	)
	expect(screen.getByText(/error message/i)).toHaveAttribute(
		'id',
		elementIds.errorText,
	)
})
