'use client'

import { type FieldMetadata } from '@conform-to/react'
import * as React from 'react'

import { useElementIds } from '@/hooks/use-element-ids'
import { createContext } from '@/lib/context'
import { boolAttr, cn, combineEventHandlers } from '@/lib/utils'

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
	invalid?: boolean
}

const useField = ({
	disabled,
	elementIds: overridingElementIds,
	required,
	invalid,
	readOnly,
}: UseFieldProps) => {
	const [focused, setFocused] = React.useState(false)

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
		invalid,
		readOnly,
		focused,
	}
}

type UseFieldReturn = ReturnType<typeof useField>

/* -------------------------------------------------------------------------- */
/*                                FieldContext                                */
/* -------------------------------------------------------------------------- */

type FieldContextProps = UseFieldReturn & {
	field?: FieldMetadata
}

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
	children,
	readOnly,
	className,
	invalid,
	...props
}: FieldRootProps) => {
	const fieldContext = useField({
		disabled,
		required,
		readOnly,
		elementIds,
		invalid,
	})

	return (
		<FieldContextProvider value={fieldContext}>
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
	const { errorTextProps, invalid } = useFieldContext()

	if (invalid) {
		return (
			<p
				{...errorTextProps}
				{...props}
				className={cn(
					'inline-flex items-center gap-1 text-xs font-medium text-destructive',
					className,
				)}
			/>
		)
	}

	return null
}

/* -------------------------------------------------------------------------- */
/*                                    Field                                   */
/* -------------------------------------------------------------------------- */

interface FieldProps extends Omit<FieldRootProps, 'children' | 'invalid'> {
	label?: React.ReactNode
	helperText?: React.ReactNode
	children?: React.ReactNode
	error?: React.ReactNode
}

const Field = ({
	label,
	helperText,
	children,
	error,
	...rootProps
}: FieldProps) => {
	return (
		<FieldRoot {...rootProps} invalid={Boolean(error)}>
			<FieldLabel>
				{label}
				<FieldRequiredIndicator />
			</FieldLabel>

			{children}

			<FieldHelperText>{helperText}</FieldHelperText>
			<FieldErrorText>{error}</FieldErrorText>
		</FieldRoot>
	)
}

export {
	FieldErrorText as ErrorText,
	Field,
	FieldHelperText as HelperText,
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
	FieldLabelProps,
	FieldProps,
	FieldRequiredIndicatorProps,
	FieldRootProps,
	UseFieldProps,
	UseFieldReturn,
}
