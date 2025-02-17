import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Composes two event handlers into one, ensuring that the second handler only runs
 * if the first one has not called `e.preventDefault()`, depending on the option.
 *
 * @param originalEventHandler - The original event handler.
 * @param ourEventHandler - The event handler to add.
 * @param options - Options to control event behavior.
 * @param options.checkForDefaultPrevented - Whether to check if default was prevented by the original handler.
 * @returns A composed event handler.
 */
export const combineEventHandlers = <E extends React.SyntheticEvent<unknown>>(
	originalEventHandler?: React.EventHandler<E>,
	ourEventHandler?: React.EventHandler<E>,
	{ checkForDefaultPrevented = true } = {},
) => {
	return (e: E) => {
		originalEventHandler?.(e)

		if (!checkForDefaultPrevented || !e.defaultPrevented) {
			ourEventHandler?.(e)
		}
	}
}

export function boolAttr(value?: boolean) {
	return value ? value : undefined
}
