import {
	type Context,
	createContext as createReactContext,
	type Provider,
	useContext as useReactContext,
} from 'react'

export interface CreateContextOptions<T> {
	defaultValues?: T
	hookName?: string
	providerName?: string
	strict?: boolean
}

export function createContext<T>(
	options?: CreateContextOptions<T> & { strict: false },
): readonly [
	Provider<T | undefined>,
	() => T | undefined,
	Context<T | undefined>,
]

export function createContext<T>(
	options?: CreateContextOptions<T>,
): readonly [Provider<T>, () => T, Context<T>]

/**
 * Creates a context and its associated provider and hook.
 *
 * @param options - The options for creating the context.
 * @param options.defaultValues - The default values for the context.
 * @param options.hookName - The name of the hook function. Defaults to "useContext".
 * @param options.providerName- The name of the provider component. Defaults to "ContextProvider".
 * @param options.strict- If `true`, throws an error when the context is undefined
 * @returns An array containing the provider component, the hook function, and the context object.
 */
export function createContext<T>({
	defaultValues,
	hookName = 'useContext',
	providerName = 'ContextProvider',
	strict = true,
}: CreateContextOptions<T> = {}) {
	const Context = createReactContext(defaultValues)
	Context.displayName = providerName

	const ContextProvider = Context.Provider

	const useContext = () => {
		const context = useReactContext(Context)

		if (context === undefined && strict) {
			throw new Error(`${hookName} must be used inside ${providerName}`)
		}

		return context
	}

	return [ContextProvider, useContext, Context] as const
}
