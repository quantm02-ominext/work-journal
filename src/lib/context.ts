import {
	createContext as createReactContext,
	useContext as useReactContext,
} from 'react'

export type InterContextReturn<
	T,
	Strict extends boolean | undefined,
> = Strict extends true | undefined ? T : T | undefined

export interface CreateContextOptions<T> {
	defaultValue?: T
	hookName?: string
	providerName?: string
}

/**
 * Creates a context and its associated provider and hook.
 *
 * @param options - The options for creating the context.
 * @param options.defaultValue - The default value for the context.
 * @param options.hookName - The name of the hook function. Defaults to "useContext".
 * @param options.providerName- The name of the provider component. Defaults to "ContextProvider".
 * @returns An array containing the provider component, the hook function, and the context object.
 */
export function createContext<T>({
	defaultValue,
	hookName = 'useContext',
	providerName = 'ContextProvider',
}: CreateContextOptions<T> = {}) {
	const Context = createReactContext(defaultValue)
	Context.displayName = providerName

	const ContextProvider = Context.Provider

	/**
	 *
	 * @param strict - If `true`, throws an error when the context is undefined. Defaults to "true".
	 */
	const useContext = <const Strict extends boolean | undefined = undefined>(
		strict?: Strict,
	) => {
		const _strict = strict ?? true
		const context = useReactContext(Context)

		if (context === undefined && _strict) {
			throw new Error(`${hookName} must be used inside ${providerName}`)
		}

		return context as InterContextReturn<T, Strict>
	}

	return [ContextProvider, useContext, Context] as const
}
