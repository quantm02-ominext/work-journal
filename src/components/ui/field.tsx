'use client'

import * as React from 'react'

import { useElementIds } from '@/hooks/use-element-ids'
import { createContext } from '@/lib/context'
import { boolAttr, cn, combineEventHandlers } from '@/lib/utils'

import { Input as InputPrimitive } from './input'

/* -------------------------------------------------------------------------- */
/*                                  UseField                                  */
/* -------------------------------------------------------------------------- */

interface ElementIds {
	control?: string
	helperText?: string
	errorText?: string
}

interface UseFieldProps {
	elementIds?: ElementIds
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	error?: React.ReactNode
}

const useField = ({
	disabled,
	elementIds: overridingElementIds,
	error,
	required,
	readOnly,
}: UseFieldProps) => {
	const [focused, setFocused] = React.useState(false)

	const invalid = Boolean(error)

	const elementIds = useElementIds('field', ['helperText', 'errorText'], {
		...overridingElementIds,
		id: overridingElementIds?.control,
	})

	const fieldStateProps = {
		'data-required': boolAttr(required),
		'data-disabled': boolAttr(disabled),
		'data-readonly': boolAttr(readOnly),
		'data-invalid': boolAttr(invalid),
		'data-focused': boolAttr(focused),
	}

	const labelProps = {
		htmlFor: elementIds.id,
		...fieldStateProps,
	} satisfies React.ComponentPropsWithoutRef<'label'>

	const getControlProps = ({
		onFocus,
		onBlur,
	}: React.ComponentPropsWithoutRef<'input'> = {}) => {
		return {
			id: elementIds.id,
			'aria-invalid': boolAttr(invalid),
			'aria-describedby': invalid
				? elementIds.errorText
				: elementIds.helperText,
			disabled,
			required,
			readOnly,
			onFocus: combineEventHandlers(onFocus, () => setFocused(true)),
			onBlur: combineEventHandlers(onBlur, () => setFocused(false)),
			...fieldStateProps,
		} satisfies React.ComponentPropsWithoutRef<'input'>
	}

	const helperTextProps = {
		id: elementIds.helperText,
		...fieldStateProps,
	} satisfies React.ComponentPropsWithoutRef<'p'>

	const errorTextProps = {
		id: elementIds.errorText,
		...fieldStateProps,
	} satisfies React.ComponentPropsWithoutRef<'p'>

	return {
		labelProps,
		getControlProps,
		helperTextProps,
		errorTextProps,
		required,
		disabled,
		error,
		readOnly,
		focused,
	}
}

type UseFieldReturn = ReturnType<typeof useField>

/* -------------------------------------------------------------------------- */
/*                                FieldContext                                */
/* -------------------------------------------------------------------------- */

type FieldContextProps = UseFieldReturn

const [FieldContextProvider, useFieldContext] =
	createContext<FieldContextProps>({
		hookName: 'useFieldContext',
		providerName: 'FieldContextProvider',
	})

/* -------------------------------------------------------------------------- */
/*                                  FieldRoot                                 */
/* -------------------------------------------------------------------------- */

interface FieldRootProps
	extends UseFieldProps,
		React.ComponentPropsWithRef<'div'> {}

const FieldRoot = ({
	elementIds,
	required,
	disabled,
	error,
	children,
	readOnly,
	className,
	...props
}: FieldRootProps) => {
	const field = useField({
		disabled,
		error,
		required,
		readOnly,
		elementIds,
	})

	return (
		<FieldContextProvider value={field}>
			<div className={cn('flex flex-col gap-2', className)} {...props}>
				{children}
			</div>
		</FieldContextProvider>
	)
}

/* -------------------------------------------------------------------------- */
/*                                 FieldLabel                                 */
/* -------------------------------------------------------------------------- */

type FieldLabelProps = React.ComponentPropsWithRef<'label'>

const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
	const {
		labelProps: { htmlFor, ...labelProps },
	} = useFieldContext()

	return (
		<label
			htmlFor={htmlFor}
			{...labelProps}
			{...props}
			className={cn(
				'inline-flex gap-1 text-sm font-medium leading-none',
				className,
			)}
		/>
	)
}

/* -------------------------------------------------------------------------- */
/*                           FieldRequiredIndicator                           */
/* -------------------------------------------------------------------------- */

interface FieldRequiredIndicatorProps
	extends React.ComponentPropsWithRef<'span'> {
	fallback?: React.ReactNode
}

const FieldRequiredIndicator = ({
	fallback,
	className,
	...props
}: FieldRequiredIndicatorProps) => {
	const { required } = useFieldContext()

	if (required) {
		return (
			<span className={cn('text-red-500', className)} {...props}>
				{fallback ?? '*'}
			</span>
		)
	}

	return null
}

/* -------------------------------------------------------------------------- */
/*                                 FieldInput                                 */
/* -------------------------------------------------------------------------- */

type FieldInputProps = React.ComponentPropsWithRef<typeof InputPrimitive>

const FieldInput = ({ onFocus, onBlur, ...props }: FieldInputProps) => {
	const { getControlProps } = useFieldContext()

	return <InputPrimitive {...getControlProps({ onFocus, onBlur })} {...props} />
}

/* -------------------------------------------------------------------------- */
/*                               FieldHelperText                              */
/* -------------------------------------------------------------------------- */

type FieldHelperTextProps = React.ComponentPropsWithRef<'p'>

const FieldHelperText = ({ className, ...props }: FieldHelperTextProps) => {
	const { helperTextProps } = useFieldContext()

	return (
		<p
			{...helperTextProps}
			{...props}
			className={cn('text-xs text-muted-foreground', className)}
		/>
	)
}

/* -------------------------------------------------------------------------- */
/*                               FieldErrorText                               */
/* -------------------------------------------------------------------------- */

type FieldErrorTextProps = React.ComponentPropsWithRef<'p'>

const FieldErrorText = ({ className, ...props }: FieldErrorTextProps) => {
	const { errorTextProps, error } = useFieldContext()

	if (error) {
		return (
			<p
				{...errorTextProps}
				{...props}
				className={cn(
					'inline-flex items-center gap-1 text-xs font-medium text-destructive',
					className,
				)}
			>
				{error}
			</p>
		)
	}

	return null
}

/* -------------------------------------------------------------------------- */
/*                                    Field                                   */
/* -------------------------------------------------------------------------- */

interface FieldProps extends Omit<FieldRootProps, 'children'> {
	label?: React.ReactNode
	helperText?: React.ReactNode
	children?: React.ReactNode
	error?: React.ReactNode
}

const Field = ({ label, helperText, children, ...rootProps }: FieldProps) => {
	return (
		<FieldRoot {...rootProps}>
			<FieldLabel>
				{label}
				<FieldRequiredIndicator />
			</FieldLabel>

			{children}

			<FieldHelperText>{helperText}</FieldHelperText>
			<FieldErrorText />
		</FieldRoot>
	)
}

export {
	FieldErrorText as ErrorText,
	Field,
	FieldHelperText as HelperText,
	FieldInput as Input,
	FieldLabel as Label,
	FieldRequiredIndicator as RequiredIndicator,
	FieldRoot as Root,
	useField,
	useFieldContext,
}

export type {
	ElementIds,
	FieldContextProps,
	FieldErrorTextProps,
	FieldHelperTextProps,
	FieldInputProps,
	FieldLabelProps,
	FieldProps,
	FieldRequiredIndicatorProps,
	FieldRootProps,
	UseFieldProps,
	UseFieldReturn,
}
