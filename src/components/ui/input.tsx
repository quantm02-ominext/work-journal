'use client'

import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
	startElement?: React.ReactNode
	endElement?: React.ReactNode
	asChild?: boolean
	startElementProps?: React.ComponentPropsWithoutRef<'div'>
	endElementProps?: React.ComponentPropsWithoutRef<'div'>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			startElement,
			endElement,
			startElementProps,
			endElementProps,
			asChild = false,
			disabled,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : 'input'

		return (
			<div
				className={cn(
					'flex w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring',
				)}
			>
				{startElement && (
					<div
						className={cn(
							'flex min-w-10 shrink-0 items-center justify-center px-3 text-muted-foreground',
							disabled && 'cursor-not-allowed opacity-50',
							startElementProps?.className,
						)}
					>
						{startElement}
					</div>
				)}
				<Comp
					className={cn(
						'flex-1 border-0 bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
						className,
					)}
					ref={ref}
					disabled={disabled}
					{...props}
				/>
				{endElement && (
					<div
						className={cn(
							'flex min-w-10 shrink-0 items-center justify-center px-3 text-muted-foreground',
							disabled && 'cursor-not-allowed opacity-50',
							endElementProps?.className,
						)}
					>
						{endElement}
					</div>
				)}
			</div>
		)
	},
)
Input.displayName = 'Input'

export { Input }
