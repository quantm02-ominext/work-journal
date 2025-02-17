/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { useId } from 'react'
import { expect, test, vi } from 'vitest'

import { useElementIds } from './use-element-ids'

vi.mock('react', async (importOriginal) => {
	return {
		...(await importOriginal()),
		useId: vi.fn(),
	}
})

test('useElementIds should generate unique IDs for each part', () => {
	const RANDOM_ID = 'randomId'
	vi.mocked(useId).mockImplementation(() => RANDOM_ID)

	const scope = 'field'
	const parts = ['root', 'label'] as const
	const { result } = renderHook(() => useElementIds(scope, parts))

	expect(result.current.id).toBe(RANDOM_ID)
	parts.forEach((part) => {
		expect(result.current[part]).toBe(`${scope}-${RANDOM_ID}-${part}`)
	})
})

test(`useElementIds can overrides ID of each part`, () => {
	const scope = 'field'
	const parts = ['root', 'label'] as const
	const overrides = {
		id: 'my-id',
		root: 'root-id',
		label: 'label-id',
	}
	const { result } = renderHook(() => useElementIds(scope, parts, overrides))

	expect(result.current.id).toBe(overrides.id)
	parts.forEach((part) => {
		expect(result.current[part]).toBe(overrides[part])
	})
})
