/**
 * @vitest-environment jsdom
 */

import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

test('Home page has Nextjs link', () => {
	render(<Home />)

	expect(
		screen.getByRole('link', {
			name: /^go to nextjs.org/i,
		}),
	).toBeInTheDocument()
})
