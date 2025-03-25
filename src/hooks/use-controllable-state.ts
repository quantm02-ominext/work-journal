import { useState } from 'react'

export interface UseControllableStateProps<T> {
	defaultValue?: T | (() => T)
	value?: T
	onChange?: (nextValue: T) => void
}

export const useControllableState = <T>({
	defaultValue,
	value: controlledValue,
	onChange,
}: UseControllableStateProps<T> = {}) => {
	const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(
		defaultValue,
	)

	const controlled = controlledValue !== undefined
	const value = controlled ? controlledValue : uncontrolledValue

	const setValue = (nextValue: T | ((previousValue: T) => T)) => {
		const _nextValue = isCallback(nextValue) ? nextValue(value as T) : nextValue

		if (controlled === false) {
			setUncontrolledValue(_nextValue)
		}

		if (value !== _nextValue) {
			onChange?.(_nextValue)
		}
	}

	return [value, setValue] as const
}

const isCallback = <T>(
	nextValue: T | ((previousValue: T) => T),
): nextValue is (previousValue: T) => T => {
	return typeof nextValue === 'function'
}
