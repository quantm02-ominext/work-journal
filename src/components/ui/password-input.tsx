import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

import { useControllableState } from '@/hooks/use-controllable-state'

import { Button } from './button'
import { Input, type InputProps } from './input'

export interface PasswordInputProps extends Omit<InputProps, 'endElement'> {
	visible?: boolean
	onVisibleChange?: (visible: boolean) => void
	defaultVisible?: boolean
}

export const PasswordInput = React.forwardRef<
	HTMLInputElement,
	PasswordInputProps
>(
	(
		{
			defaultVisible = false,
			visible: controlledVisible,
			onVisibleChange,
			disabled,
			...inputProps
		},
		ref,
	) => {
		const [visible, setVisible] = useControllableState({
			defaultValue: defaultVisible,
			value: controlledVisible,
			onChange: onVisibleChange,
		})

		const icon = visible ? <EyeOff /> : <Eye />
		const label = visible ? 'hide password' : 'show password'

		let endElement: React.ReactNode = (
			<Button
				type="button"
				variant={'ghost'}
				size={'icon'}
				onClick={() => setVisible(!visible)}
				aria-label={label}
			>
				{icon}
			</Button>
		)

		if (disabled) {
			endElement = null
		}

		return (
			<Input
				ref={ref}
				{...inputProps}
				type={visible ? 'text' : 'password'}
				endElement={endElement}
			/>
		)
	},
)
PasswordInput.displayName = 'PasswordInput'
