import Link from 'next/link'

import { SignUpForm } from './sign-up-form'

export default function Signup() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<main className="w-full space-y-6 sm:max-w-sm">
				<header className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold">Create an account</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email and password to create your account
					</p>
				</header>

				<SignUpForm />

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
