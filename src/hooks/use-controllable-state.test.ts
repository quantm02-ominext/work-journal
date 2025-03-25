/**
 * @vitest-environment jsdom
 */

import { faker } from '@faker-js/faker'
import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'

import { useControllableState } from './use-controllable-state'

test('useControllableState supports uncontrolled state', async () => {
	const defaultValue = faker.string.sample()
	const onChange = vi.fn()

	const { result } = renderHook(() =>
		useControllableState({
			defaultValue,
			onChange,
		}),
	)
	expect(result.current[0]).toBe(defaultValue)

	const newValue = faker.string.sample()
	act(() => result.current[1](newValue))

	expect(result.current[0]).toBe(newValue)
	expect(onChange).toHaveBeenCalledTimes(1)
	expect(onChange).toHaveBeenCalledWith(newValue)
})

const useTestControllableState = (
	defaultControlledValue: string,
	onChange: (value: string) => void,
) => {
	const [controlledValue, setControlledValue] = useState(defaultControlledValue)

	const [controllableStateValue, setControllableStateValue] =
		useControllableState({
			value: controlledValue,
			onChange: (nextValue) => {
				setControlledValue(nextValue)
				onChange(nextValue)
			},
		})

	return {
		controlledValue,
		controllableStateValue,
		setControlledValue: setControlledValue,
		setControllableStateValue,
	}
}

test('useControllableState supports controlled state', async () => {
	const defaultValue = faker.string.sample()
	const onChange = vi.fn()
	const { result } = renderHook(() =>
		useTestControllableState(defaultValue, onChange),
	)

	expect(result.current.controllableStateValue).toBe(defaultValue)

	const newControlledValue = faker.string.sample()
	act(() => result.current.setControlledValue(newControlledValue))

	expect(onChange).toHaveBeenCalledTimes(0)
	expect(result.current.controllableStateValue).toBe(newControlledValue)

	const newValue = faker.string.sample()
	act(() => result.current.setControllableStateValue(newValue))

	expect(onChange).toHaveBeenCalledTimes(1)
	expect(result.current.controlledValue).toBe(newValue)
	expect(result.current.controllableStateValue).toBe(newValue)
})
