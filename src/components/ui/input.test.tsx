/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Input } from './input'

test('Input can be rendered outside of Field', async () => {
	render(<Input />)

	expect(screen.getByRole('textbox')).toBeInTheDocument()
})
