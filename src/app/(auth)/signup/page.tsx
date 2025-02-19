import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function Signup() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<main className="w-full space-y-6 sm:max-w-sm">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold">Create an account</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email and password to create your account
					</p>
				</div>

				<form className="space-y-4">
					<Field label="Email" required>
						<Input
							type="email"
							placeholder="Enter your email"
							className="h-10"
						/>
					</Field>

					<Field label="Password" required>
						<Input
							type="password"
							placeholder="Create a strong password"
							className="h-10"
						/>
					</Field>

					<Field label="Confirm Password" required>
						<Input
							type="password"
							placeholder="Confirm your password"
							className="h-10"
						/>
					</Field>

					<Button className="w-full" size={'lg'}>
						Create Account
					</Button>
				</form>

				<p className="px-8 text-center text-sm text-muted-foreground">
					Already have an account?{' '}
					<Link href={'/login'} className="underline underline-offset-4">
						Sign in
					</Link>
				</p>
			</main>
		</div>
	)
}
