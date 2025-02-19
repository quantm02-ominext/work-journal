import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const GoogleIcon = () => {
	return (
		<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<title>Google</title>
			<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
		</svg>
	)
}

const GithubIcon = () => {
	return (
		<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<title>GitHub</title>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	)
}

export default function Login() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<main className="w-full space-y-6 sm:max-w-sm">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-semibold">Welcome back</h1>
					<p className="text-sm text-muted-foreground">
						Enter your credentials to sign in to your account
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
							placeholder="Enter your password"
							className="h-10"
						/>
					</Field>

					<Button className="w-full" size={'lg'}>
						Sign in
					</Button>
				</form>

				<div className="relative">
					<Separator />
					<p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">
						Or continue with
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<Button variant={'outline'} size={'lg'}>
						<GoogleIcon />
						Google
					</Button>
					<Button variant={'outline'} size={'lg'}>
						<GithubIcon />
						Github
					</Button>
				</div>

				<p className="px-8 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{' '}
					<Link href={'/signup'} className="underline underline-offset-4">
						Sign up
					</Link>
				</p>
			</main>
		</div>
	)
}
