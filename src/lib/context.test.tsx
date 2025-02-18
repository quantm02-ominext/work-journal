/**
 * @vitest-environment jsdom
 */

import { faker } from '@faker-js/faker'
import { renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'

import { createContext } from './context'

interface SetupOptions {
	value: string | undefined
	defaultValue: string | undefined
}

const setup = ({ value, defaultValue }: SetupOptions) => {
	const [TestContextProvider, useTestContext] = createContext({
		hookName: 'useTestContext',
		providerName: 'TestContextProvider',
		defaultValue,
	})

	const TestContextProviderWrapper = ({
		children,
	}: {
		children: React.ReactNode
	}) => {
		return <TestContextProvider value={value}>{children}</TestContextProvider>
	}

	return { TestContextProviderWrapper, useTestContext }
}

test(`useContext can get context value from ContextProvider`, () => {
	const contextValue = faker.word.sample()
	const { TestContextProviderWrapper, useTestContext } = setup({
		value: contextValue,
		defaultValue: undefined,
	})

	const { result } = renderHook(() => useTestContext(), {
		wrapper: TestContextProviderWrapper,
	})

	expect(result.current).toBe(contextValue)
})

test(`useContext should throw an error if context is 'undefined' and strict is 'true'`, () => {
	const { TestContextProviderWrapper, useTestContext } = setup({
		value: undefined,
		defaultValue: undefined,
	})

	let errorMessage: string | null = null

	try {
		renderHook(() => useTestContext(), {
			wrapper: TestContextProviderWrapper,
		})
	} catch (error) {
		errorMessage = (error as Error).message
	}

	expect(errorMessage).toMatchInlineSnapshot(
		`"useTestContext must be used inside TestContextProvider"`,
	)
})

test(`useContext should return undefined if context is 'undefined' and strict is 'false'`, () => {
	const { TestContextProviderWrapper, useTestContext } = setup({
		value: undefined,
		defaultValue: undefined,
	})

	const { result } = renderHook(() => useTestContext(false), {
		wrapper: TestContextProviderWrapper,
	})
	expect(result.current).toBeUndefined()
})

test(`useContext should return defaultValue if context is 'undefined' and defaultValue is provided`, () => {
	const defaultValue = faker.word.sample()
	const { useTestContext } = setup({
		value: undefined,
		defaultValue: defaultValue,
	})

	const { result } = renderHook(() => useTestContext())
	expect(result.current).toBe(defaultValue)
})
